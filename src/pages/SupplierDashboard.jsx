

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./SupplierDashboard.css";
import { supabase } from "../supabase";

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
  const location = useLocation();
const activeSection =
  new URLSearchParams(location.search).get("section") || "dashboard";
  const [editingProductId, setEditingProductId] = useState(null);
  const [image, setImage] = useState("");
const [supplierProducts, setSupplierProducts] = useState([]);
const [loadingProducts, setLoadingProducts] = useState(true);
const [supplierOrders, setSupplierOrders] = useState([]);
const [loadingOrders, setLoadingOrders] = useState(true);
const [orderStatuses, setOrderStatuses] = useState({});
const [updatingOrder, setUpdatingOrder] = useState(null);
const [openStatusOrder, setOpenStatusOrder] = useState(null);

useEffect(() => {
  const fetchSupplierProducts = async () => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;

      if (!user) {
        setSupplierProducts([]);
        return;
      }

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("supplier_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setSupplierProducts(
        data.map((product) => ({
          ...product,
          ar: product.name_ar,
          oldPrice: product.old_price,
        }))
      );
    } catch (error) {
      console.error("Error loading supplier products:", error);
    } finally {
      setLoadingProducts(false);
    }
  };

  fetchSupplierProducts();
}, []);

useEffect(() => {
  const fetchSupplierOrders = async () => {
    try {
      const { data, error } = await supabase.rpc(
        "get_supplier_orders"
      );

      if (error) throw error;

      setSupplierOrders(data || []);
      const { data: statuses, error: statusesError } = await supabase
  .from("supplier_order_status")
  .select("order_id, status");

if (statusesError) throw statusesError;

const statusesMap = {};
(statuses || []).forEach((item) => {
  statusesMap[item.order_id] = item.status;
});

setOrderStatuses(statusesMap);
    } catch (error) {
      console.error("Error loading supplier orders:", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  fetchSupplierOrders();
}, []);

  const [formData, setFormData] = useState({
    name: "",
    ar: "",
    category: "Food",
    oldPrice: "",
    price: "",
    quantity: "",
    expiry: "",
  });





const handleDelete = async (productId) => {



  const confirmed = window.confirm(
    isAr
      ? "هل أنتِ متأكدة من حذف المنتج؟"
      : "Are you sure you want to delete this product?"

  );


  
  if (!confirmed) return;

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) throw userError;
    if (!user) throw new Error("يجب تسجيل الدخول أولاً");

    const { data, error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId)
      .eq("supplier_id", user.id)
      .select()
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      alert(isAr ? "لم يتم حذف المنتج" : "Product was not deleted");
      return;
    }

    setSupplierProducts((prev) =>
      prev.filter((product) => product.id !== productId)
    );

    alert(isAr ? "تم حذف المنتج بنجاح" : "Product deleted successfully");
  } catch (error) {
    console.error("Delete error:", error);
    alert(isAr ? "حدث خطأ أثناء حذف المنتج" : "Error deleting product");
  }
};


const handleLogout = async () => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    localStorage.removeItem("sarfhaCurrentUser");
    onLogout?.();

 navigate("/login", { replace: true });    
  } catch (error) {
    console.error("Logout error:", error);
    alert(isAr ? "حدث خطأ أثناء تسجيل الخروج" : "Logout failed");
  }
};



