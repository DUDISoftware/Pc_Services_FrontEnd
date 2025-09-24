import { useState, useEffect } from "react";
import { Upload } from "lucide-react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { bannerService } from "@/services/banner.services";

const templates = {
  template1: [
    { id: "1", type: "large" },
    { id: "2", type: "small-top" },
    { id: "3", type: "small-bottom" },
  ],
  template2: [
    { id: "1", type: "wide" },
  ],
  template3: [
    { id: "1", type: "medium" },
    { id: "2", type: "medium" },
    { id: "3", type: "medium" },
    { id: "4", type: "medium" },
  ],
};

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

export default function DragDropBannerLayout() {
  const [selectedTemplate, setSelectedTemplate] = useState<"template1" | "template2" | "template3">("template1");
  const [items, setItems] = useState(templates[selectedTemplate]);
  const [images, setImages] = useState<Record<string, string>>({});
  const [activeSlot, setActiveSlot] = useState<string | null>(null);
  const [showGallery, setShowGallery] = useState(false);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await bannerService.getAll();
        const data = res.banners;
        const valid = data.filter((b) => b.position > 0 && b.position <= 4);

        // Map to images and sorted items
        const newImages: Record<string, string> = {};
        const newItems = valid
          .sort((a, b) => a.position - b.position)
          .map((b) => {
            const id = b.position.toString();
            newImages[id] = typeof b.image === "string" ? b.image : b.image?.url || "";
            return { id, type: "medium" };
          });

        setImages(newImages);
        setItems(newItems);
      } catch (err) {
        console.error("Lỗi khi tải banner:", err);
      }
    };

    fetchBanners();
  }, [selectedTemplate]);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      const reordered = arrayMove(items, oldIndex, newIndex);
      setItems(reordered);

      // cập nhật lại vị trí mới (nếu cần gửi về server)
      console.log("New position order:", reordered.map((item, idx) => ({ id: item.id, newPosition: idx + 1 })));
    }
  };

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const template = e.target.value as "template1" | "template2" | "template3";
    setSelectedTemplate(template);
    setItems(templates[template]);
    setImages({});
  };

  const handleSlotClick = (id: string) => {
    setActiveSlot(id);
    setShowGallery(true);
  };

  const handleImageSelect = (src: string) => {
    if (activeSlot) {
      setImages((prev) => ({ ...prev, [activeSlot]: src }));
    }
    setShowGallery(false);
    setActiveSlot(null);
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Kéo thả để sắp xếp banner</h2>

      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium">Chọn giao diện:</label>
        <select
          value={selectedTemplate}
          onChange={handleTemplateChange}
          className="border px-3 py-2 rounded w-full"
        >
          <option value="template1">Template 1: 1 ảnh lớn trái, 2 ảnh nhỏ phải</option>
          <option value="template2">Template 2: 1 ảnh lớn toàn banner</option>
          <option value="template3">Template 3: 4 ảnh vừa</option>
        </select>
      </div>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {selectedTemplate === "template1" ? (
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 h-64">
                <SortableImage id="1" image={images["1"]} onClick={handleSlotClick} />
              </div>
              <div className="flex flex-col gap-4 h-64">
                <div className="flex-1">
                  <SortableImage id="2" image={images["2"]} onClick={handleSlotClick} />
                </div>
                <div className="flex-1">
                  <SortableImage id="3" image={images["3"]} onClick={handleSlotClick} />
                </div>
              </div>
            </div>
          ) : selectedTemplate === "template3" ? (
            <div className="grid grid-cols-2 gap-4">
              {items.map((item) => (
                <div key={item.id} className="h-40">
                  <SortableImage id={item.id} image={images[item.id]} onClick={handleSlotClick} />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-4">
              {items.map((item) => (
                <div key={item.id} className="h-64 w-full">
                  <SortableImage id={item.id} image={images[item.id]} onClick={handleSlotClick} />
                </div>
              ))}
            </div>
          )}
        </SortableContext>
      </DndContext>

      {/* Gallery Modal */}
      {showGallery && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow max-w-md w-full">
            <h3 className="text-lg font-semibold mb-2">Chọn ảnh</h3>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(images).map(([key, src], i) => (
                <img
                  key={key}
                  src={src}
                  alt={`img-${i}`}
                  onClick={() => handleImageSelect(src)}
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