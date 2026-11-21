
import Signup from "./pages/Signup";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import SupplierDashboard from "./pages/SupplierDashboard";
import AddProduct from "./pages/AddProduct";
import CustomerDashboard from "./pages/CustomerDashboard";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
const products = [
  {
    id: 1,
    name: "Extra Virgin Olive oil",
    ar: "زيت زيتون بكر ممتاز",
    category: "Food",
    categoryAr: "منتجات غذائية",
    oldPrice: 250,
    price: 150,
    discount: "40%",
    expiry: "30 Nov 2026",
    icon: "🫒",
    image: "Olive-oil.png",
  },
  {
    id: 2,
    name: "Fresh Bakery Box",
    ar: "علبة مخبوزات طازجة",
    category: "Food",
    categoryAr: "منتجات غذائية",
    oldPrice: 180,
    price: 90,
    discount: "50%",
    expiry: "15 Nov 2026",
    icon: "🥐",
    image: "croisant.png",
  },
  {
    id: 3,
    name: "Electric Blender",
    ar: "خلاط كهربائي",
    category: "Electronics",
    categoryAr: "أجهزة كهربائية",
    oldPrice: 1200,
    price: 850,
    discount: "29%",
    expiry: "New",
    icon: "🔌",
    image: "Blender.png",
  },
  {
    id: 4,
    name: "Organic Honey",
    ar: "عسل نحل طبيعي",
    category: "Food",
    categoryAr: "منتجات غذائية",
    oldPrice: 320,
    price: 220,
    discount: "31%",
    expiry: "20 Dec 2026",
    icon: "🍯",
    image: "Honey.png",
  },
  {
    id: 5,
    name: "Industrial Meat Grinder",
    ar: "مفرمة لحوم صناعية",
    category: "Electronics",
    categoryAr: "أجهزة مطبخ",
    oldPrice: 22000,
    price: 18500,
    discount: "16%",
    expiry: "New",
    icon: "🥩",
    image: "Meat-Grinder.png",
  },
  {
    id: 6,
    name: "Ariston Water Heater",
    ar: "سخان مياه أريستون",
    category: "Electronics",
    categoryAr: "أجهزة منزلية",
    oldPrice: 4800,
    price: 4000,
    discount: "17%",
    expiry: "New",
    icon: "🚿",
    image: "Ariston-Heater.png",
  },
  {
    id: 7,
    name: "Electric Waffle Maker",
    ar: "ماكينة وافل كهربائية",
    category: "Electronics",
    categoryAr: "أجهزة مطبخ",
    oldPrice: 1800,
    price: 1500,
    discount: "17%",
    expiry: "New",
    icon: "🧇",
    image: "Waffle-Maker.png",
  },
  {
    id: 8,
    name: "Keplin Soup Maker",
    ar: "جهاز تحضير الشوربة Keplin",
    category: "Electronics",
    categoryAr: "أجهزة مطبخ",
    oldPrice: 6000,
    price: 5000,
    discount: "17%",
    expiry: "New",
    icon: "🥣",
    image: "Keplin-Soup-Maker.png",
  },
  {
    id: 9,
    name: "KitchenAid Artisan Mixer",
    ar: "عجان كيتشن إيد أرتيزان",
    category: "Electronics",
    categoryAr: "أجهزة مطبخ",
    oldPrice: 54000,
    price: 45000,
    discount: "17%",
    expiry: "New",
    icon: "🍰",
    image: "KitchenAid-Mixer.png",
  },
  {
    id: 10,
    name: "Folding Ironing Board",
    ar: "ترابيزة مكواة قابلة للطي",
    category: "Electronics",
    categoryAr: "مستلزمات منزلية",
    oldPrice: 1450,
    price: 1200,
    discount: "17%",
    expiry: "New",
    icon: "👕",
    image: "Ironing-Board.png",
  },
  {
    id: 11,
    name: "LED Desk Lamp",
    ar: "مصباح مكتب LED",
    category: "Electronics",
    categoryAr: "إضاءة ومستلزمات مكتبية",
    oldPrice: 950,
    price: 800,
    discount: "16%",
    expiry: "New",
    icon: "💡",
    image: "Desk-Lamp.png",
  },
  {
    id: 13,
    name: "Dell Laptop",
    ar: "لابتوب Dell",
    category: "Electronics",
    categoryAr: "أجهزة إلكترونية",
    oldPrice: 30000,
    price: 25000,
    discount: "17%",
    expiry: "New",
    icon: "💻",
    image: "Dell-Laptop.png",
  },
  {
    id: 14,
    name: "Mini Refrigerator",
    ar: "ثلاجة ميني صغيرة",
    category: "Electronics",
    categoryAr: "أجهزة منزلية",
    oldPrice: 10800,
    price: 9000,
    discount: "17%",
    expiry: "New",
    icon: "🧊",
    image: "Mini-Fridge.png",
  },
  ];

