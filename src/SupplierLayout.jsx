


import { useState } from "react";
import { Outlet, useNavigate, Link, Navigate, useLocation } from "react-router-dom";
import { supabase } from "./supabase";
import "./pages/SupplierDashboard.css";

function SupplierLayout({ currentUser, onLogout, isAr = true }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const activeSection =
    new URLSearchParams(location.search).get("section") || "dashboard";

  const navigateAndClose = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

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

        <button
          className="mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isAr ? "فتح القائمة" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? "✕" : "☰"}
        </button>
      </header>

      {isMobileMenuOpen && (
        <button
          className="mobile-menu-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-label={isAr ? "إغلاق القائمة" : "Close menu"}
        />
      )}

      <aside
        className={`supplier-sidebar ${
          isMobileMenuOpen ? "mobile-menu-open" : ""
        }`}
      >
        <h3>{isAr ? "القائمة الرئيسية" : "MAIN MENU"}</h3>

        <button
          className={activeSection === "dashboard" ? "active" : ""}
          onClick={() => navigateAndClose("/supplier-dashboard")}
        >
          {isAr ? "الرئيسية" : "Dashboard"}
        </button>

        <button
          className={activeSection === "products" ? "active" : ""}
          onClick={() =>
            navigateAndClose("/supplier-dashboard?section=products")
          }
        >
          {isAr ? "منتجاتي" : "My Products"}
        </button>

        <button onClick={() => navigateAndClose("/add-product")}>
          {isAr ? "إضافة منتج" : "Add Product"}
        </button>

        <button
          className={activeSection === "orders" ? "active" : ""}
          onClick={() =>
            navigateAndClose("/supplier-dashboard?section=orders")
          }
        >
          {isAr ? "طلبات العملاء" : "Customer Orders"}
        </button>

        <div className="sidebar-bottom-actions">
          <button onClick={() => navigateAndClose("/")}>
            {isAr ? "العودة للرئيسية" : "Back to Home"}
          </button>

          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              handleLogout();
            }}
          >
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
