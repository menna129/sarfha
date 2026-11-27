

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import "./MyOrders.css";

function MyOrders({ currentUser }) {
  const navigate = useNavigate();


  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const statusLabels = {
    Pending: "قيد المراجعة",
    Processing: "جاري التجهيز",
    Delivered: "تم التسليم",
  };

useEffect(() => {
  const fetchOrders = async () => {
    try {
      if (!currentUser || currentUser.role !== "customer") {
        setLoading(false);
        return;
      }

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;

      if (!user || user.id !== currentUser.id) {
        throw new Error("جلسة تسجيل الدخول غير متطابقة");
      }

      // 1. جلب طلبات العميل
      const { data: ordersData, error: ordersError } =
        await supabase
          .from("orders")
          .select("*")
          .eq("customer_id", user.id)
          .order("created_at", { ascending: false });

      if (ordersError) throw ordersError;

      const allOrders = ordersData || [];

      // 2. استخراج أرقام المنتجات
      const productIds = [
        ...new Set(
          allOrders.flatMap((order) =>
            (order.items || []).map((item) => item.id)
          )
        ),
      ];

      // 3. جلب المورد الخاص بكل منتج
      let productsMap = {};

      if (productIds.length > 0) {
        const { data: productsData, error: productsError } =
          await supabase
            .from("products")
            .select("id, supplier_id")
            .in("id", productIds);

        if (productsError) throw productsError;

        (productsData || []).forEach((product) => {
          productsMap[String(product.id)] = product.supplier_id;
        });
      }

      // 4. جلب حالات الطلبات
      const orderIds = allOrders.map((order) => order.id);
      let statuses = [];

      if (orderIds.length > 0) {
        const { data: statusData, error: statusError } =
          await supabase
            .from("supplier_order_status")
            .select("order_id, supplier_id, status")
            .in("order_id", orderIds);

        if (statusError) throw statusError;

        statuses = statusData || [];
      }

      // 5. ربط كل منتج بحالة المورد الخاص به
      const ordersWithStatuses = allOrders.map((order) => {
        const items = (order.items || []).map((item) => {
          const supplierId = productsMap[String(item.id)];

          const productStatus = statuses.find(
            (status) =>
              String(status.order_id) === String(order.id) &&
              String(status.supplier_id) === String(supplierId)
          );

          return {
            ...item,
            status: productStatus?.status || "Pending",
          };
        });

        return {
          ...order,
          items,
        };
      });

      setOrders(ordersWithStatuses);
    } catch (err) {
      console.error("Fetch orders error:", err);
      setError("حدث خطأ أثناء تحميل الطلبات. حاولي مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  fetchOrders();
}, [currentUser]);

   

  const handleDeleteOrder = async (orderId) => {
    const order = orders.find(
      (item) => String(item.id) === String(orderId)
    );

    const canDelete =
      order &&
      order.items.every((item) => item.status === "Pending");

    if (!canDelete) {
      alert("لا يمكن حذف الطلب بعد بدء تجهيزه.");
      return;
    }

    const confirmed = window.confirm(
      "هل أنتِ متأكدة من حذف هذا الطلب؟"
    );

    if (!confirmed) return;

    try {
      setDeletingId(orderId);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;

      if (!user || user.id !== currentUser.id) {
        throw new Error("جلسة تسجيل الدخول غير متطابقة");
      }

      const { data, error: deleteError } = await supabase
        .from("orders")
        .delete()
        .eq("id", orderId)
        .eq("customer_id", user.id)
        .eq("status", "Pending")
        .select("id");

      if (deleteError) throw deleteError;

      if (!data || data.length === 0) {
        throw new Error(
          "لم يتم حذف الطلب. قد تكون حالته تغيرت أو لا تملكين صلاحية حذفه."
        );
      }

      setOrders((previousOrders) =>
        previousOrders.filter(
          (order) => String(order.id) !== String(orderId)
        )
      );

      alert("تم حذف الطلب بنجاح");
    } catch (err) {
      console.error("Delete order error:", err);
      alert(err.message || "حدث خطأ أثناء حذف الطلب");
    } finally {
      setDeletingId(null);
    }
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

        {loading ? (
          <div className="empty-orders">
            <h3>جاري تحميل طلباتك...</h3>
          </div>
        ) : error ? (
          <div className="empty-orders">
            <h3>{error}</h3>
            <button onClick={() => window.location.reload()}>
              إعادة المحاولة
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-orders">
            <h3>لا توجد طلبات حتى الآن</h3>
            <button onClick={() => navigate("/")}>
              تصفح المنتجات
            </button>
          </div>
        ) : (
          orders.map((order) => (
            <div className="order-card" key={order.id}>
              <div className="order-top">
                <strong>رقم الطلب: #{order.id}</strong>
              </div>

              <p>
                تاريخ الطلب:{" "}
                {new Date(order.created_at).toLocaleString("ar-EG")}
              </p>

              <p>الاسم: {order.customer_name}</p>
              <p>رقم الهاتف: {order.phone}</p>
              <p>العنوان: {order.address}</p>

              <div className="order-products">
                <h4>المنتجات:</h4>

                {order.items.map((item, index) => (
                  <div
                    className="order-product"
                    key={`${item.id}-${index}`}
                  >
                    <div>
                      <span>{item.name_ar || item.name}</span>

                      <p className="order-status">
                        الحالة:{" "}
                        {statusLabels[item.status] || item.status}
                      </p>
                    </div>

                    <span>
                      {item.quantity || 1} ×{" "}
                      {Number(item.price).toLocaleString("en-US")} جنيه
                    </span>
                  </div>
                ))}
              </div>

              <p>
                طريقة الدفع:{" "}
                {order.payment_method === "cod"
                  ? "الدفع عند الاستلام"
                  : "بطاقة تجريبية"}
              </p>

              <h3>
                الإجمالي:{" "}
                {Number(order.total).toLocaleString("en-US")} جنيه
              </h3>

              {order.status === "Pending" &&
                order.items.every(
                  (item) => item.status === "Pending"
                ) && (
                  <button
                    type="button"
                    className="delete-order-btn"
                    disabled={deletingId === order.id}
                    onClick={() => handleDeleteOrder(order.id)}
                  >
                    {deletingId === order.id
                      ? "جاري الحذف..."
                      : "حذف الطلب"}
                  </button>
                )}
            </div>
          ))
        )}
      </main>
    </div>
  );
}

export default MyOrders;
