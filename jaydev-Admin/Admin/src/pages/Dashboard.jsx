import React, { useEffect, useState } from "react";
import { getAllProducts, getAllBlogs, getAllBanners } from "../api/Authapi";
import { Package, FileText, Image as ImageIcon, ArrowRight, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    blogs: 0,
    banners: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [pRes, bRes, nRes] = await Promise.all([
          getAllProducts(),
          getAllBlogs(),
          getAllBanners(),
        ]);

        setStats({
          products: pRes.data.data?.length || 0,
          blogs: bRes.data.data?.length || 0,
          banners: nRes.data.data?.length || 0,
        });
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const StatCard = ({ title, count, icon: Icon, gradient, link, description, iconBg }) => (
    <Link
      to={link}
      className={`relative overflow-hidden p-1 rounded-[2.5rem] shadow-2xl transition-all duration-700 hover:-translate-y-3 group h-[340px] isolate ${gradient}`}
    >
      <div className="bg-white/90 backdrop-blur-xl w-full h-full rounded-[2.4rem] p-10 flex flex-col justify-between relative z-10 overflow-hidden">
        {/* Animated Background Decor */}
        <div className={`absolute -right-4 -top-4 w-32 h-32 ${iconBg} opacity-20 blur-3xl group-hover:scale-150 transition-transform duration-1000`}></div>

        <div className="flex justify-between items-start relative z-10">
          <div className={`p-5 rounded-2xl ${iconBg} text-white shadow-xl group-hover:rotate-[360deg] transition-transform duration-1000`}>
            <Icon size={32} />
          </div>
          <div className="flex items-center gap-2 text-gray-400 group-hover:text-black transition-colors font-black text-sm uppercase tracking-tighter">
            Manage <div className="w-8 h-[2px] bg-[#FFD54F] group-hover:w-12 transition-all"></div>
          </div>
        </div>

        <div className="relative z-10">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-2">{title}</h3>
          <div className="flex items-baseline gap-4">
            <span className="text-8xl font-black text-[#121212] tracking-tighter leading-none group-hover:scale-110 transition-transform origin-left">{count}</span>
            <span className="text-gray-400 font-bold text-lg lowercase">units</span>
          </div>
          <p className="mt-5 text-gray-500 font-semibold leading-relaxed text-sm">{description}</p>
        </div>
      </div>
    </Link>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-[#FFD54F] opacity-20"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-[#FFD54F] animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-12 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b-8 border-[#FFD54F]/20 pb-10">
        <div className="space-y-3">
          <h1 className="text-7xl font-black text-[#121212] tracking-tighter leading-none italic">
            COMMAND <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#121212] to-[#FFD54F]">CENTER</span>
          </h1>
          <p className="text-xl text-gray-400 font-black uppercase tracking-[0.4em]">Jai Dev Dental Admin </p>
        </div>
        <div className="relative group cursor-pointer">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#FFD54F] to-[#121212] rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative flex items-center gap-4 bg-[#121212] text-[#FFD54F] px-10 py-5 rounded-2xl font-black text-xl shadow-2xl">
            <TrendingUp size={28} className="animate-pulse" />
            SYSTEM ACTIVE
          </div>
        </div>
      </div>

      {/* Enhanced Stat Cards Grid with Mixed Gradients */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">
        <StatCard
          title="Products Inventory"
          count={stats.products}
          icon={Package}
          gradient="bg-gradient-to-br from-[#121212] via-gray-800 to-[#FFD54F]"
          iconBg="bg-[#121212]"
          link="/product/products"
          description="Precision tracking for clinical high-value dental machinery and stock."
        />
        <StatCard
          title="Blogs"
          count={stats.blogs}
          icon={FileText}
          gradient="bg-gradient-to-tr from-[#FFD54F] via-white to-[#121212]"
          iconBg="bg-[#FFD54F]"
          link="/blog/blogs"
          description="Educational content and professional insights for our community."
        />
        <StatCard
          title="Banners"
          count={stats.banners}
          icon={ImageIcon}
          gradient="bg-gradient-to-bl from-gray-200 via-white to-[#FFD54F]"
          iconBg="bg-gray-400"
          link="/banner/banners"
          description="Global management for promotional visuals and hero sliders."
        />
      </div>


      {/* Decorative Footer Element */}
      <div className="pt-12 flex justify-center opacity-10">
        <img src="/logo.png" alt="" className="h-20 grayscale grayscale-100" />
      </div>
    </div>
  );
};

export default Dashboard;