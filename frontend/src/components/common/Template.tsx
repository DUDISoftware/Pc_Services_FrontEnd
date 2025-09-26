/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { Upload } from "lucide-react";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { bannerService } from "@/services/banner.service";

type BannerItem = {
  id: string;
  _id: string;
  image: string;
  position: number;
};

export default function DragDropBannerLayout() {
  const [selectedTemplate, setSelectedTemplate] = useState<"template1" | "template2" | "template3">("template3");
  const [items, setItems] = useState<BannerItem[]>([]);
  const [activeSlot, setActiveSlot] = useState<string | null>(null);
  const [showGallery, setShowGallery] = useState(false);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await bannerService.getAll();
        const data = res.banners;
        const valid = data.filter((b) => b.position > 0 && b.position <= 4);

        const mapped: BannerItem[] = valid
          .sort((a, b) => a.position - b.position)
          .map((b, index) => ({
            id: (index + 1).toString(),
            _id: b._id,
            image: typeof b.image === "string" ? b.image : b.image?.url || "",
            position: b.position,
          }));

        setItems(mapped);
      } catch (err) {
        console.error("Lỗi khi tải banner:", err);
      }
    };

    fetchBanners();
  }, [selectedTemplate]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    const newItems = arrayMove(items, oldIndex, newIndex);
    setItems(newItems);

    try {
      await Promise.all(
        newItems.map((item, index) =>
          bannerService.update(item._id, { position: index + 1 })
        )
      );
      console.log("Đã cập nhật vị trí thành công.");
    } catch (err) {
      console.error("Lỗi khi cập nhật position:", err);
    }
  };

  const handleSlotClick = (id: string) => {
    setActiveSlot(id);
    setShowGallery(true);
  };

  const handleImageSelect = (src: string) => {
    if (activeSlot) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === activeSlot ? { ...item, image: src } : item
        )
      );
    }
    setShowGallery(false);
    setActiveSlot(null);
  };

  const renderTemplate = () => {
    if (selectedTemplate === "template1") {
      return (
        <div className="grid grid-cols-3 gap-4 h-64">
          <div className="col-span-2">
            <SortableImage id="1" image={items[0]?.image} onClick={handleSlotClick} />
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex-1">
              <SortableImage id="2" image={items[1]?.image} onClick={handleSlotClick} />
            </div>
            <div className="flex-1">
              <SortableImage id="3" image={items[2]?.image} onClick={handleSlotClick} />
            </div>
          </div>
        </div>
      );
    } else if (selectedTemplate === "template2") {
      return (
        <div className="h-64">
          <SortableImage id="1" image={items[0]?.image} onClick={handleSlotClick} />
        </div>
      );
    } else {
      return (
        <div className="grid grid-cols-2 gap-4">
          {items.map((item) => (
            <SortableImage key={item.id} id={item.id} image={item.image} onClick={handleSlotClick} />
          ))}
        </div>
      );
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Kéo thả để sắp xếp banner</h2>

      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium">Chọn bố cục hiển thị:</label>
        <select
          value={selectedTemplate}
          onChange={(e) => setSelectedTemplate(e.target.value as any)}
          className="border px-3 py-2 rounded w-full"
        >
          <option value="template1">Template 1: 1 ảnh lớn trái, 2 ảnh nhỏ phải</option>
          <option value="template2">Template 2: 1 ảnh lớn toàn banner</option>
          <option value="template3">Template 3: 4 ảnh vừa</option>
        </select>
      </div>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          {renderTemplate()}
        </SortableContext>
      </DndContext>

      {showGallery && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow max-w-md w-full">
            <h3 className="text-lg font-semibold mb-2">Chọn ảnh</h3>
            <div className="grid grid-cols-3 gap-3">
              {items.map((img, i) => (
                <img
                  key={img._id}
                  src={img.image}
                  alt={`img-${i}`}
                  onClick={() => handleImageSelect(img.image)}
                  className="h-24 w-full object-cover rounded cursor-pointer hover:ring-2 hover:ring-blue-500"
                />
              ))}
            </div>
            <button
              className="mt-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              onClick={() => setShowGallery(false)}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SortableImage({ id, image, onClick }: {
  id: string;
  image?: string;
  onClick: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

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
      onClick={() => onClick(id)}
      className="rounded-md border border-black bg-gray-100 flex items-center justify-center overflow-hidden cursor-pointer"
    >
      {image ? (
        <img src={image} alt="Image" className="w-full h-full object-cover" />
      ) : (
        <div className="flex flex-col items-center text-gray-400 text-sm">
          <Upload className="h-6 w-6 mb-1" />
          Ảnh {id}
        </div>
      )}
    </div>
  );
}
