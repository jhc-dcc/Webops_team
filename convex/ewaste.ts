import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Add or update a donor from the protected admin page.
// If the email or phone already exists, the new weight is added to the
// existing total and the waste-type list is merged.
export const addAdminDonor = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    participantType: v.union(
        v.literal("individual"),
        v.literal("organization")
    ),
    organizationName: v.optional(v.string()),
    representativeName: v.optional(v.string()),
    wasteWeight: v.number(),
    wasteTypes: v.array(v.string()),
    submittedAt: v.number(),
    verificationStatus: v.union(
        v.literal("pending"),
        v.literal("verified"),
        v.literal("rejected")
    ),
    verifiedBy: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    const name = args.name.trim();
    const email = args.email.trim().toLowerCase();
    const phone = args.phone.trim();
    const organizationName = args.organizationName?.trim();

    if (!name || !email || !phone) {
      throw new Error("Name, email and phone are required.");
    }

    if (!Number.isFinite(args.wasteWeight) || args.wasteWeight <= 0) {
      throw new Error("Waste weight must be greater than 0 kg.");
    }

    if (args.wasteTypes.length === 0) {
      throw new Error("At least one waste type is required.");
    }

    if (!Number.isFinite(args.submittedAt)) {
      throw new Error("A valid submission time is required.");
    }

    if (
        args.participantType === "organization" &&
        !organizationName
    ) {
      throw new Error(
          "Organization name is required for organization entries."
      );
    }

    const existingByEmail = await ctx.db
        .query("ewasteSubmissions")
        .withIndex("by_email", (query) => query.eq("email", email))
        .first();

    const existingByPhone = await ctx.db
        .query("ewasteSubmissions")
        .withIndex("by_phone", (query) => query.eq("phone", phone))
        .first();

    const existingSubmission =
        existingByEmail ?? existingByPhone;

    const verificationFields =
        args.verificationStatus === "verified"
            ? {
              verificationStatus: "verified" as const,
              verifiedBy: args.verifiedBy ?? "Admin",
              verifiedAt: Date.now(),
            }
            : {
              verificationStatus: args.verificationStatus,
              verifiedBy: undefined,
              verifiedAt: undefined,
            };

    if (existingSubmission) {
      const mergedWasteTypes = Array.from(
          new Set([
            ...existingSubmission.wasteTypes,
            ...args.wasteTypes,
          ])
      );

      await ctx.db.patch(existingSubmission._id, {
        name,
        email,
        phone,
        participantType: args.participantType,
        organizationName:
            args.participantType === "organization"
                ? organizationName
                : undefined,
        representativeName:
            args.participantType === "organization"
                ? args.representativeName?.trim() || name
                : undefined,
        wasteWeight:
            existingSubmission.wasteWeight + args.wasteWeight,
        wasteTypes: mergedWasteTypes,
        submittedAt: args.submittedAt,
        ...verificationFields,
      });

      return {
        id: existingSubmission._id,
        action: "updated" as const,
      };
    }

    const id = await ctx.db.insert("ewasteSubmissions", {
      name,
      email,
      phone,
      participantType: args.participantType,
      organizationName:
          args.participantType === "organization"
              ? organizationName
              : undefined,
      representativeName:
          args.participantType === "organization"
              ? args.representativeName?.trim() || name
              : undefined,
      wasteWeight: args.wasteWeight,
      wasteTypes: Array.from(new Set(args.wasteTypes)),
      submittedAt: args.submittedAt,
      ...verificationFields,
    });

    return {
      id,
      action: "created" as const,
    };
  },
});


