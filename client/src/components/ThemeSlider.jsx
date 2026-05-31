import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Loader2, Palette, Sparkles, Zap } from "lucide-react";

const THEME_SUGGESTIONS = [
  { label: "Clean Starter", theme: "base", tone: "#8b5cf6" },
  { label: "Minimal Pro", theme: "minimal", tone: "#64748b" },
  { label: "Classic GitHub", theme: "classic", tone: "#111827" },
  { label: "Dark Mode", theme: "darkmode", tone: "#0f172a" },
  { label: "Neon Glow", theme: "neon", tone: "#22d3ee" },
  { label: "Ocean Calm", theme: "ocean", tone: "#0284c7" },
  { label: "Galaxy", theme: "eternity", tone: "#7c3aed" },
  { label: "Starry Night", theme: "starry", tone: "#ef4444" },
  { label: "Gravity Space", theme: "gravityspace", tone: "#6366f1" },
  { label: "Hot Fire", theme: "hotfire", tone: "#f97316" },
  { label: "Flamingo", theme: "flamingo", tone: "#ec4899" },
  { label: "Git Blaze", theme: "gitblaze", tone: "#f59e0b" },
  { label: "Macro Purple", theme: "macros", tone: "#a855f7" },
  { label: "Portfolio", theme: "minimal", tone: "#14b8a6" },
  { label: "Open Source", theme: "classic", tone: "#22c55e" },
  { label: "Cyberpunk", theme: "neon", tone: "#d946ef" },
  { label: "Deep Sea", theme: "ocean", tone: "#0ea5e9" },
  { label: "Cosmic Dev", theme: "gravityspace", tone: "#8b5cf6" },
  { label: "Warm Energy", theme: "hotfire", tone: "#fb7185" },
  { label: "Soft Pop", theme: "flamingo", tone: "#f472b6" },
];

const getThemeLabel = (theme) => theme?.name || theme?.theme || "Theme";

const ThemeSlider = ({
  themes = [],
  themesLoading = false,
  selectedTheme,
  handleThemeSelect,
  colors,
  isDark,
}) => {
  const scrollRef = useRef(null);
  const [scrollState, setScrollState] = useState({ canLeft: false, canRight: false });

  const themeMap = useMemo(
    () => new Map(themes.map((theme) => [theme.theme, theme])),
    [themes]
  );

  const suggestions = useMemo(
    () => THEME_SUGGESTIONS.filter((suggestion) => themeMap.has(suggestion.theme)).slice(0, 20),
    [themeMap]
  );

  const selectedThemeName = getThemeLabel(themeMap.get(selectedTheme)) || selectedTheme;

  const updateScrollState = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;

    setScrollState({
      canLeft: container.scrollLeft > 4,
      canRight: container.scrollLeft + container.clientWidth < container.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(updateScrollState);
    const container = scrollRef.current;
    if (!container) return undefined;

    container.addEventListener("scroll", updateScrollState, { passive: true });
    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(frame);
      container.removeEventListener("scroll", updateScrollState);
      resizeObserver.disconnect();
    };
  }, [themes, updateScrollState]);

  useEffect(() => {
    const container = scrollRef.current;
    const activeButton = container?.querySelector(`[data-theme-id="${selectedTheme}"]`);
    activeButton?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [selectedTheme, themesLoading]);

  const scrollThemes = (direction) => {
    const container = scrollRef.current;
    if (!container) return;

    container.scrollBy({
      left: direction * Math.max(220, container.clientWidth * 0.75),
      behavior: "smooth",
    });
  };

  const selectTheme = (theme) => {
    handleThemeSelect(theme);
  };

  return (
    <div className="theme-picker" style={{ marginBottom: "24px" }}>
      <div className="theme-slider-heading">
        <label
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "14px",
            fontWeight: "700",
            color: colors.textPrimary,
          }}
        >
          <span className="theme-slider-heading__icon">
            <Palette size={16} color="white" aria-hidden="true" />
          </span>
          Frame Theme
        </label>
        <div className="theme-picker__heading-actions">
          <span
            className="theme-slider-active-pill"
            style={{
              color: isDark ? "#cffafe" : "#6d28d9",
              background: isDark ? "rgba(6, 182, 212, 0.14)" : "rgba(139, 92, 246, 0.1)",
              borderColor: isDark ? "rgba(34, 211, 238, 0.22)" : "rgba(139, 92, 246, 0.18)",
            }}
          >
            Saved: {selectedThemeName}
          </span>
          <div className="theme-picker__controls" aria-label="Theme rail controls">
            <button
              type="button"
              className="theme-picker__arrow theme-picker__arrow--left"
              onClick={() => scrollThemes(-1)}
              disabled={!scrollState.canLeft}
              aria-label="Scroll themes left"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              className="theme-picker__arrow theme-picker__arrow--right"
              onClick={() => scrollThemes(1)}
              disabled={!scrollState.canRight}
              aria-label="Scroll themes right"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {themesLoading ? (
        <div className="theme-picker__loading">
          <Loader2 size={32} color={colors.accentPrimary} className="spinner" />
        </div>
      ) : (
        <>
          <div className="theme-picker__rail-shell">
            <div className="theme-picker__fade theme-picker__fade--left" aria-hidden="true" />
            <div
              ref={scrollRef}
              className="themes-scroll-container theme-picker__rail"
              aria-label="Available frame themes"
            >
              {themes.map((theme) => {
                const isSelected = selectedTheme === theme.theme;
                return (
                  <button
                    key={theme.theme}
                    data-theme-id={theme.theme}
                    type="button"
                    onClick={() => selectTheme(theme.theme)}
                    className={`theme-picker__card${isSelected ? " theme-picker__card--active" : ""}`}
                    aria-pressed={isSelected}
                  >
                    <span className="theme-picker__card-glow" aria-hidden="true" />
                    <span className="theme-picker__card-icon" aria-hidden="true">
                      {isSelected ? <Check size={14} /> : <Sparkles size={14} />}
                    </span>
                    <span className="theme-picker__card-copy">
                      <strong>{getThemeLabel(theme)}</strong>
                      <small>{theme.theme}</small>
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="theme-picker__fade theme-picker__fade--right" aria-hidden="true" />
          </div>

          {suggestions.length > 0 && (
            <div className="theme-suggestions" aria-label="Theme suggestions">
              <div className="theme-suggestions__title">
                <Zap size={14} fill="currentColor" />
                <span>20 quick theme suggestions</span>
              </div>
              <div className="theme-suggestions__grid">
                {suggestions.map((suggestion) => {
                  const isSelected = selectedTheme === suggestion.theme;
                  return (
                    <button
                      key={`${suggestion.label}-${suggestion.theme}`}
                      type="button"
                      className={`theme-suggestion-chip${isSelected ? " theme-suggestion-chip--active" : ""}`}
                      onClick={() => selectTheme(suggestion.theme)}
                      style={{ "--theme-tone": suggestion.tone }}
                    >
                      <span className="theme-suggestion-chip__dot" aria-hidden="true" />
                      <span>{suggestion.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ThemeSlider;
