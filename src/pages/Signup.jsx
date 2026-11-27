


import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import "./Signup.css";

function Signup({ isAr = true }) {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError(
        isAr
          ? "كلمتا المرور غير متطابقتين"
          : "Passwords do not match"
      );
      return;
    }

    if (password.length < 8) {
      setError(
        isAr
          ? "كلمة المرور يجب أن تكون 8 أحرف على الأقل"
          : "Password must be at least 8 characters"
      );
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            name: name.trim(),
            role: role,
          },
          emailRedirectTo: `${window.location.origin}${import.meta.env.BASE_URL}login`,
        },
      });

      if (error) throw error;

      if (data.session) {
        navigate("/login");
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError(
        err.message ||
          (isAr
            ? "حدث خطأ أثناء إنشاء الحساب"
            : "Something went wrong")
      );
    } finally {
      setLoading(false);
    }
  };

  // Email confirmation screen
  if (success) {
    return (
      <div
        className={`signup-page ${isAr ? "arabic" : "english"}`}
        dir={isAr ? "rtl" : "ltr"}
      >
        <div className="signup-card confirmation-card">

          <Link to="/" className="login-brand">
            <span className="brand-icon">♻</span>
            <span>
              <strong>صرفها</strong>
              <small>Sarrafha</small>
            </span>
          </Link>

          <div className="confirmation-icon">
            <span>✉</span>
          </div>

          <h1>
            {isAr
              ? "تم إنشاء حسابك بنجاح!"
              : "Account Created Successfully!"}
          </h1>

          <p className="signup-subtitle">
            {isAr
              ? "خطوة واحدة تفصلك عن الانضمام إلى صرفها"
              : "One more step to join Sarrafha"}
          </p>

          <div className="confirmation-message">
            <p>
              {isAr
                ? "أرسلنا رسالة تأكيد إلى بريدك الإلكتروني:"
                : "We've sent a confirmation email to:"}
            </p>

            <strong className="confirmation-email">
              {email.trim().toLowerCase()}
            </strong>

            <p>
              {isAr
                ? "افتح الرسالة واضغط على رابط التأكيد لتفعيل حسابك."
                : "Open the email and click the confirmation link to activate your account."}
            </p>
          </div>

          <div className="confirmation-note">
            <span>ℹ</span>
            <p>
              {isAr
                ? "إذا لم تجد الرسالة، تحقق من مجلد البريد غير الهام (Spam)."
                : "If you can't find the email, check your Spam folder."}
            </p>
          </div>

          <button
            type="button"
            className="signup-submit"
            onClick={() => navigate("/login")}
          >
            {isAr ? "العودة لتسجيل الدخول" : "Back to Login"}
          </button>

          <Link to="/" className="back-home">
            {isAr ? "العودة للرئيسية" : "Back to Home"}
          </Link>

        </div>
      </div>
    );
  }

  return (
    <div
      className={`signup-page ${isAr ? "arabic" : "english"}`}
      dir={isAr ? "rtl" : "ltr"}
    >
      <div className="signup-card">

        <Link to="/" className="login-brand">
          <span className="brand-icon">♻</span>
          <span>
            <strong>صرفها</strong>
            <small>Sarrafha</small>
          </span>
        </Link>

        <h1>{isAr ? "أنشئ حسابك!" : "Create Your Account!"}</h1>

        <p className="signup-subtitle">
          {isAr
            ? "انضم إلى صرفها وابدأ التسوق بذكاء"
            : "Join Sarrafha and start shopping smart"}
        </p>

        <form onSubmit={handleSignup}>

          <label>{isAr ? "نوع الحساب" : "Account Type"}</label>

          <div className="account-type-options">
            <label>
              <input
                type="radio"
                name="role"
                value="customer"
                checked={role === "customer"}
                onChange={(e) => setRole(e.target.value)}
              />
              {isAr ? "عميل" : "Customer"}
            </label>

            <label>
              <input
                type="radio"
                name="role"
                value="supplier"
                checked={role === "supplier"}
                onChange={(e) => setRole(e.target.value)}
              />
              {isAr ? "مورد" : "Supplier"}
            </label>
          </div>

          <label>{isAr ? "الاسم الكامل" : "Full Name"}</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={isAr ? "أدخل اسمك بالكامل" : "Enter your full name"}
            required
          />

          <label>{isAr ? "البريد الإلكتروني" : "Email Address"}</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={isAr ? "أدخل بريدك الإلكتروني" : "Enter your email"}
            required
          />

          <label>{isAr ? "كلمة المرور" : "Password"}</label>

          <div className="signup-password">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isAr ? "أنشئ كلمة مرور" : "Create a password"}
              minLength={8}
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword
                ? (isAr ? "إخفاء" : "Hide")
                : (isAr ? "إظهار" : "Show")}
            </button>
          </div>

          <label>{isAr ? "تأكيد كلمة المرور" : "Confirm Password"}</label>

          <input
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder={isAr ? "أعد إدخال كلمة المرور" : "Confirm your password"}
            minLength={8}
            required
          />

          {error && (
            <p style={{ color: "#c0392b", marginTop: "12px" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            className="signup-submit"
            disabled={loading}
          >
            {loading
              ? (isAr ? "جاري إنشاء الحساب..." : "Creating account...")
              : (isAr ? "إنشاء حساب" : "Create Account")}
          </button>

        </form>

        <p className="signup-login">
          {isAr ? "لديك حساب بالفعل؟ " : "Already have an account? "}
          <Link to="/login">
            {isAr ? "تسجيل الدخول" : "Login"}
          </Link>
        </p>

        <Link to="/" className="back-home">
          {isAr ? "العودة للرئيسية" : "Back to Home"}
        </Link>

      </div>
    </div>
  );
}

export default Signup;
