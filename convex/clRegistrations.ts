import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a new CL registration
export const createCLRegistration = mutation({
  args: {
    collegeName: v.string(),
    collegeAddress: v.string(),
    clName: v.string(),
    clYear: v.string(),
    clContact: v.string(),
    clEmail: v.string(),
    clFeeReceiptUrl: v.string(),
    clGovtIdUrl: v.string(),
    aclContact: v.string(),
    aclEmail: v.string(),
    aclFeeReceiptUrl: v.string(),
    aclGovtIdUrl: v.string(),
    attendingClMeet: v.boolean(),
  },
  handler: async (ctx, args) => {
    const registrationId = await ctx.db.insert("clRegistrations", {
      collegeName: args.collegeName,
      collegeAddress: args.collegeAddress,
      clName: args.clName,
      clYear: args.clYear,
      clContact: args.clContact,
      clEmail: args.clEmail,
      clFeeReceiptUrl: args.clFeeReceiptUrl,
      clGovtIdUrl: args.clGovtIdUrl,
      aclContact: args.aclContact,
      aclEmail: args.aclEmail,
      aclFeeReceiptUrl: args.aclFeeReceiptUrl,
      aclGovtIdUrl: args.aclGovtIdUrl,
      attendingClMeet: args.attendingClMeet,
      submittedAt: Date.now(),
      verificationStatus: "pending",
    });

    return registrationId;
  },
});

// Update an existing CL registration
export const updateCLRegistration = mutation({
  args: {
    id: v.id("clRegistrations"),
    collegeName: v.string(),
    collegeAddress: v.string(),
    clName: v.string(),
    clYear: v.string(),
    clContact: v.string(),
    clEmail: v.string(),
    clFeeReceiptUrl: v.string(),
    clGovtIdUrl: v.string(),
    aclContact: v.string(),
    aclEmail: v.string(),
    aclFeeReceiptUrl: v.string(),
    aclGovtIdUrl: v.string(),
    attendingClMeet: v.boolean(),
    verificationStatus: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("verified"),
        v.literal("rejected")
      )
    ),
  },
  handler: async (ctx, args) => {
    const { id, ...updateData } = args;
    await ctx.db.patch(id, updateData);
  },
});

// Delete a CL registration
export const deleteCLRegistration = mutation({
  args: {
    id: v.id("clRegistrations"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Get a single CL registration by ID
export const getCLRegistration = query({
  args: {
    id: v.id("clRegistrations"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get a single CL registration by email
export const getCLRegistrationByEmail = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const registration = await ctx.db
      .query("clRegistrations")
      .withIndex("by_email", (q) => q.eq("clEmail", args.email))
      .first();
    return registration;
  },
});

// List all CL registrations
export const listCLRegistrations = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("clRegistrations").order("desc").collect();
  },
});

// Update verification status
export const updateVerificationStatus = mutation({
  args: {
    id: v.id("clRegistrations"),
    status: v.union(
      v.literal("pending"),
      v.literal("verified"),
      v.literal("rejected")
    ),
    verifiedBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      verificationStatus: args.status,
      verifiedBy: args.verifiedBy,
      verifiedAt: Date.now(),
    });
  },
});

// Form settings - Get form open/close status
export const getFormStatus = query({
  args: {},
  handler: async (ctx) => {
    const settings = await ctx.db.query("clFormSettings").first();
    return settings?.isOpen ?? true; // Default to open if no settings exist
  },
});

// Form settings - Toggle form open/close
export const toggleFormStatus = mutation({
  args: {
    isOpen: v.boolean(),
    updatedBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingSettings = await ctx.db.query("clFormSettings").first();

    if (existingSettings) {
      await ctx.db.patch(existingSettings._id, {
        isOpen: args.isOpen,
        updatedAt: Date.now(),
        updatedBy: args.updatedBy,
      });
    } else {
      await ctx.db.insert("clFormSettings", {
        isOpen: args.isOpen,
        updatedAt: Date.now(),
        updatedBy: args.updatedBy,
      });
    }
  },
});

// Get form settings
export const getFormSettings = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("clFormSettings").first();
  },
});