import { createClient } from "@/utils/supabase/server";
import { Plus, Tags } from "lucide-react";
import CategoryDeleteButton from "./CategoryDeleteButton";
import { createCategory } from "../actions";

export const metadata = { title: "Categories — Fitrah Admin" };

export default async function AdminCategoriesPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase.from("categories").select("*").order("created_at", { ascending: false });

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 border border-black/10 rounded-sm">
        <div>
          <h1 className="font-serif text-3xl text-brand-black mb-1">Categories</h1>
          <p className="font-sans text-sm text-brand-muted">Organize your products</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Create Form */}
        <div className="md:col-span-1">
          <form action={createCategory} className="bg-white p-6 border border-black/10 rounded-sm space-y-4">
            <h2 className="font-serif text-xl text-brand-black mb-4">Add Category</h2>
            
            <div>
              <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">Category Name</label>
              <input type="text" name="name" required placeholder="e.g. Beard Oils"
                className="w-full bg-[#faf9f6] border border-black/10 p-3 font-sans text-sm text-brand-black focus:outline-none focus:border-brand-black transition-colors rounded-sm" />
            </div>

            <button type="submit" className="w-full flex items-center justify-center gap-2 bg-[#111] text-white px-6 py-3 rounded-md font-sans text-xs uppercase tracking-widest font-semibold hover:bg-black transition-colors">
              <Plus className="w-4 h-4" /> Create Category
            </button>
          </form>
        </div>

        {/* List */}
        <div className="md:col-span-2">
          <div className="bg-white border border-black/10 rounded-sm overflow-hidden">
            <table className="w-full text-left font-sans text-sm">
              <thead className="bg-black/5 text-brand-muted text-xs uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4 font-semibold">Name</th>
                  <th className="px-6 py-4 font-semibold">Slug</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10">
                {categories?.map((cat) => (
                  <tr key={cat.id} className="hover:bg-black/5 transition-colors group">
                    <td className="px-6 py-4 font-medium text-brand-black flex items-center gap-3">
                      <Tags className="w-4 h-4 text-brand-muted" />
                      {cat.name}
                    </td>
                    <td className="px-6 py-4 text-brand-muted font-mono text-xs">{cat.slug}</td>
                    <td className="px-6 py-4 text-right">
                      <CategoryDeleteButton id={cat.id} />
                    </td>
                  </tr>
                ))}

                {!categories?.length && (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-brand-muted font-sans text-sm">
                      No categories found. Create one to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
