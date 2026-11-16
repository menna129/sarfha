
import { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";

function Login({ isAr = true }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`login-page ${isAr ? "arabic" : "english"}`} dir={isAr ? "rtl" : "ltr"}>
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

        <form onSubmit={(e) => e.preventDefault()}>
          <label>
            {isAr ? "البريد الإلكتروني" : "Email Address"}
          </label>
          <input
            type="email"
            placeholder={isAr ? "أدخل بريدك الإلكتروني" : "Enter your email"}
            required
          />

          <label>
            {isAr ? "كلمة المرور" : "Password"}
          </label>

          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
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
<div className="forgot-password">
  <a href="#forgot-password">
    {isAr ? "نسيت كلمة المرور؟" : "Forgot Password?"}
  </a>
</div>
          <button type="submit" className="login-submit">
            {isAr ? "تسجيل الدخول" : "Login"}
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

