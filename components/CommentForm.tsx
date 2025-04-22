"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { X } from "lucide-react";

interface CommentFormProps {
  articleId: Id<"articles">;
  editingCommentId: Id<"comments"> | null;
  setEditingCommentId: (id: Id<"comments"> | null) => void;
}

export function CommentForm({ 
  articleId, 
  editingCommentId, 
  setEditingCommentId 
}: CommentFormProps) {
  const { user } = useUser();
  const [content, setContent] = useState("");
  const createComment = useMutation(api.comments.createComment);
  const updateComment = useMutation(api.comments.updateComment);
  
  const editingComment = useQuery(
    api.comments.getComment,
    editingCommentId ? { commentId: editingCommentId } : "skip"
  );

  useEffect(() => {
    if (editingComment) {
      setContent(editingComment.content);
    }
  }, [editingComment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim() || !user) return;

    try {
      if (editingCommentId) {
        await updateComment({
          commentId: editingCommentId,
          content: content.trim(),
        });
      } else {
        await createComment({
          articleId,
          userId: user.id,
          username: user.unsafeMetadata?.username as string || "Anonymous",
          avatarUrl: user.imageUrl || "",
          content: content.trim(),
        });
      }
      setContent("");
      setEditingCommentId(null);
    } catch (error) {
      console.error("Error saving comment:", error);
    }
  };

  const handleCancel = () => {
    setContent("");
    setEditingCommentId(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment..."
        className="min-h-[100px]"
      />
      <div className="flex justify-end gap-2">
        {editingCommentId && (
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="h-8"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        <Button type="submit" className="h-8">
          {editingCommentId ? "Update" : "Post"} Comment
        </Button>
      </div>
    </form>
  );
} 