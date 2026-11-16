
import { useState } from "react";
import { Link } from "react-router-dom";
import "./Signup.css";

function Signup({ isAr = true }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="signup-page" dir={isAr ? "rtl" : "ltr"}>
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

        <form onSubmit={(e) => e.preventDefault()}>

          <label>{isAr ? "الاسم الكامل" : "Full Name"}</label>
          <input
            type="text"
            placeholder={isAr ? "أدخل اسمك بالكامل" : "Enter your full name"}
            required
          />

          <label>{isAr ? "البريد الإلكتروني" : "Email Address"}</label>
          <input
            type="email"
            placeholder={isAr ? "أدخل بريدك الإلكتروني" : "Enter your email"}
            required
          />

          <label>{isAr ? "كلمة المرور" : "Password"}</label>
          <div className="signup-password">
            <input
              type={showPassword ? "text" : "password"}
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
            placeholder={isAr ? "أعد إدخال كلمة المرور" : "Confirm your password"}
            minLength={8}
            required
          />

          <button type="submit" className="signup-submit">
            {isAr ? "إنشاء حساب" : "Create Account"}
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
