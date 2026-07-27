import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    department: v.string(),
    departmentOther: v.optional(v.string()),
    year: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if user is already registered
    const existingRegistration = await ctx.db
      .query("sonyRegistrations")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existingRegistration) {
      throw new Error("Email already registered");
    }

    // Process department value
    const department =
      args.department === "Other" ? args.departmentOther : args.department;

    if (!department) {
      throw new Error("Department is required");
    }

    const registrationId = await ctx.db.insert("sonyRegistrations", {
      name: args.name,
      email: args.email,
      phone: args.phone,
      department,
      departmentOther: args.departmentOther,
      year: args.year,
      registeredAt: Date.now(),
    });

    return { success: true, id: registrationId };
  },
});

export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("sonyRegistrations").collect();
  },
});

export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("sonyRegistrations")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});