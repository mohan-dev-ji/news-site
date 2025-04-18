"use client"

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import Link from "next/link";
import TimeAgo from "react-timeago";
import { Id } from "@/convex/_generated/dataModel";

interface Article {
  _id: Id<"articles">;
  title: string;
  body: string;
  category: string;
  tags: string[];
  authorId: string;
  createdAt: number;
  imageUrl: string | null;
}

export function ArticleList() {
  const articles = useQuery(api.articles.getAllArticles);

  if (!articles) {
    return <div>Loading articles...</div>;
  }

  return (
    <div className="w-full">
      <div className="max-w-2xl mx-auto">
        {articles.slice(1).map((article: Article) => (
          <Link
            key={article._id}
            href={`/article/${article._id}`}
            className="flex gap-4 py-4 rounded-lg hover:bg-gray-50 transition-colors w-full border-b-2 border-gray-100 last:border-b-0"
          >
            <div className="relative w-56 h-32 flex-shrink-0">
              {article.imageUrl ? (
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  fill
                  className="object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
            </div>
            <div className="flex flex-col justify-center text-left">
              <h2 className="text-xl font-semibold">{article.title}</h2>
              <p className="text-sm text-gray-500">
                {Date.now() - article.createdAt < 24 * 60 * 60 * 1000 ? (
                  <TimeAgo date={article.createdAt} />
                ) : (
                  new Date(article.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })
                )}
              </p>
            </div>
          </Link>
        ))}
      </div>
      <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                  
                </div>
    </div>
  );
} 