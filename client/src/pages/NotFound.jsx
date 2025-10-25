import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, AlertCircle, Sparkles } from "lucide-react";

function NotFound() {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDark(checkDark);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e) => setIsDark(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const colors = {
    textPrimary: isDark ? "#e5e7eb" : "#111827",
    textSecondary: isDark ? "#9ca3af" : "#6b7280",
    bgBody: isDark
      ? "#0F172A"
      : "linear-gradient(135deg, #e0e7ff 0%, #f3e8ff 50%, #fce7f3 100%)",
    bgCard: isDark ? "#1E293B" : "white",
    border: isDark ? "#374151" : "#e5e7eb",
    accentPrimary: "#7c3aed",
    accentSecondary: "#a855f7",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: colors.bgBody,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          background: colors.bgCard,
          borderRadius: "16px",
          padding: "48px",
          maxWidth: "500px",
          width: "100%",
          textAlign: "center",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          border: `1px solid ${colors.border}`,
        }}
      >
        <div style={{ marginBottom: "24px" }}>
          <div style={{ position: "relative", display: "inline-block" }}>
            <AlertCircle
              size={80}
              color={colors.accentPrimary}
              strokeWidth={1.5}
            />
            <Sparkles
              size={24}
              color={colors.accentSecondary}
              style={{
                position: "absolute",
                top: "-8px",
                right: "-8px",
              }}
            />
          </div>
        </div>

        <h1
          style={{
            fontSize: "48px",
            fontWeight: "900",
            fontFamily: "Georgia, Times New Roman, Times, serif",
            fontStyle: "italic",
            background: "linear-gradient(to right, #7c3aed, #a855f7, #ec4899)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            margin: "0 0 16px 0",
          }}
        >
          404
        </h1>

        <h2
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            color: colors.textPrimary,
            margin: "0 0 16px 0",
          }}
        >
          Page Not Found
        </h2>

        <p
          style={{
            color: colors.textSecondary,
            fontSize: "16px",
            lineHeight: "1.6",
            margin: "0 0 32px 0",
          }}
        >
          Oops! It looks like you've wandered into uncharted territory. The page
          you're looking for doesn't exist or may have been moved.
        </p>

        <button
          onClick={() => navigate("/")}
          style={{
            background: "linear-gradient(to right, #7c3aed, #a855f7)",
            color: "white",
            padding: "14px 28px",
            borderRadius: "8px",
            border: "none",
            fontWeight: "600",
            fontSize: "16px",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            transition: "all 0.2s",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 6px 12px -2px rgba(0, 0, 0, 0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
          }}
        >
          <Home size={20} />
          Go Home
        </button>
      </div>
    </div>
  );
}

export default NotFound;
