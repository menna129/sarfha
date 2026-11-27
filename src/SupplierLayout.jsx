


import { Outlet, useNavigate, Link, Navigate, useLocation } from "react-router-dom";
import { supabase } from "./supabase";
import "./pages/SupplierDashboard.css";
function SupplierLayout({ currentUser, onLogout, isAr = true }) {
  const navigate = useNavigate();

const location = useLocation();

const activeSection = new URLSearchParams(location.search).get("section") || "dashboard";
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      alert(isAr ? "حدث خطأ أثناء تسجيل الخروج" : "Logout failed");
      return;
    }

    localStorage.removeItem("sarfhaCurrentUser");
    onLogout?.();
    navigate("/login");
  };

  if (!currentUser || currentUser.role !== "supplier") {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="supplier-dashboard" dir={isAr ? "rtl" : "ltr"}>
        <header className="supplier-header">
  <Link to="/" className="supplier-brand">
    <span className="supplier-brand-icon">♻</span>

    <span className="supplier-brand-text">
      <strong>صرفها</strong>
      <small>Sarrafha</small>
    </span>
  </Link>
</header>

      <aside className="supplier-sidebar">
        <h3>{isAr ? "القائمة الرئيسية" : "MAIN MENU"}</h3>

        <button
          className={activeSection === "dashboard" ? "active" : ""}
          onClick={() => navigate("/supplier-dashboard")}
        >
          {isAr ? "الرئيسية" : "Dashboard"}
        </button>

        <button
          className={activeSection === "products" ? "active" : ""}
          onClick={() => navigate("/supplier-dashboard?section=products")}
        >
          {isAr ? "منتجاتي" : "My Products"}
        </button>

        <button
          onClick={() => navigate("/add-product")}
        >
          {isAr ? "إضافة منتج" : "Add Product"}
        </button>

        <button
          className={activeSection === "orders" ? "active" : ""}
          onClick={() => navigate("/supplier-dashboard?section=orders")}
        >
          {isAr ? "طلبات العملاء" : "Customer Orders"}
        </button>

        <div className="sidebar-bottom-actions">
          <button onClick={() => navigate("/")}>
            {isAr ? "العودة للرئيسية" : "Back to Home"}
          </button>

          <button onClick={handleLogout}>
            {isAr ? "تسجيل الخروج" : "Logout"}
          </button>
        </div>
      </aside>

      <main className="supplier-content">
        <Outlet />
      </main>
    </div>
  );
}

export default SupplierLayout;

