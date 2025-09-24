"use client";

import { useState, useEffect } from "react";
import { Upload } from "lucide-react";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { bannerService } from "@/services/banner.service";
import Image from "next/image";
import type { Banner, LayoutOption } from "@/types/Banner";

interface BannerItem {
  index: number;
  _id: string;
  image: string;
  position: number;
  layout?: LayoutOption;
  size?: "large" | "small";
}

const layoutTemplates: Record<LayoutOption, string[]> = {
  option1: ["large", "small", "small"],
  option2: ["wide"],
  option3: ["large", "large"],
};

export default function DragDropBannerLayout() {
  const [selectedLayout, setSelectedLayout] = useState<LayoutOption>("option1");
  const [items, setItems] = useState<BannerItem[]>([]);
  const [galleryItems, setGalleryItems] = useState<BannerItem[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [showGallery, setShowGallery] = useState(false);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await bannerService.getAll(); // returns mapped Banner[]
        const data: Banner[] = res.banners;

        // If backend already has layout info, adopt it for selectedLayout
        const serverLayout = data.find((b) => !!b.layout)?.layout;
        if (serverLayout) {
          setSelectedLayout(serverLayout);
        }

        const active: BannerItem[] = data
          .filter((b) => b.position > 0)
          .sort((a, b) => a.position - b.position)
          .map((b, i) => ({
            index: i,
            _id: b._id,
            image: b.image?.url || "",
            position: b.position,
            layout: b.layout,
            size: b.size,
          }));

        const gallery: BannerItem[] = data
          .filter((b) => b.position === 0)
          .map((b) => ({
            index: -1,
            _id: b._id,
            image: b.image?.url || "",
            position: b.position,
            layout: b.layout,
            size: b.size,
          }));

        setItems(active);
        setGalleryItems(gallery);
      } catch (err) {
        console.error("Lỗi khi tải banner:", err);
      }
    };

    fetchBanners();
  }, []);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = parseInt(active.id as string, 10);
    const newIndex = parseInt(over.id as string, 10);

    const newItems = [...items];
    const temp = newItems[oldIndex];
    newItems[oldIndex] = { ...newItems[newIndex], index: oldIndex };
    newItems[newIndex] = { ...temp, index: newIndex };
    setItems(newItems);

    try {
      // include layout so backend can recompute size
      await bannerService.update(newItems[oldIndex]._id, {
        position: oldIndex + 1,
        layout: selectedLayout,
      });
      await bannerService.update(newItems[newIndex]._id, {
        position: newIndex + 1,
        layout: selectedLayout,
      });
    } catch (err) {
      console.error("Lỗi khi cập nhật position:", err);
    }
  };

  const handleSlotDoubleClick = (index: number) => {
    setActiveIndex(index);
    setShowGallery(true);
  };

  const handleImageSelect = async (selectedImage: BannerItem) => {
    if (activeIndex === null) return;

    const old = items[activeIndex];

    try {
      // send layout so backend recalculates size properly
      await bannerService.update(old._id, { position: 0, layout: selectedLayout });
      await bannerService.update(selectedImage._id, {
        position: activeIndex + 1,
        layout: selectedLayout,
      });

      const updated = [...items];
      updated[activeIndex] = {
        ...selectedImage,
        index: activeIndex,
        position: activeIndex + 1,
      };
      setItems(updated);

      setGalleryItems((prev) => prev.filter((img) => img._id !== selectedImage._id).concat(old));
      setShowGallery(false);
      setActiveIndex(null);
    } catch (err) {
      console.error("Lỗi khi thay đổi ảnh:", err);
    }
  };

  // ensure slots rendered even if items[] shorter than expected
  const ensureSlotImage = (idx: number) => items[idx]?.image || "";

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Kéo thả để sắp xếp banner</h2>

      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium">Chọn layout:</label>
        <select
          value={selectedLayout}
          onChange={(e) => setSelectedLayout(e.target.value as LayoutOption)}
          className="border px-3 py-2 rounded w-full"
        >
          <option value="option1">Option 1: 1 lớn trái, 2 nhỏ phải</option>
          <option value="option2">Option 2: 1 banner lớn</option>
          <option value="option3">Option 3: 2 banner lớn (trái + phải)</option>
        </select>
      </div>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((_, i) => i.toString())} strategy={verticalListSortingStrategy}>
          {selectedLayout === "option1" && (
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 h-[200px]">
                <SortableImage index={0} image={ensureSlotImage(0)} onDoubleClick={handleSlotDoubleClick} />
              </div>
              <div className="flex flex-col gap-4">
                <SortableImage index={1} image={ensureSlotImage(1)} onDoubleClick={handleSlotDoubleClick} />
                <SortableImage index={2} image={ensureSlotImage(2)} onDoubleClick={handleSlotDoubleClick} />
              </div>
            </div>
          )}

          {selectedLayout === "option2" && (
            <div className="w-full h-[200px]">
              <SortableImage index={0} image={ensureSlotImage(0)} onDoubleClick={handleSlotDoubleClick} />
            </div>
          )}

          {selectedLayout === "option3" && (
            <div className="grid grid-cols-2 gap-4">
              <SortableImage index={0} image={ensureSlotImage(0)} onDoubleClick={handleSlotDoubleClick} />
              <SortableImage index={1} image={ensureSlotImage(1)} onDoubleClick={handleSlotDoubleClick} />
            </div>
          )}
        </SortableContext>
      </DndContext>

      {showGallery && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow max-w-md w-full">
            <h3 className="text-lg font-semibold mb-2">Chọn ảnh mới</h3>
            <div className="grid grid-cols-3 gap-3">
              {galleryItems.map((img) => (
                <div key={img._id} className="relative h-24 w-full">
                  <Image
                    src={img.image}
                    alt="gallery"
                    fill
                    sizes="100vw"
                    onClick={() => handleImageSelect(img)}
                    className="object-cover rounded cursor-pointer hover:ring-2 hover:ring-blue-500"
                  />
                </div>
              ))}
            </div>
            <button className="mt-4 px-4 py-2 bg-gray-300 rounded" onClick={() => setShowGallery(false)}>
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SortableImage({
  index,
  image,
  onDoubleClick,
}: {
  index: number;
  image?: string;
  onDoubleClick: (index: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: index.toString() });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    height: "100%",
    width: "100%",
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      onDoubleClick={() => onDoubleClick(index)}
      className="relative rounded border bg-gray-100 flex items-center justify-center overflow-hidden cursor-pointer"
    >
      {image ? (
        <Image src={image} alt="banner" fill sizes="100vw" className="object-cover" />
      ) : (
        <div className="flex flex-col items-center text-gray-400 text-sm">
          <Upload className="h-6 w-6 mb-1" />
          Slot {index + 1}
        </div>
      )}
    </div>
  );
}
