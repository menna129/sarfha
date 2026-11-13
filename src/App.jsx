
import { useState } from "react";
import "./App.css";

const products = [
  {
    id: 1,
    name: "Extra Virgin Olive Oil",
    ar: "زيت زيتون بكر ممتاز",
    category: "Food",
    categoryAr: "منتجات غذائية",
    oldPrice: 250,
    price: 150,
    discount: "40%",
    expiry: "30 Nov 2026",
    icon: "🫒",
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
  },
];

function App() {
  const [lang, setLang] = useState("ar");
  const [category, setCategory] = useState("All");

  const isAr = lang === "ar";

  const filteredProducts =
    category === "All"
      ? products
      : products.filter((p) => p.category === category);

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
          <a href="#login" className="login-btn">
            {isAr ? "تسجيل الدخول" : "Login"}
          </a>
        </div>
      </header>

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
                  <span className="product-emoji">{product.icon}</span>
                  <span className="discount">{product.discount === "New" ? (isAr ? "جديد" : "New") : `-${product.discount}`}</span>
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
  onClick={() => alert(product.name)}
>
  {isAr ? "عرض التفاصيل" : "View Details"}
</button>
                </div>
              </article>
            ))}
          </div>
        </section>

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

export default App;
