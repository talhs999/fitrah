"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/utils/supabase/admin";

// Use the service_role admin client for ALL write operations.
// The anon key cannot pass RLS policies that check auth.email() = 'admin@fitrah.com'.

export async function deleteProduct(productId: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("products").delete().eq("id", productId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/products", "layout");
  revalidatePath("/shop", "layout");
}

export async function updateOrderStatus(orderId: string, status: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
}

// Category Actions
export async function createCategory(formData: FormData) {
  const name = formData.get("name") as string;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
  
  const supabase = createAdminClient();
  const { error } = await supabase.from("categories").insert([{ name, slug }]);
  
  if (error) throw new Error(error.message);
  revalidatePath("/admin/categories");
}

export async function deleteCategory(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/categories");
}

// Product Actions
export async function saveProduct(formData: FormData, productId?: string) {
  const supabase = createAdminClient();

  const productData = {
    name: formData.get("name") as string,
    arabic: formData.get("arabic") as string,
    subtitle: formData.get("subtitle") as string,
    tagline: formData.get("tagline") as string,
    purpose: formData.get("purpose") as string,
    price: Number(formData.get("price")),
    sale_price: formData.get("sale_price") ? Number(formData.get("sale_price")) : null,
    stock: formData.get("stock") === "true",
    description: formData.get("description") as string,
    how_to_use: formData.get("how_to_use") as string,
    scent: formData.get("scent") as string,
    size: formData.get("size") as string,
    bg: formData.get("bg") as string || "#ebebeb",
    text_color: formData.get("text_color") as string || "#111111",
    accent: formData.get("accent") as string || "#dce5ec",
    category_id: formData.get("category_id") as string || null,
    ingredients: (formData.get("ingredients") as string || "").split(",").map(i => i.trim()).filter(Boolean),
  };

  // --- IMAGE HANDLING ---
  // Main image: check if a new base64 image was sent from the client
  let imageUrl = formData.get("image") as string;
  const mainImageBase64 = formData.get("main_image_base64") as string;
  if (mainImageBase64) {
    try {
      const parsed = JSON.parse(mainImageBase64);
      const base64Data = parsed.base64;
      const fileName = parsed.name;
      if (base64Data && base64Data.includes(",")) {
        const [header, data] = base64Data.split(",");
        const mime = header.match(/:(.*?);/)?.[1] || "image/jpeg";
        const binary = Buffer.from(data, "base64");
        const ext = fileName.split(".").pop() || "jpg";
        const storageName = `${Date.now()}_main.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("product-images")
          .upload(storageName, binary, { contentType: mime, upsert: true });
        if (upErr) throw new Error(`Main image upload: ${upErr.message}`);
        const { data: { publicUrl } } = supabase.storage.from("product-images").getPublicUrl(storageName);
        imageUrl = publicUrl;
      }
    } catch (e: any) {
      throw new Error(`Image processing error: ${e.message}`);
    }
  }

  // Gallery images: merge existing URLs with newly uploaded ones
  let galleryImages: string[] = [];
  const existingGalleryStr = formData.get("existing_gallery") as string;
  if (existingGalleryStr) {
    try { galleryImages = JSON.parse(existingGalleryStr); } catch {}
  }

  const newGalleryBase64 = formData.get("new_gallery_base64") as string;
  if (newGalleryBase64) {
    try {
      const files = JSON.parse(newGalleryBase64);
      for (const fileObj of files) {
        if (!fileObj.base64 || !fileObj.base64.includes(",")) continue;
        const [header, data] = fileObj.base64.split(",");
        const mime = header.match(/:(.*?);/)?.[1] || "image/jpeg";
        const binary = Buffer.from(data, "base64");
        const ext = fileObj.name.split(".").pop() || "jpg";
        const storageName = `${Date.now()}_gallery_${Math.random().toString(36).substring(7)}.${ext}`;
        const { error: gErr } = await supabase.storage
          .from("product-images")
          .upload(storageName, binary, { contentType: mime, upsert: true });
        if (gErr) throw new Error(`Gallery upload: ${gErr.message}`);
        const { data: { publicUrl } } = supabase.storage.from("product-images").getPublicUrl(storageName);
        galleryImages.push(publicUrl);
      }
    } catch (e: any) {
      throw new Error(`Gallery processing error: ${e.message}`);
    }
  }

  const finalData = { ...productData, image: imageUrl, gallery_images: galleryImages };

  // Insert or Update
  if (productId) {
    const { error } = await supabase.from("products").update(finalData).eq("id", productId);
    if (error) throw new Error(error.message);
  } else {
    const id = finalData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const { error } = await supabase.from("products").insert([{ id, ...finalData }]);
    if (error) throw new Error(error.message);
  }

  revalidatePath("/admin/products", "layout");
  revalidatePath("/shop", "layout");
}
