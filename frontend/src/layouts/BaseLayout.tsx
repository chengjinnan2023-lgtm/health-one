// Health One — Base layout (PILOT-010: Chinese localization).

import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function BaseLayout() {
  const { staff, logout } = useAuth();
  const navigate = useNavigate();
  const isManager = staff?.role === "店长";
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-lg font-bold text-blue-700">Health One</Link>
          <nav className="flex gap-4 text-sm">
            <Link to="/customers" className="text-gray-600 hover:text-blue-600">客户管理</Link>
            {isManager && <Link to="/staff" className="text-gray-600 hover:text-blue-600">店员管理</Link>}
          </nav>
        </div>
        <div className="flex items-center gap-4 text-sm">
          {staff && <span className="text-gray-500">{staff.display_name} · {staff.store_name}</span>}
          <button onClick={() => { logout(); navigate("/login"); }}
            className="text-gray-400 hover:text-red-500">退出登录</button>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-6 py-8"><Outlet /></main>
    </div>
  );
}