// Submit e-waste entry
export const submitEwaste = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    participantType: v.union(
        v.literal("individual"),
        v.literal("organization")
    ),
    organizationName: v.optional(v.string()),
    organizationAddress: v.optional(v.string()),
    representativeName: v.optional(v.string()),
    wasteWeight: v.number(),
    wasteTypes: v.array(v.string()),
    additionalNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user already submitted (by email or phone)
    const existingByEmail = await ctx.db
        .query("ewasteSubmissions")
        .withIndex("by_email", (q) => q.eq("email", args.email))
        .first();

    const existingByPhone = await ctx.db
        .query("ewasteSubmissions")
        .withIndex("by_phone", (q) => q.eq("phone", args.phone))
        .first();

    const existingSubmission = existingByEmail || existingByPhone;

    if (existingSubmission) {
      // Add to existing submission weight
      const newWeight = existingSubmission.wasteWeight + args.wasteWeight;

      // Merge waste types (avoid duplicates)
      const existingWasteTypes = existingSubmission.wasteTypes || [];
      const newWasteTypes = [
        ...new Set([...existingWasteTypes, ...args.wasteTypes]),
      ];

      await ctx.db.patch(existingSubmission._id, {
        name: args.name, // Update name in case it changed
        email: args.email,
        phone: args.phone,
        participantType: args.participantType,
        organizationName: args.organizationName,
        organizationAddress: args.organizationAddress,
        representativeName: args.representativeName,
        wasteWeight: newWeight, // Add to existing weight
        wasteTypes: newWasteTypes, // Merge waste types
        additionalNotes: args.additionalNotes, // Update notes
        submittedAt: Date.now(), // Update submission time
        verificationStatus: "verified", // Auto-verify for demo purposes
      });

      return existingSubmission._id;
    } else {
      // Create new submission
      const submissionId = await ctx.db.insert("ewasteSubmissions", {
        name: args.name,
        email: args.email,
        phone: args.phone,
        participantType: args.participantType,
        organizationName: args.organizationName,
        organizationAddress: args.organizationAddress,
        representativeName: args.representativeName,
        wasteWeight: args.wasteWeight,
        wasteTypes: args.wasteTypes,
        additionalNotes: args.additionalNotes,
        submittedAt: Date.now(),
        verificationStatus: "verified", // Auto-verify for demo purposes
      });

      return submissionId;
    }
  },
});

// Update verification status (for admin use)
export const updateVerificationStatus = mutation({
  args: {
    submissionId: v.id("ewasteSubmissions"),
    status: v.union(
        v.literal("pending"),
        v.literal("verified"),
        v.literal("rejected")
    ),
    verifiedBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.submissionId, {
      verificationStatus: args.status,
      verifiedBy: args.verifiedBy,
      verifiedAt: args.status === "verified" ? Date.now() : undefined,
    });
  },
});

// Get all submissions for admin
export const getAllSubmissions = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit || 1000;

    const submissions = await ctx.db
        .query("ewasteSubmissions")
        .withIndex("by_submitted")
        .order("desc")
        .take(limit);

    return submissions.map((submission) => ({
      _id: submission._id,
      _creationTime: submission.submittedAt,
      name: submission.name,
      email: submission.email,
      phone: submission.phone,
      participantType: submission.participantType,
      organizationName: submission.organizationName,
      organizationAddress: submission.organizationAddress,
      representativeName: submission.representativeName,
      wasteWeight: submission.wasteWeight,
      wasteTypes: submission.wasteTypes,
      additionalNotes: submission.additionalNotes,
      submittedAt: submission.submittedAt,
      verificationStatus: submission.verificationStatus,
      verifiedBy: submission.verifiedBy,
      verifiedAt: submission.verifiedAt,
    }));
  },
});

// Get individual leaderboard
export const getIndividualLeaderboard = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit || 100;

    const individuals = await ctx.db
        .query("ewasteSubmissions")
        .withIndex("by_type", (q) => q.eq("participantType", "individual"))
        .filter((q) => q.eq(q.field("verificationStatus"), "verified"))
        .collect();

    // Sort by waste weight descending
    const sorted = individuals
        .sort((a, b) => b.wasteWeight - a.wasteWeight)
        .slice(0, limit);

    return sorted.map((entry, index) => ({
      rank: index + 1,
      name: entry.name,
      email: entry.email,
      wasteWeight: entry.wasteWeight,
      wasteTypes: entry.wasteTypes,
      submittedAt: entry.submittedAt,
    }));
  },
});