const handleUpdateOrderStatus = async (orderId, newStatus) => {
  setUpdatingOrder(orderId);

  try {
    const { error } = await supabase.rpc(
      "update_supplier_order_status",
      {
        p_order_id: orderId,
        p_status: newStatus,
      }
    );

    if (error) throw error;

    setOrderStatuses((prev) => ({
      ...prev,
      [orderId]: newStatus,
    }));
  } catch (error) {
    console.error("Error updating order status:", error);
    alert(isAr ? "حدث خطأ أثناء تحديث الحالة" : "Error updating order status");
  } finally {
    setUpdatingOrder(null);
  }
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

const handleSubmit = async (e) => {
  e.preventDefault();

  if (
    !formData.name.trim() ||
    !formData.ar.trim() ||
    !formData.oldPrice ||
    !formData.price ||
    !formData.quantity
  ) {
    alert(isAr ? "من فضلك اكملي البيانات المطلوبة" : "Please complete the required fields");
    return;
  }

  const oldPrice = Number(formData.oldPrice);
  const price = Number(formData.price);
  const quantity = Number(formData.quantity);

  if (oldPrice <= 0 || price <= 0 || quantity <= 0 || price >= oldPrice) {
    alert(
      isAr
        ? "تأكدي من الأسعار والكمية. السعر بعد الخصم لازم يكون أقل من السعر القديم"
        : "Check the prices and quantity. Discounted price must be lower than old price"
    );
    return;
  }

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) throw userError;
    if (!user) throw new Error("User not logged in");

    const discount = Math.round(
      ((oldPrice - price) / oldPrice) * 100
    );

    // الاحتفاظ بصورة المنتج القديمة عند التعديل
    const existingProduct = supplierProducts.find(
      (product) => String(product.id) === String(editingProductId)
    );

    let imageUrl = image || existingProduct?.image || "";

    // رفع الصورة إلى Supabase Storage لو كانت صورة جديدة
    if (image && image.startsWith("data:")) {
      const imageBlob = await (await fetch(image)).blob();
      const extension = imageBlob.type.split("/")[1] || "jpg";
      const imagePath = `${user.id}/${Date.now()}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(imagePath, imageBlob, {
          contentType: imageBlob.type,
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(imagePath);

      imageUrl = publicUrlData.publicUrl;
    }

    const productData = {
      name: formData.name.trim(),
      name_ar: formData.ar.trim(),
      category: formData.category,
      old_price: oldPrice,
      price: price,
      discount: `${discount}%`,
      quantity: quantity,
      expiry: formData.expiry,
      image: imageUrl,
      supplier_id: user.id,
    };

    let savedProduct;
    
    if (editingProductId) {
      const { data, error } = await supabase
        .from("products")
        .update(productData)
        .eq("id", editingProductId)
        .eq("supplier_id", user.id)
        .select()
        .single();

      if (error) throw error;
      savedProduct = data;
    } else {
      const { data, error } = await supabase
        .from("products")
        .insert(productData)
        .select()
        .single();

      if (error) throw error;
      savedProduct = data;
    }

    const formattedProduct = {
      ...savedProduct,
      ar: savedProduct.name_ar,
      oldPrice: savedProduct.old_price,
    };

    setSupplierProducts((prev) => {
      if (editingProductId) {
        return prev.map((product) =>
          String(product.id) === String(editingProductId)
            ? formattedProduct
            : product
        );
      }

      return [formattedProduct, ...prev];
    });

    alert(
      isAr
        ? editingProductId
          ? "تم تعديل المنتج بنجاح"
          : "تمت إضافة المنتج بنجاح"
        : editingProductId
          ? "Product updated successfully"
          : "Product added successfully"
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

  } catch (error) {
    console.error("Product save error:", error);
    alert(
      isAr
        ? "حدث خطأ أثناء حفظ المنتج: " + error.message
        : "Error saving product: " + error.message
    );
  }
};

  
return (
  <>
 
<main className="supplier-content">

  {activeSection === "dashboard" && (
    <>
      <h1>
        {isAr

          ? `أهلاً ${currentUser.name}`
          : `Welcome ${currentUser.name}`}
      </h1>

    
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
        <h2>{isAr ? "إدارة منتجاتك" : "Manage Your Products"}</h2>

        <p>
          {isAr
            ? "من هنا ستتمكن من إضافة منتجاتك وإدارة العروض."
            : "Add your products and manage your offers here."}
        </p>

        <button onClick={() => navigate("/add-product")}>
          {isAr ? "إضافة منتج جديد" : "Add New Product"}
        </button>
      </section>
    </>
  )}

  {activeSection === "products" && (
    <section className="supplier-card">
      <h2>{isAr ? "منتجاتي" : "My Products"}</h2>

      {loadingProducts ? (
        <p>{isAr ? "جاري تحميل المنتجات..." : "Loading products..."}</p>
      ) : supplierProducts.length === 0 ? (
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
                  onClick={() =>
                    navigate("/add-product", { state: { product } })
                  }
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
  )}

  {activeSection === "orders" && (
    <section className="supplier-card">
      <h2>{isAr ? "طلبات العملاء" : "Customer Orders"}</h2>

      {loadingOrders ? (
        <p>{isAr ? "جاري تحميل الطلبات..." : "Loading orders..."}</p>
      ) : supplierOrders.length === 0 ? (
        <p>
          {isAr
            ? "لا توجد طلبات لمنتجاتك حتى الآن"
            : "No orders for your products yet"}
        </p>
      ) : (
        Object.values(
          supplierOrders.reduce((groups, item) => {
            if (!groups[item.order_id]) {
              groups[item.order_id] = {
                ...item,
                items: [],
              };
            }

            groups[item.order_id].items.push(item);
            return groups;
          }, {})
        ).map((order) => {
          const currentStatus =
            orderStatuses[order.order_id] || "Pending";

          return (
            <div key={order.order_id} className="my-product-item">
              <div>
                <h3>
                  {isAr ? "طلب رقم: " : "Order #"}
                  {order.order_id}
                </h3>

                <p>
                  {isAr ? "العميل: " : "Customer: "}
                  {order.customer_name}
                </p>

                <p>
                  {isAr ? "رقم الهاتف: " : "Phone: "}
                  {order.phone}
                </p>

                <p>
                  {isAr ? "العنوان: " : "Address: "}
                  {order.address}
                </p>

<div className="order-status-row">
  <strong>
    {isAr ? "حالة الطلب:" : "Order Status:"}
  </strong>

  <span
    className={`order-status-badge ${
      currentStatus === "Pending"
        ? "status-pending"
        : currentStatus === "Processing"
        ? "status-processing"
        : "status-delivered"
    }`}
  >
    {currentStatus === "Pending"
      ? isAr ? "قيد الانتظار" : "Pending"
      : currentStatus === "Processing"
      ? isAr ? "جاري التجهيز" : "Processing"
      : isAr ? "تم التسليم" : "Delivered"}
  </span>
</div>
                <h4>{isAr ? "المنتجات:" : "Products:"}</h4>

                {order.items.map((item, index) => (
                  <div key={`${item.item_id}-${index}`}>
                    <p>
                      {isAr ? item.item_name_ar : item.item_name}
                    </p>

                    <p>
                      {isAr ? "الكمية: " : "Quantity: "}
                      {item.item_quantity}
                    </p>

                    <p>
                      {isAr ? "الإجمالي: " : "Subtotal: "}
                      {Number(item.item_subtotal).toFixed(2)} EGP
                    </p>
                  </div>
                ))}

                <strong>
                  {isAr
                    ? "إجمالي منتجاتك في الطلب: "
                    : "Your order subtotal: "}
                  {order.items
                    .reduce(
                      (total, item) =>
                        total + Number(item.item_subtotal),
                      0
                    )
                    .toFixed(2)} EGP
                </strong>

                <div style={{ marginTop: "15px" }}>
                  <label>
                    {isAr ? "تغيير حالة الطلب: " : "Update Order Status: "}
                  </label>
              <div className="custom-status-dropdown">
  <button
    type="button"
    className={`custom-status-trigger ${
      currentStatus.toLowerCase()
    }`}
    disabled={updatingOrder === order.order_id}
    onClick={() =>
      setOpenStatusOrder(
        openStatusOrder === order.order_id
          ? null
          : order.order_id
      )
    }
  >
    <span>
      {currentStatus === "Pending"
        ? isAr ? "قيد الانتظار" : "Pending"
        : currentStatus === "Processing"
        ? isAr ? "جاري التجهيز" : "Processing"
        : isAr ? "تم التسليم" : "Delivered"}
    </span>

    <span className="dropdown-arrow">⌄</span>
  </button>

  {openStatusOrder === order.order_id && (
    <div className="custom-status-options">
      {[
        { value: "Pending", ar: "قيد الانتظار", en: "Pending" },
        { value: "Processing", ar: "جاري التجهيز", en: "Processing" },
        { value: "Delivered", ar: "تم التسليم", en: "Delivered" },
      ].map((status) => (
        <button
          type="button"
          key={status.value}
          className={`custom-status-option ${
            currentStatus === status.value ? "selected" : ""
          }`}
          disabled={updatingOrder === order.order_id}
          onClick={() => {
            setOpenStatusOrder(null);
            handleUpdateOrderStatus(
              order.order_id,
              status.value
            );
          }}
        >
          <span>{isAr ? status.ar : status.en}</span>

          {currentStatus === status.value && (
            <span>✓</span>
          )}
        </button>
      ))}
    </div>
  )}
</div>

                  {updatingOrder === order.order_id && (
                    <p>
                      {isAr ? "جاري التحديث..." : "Updating..."}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}
    </section>
  )}

</main>
  </>
  );
}

export default SupplierDashboard;