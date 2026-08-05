import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const applicationTables = {
  sonyRegistrations: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    department: v.string(),
    departmentOther: v.optional(v.string()),
    year: v.string(),
    registeredAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_department", ["department"])
    .index("by_year", ["year"]),

  contact: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    message: v.string(),
  })
    .index("by_name", ["name"])
    .index("by_email", ["email"]),

  newsletter: defineTable({
    email: v.string(),
    subscribedAt: v.number(),
    status: v.union(v.literal("active"), v.literal("unsubscribed")),
    source: v.optional(v.string()), // Track where they subscribed from
  })
    .index("by_email", ["email"])
    .index("by_status", ["status"])
    .index("by_subscribed", ["subscribedAt"]),

  polls: defineTable({
    question: v.string(),
    options: v.array(v.string()),
    isActive: v.boolean(),
    createdAt: v.number(),
    broadcastAt: v.optional(v.number()), // When poll was actually broadcasted to users
    endedAt: v.optional(v.number()),
  })
    .index("by_active", ["isActive"])
    .index("by_created", ["createdAt"]),

  pollResponses: defineTable({
    pollId: v.id("polls"),
    response: v.string(),
    timestamp: v.number(),
    userIdentifier: v.optional(v.string()), // IP or session ID
  })
    .index("by_poll", ["pollId"])
    .index("by_poll_response", ["pollId", "response"]),

  registeration: defineTable({
    email: v.string(),
    fullName: v.string(),
    uid: v.string(),
    contactNo: v.string(),
    department: v.string(),
    departmentOther: v.optional(v.string()),
    year: v.string(),
    team: v.string(),
    tshirtSize: v.string(),
    tshirtSizeOther: v.optional(v.string()),
    hearAboutDCC: v.string(),
    hearAboutDCCOther: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    paymentScreenshotUrl: v.optional(v.string()), // Payment confirmation screenshot
  })
    .index("by_email", ["email"])
    .index("by_uid", ["uid"])
    .index("by_team", ["team"])
    .index("by_member", ["fullName", "team"]),

  ewasteSubmissions: defineTable({
    // Basic participant info
    name: v.string(),
    email: v.string(),
    phone: v.string(),

    // Organization info (optional for individuals)
    participantType: v.union(
      v.literal("individual"),
      v.literal("organization")
    ),
    organizationName: v.optional(v.string()),
    organizationAddress: v.optional(v.string()),
    representativeName: v.optional(v.string()),

    // E-waste details
    wasteWeight: v.number(), // in kg
    wasteTypes: v.array(v.string()), // e.g., ["laptops", "phones", "cables"]
    additionalNotes: v.optional(v.string()),

    // Meta info
    submittedAt: v.number(),
    verificationStatus: v.union(
      v.literal("pending"),
      v.literal("verified"),
      v.literal("rejected")
    ),
    verifiedBy: v.optional(v.string()), // Admin who verified
    verifiedAt: v.optional(v.number()),
  })
    .index("by_email", ["email"])
    .index("by_phone", ["phone"])
    .index("by_type", ["participantType"])
    .index("by_organization", ["organizationName"])
    .index("by_verification", ["verificationStatus"])
    .index("by_weight", ["wasteWeight"])
    .index("by_submitted", ["submittedAt"]),

  clRegistrations: defineTable({
    // College information
    collegeName: v.string(),
    collegeAddress: v.string(),

    // Contingent Leader information
    clName: v.string(),
    clYear: v.string(),
    clContact: v.string(),
    clEmail: v.string(),
    clFeeReceiptUrl: v.string(), // Fee receipt or College ID
    clGovtIdUrl: v.string(), // Government ID

    // Assistant Contingent Leader information
    aclContact: v.string(),
    aclEmail: v.string(),
    aclFeeReceiptUrl: v.string(), // Fee receipt or College ID
    aclGovtIdUrl: v.string(), // Government ID

    // CL Meet attendance
    attendingClMeet: v.boolean(),

    // Meta info
    submittedAt: v.number(),
    verificationStatus: v.union(
      v.literal("pending"),
      v.literal("verified"),
      v.literal("rejected")
    ),
    verifiedBy: v.optional(v.string()),
    verifiedAt: v.optional(v.number()),
  })
    .index("by_email", ["clEmail"])
    .index("by_college", ["collegeName"])
    .index("by_contact", ["clContact"])
    .index("by_verification", ["verificationStatus"])
    .index("by_submitted", ["submittedAt"]),

  clFormSettings: defineTable({
    isOpen: v.boolean(),
    updatedAt: v.number(),
    updatedBy: v.optional(v.string()),
  }),

  popups: defineTable({
    title: v.string(),
    description: v.string(),
    newsUrl: v.string(),
    badge: v.optional(v.string()),
    isActive: v.boolean(),
    autoHideDuration: v.optional(v.number()),
    showOnlyOnce: v.optional(v.boolean()),
    createdAt: v.optional(v.number()),
  }).index("by_active", ["isActive"]),
};

export default defineSchema({
  ...applicationTables,
});