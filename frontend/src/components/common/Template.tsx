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
import { bannerService } from "@/services/banner.services";

interface BannerItem {
  index: number;
  _id: string;
  image: string;
  position: number;
}

const templates = {
  template1: ["large", "small", "small"],
  template2: ["wide"],
  template3: ["medium", "medium", "medium", "medium"],
};

export default function DragDropBannerLayout() {
  const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof templates>("template3");
  const [items, setItems] = useState<BannerItem[]>([]);
  const [galleryItems, setGalleryItems] = useState<BannerItem[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [showGallery, setShowGallery] = useState(false);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await bannerService.getAll();
        const data = res.banners;

        const active = data
          .filter((b) => b.position > 0 && b.position <= 4)
          .sort((a, b) => a.position - b.position)
          .map((b, i) => ({
            index: i,
            _id: b._id,
            image: typeof b.image === "string" ? b.image : b.image?.url || "",
            position: b.position,
          }));

        const gallery = data
          .filter((b) => b.position === 0)
          .map((b) => ({
            index: -1,
            _id: b._id,
            image: typeof b.image === "string" ? b.image : b.image?.url || "",
            position: b.position,
          }));

        setItems(active);
        setGalleryItems(gallery);
      } catch (err) {
        console.error("Lỗi khi tải banner:", err);
      }
    };

    fetchBanners();
  }, [selectedTemplate]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = parseInt(active.id as string);
    const newIndex = parseInt(over.id as string);

    const newItems = [...items];
    const temp = newItems[oldIndex];
    newItems[oldIndex] = { ...newItems[newIndex], index: oldIndex };
    newItems[newIndex] = { ...temp, index: newIndex };
    setItems(newItems);

    try {
      await bannerService.update(newItems[oldIndex]._id, { position: oldIndex + 1 });
      await bannerService.update(newItems[newIndex]._id, { position: newIndex + 1 });
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
      await bannerService.update(old._id, { position: 0 });
      await bannerService.update(selectedImage._id, { position: activeIndex + 1 });

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

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Kéo thả để sắp xếp banner</h2>

      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium">Chọn template:</label>
        <select
          value={selectedTemplate}
          onChange={(e) => setSelectedTemplate(e.target.value as keyof typeof templates)}
          className="border px-3 py-2 rounded w-full"
        >
          <option value="template1">Template 1: 1 lớn trái, 2 nhỏ phải</option>
          <option value="template2">Template 2: 1 ảnh rộng</option>
          <option value="template3">Template 3: 4 ảnh vuông</option>
        </select>
      </div>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((_, i) => i.toString())} strategy={verticalListSortingStrategy}>
          {selectedTemplate === "template1" && (
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 h-[200px]">
                <SortableImage index={0} image={items[0]?.image} onDoubleClick={handleSlotDoubleClick} />
              </div>
              <div className="flex flex-col justify-between gap-4 h-[200px]">
                <SortableImage index={1} image={items[1]?.image} onDoubleClick={handleSlotDoubleClick} />
                <SortableImage index={2} image={items[2]?.image} onDoubleClick={handleSlotDoubleClick} />
              </div>
            </div>
          )}

          {selectedTemplate === "template2" && (
            <div className="w-full">
              <SortableImage index={0} image={items[0]?.image} onDoubleClick={handleSlotDoubleClick} />
            </div>
          )}

          {selectedTemplate === "template3" && (
            <div className="grid grid-cols-2 gap-4">
              {items.map((item, idx) => (
                <SortableImage key={item._id} index={idx} image={item.image} onDoubleClick={handleSlotDoubleClick} />
              ))}
            </div>
          )}
        </SortableContext>
      </DndContext>

      {showGallery && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow max-w-md w-full">
            <h3 className="text-lg font-semibold mb-2">Chọn ảnh mới</h3>
            <div className="grid grid-cols-3 gap-3">
              {galleryItems.map((img, i) => (
                <img
                  key={img._id}
                  src={img.image}
                  alt={`gallery-${i}`}
                  onClick={() => handleImageSelect(img)}
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

function SortableImage({ index, image, onDoubleClick }: {
  index: number;
  image?: string;
  onDoubleClick: (index: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: index.toString() });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    height: "160px",
    width: "100%",
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      onDoubleClick={() => onDoubleClick(index)}
      className="rounded-md border border-black bg-gray-100 flex items-center justify-center overflow-hidden cursor-pointer"
    >
      {image ? (
        <img src={image} alt="Image" className="w-full h-full object-cover" />
      ) : (
        <div className="flex flex-col items-center text-gray-400 text-sm">
          <Upload className="h-6 w-6 mb-1" />
          Slot {index + 1}
        </div>
      )}
    </div>
  );
}
