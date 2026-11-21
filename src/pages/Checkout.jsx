
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

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
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  const handleConfirmOrder = (e) => {
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

    const newOrder = {
      id: Date.now(),
      userId: currentUser.id,
      customerName: name,
      email: currentUser.email,
      phone,
      address,
      items: cart,
      total,
      paymentMethod,
      status: "Pending",
      date: new Date().toLocaleDateString("en-GB"),
    };

    const existingOrders = JSON.parse(
      localStorage.getItem("sarrafha_orders") || "[]"
    );

    localStorage.setItem(
      "sarrafha_orders",
      JSON.stringify([...existingOrders, newOrder])
    );

    setCart([]);
    alert("تم تأكيد طلبك بنجاح!");
    navigate("/my-orders");
  };

  if (!currentUser || currentUser.role !== "customer") {
    return (
      <div className="checkout-page">
        <h2>يجب تسجيل الدخول كعميل لإتمام الطلب</h2>
        <button onClick={() => navigate("/login")}>تسجيل الدخول</button>
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

          <small>لا تستخدم بيانات بطاقة حقيقية. عملية الدفع هنا تجريبية فقط.</small>
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
