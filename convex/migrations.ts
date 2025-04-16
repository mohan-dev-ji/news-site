// convex/migrations.ts
import { mutation } from "./_generated/server";

export const backfillAuthorIds = mutation({
  args: {},
  handler: async (ctx) => {
    const articles = await ctx.db.query("articles").collect();
    for (const article of articles) {
      if (!article.authorId) {
        await ctx.db.patch(article._id, { authorId: "SYSTEM" }); // Use placeholder
      }
    }
  },
});
