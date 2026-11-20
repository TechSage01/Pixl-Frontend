import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { consumeIntent } from "../utils/PostLogin";

export default function AuthCallback() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return; // wait until /api/auth/me has answered
    if (user) {
      navigate(consumeIntent(), { replace: true });
    } else {
      navigate("/login?error=auth_failed", { replace: true });
    }
  }, [user, loading, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50 text-sm text-stone-500">
      Signing you in...
    </div>
  );
}