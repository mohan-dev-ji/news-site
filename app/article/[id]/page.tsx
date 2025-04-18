"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { use } from "react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { isAdmin } from "@/lib/admin";

export default function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const article = useQuery(api.articles.getArticle, { id: resolvedParams.id as Id<"articles"> });
  const { user } = useUser();

  if (!article) {
    return <div className="p-8">Loading article...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Banner Image */}
      {article.imageUrl && (
        <div className="relative w-full h-[300px] mb-8 rounded-lg overflow-hidden">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Article Content */}
      <article className="prose prose-lg max-w-none">
        <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
        
        <div className="flex items-center gap-4 text-gray-600 mb-8">
          <span className="capitalize">{article.category}</span>
          <span>•</span>
          <span>{new Date(article.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</span>
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Article Body */}
        <div className="whitespace-pre-wrap">
          {article.body}
        </div>

        {/* Edit Button - Only visible to admin */}
        {isAdmin(user?.id) && (
          <div className="mt-8 flex justify-end">
            <Link href={`/article/${resolvedParams.id}/edit`}>
              <Button variant="outline" className="gap-2">
                <Pencil className="h-4 w-4" />
                Edit Article
              </Button>
            </Link>
          </div>
        )}
      </article>
    </div>
  );
}
