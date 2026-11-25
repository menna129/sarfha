import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

function ResetPassword({ isAr = true }) {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError(
        isAr
          ? "كلمة المرور لازم تكون 6 أحرف على الأقل"
          : "Password must be at least 6 characters"
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        isAr
          ? "كلمتا المرور غير متطابقتين"
          : "Passwords do not match"
      );
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) throw error;

      alert(
        isAr
          ? "تم تغيير كلمة المرور بنجاح"
          : "Password changed successfully"
      );

      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-page">
      <form onSubmit={handleResetPassword}>
        <h2>
          {isAr ? "تغيير كلمة المرور" : "Reset Password"}
        </h2>

        <input
          type="password"
          placeholder={isAr ? "كلمة المرور الجديدة" : "New Password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder={isAr ? "تأكيد كلمة المرور" : "Confirm Password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading
            ? isAr ? "جاري الحفظ..." : "Saving..."
            : isAr ? "حفظ كلمة المرور" : "Save Password"}
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;