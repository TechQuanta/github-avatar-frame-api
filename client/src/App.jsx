import React, { useState, useEffect, useRef, useMemo } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AOS from 'aos';
import 'aos/dist/aos.css';
import NotFound from "./pages/NotFound.jsx";
import {
  Frame,
  Download,
  AlertCircle,
  Loader2,
  Github,
  Sparkles,
  Zap,
  Copy,
  Check,
  ChevronRight,
  Circle,
  Square,
  Sun,
  Moon,
  Users,
  X,
  Share2,
  Twitter,
  Linkedin,
  Award,
} from "lucide-react";
import ThemeSlider from "./components/ThemeSlider.jsx";

// NOTE: Replace with your actual API URL or environment variable
const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://github-avatar-frame-api.onrender.com"
    : "http://localhost:3001";

// Utility component for consistent button styling (Canvas and Shape)
const ControlButton = ({ onClick, isSelected, children, isDark }) => (
  <button
    onClick={onClick}
    //isSelected={isSelected} // Pass isSelected as prop for internal styling
    style={{
      padding: "10px 16px",
      borderRadius: "8px",
      border: "2px solid",
      borderColor: isSelected
        ? isDark
          ? "#a78bfa"
          : "#7c3aed"
        : isDark
        ? "#374151"
        : "#e5e7eb",
      background: isSelected
        ? isDark
          ? "#4c1d95"
          : "#f5f3ff"
        : isDark
        ? "#1f2937"
        : "white",
      cursor: "pointer",
      fontWeight: "500",
      fontSize: "15px",
      color: isSelected
        ? isDark
          ? "#e0e7ff"
          : "#7c3aed"
        : isDark
        ? "#d1d5db"
        : "#374151",
      transition: "all 0.2s",
      flex: 1, // Allow buttons to grow/shrink
      minWidth: "100px", // Min width remains for visual stability
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
    }}
  >
    {children}
  </button>
);

// --- Community Modal Component ---
const CommunityModal = ({ isOpen, onClose, colors }) => {
  if (!isOpen) return null;

  // Fixed positioning and padding ensure the modal works on mobile without overflow
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "16px",
        backdropFilter: "blur(5px)",
      }}
    >
      <div
        style={{
          background: colors.bgCard,
          borderRadius: "16px",
          padding: "32px",
          maxWidth: "450px",
          width: "100%",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          position: "relative",
          border: `1px solid ${colors.border}`,
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: colors.textSecondary,
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = colors.textPrimary)
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = colors.textSecondary)
          }
        >
          <X size={24} />
        </button>

        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <Users
            size={48}
            color={colors.accentPrimary}
            style={{ marginBottom: "12px" }}
          />
          <h3
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: colors.textPrimary,
              margin: 0,
            }}
          >
            Join the Open Community
          </h3>
        </div>

        <p
          style={{
            color: colors.textSecondary,
            textAlign: "center",
            marginBottom: "32px",
          }}
        >
          This is where you'd find hundreds of custom themes, share your
          creations, and collaborate on new frame designs!
        </p>

        <a
          href="https://github.com/TechQuanta/github-avatar-frame-api" // Mock link
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          style={{
            display: "block",
            width: "100%",
            background: "linear-gradient(to right, #7c3aed, #a855f7)",
            color: "white",
            padding: "14px",
            borderRadius: "8px",
            textAlign: "center",
            textDecoration: "none",
            fontWeight: "600",
            fontSize: "16px",
            transition: "all 0.2s",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = 0.9)}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = 1)}
        >
          Visit Community Repository
        </a>
      </div>
    </div>
  );
};

