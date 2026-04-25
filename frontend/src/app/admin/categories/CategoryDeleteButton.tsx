"use client";

import { Trash2 } from "lucide-react";
import { useTransition } from "react";
import { deleteCategory } from "../actions";

export default function CategoryDeleteButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this category?")) {
      startTransition(async () => {
        try {
          await deleteCategory(id);
        } catch (error) {
          alert("Failed to delete category. It might be in use.");
        }
      });
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isPending}
      className={`p-2 rounded-md transition-colors ${
        isPending 
          ? "opacity-50 cursor-not-allowed text-brand-muted" 
          : "text-red-400 hover:text-red-600 hover:bg-red-50"
      }`}
      title="Delete"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
