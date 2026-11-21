
import { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import "./AddProduct.css";

function AddProduct({ isAr = true }) {
  const navigate = useNavigate();
  const location = useLocation();
  const editingProduct = location.state?.product;

  const currentUser = JSON.parse(
    localStorage.getItem("sarfhaCurrentUser") || "null"
  );

  const [formData, setFormData] = useState({
    name: editingProduct?.name || "",
    ar: editingProduct?.ar || "",
    category: editingProduct?.category || "Food",
    oldPrice: editingProduct?.oldPrice || "",
    price: editingProduct?.price || "",
    quantity: editingProduct?.quantity || "",
    expiry: editingProduct?.expiry || "",
  });

  const [image, setImage] = useState(editingProduct?.image || "");

  if (!currentUser || currentUser.role !== "supplier") {
    return <Navigate to="/login" replace />;
  }

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
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (Number(formData.price) >= Number(formData.oldPrice)) {
      alert(
        isAr
          ? "السعر بعد الخصم لازم يكون أقل من السعر القديم"
          : "Discounted price must be lower than original price"
      );
      return;
    }

    if (!image) {
      alert(isAr ? "من فضلك اختاري صورة المنتج" : "Please select a product image");
      return;
    }

    const discount = Math.round(
      ((Number(formData.oldPrice) - Number(formData.price)) /
        Number(formData.oldPrice)) * 100
    );

    const newProduct = {
      id: editingProduct?.id || Date.now(),
      ...formData,
      oldPrice: Number(formData.oldPrice),
      price: Number(formData.price),
      quantity: Number(formData.quantity),
      discount: `${discount}%`,
      categoryAr:
        formData.category === "Food"
          ? "منتجات غذائية"
          : "أجهزة كهربائية",
      icon: formData.category === "Food" ? "🥐" : "🔌",
      image,
      supplierId: currentUser.id,
    };

    const savedProducts = JSON.parse(
      localStorage.getItem("sarfha_supplier_products") || "[]"
    );

    const updatedProducts = editingProduct
      ? savedProducts.map((product) =>
          product.id === editingProduct.id ? newProduct : product
        )
      : [...savedProducts, newProduct];

    localStorage.setItem(
      "sarfha_supplier_products",
      JSON.stringify(updatedProducts)
    );

    alert(
      isAr
        ? editingProduct
          ? "تم تعديل المنتج بنجاح"
          : "تمت إضافة المنتج بنجاح"
        : editingProduct
          ? "Product updated successfully"
          : "Product added successfully"
    );

    navigate("/supplier-dashboard");
  };

  return (
    <div className="add-product-page" dir={isAr ? "rtl" : "ltr"}>
      <header className="add-product-header">
        <h2>{isAr ? "صرفها | إضافة منتج" : "Sarrafha | Add Product"}</h2>
        <button type="button" onClick={() => navigate("/supplier-dashboard")}>
          {isAr ? "العودة للوحة التحكم" : "Back to Dashboard"}
        </button>
      </header>

      <main className="add-product-content">
        <h1>
          {isAr
            ? editingProduct ? "تعديل المنتج" : "إضافة منتج جديد"
            : editingProduct ? "Edit Product" : "Add New Product"}
        </h1>

        <form onSubmit={handleSubmit}>
          <label>{isAr ? "اسم المنتج بالإنجليزي" : "Product Name (English)"}</label>
          <input name="name" value={formData.name} onChange={handleChange} required />

          <label>{isAr ? "اسم المنتج بالعربي" : "Product Name (Arabic)"}</label>
          <input name="ar" value={formData.ar} onChange={handleChange} required />

          <label>{isAr ? "التصنيف" : "Category"}</label>
          <select name="category" value={formData.category} onChange={handleChange}>
            <option value="Food">{isAr ? "أغذية" : "Food"}</option>
            <option value="Electronics">
              {isAr ? "أجهزة كهربائية" : "Electronics"}
            </option>
          </select>

          <label>{isAr ? "السعر القديم" : "Original Price"}</label>
          <input type="number" min="1" name="oldPrice" value={formData.oldPrice} onChange={handleChange} required />

          <label>{isAr ? "السعر بعد الخصم" : "Discounted Price"}</label>
          <input type="number" min="1" name="price" value={formData.price} onChange={handleChange} required />

          <label>{isAr ? "الكمية المتاحة" : "Available Quantity"}</label>
          <input type="number" min="1" name="quantity" value={formData.quantity} onChange={handleChange} required />

          <label>{isAr ? "تاريخ الصلاحية / حالة المنتج" : "Expiry Date / Condition"}</label>
          <input name="expiry" value={formData.expiry} onChange={handleChange} required />

          <label>{isAr ? "صورة المنتج" : "Product Image"}</label>
          <input type="file" accept="image/*" onChange={handleImageChange} required={!editingProduct} />

          {image && (
            <img src={image} alt="Product preview" className="add-product-preview" />
          )}

          <button type="submit">
            {isAr ? "حفظ المنتج" : "Save Product"}
          </button>
        </form>
      </main>
    </div>
  );
}

export default AddProduct;
