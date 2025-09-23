import { Product, ProductApi, UploadedImage } from "@/types/Product";
import { Category, CategoryApi } from "@/types/Category";
import { Rating, RatingApi } from "@/types/Rating";
import { Service, ServiceApi } from "@/types/Service";
import { Request, RequestApi } from "@/types/Request";

export function mapCategory(apiData: CategoryApi): Category {
  return {
    _id: apiData._id,
    name: apiData.name,
    slug: apiData.slug,
    tags: apiData.tags || [],
    description: apiData.description,
    createdAt: apiData.createdAt,
    updatedAt: apiData.updatedAt,
  };
}

export function mapRating(apiData: RatingApi): Rating {
  return {
    _id: apiData._id,
    product_id: apiData.product_id,
    service_id: apiData.service_id,
    name: apiData.name,
    score: apiData.score,
    comment: apiData.comment,
    created_at: apiData.created_at,
    updated_at: apiData.updated_at,
  };
}

export function mapProduct(apiData: ProductApi): Product {
  return {
    _id: apiData._id,
    name: apiData.name,
    tags: apiData.tags || [],
    slug: apiData.slug,
    description: apiData.description ?? "",
    rating: apiData.rating ?? 0,
    price: apiData.price,
    quantity: apiData.quantity,
    brand: apiData.brand,
    status: apiData.status as Product["status"],
    resolution: apiData.resolution,
    model: apiData.model,
    ports: apiData.ports,
    panel: apiData.panel,
    size: apiData.size,

    category:
    typeof apiData.category_id === "object"
      ? {
          _id: apiData.category_id._id,
          name: apiData.category_id.name,
          slug: apiData.category_id.slug
        }
      : { _id: "", name: "", slug: "" },

    // category_id:
    //   typeof apiData.category._id === "string"
    //     ? apiData.category._id
    //     : apiData.category._id._id,

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

export function mapService(apiData: ServiceApi): Service {
  return {
    _id: apiData._id,
    name: apiData.name,
    description: apiData.description,
    price: apiData.price,
    type: apiData.type,
    estimated_time: apiData.estimated_time,
    status: apiData.status,
    created_at: apiData.created_at,
    updated_at: apiData.updated_at,
    category_id: apiData.category_id,
    images: Array.isArray(apiData.images)
      ? (apiData.images as UploadedImage[]).map((img) => ({
          url: (img as UploadedImage).url,
          public_id: (img as UploadedImage).public_id,
        }))
      : [],
  };
}

export function mapRequest(apiData: RequestApi): Request {
  return {
    _id: apiData._id,
    name: apiData.name,
    email: apiData.email,
    phone: apiData.phone,
    address: apiData.address,
    problem_description: apiData.problem_description,
    items: apiData.items,
    note: apiData.note,
    repair_type: apiData.repair_type,
    estimated_time: apiData.estimated_time,
    status: apiData.status,
    service_id: apiData.service_id,
    images: Array.isArray(apiData.images)
      ? (apiData.images as UploadedImage[]).map((img) => ({
          url: (img as UploadedImage).url,
          public_id: (img as UploadedImage).public_id,
        }))
      : [],
    created_at: apiData.createdAt,
    updated_at: apiData.updatedAt,
  };
}