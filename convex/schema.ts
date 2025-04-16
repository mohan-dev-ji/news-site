import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  articles: defineTable({
    title: v.string(),
    body: v.string(),
    category: v.union(
      v.literal("politics"),
      v.literal("technology"),
      v.literal("finance"),
      v.literal("sports")
    ),
    tags: v.array(v.string()),
    authorId: v.string(),
    createdAt: v.number(),
    imageStorageId: v.optional(v.id("_storage")), // Field for storing file storage ID
  })
});
