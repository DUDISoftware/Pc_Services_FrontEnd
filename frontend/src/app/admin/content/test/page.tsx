"use client";

import { useState } from "react";
import PdfViewer from "../../../../components/admin/content/PdfReader"; // import component mới tạo

import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaFileUpload,
} from "react-icons/fa";

export default function FooterForm() {
  const [termsUrl, setTermsUrl] = useState("");
  const [policyUrl, setPolicyUrl] = useState("");

  const handleUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "terms" | "policy"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (type === "terms") setTermsUrl(url);
      else setPolicyUrl(url);
    }
  };

  return (
    <form className="space-y-6">
      {/* ...Các input liên hệ và social media giữ nguyên... */}

      {/* Upload files */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Upload Terms */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Cập nhật Điều khoản sử dụng
          </label>
          <input
            type="file"
            accept="application/pdf"
            id="upload-terms"
            onChange={(e) => handleUpload(e, "terms")}
            className="hidden"
          />
          <label
            htmlFor="upload-terms"
            className="flex items-center justify-center border-2 border-dashed rounded-md p-4 cursor-pointer text-gray-500 hover:bg-gray-50"
          >
            <FaFileUpload className="mr-2" />
            <span>Tải tệp lên</span>
          </label>
          {termsUrl && (
            <div className="mt-2">
              <PdfViewer fileUrl={termsUrl} />
            </div>
          )}
        </div>

        {/* Upload Policy */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Cập nhật chính sách
          </label>
          <input
            type="file"
            accept="application/pdf"
            id="upload-policy"
            onChange={(e) => handleUpload(e, "policy")}
            className="hidden"
          />
          <label
            htmlFor="upload-policy"
            className="flex items-center justify-center border-2 border-dashed rounded-md p-4 cursor-pointer text-gray-500 hover:bg-gray-50"
          >
            <FaFileUpload className="mr-2" />
            <span>Tải tệp lên</span>
          </label>
          {policyUrl && (
            <div className="mt-2">
              <PdfViewer fileUrl={policyUrl} />
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
