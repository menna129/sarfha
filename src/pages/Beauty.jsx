
import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import "./Beauty.css";

const subcategories = [
  { value: "All", ar: "الكل", en: "All" },
  { value: "Skincare", ar: "العناية بالبشرة", en: "Skincare" },
  { value: "Makeup", ar: "المكياج", en: "Makeup" },
  { value: "Haircare", ar: "العناية بالشعر", en: "Haircare" },
  { value: "Bodycare", ar: "العناية بالجسم", en: "Bodycare" },
  { value: "Perfumes", ar: "العطور", en: "Perfumes" },
];

function getImageSrc(image) {
  if (!image) return "";

  if (
    image.startsWith("data:") ||
    image.startsWith("http://") ||
    image.startsWith("https://")
  ) {
    return image;
  }

  return `${import.meta.env.BASE_URL}${image}`;
}

export default function Beauty({ cart, setCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState("ar");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const isAr = lang === "ar";

  useEffect(() => {
    async function loadBeautyProducts() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category", "Beauty")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading beauty products:", error.message);
        setProducts([]);
      } else {
        setProducts(
          (data || []).map((product) => ({
            ...product,
            ar: product.name_ar || product.name,
            oldPrice: Number(product.old_price || product.price),
            price: Number(product.price),
            image: product.image || "",
            categoryAr: "التجميل والعناية الشخصية",
            expiry: product.expiry_date || "—",
          }))
        );
      }

      setLoading(false);
    }

    loadBeautyProducts();
  }, []);

  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter(
          (product) => product.subcategory === activeCategory
        );

  function addToCart(product) {
    setCart((currentCart) => {
      const existing = currentCart.find(
        (item) => item.id === product.id
      );

      if (existing) {
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }

      return [...currentCart, { ...product, quantity: 1 }];
    });

    alert(isAr ? "تمت الإضافة للسلة" : "Added to cart");
    setSelectedProduct(null);
  }

  return (
    <div className="beauty-page" dir={isAr ? "rtl" : "ltr"}>
      <header className="beauty-header">
        <div>
          <span className="beauty-eyebrow">
            {isAr ? "اكتشفي عالم الجمال" : "DISCOVER BEAUTY"}
          </span>

          <h1>
            {isAr ? "التجميل والعناية الشخصية" : "Beauty & Personal Care"}
          </h1>

          <p>
            {isAr
              ? "منتجات مختارة للعناية بجمالك بأسعار مميزة."
              : "Discover beauty and personal care products at special prices."}
          </p>
        </div>

        <button
          className="beauty-language-btn"
          onClick={() => setLang(isAr ? "en" : "ar")}
        >
          {isAr ? "EN" : "عربي"}
        </button>
      </header>

      <div className="beauty-filters">
        {subcategories.map((category) => (
          <button
            key={category.value}
            className={
              activeCategory === category.value
                ? "beauty-filter active"
                : "beauty-filter"
            }
            onClick={() => setActiveCategory(category.value)}
          >
            {isAr ? category.ar : category.en}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="beauty-message">
          {isAr ? "جاري تحميل المنتجات..." : "Loading products..."}
        </p>
      ) : filteredProducts.length === 0 ? (
        <p className="beauty-message">
          {isAr ? "لا توجد منتجات في هذا القسم حاليًا." : "No products available in this category yet."}
        </p>
      ) : (
        <div className="beauty-grid">
          {filteredProducts.map((product) => (
            <article className="beauty-card" key={product.id}>
              <div className="beauty-image">
                {product.image && (
                  <img
                    src={getImageSrc(product.image)}
                    alt={isAr ? product.ar : product.name}
                  />
                )}
              </div>

              <div className="beauty-info">
                <small>
                  {isAr
                    ? subcategories.find(
                        (item) => item.value === product.subcategory
                      )?.ar || "العناية الشخصية"
                    : product.subcategory || "Beauty"}
                </small>

                <h3>{isAr ? product.ar : product.name}</h3>

                <div className="beauty-price">
                  <strong>{product.price} {isAr ? "ج.م" : "EGP"}</strong>

                  {product.oldPrice > product.price && (
                    <del>{product.oldPrice} {isAr ? "ج.م" : "EGP"}</del>
                  )}
                </div>

                <button
                  className="beauty-details-btn"
                  onClick={() => setSelectedProduct(product)}
                >
                  {isAr ? "عرض التفاصيل" : "View Details"}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {selectedProduct && (
        <div className="beauty-modal-overlay">
          <div className="beauty-modal">
            <button
              className="beauty-modal-close"
              onClick={() => setSelectedProduct(null)}
            >
              ×
            </button>

            {selectedProduct.image && (
              <img
                src={getImageSrc(selectedProduct.image)}
                alt={selectedProduct.name}
              />
            )}

            <h2>{isAr ? selectedProduct.ar : selectedProduct.name}</h2>

            <strong>
              {selectedProduct.price} {isAr ? "جنيه" : "EGP"}
            </strong>

            <p>
              {isAr
                ? "منتج متاح ضمن عروض صرفها."
                : "Available through Sarrafha offers."}
            </p>

            <button
              className="beauty-details-btn"
              onClick={() => addToCart(selectedProduct)}
            >
              {isAr ? "أضف إلى السلة" : "Add to Cart"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
