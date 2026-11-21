


import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

async function hashPassword(password, salt) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const hash = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: new Uint8Array(salt),
      iterations: 150000,
      hash: "SHA-256",
    },
    key,
    256
  );

  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function Login({ isAr = true, onLogin }) {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const users = JSON.parse(
        localStorage.getItem("sarfhaUsers") || "[]"
      );

      const normalizedEmail = email.trim().toLowerCase();

      const user = users.find(
        (item) => item.email === normalizedEmail
      );

      if (!user) {
        setError(
          isAr
            ? "البريد الإلكتروني غير مسجل"
            : "Email is not registered"
        );
        return;
      }

      const enteredHash = await hashPassword(password, user.salt);

      if (enteredHash !== user.passwordHash) {
        setError(
          isAr
            ? "كلمة المرور غير صحيحة"
            : "Incorrect password"
        );
        return;
      }

      const loggedInUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || "customer",
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
        isAr
          ? "حدث خطأ أثناء تسجيل الدخول"
          : "Login error occurred"
      );
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
