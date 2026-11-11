"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingBag,
  CalendarDays,
  FileText,
  LogOut,
  Plus,
  Trash2,
  Edit3,
  Upload,
  CheckCircle2,
  Loader2,
  Phone,
} from "lucide-react";
import type {
  BanquetEnquiry,
  Category,
  Order,
  OrderStatus,
  PaymentStatus,
  Product,
  SiteContent,
  TableReservation,
} from "@/lib/types";

interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  todayOrders: number;
  paidRevenue: number;
  totalProducts: number;
  pendingReservations: number;
  newEnquiries: number;
}

type TabKey = "dashboard" | "products" | "orders" | "bookings" | "content";

export function AdminDashboardClient({
  adminName,
}: {
  adminName: string;
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>("dashboard");
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<TableReservation[]>([]);
  const [enquiries, setEnquiries] = useState<BanquetEnquiry[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);

  // Product Form State
  const [editingId, setEditingId] = useState<number | null>(null);
  const [prodName, setProdName] = useState("");
  const [prodPrice, setProdPrice] = useState("");
  const [prodCategory, setProdCategory] = useState("biryani");
  const [prodVegType, setProdVegType] = useState<"veg" | "non-veg">("non-veg");
  const [prodDesc, setProdDesc] = useState("");
  const [prodImage, setProdImage] = useState("/images/dishes/chicken-biryani.png");
  const [prodAvailable, setProdAvailable] = useState(true);
  const [prodSignature, setProdSignature] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);

  // Category creation
  const [newCategoryName, setNewCategoryName] = useState("");

  const loadAllData = useCallback(async () => {
    setLoading(true);
    try {
      const [dashRes, prodRes, ordRes, resRes, enqRes, contRes] =
        await Promise.all([
          fetch("/api/admin/dashboard"),
          fetch("/api/admin/products"),
          fetch("/api/admin/orders"),
          fetch("/api/admin/reservations"),
          fetch("/api/admin/banquet-enquiries"),
          fetch("/api/admin/content"),
        ]);

      if (dashRes.status === 401) {
        router.push("/admin/login");
        return;
      }

      const [dash, prod, ord, resv, enq, cont] = await Promise.all([
        dashRes.json(),
        prodRes.json(),
        ordRes.json(),
        resRes.json(),
        enqRes.json(),
        contRes.json(),
      ]);

      setStats(dash.stats);
      setRecentOrders(dash.recentOrders || []);
      setCategories(prod.categories || []);
      setProducts(prod.products || []);
      setOrders(ord.orders || []);
      setReservations(resv.reservations || []);
      setEnquiries(enq.enquiries || []);
      setSiteContent(cont);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const resetProductForm = () => {
    setEditingId(null);
    setProdName("");
    setProdPrice("");
    setProdCategory(categories[0]?.slug || "biryani");
    setProdVegType("non-veg");
    setProdDesc("");
    setProdImage("/images/dishes/chicken-biryani.png");
    setProdAvailable(true);
    setProdSignature(false);
  };

  const startEditProduct = (p: Product) => {
    setEditingId(p.id);
    setProdName(p.name);
    setProdPrice(String(p.price));
    setProdCategory(p.categorySlug);
    setProdVegType(p.vegType);
    setProdDesc(p.description);
    setProdImage(p.imageUrl);
    setProdAvailable(p.isAvailable);
    setProdSignature(p.isSignature);
    setActiveTab("products");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImg(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setProdImage(data.url);
        setNotice("Image uploaded successfully.");
      } else {
        setNotice(data.error || "Upload failed.");
      }
    } finally {
      setUploadingImg(false);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: prodName,
      price: Number(prodPrice),
      categorySlug: prodCategory,
      vegType: prodVegType,
      description: prodDesc,
      imageUrl: prodImage,
      isAvailable: prodAvailable,
      isSignature: prodSignature,
    };

    const res = editingId
      ? await fetch(`/api/admin/products/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      : await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

    if (res.ok) {
      setNotice(editingId ? "Dish updated!" : "New dish added to menu!");
      resetProductForm();
      loadAllData();
    } else {
      const data = await res.json();
      setNotice(data.error || "Failed to save dish.");
    }
  };

  const handleDeleteProduct = async (id: number) => {
    const res = await fetch(`/api/admin/products/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setNotice("Dish deleted from catalog.");
      loadAllData();
    }
  };

  const handleToggleAvailability = async (p: Product) => {
    const res = await fetch(`/api/admin/products/${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isAvailable: !p.isAvailable }),
    });
    if (res.ok) {
      loadAllData();
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCategoryName }),
    });
    if (res.ok) {
      setNewCategoryName("");
      setNotice("Category created.");
      loadAllData();
    }
  };

  const handleUpdateOrder = async (
    id: number,
    updates: { orderStatus?: OrderStatus; paymentStatus?: PaymentStatus }
  ) => {
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (res.ok) {
      setNotice("Order updated.");
      loadAllData();
    }
  };

  const handleUpdateReservation = async (id: number, status: string) => {
    await fetch("/api/admin/reservations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    loadAllData();
  };

  const handleUpdateEnquiry = async (id: number, status: string) => {
    await fetch("/api/admin/banquet-enquiries", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    loadAllData();
  };

  const handleSaveSiteContent = async (
    key: keyof SiteContent,
    value: SiteContent[keyof SiteContent]
  ) => {
    const res = await fetch("/api/admin/content", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value }),
    });
    if (res.ok) {
      setNotice(`Saved ${key} updates to live site.`);
      loadAllData();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6">
      {/* Top Bar */}
      <div className="bg-[#4B0710] text-white rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-[#D4A143]/50 shadow-md">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#ECC572]">
            Navya Grand Operations
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold">
            Welcome, {adminName}
          </h1>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-sm font-semibold text-[#ECC572] self-start sm:self-auto cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {notice && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            {notice}
          </span>
          <button
            type="button"
            onClick={() => setNotice("")}
            className="text-xs font-bold underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {(
          [
            { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
            { key: "products", label: "Menu & Products", icon: UtensilsCrossed },
            { key: "orders", label: "Orders", icon: ShoppingBag },
            { key: "bookings", label: "Bookings & Banquet", icon: CalendarDays },
            { key: "content", label: "Site Content", icon: FileText },
          ] as const
        ).map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap border transition-colors cursor-pointer ${
                activeTab === tab.key
                  ? "bg-[#5E0B15] text-[#ECC572] border-[#5E0B15]"
                  : "bg-white text-[#3D050C] border-[#D4A143]/40 hover:bg-[#F6EAD4]"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="bg-white/90 rounded-3xl p-12 text-center text-[#664941] flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading live restaurant data...</span>
        </div>
      ) : (
        <>
          {/* TAB 1: DASHBOARD */}
          {activeTab === "dashboard" && stats && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {[
                  { label: "Total Orders", value: stats.totalOrders },
                  { label: "Pending / Active Orders", value: stats.pendingOrders },
                  { label: "Completed Orders", value: stats.completedOrders },
                  { label: "Today's Orders", value: stats.todayOrders },
                  {
                    label: "Verified Paid Revenue",
                    value: `₹${stats.paidRevenue}`,
                  },
                  { label: "Menu Dishes", value: stats.totalProducts },
                  {
                    label: "Pending Table Requests",
                    value: stats.pendingReservations,
                  },
                  { label: "New Banquet Enquiries", value: stats.newEnquiries },
                ].map((kpi) => (
                  <div
                    key={kpi.label}
                    className="bg-white/95 rounded-2xl border border-[#D4A143]/40 p-4 sm:p-5 shadow-xs"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#664941]">
                      {kpi.label}
                    </p>
                    <p className="font-display text-2xl sm:text-3xl font-bold text-[#5E0B15] mt-1">
                      {kpi.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="bg-white/95 rounded-3xl border border-[#D4A143]/40 p-5 sm:p-6">
                <h2 className="font-display text-xl font-bold text-[#3D050C] mb-4">
                  Recent Orders
                </h2>
                {recentOrders.length === 0 ? (
                  <p className="text-sm text-[#664941]">
                    No orders placed yet.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead>
                        <tr className="border-b border-[#D4A143]/30 text-xs uppercase text-[#8B1524]">
                          <th className="py-2 pr-3">Ref</th>
                          <th className="py-2 pr-3">Customer</th>
                          <th className="py-2 pr-3">Total</th>
                          <th className="py-2 pr-3">Payment</th>
                          <th className="py-2">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#D4A143]/15">
                        {recentOrders.map((o) => (
                          <tr key={o.id}>
                            <td className="py-2.5 pr-3 font-mono font-bold text-[#5E0B15]">
                              {o.orderRef}
                            </td>
                            <td className="py-2.5 pr-3">{o.customerName}</td>
                            <td className="py-2.5 pr-3 font-semibold">
                              ₹{o.totalAmount}
                            </td>
                            <td className="py-2.5 pr-3 capitalize">
                              {o.paymentStatus.replace("_", " ")}
                            </td>
                            <td className="py-2.5 font-semibold">
                              {o.orderStatus}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCT MANAGEMENT */}
          {activeTab === "products" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-5 space-y-5">
                <form
                  onSubmit={handleSaveProduct}
                  className="bg-white/95 rounded-3xl border border-[#D4A143]/45 p-5 sm:p-6 space-y-4 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-xl font-bold text-[#3D050C]">
                      {editingId ? "Edit Dish" : "Add New Dish"}
                    </h2>
                    {editingId && (
                      <button
                        type="button"
                        onClick={resetProductForm}
                        className="text-xs font-semibold text-[#8B1524] underline cursor-pointer"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#5E0B15] mb-1">
                      Dish Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={prodName}
                      onChange={(e) => setProdName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#FDF7EC] border border-[#D4A143]/45 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#5E0B15] mb-1">
                        Price (₹) *
                      </label>
                      <input
                        type="number"
                        required
                        min={1}
                        value={prodPrice}
                        onChange={(e) => setProdPrice(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#FDF7EC] border border-[#D4A143]/45 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#5E0B15] mb-1">
                        Veg / Non-Veg
                      </label>
                      <select
                        value={prodVegType}
                        onChange={(e) =>
                          setProdVegType(e.target.value as "veg" | "non-veg")
                        }
                        className="w-full px-3 py-2 rounded-xl bg-[#FDF7EC] border border-[#D4A143]/45 text-sm"
                      >
                        <option value="non-veg">Non-Veg</option>
                        <option value="veg">Veg</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#5E0B15] mb-1">
                      Category
                    </label>
                    <select
                      value={prodCategory}
                      onChange={(e) => setProdCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#FDF7EC] border border-[#D4A143]/45 text-sm"
                    >
                      {categories.map((c) => (
                        <option key={c.slug} value={c.slug}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#5E0B15] mb-1">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      value={prodDesc}
                      onChange={(e) => setProdDesc(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#FDF7EC] border border-[#D4A143]/45 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#5E0B15] mb-1">
                      Dish Photograph
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={prodImage}
                        onChange={(e) => setProdImage(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl bg-[#FDF7EC] border border-[#D4A143]/45 text-xs"
                      />
                      <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#5E0B15] text-[#ECC572] text-xs font-semibold cursor-pointer">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploadingImg ? "..." : "Upload"}</span>
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center gap-5 text-sm">
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={prodAvailable}
                        onChange={(e) => setProdAvailable(e.target.checked)}
                        className="accent-[#5E0B15]"
                      />
                      <span>Available</span>
                    </label>
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={prodSignature}
                        onChange={(e) => setProdSignature(e.target.checked)}
                        className="accent-[#5E0B15]"
                      />
                      <span>Signature Highlight</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="btn-maroon w-full py-2.5 rounded-full text-sm font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-[#ECC572]" />
                    <span>{editingId ? "Save Changes" : "Add Dish to Menu"}</span>
                  </button>
                </form>

                <form
                  onSubmit={handleCreateCategory}
                  className="bg-white/95 rounded-2xl border border-[#D4A143]/45 p-4 flex gap-2"
                >
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="New category name..."
                    className="flex-1 px-3 py-2 rounded-xl bg-[#FDF7EC] border border-[#D4A143]/45 text-sm"
                  />
                  <button
                    type="submit"
                    className="btn-gold px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Add Category
                  </button>
                </form>
              </div>

              <div className="lg:col-span-7 bg-white/95 rounded-3xl border border-[#D4A143]/45 p-5 space-y-3">
                <h2 className="font-display text-xl font-bold text-[#3D050C]">
                  Menu Catalog ({products.length} items)
                </h2>
                <div className="divide-y divide-[#D4A143]/20">
                  {products.map((p) => (
                    <div
                      key={p.id}
                      className="py-3 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="w-12 h-12 rounded-xl object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-sm text-[#3D050C] truncate">
                            {p.name}
                          </p>
                          <p className="text-xs text-[#664941]">
                            ₹{p.price} • {p.categorySlug} • {p.vegType}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleToggleAvailability(p)}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer ${
                            p.isAvailable
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-neutral-200 text-neutral-700"
                          }`}
                        >
                          {p.isAvailable ? "In Stock" : "Hidden"}
                        </button>
                        <button
                          type="button"
                          onClick={() => startEditProduct(p)}
                          aria-label={`Edit ${p.name}`}
                          className="p-2 rounded-lg hover:bg-[#F6EAD4] text-[#5E0B15] cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(p.id)}
                          aria-label={`Delete ${p.name}`}
                          className="p-2 rounded-lg hover:bg-red-50 text-red-700 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ORDER MANAGEMENT */}
          {activeTab === "orders" && (
            <div className="bg-white/95 rounded-3xl border border-[#D4A143]/45 p-5 sm:p-6 space-y-4">
              <h2 className="font-display text-xl font-bold text-[#3D050C]">
                Customer Orders ({orders.length})
              </h2>
              {orders.length === 0 ? (
                <p className="text-sm text-[#664941]">No orders yet.</p>
              ) : (
                <div className="space-y-4">
                  {orders.map((o) => (
                    <div
                      key={o.id}
                      className="rounded-2xl border border-[#D4A143]/35 bg-[#FDF7EC]/60 p-4 space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <span className="font-mono font-bold text-[#5E0B15]">
                            {o.orderRef}
                          </span>
                          <span className="text-xs text-[#664941] ml-2">
                            {new Date(o.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <span className="font-bold text-[#5E0B15]">
                          ₹{o.totalAmount} ({o.orderType})
                        </span>
                      </div>

                      <div className="text-sm text-[#3D050C]">
                        <p>
                          <strong>{o.customerName}</strong> • {o.phone}
                        </p>
                        <p className="text-xs text-[#664941]">
                          {o.address}, {o.city} {o.pincode}
                        </p>
                        {o.paymentRef && (
                          <p className="text-xs text-[#8B1524] font-mono mt-0.5">
                            UPI Ref: {o.paymentRef}
                          </p>
                        )}
                      </div>

                      <div className="text-xs text-[#4A2B24] space-y-1">
                        {o.items.map((item, idx) => (
                          <p key={idx}>
                            {item.quantity} × {item.name} (₹{item.lineTotal})
                          </p>
                        ))}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <div>
                          <label className="block text-[11px] font-bold uppercase text-[#5E0B15] mb-1">
                            Order Status
                          </label>
                          <select
                            value={o.orderStatus}
                            onChange={(e) =>
                              handleUpdateOrder(o.id, {
                                orderStatus: e.target.value as OrderStatus,
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl bg-white border border-[#D4A143]/45 text-xs font-semibold"
                          >
                            {[
                              "Order Placed",
                              "Order Accepted",
                              "Preparing",
                              "Ready for Pickup",
                              "Out for Delivery",
                              "Delivered",
                              "Cancelled",
                            ].map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold uppercase text-[#5E0B15] mb-1">
                            Payment Verification ({o.paymentMethod.toUpperCase()})
                          </label>
                          <select
                            value={o.paymentStatus}
                            onChange={(e) =>
                              handleUpdateOrder(o.id, {
                                paymentStatus: e.target.value as PaymentStatus,
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl bg-white border border-[#D4A143]/45 text-xs font-semibold"
                          >
                            <option value="pending">Pending</option>
                            <option value="awaiting_verification">
                              Awaiting Verification
                            </option>
                            <option value="paid">Verified &amp; Paid</option>
                            <option value="failed">Failed</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: BOOKINGS & BANQUET */}
          {activeTab === "bookings" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/95 rounded-3xl border border-[#D4A143]/45 p-5 space-y-4">
                <h2 className="font-display text-xl font-bold text-[#3D050C]">
                  Table Reservations ({reservations.length})
                </h2>
                {reservations.length === 0 ? (
                  <p className="text-sm text-[#664941]">
                    No table requests yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {reservations.map((r) => (
                      <div
                        key={r.id}
                        className="p-3.5 rounded-2xl border border-[#D4A143]/30 bg-[#FDF7EC]/60 space-y-2 text-sm"
                      >
                        <div className="flex justify-between font-bold text-[#5E0B15]">
                          <span>{r.customerName}</span>
                          <span className="font-mono text-xs">
                            {r.reservationRef}
                          </span>
                        </div>
                        <p className="text-xs text-[#4A2B24]">
                          {r.reservationDate} at {r.reservationTime} •{" "}
                          {r.guestCount} guests
                        </p>
                        <div className="flex items-center justify-between gap-2 pt-1">
                          <a
                            href={`tel:${r.phone}`}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-[#8B1524] underline"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            {r.phone}
                          </a>
                          <select
                            value={r.status}
                            onChange={(e) =>
                              handleUpdateReservation(r.id, e.target.value)
                            }
                            className="px-2.5 py-1 rounded-lg bg-white border border-[#D4A143]/45 text-xs font-semibold"
                          >
                            {["Pending", "Confirmed", "Completed", "Cancelled"].map(
                              (s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              )
                            )}
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white/95 rounded-3xl border border-[#D4A143]/45 p-5 space-y-4">
                <h2 className="font-display text-xl font-bold text-[#3D050C]">
                  Banquet Enquiries ({enquiries.length})
                </h2>
                {enquiries.length === 0 ? (
                  <p className="text-sm text-[#664941]">
                    No banquet enquiries yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {enquiries.map((e) => (
                      <div
                        key={e.id}
                        className="p-3.5 rounded-2xl border border-[#D4A143]/30 bg-[#FDF7EC]/60 space-y-2 text-sm"
                      >
                        <div className="flex justify-between font-bold text-[#5E0B15]">
                          <span>
                            {e.customerName} ({e.eventType})
                          </span>
                          <span className="font-mono text-xs">
                            {e.enquiryRef}
                          </span>
                        </div>
                        <p className="text-xs text-[#4A2B24]">
                          Date: {e.eventDate} • {e.guestCount} guests
                        </p>
                        {e.message && (
                          <p className="text-xs italic text-[#664941]">
                            &ldquo;{e.message}&rdquo;
                          </p>
                        )}
                        <div className="flex items-center justify-between gap-2 pt-1">
                          <a
                            href={`tel:${e.phone}`}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-[#8B1524] underline"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            {e.phone}
                          </a>
                          <select
                            value={e.status}
                            onChange={(ev) =>
                              handleUpdateEnquiry(e.id, ev.target.value)
                            }
                            className="px-2.5 py-1 rounded-lg bg-white border border-[#D4A143]/45 text-xs font-semibold"
                          >
                            {[
                              "New",
                              "Contacted",
                              "Site Visit Scheduled",
                              "Booked",
                              "Closed",
                            ].map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: SITE CONTENT */}
          {activeTab === "content" && siteContent && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/95 rounded-3xl border border-[#D4A143]/45 p-5 sm:p-6 space-y-4">
                <h2 className="font-display text-xl font-bold text-[#3D050C]">
                  Contact &amp; Delivery Settings
                </h2>
                <div className="space-y-3 text-sm">
                  <div>
                    <label className="block text-xs font-semibold text-[#5E0B15] mb-1">
                      Primary Phone
                    </label>
                    <input
                      type="text"
                      value={siteContent.contact.primaryPhone}
                      onChange={(e) =>
                        setSiteContent({
                          ...siteContent,
                          contact: {
                            ...siteContent.contact,
                            primaryPhone: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#FDF7EC] border border-[#D4A143]/45"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#5E0B15] mb-1">
                      Opening Hours
                    </label>
                    <input
                      type="text"
                      value={siteContent.contact.openingHours}
                      onChange={(e) =>
                        setSiteContent({
                          ...siteContent,
                          contact: {
                            ...siteContent.contact,
                            openingHours: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#FDF7EC] border border-[#D4A143]/45"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      handleSaveSiteContent("contact", siteContent.contact)
                    }
                    className="btn-maroon px-5 py-2 rounded-full text-xs font-semibold cursor-pointer"
                  >
                    Save Contact Info
                  </button>

                  <div className="pt-4 border-t border-[#D4A143]/25 space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#5E0B15] mb-1">
                        Restaurant UPI ID
                      </label>
                      <input
                        type="text"
                        value={siteContent.deliveryConfig.upiId}
                        onChange={(e) =>
                          setSiteContent({
                            ...siteContent,
                            deliveryConfig: {
                              ...siteContent.deliveryConfig,
                              upiId: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-[#FDF7EC] border border-[#D4A143]/45"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        handleSaveSiteContent(
                          "deliveryConfig",
                          siteContent.deliveryConfig
                        )
                      }
                      className="btn-gold px-5 py-2 rounded-full text-xs font-bold cursor-pointer"
                    >
                      Save Delivery &amp; UPI Config
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white/95 rounded-3xl border border-[#D4A143]/45 p-5 sm:p-6 space-y-4">
                <h2 className="font-display text-xl font-bold text-[#3D050C]">
                  About Section Copy
                </h2>
                <div className="space-y-3 text-sm">
                  <div>
                    <label className="block text-xs font-semibold text-[#5E0B15] mb-1">
                      Summary
                    </label>
                    <textarea
                      rows={3}
                      value={siteContent.about.summary}
                      onChange={(e) =>
                        setSiteContent({
                          ...siteContent,
                          about: {
                            ...siteContent.about,
                            summary: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#FDF7EC] border border-[#D4A143]/45"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#5E0B15] mb-1">
                      Extended Story
                    </label>
                    <textarea
                      rows={3}
                      value={siteContent.about.extendedStory}
                      onChange={(e) =>
                        setSiteContent({
                          ...siteContent,
                          about: {
                            ...siteContent.about,
                            extendedStory: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#FDF7EC] border border-[#D4A143]/45"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      handleSaveSiteContent("about", siteContent.about)
                    }
                    className="btn-maroon px-5 py-2 rounded-full text-xs font-semibold cursor-pointer"
                  >
                    Save About Section
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

