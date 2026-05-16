import { createClient } from "@/utils/supabase/server";
import { Edit2, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

import DeleteProductButton from "./DeleteProductButton";

export const metadata = { title: "Manage Products — Fitrah Admin" };

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const { data: products } = await supabase.from("products").select("*").order("name");
  const { data: paymentSettings } = await supabase.from("payment_settings").select("currency").single();

  let currencySymbol = "$";
  if (paymentSettings?.currency === "PKR") currencySymbol = "Rs ";
  else if (paymentSettings?.currency === "GBP") currencySymbol = "£";
  else if (paymentSettings?.currency === "EUR") currencySymbol = "€";

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 border border-black/10 rounded-sm">
        <div>
          <h1 className="font-serif text-3xl text-brand-black mb-1">Products</h1>
          <p className="font-sans text-sm text-brand-muted">Manage your store catalog</p>
        </div>
        <Link href="/admin/products/add" className="flex items-center gap-2 bg-[#111] text-white px-6 py-3 rounded-md font-sans text-xs uppercase tracking-widest font-semibold hover:bg-black transition-colors">
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>

      <div className="bg-white border border-black/10 rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-sm">
            <thead className="bg-black/5 text-brand-muted text-xs uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4 font-semibold w-16">Image</th>
                <th className="px-6 py-4 font-semibold">Product Info</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold text-right">Price</th>
                <th className="px-6 py-4 font-semibold text-center">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {products?.map((product) => (
                <tr key={product.id} className="hover:bg-black/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="w-12 h-12 rounded bg-black/5 overflow-hidden flex items-center justify-center p-1" style={{ backgroundColor: product.bg }}>
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover mix-blend-multiply" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-brand-black text-base">{product.name}</div>
                    <div className="text-brand-muted text-xs mt-0.5">{product.subtitle}</div>
                  </td>
                  <td className="px-6 py-4 text-brand-muted">{product.purpose}</td>
                  <td className="px-6 py-4 text-right font-medium text-brand-black">{currencySymbol}{product.price}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold ${
                      product.stock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {product.stock ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/products/${product.id}/edit`} className="p-2 text-brand-muted hover:text-brand-black hover:bg-black/5 rounded-md transition-colors" title="Edit">
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <DeleteProductButton id={product.id} />
                    </div>
                  </td>
                </tr>
              ))}
              
              {!products?.length && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-brand-muted font-sans text-sm">
                    No products found. Add your first product to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
