import { Product, ProductApi, UploadedImage } from "@/types/Product";
import { Category, CategoryApi } from "@/types/Category";
import { Rating, RatingApi } from "@/types/Rating";
import { Service, ServiceApi } from "@/types/Service";
import { Request, RequestApi } from "@/types/Request";
// lib/mappers.ts
import { Banner, BannerApi, LayoutOption } from "@/types/Banner";

/** Convert FE layout -> BE numeric */
export function mapLayoutToApi(layout?: LayoutOption | number): number | undefined {
  if (!layout && layout !== 0) return undefined;
  if (typeof layout === "number") return layout;
  switch (layout) {
    case "option1":
      return 1;
    case "option2":
      return 2;
    case "option3":
      return 3;
    default:
      return undefined;
  }
}

/** Convert BE numeric -> FE layout string */
export function mapLayoutFromApi(layout?: number): LayoutOption | undefined {
  if (!layout && layout !== 0) return undefined;
  switch (layout) {
    case 1:
      return "option1";
    case 2:
      return "option2";
    case 3:
      return "option3";
    default:
      return undefined;
  }
}

/** Map API banner -> FE Banner type (includes size & layout converted) */
export function mapBanner(apiData: BannerApi): Banner {
  return {
    _id: apiData._id,
    title: apiData.title,
    description: apiData.description,
    image: {
      url: apiData.image?.url || "",
      public_id: apiData.image?.public_id,
    },
    link: apiData.link,
    position: apiData.position,
    layout: mapLayoutFromApi(apiData.layout),
    size: apiData.size ?? undefined,
  };
}



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
    ports: apiData.ports || [],
    panel: apiData.panel,
    size: apiData.size,

    category_id:
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

    createdAt: apiData.createdAt,
    updatedAt: apiData.updatedAt,
  };
}

export function mapService(apiData: ServiceApi): Service {
  return {
    _id: apiData._id,
    name: apiData.name,
    description: apiData.description,
    price: apiData.price,
    type: apiData.type,
    slug: apiData.slug,
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
    createdAt: apiData.createdAt,
    updatedAt: apiData.updatedAt,
  };
}
