import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function GoogleLoginButton() {
  const buttonRef = useRef(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleGoogleResponse = async (response) => {
    try {
      const res = await api.post("/auth/google", {
        credential: response.credential
      });

      login(res.data.token, res.data.user);
      toast.success("Logged in with Google");

      if (res.data.user.role === "admin") {
        navigate("/admin/slots");
      } else {
        navigate("/slots");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Google login failed");
    }
  };

  useEffect(() => {
    if (!window.google || !buttonRef.current) return;

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleGoogleResponse
    });

    window.google.accounts.id.renderButton(buttonRef.current, {
      theme: "outline",
      size: "large",
      width: 350,
      text: "continue_with",
      shape: "pill"
    });
  }, []);

  return <div ref={buttonRef} className="flex justify-center" />;
}