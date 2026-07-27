import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createMember = mutation({
  args: {
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
    paymentScreenshotUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("registeration", {
      email: args.email,
      fullName: args.fullName,
      uid: args.uid,
      contactNo: args.contactNo,
      department: args.department,
      departmentOther: args.departmentOther,
      year: args.year,
      team: args.team,
      tshirtSize: args.tshirtSize,
      tshirtSizeOther: args.tshirtSizeOther,
      hearAboutDCC: args.hearAboutDCC,
      hearAboutDCCOther: args.hearAboutDCCOther,
      imageUrl: args.imageUrl,
      paymentScreenshotUrl: args.paymentScreenshotUrl,
    });
  },
});

export const updateMember = mutation({
  args: {
    id: v.id("registeration"),
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
    paymentScreenshotUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updateData } = args;
    await ctx.db.patch(id, updateData);
  },
});

export const deleteMember = mutation({
  args: {
    id: v.id("registeration"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const getMember = query({
  args: {
    id: v.id("registeration"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const listMembers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("registeration").order("desc").collect();
  },
});