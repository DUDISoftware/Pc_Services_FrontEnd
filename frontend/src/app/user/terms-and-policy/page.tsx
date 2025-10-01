"use client";

import { useEffect, useState } from "react";
import { Viewer } from "@react-pdf-viewer/core";
import { Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import axios from "axios";

interface Info {
  terms: string;
  policy: string;
}

export default function PdfReaderPage() {
  const [info, setInfo] = useState<Info | null>(null);

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/info");
        setInfo(res.data);
      } catch (error) {
        console.error("Failed to load info:", error);
      }
    };

    fetchInfo();
  }, []);

  if (!info) return <p>Đang tải dữ liệu PDF...</p>;

  return (
    <div className="max-w-5xl mx-auto py-10 space-y-12">
      <h1 className="text-2xl font-bold mb-4">📄 Xem file PDF</h1>

      {/* Điều khoản */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Điều khoản sử dụng</h2>
        {info.terms ? (
          <div className="border rounded-md shadow-md">
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
              <Viewer
                fileUrl={info.terms}
                plugins={[defaultLayoutPluginInstance]}
              />
            </Worker>
          </div>
        ) : (
          <p className="text-sm text-gray-500">Chưa có file điều khoản.</p>
        )}
      </section>

      {/* Chính sách */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Chính sách</h2>
        {info.policy ? (
          <div className="border rounded-md shadow-md">
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
              <Viewer
                fileUrl={info.policy}
                plugins={[defaultLayoutPluginInstance]}
              />
            </Worker>
          </div>
        ) : (
          <p className="text-sm text-gray-500">Chưa có file chính sách.</p>
        )}
      </section>
    </div>
  );
}
