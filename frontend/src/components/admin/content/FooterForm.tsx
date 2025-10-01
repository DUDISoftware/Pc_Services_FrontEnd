"use client";

import { useEffect, useState } from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { infoService } from "@/services/info.services";

export default function FooterForm() {
  const [formData, setFormData] = useState({
    phone: "",
    email: "",
    address: "",
    facebook: "",
    instagram: "",
    youtube: "",
    x: "",
  });

  const [termsFile, setTermsFile] = useState<File | null>(null);
  const [policyFile, setPolicyFile] = useState<File | null>(null);
  const [termsProgress, setTermsProgress] = useState(0);
  const [policyProgress, setPolicyProgress] = useState(0);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const data = await infoService.getInfo();
        setFormData({
          phone: data.phone || "",
          email: data.email || "",
          address: data.address || "",
          facebook: data.facebook || "",
          instagram: data.instagram || "",
          youtube: data.youtube || "",
          x: data.x || "",
        });
      } catch (error) {
        console.error("Failed to fetch info", error);
      }
    };
    fetchInfo();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // đọc file từ máy lên browser và hiển thị % đọc
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "terms" | "policy"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        type === "terms"
          ? setTermsProgress(percent)
          : setPolicyProgress(percent);
      }
    };

    reader.onloadend = () => {
      if (type === "terms") {
        setTermsFile(file);
        setTermsProgress(100);
      } else {
        setPolicyFile(file);
        setPolicyProgress(100);
      }
    };

    // Đọc file để kích hoạt progress
    reader.readAsArrayBuffer(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await infoService.updateInfo(formData);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <h3 className="text-sm font-semibold text-gray-700">THÔNG TIN LIÊN HỆ</h3>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">Số điện thoại</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Nhập Số điện thoại"
          className="w-full rounded-md border border-gray-200 bg-gray-100 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Nhập Email"
          className="w-full rounded-md border border-gray-200 bg-gray-100 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">Địa chỉ</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Nhập địa chỉ"
          className="w-full rounded-md border border-gray-200 bg-gray-100 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Social media */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center border rounded-md bg-gray-50 px-3">
          <FaFacebook className="text-blue-600 mr-2" />
          <input
            type="text"
            name="facebook"
            value={formData.facebook}
            onChange={handleChange}
            placeholder="Facebook"
            className="w-full bg-transparent p-2 text-sm focus:outline-none"
          />
        </div>
        <div className="flex items-center border rounded-md bg-gray-50 px-3">
          <FaInstagram className="text-pink-500 mr-2" />
          <input
            type="text"
            name="instagram"
            value={formData.instagram}
            onChange={handleChange}
            placeholder="Instagram"
            className="w-full bg-transparent p-2 text-sm focus:outline-none"
          />
        </div>
        <div className="flex items-center border rounded-md bg-gray-50 px-3">
          <FaTwitter className="text-sky-500 mr-2" />
          <input
            type="text"
            name="x"
            value={formData.x}
            onChange={handleChange}
            placeholder="Twitter / X"
            className="w-full bg-transparent p-2 text-sm focus:outline-none"
          />
        </div>
        <div className="flex items-center border rounded-md bg-gray-50 px-3">
          <FaYoutube className="text-red-500 mr-2" />
          <input
            type="text"
            name="youtube"
            value={formData.youtube}
            onChange={handleChange}
            placeholder="YouTube"
            className="w-full bg-transparent p-2 text-sm focus:outline-none"
          />
        </div>
      </div>

      {/* Upload files */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Cập nhật Điều khoản sử dụng
          </label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => handleFileChange(e, "terms")}
            className="block w-full text-sm border border-dashed rounded-md p-2 cursor-pointer"
          />
          {termsProgress > 0 && (
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${termsProgress}%` }}
              />
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Cập nhật chính sách
          </label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => handleFileChange(e, "policy")}
            className="block w-full text-sm border border-dashed rounded-md p-2 cursor-pointer"
          />
          {policyProgress > 0 && (
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all"
                style={{ width: `${policyProgress}%` }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end items-center gap-4 pt-4">
        <button
          type="button"
          className="text-gray-600 text-sm font-medium hover:underline"
        >
          Quay lại
        </button>
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-5 py-2 text-white text-sm font-medium hover:bg-blue-700"
        >
          Cập nhật
        </button>
      </div>
    </form>
  );
}
