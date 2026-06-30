// Health One — 店员管理 (FEATURE-006).
import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";

interface StaffMember {
  staff_id: string;
  display_name: string;
  username: string;
  role: string;
  status: string;
  created_at: string;
}

const ROLE_LABELS: Record<string, string> = {
  "店长": "店长",
  "健康管理师": "健康管理师",
  "服务人员": "服务人员",
};

export default function StaffManagementScreen() {
  const { staff: me } = useAuth();
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ display_name: "", username: "", role: "健康管理师", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  const fetchStaff = async () => {
    try {
      const data = await api.get<StaffMember[]>("/api/staff/");
      setStaffList(data);
    } catch { /* silent */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchStaff(); }, []);

  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(""), 3000); };

  const handleCreate = async () => {
    setError("");
    if (!form.display_name || !form.username || !form.password) {
      setError("请填写所有字段"); return;
    }
    setSubmitting(true);
    try {
      await api.post("/api/staff/", form);
      setShowModal(false);
      setForm({ display_name: "", username: "", role: "健康管理师", password: "" });
      flash("店员创建成功");
      fetchStaff();
    } catch (e: any) {
      setError(e?.message || "创建失败");
    }
    finally { setSubmitting(false); }
  };

  const toggleStatus = async (s: StaffMember) => {
    const newStatus = s.status === "active" ? "inactive" : "active";
    try {
      await api.patch(`/api/staff/${s.staff_id}`, { status: newStatus });
      flash(`${s.display_name} 已${newStatus === "active" ? "启用" : "停用"}`);
      fetchStaff();
    } catch (e: any) { setError(e?.message || "操作失败"); }
  };

  const resetPassword = async (s: StaffMember) => {
    const pw = prompt(`为 ${s.display_name} 输入新密码（至少 6 位）：`);
    if (!pw) return;
    try {
      await api.post(`/api/staff/${s.staff_id}/reset-password`, { password: pw });
      flash(`${s.display_name} 密码已重置`);
    } catch (e: any) { setError(e?.message || "密码重置失败"); }
  };

  if (loading) return <div className="text-center py-12 text-gray-400">加载中…</div>;

  return (
    <div data-testid="staff-management">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">店员管理</h1>
          <p className="text-sm text-gray-500 mt-1">共 {staffList.length} 名店员</p>
        </div>
        <button onClick={() => { setShowModal(true); setError(""); }}
          className="px-4 py-2 rounded text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 cursor-pointer">
          + 新增店员
        </button>
      </div>

      {msg && <div className="mb-4 px-4 py-2 rounded text-sm bg-green-50 text-green-700 border border-green-200">{msg}</div>}
      {error && <div className="mb-4 px-4 py-2 rounded text-sm bg-red-50 text-red-700 border border-red-200">{error}</div>}

      {/* Staff Table */}
      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-500">姓名</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">用户名</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">角色</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">状态</th>
              <th className="text-right px-4 py-3 font-medium text-gray-500">操作</th>
            </tr>
          </thead>
          <tbody>
            {staffList.map(s => {
              const isMe = s.staff_id === me?.staff_id;
              return (
                <tr key={s.staff_id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span className="font-medium text-gray-800">{s.display_name}</span>
                    {isMe && <span className="ml-2 text-xs text-gray-400">（我）</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{s.username}</td>
                  <td className="px-4 py-3">
                    <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700">
                      {ROLE_LABELS[s.role] || s.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${
                      s.status === "active" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
                    }`}>
                      {s.status === "active" ? "正常" : "已停用"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      {!isMe && (
                        <button onClick={() => toggleStatus(s)}
                          className={`px-2.5 py-1 rounded text-xs cursor-pointer ${
                            s.status === "active"
                              ? "text-orange-600 bg-orange-50 border border-orange-200 hover:bg-orange-100"
                              : "text-green-600 bg-green-50 border border-green-200 hover:bg-green-100"
                          }`}>
                          {s.status === "active" ? "停用" : "启用"}
                        </button>
                      )}
                      <button onClick={() => resetPassword(s)}
                        className="px-2.5 py-1 rounded text-xs text-gray-600 bg-gray-50 border border-gray-200 hover:bg-gray-100 cursor-pointer">
                        重置密码
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {staffList.length === 0 && (
          <div className="text-center py-8 text-gray-400 text-sm">暂无店员</div>
        )}
      </div>

      {/* Add Staff Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-4">新增店员</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">姓名</label>
                <input value={form.display_name} onChange={e => setForm({ ...form, display_name: e.target.value })}
                  className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" placeholder="店员姓名" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">用户名</label>
                <input value={form.username} onChange={e => setForm({ ...form, username: e.target.value })}
                  className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" placeholder="登录用户名" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">角色</label>
                <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
                  className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
                  <option value="健康管理师">健康管理师</option>
                  <option value="服务人员">服务人员</option>
                  <option value="店长">店长</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">初始密码</label>
                <input type="text" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                  className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" placeholder="至少 6 位" />
              </div>
            </div>
            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => { setShowModal(false); setError(""); }}
                className="px-4 py-2 rounded text-sm text-gray-600 hover:bg-gray-100 cursor-pointer">取消</button>
              <button onClick={handleCreate} disabled={submitting}
                className="px-4 py-2 rounded text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 cursor-pointer">
                {submitting ? "创建中…" : "确认添加"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
