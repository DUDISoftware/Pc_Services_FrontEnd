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
  const [showTerms, setShowTerms] = useState(false);
  const [showPolicy, setShowPolicy] = useState(false);
  const url = "https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js";

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

  if (!info) return <p className="px-4 py-10">Đang tải dữ liệu PDF...</p>;

  return (
    <div className="max-w-5xl mx-auto py-10 space-y-10">
      {/* Điều khoản */}
      <section>
        <h2 className="text-xl font-semibold mb-2">📘 Điều khoản sử dụng</h2>
        {info.terms ? (
          <>
            <button
              className="text-sm text-white bg-blue-600 px-4 py-1 rounded hover:bg-blue-700 transition"
              onClick={() => setShowTerms(!showTerms)}
            >
              {showTerms ? "Ẩn PDF" : "Xem PDF"}
            </button>

            {showTerms && (
              <div className="mt-4 border rounded-md shadow-md overflow-hidden">
                <Worker workerUrl={url}>
                  <Viewer
                    fileUrl={info.terms}
                    plugins={[defaultLayoutPluginInstance]}
                  />
                </Worker>
              </div>
            )}
          </>
        ) : (
          <p className="text-sm text-gray-500">Chưa có file điều khoản.</p>
        )}
      </section>

      {/* Chính sách */}
      <section>
        <h2 className="text-xl font-semibold mb-2">📕 Chính sách</h2>
        {info.policy ? (
          <>
            <button
              className="text-sm text-white bg-green-600 px-4 py-1 rounded hover:bg-green-700 transition"
              onClick={() => setShowPolicy(!showPolicy)}
            >
              {showPolicy ? "Ẩn PDF" : "Xem PDF"}
            </button>

            {showPolicy && (
              <div className="mt-4 border rounded-md shadow-md overflow-hidden">
                <Worker workerUrl={url}>
                  <Viewer
                    fileUrl={info.policy}
                    plugins={[defaultLayoutPluginInstance]}
                  />
                </Worker>
              </div>
            )}
          </>
        ) : (
          <p className="text-sm text-gray-500">Chưa có file chính sách.</p>
        )}
      </section>
    </div>
  );
}
