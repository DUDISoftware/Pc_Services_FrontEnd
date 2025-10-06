// app/admin/static-content/page.tsx
import Tabs from "@/components/common/Tabs";
import BannerForm from "@/components/admin/content/BannerForm";
import DragDropBannerLayout from "@/components/common/Template";
import InfoForm from "@/components/admin/content/InfoForm";
import FooterForm from "@/components/admin/content/FooterForm";
import TableHeader from "@/components/admin/TableHeader";

function BannerTab() {
  return (
    <div className="space-y-8">
      {/* Upload ảnh */}
      <BannerForm />
      {/* Chọn layout + preview/dragdrop */}
      <DragDropBannerLayout />
    </div>
  );
}

export default function StaticContentPage() {
  const tabs = [
    { label: "Chỉnh sửa Banner", value: "banner", content: <BannerTab /> },
    { label: "Chỉnh sửa thông tin", value: "info", content: <InfoForm /> },
    { label: "Cập nhật footer", value: "footer", content: <FooterForm /> },
  ];

  return (
    <div className="p-6 bg-white shadow rounded-xl">
      <TableHeader
        title="Quản lý nội dung tĩnh"
        breadcrumb={["Admin", "Quản lý nội dung tĩnh"]}
      />
      <Tabs tabs={tabs} />
    </div>
  );
}