"use client";

import TableHeader from "@/components/admin/TableHeader";
import { useState } from "react";
import CountUp from "react-countup";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Button from "@/components/common/Button";

const data = [
  { name: "01", thángNày: 12000, thángTrước: 8000 },
  { name: "05", thángNày: 10000, thángTrước: 14000 },
  { name: "10", thángNày: 8000, thángTrước: 18000 },
  { name: "15", thángNày: 15000, thángTrước: 12000 },
  { name: "20", thángNày: 17000, thángTrước: 10000 },
  { name: "25", thángNày: 25000, thángTrước: 16000 },
  { name: "30", thángNày: 20000, thángTrước: 22000 },
];

const stats = [
  { title: "Yêu cầu sửa chữa", value: 8276, change: "+11.01%", color: "bg-indigo-50" },
  { title: "Lượt truy cập", value: 3781, change: "-0.03%", color: "bg-blue-50" },
  { title: "Yêu cầu mua hàng", value: 167, change: "+15.03%", color: "bg-purple-50" },
  { title: "Số sản phẩm", value: 2318, change: "+6.08%", color: "bg-sky-50" },
];

export default function DashboardPage() {
  const [animate, setAnimate] = useState(true);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <TableHeader
        title="Thống kê"
        breadcrumb={["Admin", "Thống kê-báo cáo"]}
        actions={<Button variant="secondary">📤 Xuất file</Button>}
      />

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div key={s.title} className={`${s.color} rounded-2xl p-6 shadow flex flex-col`}>
            <h2 className="text-sm text-gray-600">{s.title}</h2>
            <p className="text-3xl font-bold mt-2">
              <CountUp start={animate ? 0 : s.value} end={s.value} duration={2} separator="," />
            </p>
            <span
              className={`text-sm mt-2 ${
                s.change.startsWith("+") ? "text-green-600" : "text-red-600"
              }`}
            >
              {s.change}
            </span>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Doanh thu</h2>
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-blue-600"></span>
              <span>Tháng này</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
              <span>Tháng trước</span>
            </div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="thángNày" stroke="#2563EB" strokeWidth={3} />
            <Line type="monotone" dataKey="thángTrước" stroke="#F59E0B" strokeWidth={3} strokeDasharray="5 5" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
