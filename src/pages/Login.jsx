


import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import "./Login.css";

function Login({ isAr = true, onLogin }) {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        if (error.message.toLowerCase().includes("email not confirmed")) {
          throw new Error(
            isAr
              ? "يجب تأكيد البريد الإلكتروني أولاً"
              : "Please confirm your email first"
          );
        }

        throw error;
      }

      const user = data.user;

      const { data: roleData, error: roleError } = await supabase
  .from("user_roles")
  .select("role")
  .eq("user_id", user.id)
  .single();

  if (
  roleError ||
  !roleData ||
  !["customer", "supplier"].includes(roleData.role)
) {
  await supabase.auth.signOut();

  throw new Error(
    isAr
      ? "لم نتمكن من تحديد نوع الحساب. تواصلي مع الدعم."
      : "Could not determine account type. Please contact support."
  );
}

const loggedInUser = {
  id: user.id,
  name: user.user_metadata?.name || user.email,
  email: user.email,
  role: roleData.role,
};

      localStorage.setItem(
        "sarfhaCurrentUser",
        JSON.stringify(loggedInUser)
      );

      onLogin?.(loggedInUser);

      alert(
        isAr
          ? "تم تسجيل الدخول بنجاح!"
          : "Login successful!"
      );

      if (loggedInUser.role === "supplier") {
        navigate("/supplier-dashboard");
      } else {
        navigate("/customer-dashboard");
      }

    } catch (err) {
      setError(
        err.message ||
          (isAr
            ? "حدث خطأ أثناء تسجيل الدخول"
            : "Login error occurred")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanEmail) {
    setError(
      isAr
        ? "اكتبي البريد الإلكتروني الأول"
        : "Please enter your email first"
    );
    return;
  }

  setError("");
  setLoading(true);

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(
      cleanEmail,
      {
      redirectTo: `${window.location.origin}/sarfha/reset-password`,
      }
    );

    if (error) throw error;

    alert(
      isAr
        ? "تم إرسال رابط تغيير كلمة المرور إلى بريدك الإلكتروني"
        : "Password reset link sent to your email"
    );
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div
      className={`login-page ${isAr ? "arabic" : "english"}`}
      dir={isAr ? "rtl" : "ltr"}
    >
      <div className="login-card">

        <Link to="/" className="login-brand">
          <span className="brand-icon">♻</span>
          <span>
            <strong>صرفها</strong>
            <small>Sarrafha</small>
          </span>
        </Link>

        <h1>{isAr ? "أهلاً بعودتك!" : "Welcome Back!"}</h1>

        <p className="login-subtitle">
          {isAr
            ? "سجّل دخولك واستمتع بالتسوق بأسعار مميزة"
            : "Sign in and enjoy shopping at special prices"}
        </p>

        <form onSubmit={handleLogin}>
          <label>
            {isAr ? "البريد الإلكتروني" : "Email Address"}
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={isAr ? "أدخل بريدك الإلكتروني" : "Enter your email"}
            required
          />

          <label>
            {isAr ? "كلمة المرور" : "Password"}
          </label>

          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isAr ? "أدخل كلمة المرور" : "Enter your password"}
              required
            />

            <button
              type="button"
              className="show-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword
                ? (isAr ? "إخفاء" : "Hide")
                : (isAr ? "إظهار" : "Show")}
            </button>
          </div>

          {error && (
            <p style={{ color: "#c0392b", marginTop: "12px" }}>
              {error}
            </p>
          )}
<div className="forgot-password">
  <button
    type="button"
    onClick={handleForgotPassword}
    disabled={loading}
  >
    {isAr ? "نسيت كلمة المرور؟" : "Forgot Password?"}
  </button>
</div>

          <button
            type="submit"
            className="login-submit"
            disabled={loading}
          >
            {loading
              ? (isAr ? "جاري تسجيل الدخول..." : "Signing in...")
              : (isAr ? "تسجيل الدخول" : "Login")}
          </button>
        </form>

        <p className="signup-text">
          {isAr ? "ليس لديك حساب؟ " : "Don't have an account? "}
          <Link to="/signup">
            {isAr ? "إنشاء حساب" : "Sign Up"}
          </Link>
        </p>

        <Link to="/" className="back-home">
          {isAr ? "العودة للرئيسية" : "Back to Home"}
        </Link>

      </div>
    </div>
  );
}

export default Login;
