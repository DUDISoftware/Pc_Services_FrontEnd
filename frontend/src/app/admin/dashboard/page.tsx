"use client";

import TableHeader from "@/components/admin/TableHeader";
import Button from "@/components/common/Button";
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
import { useEffect, useState } from "react";
import { statsService } from "@/services/stats.service";

export default function DashboardPage() {
  const today = new Date().toISOString().split("T")[0];
  const [animate, setAnimate] = useState(true);

  // Current Month (blue line)
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  // State for chart
  const [monthlyProfit, setMonthlyProfit] = useState<number[]>([]); // Blue line
  const [selectedMonthData, setSelectedMonthData] = useState<number[]>([]); // Yellow line

  // Selected month/year for comparison
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  // Stats data
  const [products, setProducts] = useState(0);
  const [orderRequests, setOrderRequests] = useState(0);
  const [repairRequests, setRepairRequests] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);

  const [todayProfit, setTodayProfit] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [pendingRepairs, setPendingRepairs] = useState(0);
  const [remainingProducts, setRemainingProducts] = useState(0);

  const [tab, setTab] = useState<"monthly" | "full">("monthly");

  const daysInMonth = (year: number, month: number) =>
    new Date(year, month, 0).getDate();

  const getSampledDays = (totalDays: number, segments = 6): number[] => {
    const step = Math.floor(totalDays / segments);
    const sampled = Array.from({ length: segments }, (_, i) => i * step + 1);
    if (!sampled.includes(totalDays)) sampled.push(totalDays);
    return Array.from(new Set(sampled)).sort((a, b) => a - b);
  };

  const safeChange = (curr: number, prev: number) =>
    prev === 0 ? (curr > 0 ? 100 : 0) : ((curr / prev - 1) * 100);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetchCurrentMonthLine(); // Blue line fixed
    fetchSelectedMonthLine(); // Yellow line
    fetchStatsToday();
    // fetchStatsCurrentMonth();
  }, [selectedMonth, selectedYear]);

  const fetchCurrentMonthLine = async () => {
    const totalDays = daysInMonth(currentYear, currentMonth);
    const profits: number[] = [];
    for (let d = 1; d <= totalDays; d++) {
      const dateStr = new Date(currentYear, currentMonth - 1, d)
        .toISOString()
        .split("T")[0];
      try {
        const stat = await statsService.getStatsByDate(dateStr);
        profits.push(stat.total_profit || 0);
      } catch {
        profits.push(0);
      }
    }
    setMonthlyProfit(profits);
  };

  const fetchSelectedMonthLine = async () => {
    const totalDays = daysInMonth(selectedYear, selectedMonth);
    const profits: number[] = [];
    let profitSum = 0;
    let orders = 0;
    let repairs = 0;
    let sold = 0;

    for (let d = 1; d <= totalDays; d++) {
      const dateStr = new Date(selectedYear, selectedMonth - 1, d)
        .toISOString()
        .split("T")[0];
      try {
        const stat = await statsService.getStatsByDate(dateStr);
        profits.push(stat.total_profit || 0);
        profitSum += stat.total_profit || 0;
        orders += stat.total_orders || 0;
        repairs += stat.total_repairs || 0;
        sold += stat.total_products || 0;
      } catch {
        profits.push(0);
      }
    }

    setSelectedMonthData(profits);
    setTotalProfit(profitSum);
    setOrderRequests(orders);
    setRepairRequests(repairs);
    setProducts(sold);
  };

  const fetchStatsToday = async () => {
    try {
      const todayStat = await statsService.getStatsByDate(today);
      setTodayProfit(await statsService.calculateTodayProfit(today));
      setPendingOrders(todayStat.total_orders || 0);
      setPendingRepairs(todayStat.total_repairs || 0);
      setRemainingProducts(todayStat.total_products || 0);
    } catch (err) {
      console.error("Lỗi lấy thống kê hôm nay:", err);
    }
  };

  const totalStats = [
    {
      title: "Doanh thu theo tháng",
      value: totalProfit,
      change: safeChange(totalProfit, monthlyProfit.reduce((a, b) => a + b, 0)),
      color: "bg-blue-100 text-blue-800",
    },
    {
      title: "Tổng đơn đặt hàng",
      value: orderRequests,
      change: safeChange(orderRequests, 0),
      color: "bg-green-100 text-green-800",
    },
    {
      title: "Tổng yêu cầu sửa chữa",
      value: repairRequests,
      change: safeChange(repairRequests, 0),
      color: "bg-red-100 text-red-800",
    },
    {
      title: "Tổng sản phẩm đã bán",
      value: products,
      change: safeChange(products, 0),
      color: "bg-yellow-100 text-yellow-800",
    },
  ];

  const todayStats = [
    {
      title: "Doanh thu hôm nay",
      value: todayProfit,
      change: safeChange(todayProfit, 0),
      color: "bg-blue-100 text-blue-800",
    },
    {
      title: "Đơn hàng chưa hoàn thành",
      value: pendingOrders,
      change: safeChange(pendingOrders, 0),
      color: "bg-green-100 text-green-800",
    },
    {
      title: "Yêu cầu chưa hoàn thành",
      value: pendingRepairs,
      change: safeChange(pendingRepairs, 0),
      color: "bg-red-100 text-red-800",
    },
    {
      title: "Số lượng sản phẩm tồn kho",
      value: remainingProducts,
      change: safeChange(remainingProducts, 0),
      color: "bg-yellow-100 text-yellow-800",
    },
  ];

  const totalDays = daysInMonth(selectedYear, selectedMonth);
  const days =
    tab === "monthly"
      ? getSampledDays(totalDays)
      : Array.from({ length: totalDays }, (_, i) => i + 1);

  const chartData = days.map((day) => ({
    name: day.toString().padStart(2, "0"),
    "Tháng này": monthlyProfit[day - 1] || 0,
    [`Tháng ${selectedMonth}`]: selectedMonthData[day - 1] || 0,
  }));

  return (
    <div className="p-6 space-y-6">
      <TableHeader
        title="Thống kê"
        breadcrumb={["Admin", "Thống kê - báo cáo"]}
        actions={<Button variant="secondary">📤 Xuất file</Button>}
      />

      {/* Tổng tháng */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {totalStats.map((s) => (
          <div key={s.title} className={`${s.color} rounded-2xl p-6 shadow`}>
            <h2 className="text-sm text-gray-600">{s.title}</h2>
            <p className="text-3xl font-bold mt-2">
              <CountUp start={animate ? 0 : s.value} end={s.value} duration={2} separator="," />
            </p>
            <span className={`text-sm mt-2 ${s.change >= 0 ? "text-green-600" : "text-red-600"}`}>
              {s.change.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>

      {/* Hôm nay */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {todayStats.map((s) => (
          <div key={s.title} className={`${s.color} rounded-2xl p-6 shadow`}>
            <h2 className="text-sm text-gray-600">{s.title}</h2>
            <p className="text-3xl font-bold mt-2">
              <CountUp start={animate ? 0 : s.value} end={s.value} duration={2} separator="," />
            </p>
            <span className={`text-sm mt-2 ${s.change >= 0 ? "text-green-600" : "text-red-600"}`}>
              {s.change.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-4">
        <button onClick={() => setTab("monthly")} className={`px-4 py-2 rounded ${tab === "monthly" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"}`}>
          Theo tháng
        </button>
        <button onClick={() => setTab("full")} className={`px-4 py-2 rounded ${tab === "full" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"}`}>
          Theo ngày
        </button>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="border rounded px-3 py-1 text-sm"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  Tháng {i + 1}
                </option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="border rounded px-3 py-1 text-sm"
            >
              {Array.from({ length: 5 }, (_, i) => {
                const y = new Date().getFullYear() - 2 + i;
                return <option key={y} value={y}>{y}</option>;
              })}
            </select>
          </div>
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-blue-600"></span>
              <span>Tháng này</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
              <span>Tháng {selectedMonth}</span>
            </div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="Tháng này" stroke="#2563EB" strokeWidth={3} />
            <Line type="monotone" dataKey={`Tháng ${selectedMonth}`} stroke="#F59E0B" strokeWidth={3} strokeDasharray="5 5" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
