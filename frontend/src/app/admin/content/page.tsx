// app/admin/static-content/page.tsx
import Tabs from "@/components/common/Tabs";
import BannerForm from "@/components/admin/content/BannerForm";
import InfoForm from "@/components/admin/content/InfoForm";
import FooterForm from "@/components/admin/content/FooterForm";
import TableHeader from "@/components/admin/TableHeader";
import Button from "@/components/common/Button";

export default function StaticContentPage() {
  const tabs = [
    { label: "Chỉnh sửa Banner", value: "banner", content: <BannerForm /> },
    { label: "Chỉnh sửa thông tin", value: "info", content: <InfoForm /> },
    { label: "Cập nhật footer", value: "footer", content: <FooterForm /> },
  ];

  return (
    <div className="p-6 bg-white shadow rounded-xl">
         {/* Header */}
         <TableHeader
           title="Quản lý nội dung tĩnh"
           breadcrumb={["Admin", "Quản lý nội dung tĩnh"]}
         />
   
      <Tabs tabs={tabs} />
    </div>
  );
}
