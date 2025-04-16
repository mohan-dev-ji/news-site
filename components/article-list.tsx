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
    <div className="space-y-6">
      {articles.map((article: Article) => (
        <Link
          key={article._id}
          href={`/article/${article._id}`}
          className="flex gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="relative w-32 h-32 flex-shrink-0">
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
          <div className="flex flex-col justify-center">
            <h2 className="text-xl font-semibold">{article.title}</h2>
            <p className="text-sm text-gray-500">
              <TimeAgo date={article.createdAt} />
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
} 