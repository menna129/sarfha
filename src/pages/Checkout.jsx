
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";
import { supabase } from "../supabase";

function Checkout({ cart, setCart }) {
  const navigate = useNavigate();

  const [currentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("sarfhaCurrentUser"));
    } catch {
      return null;
    }
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [name, setName] = useState(currentUser?.name || "");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * (item.quantity || 1),
    0
  );

  const handleConfirmOrder = async (e) => {
    e.preventDefault();

    if (!currentUser || currentUser.role !== "customer") {
      alert("سجلي الدخول بحساب عميل الأول");
      navigate("/login");
      return;
    }

    if (cart.length === 0) {
      alert("السلة فارغة");
      navigate("/");
      return;
    }

    if (paymentMethod === "card") {
      if (!cardNumber || !expiryDate || !cvv) {
        alert("يرجى إدخال بيانات البطاقة التجريبية");
        return;
      }
    }

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;

      if (!user) {
        alert("انتهت جلسة تسجيل الدخول، سجلي الدخول مرة أخرى");
        navigate("/login");
        return;
      }

      const orderItems = cart.map((item) => ({
        id: item.id,
        name: item.name,
        name_ar: item.name_ar || item.ar || "",
        price: Number(item.price),
        quantity: Number(item.quantity || 1),
      }));

      const { error } = await supabase.from("orders").insert([
        {
          customer_id: user.id,
          customer_name: name,
          email: user.email,
          phone,
          address,
          items: orderItems,
          total,
          payment_method: paymentMethod,
          status: "Pending",
        },
      ]);

      if (error) throw error;

      setCart([]);
      alert("تم تأكيد طلبك بنجاح!");
      navigate("/my-orders");
    } catch (error) {
      console.error("Order error:", error);
      alert("حدث خطأ أثناء حفظ الطلب. حاولي مرة أخرى.");
    }
  };

  if (!currentUser || currentUser.role !== "customer") {
    return (
      <div className="checkout-page">
        <h2>يجب تسجيل الدخول كعميل لإتمام الطلب</h2>
        <button onClick={() => navigate("/login")}>
          تسجيل الدخول
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-card">
        <h1>إتمام الطلب</h1>
        <p>يرجى مراجعة البيانات واختيار طريقة الدفع</p>

        <form onSubmit={handleConfirmOrder}>
          <label>الاسم بالكامل</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label>رقم الموبايل</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          <label>العنوان بالتفصيل</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />

          <h3>طريقة الدفع</h3>

          <label className="payment-option">
            <input
              type="radio"
              value="cod"
              checked={paymentMethod === "cod"}
              onChange={() => setPaymentMethod("cod")}
            />
            الدفع عند الاستلام
          </label>

          <label className="payment-option">
            <input
              type="radio"
              value="card"
              checked={paymentMethod === "card"}
              onChange={() => setPaymentMethod("card")}
            />
            الدفع بالبطاقة (تجريبي)
          </label>

          {paymentMethod === "card" && (
            <div className="card-fields">
              <label>رقم البطاقة التجريبي</label>
              <input
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="0000 0000 0000 0000"
              />

              <label>تاريخ الانتهاء</label>
              <input
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                placeholder="MM/YY"
              />

              <label>CVV تجريبي</label>
              <input
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="123"
              />

              <small>
                لا تستخدم بيانات بطاقة حقيقية. عملية الدفع هنا تجريبية فقط.
              </small>
            </div>
          )}

          <div className="checkout-total">
            الإجمالي: {total.toLocaleString("en-US")} جنيه
          </div>

          <button type="submit" className="confirm-order-btn">
            تأكيد الطلب
          </button>

          <button
            type="button"
            className="back-btn"
            onClick={() => navigate("/")}
          >
            العودة للتسوق
          </button>
        </form>
      </div>
    </div>
  );
}

export default Checkout;
