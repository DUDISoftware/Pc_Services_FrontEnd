import { Product, ProductApi, UploadedImage } from "@/types/Product";
import { Category, CategoryApi } from "@/types/Category";

export function mapCategory(apiData: CategoryApi): Category {
  return {
    _id: apiData._id,
    name: apiData.name,
    slug: apiData.slug,
    tags: apiData.tags || [],
    description: apiData.description,
    createdAt: apiData.created_at,
    updatedAt: apiData.updated_at,
  };
}

export function mapProduct(apiData: ProductApi): Product {
  return {
    _id: apiData._id,
    name: apiData.name,
    tags: apiData.tags || [],
    slug: apiData.slug,
    description: apiData.description ?? "",
    price: apiData.price,
    quantity: apiData.quantity,
    brand: apiData.brand,
    status: apiData.status as Product["status"],

    category:
      typeof apiData.category_id === "object"
        ? { _id: apiData.category_id._id, name: apiData.category_id.name }
        : { _id: apiData.category_id, name: "" },

    category_id:
      typeof apiData.category_id === "string"
        ? apiData.category_id
        : apiData.category_id._id,

    // ánh xạ images → luôn trả UploadedImage[]
    images: Array.isArray(apiData.images)
      ? (apiData.images as UploadedImage[]).map((img) => ({
          url: (img as UploadedImage).url,
          public_id: (img as UploadedImage).public_id,
        }))
      : [],

    createdAt: apiData.created_at,
    updatedAt: apiData.updated_at,
  };
}
