import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new poll (admin creates but doesn't broadcast yet)
export const createPoll = mutation({
  args: {
    question: v.string(),
    options: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    // End any existing active polls
    const existingActivePolls = await ctx.db
      .query("polls")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();
    
    for (const poll of existingActivePolls) {
      await ctx.db.patch(poll._id, {
        isActive: false,
        endedAt: Date.now(),
      });
    }

    // Create new poll (not broadcasted yet)
    const pollId = await ctx.db.insert("polls", {
      question: args.question,
      options: args.options,
      isActive: true,
      createdAt: Date.now(),
      // broadcastAt will be set when admin actually broadcasts
    });

    return pollId;
  },
});

// Broadcast the poll to all users
export const broadcastPoll = mutation({
  args: {
    pollId: v.id("polls"),
  },
  handler: async (ctx, args) => {
    const poll = await ctx.db.get(args.pollId);
    if (!poll) {
      throw new Error("Poll not found");
    }

    // Set the broadcast timestamp - this triggers the poll to show to users
    await ctx.db.patch(args.pollId, {
      broadcastAt: Date.now(),
    });

    return { success: true, broadcastAt: Date.now() };
  },
});

// End the current active poll
export const endPoll = mutation({
  args: {
    pollId: v.id("polls"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.pollId, {
      isActive: false,
      endedAt: Date.now(),
    });
  },
});

// Submit a poll response
export const submitPollResponse = mutation({
  args: {
    pollId: v.id("polls"),
    response: v.string(),
    userIdentifier: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if poll is still active
    const poll = await ctx.db.get(args.pollId);
    if (!poll || !poll.isActive) {
      throw new Error("Poll is not active");
    }

    // Check if user has already voted (optional - you can remove this for multiple votes)
    if (args.userIdentifier) {
      const existingResponse = await ctx.db
        .query("pollResponses")
        .withIndex("by_poll", (q) => q.eq("pollId", args.pollId))
        .filter((q) => q.eq(q.field("userIdentifier"), args.userIdentifier))
        .first();
      
      if (existingResponse) {
        throw new Error("User has already voted in this poll");
      }
    }

    // Submit the response
    const responseId = await ctx.db.insert("pollResponses", {
      pollId: args.pollId,
      response: args.response,
      timestamp: Date.now(),
      userIdentifier: args.userIdentifier,
    });

    return responseId;
  },
});

// Get the current active poll (only if broadcasted and not expired)
export const getActivePoll = query({
  args: {},
  handler: async (ctx) => {
    const activePoll = await ctx.db
      .query("polls")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .first();
    
    if (!activePoll) {
      return null;
    }

    // Check if poll has been broadcasted
    if (!activePoll.broadcastAt) {
      return null;
    }

    // Check if poll has expired (5 minutes = 300000 milliseconds)
    const now = Date.now();
    const fiveMinutesInMs = 5 * 60 * 1000;
    
    if (now - activePoll.broadcastAt > fiveMinutesInMs) {
      // Poll has expired, return null (expiry will be handled by a separate function)
      return null;
    }
    
    return activePoll;
  },
});

// Expire old polls (called periodically or when needed)
export const expireOldPolls = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const fiveMinutesInMs = 5 * 60 * 1000;
    
    const activePolls = await ctx.db
      .query("polls")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();
    
    let expiredCount = 0;
    
    for (const poll of activePolls) {
      if (poll.broadcastAt && now - poll.broadcastAt > fiveMinutesInMs) {
        await ctx.db.patch(poll._id, {
          isActive: false,
          endedAt: now,
        });
        expiredCount++;
      }
    }
    
    return { expiredCount };
  },
});

// Get poll results (real-time)
export const getPollResults = query({
  args: {
    pollId: v.id("polls"),
  },
  handler: async (ctx, args) => {
    const poll = await ctx.db.get(args.pollId);
    if (!poll) {
      return null;
    }

    // Get all responses for this poll
    const responses = await ctx.db
      .query("pollResponses")
      .withIndex("by_poll", (q) => q.eq("pollId", args.pollId))
      .collect();

    // Count responses by option
    const results: Record<string, number> = {};
    
    // Initialize all options with 0
    poll.options.forEach(option => {
      results[option] = 0;
    });

    // Count actual responses
    responses.forEach(response => {
      if (results.hasOwnProperty(response.response)) {
        results[response.response]++;
      }
    });

    return {
      poll,
      results,
      totalResponses: responses.length,
    };
  },
});

// Get all polls (for admin)
export const getAllPolls = query({
  args: {},
  handler: async (ctx) => {
    const polls = await ctx.db
      .query("polls")
      .withIndex("by_created")
      .order("desc")
      .collect();
    
    return polls;
  },
});
