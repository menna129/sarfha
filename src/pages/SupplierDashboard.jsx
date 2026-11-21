
import { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import "./SupplierDashboard.css";

function SupplierDashboard({ isAr = true, onLogout }) {
  const navigate = useNavigate();

  const [currentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("sarfhaCurrentUser"));
    } catch {
      return null;
    }
  });

  const [showForm, setShowForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [image, setImage] = useState("");
  const [supplierProducts, setSupplierProducts] = useState(() => {
  try {
    const saved = JSON.parse(
      localStorage.getItem("sarfha_supplier_products") || "[]"
    );

    return saved.filter(
      (product) => product.supplierId === currentUser?.id
    );
  } catch {
    return [];
  }
});

  const [formData, setFormData] = useState({
    name: "",
    ar: "",
    category: "Food",
    oldPrice: "",
    price: "",
    quantity: "",
    expiry: "",
  });

  if (!currentUser || currentUser.role !== "supplier") {
    return <Navigate to="/login" replace />;
  }
const handleDelete = (productId) => {
  const confirmed = window.confirm(
    isAr ? "هل أنتِ متأكدة من حذف المنتج؟" : "Are you sure you want to delete this product?"
  );

  if (!confirmed) return;

  const savedProducts = JSON.parse(
    localStorage.getItem("sarfha_supplier_products") || "[]"
  );

  const updatedProducts = savedProducts.filter(
    (product) => product.id !== productId
  );

  localStorage.setItem(
    "sarfha_supplier_products",
    JSON.stringify(updatedProducts)
  );

  setSupplierProducts(
    updatedProducts.filter(
      (product) => product.supplierId === currentUser.id
    )
  );
};
const handleLogout = () => {
  localStorage.removeItem("sarfhaCurrentUser");
  onLogout?.();
  navigate("/login");
};

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();


    if (Number(formData.price) >= Number(formData.oldPrice)) {
      alert(isAr ? "السعر بعد الخصم لازم يكون أقل من السعر القديم" : "Discounted price must be lower than old price");
      return;
    }

    const discount = Math.round(
      ((Number(formData.oldPrice) - Number(formData.price)) /
        Number(formData.oldPrice)) * 100
    );
const newProduct = {
  id: editingProductId || Date.now(),
  name: formData.name,
  ar: formData.ar,
  category: formData.category,
  categoryAr:
    formData.category === "Food"
      ? "منتجات غذائية"
      : "أجهزة كهربائية",
  oldPrice: Number(formData.oldPrice),
  price: Number(formData.price),
  discount: `${discount}%`,
  quantity: Number(formData.quantity),
  expiry: formData.expiry,
  icon: formData.category === "Food" ? "🥐" : "🔌",
  image: image,
  supplierId: currentUser.id,
};

const savedProducts = JSON.parse(
  localStorage.getItem("sarfha_supplier_products") || "[]"
);

let updatedProducts;

if (editingProductId) {
  updatedProducts = savedProducts.map((product) =>
    product.id === editingProductId ? newProduct : product
  );

  alert(isAr ? "تم تعديل المنتج بنجاح" : "Product updated successfully");
} else {
  updatedProducts = [...savedProducts, newProduct];

  alert(isAr ? "تمت إضافة المنتج بنجاح" : "Product added successfully");
}

localStorage.setItem(
  "sarfha_supplier_products",
  JSON.stringify(updatedProducts)
);

setSupplierProducts(
  updatedProducts.filter(
    (product) => product.supplierId === currentUser.id
  )
);

setEditingProductId(null);

setFormData({
  name: "",
  ar: "",
  category: "Food",
  oldPrice: "",
  price: "",
  quantity: "",
  expiry: "",
});

setImage("");
setShowForm(false);
  };

  return (
    <div className="supplier-dashboard" dir={isAr ? "rtl" : "ltr"}>
        
<header className="supplier-header">
  <Link to="/" className="login-brand">
    <span className="brand-icon">♻</span>
    <span>
      <strong>صرفها</strong>
      <small>Sarrafha</small>
    </span>
  </Link>

  <div className="supplier-header-actions">
    <button
      type="button"
      onClick={() => navigate("/")}
      className="supplier-home-btn"
    >
      {isAr ? "العودة للرئيسية" : "Back to Home"}
    </button>

    <button type="button" onClick={handleLogout}>
      {isAr ? "تسجيل الخروج" : "Logout"}
    </button>
  </div>
</header>


      <main className="supplier-content">
        <h1>
          {isAr
            ? `أهلاً ${currentUser.name}`
            : `Welcome ${currentUser.name}`}
        </h1>

        <p>
          {isAr
            ? "مرحباً بك في لوحة تحكم المورد."
            : "Welcome to your supplier dashboard."}
        </p>

        <div className="supplier-stats">
  <div className="stat-card">
    <h3>{isAr ? "إجمالي المنتجات" : "Total Products"}</h3>
    <p>{supplierProducts.length}</p>
  </div>

  <div className="stat-card">
    <h3>{isAr ? "المنتجات الغذائية" : "Food Products"}</h3>
    <p>
      {supplierProducts.filter(
        (product) => product.category === "Food"
      ).length}
    </p>
  </div>

  <div className="stat-card">
    <h3>{isAr ? "قيمة المنتجات" : "Products Value"}</h3>
    <p>
      {supplierProducts.reduce(
        (total, product) =>
          total + product.price * product.quantity,
        0
      ).toLocaleString()} EGP
    </p>
  </div>
</div>

        <section className="supplier-card">
          <h2>
            {isAr ? "إدارة منتجاتك" : "Manage Your Products"}
          </h2>

          <p>
            {isAr
              ? "من هنا ستتمكن من إضافة منتجاتك وإدارة العروض."
              : "Add your products and manage your offers here."}
          </p>
 
<button onClick={() => navigate("/add-product")}>
  {isAr ? "إضافة منتج جديد" : "Add New Product"}
</button>

        </section>
<section className="supplier-card">
  <h2>{isAr ? "منتجاتي" : "My Products"}</h2>

  {supplierProducts.length === 0 ? (
    <p>{isAr ? "لم تضف أي منتجات حتى الآن" : "No products added yet"}</p>
  ) : (
    <div className="my-products-list">
    {supplierProducts.map((product) => (
  <div key={product.id} className="my-product-item">
    <img
      src={product.image}
      alt={product.name}
      width="80"
    />

    <div>
      <h3>{isAr ? product.ar : product.name}</h3>

      <p>{product.price} EGP</p>

      <p>
        {isAr ? "الكمية:" : "Quantity:"} {product.quantity}
      </p>

      <button
        type="button"
        onClick={() => navigate("/add-product", { state: { product } })}
      >
        {isAr ? "تعديل المنتج" : "Edit Product"}
      </button>

      <button
        type="button"
        onClick={() => handleDelete(product.id)}
      >
        {isAr ? "حذف المنتج" : "Delete Product"}
      </button>
    </div>
  </div>
))}
    </div>
  )}
</section>

      </main>
    </div>
  );
}

export default SupplierDashboard;