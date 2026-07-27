import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createContact = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("contact", {
      name: args.name,
      email: args.email,
      phone: args.phone,
      message: args.message,
    });
    return "success";
  },
});

export const listContacts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("contact")
      .order("desc")
      .collect();
  },
});
