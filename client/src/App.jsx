import React, { useState, useEffect, useMemo } from 'react';
import {
  Frame, Download, AlertCircle, Loader2, Github, Sparkles, Zap, Copy, Check,
  ChevronRight, Circle, Square, Sun, Moon, Users, X
} from 'lucide-react';
import './App.css';

// NOTE: Replace with your actual API URL or environment variable
const API_BASE_URL =
    process.env.NODE_ENV === 'production'
    ? 'https://github-avatar-frame-api.onrender.com'
    : 'http://localhost:3000';

// Utility component for consistent button styling (Canvas and Shape)
const ControlButton = ({ onClick, isSelected, children, isDark }) => (
  <button
    onClick={onClick}
    isSelected={isSelected} // Pass isSelected as prop for internal styling
    style={{
      padding: '10px 16px',
      borderRadius: '8px',
      border: '2px solid',
      borderColor: isSelected ? (isDark ? '#a78bfa' : '#7c3aed') : (isDark ? '#374151' : '#e5e7eb'),
      background: isSelected ? (isDark ? '#4c1d95' : '#f5f3ff') : (isDark ? '#1f2937' : 'white'),
      cursor: 'pointer',
      fontWeight: '500',
      fontSize: '15px',
      color: isSelected ? (isDark ? '#e0e7ff' : '#7c3aed') : (isDark ? '#d1d5db' : '#374151'),
      transition: 'all 0.2s',
      flex: 1, // Allow buttons to grow/shrink
      minWidth: '100px', // Min width remains for visual stability
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
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
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: '16px',
                backdropFilter: 'blur(5px)'
            }}
        >
            <div 
                style={{
                    background: colors.bgCard,
                    borderRadius: '16px',
                    padding: '32px',
                    maxWidth: '450px',
                    width: '100%',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    position: 'relative',
                    border: `1px solid ${colors.border}`
                }}
            >
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: colors.textSecondary,
                        transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = colors.textPrimary}
                    onMouseLeave={(e) => e.currentTarget.style.color = colors.textSecondary}
                >
                    <X size={24} />
                </button>

                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <Users size={48} color={colors.accentPrimary} style={{ marginBottom: '12px' }} />
                    <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: colors.textPrimary, margin: 0 }}>
                        Join the Open Community
                    </h3>
                </div>
                
                <p style={{ color: colors.textSecondary, textAlign: 'center', marginBottom: '32px' }}>
                    This is where you'd find hundreds of custom themes, share your creations, and collaborate on new frame designs!
                </p>

                <a
                    href="https://github.com/TechQuanta/github-avatar-frame-api"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onClose}
                    style={{
                        display: 'block',
                        width: '100%',
                        background: 'linear-gradient(to right, #7c3aed, #a855f7)',
                        color: 'white',
                        padding: '14px',
                        borderRadius: '8px',
                        textAlign: 'center',
                        textDecoration: 'none',
                        fontWeight: '600',
                        fontSize: '16px',
                        transition: 'all 0.2s',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = 0.9}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = 1}
                >
                    Visit Community Repository
                </a>
            </div>
        </div>
    );
};

