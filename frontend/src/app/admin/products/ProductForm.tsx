"use client";

import { useState } from "react";
import { saveProduct } from "../actions";
import { ArrowLeft, Save, Upload } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCurrency } from "@/context/CurrencyContext";

export default function ProductForm({ product, categories }: { product?: any, categories: any[] }) {
  const router = useRouter();
  const { currencySymbol } = useCurrency();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState(product?.image || null);
  const [existingGallery, setExistingGallery] = useState<string[]>(product?.gallery_images || []);
  const [newGalleryFiles, setNewGalleryFiles] = useState<{file: File, preview: string, base64: string}[]>([]);
  const [mainImageBase64, setMainImageBase64] = useState<{name: string, base64: string} | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    const formData = new FormData(e.currentTarget);

    // Remove native file input data (can't serialize Files through server actions)
    formData.delete("image_file");

    // Set existing gallery URLs
    formData.set("existing_gallery", JSON.stringify(existingGallery));

    // Set new gallery images as base64
    const galleryPayload = newGalleryFiles.map(f => ({ name: f.file.name, base64: f.base64 }));
    formData.set("new_gallery_base64", JSON.stringify(galleryPayload));

    // Set main image base64 if changed
    if (mainImageBase64) {
      formData.set("main_image_base64", JSON.stringify(mainImageBase64));
    }

    try {
      await saveProduct(formData, product?.id);
      router.push("/admin/products");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save product. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      const reader = new FileReader();
      reader.onload = (ev) => {
        setMainImageBase64({ name: file.name, base64: ev.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          setNewGalleryFiles(prev => [...prev, {
            file,
            preview: URL.createObjectURL(file),
            base64: ev.target?.result as string
          }]);
        };
        reader.readAsDataURL(file);
      });
    }
    e.target.value = '';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="p-2 border border-black/10 rounded-md text-brand-muted hover:text-brand-black hover:bg-black/5 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="font-serif text-3xl text-brand-black">
            {product ? "Edit Product" : "Add New Product"}
          </h1>
        </div>
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="flex items-center gap-2 bg-[#111] text-white px-8 py-3 rounded-md font-sans text-xs uppercase tracking-widest font-semibold hover:bg-black transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" /> {isSubmitting ? "Saving..." : "Save Product"}
        </button>
      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-md font-sans text-sm">
          <strong>Error:</strong> {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-black/10 p-8 rounded-sm space-y-6">
            <h2 className="font-serif text-xl text-brand-black border-b border-black/10 pb-4">Basic Details</h2>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">Product Name</label>
                <input type="text" name="name" defaultValue={product?.name} required className="w-full bg-[#faf9f6] border border-black/10 p-3 font-sans text-sm text-brand-black focus:outline-none focus:border-brand-black transition-colors" />
              </div>
              <div>
                <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">Arabic Name (Optional)</label>
                <input type="text" name="arabic" defaultValue={product?.arabic} className="w-full bg-[#faf9f6] border border-black/10 p-3 font-sans text-sm text-brand-black focus:outline-none focus:border-brand-black transition-colors" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">Subtitle</label>
                <input type="text" name="subtitle" defaultValue={product?.subtitle} required className="w-full bg-[#faf9f6] border border-black/10 p-3 font-sans text-sm text-brand-black focus:outline-none focus:border-brand-black transition-colors" />
              </div>
              <div>
                <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">Tagline</label>
                <input type="text" name="tagline" defaultValue={product?.tagline} required className="w-full bg-[#faf9f6] border border-black/10 p-3 font-sans text-sm text-brand-black focus:outline-none focus:border-brand-black transition-colors" />
              </div>
            </div>

            <div>
              <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">Description</label>
              <textarea name="description" defaultValue={product?.description} required rows={5} className="w-full bg-[#faf9f6] border border-black/10 p-3 font-sans text-sm text-brand-black focus:outline-none focus:border-brand-black transition-colors"></textarea>
            </div>
            
            <div>
              <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">How to Use</label>
              <textarea name="how_to_use" defaultValue={product?.how_to_use} required rows={3} className="w-full bg-[#faf9f6] border border-black/10 p-3 font-sans text-sm text-brand-black focus:outline-none focus:border-brand-black transition-colors"></textarea>
            </div>
          </div>

          <div className="bg-white border border-black/10 p-8 rounded-sm space-y-6">
            <h2 className="font-serif text-xl text-brand-black border-b border-black/10 pb-4">Attributes</h2>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">Category</label>
                <select name="category_id" defaultValue={product?.category_id || ""} className="w-full bg-[#faf9f6] border border-black/10 p-3 font-sans text-sm text-brand-black focus:outline-none focus:border-brand-black transition-colors">
                  <option value="">No Category</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">Purpose (e.g. Growth, Hydration)</label>
                <input type="text" name="purpose" defaultValue={product?.purpose} required className="w-full bg-[#faf9f6] border border-black/10 p-3 font-sans text-sm text-brand-black focus:outline-none focus:border-brand-black transition-colors" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">Scent Profile</label>
                <input type="text" name="scent" defaultValue={product?.scent} required className="w-full bg-[#faf9f6] border border-black/10 p-3 font-sans text-sm text-brand-black focus:outline-none focus:border-brand-black transition-colors" />
              </div>
              <div>
                <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">Size</label>
                <input type="text" name="size" defaultValue={product?.size || "30ml"} required className="w-full bg-[#faf9f6] border border-black/10 p-3 font-sans text-sm text-brand-black focus:outline-none focus:border-brand-black transition-colors" />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-8">
          
          <div className="bg-white border border-black/10 p-8 rounded-sm space-y-6">
            <h2 className="font-serif text-xl text-brand-black border-b border-black/10 pb-4">Media</h2>
            
            <div>
              <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">Main Product Image</label>
              <div className="aspect-[3/4] bg-[#faf9f6] border border-black/10 rounded-sm relative overflow-hidden flex items-center justify-center mb-1">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover mix-blend-multiply" />
                ) : (
                  <div className="text-center text-brand-muted">
                    <Upload className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <span className="font-sans text-xs uppercase tracking-widest">No Image</span>
                  </div>
                )}
                <input type="file" name="image_file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                <input type="hidden" name="image" value={product?.image || ""} />
              </div>
              <p className="font-sans text-[10px] text-brand-muted text-center">Click to upload new main image</p>
            </div>

            <div>
              <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">Gallery Images</label>
              
              <div className="grid grid-cols-3 gap-2 mb-2">
                {existingGallery.map((url: string, idx: number) => (
                  <div key={`old-${idx}`} className="aspect-square bg-[#faf9f6] border border-black/10 rounded-sm overflow-hidden relative">
                    <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover mix-blend-multiply" />
                    <button 
                      type="button"
                      onClick={() => setExistingGallery(prev => prev.filter((_, i) => i !== idx))}
                      className="absolute top-1 right-1 bg-white/90 hover:bg-red-500 hover:text-white text-red-500 rounded p-1 transition-all"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    </button>
                  </div>
                ))}
                
                {newGalleryFiles.map((fileObj, idx) => (
                  <div key={`new-${idx}`} className="aspect-square bg-[#faf9f6] border border-blue-500/30 rounded-sm overflow-hidden relative">
                    <img src={fileObj.preview} alt={`New Gallery ${idx}`} className="w-full h-full object-cover mix-blend-multiply opacity-80" />
                    <button 
                      type="button"
                      onClick={() => setNewGalleryFiles(prev => prev.filter((_, i) => i !== idx))}
                      className="absolute top-1 right-1 bg-white/90 hover:bg-red-500 hover:text-white text-red-500 rounded p-1 transition-all"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    </button>
                    <span className="absolute bottom-0 left-0 right-0 bg-blue-500 text-white text-[8px] text-center uppercase tracking-widest py-0.5">New</span>
                  </div>
                ))}
              </div>

              <div className="border border-black/10 border-dashed rounded-sm p-4 text-center relative cursor-pointer hover:bg-black/5 transition-colors">
                <Upload className="w-5 h-5 mx-auto text-brand-muted mb-1" />
                <span className="font-sans text-[10px] text-brand-muted uppercase tracking-widest">Add More Images</span>
                <input type="file" accept="image/*" multiple onChange={handleGalleryChange} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-black/10 p-8 rounded-sm space-y-6">
            <h2 className="font-serif text-xl text-brand-black border-b border-black/10 pb-4">Pricing & Inventory</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">Price ({currencySymbol.trim()})</label>
                <input type="number" step="0.01" name="price" defaultValue={product?.price} required className="w-full bg-[#faf9f6] border border-black/10 p-3 font-sans text-sm text-brand-black focus:outline-none focus:border-brand-black transition-colors" />
              </div>
              <div>
                <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">Sale Price ({currencySymbol.trim()})</label>
                <input type="number" step="0.01" name="sale_price" defaultValue={product?.sale_price} className="w-full bg-[#faf9f6] border border-black/10 p-3 font-sans text-sm text-brand-black focus:outline-none focus:border-brand-black transition-colors" />
              </div>
            </div>

            <div>
              <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">Stock Status</label>
              <select name="stock" defaultValue={product?.stock ? "true" : "false"} className="w-full bg-[#faf9f6] border border-black/10 p-3 font-sans text-sm text-brand-black focus:outline-none focus:border-brand-black transition-colors">
                <option value="true">In Stock</option>
                <option value="false">Out of Stock</option>
              </select>
            </div>
          </div>

          <div className="bg-white border border-black/10 p-8 rounded-sm space-y-6">
            <h2 className="font-serif text-xl text-brand-black border-b border-black/10 pb-4">Styling</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">Background Color</label>
                <input type="text" name="bg" defaultValue={product?.bg || "#ebebeb"} placeholder="#HEX" className="w-full bg-[#faf9f6] border border-black/10 p-3 font-sans text-sm text-brand-black focus:outline-none focus:border-brand-black transition-colors" />
              </div>
              <div>
                <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">Text Color</label>
                <input type="text" name="text_color" defaultValue={product?.text_color || "#111111"} placeholder="#HEX" className="w-full bg-[#faf9f6] border border-black/10 p-3 font-sans text-sm text-brand-black focus:outline-none focus:border-brand-black transition-colors" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="col-span-2">
                <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">Accent Color</label>
                <input type="text" name="accent" defaultValue={product?.accent || "#dce5ec"} placeholder="#HEX" className="w-full bg-[#faf9f6] border border-black/10 p-3 font-sans text-sm text-brand-black focus:outline-none focus:border-brand-black transition-colors" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-black/10 p-8 rounded-sm space-y-6 mt-8">
            <h2 className="font-serif text-xl text-brand-black border-b border-black/10 pb-4">Ingredients</h2>
            <div>
              <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">List of Ingredients (Comma Separated)</label>
              <textarea name="ingredients" defaultValue={product?.ingredients?.join(", ")} placeholder="e.g. Argan Oil, Jojoba Oil, Vitamin E" rows={4} className="w-full bg-[#faf9f6] border border-black/10 p-3 font-sans text-sm text-brand-black focus:outline-none focus:border-brand-black transition-colors"></textarea>
              <p className="text-[10px] text-brand-muted mt-2 font-sans">Separate each ingredient with a comma.</p>
            </div>
          </div>

        </div>
      </div>
    </form>
  );
}
