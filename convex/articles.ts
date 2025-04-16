import { mutation, query, action, httpAction } from "./_generated/server";
import { v } from "convex/values";
import { httpRouter } from "convex/server";
import { api } from "./_generated/api";
import { Id } from "./_generated/dataModel";

export const createTestArticle = mutation({
  args: {}, // No arguments needed for this test
  handler: async (ctx) => {
    await ctx.db.insert("articles", {
      title: "Test Article",
      body: "This is a test article body.",
      category: "sports",
      authorId: "me",
      tags: ["test"],
      createdAt: Date.now(),
    });
  },
});

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});


export const createArticle = mutation({
  args: {
    title: v.string(),
    body: v.string(),
    category: v.union(
      v.literal("politics"),
      v.literal("technology"),
      v.literal("finance"),
      v.literal("sports")
    ),
    tags: v.array(v.string()),
    imageStorageId: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<{ articleId: Id<"articles"> }> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const articleId = await ctx.db.insert("articles", {
      title: args.title,
      body: args.body,
      category: args.category,
      tags: args.tags,
      authorId: identity.subject,
      createdAt: Date.now(),
      imageStorageId: args.imageStorageId as Id<"_storage"> | undefined,
    });

    return { articleId };
  },
});

export const getArticle = query({
  args: { id: v.id("articles") },
  handler: async (ctx, args) => {
    const article = await ctx.db.get(args.id);
    if (!article) return null;

    // Get the image URL if it exists
    let imageUrl = null;
    if (article.imageStorageId) {
      imageUrl = await ctx.storage.getUrl(article.imageStorageId);
    }

    return {
      ...article,
      imageUrl,
    };
  },
});

export const updateArticle = mutation({
  args: {
    id: v.id("articles"),
    title: v.string(),
    body: v.string(),
    category: v.union(
      v.literal("politics"),
      v.literal("technology"),
      v.literal("finance"),
      v.literal("sports")
    ),
    tags: v.array(v.string()),
    imageStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const article = await ctx.db.get(args.id);
    if (!article) {
      throw new Error("Article not found");
    }

    // Only allow the author to update the article
    if (article.authorId !== identity.subject) {
      throw new Error("Not authorized to update this article");
    }

    // If there's a new image and the article had an old image, delete the old one
    if (args.imageStorageId && article.imageStorageId) {
      await ctx.storage.delete(article.imageStorageId);
    }

    // Update the article
    await ctx.db.patch(args.id, {
      title: args.title,
      body: args.body,
      category: args.category,
      tags: args.tags,
      imageStorageId: args.imageStorageId,
    });

    return { success: true };
  },
});

export const getAllArticles = query({
  handler: async (ctx) => {
    const articles = await ctx.db.query("articles").collect();
    
    // Get image URLs for all articles
    const articlesWithImages = await Promise.all(
      articles.map(async (article) => {
        let imageUrl = null;
        if (article.imageStorageId) {
          imageUrl = await ctx.storage.getUrl(article.imageStorageId);
        }
        return {
          ...article,
          imageUrl,
        };
      })
    );

    // Sort by creation date, newest first
    return articlesWithImages.sort((a, b) => b.createdAt - a.createdAt);
  },
});