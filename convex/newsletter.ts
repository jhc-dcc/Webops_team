import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Subscribe to newsletter
export const subscribe = mutation({
  args: {
    email: v.string(),
    source: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { email, source = "newsletter-section" } = args;

    // Check if email already exists
    const existingSubscriber = await ctx.db
      .query("newsletter")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (existingSubscriber) {
      // If they were previously unsubscribed, reactivate them
      if (existingSubscriber.status === "unsubscribed") {
        await ctx.db.patch(existingSubscriber._id, {
          status: "active",
          subscribedAt: Date.now(),
          source,
        });
        return { success: true, message: "Welcome back! You're now subscribed again." };
      }
      // If already subscribed
      return { success: true, message: "You're already subscribed to our newsletter!" };
    }

    // Create new subscription
    await ctx.db.insert("newsletter", {
      email,
      subscribedAt: Date.now(),
      status: "active",
      source,
    });

    return { success: true, message: "Successfully subscribed to DCC newsletter!" };
  },
});

// Get newsletter stats (optional - for admin use)
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const totalSubscribers = await ctx.db
      .query("newsletter")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .collect();

    return {
      totalSubscribers: totalSubscribers.length,
      recentSubscribers: totalSubscribers
        .sort((a, b) => b.subscribedAt - a.subscribedAt)
        .slice(0, 10),
    };
  },
});

// Check if email is already subscribed
export const checkSubscription = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const subscriber = await ctx.db
      .query("newsletter")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    return {
      isSubscribed: subscriber?.status === "active",
      subscribedAt: subscriber?.subscribedAt,
    };
  },
});