// Get organization leaderboard
export const getOrganizationLeaderboard = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit || 100;

    const organizations = await ctx.db
        .query("ewasteSubmissions")
        .withIndex("by_type", (q) => q.eq("participantType", "organization"))
        .filter((q) => q.eq(q.field("verificationStatus"), "verified"))
        .collect();

    // Group by organization and sum weights
    const orgMap = new Map<
        string,
        {
          organizationName: string;
          totalWeight: number;
          entries: number;
          representativeName: string;
          lastSubmission: number;
        }
    >();

    organizations.forEach((entry) => {
      const orgName = entry.organizationName!;
      if (orgMap.has(orgName)) {
        const existing = orgMap.get(orgName)!;
        existing.totalWeight += entry.wasteWeight;
        existing.entries += 1;
        existing.lastSubmission = Math.max(
            existing.lastSubmission,
            entry.submittedAt
        );
      } else {
        orgMap.set(orgName, {
          organizationName: orgName,
          totalWeight: entry.wasteWeight,
          entries: 1,
          representativeName: entry.representativeName || entry.name,
          lastSubmission: entry.submittedAt,
        });
      }
    });

    // Convert to array and sort by total weight
    const sorted = Array.from(orgMap.values())
        .sort((a, b) => b.totalWeight - a.totalWeight)
        .slice(0, limit);

    return sorted.map((org, index) => ({
      rank: index + 1,
      organizationName: org.organizationName,
      representativeName: org.representativeName,
      totalWeight: org.totalWeight,
      entries: org.entries,
      lastSubmission: org.lastSubmission,
    }));
  },
});

// Get top 5 for both categories
export const getTopFive = query({
  handler: async (ctx) => {
    const individuals = await ctx.db
        .query("ewasteSubmissions")
        .withIndex("by_type", (q) => q.eq("participantType", "individual"))
        .filter((q) => q.eq(q.field("verificationStatus"), "verified"))
        .collect();

    const organizations = await ctx.db
        .query("ewasteSubmissions")
        .withIndex("by_type", (q) => q.eq("participantType", "organization"))
        .filter((q) => q.eq(q.field("verificationStatus"), "verified"))
        .collect();

    // Sort individuals
    const topIndividuals = individuals
        .sort((a, b) => b.wasteWeight - a.wasteWeight)
        .slice(0, 5)
        .map((entry, index) => ({
          rank: index + 1,
          name: entry.name,
          wasteWeight: entry.wasteWeight,
          submittedAt: entry.submittedAt,
        }));

    // Group and sort organizations
    const orgMap = new Map<
        string,
        {
          organizationName: string;
          totalWeight: number;
          representativeName: string;
          lastSubmission: number;
        }
    >();

    organizations.forEach((entry) => {
      const orgName = entry.organizationName!;
      if (orgMap.has(orgName)) {
        const existing = orgMap.get(orgName)!;
        existing.totalWeight += entry.wasteWeight;
        existing.lastSubmission = Math.max(
            existing.lastSubmission,
            entry.submittedAt
        );
      } else {
        orgMap.set(orgName, {
          organizationName: orgName,
          totalWeight: entry.wasteWeight,
          representativeName: entry.representativeName || entry.name,
          lastSubmission: entry.submittedAt,
        });
      }
    });

    const topOrganizations = Array.from(orgMap.values())
        .sort((a, b) => b.totalWeight - a.totalWeight)
        .slice(0, 5)
        .map((org, index) => ({
          rank: index + 1,
          organizationName: org.organizationName,
          representativeName: org.representativeName,
          totalWeight: org.totalWeight,
          lastSubmission: org.lastSubmission,
        }));

    return {
      individuals: topIndividuals,
      organizations: topOrganizations,
    };
  },
});

// Get stats
export const getEwasteStats = query({
  handler: async (ctx) => {
    const allSubmissions = await ctx.db
        .query("ewasteSubmissions")
        .filter((q) => q.eq(q.field("verificationStatus"), "verified"))
        .collect();

    const totalWeight = allSubmissions.reduce(
        (sum, entry) => sum + entry.wasteWeight,
        0
    );
    const individualCount = allSubmissions.filter(
        (s) => s.participantType === "individual"
    ).length;
    const organizationCount = new Set(
        allSubmissions
            .filter((s) => s.participantType === "organization")
            .map((s) => s.organizationName)
    ).size;

    return {
      totalWeight,
      totalParticipants: individualCount + organizationCount,
      individualCount,
      organizationCount,
    };
  },
});