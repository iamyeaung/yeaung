"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deletePost } from "@/app/[locale]/admin/(dashboard)/posts/actions";
import { useRouter } from "@/i18n/routing";

export function DeletePostButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (
      confirm(
        "Are you sure you want to delete this post? This action cannot be undone.",
      )
    ) {
      setIsDeleting(true);
      try {
        await deletePost(id);
        router.refresh();
      } catch (error) {
        console.error(error);
        alert("Failed to delete post.");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 text-destructive hover:bg-destructive/10 rounded-md transition-colors disabled:opacity-50"
      title="Delete Post"
    >
      {isDeleting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
    </button>
  );
}
