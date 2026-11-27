


import { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { supabase } from "../supabase";
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
    ar: editingProduct?.ar || editingProduct?.name_ar || "",
    category: editingProduct?.category || "Food",
    oldPrice: editingProduct?.oldPrice || editingProduct?.old_price || "",
    price: editingProduct?.price || "",
    quantity: editingProduct?.quantity || "",
    expiry: editingProduct?.expiry || "",
  });

  const [image, setImage] = useState(editingProduct?.image || "");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

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

    setImageFile(file);
    setImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Number(formData.oldPrice) <= 0 || Number(formData.price) <= 0) {
      alert(isAr ? "من فضلك أدخلي أسعار صحيحة" : "Please enter valid prices");
      return;
    }

    if (Number(formData.price) >= Number(formData.oldPrice)) {
      alert(
        isAr
          ? "السعر بعد الخصم لازم يكون أقل من السعر القديم"
          : "Discounted price must be lower than original price"
      );
      return;
    }

    if (Number(formData.quantity) <= 0) {
      alert(isAr ? "أدخلي كمية صحيحة" : "Enter a valid quantity");
      return;
    }

    if (!image && !imageFile) {
      alert(isAr ? "من فضلك اختاري صورة المنتج" : "Please select an image");
      return;
    }

    setLoading(true);

    try {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;

  if (!user) {
    throw new Error("يجب تسجيل الدخول أولاً");
  }

  let imageUrl = editingProduct?.image || "";


      // Upload image to Supabase Storage
      if (imageFile) {
        const safeFileName = imageFile.name.replace(/[^a-zA-Z0-9._-]/g, "_");
       
        const filePath = `${user.id}/${Date.now()}-${safeFileName}`;

        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(filePath, imageFile, {
            cacheControl: "3600",
            upsert: false,
            contentType: imageFile.type,
          });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(filePath);

        imageUrl = publicUrlData.publicUrl;
      }

      const discount = Math.round(
        ((Number(formData.oldPrice) - Number(formData.price)) /
          Number(formData.oldPrice)) * 100
      );

const productData = {
  name: formData.name.trim(),
  name_ar: formData.ar.trim(),
  category: formData.category,
  old_price: Number(formData.oldPrice),
  price: Number(formData.price),
  discount: `${discount}%`,
  quantity: Number(formData.quantity),
  expiry: formData.expiry.trim(),
  image: imageUrl,
};

if (!editingProduct?.id) {
  productData.supplier_id = user.id;
}

      let error;

      if (editingProduct?.id) {
        const result = await supabase
  .from("products")
  .update(productData)
  .eq("id", editingProduct.id)
  .eq("supplier_id", user.id);
        error = result.error;
      } else {
        const result = await supabase
          .from("products")
          .insert([productData]);

        error = result.error;
      }

      if (error) throw error;

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
    } catch (error) {
      console.error("Product save error:", error);

      alert(
        isAr
          ? `حصل خطأ أثناء حفظ المنتج: ${error.message}`
          : `Error saving product: ${error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-page" dir={isAr ? "rtl" : "ltr"}>
      <header className="add-product-header">
        <h2>{isAr ? "صرفها | إضافة منتج" : "Sarrafha | Add Product"}</h2>
        <button
          type="button"
          onClick={() => navigate("/supplier-dashboard")}
        >
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
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label>{isAr ? "اسم المنتج بالعربي" : "Product Name (Arabic)"}</label>
          <input
            name="ar"
            value={formData.ar}
            onChange={handleChange}
            required
          />

          <label>{isAr ? "التصنيف" : "Category"}</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="Food">{isAr ? "أغذية" : "Food"}</option>
            <option value="Electronics">
              {isAr ? "أجهزة كهربائية" : "Electronics"}
            </option>
          </select>

          <label>{isAr ? "السعر القديم" : "Original Price"}</label>
          <input
            type="number"
            min="1"
            name="oldPrice"
            value={formData.oldPrice}
            onChange={handleChange}
            required
          />

          <label>{isAr ? "السعر بعد الخصم" : "Discounted Price"}</label>
          <input
            type="number"
            min="1"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />

          <label>{isAr ? "الكمية المتاحة" : "Available Quantity"}</label>
          <input
            type="number"
            min="1"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
          />

          <label>{isAr ? "تاريخ الصلاحية / حالة المنتج" : "Expiry Date / Condition"}</label>
          <input
            name="expiry"
            value={formData.expiry}
            onChange={handleChange}
            required
          />

          <label>{isAr ? "صورة المنتج" : "Product Image"}</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required={!editingProduct}
          />

          {image && (
            <img
              src={image}
              alt="Product preview"
              className="add-product-preview"
            />
          )}

          <button type="submit" disabled={loading}>
            {loading
              ? isAr ? "جاري الحفظ..." : "Saving..."
              : isAr ? "حفظ المنتج" : "Save Product"}
          </button>
        </form>
      </main>
    </div>
  );
}

export default AddProduct;