function HomePage({ cart, setCart, currentUser }) {
  const [supplierProducts] = useState(() => {
  try {
    return JSON.parse(
      localStorage.getItem("sarfha_supplier_products") || "[]"
    );
  } catch {
    return [];
  }
});

const allProducts = [...products, ...supplierProducts];
  const [lang, setLang] = useState("ar");
  const [category, setCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showCart, setShowCart] = useState(false);



  const isAr = lang === "ar";
const filteredProducts =
  category === "All"
    ? allProducts
    : allProducts.filter((p) => p.category === category);
  return (
   <div className={isAr ? "app arabic" : "app english"} dir={isAr ? "rtl" : "ltr"}>

  <header className="navbar">
    <a className="brand" href="#">
      <span className="brand-icon">♻</span>
      <span>
        <strong>صرفها</strong>
        <small>Sarrafha</small>
      </span>
    </a>

    <nav>
      <a href="#home">{isAr ? "الرئيسية" : "Home"}</a>
      <a href="#products">{isAr ? "المنتجات" : "Products"}</a>
      <a href="#about">{isAr ? "عن صرفها" : "About Us"}</a>
    </nav>

    <div className="nav-actions">
      <button className="language-btn" onClick={() => setLang(isAr ? "en" : "ar")}>
        {isAr ? "EN" : "عربي"}
      </button>

<button className="cart-btn" onClick={() => setShowCart(true)}>
  🛒 {isAr ? "السلة" : "Cart"} ({cart.reduce((sum, item) => sum + (item.quantity || 1), 0)})
</button>
{currentUser ? (
  <Link
    to={
      currentUser.role === "supplier"
        ? "/supplier-dashboard"
        : "/customer-dashboard"
    }
    className="login-btn"
  >
    {isAr ? "حسابي" : "My Account"}
  </Link>
) : (
  <Link to="/login" className="login-btn">
    {isAr ? "تسجيل الدخول" : "Login"}
  </Link>
)}
    </div>
  </header>

  {showCart && (
    <div className="modal-overlay">
      <div className="product-modal">
        <h2>{isAr ? "سلة التسوق" : "Shopping Cart"}</h2>

        {cart.length === 0 ? (
          <p>{isAr ? "السلة فارغة" : "Your cart is empty"}</p>
        ) : (
          <>
         {cart.map((item, index) => (
  <div className="cart-item" key={item.id}>
    <span>{isAr ? item.ar : item.name}</span>

    <strong>
      {item.price * (item.quantity || 1)} {isAr ? "جنيه" : "EGP"}
    </strong>

    <div className="quantity-controls">
      <button onClick={() =>
        setCart(cart.map((p, i) =>
          i === index ? { ...p, quantity: (p.quantity || 1) + 1 } : p
        ))
      }>+</button>

      <span>{item.quantity || 1}</span>

      <button onClick={() =>
        setCart(cart.map((p, i) =>
          i === index ? { ...p, quantity: Math.max(1, (p.quantity || 1) - 1) } : p
        ))
      }>-</button>

      <button onClick={() =>
        setCart(cart.filter((_, i) => i !== index))
      }>
        {isAr ? "حذف" : "Remove"}
      </button>
    </div>
  </div>
))}

<div className="cart-total-section">
  <h3>
    {isAr ? "الإجمالي: " : "Total: "}
    {cart.reduce(
      (sum, item) => sum + item.price * (item.quantity || 1),
      0
    )}{" "}
    {isAr ? "جنيه" : "EGP"}
  </h3>

  <Link
    to="/checkout"
    className="buy-btn"
    onClick={() => setShowCart(false)}
  >
    {isAr ? "إتمام الطلب" : "Checkout"}
  </Link>
</div>

          </>
        )}

        <button className="modal-back" onClick={() => setShowCart(false)}>
          {isAr ? "إغلاق" : "Close"}
        </button>
      </div>
    </div>
  )}

      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <span className="eyebrow">
              ✦ {isAr ? "تسوّق بذكاء • قلّل الهدر" : "SHOP SMART • REDUCE WASTE"}
            </span>

            <h1>
              {isAr
                ? "اللي غيرك شايفه فائض، أنت تشوفه فرصة."
                : "What others see as surplus, you see as an opportunity."}
            </h1>

            <p>
              {isAr
                ? "اكتشف منتجات بجودة جيدة وأسعار أقل، وساعدنا نحول الفائض إلى قيمة بدل الهدر."
                : "Discover quality products at lower prices and help us turn surplus into value instead of waste."}
            </p>

            <div className="hero-actions">
              <a href="#products" className="primary-btn">
                {isAr ? "اكتشف المنتجات ←" : "Explore Products →"}
              </a>
              <a href="#about" className="secondary-btn">
                {isAr ? "اعرف أكتر" : "Learn More"}
              </a>
            </div>

            <div className="hero-stats">
              <div>
                <strong>40%</strong>
                <span>{isAr ? "متوسط التوفير" : "Average Savings"}</span>
              </div>
              <div>
                <strong>100%</strong>
                <span>{isAr ? "فرص أقل للهدر" : "Less Waste"}</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-circle">
              <span>♻</span>
            </div>
            <div className="floating-card">
              <span>🌿</span>
              <div>
                <strong>{isAr ? "أنقذ منتجاً اليوم" : "Save a product today"}</strong>
                <small>{isAr ? "اشتري بذكاء ووفّر" : "Shop smart and save"}</small>
              </div>
            </div>
            <div className="visual-caption">
              {isAr ? "كل منتج يستحق فرصة تانية" : "Every product deserves another chance"}
            </div>
          </div>
        </section>

        <section className="features">
          <div>
            <span>♻</span>
            <strong>{isAr ? "تقليل الهدر" : "Less Waste"}</strong>
          </div>
          <div>
            <span>🏷</span>
            <strong>{isAr ? "أسعار أقل" : "Better Prices"}</strong>
          </div>
          <div>
            <span>🤝</span>
            <strong>{isAr ? "فرص أفضل" : "Better Opportunities"}</strong>
          </div>
        </section>

        <section className="products-section" id="products">
          <div className="section-heading">
            <div>
              <span className="eyebrow">{isAr ? "تسوق بذكاء" : "SHOP SMART"}</span>
              <h2>{isAr ? "اكتشف المنتجات المتاحة" : "Discover Available Products"}</h2>
              <p>{isAr ? "منتجات مميزة بأسعار أقل قبل ما تضيع الفرصة." : "Quality products at lower prices before the opportunity is gone."}</p>
            </div>
          </div>

          <div className="filters">
            {[
              ["All", isAr ? "الكل" : "All"],
              ["Food", isAr ? "الأغذية" : "Food"],
              ["Electronics", isAr ? "الأجهزة الكهربائية" : "Electronics"],
            ].map(([value, label]) => (
              <button
                key={value}
                className={category === value ? "filter active" : "filter"}
                onClick={() => setCategory(value)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="product-grid">
            {filteredProducts.map((product) => (



              <article className="product-card" key={product.id}>
                <div className="product-image">
                 
          <img
  className="product-photo"
src={
  product.image.startsWith("data:")
    ? product.image
    : `${import.meta.env.BASE_URL}${product.image}`
}
  alt={isAr ? product.ar : product.name}
/>
                </div>
                <div className="product-info">
                  <small>{isAr ? product.categoryAr : product.category}</small>
                  <h3>{isAr ? product.ar : product.name}</h3>
                  <div className="price-row">
                    <strong>{product.price} {isAr ? "ج.م" : "EGP"}</strong>
                    <del>{product.oldPrice} {isAr ? "ج.م" : "EGP"}</del>
                  </div>
                  <p className="expiry">
                    ⏳ {isAr ? "الصلاحية / الحالة:" : "Expiry / Condition:"} {product.expiry}
                  </p>
<button
  className="buy-btn"
  onClick={() => setSelectedProduct(product)}
>
  {isAr ? "عرض التفاصيل" : "View Details"}
</button>
              
                </div>
              </article>
            ))}
          </div>
        </section>

{selectedProduct && (
  <div className="modal-overlay">
    <div className="product-modal">

      <button
        className="modal-close"
        onClick={() => setSelectedProduct(null)}
      >
        ×
      </button>

<div className="modal-image">
  <img
   src={
  selectedProduct.image.startsWith("data:")
    ? selectedProduct.image
    : `${import.meta.env.BASE_URL}${selectedProduct.image}`
}
    alt={selectedProduct.name}
    onError={(e) => {
      e.currentTarget.style.display = "none";
    }}
  />

  <span className="discount">
    {selectedProduct.discount === "New"
      ? (isAr ? "جديد" : "New")
      : `-${selectedProduct.discount}`}
  </span>
</div>


      <div className="modal-content">
        <small>
          {isAr
            ? selectedProduct.categoryAr
            : selectedProduct.category}
        </small>

        <h2>
          {isAr
            ? selectedProduct.ar
            : selectedProduct.name}
        </h2>

        <div className="price-row">
          <strong>
            {selectedProduct.price} {isAr ? "ج.م" : "EGP"}
          </strong>
          <del>
            {selectedProduct.oldPrice} {isAr ? "ج.م" : "EGP"}
          </del>
        </div>

        <p>
          {isAr ? "الصلاحية / الحالة: " : "Expiry / Condition: "}
          {selectedProduct.expiry}
        </p>

        <p>
          {isAr
            ? "منتج متاح ضمن عروض صرفها. اغتنم الفرصة ووفر في مشترياتك."
            : "Available through Sarfha offers. Shop smart and save."}
        </p>
<button
  className="buy-btn"
  onClick={() => {
    setCart((currentCart) => {
      const existing = currentCart.find(
        (item) => item.id === selectedProduct.id
      );

      if (existing) {
        return currentCart.map((item) =>
          item.id === selectedProduct.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }

      return [...currentCart, { ...selectedProduct, quantity: 1 }];
    });

    alert(isAr ? "تمت الإضافة للسلة" : "Added to cart");
    setSelectedProduct(null);
  }}
>
  {isAr ? "أضف إلى السلة" : "Add to Cart"}
</button>

        <button
          className="modal-back"
          onClick={() => setSelectedProduct(null)}
        >
          {isAr ? "إغلاق" : "Close"}
        </button>
      </div>
    </div>
  </div>
)}

        <section className="about-section" id="about">
          <span className="eyebrow">{isAr ? "رسالتنا" : "OUR MISSION"}</span>
          <h2>{isAr ? "معاً نحو عالم أقل هدراً" : "Together Towards a World with Less Waste"}</h2>
          <p>
            {isAr
              ? "صرفها بتربط الموردين بالعملاء لتحويل المنتجات الفائضة إلى فرص مفيدة للطرفين."
              : "Sarrafha connects suppliers with customers, turning surplus products into valuable opportunities for everyone."}
          </p>
        </section>
      </main>

      <footer>
        <div className="brand footer-brand">
          <span className="brand-icon">♻</span>
          <span><strong>صرفها</strong><small>Sarrafha</small></span>
        </div>
        <p>© 2026 Sarrafha. {isAr ? "جميع الحقوق محفوظة." : "All rights reserved."}</p>
      </footer>
    </div>
  );
}


function App() {
  const [currentUser, setCurrentUser] = useState(() => {
  try {
    return JSON.parse(localStorage.getItem("sarfhaCurrentUser")) || null;
  } catch {
    return null;
  }
});
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("sarrafha_cart")) || [];
    } catch (error) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("sarrafha_cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <Routes>
        
        <Route
  path="/"
  element={
    <HomePage
      cart={cart}
      setCart={setCart}
      currentUser={currentUser}
    />
  }
/>
<Route
  path="/login"
  element={<Login onLogin={setCurrentUser} />}
/>
        <Route path="/signup" element={<Signup />} />
        
        <Route
  path="/supplier-dashboard"
  element={
    <SupplierDashboard
      onLogout={() => setCurrentUser(null)}
    />
  }
/>
<Route
  path="/add-product"
  element={<AddProduct />}
/>
<Route
  path="/customer-dashboard"
  element={<CustomerDashboard />}
/>

<Route
  path="/checkout"
  element={<Checkout cart={cart} setCart={setCart} />}
/>
<Route
  path="/my-orders"
  element={<MyOrders />}
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