// --- Share Modal Component ---
const ShareModal = ({ isOpen, onClose, colors, shareUrl, username }) => {
  if (!isOpen) return null;

  const shareText = `Check out my custom GitHub avatar frame for @${username}! Created with GitHub Avatar Frames.`;

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;

  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    // Show toast notification
    // Assuming showToastNotification is available in scope, but since it's inside component, need to pass or handle differently
    // For now, just copy
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "16px",
        backdropFilter: "blur(5px)",
      }}
    >
      <div
        style={{
          background: colors.bgCard,
          borderRadius: "16px",
          padding: "32px",
          maxWidth: "450px",
          width: "100%",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          position: "relative",
          border: `1px solid ${colors.border}`,
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: colors.textSecondary,
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = colors.textPrimary)
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = colors.textSecondary)
          }
        >
          <X size={24} />
        </button>

        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <Share2
            size={48}
            color={colors.accentPrimary}
            style={{ marginBottom: "12px" }}
          />
          <h3
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: colors.textPrimary,
              margin: 0,
            }}
          >
            Share Your Avatar
          </h3>
        </div>

        <p
          style={{
            color: colors.textSecondary,
            textAlign: "center",
            marginBottom: "32px",
          }}
        >
          Share your custom GitHub avatar frame with the world!
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px",
              background: "#1da1f2",
              color: "white",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "600",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = 0.9)}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = 1)}
          >
            <Twitter size={20} />
            Share on Twitter
          </a>
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px",
              background: "#0077b5",
              color: "white",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "600",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = 0.9)}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = 1)}
          >
            <Linkedin size={20} />
            Share on LinkedIn
          </a>
          <button
            onClick={() => {
              copyLink();
              onClose();
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px",
              background: colors.bgCard,
              border: `1px solid ${colors.border}`,
              borderRadius: "8px",
              color: colors.textPrimary,
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = colors.accentPrimary) &&
              (e.currentTarget.style.color = "white")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = colors.bgCard) &&
              (e.currentTarget.style.color = colors.textPrimary)
            }
          >
            <Copy size={20} />
            Copy Link
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---
function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000, 
      easing: "ease-in-out",
      once: true, 
    });
  }, []);
  const [username, setUsername] = useState("");
  // helper to show alert if username missing; returns true if blocked
  const blockIfNoUsername = () => {
    if (!username || !username.trim()) {
      alert("Hey! Please enter your GitHub username first 😊");
      return true; // blocked
    }
    return false; // ok
  };

  const [themes, setThemes] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState("base");
  const [customAccentColor, setCustomAccentColor] = useState(null);
  const [originalThemeColor, setOriginalThemeColor] = useState(null);
  const [size, setSize] = useState(384);
  const [canvas, setCanvas] = useState("light");
  const [shape, setShape] = useState("circle");
  const [radius, setRadius] = useState(38);
  const [frameStyle, setFrameStyle] = useState("default");
  
  // Text overlay parameters
  const [text, setText] = useState("");
  const [textColor, setTextColor] = useState("#ffffff");
  const [textSize, setTextSize] = useState(20);
  const [textPosition, setTextPosition] = useState("bottom");
  
  // Emoji overlay parameters
  const [emojis, setEmojis] = useState("");
  const [emojiSize, setEmojiSize] = useState(40);
  const [emojiPosition, setEmojiPosition] = useState("top");

  // Download format state
  const [downloadFormat, setDownloadFormat] = useState("png");

  const [loading, setLoading] = useState(false);
  const [themesLoading, setThemesLoading] = useState(true);
  const [error, setError] = useState(null);
  const [framedAvatarUrl, setFramedAvatarUrl] = useState(null);
  const [previewKey, setPreviewKey] = useState(0);
  const [copied, setCopied] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isCommunityModalOpen, setIsCommunityModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  // Sharing state
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // System Theme State
  const [isDark, setIsDark] = useState(false);

  // Badge Generator State
  const [badgeLabel, setBadgeLabel] = useState("GitHub Avatar");
  const [badgeColor, setBadgeColor] = useState("#7c3aed");
  const [badgeStyle, setBadgeStyle] = useState("flat");
  const [badgeCopied, setBadgeCopied] = useState(false);

  // Live Preview Canvas Ref
  const previewCanvasRef = useRef(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState(null);
  const [isPreviewUpdating, setIsPreviewUpdating] = useState(false);

  const maxRadius = useMemo(() => Math.floor(size / 2), [size]);

  // Define dark mode colors based on system preference (Enhanced Dark Theme)
  const colors = useMemo(
    () => ({
      textPrimary: isDark ? "#e5e7eb" : "#111827",
      textSecondary: isDark ? "#9ca3af" : "#6b7280",
      bgBody: isDark
        ? "#0F172A"
        : "linear-gradient(135deg, #e0e7ff 0%, #f3e8ff 50%, #fce7f3 100%)",
      bgCard: isDark ? "#1E293B" : "white",
      bgInput: isDark ? "#334155" : "white",
      border: isDark ? "#374151" : "#e5e7eb",
      borderInput: isDark ? "#475569" : "#d1d5db",
      accentPrimary: "#7c3aed",
      accentSecondary: "#a855f7",
      accentDark: "#a78bfa",
      errorBg: isDark ? "#450a0a" : "#fef2f2",
      errorBorder: isDark ? "#b91c1c" : "#fecaca",
      errorText: isDark ? "#fca5a5" : "#991b1b",
    }),
    [isDark]
  );

  // Progress Steps definition (using requested labels)
  const steps = [
    { num: 1, label: "Enter Username", icon: Github },
    { num: 2, label: "Choose Theme", icon: Sparkles },
    { num: 3, label: "Adjust Settings", icon: Zap },
    { num: 4, label: "Generate", icon: Frame },
  ];

  // Detect system preference and set up listener
  useEffect(() => {
    const checkDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDark(checkDark);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e) => setIsDark(e.matches);

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    fetchThemes();
    if (shape === "circle") {
      setRadius(maxRadius);
    } else if (radius > maxRadius) {
      setRadius(maxRadius);
    }

    if (username.trim() && selectedTheme) {
      setCurrentStep(3);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size, shape, maxRadius]);

  const fetchThemes = async () => {
    try {
      setThemesLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/themes`);

      if (!response.ok) {
        throw new Error("Failed to fetch themes");
      }

      const data = await response.json();
      setThemes(data);

      if (data.length > 0 && !selectedTheme) {
        setSelectedTheme(data[0].theme);
      }
    } catch (err) {
      console.error("Error fetching themes:", err);
      setError("Failed to load themes. Check API server.");
      setThemes([
        { theme: "base", name: "Base Theme" },
        { theme: "minimal", name: "Minimal" },
        { theme: "neon", name: "Neon Glow" },
      ]);
    } finally {
      setThemesLoading(false);
    }
  };

  const downloadImage = () => {
    if (framedAvatarUrl) {
      const link = document.createElement("a");
      link.href = framedAvatarUrl;
      link.download = `github-avatar-frame-${username}.${downloadFormat}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const copyApiUrl = () => {
    let apiUrl = `${API_BASE_URL}/api/framed-avatar/${username}?theme=${selectedTheme}&size=${size}&canvas=${canvas}&shape=${shape}&radius=${finalRadiusForDisplay}&style=${frameStyle}`;

    // Add custom accent color if selected
    if (customAccentColor) {
      apiUrl += `&accentColor=${encodeURIComponent(customAccentColor)}`;
    }

    // Add text parameters if provided
    if (text.trim()) {
      apiUrl += `&text=${encodeURIComponent(text)}&textColor=${encodeURIComponent(textColor)}&textSize=${textSize}&textPosition=${textPosition}`;
    }

    // Add emoji parameters if provided
    if (emojis.trim()) {
      apiUrl += `&emojis=${encodeURIComponent(emojis)}&emojiSize=${emojiSize}&emojiPosition=${emojiPosition}`;
    }

    try {
      // Use document.execCommand('copy') for better compatibility in iframe environments
      const tempInput = document.createElement("textarea");
      tempInput.value = apiUrl;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
      // Fallback message if copying fails
    }
  };

  const copyBadgeMarkdown = () => {
    const badgeMarkdown = `[![${badgeLabel}](https://img.shields.io/badge/${encodeURIComponent(badgeLabel)}-${badgeColor.replace('#', '')}?style=${badgeStyle})](${framedAvatarUrl})`;

    try {
      const tempInput = document.createElement("textarea");
      tempInput.value = badgeMarkdown;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);
      setBadgeCopied(true);
      setTimeout(() => setBadgeCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy badge markdown: ", err);
    }
  };

  const generateFramedAvatar = async () => {
    if (!username.trim()) {
      setError("Please enter a GitHub username");
      return;
    }

    setLoading(true);
    setError(null);
    setFramedAvatarUrl(null);
    setCurrentStep(4);

    try {
      const finalRadius = shape === "circle" ? maxRadius : radius;

      let url = `${API_BASE_URL}/api/framed-avatar/${username}?theme=${selectedTheme}&size=${size}&canvas=${canvas}&shape=${shape}&radius=${finalRadius}&style=${frameStyle}&format=${downloadFormat}`;

      // Add custom accent color if selected
      if (customAccentColor) {
        url += `&accentColor=${encodeURIComponent(customAccentColor)}`;
      }

      // Add text parameters if provided
      if (text.trim()) {
        url += `&text=${encodeURIComponent(text)}&textColor=${encodeURIComponent(textColor)}&textSize=${textSize}&textPosition=${textPosition}`;
      }

      // Add emoji parameters if provided
      if (emojis.trim()) {
        url += `&emojis=${encodeURIComponent(emojis)}&emojiSize=${emojiSize}&emojiPosition=${emojiPosition}`;
      }

      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 seconds timeout

      const response = await fetch(url, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 404 && errorData.error === "User not found") {
          throw new Error("User not found — please check the spelling");
        }
        throw new Error(
          errorData.error ||
            errorData.message ||
            "Failed to generate framed avatar"
        );
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setFramedAvatarUrl(imageUrl);
      setPreviewKey((prev) => prev + 1);
    } catch (err) {
      console.error("Error generating avatar:", err);
      if (err.name === "AbortError") {
        setError(
          "Request timed out. The server might be busy. Please try again."
        );
      } else {
        setError(err.message || "Failed to generate framed avatar");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    setPreviewError(null); // Clear preview error when username changes
    if (e.target.value.trim()) {
      setCurrentStep(2);
    } else {
      setCurrentStep(1);
    }
  };

  const handleThemeSelect = (theme) => {
    setSelectedTheme(theme);
    setCurrentStep(3);
    // Reset custom color when selecting a new theme
    setCustomAccentColor(null);
    setOriginalThemeColor(null);
  };

  const handleRandomTheme = () => {
    if (themes.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * themes.length);
    const randomTheme = themes[randomIndex];
    
    setSelectedTheme(randomTheme.theme);
    
    // Randomly decide whether to also randomize accent color (30% chance)
    const shouldRandomizeColor = Math.random() < 0.3;
    if (shouldRandomizeColor) {
      const randomColors = ["#7c3aed", "#ec4899", "#f97316", "#10b981", "#3b82f6", "#8b5cf6", "#ef4444", "#f59e0b"];
      const randomColor = randomColors[Math.floor(Math.random() * randomColors.length)];
      setCustomAccentColor(randomColor);
      showToastNotification("Random theme and color applied");
    } else {
      setCustomAccentColor(null);
      showToastNotification("Surprise style loaded");
    }
    
    setOriginalThemeColor(null);
    setCurrentStep(3);
  };

  const showToastNotification = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleCustomColorChange = (color) => {
    setCustomAccentColor(color);
  };

  const resetToDefaultColor = () => {
    setCustomAccentColor(null);
    setOriginalThemeColor(null);
  showToastNotification("Reset to default color");
  };

  const finalRadiusForDisplay = shape === "circle" ? maxRadius : radius;

  // Live Preview Functions
  const fetchAvatar = async (username) => {
    const avatarUrl = `https://avatars.githubusercontent.com/${username}?size=${size}`;
    const response = await fetch(avatarUrl, { cache: 'no-cache' });
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('User not found — please check the spelling');
      }
      throw new Error('Avatar not found');
    }
    const blob = await response.blob();
    return createImageBitmap(blob);
  };

  const fetchFrame = async (theme) => {
    const frameUrl = `${API_BASE_URL}/public/frames/${theme}/frame.png`;
    const response = await fetch(frameUrl, { cache: 'no-cache' });
    if (!response.ok) throw new Error('Frame not found');
    const blob = await response.blob();
    return createImageBitmap(blob);
  };

  const drawPreview = async () => {
    if (!username.trim() || !previewCanvasRef.current) return;

    setPreviewLoading(true);
    setPreviewError(null);
    setIsPreviewUpdating(true);

    try {
  const canvasEl = previewCanvasRef.current;
  const ctx = canvasEl.getContext('2d');
  canvasEl.width = size;
  canvasEl.height = size;

      // Clear canvas
      ctx.clearRect(0, 0, size, size);

      // Set canvas background
      if (canvas !== "transparent") {
        let bgColor = { r: 240, g: 240, b: 240, alpha: 1 }; // light default
        if (canvas === "dark") bgColor = { r: 34, g: 34, b: 34, alpha: 1 };
        ctx.fillStyle = `rgba(${bgColor.r}, ${bgColor.g}, ${bgColor.b}, ${bgColor.alpha})`;
        ctx.fillRect(0, 0, size, size);
      }

      // Fetch avatar
      let avatarImage;
      try {
        avatarImage = await fetchAvatar(username);
      } catch (error) {
        // Use fallback if avatar not found
        const fallbackUrl = `${API_BASE_URL}/public/not-found.png`;
        const response = await fetch(fallbackUrl);
        const blob = await response.blob();
        avatarImage = await createImageBitmap(blob);
      }

      // Fetch frame
      const frameImage = await fetchFrame(selectedTheme);

      // Resize avatar to fit
      const avatarSize = size;
      ctx.save();
      ctx.beginPath();
      const radius = shape === "circle" ? size / 2 : finalRadiusForDisplay;
      if (shape === "circle") {
        ctx.arc(size / 2, size / 2, radius, 0, 2 * Math.PI);
      } else {
        ctx.roundRect(0, 0, size, size, radius);
      }
      ctx.closePath();
      ctx.clip();
  ctx.drawImage(avatarImage, 0, 0, avatarSize, avatarSize);
      ctx.restore();

      // Draw frame with tint if custom color
      ctx.save();
      if (customAccentColor) {
        // Apply tint by drawing frame with globalCompositeOperation
        ctx.globalCompositeOperation = 'source-over';
  ctx.drawImage(frameImage, 0, 0, size, size);
        ctx.globalCompositeOperation = 'multiply';
        const [r, g, b] = customAccentColor.match(/\w\w/g).map(x => parseInt(x, 16));
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
  ctx.fillRect(0, 0, size, size);
        ctx.globalCompositeOperation = 'source-over';
      } else {
        ctx.drawImage(frameImage, 0, 0, size, size);
      }
      ctx.restore();

      // Draw text overlay
      if (text.trim()) {
        ctx.save();
        ctx.font = `bold ${textSize}px Arial, sans-serif`;
        ctx.fillStyle = textColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = textPosition === 'top' ? 'top' : textPosition === 'bottom' ? 'bottom' : 'middle';
        const y = textPosition === 'top' ? 10 : textPosition === 'bottom' ? size - 10 : size / 2;
        ctx.fillText(text, size / 2, y);
        ctx.restore();
      }

      // Draw emoji overlay
      if (emojis.trim()) {
        const emojiList = emojis.split(',').map(e => e.trim()).filter(e => e);
        if (emojiList.length > 0) {
          ctx.save();
          ctx.font = `${emojiSize}px Arial, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          if (emojiPosition === 'corners' && emojiList.length >= 4) {
            const positions = [
              { x: emojiSize / 2 + 5, y: emojiSize / 2 + 5 },
              { x: size - emojiSize / 2 - 5, y: emojiSize / 2 + 5 },
              { x: emojiSize / 2 + 5, y: size - emojiSize / 2 - 5 },
              { x: size - emojiSize / 2 - 5, y: size - emojiSize / 2 - 5 }
            ];
            emojiList.slice(0, 4).forEach((emoji, index) => {
              ctx.fillText(emoji, positions[index].x, positions[index].y);
            });
          } else {
            const y = emojiPosition === 'top' ? emojiSize + 5 : size - 5;
            const spacing = emojiSize + 10;
            const totalWidth = emojiList.length * spacing;
            const startX = (size - totalWidth) / 2 + emojiSize / 2;
            emojiList.forEach((emoji, index) => {
              const x = startX + index * spacing;
              ctx.fillText(emoji, x, y);
            });
          }
          ctx.restore();
        }
      }

    } catch (error) {
      console.error('Preview error:', error);
      setPreviewError(error.message);
    } finally {
      setPreviewLoading(false);
      setIsPreviewUpdating(false);
    }
  };

  useEffect(() => {
    if (username.trim()) {
      drawPreview();
    }
  }, [username, selectedTheme, size, canvas, shape, radius, customAccentColor, text, textColor, textSize, textPosition, emojis, emojiSize, emojiPosition]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <div
            style={{
              minHeight: "100vh",
              background: colors.bgBody,
              padding: "24px 16px",
              color: colors.textPrimary,
            }}>
            <div className="layout-wrapper"
                    style={{
                      maxWidth: "1200px",
                      margin:"0 auto",
                    }}>
        {/* --- 1. Top Bar: Title + Community Button --- */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "32px",
            flexWrap: "wrap",
            gap: "16px",
          }}
          className='header-container'
          data-aos="fade-down"
          >
          {/* Center Title Block */}
          <div
            style={{
              flexGrow: 1,
              textAlign: "center",
              minWidth: "200px",
              order: 1,
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                marginBottom: "8px",
              }}
            >
              <div style={{ position: "relative", display: "inline-block" }}>
                <Frame
                  size={48}
                  color={colors.accentPrimary}
                  strokeWidth={2.5}
                />
                <Sparkles
                  size={20}
                  color={colors.accentSecondary}
                  className="pulse-icon"
                  style={{
                    position: "absolute",
                    top: "-4px",
                    right: "-4px",
                  }}
                />
              </div>
              <h1
                className="main-title"
                style={{
                  fontSize: "48px",
                  fontWeight: "900",
                  fontFamily: "Georgia, Times New Roman, Times, serif",
                  fontStyle: "italic",
                  background:
                    "linear-gradient(to right, #7c3aed, #a855f7, #ec4899)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  margin: 0,
                }} data-aos="zoom-in">
                GitHub Avatar Frames
              </h1>
            </div>
            <p
              style={{
                color: colors.textSecondary,
                fontSize: "16px",
                margin: "0",
              }}
              data-aos="fade-right">
                Create stunning framed avatars for your GitHub profile in seconds
            </p>
          </div>

          {/* API Docs and Community Buttons */}
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <button data-aos="fade-right"
              onClick={() => setIsCommunityModalOpen(true)}
              className="community-button"
              style={{
                padding: "10px 20px",
                borderRadius: "8px",
                background: isDark ? "#374151" : "#f0f4f8",
                border: `2px solid ${
                  isDark ? colors.accentDark : colors.accentPrimary
                }`,
                color: isDark ? colors.accentDark : colors.accentPrimary,
                fontWeight: "800",
                fontSize: "14px",
                cursor: "pointer",
                transition: "all 0.3s",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = isDark
                  ? "#475569"
                  : colors.accentPrimary;
                e.currentTarget.style.color = isDark ? "white" : "white";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = isDark ? "#374151" : "#f0f4f8";
                e.currentTarget.style.color = isDark
                  ? colors.accentDark
                  : colors.accentPrimary;
              }}
            >
              <Users size={20} />
              <span style={{ fontFamily: "Times New Roman, serif" }}>
                Open Community
              </span>
            </button>
            <a
              href={`${API_BASE_URL}/api-docs`}
              target="_blank"
              rel="noopener noreferrer"
              data-aos="fade-right"
              style={{
                padding: "10px 20px",
                borderRadius: "8px",
                background: isDark ? "#374151" : "#f0f4f8",
                border: `2px solid ${isDark ? colors.accentDark : colors.accentPrimary}`,
                color: isDark ? colors.accentDark : colors.accentPrimary,
                fontWeight: "700",
                fontSize: "14px",
                textDecoration: "none",
                transition: "all 0.3s",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            >
              API Docs
            </a>
          </div>
        </div>

        {/* --- 2. Progress Steps --- */}
        <div data-aos="fade-right" style={{ marginBottom: "32px" }}>
          <div
            style={{
              background: colors.bgCard,
              borderRadius: "12px",
              padding: "20px",
              border: `1px solid ${colors.border}`,
              maxWidth: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
              }}
            >
              {steps.map((step, idx) => {
                const isActive = currentStep >= step.num;
                const Icon = step.icon;

                  const activeBg = "white"; 
                  const inactiveBg = isDark ? "#374151" : "#f3f4f6";
                  const activeColor = "#111827"; 
                  const inactiveColor = "white";  
                   const activeBorder = "#a855f7"; 
                   const inactiveBorder = isDark ? "#4b5563" : "#e5e7eb";

                return (
                  <React.Fragment key={step.num}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        flex: 1,
                        minWidth: "20%",
                      }}
                    >
                      <div

                       onClick={() => {
    const sectionIds = [
      "#username-section",
      "#theme-section",
      "#settings-section",
      "#generate-section",
    ];
    const targetId = sectionIds[idx];
    const target = document.querySelector(targetId);
    if (target) target.scrollIntoView({ behavior: "smooth" });
  }}
  style={{
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "8px",
    transition: "all 0.3s ease",
    background: isActive ? activeBg : inactiveBg,
    color: isActive ? activeColor : inactiveColor,
    border: `2px solid ${
      isActive ? activeBorder : inactiveBorder
    }`,
    cursor: "pointer",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = "scale(1.1)";
    e.currentTarget.style.boxShadow =
      "0 0 10px rgba(168, 85, 247, 0.5)";
       if (!isActive) {
              e.currentTarget.style.background = "white"; 
              e.currentTarget.style.color = "#111827"; 
            }
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = "scale(1)";
    e.currentTarget.style.boxShadow = "none";
    if (!isActive) {
              e.currentTarget.style.background = inactiveBg;
              e.currentTarget.style.color = inactiveColor; 
            }
  }}
>

                        <Icon size={20} />
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          fontWeight: "600",
                          textAlign: "center",

                          // color: isActive ? activeColor : inactiveColor,
                           color: isActive ? "white" : "#9ca3af"
                        }}>

                        

                        {step.label}
                      </div>
                    </div>

                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>

        {/* --- 3. Main Left/Right Container (50/50 Split Desktop, Column Mobile) --- */}
        <div
          className="main-grid-container"
          style={{
            display: "grid",
            gap: "24px",
            alignItems: "start",
            justifyContent: "center",
            gridTemplateColumns: "1fr 1fr",
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "32px 16px",
          }}
        >
          {/* Left: Configuration Panel (50%) */}
          <div id="username-section" data-aos="flip-right"
            style={{
              background: colors.bgCard,
              borderRadius: "12px",
              border: `1px solid ${colors.border}`,
              padding: "32px",
              display: "flex",
              maxWidth: "100%",
              flexDirection: "column",
              gap: "24px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              minWidth: "0" /* Critical for layout flexibility */,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  background: `linear-gradient(135deg, ${colors.accentPrimary} 0%, ${colors.accentSecondary} 100%)`,
                  padding: "10px",
                  borderRadius: "8px",
                }}
              >
                <Github size={20} color="white" />
              </div>
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: colors.textPrimary,
                  margin: 0,
                }}
              >
                Configuration & Params
              </h2>
            </div>

            {/* Search Bar and Theme Selector Container */}
            <div
              className="search-theme-container"
              style={{
                display: "flex",
                gap: "24px",
                alignItems: "flex-start",
                flexWrap: "wrap",
                marginBottom: "8px",
              }}
            >
              {/* Username Input (Monospace Font Applied Here) */}
              <div
                style={{
                  flex: 1,
                  minWidth: "200px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <label
                  htmlFor="username-input"
                  style={{
                    width: "100%",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: colors.textPrimary,
                  }}
                >
                  GitHub Username
                </label>
                <div
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                <input
                  id="username-input"
                  type="text"
                  value={username}
                  onChange={handleUsernameChange}
                  placeholder="Enter username (e.g., torvalds)"
                  aria-describedby="username-help"
                  style={{
                    maxWidth: "300px",
                    width: "100%",
                    padding: "12px 16px 12px 48px",
                    fontSize: "16px",
                    border: `1px solid ${colors.borderInput}`,
                    borderRadius: "8px",
                    outline: "none",
                    transition: "all 0.2s",
                    color: colors.textPrimary,
                    background: colors.bgInput,
                    boxSizing: "border-box",
                    fontFamily: "monospace", // Applied monospace font
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = colors.accentPrimary;
                    e.target.style.boxShadow = `0 0 0 2px ${colors.accentPrimary}33`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = colors.borderInput;
                    e.target.style.boxShadow = "none";
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (username.trim()) {
                        generateFramedAvatar();
                      }
                    }
                  }}
                />
                  <Github
                    size={20}
                    color={colors.textSecondary}
                    style={{
                      position: "absolute",
                      left: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                    }}
                  />
                </div>
                <div id="username-help" style={{ display: "none" }}>
                  Enter your GitHub username to generate a framed avatar. Press Enter to generate if a username is entered.
                </div>
              </div>

              {/* Theme Selection Slider */}
              <div style={{ flex: 1, minWidth: "250px" }}>
                <ThemeSlider
                  themes={themes}
                  themesLoading={themesLoading}
                  selectedTheme={selectedTheme}
                  handleThemeSelect={handleThemeSelect}
                  colors={colors}
                  isDark={isDark}
                />
              </div>
            </div>

            {/* Custom Color Picker and Random Theme Generator */}
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: colors.textPrimary,
                  marginBottom: "8px",
                }}>
                Customization & Discovery
              </label>
              <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                {/* Custom Accent Color Picker */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <label
                    style={{
                      fontSize: "12px",
                      fontWeight: "500",
                      color: colors.textSecondary,
                      whiteSpace: "nowrap",
                    }}>
                      Accent Color:
                  </label>
                  <input
                    type="color"
                    value={customAccentColor || "#7c3aed"}
                    onChange={(e) => handleCustomColorChange(e.target.value)}
                    style={{
                      width: "40px",
                      height: "40px",
                      border: `2px solid ${colors.border}`,
                      borderRadius: "8px",
                      cursor: "pointer",
                      background: "transparent",
                      padding: 0,
                    }}
                    title="Customize accent color"
                  />
                  {customAccentColor && (
                    <button
                      onClick={resetToDefaultColor}
                      style={{
                        padding: "8px 12px",
                        background: colors.bgCard,
                        border: `1px solid ${colors.border}`,
                        borderRadius: "6px",
                        color: colors.textPrimary,
                        fontSize: "11px",
                        fontWeight: "500",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        transition: "all 0.2s",
                      }}
                      title="Reset to default color">
                      Reset
                    </button>
                  )}
                </div>

                {/* Quick Color Presets */}
                <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", color: colors.textSecondary, marginRight: "4px" }}>Quick:</span>
                  {["#7c3aed", "#ec4899", "#f97316", "#10b981", "#3b82f6", "#8b5cf6"].map((color) => (
                    <button
                      key={color}
                      onClick={() => handleCustomColorChange(color)}
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        border: `2px solid ${colors.border}`,
                        background: color,
                        cursor: "pointer",
                        transition: "all 0.2s",
                        boxShadow: customAccentColor === color ? "0 0 0 2px rgba(124, 58, 237, 0.3)" : "none",
                      }}
                      title={`Set color to ${color}`}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.1)";
                        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.2)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                        e.currentTarget.style.boxShadow = customAccentColor === color ? "0 0 0 2px rgba(124, 58, 237, 0.3)" : "none";
                      }}
                    />
                  ))}
                </div>

                {/* Random Theme Generator */}
                <button
                  onClick={handleRandomTheme}
                  disabled={themes.length === 0}
                  title="Randomly select a theme (sometimes includes random color too!)"
                  style={{
                    padding: "10px 16px",
                    background: themes.length === 0 
                      ? colors.border 
                      : "linear-gradient(to right, #ec4899, #f97316)",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: "600",
                    fontSize: "13px",
                    cursor: themes.length === 0 ? "not-allowed" : "pointer",
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    boxShadow: themes.length === 0 
                      ? "none" 
                      : "0 2px 4px rgba(0, 0, 0, 0.1)",
                  }}
                  onMouseEnter={(e) => {
                    if (themes.length > 0) {
                      e.currentTarget.style.transform = "translateY(-1px)";
                      e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.15)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (themes.length > 0) {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
                    }
                  }}>
                  Random Theme
                </button>
              </div>
            </div>
            {/* Frame Style Control Group(Border Focus) */}
            <div style={{marginBottom: "24px"}}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: colors.textPrimary,
                  marginBottom: "8px",
                }}>
                  Frame Style (Param : `style`)
                </label>
                <div style={{maxWidth: "fit-content"}}>
                <div 
                  className='control-button-set'
                  style={{display: "flex", gap: "12px"}}>
                  <ControlButton
                    onClick={() => {
                      if(blockIfNoUsername()){
                        alert("please enter a username first!");
                        return;
                      }
                      setFrameStyle("default");
                      alert("Default frame selected!");
                    }}
                    isSelected={frameStyle === "default"}
                    isDark={isDark}
                    >
                      Default
                  </ControlButton>
                  <ControlButton
                    onClick={() => {
                      if(blockIfNoUsername()){
                        alert("please enter the user name first!");
                        return;
                      }
                      setFrameStyle("border-focus");
                      alert("border-focus frame selected!");

                    }}
                    isSelected={frameStyle === "border-focus"}
                    isDark={isDark}
                    >
                    Border Focus
                  </ControlButton>
                  </div>
            </div>
            </div>

            {/* Control Group: Canvas & Shape */}
             <div
    className='control-group'
    // REMOVED: display: "flex" and gap: "24px" to allow vertical stacking
    style={{ marginBottom: "24px" }}>
    {/* Background Canvas (Param: `canvas`) */}
    <div style={{ flex: 1, marginBottom: "24px" }}>
        <label
            style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                color: colors.textPrimary,
                marginBottom: "8px",
            }}>
            Background Canvas (Param: `canvas`)
        </label>
        <div
            className='control-button-set'
            style={{ display: "flex", gap: "12px" }}>
            <ControlButton
                onClick={() => setCanvas("light")}
                isSelected={canvas === "light"}
                isDark={isDark}>
                <Sun size={18} /> Light
            </ControlButton>
            <ControlButton
                onClick={() => setCanvas("dark")}
                isSelected={canvas === "dark"}
                isDark={isDark}>
                <Moon size={18} /> Dark
            </ControlButton>
            {/*Transparent Button */}
            <ControlButton
                onClick={()=> setCanvas("transparent")}
                isSelected={canvas === "transparent"}
                isDark={isDark}>
                <Sparkles size={18}/> Transparent
            </ControlButton>
        </div>
    </div>
    {/* Avatar Shape (Param: `shape`) - Now appears below the Background Canvas */}
    <div style={{ flex: 1 }}>
        <label
            style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                color: colors.textPrimary,
                marginBottom: "8px",
            }}>
            Avatar Shape (Param: `shape`)
        </label>
        <div
            className='control-button-set'
            style={{ display: "flex", gap: "12px" }}>
            <ControlButton
                onClick={() => setShape("circle")}
                isSelected={shape === "circle"}
                isDark={isDark}>
                <Circle size={18} /> Circle
            </ControlButton>
            <ControlButton
                onClick={() => setShape("rect")}
                isSelected={shape === "rect"}
                isDark={isDark}>
                <Square size={18} /> Square
            </ControlButton>
        </div>
      </div>
  </div>

            {/* Size Slider */}
            <div
              style={{
                marginBottom: "24px",
              }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: colors.textPrimary,
                  marginBottom: "8px",
                }}
              >
                Size (Param: `size`):{" "}
                <span style={{ color: colors.accentPrimary, fontSize: "16px" }}>
                  {size}px
                </span>
              </label>
              <input
                type="range"
                min="64"
                max="1024"
                step="64"
                value={size}
                onChange={(e) => setSize(parseInt(e.target.value))}
                className="range-slider"
                style={{
                  width: "100%",
                  height: "8px",
                  borderRadius: "4px",
                  background: isDark
                    ? "#374151"
                    : "linear-gradient(to right, #a78bfa, #c4b5fd)",
                  outline: "none",
                  cursor: "pointer",
                  WebkitAppearance: "none",
                }}
              />
            </div>

            {/* Radius Slider (Conditional) */}
            {shape === "rect" && (
              <div
                style={{
                  marginBottom: "24px",
                }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: colors.textPrimary,
                    marginBottom: "8px",
                  }}
                >
                  Corner Radius (Param: `radius`):{" "}
                  <span
                    style={{ color: colors.accentPrimary, fontSize: "16px" }}
                  >
                    {finalRadiusForDisplay}px
                  </span>
                </label>
                <input
                  type="range"
                  min="0"
                  max={maxRadius}
                  step="1"
                  value={radius}
                  onChange={(e) => setRadius(parseInt(e.target.value))}
                  className="range-slider"
                  style={{
                    width: "100%",
                    height: "8px",
                    borderRadius: "4px",
                    background: isDark
                      ? "#374151"
                      : "linear-gradient(to right, #a78bfa, #c4b5fd)",
                    outline: "none",
                    cursor: "pointer",
                    WebkitAppearance: "none",
                  }}
                />
              </div>
            )}

            {/* Text Overlay Controls */}
            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: colors.textPrimary,
                  marginBottom: "8px",
                }}>
                Text Overlay (Param: `text`)
              </label>
              <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
                <input
                  type="text"
                  placeholder="Enter custom text..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  style={{
                    flex: 1,
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: `2px solid ${colors.border}`,
                    background: colors.bgInput,
                    color: colors.textPrimary,
                    fontSize: "14px",
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                />
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  style={{
                    width: "50px",
                    height: "40px",
                    borderRadius: "8px",
                    border: `2px solid ${colors.border}`,
                    cursor: "pointer",
                  }}
                />
              </div>
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: "12px", color: colors.textSecondary, marginBottom: "4px", display: "block" }}>
                    Size: {textSize}px
                  </label>
                  <input
                    type="range"
                    min="8"
                    max="100"
                    value={textSize}
                    onChange={(e) => setTextSize(parseInt(e.target.value))}
                    className="range-slider"
                    style={{
                      width: "100%",
                      height: "6px",
                      borderRadius: "3px",
                      background: isDark ? "#374151" : "linear-gradient(to right, #a78bfa, #c4b5fd)",
                      outline: "none",
                      cursor: "pointer",
                      WebkitAppearance: "none",
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: "12px", color: colors.textSecondary, marginBottom: "4px", display: "block" }}>
                    Position
                  </label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <ControlButton
                      onClick={() => setTextPosition("top")}
                      isSelected={textPosition === "top"}
                      isDark={isDark}>
                      Top
                    </ControlButton>
                    <ControlButton
                      onClick={() => setTextPosition("center")}
                      isSelected={textPosition === "center"}
                      isDark={isDark}>
                      Center
                    </ControlButton>
                    <ControlButton
                      onClick={() => setTextPosition("bottom")}
                      isSelected={textPosition === "bottom"}
                      isDark={isDark}>
                      Bottom
                    </ControlButton>
                  </div>
                </div>
              </div>
            </div>

            {/* Emoji Overlay Controls */}
            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: colors.textPrimary,
                  marginBottom: "8px",
                }}>
                Emoji Overlay (Param: `emojis`)
              </label>
              <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
                <input
                  type="text"
                  placeholder="Enter emojis (comma-separated)"
                  value={emojis}
                  onChange={(e) => setEmojis(e.target.value)}
                  style={{
                    flex: 1,
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: `2px solid ${colors.border}`,
                    background: colors.bgInput,
                    color: colors.textPrimary,
                    fontSize: "14px",
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                />
              </div>
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: "12px", color: colors.textSecondary, marginBottom: "4px", display: "block" }}>
                    Size: {emojiSize}px
                  </label>
                  <input
                    type="range"
                    min="16"
                    max="120"
                    value={emojiSize}
                    onChange={(e) => setEmojiSize(parseInt(e.target.value))}
                    className="range-slider"
                    style={{
                      width: "100%",
                      height: "6px",
                      borderRadius: "3px",
                      background: isDark ? "#374151" : "linear-gradient(to right, #a78bfa, #c4b5fd)",
                      outline: "none",
                      cursor: "pointer",
                      WebkitAppearance: "none",
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: "12px", color: colors.textSecondary, marginBottom: "4px", display: "block" }}>
                    Position
                  </label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <ControlButton
                      onClick={() => setEmojiPosition("top")}
                      isSelected={emojiPosition === "top"}
                      isDark={isDark}>
                      Top
                    </ControlButton>
                    <ControlButton
                      onClick={() => setEmojiPosition("bottom")}
                      isSelected={emojiPosition === "bottom"}
                      isDark={isDark}>
                      Bottom
                    </ControlButton>
                    <ControlButton
                      onClick={() => setEmojiPosition("corners")}
                      isSelected={emojiPosition === "corners"}
                      isDark={isDark}>
                      Corners
                    </ControlButton>
                  </div>
                </div>
              </div>
            </div>

            {/* Generate Button */}
          <div id="generate-section"> 
             <button
              onClick={generateFramedAvatar}
              disabled={loading || !username.trim()}
              style={{
                width: "100%",
                background:
                  loading || !username.trim()
                    ? colors.border
                    : "linear-gradient(to right, #7c3aed, #a855f7)",
                color: "white",
                padding: "14px",
                borderRadius: "8px",
                border: "none",
                fontWeight: "600",
                fontSize: "16px",
                cursor: loading || !username.trim() ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                boxShadow:
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
              }}
              onMouseEnter={(e) => {
                if (!loading && username.trim()) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 12px -2px rgba(0, 0, 0, 0.2)";
                  e.currentTarget.style.background = "linear-gradient(to right, #5b21b6, #7c3aed)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)";
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="spinner" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Generate Framed Avatar
                </>
              )}
             </button>

             {error && (
              <div
                className="error-shake"
                style={{
                  padding: "12px",
                  background: colors.errorBg,
                  border: `1px solid ${colors.errorBorder}`,
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "8px",
                  marginTop: "16px",
                }}
              >
                <AlertCircle
                  size={18}
                  color="#dc2626"
                  style={{ flexShrink: 0, marginTop: "2px" }}
                />
                <div style={{ fontSize: "14px", color: colors.errorText }}>
                  {error}
                </div>
              </div>
            )}
            </div>
          </div>

          {/* Right: Preview Panel (50%) */}
          <div data-aos="flip-left"
            style={{
              background: colors.bgCard,
              borderRadius: "12px",
              border: `1px solid ${colors.border}`,
              padding: "32px",
              maxWidth: "100%",
              minWidth: "0" /* Critical for layout flexibility */,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  background: `linear-gradient(135deg, ${colors.accentSecondary} 0%, #ec4899 100%)`,
                  padding: "10px",
                  borderRadius: "8px",
                }}
              >
                <Frame size={20} color="white" />
              </div>
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: colors.textPrimary,
                  margin: 0,
                }}
              >
                Preview & Download
              </h2>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "400px",
              }}
            >
              {/* Preview Logic (Conditional) */}
              {loading ? (
                <div
                  style={{
                    textAlign: "center",
                    position: "relative",
                    padding: "40px",
                    borderRadius: "16px",
                    background: `linear-gradient(45deg, ${colors.accentPrimary}, ${colors.accentSecondary}, ${colors.accentPrimary})`,
                    animation: "rotate-gradient 3s linear infinite",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: "4px",
                      background: colors.bgCard,
                      borderRadius: "12px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "20px",
                    }}
                  >
                    <Loader2
                      size={64}
                      color={colors.accentPrimary}
                      strokeWidth={2.5}
                      className="spinner pulse-spinner"
                    />
                    <p
                      className="pulse-text"
                      style={{
                        color: colors.textSecondary,
                        fontWeight: "600",
                        fontSize: "16px",
                        marginTop: "16px",
                      }}
                    >
                      Creating your framed avatar...
                    </p>
                  </div>
                </div>
              ) : framedAvatarUrl ? (
                <div style={{ textAlign: "center", width: "100%" }}>
                  {/* AVATAR IMAGE: Responsive Scaling Fix Applied Here */}
                  <img
                    key={previewKey}
                    src={framedAvatarUrl}
                    alt="Framed Avatar"
                    className="preview-img"
                    style={{ borderRadius: shape === "circle" ? "50%" : `${finalRadiusForDisplay}px`, border: `3px solid ${isDark ? "#374151" : "white"}` }}
                  />

                  <div
                    style={{
                      width: "100%",
                      maxWidth: "400px",
                      margin: "0 auto",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "12px",
                        flexDirection: "column",
                        marginBottom: "12px",
                      }}
                    >
                      <select
                        value={downloadFormat}
                        onChange={(e) => setDownloadFormat(e.target.value)}
                        style={{
                          flex: 1,
                          padding: "12px",
                          borderRadius: "8px",
                          border: `2px solid ${colors.border}`,
                          background: colors.bgInput,
                          color: colors.textPrimary,
                          fontSize: "14px",
                          fontWeight: "500",
                          outline: "none",
                          cursor: "pointer",
                          transition: "border-color 0.2s",
                        }}
                      >
                        <option value="png">PNG</option>
                        <option value="jpg">JPG</option>
                        <option value="svg">SVG</option>
                      </select>
                      <button
                        onClick={downloadImage}
                        style={{
                          flex: 1,
                          background:
                            "linear-gradient(to right, #16a34a, #059669)",
                          color: "white",
                          padding: "12px",
                          borderRadius: "8px",
                          border: "none",
                          fontWeight: "600",
                          fontSize: "14px",
                          cursor: "pointer",
                          transition: "all 0.2s",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: "8px",
                          boxShadow:
                            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <Download size={18} />
                        Download
                      </button>
                      <button
                        onClick={() => setIsShareModalOpen(true)}
                        style={{
                          flex: 1,
                          background:
                            "linear-gradient(to right, #1d4ed8, #2563eb)",
                          color: "white",
                          padding: "12px",
                          borderRadius: "8px",
                          border: "none",
                          fontWeight: "600",
                          fontSize: "14px",
                          cursor: "pointer",
                          transition: "all 0.2s",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: "8px",
                          boxShadow:
                            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <Share2 size={18} />
                        Share
                      </button>
                    </div>

                    {/* API URL Section (Monospace Font Applied Here) */}
                    <div
                      style={{
                        padding: "16px",
                        background: isDark ? "#334155" : "#f9fafb",
                        borderRadius: "8px",
                        border: `1px solid ${colors.border}`,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: "8px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "12px",
                            fontWeight: "600",
                            color: colors.textPrimary,
                          }}
                        >
                          API URL (Click to copy for badges/README)
                        </div>
                        <button
                          onClick={copyApiUrl}
                          style={{
                            padding: "6px 12px",
                            background: colors.bgCard,
                            border: `1px solid ${colors.borderInput}`,
                            borderRadius: "6px",
                            color: colors.textPrimary,
                            fontSize: "12px",
                            fontWeight: "500",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            transition: "all 0.1s",
                          }}
                        >
                          {copied ? (
                            <Check size={14} color="#16a34a" />
                          ) : (
                            <Copy size={14} color={colors.textPrimary} />
                          )}
                          {copied ? "Copied!" : "Copy"}
                        </button>
                      </div>
                      <div className="api-url-box mono-box"
                        style={{
                          fontSize: "11px",
                          fontFamily: "monospace", // Applied monospace font
                          color: colors.textSecondary,
                          wordBreak: "break-all",
                          background: colors.bgInput,
                          padding: "10px",
                          borderRadius: "6px",
                          border: `1px solid ${colors.borderInput}`,
                        }}>
                        {(() => {
                          let apiUrl = `${API_BASE_URL}/api/framed-avatar/${username}?theme=${selectedTheme}&size=${size}&canvas=${canvas}&shape=${shape}&radius=${finalRadiusForDisplay}&style=${frameStyle}`;
                          if (customAccentColor) {
                            apiUrl += `&accentColor=${encodeURIComponent(customAccentColor)}`;
                          }
                          if (text.trim()) {
                            apiUrl += `&text=${encodeURIComponent(text)}&textColor=${encodeURIComponent(textColor)}&textSize=${textSize}&textPosition=${textPosition}`;
                          }
                          if (emojis.trim()) {
                            apiUrl += `&emojis=${encodeURIComponent(emojis)}&emojiSize=${emojiSize}&emojiPosition=${emojiPosition}`;
                          }
                          return apiUrl;
                        })()}
                      </div>
                    </div>

                    {/* Badge Generator Section */}
                    <div
                      style={{
                        padding: "16px",
                        background: isDark ? "#334155" : "#f9fafb",
                        borderRadius: "8px",
                        border: `1px solid ${colors.border}`,
                        marginTop: "16px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: "8px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "12px",
                            fontWeight: "600",
                            color: colors.textPrimary,
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <Award size={16} />
                          Badge Generator
                        </div>
                        <button
                          onClick={copyBadgeMarkdown}
                          style={{
                            padding: "6px 12px",
                            background: colors.bgCard,
                            border: `1px solid ${colors.borderInput}`,
                            borderRadius: "6px",
                            color: colors.textPrimary,
                            fontSize: "12px",
                            fontWeight: "500",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            transition: "all 0.1s",
                          }}
                        >
                          {badgeCopied ? (
                            <Check size={14} color="#16a34a" />
                          ) : (
                            <Copy size={14} color={colors.textPrimary} />
                          )}
                          {badgeCopied ? "Copied!" : "Copy Markdown"}
                        </button>
                      </div>
                      <div style={{ display: "flex", gap: "12px",flexDirection: "column", marginBottom: "12px" }}>
                        <input
                          type="text"
                          placeholder="Badge label"
                          value={badgeLabel}
                          onChange={(e) => setBadgeLabel(e.target.value)}
                          style={{
                            flex: 1,
                            padding: "8px 10px",
                            borderRadius: "6px",
                            border: `1px solid ${colors.borderInput}`,
                            background: colors.bgInput,
                            color: colors.textPrimary,
                            fontSize: "12px",
                            outline: "none",
                          }}
                        />
                        <input
                          type="color"
                          value={badgeColor}
                          onChange={(e) => setBadgeColor(e.target.value)}
                          style={{
                            width: "50px",
                            height: "36px",
                            borderRadius: "6px",
                            border: `1px solid ${colors.borderInput}`,
                            cursor: "pointer",
                          }}
                        />
                        <select
                          value={badgeStyle}
                          onChange={(e) => setBadgeStyle(e.target.value)}
                          style={{
                            padding: "8px 10px",
                            borderRadius: "6px",
                            border: `1px solid ${colors.borderInput}`,
                            background: colors.bgInput,
                            color: colors.textPrimary,
                            fontSize: "12px",
                            outline: "none",
                            cursor: "pointer",
                          }}
                        >
                          <option value="flat">Flat</option>
                          <option value="plastic">Plastic</option>
                          <option value="flat-square">Flat Square</option>
                          <option value="for-the-badge">For The Badge</option>
                          <option value="social">Social</option>
                        </select>
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          fontFamily: "monospace",
                          color: colors.textSecondary,
                          wordBreak: "break-all",
                          background: colors.bgInput,
                          padding: "10px",
                          borderRadius: "6px",
                          border: `1px solid ${colors.borderInput}`,
                        }}
                      >
                        {`[![${badgeLabel}](https://img.shields.io/badge/${encodeURIComponent(badgeLabel)}-${badgeColor.replace('#', '')}?style=${badgeStyle})](${framedAvatarUrl})`}
                      </div>
                    </div>
                  </div>
                </div>
              ) : username.trim() ? (
                <div style={{ textAlign: "center", width: "100%" }}>
                  {previewLoading && (
                    <div style={{ marginBottom: "16px" }}>
                      <Loader2
                        size={32}
                        color={colors.accentPrimary}
                        className='spinner'
                      />
                      <p
                        style={{
                          color: colors.textSecondary,
                          fontSize: "14px",
                          marginTop: "8px",
                        }}>
                        Loading preview...
                      </p>
                    </div>
                  )}
                  <canvas
                    ref={previewCanvasRef}
                    className="preview-canvas"
                    style={{ borderRadius: shape === "circle" ? "50%" : `${finalRadiusForDisplay}px`, border: `3px solid ${isDark ? "#374151" : "white"}` }}
                  />
                  {previewError && (
                    <p
                      style={{
                        color: colors.errorText,
                        fontSize: "14px",
                        marginTop: "8px",
                      }}>
                      {previewError}
                    </p>
                  )}
                </div>
              ) : (
                <div
                  style={{ textAlign: "center", color: colors.textSecondary }}
                >
                  <Frame
                    size={120}
                    color={colors.borderInput}
                    strokeWidth={1.5}
                    style={{ marginBottom: "24px" }}
                  />
                  <p
                    style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      color: colors.textPrimary,
                      marginBottom: "8px",
                    }}
                  >
                    Ready to Create!
                  </p>
                  <p
                    style={{
                      fontSize: "14px",
                      color: colors.textSecondary,
                    }}
                  >
                    Enter a GitHub username and click **Generate** to see your
                    avatar.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Community Modal Injection */}
      <CommunityModal
        isOpen={isCommunityModalOpen}
        onClose={() => setIsCommunityModalOpen(false)}
        colors={colors}
      />

      {/* Share Modal Injection */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        colors={colors}
        shareUrl={framedAvatarUrl}
        username={username}
      />

      {/* Toast Notification */}
      {showToast && (
        <div
          style={{
            position: "fixed",
            top: "24px",
            right: "24px",
            background: colors.bgCard,
            border: `1px solid ${colors.border}`,
            borderRadius: "12px",
            padding: "16px 20px",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
            zIndex: 1001,
            display: "flex",
            alignItems: "center",
            gap: "12px",
            animation: "slideInRight 0.3s ease-out",
            maxWidth: "300px",
          }}>
          <div
            style={{
              background: "linear-gradient(135deg, #7c3aed, #a855f7)",
              borderRadius: "50%",
              width: "24px",
              height: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}>
            <Sparkles size={14} color="white" />
          </div>
          <span
            style={{
              color: colors.textPrimary,
              fontWeight: "600",
              fontSize: "14px",
            }}>
            {toastMessage}
          </span>
        </div>
      )}

      {/* Styles are provided by ./App.css */}
      {/* Community Modal */}
    </div>
  } />
  <Route path="*" element={<NotFound />} />
  </Routes>
  </BrowserRouter>
);
}

export default App;
