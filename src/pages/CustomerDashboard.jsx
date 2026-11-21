
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CustomerDashboard.css";

function CustomerDashboard() {
  const navigate = useNavigate();

  const [currentUser] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("sarfhaCurrentUser")
      );
    } catch {
      return null;
    }
  });

  const [lang, setLang] = useState("ar");
  const isAr = lang === "ar";

const ordersCount = (() => {
  try {
    const allOrders = JSON.parse(
      localStorage.getItem("sarrafha_orders") || "[]"
    );

    return allOrders.filter(
      (order) => order.userId === currentUser?.id
    ).length;
  } catch {
    return 0;
  }
})();

const lastOrder = (() => {
  try {
    const allOrders = JSON.parse(
      localStorage.getItem("sarrafha_orders") || "[]"
    );

    const userOrders = allOrders.filter(
      (order) => order.userId === currentUser?.id
    );

    return userOrders.length > 0
      ? userOrders[userOrders.length - 1]
      : null;
  } catch {
    return null;
  }
})();

  const handleLogout = () => {
    localStorage.removeItem("sarfhaCurrentUser");
    navigate("/login");
  };

  if (!currentUser || currentUser.role !== "customer") {
    return (
      <div className="customer-dashboard">
        <h2>
          {isAr ? "يجب تسجيل الدخول كعميل" : "Customer login required"}
        </h2>
        <button onClick={() => navigate("/login")}>
          {isAr ? "تسجيل الدخول" : "Login"}
        </button>
      </div>
    );
  }

  return (
    <div className="customer-dashboard" dir={isAr ? "rtl" : "ltr"}>
      <header className="customer-header">
        <h2>♻ صرفها | Sarrafha</h2>

        <div>
          <button onClick={() => setLang(isAr ? "en" : "ar")}>
            {isAr ? "EN" : "عربي"}
          </button>

          <button onClick={handleLogout}>
            {isAr ? "تسجيل الخروج" : "Logout"}
          </button>
        </div>
      </header>

      <main className="customer-content">
        <h1>
          {isAr
            ? `أهلاً ${currentUser.name}`
            : `Welcome ${currentUser.name}`}
        </h1>

        <p>
          {isAr
            ? "مرحباً بك في حسابك على صرفها"
            : "Welcome to your Sarrafha account"}
        </p>



<div className="dashboard-cards">

  <div className="customer-card">
    <h2>{isAr ? "بيانات حسابك" : "Your Account"}</h2>
    <p>{isAr ? "الاسم:" : "Name:"} {currentUser.name}</p>
    <p>{isAr ? "البريد الإلكتروني:" : "Email:"} {currentUser.email}</p>
  </div>

  <div className="customer-card">
    <h2>{isAr ? "ملخص طلباتك" : "Your Orders Summary"}</h2>
    <p>
      {isAr ? "عدد طلباتك:" : "Total Orders:"} {ordersCount}
    </p>
  </div>

  <div className="customer-card">
    <h2>{isAr ? "آخر طلب ليك" : "Your Latest Order"}</h2>

    {lastOrder ? (
      <>
        <p>{isAr ? "رقم الطلب:" : "Order ID:"} {lastOrder.id}</p>
        <p>{isAr ? "تاريخ الطلب:" : "Order Date:"} {lastOrder.date}</p>
        <p>{isAr ? "حالة الطلب:" : "Order Status:"} {lastOrder.status}</p>
        <p>{isAr ? "الإجمالي:" : "Total:"} {lastOrder.total} EGP</p>
      </>
    ) : (
      <p>{isAr ? "لا توجد طلبات حتى الآن" : "No orders yet"}</p>
    )}
  </div>

</div>

<button onClick={() => navigate("/")}>
  {isAr ? "تصفح المنتجات" : "Browse Products"}
</button>

<button onClick={() => navigate("/my-orders")}>
  {isAr ? "طلباتي" : "My Orders"}

</button>
      </main>
    </div>
  );
}

export default CustomerDashboard;