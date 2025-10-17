import React, { useEffect, useRef, useState } from "react";
import { Zap, Loader2 } from "lucide-react";

const ThemeSlider = ({
  themes = [],
  themesLoading = false,
  selectedTheme,
  handleThemeSelect,
  colors,
  isDark,
}) => {
  const scrollRef = useRef(null);
  const intervalRef = useRef(null);
  const [isManuallyStopped, setIsManuallyStopped] = useState(false);

  // Start auto-slide
  useEffect(() => {
    const container = scrollRef.current;
    if (!container || isManuallyStopped) return;

    // Clear existing interval
    if (intervalRef.current) clearInterval(intervalRef.current);

    // Slide function
    const slide = () => {
      if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 5) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ left: 150, behavior: "smooth" });
      }
    };

    // Run immediately once
    slide();

    // Then every 1.5s
    intervalRef.current = setInterval(slide, 1500);

    return () => clearInterval(intervalRef.current);
  }, [isManuallyStopped, themes]);

  // Stop auto-slide (manual)
  const stopAutoSlide = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsManuallyStopped(true);
  };

  return (
    <div style={{ marginBottom: "24px", position: "relative" }}>
      <label
        style={{
          display: "block",
          fontSize: "14px",
          fontWeight: "600",
          color: colors.textPrimary,
          marginBottom: "8px",
        }}
      >
        Frame Theme ({themes.length} available)
      </label>

      {themesLoading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "32px 0" }}>
          <Loader2 size={32} color={colors.accentPrimary} className="spinner" />
        </div>
      ) : (
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            maxWidth: "500px",
            margin: "0 auto",
          }}
        >
          {/* Left Button */}
          <button
            onClick={() => {
              stopAutoSlide();
              scrollRef.current?.scrollBy({ left: -200, behavior: "smooth" });
            }}
            style={{
              position: "absolute",
              left: "-40px",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 2,
              background: colors.bgCard,
              border: `1px solid ${colors.border}`,
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
              opacity: 0.9,
            }}
          >
            ‹
          </button>

          {/* Scroll Container */}
          <div
            ref={scrollRef}
            className="themes-scroll-container"
            style={{
              display: "flex",
              gap: "8px",
              overflowX: "auto",
              scrollBehavior: "smooth",
              whiteSpace: "nowrap",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              padding: "10px",
              width: "100%",
            }}
            onMouseEnter={() => {
              if (intervalRef.current) clearInterval(intervalRef.current);
            }}
            onMouseLeave={() => {
              if (!isManuallyStopped) {
                // resume auto-slide if not manually stopped
                const container = scrollRef.current;
                if (!container) return;

                const slide = () => {
                  if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 5) {
                    container.scrollTo({ left: 0, behavior: "smooth" });
                  } else {
                    container.scrollBy({ left: 150, behavior: "smooth" });
                  }
                };

                slide();
                intervalRef.current = setInterval(slide, 1500);
              }
            }}
          >
            {themes.map((theme) => (
              <button
                key={theme.theme}
                onClick={() => {
                  handleThemeSelect(theme.theme);
                  stopAutoSlide();
                }}
                style={{
                  padding: "8px 12px",
                  minWidth: "100px",
                  flexShrink: 0,
                  borderRadius: "8px",
                  border: "2px solid",
                  borderColor:
                    selectedTheme === theme.theme ? colors.accentPrimary : colors.border,
                  background:
                    selectedTheme === theme.theme
                      ? isDark
                        ? "#4c1d95"
                        : "#f5f3ff"
                      : colors.bgCard,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  textAlign: "center",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                }}
              >
                {selectedTheme === theme.theme && (
                  <Zap size={14} color={colors.accentPrimary} fill={colors.accentPrimary} />
                )}
                <span
                  style={{
                    fontWeight: "600",
                    fontSize: "13px",
                    color: colors.textPrimary,
                    textTransform: "capitalize",
                  }}
                >
                  {theme.name || theme.theme}
                </span>
              </button>
            ))}
          </div>

          {/* Right Button */}
          <button
            onClick={() => {
              stopAutoSlide();
              scrollRef.current?.scrollBy({ left: 200, behavior: "smooth" });
            }}
            style={{
              position: "absolute",
              right: "-40px",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 2,
              background: colors.bgCard,
              border: `1px solid ${colors.border}`,
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
              opacity: 0.9,
            }}
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
};

export default ThemeSlider;


