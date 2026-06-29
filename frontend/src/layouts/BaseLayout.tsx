// Health One — Base layout (header + nav + content area).

import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function BaseLayout() {
  const { staff, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-lg font-bold text-blue-700">
            Health One
          </Link>
          <nav className="flex gap-4 text-sm">
            <Link to="/customers" className="text-gray-600 hover:text-blue-600">
              Customers
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4 text-sm">
          {staff && (
            <span className="text-gray-500">
              {staff.display_name} · {staff.store_name}
            </span>
          )}
          <button
            onClick={handleLogout}
            className="text-gray-400 hover:text-red-500"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
