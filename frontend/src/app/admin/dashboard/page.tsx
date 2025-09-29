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
  const [animate, setAnimate] = useState(true);
  const [currentDay, setCurrentDay] = useState(new Date().getDate());

  const [products, setProducts] = useState(0);
  const [orderRequests, setOrderRequests] = useState(0);
  const [repairRequests, setRepairRequests] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);

  const [previousProducts, setPreviousProducts] = useState(0);
  const [previousOrderRequests, setPreviousOrderRequests] = useState(0);
  const [previousRepairRequests, setPreviousRepairRequests] = useState(0);
  const [previousProfit, setPreviousProfit] = useState(0);

  const [monthlyProfit, setMonthlyProfit] = useState<number[]>([]);
  const [previousMonth, setPreviousMonth] = useState<number[]>([]);

  const [todayProfit, setTodayProfit] = useState(0);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setCurrentDay(new Date().getDate());

    const fetchTodayProfit = async () => {
      try {
        const p = await statsService.calculateTodayProfit(today);
        setTodayProfit(p);
        setTotalProfit((prev) => prev + p);
        await statsService.updateStats(
          { total_profit: p},
          today
        );
      } catch (err) {
        console.error("Lỗi tính lợi nhuận hôm nay:", err);
      }
    };

    const fetchCurrentMonthStats = async () => {
      try {
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();
        const statsList = await statsService.getMonthStats(month, year);

        let totalProfit = 0;
        let totalOrders = 0;
        let totalRepairs = 0;
        let totalProducts = 0;

        for (const s of statsList) {
          const day = new Date(s.updatedAt ?? "").getDate();
          if (day <= currentDay) {
            totalProfit += s.total_profit || 0;
            totalOrders += s.total_orders || 0;
            totalRepairs += s.total_repairs || 0;
            totalProducts += s.total_products || 0;
          }
        }

        setTotalProfit(totalProfit);
        setOrderRequests(totalOrders);
        setRepairRequests(totalRepairs);
        setProducts(totalProducts);
      } catch (err) {
        console.error("Lỗi lấy thống kê tháng này:", err);
      }
    };

    const fetchPreviousMonthStats = async () => {
      try {
        const now = new Date();
        let month = now.getMonth();
        let year = now.getFullYear();
        if (month === 0) {
          month = 12;
          year -= 1;
        }

        const statsList = await statsService.getMonthStats(month, year);

        let totalProfit = 0;
        let totalOrders = 0;
        let totalRepairs = 0;
        let totalProducts = 0;

        for (const s of statsList) {
          const day = s.updatedAt ? new Date(s.updatedAt).getDate() : 0;
          if (day <= currentDay) {
            totalProfit += s.total_profit || 0;
            totalOrders += s.total_orders || 0;
            totalRepairs += s.total_repairs || 0;
            totalProducts += s.total_products || 0;
          }
        }

        setPreviousProfit(totalProfit);
        setPreviousOrderRequests(totalOrders);
        setPreviousRepairRequests(totalRepairs);
        setPreviousProducts(totalProducts);
      } catch (err) {
        console.error("Lỗi lấy thống kê tháng trước:", err);
      }
    };

    const fetchMonthlyLineChart = async () => {
      const days = [1, 5, 10, 15, 20, 25, currentDay];
      const thisMonth: number[] = [];
      const lastMonth: number[] = [];

      for (const d of days) {
        const date = new Date();
        date.setDate(d);
        const curDate = date.toISOString().split("T")[0];

        const prev = new Date();
        prev.setMonth(prev.getMonth() - 1);
        prev.setDate(d);
        const prevDate = prev.toISOString().split("T")[0];

        try {
          const curStat = await statsService.getStatsByDate(curDate);
          thisMonth.push(curStat.total_profit || 0);
        } catch {
          thisMonth.push(0);
        }

        try {
          const prevStat = await statsService.getStatsByDate(prevDate);
          lastMonth.push(prevStat.total_profit || 0);
        } catch {
          lastMonth.push(0);
        }
      }

      setMonthlyProfit(thisMonth);
      setPreviousMonth(lastMonth);
    };

    // CALL ALL
    fetchTodayProfit();
    fetchCurrentMonthStats();
    fetchPreviousMonthStats();
    fetchMonthlyLineChart();
  }, [currentDay]);

  const safeChange = (curr: number, prev: number) =>
    prev === 0 ? (curr > 0 ? 100 : 0) : ((curr / prev - 1) * 100);

  const stats = [
    {
      title: "Tổng doanh thu",
      value: totalProfit,
      change: safeChange(totalProfit, previousProfit),
      color: "bg-blue-100 text-blue-800",
    },
    {
      title: "Yêu cầu đặt hàng",
      value: orderRequests,
      change: safeChange(orderRequests, previousOrderRequests),
      color: "bg-green-100 text-green-800",
    },
    {
      title: "Yêu cầu sửa chữa",
      value: repairRequests,
      change: safeChange(repairRequests, previousRepairRequests),
      color: "bg-red-100 text-red-800",
    },
    {
      title: "Tổng sản phẩm",
      value: products,
      change: safeChange(products, previousProducts),
      color: "bg-yellow-100 text-yellow-800",
    },
  ];

  const chartData = [1, 5, 10, 15, 20, 25, currentDay].map((day, idx) => ({
    name: day.toString().padStart(2, "0"),
    thángNày: monthlyProfit[idx] || 0,
    thángTrước: previousMonth[idx] || 0,
  }));

  return (
    <div className="p-6 space-y-6">
      <TableHeader
        title="Thống kê"
        breadcrumb={["Admin", "Thống kê - báo cáo"]}
        actions={<Button variant="secondary">📤 Xuất file</Button>}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div
            key={s.title}
            className={`${s.color} rounded-2xl p-6 shadow flex flex-col`}
          >
            <h2 className="text-sm text-gray-600">{s.title}</h2>
            <p className="text-3xl font-bold mt-2">
              <CountUp
                start={animate ? 0 : s.value}
                end={s.value}
                duration={2}
                separator=","
              />
            </p>
            <span
              className={`text-sm mt-2 ${
                s.change >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {s.change.toFixed(2)}%
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
          <LineChart data={chartData}>
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="thángNày"
              stroke="#2563EB"
              strokeWidth={3}
            />
            <Line
              type="monotone"
              dataKey="thángTrước"
              stroke="#F59E0B"
              strokeWidth={3}
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
