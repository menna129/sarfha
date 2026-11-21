
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyOrders.css";

function MyOrders() {
  const navigate = useNavigate();

  const [currentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("sarfhaCurrentUser"));
    } catch {
      return null;
    }
  });

  const [orders, setOrders] = useState(() => {
    try {
      const allOrders = JSON.parse(
        localStorage.getItem("sarrafha_orders") || "[]"
      );

      return allOrders.filter(
        (order) => order.userId === currentUser?.id
      );
    } catch {
      return [];
    }
  });

  const handleDeleteOrder = (orderId) => {
    const confirmed = window.confirm(
      "هل أنت متأكد من حذف هذا الطلب؟"
    );

    if (!confirmed) return;

    const allOrders = JSON.parse(
      localStorage.getItem("sarrafha_orders") || "[]"
    );

    const updatedAllOrders = allOrders.filter(
      (order) =>
        !(order.id === orderId && order.userId === currentUser.id)
    );

    localStorage.setItem(
      "sarrafha_orders",
      JSON.stringify(updatedAllOrders)
    );

    setOrders((previousOrders) =>
      previousOrders.filter((order) => order.id !== orderId)
    );
  };

  if (!currentUser || currentUser.role !== "customer") {
    return (
      <div className="my-orders-page">
        <h2>يجب تسجيل الدخول كعميل</h2>
        <button onClick={() => navigate("/login")}>
          تسجيل الدخول
        </button>
      </div>
    );
  }

  return (
    <div className="my-orders-page">
      <header className="orders-header">
        <h1>♻ صرفها | طلباتي</h1>
        <button onClick={() => navigate("/customer-dashboard")}>
          العودة لحسابي
        </button>
      </header>

      <main className="orders-content">
        <h2>طلباتي السابقة</h2>

        {orders.length === 0 ? (
          <div className="empty-orders">
            <h3>لا توجد طلبات حتى الآن</h3>
            <button onClick={() => navigate("/")}>
              تصفح المنتجات
            </button>
          </div>
        ) : (
          orders.slice().reverse().map((order) => (
            <div className="order-card" key={order.id}>
              <div className="order-top">
                <strong>رقم الطلب: #{order.id}</strong>
                <span className="order-status">
                  {order.status === "Pending"
                    ? "قيد المراجعة"
                    : order.status}
                </span>
              </div>

              <p>تاريخ الطلب: {order.date}</p>
              <p>الاسم: {order.customerName}</p>
              <p>رقم الهاتف: {order.phone}</p>
              <p>العنوان: {order.address}</p>

              <div className="order-products">
                <h4>المنتجات:</h4>

                {order.items.map((item, index) => (
                  <div
                    className="order-product"
                    key={`${item.id}-${index}`}
                  >
                    <span>{item.ar || item.name}</span>
                    <span>
                      {item.quantity || 1} × {item.price} جنيه
                    </span>
                  </div>
                ))}
              </div>

              <p>
                طريقة الدفع:{" "}
                {order.paymentMethod === "cod"
                  ? "الدفع عند الاستلام"
                  : "بطاقة تجريبية"}
              </p>

              <h3>
                الإجمالي: {order.total.toLocaleString("en-US")} جنيه
              </h3>

              <button
                type="button"
                className="delete-order-btn"
                onClick={() => handleDeleteOrder(order.id)}
              >
                حذف الطلب
              </button>
            </div>
          ))
        )}
      </main>
    </div>
  );
}

export default MyOrders;