// --- Main App Component ---
function App() {
  const [username, setUsername] = useState('');
  const [themes, setThemes] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState('base');
  const [size, setSize] = useState(384);
  const [canvas, setCanvas] = useState('light');
  const [shape, setShape] = useState('circle');
  const [radius, setRadius] = useState(38);

  const [loading, setLoading] = useState(false);
  const [themesLoading, setThemesLoading] = useState(true);
  const [error, setError] = useState(null);
  const [framedAvatarUrl, setFramedAvatarUrl] = useState(null);
  const [previewKey, setPreviewKey] = useState(0);
  const [copied, setCopied] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isCommunityModalOpen, setIsCommunityModalOpen] = useState(false);
  const [showHome, setShowHome] = useState(true);

  // System Theme State
  const [isDark, setIsDark] = useState(false);

  const maxRadius = useMemo(() => Math.floor(size / 2), [size]);

  // Define dark mode colors based on system preference (Enhanced Dark Theme)
  const colors = useMemo(() => ({
    textPrimary: isDark ? '#e5e7eb' : '#111827',
    textSecondary: isDark ? '#9ca3af' : '#6b7280',
    bgBody: isDark ? '#0F172A' : 'linear-gradient(135deg, #e0e7ff 0%, #f3e8ff 50%, #fce7f3 100%)',
    bgCard: isDark ? '#1E293B' : 'white',
    bgInput: isDark ? '#334155' : 'white',
    border: isDark ? '#374151' : '#e5e7eb',
    borderInput: isDark ? '#475569' : '#d1d5db',
    accentPrimary: '#7c3aed',
    accentSecondary: '#a855f7',
    accentDark: '#a78bfa',
    errorBg: isDark ? '#450a0a' : '#fef2f2',
    errorBorder: isDark ? '#b91c1c' : '#fecaca',
    errorText: isDark ? '#fca5a5' : '#991b1b',
  }), [isDark]);

  // Progress Steps definition (using requested labels)
  const steps = [
    { num: 1, label: '▀▄▀▄ Enter Username ▄▀▄▀', icon: Github },
    { num: 2, label: '☆ ☆ 𝙲𝚑𝚘𝚘𝚜𝚎 𝚃𝚑𝚎𝚖𝚎 ☆ ☆', icon: Sparkles },
    { num: 3, label: '🇦​🇩​🇯​🇺​🇸​🇹​ 🇸​🇪​🇹​🇹​🇮​🇳​🇬​🇸​', icon: Zap },
    { num: 4, label: '▄︻┻ Generate ︻┳═─-', icon: Frame },
  ];

  // Detect system preference and set up listener
  useEffect(() => {
    const checkDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(checkDark);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => setIsDark(e.matches);

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    fetchThemes();
    if (shape === 'circle') {
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
        throw new Error('Failed to fetch themes');
      }

      const data = await response.json();
      setThemes(data);

      if (data.length > 0 && !selectedTheme) {
        setSelectedTheme(data[0].theme);
      }
    } catch (err) {
      console.error('Error fetching themes:', err);
      setError('Failed to load themes. Check API server.');
      setThemes([{ theme: 'base', name: 'Base Theme' }, { theme: 'minimal', name: 'Minimal' }, { theme: 'neon', name: 'Neon Glow' }]); 
    } finally {
      setThemesLoading(false);
    }
  };

  const downloadImage = () => {
    if (framedAvatarUrl) {
        const link = document.createElement('a');
        link.href = framedAvatarUrl;
        link.download = `github-avatar-frame-${username}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  };

  const copyApiUrl = () => {
    const apiUrl = `${API_BASE_URL}/api/framed-avatar/${username}?theme=${selectedTheme}&size=${size}&canvas=${canvas}&shape=${shape}&radius=${finalRadiusForDisplay}`;
    try {
      // Use document.execCommand('copy') for better compatibility in iframe environments
      const tempInput = document.createElement('textarea');
      tempInput.value = apiUrl;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      // Fallback message if copying fails
    }
  };

  const generateFramedAvatar = async () => {
    if (!username.trim()) {
      setError('Please enter a GitHub username');
      return;
    }

    setLoading(true);
    setError(null);
    setFramedAvatarUrl(null);
    setCurrentStep(4);

    try {
      const finalRadius = shape === 'circle' ? maxRadius : radius;

      const url = `${API_BASE_URL}/api/framed-avatar/${username}?theme=${selectedTheme}&size=${size}&canvas=${canvas}&shape=${shape}&radius=${finalRadius}`;

      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Failed to generate framed avatar');
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setFramedAvatarUrl(imageUrl);
      setPreviewKey(prev => prev + 1);

    } catch (err) {
      console.error('Error generating avatar:', err);
      setError(err.message || 'Failed to generate framed avatar');
    } finally {
      setLoading(false);
    }
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    if (e.target.value.trim()) {
      setCurrentStep(2); 
    } else {
        setCurrentStep(1);
    }
  };

  const handleThemeSelect = (theme) => {
    setSelectedTheme(theme);
    setCurrentStep(3); 
  };

  const finalRadiusForDisplay = shape === 'circle' ? maxRadius : radius;

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.bgBody,
      padding: '24px 16px',
      color: colors.textPrimary,
      '--accent-bg': isDark ? colors.accentDark : `linear-gradient(135deg, ${colors.accentPrimary} 0%, ${colors.accentSecondary} 100%)`,
      '--scroll-track': isDark ? '#374151' : '#f3f4f6',
      '--accent-primary': colors.accentPrimary,
      '--accent-secondary': colors.accentSecondary,
    }}>
      {showHome ? (
        // --- Home Page ---
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
          textAlign: 'center',
        }}>
          {/* Hero Section */}
          <div style={{ marginBottom: '48px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              marginBottom: '16px',
            }}>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <Frame size={64} color={colors.accentPrimary} strokeWidth={2.5} />
                <Sparkles size={24} color={colors.accentSecondary} className="pulse-icon" style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px',
                }} />
              </div>
              <h1 style={{
                fontSize: '56px',
                fontWeight: '900',
                fontFamily: 'Georgia, Times New Roman, Times, serif',
                fontStyle: 'italic',
                background: 'linear-gradient(to right, #7c3aed, #a855f7, #ec4899)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                margin: 0,
              }}>
                𝕲𝖎𝖙𝕳𝖚𝖇 𝔸𝕧𝕒𝕥𝕒𝕣 𝕱𝖗𝖆𝖒𝖊𝖘
              </h1>
            </div>
            <p style={{
              fontSize: '20px',
              color: colors.textSecondary,
              margin: '0 0 32px 0',
              maxWidth: '600px',
            }}>
              Create stunning, customized framed avatars for your GitHub profile in seconds. Choose from multiple themes, adjust settings, and download instantly.
            </p>
            <button
              onClick={() => setShowHome(false)}
              style={{
                background: 'linear-gradient(to right, #7c3aed, #a855f7)',
                color: 'white',
                padding: '16px 32px',
                borderRadius: '12px',
                border: 'none',
                fontWeight: '700',
                fontSize: '18px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0 8px 16px -4px rgba(0, 0, 0, 0.2)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <Sparkles size={24} />
              Get Started
            </button>
          </div>

          {/* Features Section */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '32px',
            maxWidth: '900px',
            width: '100%',
          }}>
            <div style={{
              background: colors.bgCard,
              borderRadius: '12px',
              padding: '24px',
              border: `1px solid ${colors.border}`,
              textAlign: 'center',
            }}>
              <div style={{
                background: `linear-gradient(135deg, ${colors.accentPrimary} 0%, ${colors.accentSecondary} 100%)`,
                padding: '12px',
                borderRadius: '8px',
                display: 'inline-block',
                marginBottom: '16px',
              }}>
                <Sparkles size={32} color="white" />
              </div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: colors.textPrimary,
                margin: '0 0 8px 0',
              }}>Multiple Themes</h3>
              <p style={{
                fontSize: '14px',
                color: colors.textSecondary,
                margin: 0,
              }}>
                Choose from a variety of beautiful frame themes including classic, neon, starry, and more.
              </p>
            </div>

            <div style={{
              background: colors.bgCard,
              borderRadius: '12px',
              padding: '24px',
              border: `1px solid ${colors.border}`,
              textAlign: 'center',
            }}>
              <div style={{
                background: `linear-gradient(135deg, ${colors.accentSecondary} 0%, #ec4899 100%)`,
                padding: '12px',
                borderRadius: '8px',
                display: 'inline-block',
                marginBottom: '16px',
              }}>
                <Zap size={32} color="white" />
              </div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: colors.textPrimary,
                margin: '0 0 8px 0',
              }}>Customizable Settings</h3>
              <p style={{
                fontSize: '14px',
                color: colors.textSecondary,
                margin: 0,
              }}>
                Adjust size, shape, canvas background, and corner radius to perfectly match your style.
              </p>
            </div>

            <div style={{
              background: colors.bgCard,
              borderRadius: '12px',
              padding: '24px',
              border: `1px solid ${colors.border}`,
              textAlign: 'center',
            }}>
              <div style={{
                background: `linear-gradient(135deg, #16a34a 0%, #059669 100%)`,
                padding: '12px',
                borderRadius: '8px',
                display: 'inline-block',
                marginBottom: '16px',
              }}>
                <Download size={32} color="white" />
              </div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: colors.textPrimary,
                margin: '0 0 8px 0',
              }}>Instant Download</h3>
              <p style={{
                fontSize: '14px',
                color: colors.textSecondary,
                margin: 0,
              }}>
                Generate and download your framed avatar instantly. Also get API URLs for badges and READMEs.
              </p>
            </div>
          </div>

          {/* Why Use Section */}
          <div style={{
            marginTop: '48px',
            maxWidth: '900px',
            width: '100%',
            background: colors.bgCard,
            borderRadius: '12px',
            padding: '32px',
            border: `1px solid ${colors.border}`,
            textAlign: 'center',
          }}>
            <h2 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: colors.textPrimary,
              marginBottom: '24px',
            }}>
              Why Use GitHub Avatar Frames?
            </h2>
            <p style={{
              fontSize: '16px',
              color: colors.textSecondary,
              maxWidth: '700px',
              margin: '0 auto 16px auto',
              lineHeight: '1.6',
            }}>
              Enhance your GitHub profile with unique, customizable avatar frames that make your profile stand out.
            </p>
            <p style={{
              fontSize: '16px',
              color: colors.textSecondary,
              maxWidth: '700px',
              margin: '0 auto 16px auto',
              lineHeight: '1.6',
            }}>
              Easily create and download framed avatars with multiple themes and adjustable settings — no design skills required.
            </p>
            <p style={{
              fontSize: '16px',
              color: colors.textSecondary,
              maxWidth: '700px',
              margin: '0 auto',
              lineHeight: '1.6',
            }}>
              Use the API URLs to embed your framed avatar in READMEs, blogs, or social media for a professional and personalized touch.
            </p>
          </div>

          {/* How to Use Section */}
          <div style={{
            marginTop: '48px',
            maxWidth: '900px',
            width: '100%',
            background: colors.bgCard,
            borderRadius: '12px',
            padding: '32px',
            border: `1px solid ${colors.border}`,
            textAlign: 'center',
          }}>
            <h2 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: colors.textPrimary,
              marginBottom: '24px',
            }}>
              How to Use GitHub Avatar Frames
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '24px',
              maxWidth: '800px',
              margin: '0 auto',
            }}>
              <div style={{
                background: `linear-gradient(135deg, ${colors.accentPrimary} 0%, ${colors.accentSecondary} 100%)`,
                color: 'white',
                borderRadius: '8px',
                padding: '20px',
                textAlign: 'center',
              }}>
                <div style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  marginBottom: '8px',
                }}>1</div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  margin: '0 0 8px 0',
                }}>Enter Username</h3>
                <p style={{
                  fontSize: '14px',
                  margin: 0,
                  lineHeight: '1.5',
                }}>
                  Type your GitHub username to fetch your avatar.
                </p>
              </div>
              <div style={{
                background: `linear-gradient(135deg, ${colors.accentSecondary} 0%, #ec4899 100%)`,
                color: 'white',
                borderRadius: '8px',
                padding: '20px',
                textAlign: 'center',
              }}>
                <div style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  marginBottom: '8px',
                }}>2</div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  margin: '0 0 8px 0',
                }}>Choose Theme</h3>
                <p style={{
                  fontSize: '14px',
                  margin: 0,
                  lineHeight: '1.5',
                }}>
                  Select from multiple beautiful frame themes.
                </p>
              </div>
              <div style={{
                background: `linear-gradient(135deg, #16a34a 0%, #059669 100%)`,
                color: 'white',
                borderRadius: '8px',
                padding: '20px',
                textAlign: 'center',
              }}>
                <div style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  marginBottom: '8px',
                }}>3</div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  margin: '0 0 8px 0',
                }}>Adjust Settings</h3>
                <p style={{
                  fontSize: '14px',
                  margin: 0,
                  lineHeight: '1.5',
                }}>
                  Customize size, shape, canvas, and more.
                </p>
              </div>
              <div style={{
                background: `linear-gradient(135deg, #f59e0b 0%, #d97706 100%)`,
                color: 'white',
                borderRadius: '8px',
                padding: '20px',
                textAlign: 'center',
              }}>
                <div style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  marginBottom: '8px',
                }}>4</div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  margin: '0 0 8px 0',
                }}>Generate & Download</h3>
                <p style={{
                  fontSize: '14px',
                  margin: 0,
                  lineHeight: '1.5',
                }}>
                  Click generate and download your framed avatar.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer style={{
            marginTop: '64px',
            padding: '32px 0',
            borderTop: `1px solid ${colors.border}`,
            textAlign: 'center',
            color: colors.textSecondary,
            fontSize: '14px',
          }}>
            <div style={{
              maxWidth: '900px',
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <Frame size={24} color={colors.accentPrimary} />
                <span style={{
                  fontWeight: 'bold',
                  color: colors.textPrimary,
                }}>GitHub Avatar Frames</span>
              </div>
              <p style={{
                margin: 0,
                lineHeight: '1.5',
              }}>
                Built with ❤️ for the open-source community. Contribute on{' '}
                <a
                  href="https://github.com/TechQuanta/github-avatar-frame-api"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: colors.accentPrimary,
                    textDecoration: 'none',
                  }}
                >
                  GitHub
                </a>.
              </p>
              <div style={{
                display: 'flex',
                gap: '16px',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}>
                <a
                  href="https://github.com/TechQuanta/github-avatar-frame-api"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: colors.textSecondary,
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = colors.accentPrimary}
                  onMouseLeave={(e) => e.currentTarget.style.color = colors.textSecondary}
                >
                  Repository
                </a>
                <a
                  href="https://github.com/TechQuanta/github-avatar-frame-api/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: colors.textSecondary,
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = colors.accentPrimary}
                  onMouseLeave={(e) => e.currentTarget.style.color = colors.textSecondary}
                >
                  Issues
                </a>
                <a
                  href="https://github.com/TechQuanta/github-avatar-frame-api/blob/main/LICENSE"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: colors.textSecondary,
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = colors.accentPrimary}
                  onMouseLeave={(e) => e.currentTarget.style.color = colors.textSecondary}
                >
                  License
                </a>
              </div>
            </div>
          </footer>
        </div>
      ) : (
        // --- Generator Page ---
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}>
        {/* --- 1. Top Bar: Home Button + Title + Community Button --- */}
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '32px',
            flexWrap: 'wrap',
            gap: '16px',
        }} className="header-container">
            {/* Home Button (Top Left) */}
            <button
                onClick={() => setShowHome(true)}
                style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    background: isDark ? '#374151' : '#f0f4f8',
                    border: `2px solid ${isDark ? colors.accentDark : colors.accentPrimary}`,
                    color: isDark ? colors.accentDark : colors.accentPrimary,
                    fontWeight: '800',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = isDark ? '#475569' : colors.accentPrimary;
                    e.currentTarget.style.color = isDark ? 'white' : 'white';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = isDark ? '#374151' : '#f0f4f8';
                    e.currentTarget.style.color = isDark ? colors.accentDark : colors.accentPrimary;
                }}
            >
                <span style={{ fontFamily: 'Times New Roman, serif' }}>𝐇𝐨𝐦𝐞</span>
            </button>

            {/* Center Title Block */}
            <div style={{
                flexGrow: 1,
                textAlign: 'center',
                minWidth: '200px',
                order: 1,
                width: '100%',
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    marginBottom: '8px',
                }}>
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                        <Frame size={48} color={colors.accentPrimary} strokeWidth={2.5} />
                        <Sparkles size={20} color={colors.accentSecondary} className="pulse-icon" style={{
                            position: 'absolute',
                            top: '-4px',
                            right: '-4px',
                        }} />
                    </div>
                    <h1 className="main-title" style={{
                        fontSize: '48px',
                        fontWeight: '900',
                        fontFamily: 'Georgia, Times New Roman, Times, serif',
                        fontStyle: 'italic',
                        background: 'linear-gradient(to right, #7c3aed, #a855f7, #ec4899)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        margin: 0,
                    }}>
                        𝕲𝖎𝖙𝕳𝖚𝖇 𝔸𝕧𝕒𝕥𝕒𝕣 𝕱𝖗𝖆𝖒𝖊𝖘
                    </h1>
                </div>
                <p style={{
                    color: colors.textSecondary,
                    fontSize: '16px',
                    margin: '0',
                }}>
                    ↤↤↤↤↤ 𝐶𝑟𝑒𝑎𝑡𝑒 𝑠𝑡𝑢𝑛𝑛𝑖𝑛𝑔 𝑓𝑟𝑎𝑚𝑒𝑑 𝑎𝑣𝑎𝑡𝑎𝑟𝑠 𝑓𝑜𝑟 𝑦𝑜𝑢𝑟 𝐺𝑖𝑡𝐻𝑢𝑏 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑖𝑛 𝑠𝑒𝑐𝑜𝑛𝑑𝑠 ↦↦↦↦↦
                </p>
            </div>

            {/* Open Community Button (Top Right) */}
            <button
                onClick={() => setIsCommunityModalOpen(true)}
                className="community-button"
                style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    background: isDark ? '#374151' : '#f0f4f8',
                    border: `2px solid ${isDark ? colors.accentDark : colors.accentPrimary}`,
                    color: isDark ? colors.accentDark : colors.accentPrimary,
                    fontWeight: '800',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = isDark ? '#475569' : colors.accentPrimary;
                    e.currentTarget.style.color = isDark ? 'white' : 'white';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = isDark ? '#374151' : '#f0f4f8';
                    e.currentTarget.style.color = isDark ? colors.accentDark : colors.accentPrimary;
                }}
            >
                <Users size={20} />
                <span style={{ fontFamily: 'Times New Roman, serif' }}>𝕆𝕡𝕖𝕟 ℂ𝕠𝕞𝕞𝕦𝕟𝕚𝕥𝕪</span>
            </button>
        </div>

        {/* --- 2. Progress Steps --- */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            background: colors.bgCard,
            borderRadius: '12px',
            padding: '20px',
            border: `1px solid ${colors.border}`,
            maxWidth: '100%',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
            }}>
              {steps.map((step, idx) => {
                const isActive = currentStep >= step.num;
                const Icon = step.icon;

                const activeBg = isDark ? '#d1d5db' : colors.bgCard;
                const activeBorder = isDark ? '#d1d5db' : '#111827';
                const inactiveBg = isDark ? '#374151' : '#f3f4f6';
                const inactiveBorder = isDark ? '#4b5563' : '#e5e7eb';
                const activeColor = isDark ? '#111827' : '#111827';
                const inactiveColor = isDark ? '#9ca3af' : '#9ca3af';

                return (
                  <React.Fragment key={step.num}>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      flex: 1,
                      minWidth: '20%',
                    }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '8px',
                        transition: 'all 0.3s',
                        background: isActive ? activeBg : inactiveBg,
                        color: isActive ? activeColor : inactiveColor,
                        border: `2px solid ${isActive ? activeBorder : inactiveBorder}`,
                      }}>
                        <Icon size={20} />
                      </div>
                      <div style={{
                        fontSize: '12px',
                        fontWeight: '600',
                        textAlign: 'center',
                        color: isActive ? colors.textPrimary : colors.textSecondary,
                      }}>
                        {step.label}
                      </div>
                    </div>
                    {idx < steps.length - 1 && (
                      <ChevronRight size={20} color={currentStep > step.num ? colors.textPrimary : colors.borderInput} style={{
                        marginTop: '-32px',
                        flexShrink: 0,
                      }} />
                    )}
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
            display: 'grid',
            gap: '24px',
          }}
        >
          {/* Left: Configuration Panel (50%) */}
          <div style={{
            background: colors.bgCard,
            borderRadius: '12px',
            border: `1px solid ${colors.border}`,
            padding: '32px',
            maxWidth: '100%',
            minWidth: '0', /* Critical for layout flexibility */
          }}>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '24px',
            }}>
              <div style={{
                background: `linear-gradient(135deg, ${colors.accentPrimary} 0%, ${colors.accentSecondary} 100%)`,
                padding: '10px',
                borderRadius: '8px',
              }}>
                <Github size={20} color="white" />
              </div>
              <h2 style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: colors.textPrimary,
                margin: 0,
              }}>Configuration & Params</h2>
            </div>

            {/* Username Input (Monospace Font Applied Here) */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: colors.textPrimary,
                marginBottom: '8px',
              }}>GitHub Username</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={username}
                  onChange={handleUsernameChange}
                  placeholder="Enter username (e.g., torvalds)"
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 44px',
                    fontSize: '16px',
                    border: `1px solid ${colors.borderInput}`,
                    borderRadius: '8px',
                    outline: 'none',
                    transition: 'all 0.2s',
                    color: colors.textPrimary,
                    background: colors.bgInput,
                    boxSizing: 'border-box',
                    fontFamily: 'monospace', // Applied monospace font
                  }}
                />
                <Github size={20} color={colors.textSecondary} style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                }} />
              </div>
            </div>

            {/* Theme Selection (Small and Scrollable) */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: colors.textPrimary,
                marginBottom: '8px',
              }}>Frame Theme ({themes.length} available)</label>
              {themesLoading ? (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  padding: '32px 0',
                }}>
                  <Loader2 size={32} color={colors.accentPrimary} className="spinner" />
                </div>
              ) : (
                <div 
                  className="themes-scroll-container"
                  style={{
                    display: 'flex',
                    gap: '8px',
                    overflowX: 'scroll', 
                    paddingBottom: '12px', 
                    whiteSpace: 'nowrap', 
                  }}
                >
                  {themes.map((theme) => (
                    <button
                      key={theme.theme}
                      onClick={() => handleThemeSelect(theme.theme)}
                      style={{
                        padding: '8px 12px',
                        minWidth: '100px', 
                        flexShrink: 0, 
                        borderRadius: '8px',
                        border: '2px solid',
                        borderColor: selectedTheme === theme.theme ? colors.accentPrimary : colors.border,
                        background: selectedTheme === theme.theme ? (isDark ? '#4c1d95' : '#f5f3ff') : colors.bgCard,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        textAlign: 'center',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                      }}
                    >
                      {selectedTheme === theme.theme && <Zap size={14} color={colors.accentPrimary} fill={colors.accentPrimary} />}
                      <span style={{
                        fontWeight: '600',
                        fontSize: '13px', 
                        color: colors.textPrimary,
                        textTransform: 'capitalize',
                      }}>{theme.name || theme.theme}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Control Group: Canvas & Shape */}
            <div className="control-group" style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
              <div style={{ flex: 1 }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: colors.textPrimary,
                  marginBottom: '8px',
                }}>Background Canvas (Param: `canvas`)</label>
                <div className="control-button-set" style={{ display: 'flex', gap: '12px' }}>
                  <ControlButton onClick={() => setCanvas('light')} isSelected={canvas === 'light'} isDark={isDark}>
                    <Sun size={18} /> Light
                  </ControlButton>
                  <ControlButton onClick={() => setCanvas('dark')} isSelected={canvas === 'dark'} isDark={isDark}>
                    <Moon size={18} /> Dark
                  </ControlButton>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: colors.textPrimary,
                  marginBottom: '8px',
                }}>Avatar Shape (Param: `shape`)</label>
                <div className="control-button-set" style={{ display: 'flex', gap: '12px' }}>
                  <ControlButton onClick={() => setShape('circle')} isSelected={shape === 'circle'} isDark={isDark}>
                    <Circle size={18} /> Circle
                  </ControlButton>
                  <ControlButton onClick={() => setShape('rect')} isSelected={shape === 'rect'} isDark={isDark}>
                    <Square size={18} /> Square
                  </ControlButton>
                </div>
              </div>
            </div>

            {/* Size Slider */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: colors.textPrimary,
                marginBottom: '8px',
              }}>
                Size (Param: `size`): <span style={{ color: colors.accentPrimary, fontSize: '16px' }}>{size}px</span>
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
                  width: '100%',
                  height: '8px',
                  borderRadius: '4px',
                  background: isDark ? '#374151' : 'linear-gradient(to right, #a78bfa, #c4b5fd)',
                  outline: 'none',
                  cursor: 'pointer',
                  WebkitAppearance: 'none',
                }}
              />
            </div>

            {/* Radius Slider (Conditional) */}
            {shape === 'rect' && (
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: colors.textPrimary,
                  marginBottom: '8px',
                }}>
                  Corner Radius (Param: `radius`): <span style={{ color: colors.accentPrimary, fontSize: '16px' }}>{finalRadiusForDisplay}px</span>
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
                    width: '100%',
                    height: '8px',
                    borderRadius: '4px',
                    background: isDark ? '#374151' : 'linear-gradient(to right, #a78bfa, #c4b5fd)',
                    outline: 'none',
                    cursor: 'pointer',
                    WebkitAppearance: 'none',
                  }}
                />
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={generateFramedAvatar}
              disabled={loading || !username.trim()}
              style={{
                width: '100%',
                background: loading || !username.trim() ? colors.border : 'linear-gradient(to right, #7c3aed, #a855f7)',
                color: 'white',
                padding: '14px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: '600',
                fontSize: '16px',
                cursor: loading || !username.trim() ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
              }}
              onMouseEnter={(e) => {
                if (!loading && username.trim()) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 12px -2px rgba(0, 0, 0, 0.2)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)';
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
              <div className="error-shake" style={{
                padding: '12px',
                background: colors.errorBg,
                border: `1px solid ${colors.errorBorder}`,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                marginTop: '16px',
              }}>
                <AlertCircle size={18} color="#dc2626" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontSize: '14px', color: colors.errorText }}>{error}</div>
              </div>
            )}
          </div>

          {/* Right: Preview Panel (50%) */}
          <div style={{
            background: colors.bgCard,
            borderRadius: '12px',
            border: `1px solid ${colors.border}`,
            padding: '32px',
            maxWidth: '100%',
            minWidth: '0', /* Critical for layout flexibility */
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '24px',
            }}>
              <div style={{
                background: `linear-gradient(135deg, ${colors.accentSecondary} 0%, #ec4899 100%)`,
                padding: '10px',
                borderRadius: '8px',
              }}>
                <Frame size={20} color="white" />
              </div>
              <h2 style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: colors.textPrimary,
                margin: 0,
              }}>Preview & Download</h2>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '400px',
            }}>
              {/* Preview Logic (Conditional) */}
              {loading ? (
                <div style={{ textAlign: 'center' }}>
                  <Loader2 size={64} color={colors.accentPrimary} strokeWidth={2.5} className="spinner" />
                  <p className="pulse-text" style={{ color: colors.textSecondary, fontWeight: '600', fontSize: '16px', marginTop: '16px' }}>Creating your framed avatar...</p>
                </div>
              ) : framedAvatarUrl ? (
                <div style={{ textAlign: 'center', width: '100%' }}>
                  {/* AVATAR IMAGE: Responsive Scaling Fix Applied Here */}
                  <img
                    key={previewKey}
                    src={framedAvatarUrl}
                    alt="Framed Avatar"
                    style={{
                      borderRadius: shape === 'circle' ? '50%' : `${finalRadiusForDisplay}px`,
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
                      border: `3px solid ${isDark ? '#374151' : 'white'}`,
                      width: '100%', // Take full width of its parent container
                      height: 'auto', // Ensure aspect ratio is maintained
                      maxWidth: '384px', // Respect the max size for larger screens
                      maxHeight: '384px',
                      marginBottom: '24px',
                    }}
                  />

                  <div style={{
                    width: '100%',
                    maxWidth: '400px',
                    margin: '0 auto',
                  }}>
                    <button
                      onClick={downloadImage}
                      style={{
                        width: '100%',
                        background: 'linear-gradient(to right, #16a34a, #059669)',
                        color: 'white',
                        padding: '14px',
                        borderRadius: '8px',
                        border: 'none',
                        fontWeight: '600',
                        fontSize: '16px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        marginBottom: '12px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      <Download size={20} />
                      Download Image
                    </button>

                    {/* API URL Section (Monospace Font Applied Here) */}
                    <div style={{
                      padding: '16px',
                      background: isDark ? '#334155' : '#f9fafb',
                      borderRadius: '8px',
                      border: `1px solid ${colors.border}`,
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '8px',
                      }}>
                        <div style={{
                          fontSize: '12px',
                          fontWeight: '600',
                          color: colors.textPrimary,
                        }}>API URL (Click to copy for badges/README)</div>
                        <button
                          onClick={copyApiUrl}
                          style={{
                            padding: '6px 12px',
                            background: colors.bgCard,
                            border: `1px solid ${colors.borderInput}`,
                            borderRadius: '6px',
                            color: colors.textPrimary,
                            fontSize: '12px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'all 0.1s',
                          }}
                        >
                          {copied ? <Check size={14} color="#16a34a" /> : <Copy size={14} color={colors.textPrimary} />}
                          {copied ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                      <div style={{
                        fontSize: '11px',
                        fontFamily: 'monospace', // Applied monospace font
                        color: colors.textSecondary,
                        wordBreak: 'break-all',
                        background: colors.bgInput,
                        padding: '10px',
                        borderRadius: '6px',
                        border: `1px solid ${colors.borderInput}`,
                      }}>
                        {`${API_BASE_URL}/api/framed-avatar/${username}?theme=${selectedTheme}&size=${size}&canvas=${canvas}&shape=${shape}&radius=${finalRadiusForDisplay}`}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', color: colors.textSecondary }}>
                  <Frame size={120} color={colors.borderInput} strokeWidth={1.5} style={{ marginBottom: '24px' }} />
                  <p style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: colors.textPrimary,
                    marginBottom: '8px',
                  }}>Ready to Create!</p>
                  <p style={{
                    fontSize: '14px',
                    color: colors.textSecondary,
                  }}>Enter a GitHub username and click **Generate** to see your avatar.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      )}

      {/* Community Modal */}
    </div>
  );
}

export default App;
