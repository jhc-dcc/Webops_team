import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get the active popup configuration from Convex database
export const getActivePopup = query({
  args: {},
  handler: async (ctx) => {
    const activePopup = await ctx.db
      .query("popups")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .order("desc")
      .first();

    return activePopup || null;
  },
});

// Create or update popup configuration in Convex database
export const upsertPopup = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    newsUrl: v.string(),
    badge: v.optional(v.string()),
    isActive: v.boolean(),
    autoHideDuration: v.optional(v.number()),
    showOnlyOnce: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("popups")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...args,
        createdAt: Date.now(),
      });
      return existing._id;
    }

    return await ctx.db.insert("popups", {
      ...args,
      createdAt: Date.now(),
    });
  },
});
