import React, { useState, useEffect } from 'react';
import { Frame, Download, AlertCircle, Loader2, Github, Sparkles, Zap, Copy, Check, ChevronRight } from 'lucide-react';

const API_BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://github-avatar-frame-api.onrender.com'
    : 'http://localhost:3000';


function App() {
  const [username, setUsername] = useState('');
  const [themes, setThemes] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState('base');
  const [size, setSize] = useState(384);
  const [loading, setLoading] = useState(false);
  const [themesLoading, setThemesLoading] = useState(true);
  const [error, setError] = useState(null);
  const [framedAvatarUrl, setFramedAvatarUrl] = useState(null);
  const [previewKey, setPreviewKey] = useState(0);
  const [copied, setCopied] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    fetchThemes();
  }, []);

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
      setError('Failed to load themes. Make sure the server is running on port 3000.');
      setThemes([{ theme: 'base', name: 'Base Theme' }]);
    } finally {
      setThemesLoading(false);
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
      const url = `${API_BASE_URL}/api/framed-avatar/${username}?theme=${selectedTheme}&size=${size}`;
      
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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      generateFramedAvatar();
    }
  };

  const downloadImage = () => {
    if (!framedAvatarUrl) return;
    
    const link = document.createElement('a');
    link.href = framedAvatarUrl;
    link.download = `${username}-${selectedTheme}-avatar.png`;
    link.click();
  };

  const tryExample = (exampleUsername) => {
    setUsername(exampleUsername);
    setCurrentStep(2);
  };

  const copyApiUrl = () => {
    const apiUrl = `${API_BASE_URL}/api/framed-avatar/${username}?theme=${selectedTheme}&size=${size}`;
    navigator.clipboard.writeText(apiUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    if (e.target.value.trim()) {
      setCurrentStep(2);
    }
  };

  const handleThemeSelect = (theme) => {
    setSelectedTheme(theme);
    setCurrentStep(3);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e0e7ff 0%, #f3e8ff 50%, #fce7f3 100%)',
      padding: '24px 16px',
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '32px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '8px',
          }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <Frame size={48} color="#7c3aed" strokeWidth={2.5} />
              <Sparkles size={20} color="#a855f7" className="pulse-icon" style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
              }} />
            </div>
            <h1 style={{
              fontSize: '48px',
              fontWeight: '900',
              background: 'linear-gradient(to right, #7c3aed, #a855f7, #ec4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              margin: 0,
            }}>
              GitHub Avatar Frames
            </h1>
          </div>
          <p style={{
            color: '#374151',
            fontSize: '16px',
            margin: '0',
          }}>
            Create stunning framed avatars for your GitHub profile in seconds
          </p>
        </div>

        {/* Progress Steps */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid #e5e7eb',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              {[
                { num: 1, label: 'Enter Username', icon: Github },
                { num: 2, label: 'Choose Theme', icon: Sparkles },
                { num: 3, label: 'Adjust Size', icon: Zap },
                { num: 4, label: 'Generate', icon: Frame }
              ].map((step, idx) => (
                <React.Fragment key={step.num}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    flex: 1,
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
                      ...(currentStep >= step.num ? {
                        background: 'white',
                        color: '#111827',
                        border: '2px solid #111827',
                      } : {
                        background: '#f3f4f6',
                        color: '#9ca3af',
                        border: '2px solid #e5e7eb',
                      })
                    }}>
                      <step.icon size={20} />
                    </div>
                    <div style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      textAlign: 'center',
                      color: currentStep >= step.num ? '#111827' : '#9ca3af',
                    }}>
                      {step.label}
                    </div>
                  </div>
                  {idx < 3 && (
                    <ChevronRight size={20} color={currentStep > step.num ? '#111827' : '#d1d5db'} style={{
                      marginTop: '-32px',
                      flexShrink: 0,
                    }} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '24px',
        }}>
          {/* Configuration Panel */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            padding: '32px',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '24px',
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                padding: '10px',
                borderRadius: '8px',
              }}>
                <Github size={20} color="white" />
              </div>
              <h2 style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#111827',
                margin: 0,
              }}>Configure Avatar</h2>
            </div>

            {/* Username Input */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '8px',
              }}>GitHub Username</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={username}
                  onChange={handleUsernameChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter username..."
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 44px',
                    fontSize: '16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    outline: 'none',
                    transition: 'all 0.2s',
                    color: '#111827',
                    boxSizing: 'border-box',
                  }}
                />
                <Github size={20} color="#9ca3af" style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                }} />
              </div>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                marginTop: '12px',
              }}>
                {['octocat'].map((example) => (
                  <button
                    key={example}
                    onClick={() => tryExample(example)}
                    style={{
                      padding: '6px 12px',
                      background: 'white',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      color: '#374151',
                      fontWeight: '500',
                      fontSize: '14px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f9fafb';
                      e.currentTarget.style.borderColor = '#9ca3af';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'white';
                      e.currentTarget.style.borderColor = '#d1d5db';
                    }}
                  >
                    Try: {example}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Selection */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '8px',
              }}>Frame Theme</label>
              {themesLoading ? (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  padding: '32px 0',
                }}>
                  <Loader2 size={32} color="#7c3aed" className="spinner" />
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr',
                  gap: '12px',
                }}>
                  {themes.map((theme) => (
                    <button
                      key={theme.theme}
                      onClick={() => handleThemeSelect(theme.theme)}
                      style={{
                        padding: '16px',
                        borderRadius: '8px',
                        border: '2px solid',
                        borderColor: selectedTheme === theme.theme ? '#7c3aed' : '#e5e7eb',
                        background: selectedTheme === theme.theme ? '#f5f3ff' : 'white',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        textAlign: 'left',
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: theme.description ? '4px' : '0',
                      }}>
                        {selectedTheme === theme.theme && <Zap size={18} color="#7c3aed" fill="#7c3aed" />}
                        <span style={{
                          fontWeight: '600',
                          fontSize: '15px',
                          color: '#111827',
                          textTransform: 'capitalize',
                        }}>{theme.name || theme.theme}</span>
                      </div>
                      {theme.description && (
                        <div style={{
                          fontSize: '13px',
                          color: '#6b7280',
                          marginLeft: selectedTheme === theme.theme ? '26px' : '0',
                        }}>{theme.description}</div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Size Slider */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '8px',
              }}>
                Size: <span style={{ color: '#7c3aed', fontSize: '16px' }}>{size}px</span>
              </label>
              <input
                type="range"
                min="64"
                max="1024"
                step="64"
                value={size}
                onChange={(e) => setSize(parseInt(e.target.value))}
                style={{
                  width: '100%',
                  height: '8px',
                  borderRadius: '4px',
                  background: 'linear-gradient(to right, #a78bfa, #c4b5fd)',
                  outline: 'none',
                  cursor: 'pointer',
                  WebkitAppearance: 'none',
                }}
              />
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '4px',
              }}>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>64px</span>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>1024px</span>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateFramedAvatar}
              disabled={loading || !username.trim()}
              style={{
                width: '100%',
                background: loading || !username.trim() ? '#e5e7eb' : 'linear-gradient(to right, #7c3aed, #a855f7)',
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
              }}
              onMouseEnter={(e) => {
                if (!loading && username.trim()) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
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
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                marginTop: '16px',
              }}>
                <AlertCircle size={18} color="#dc2626" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontSize: '14px', color: '#991b1b' }}>{error}</div>
              </div>
            )}
          </div>

          {/* Preview Panel */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            padding: '32px',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '24px',
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                padding: '10px',
                borderRadius: '8px',
              }}>
                <Frame size={20} color="white" />
              </div>
              <h2 style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#111827',
                margin: 0,
              }}>Preview</h2>
            </div>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '400px',
            }}>
              {loading ? (
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    position: 'relative',
                    display: 'inline-block',
                    marginBottom: '24px',
                  }}>
                    <Loader2 size={64} color="#7c3aed" strokeWidth={2.5} className="spinner" />
                    <Sparkles size={28} color="#a855f7" className="pulse-icon" style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                    }} />
                  </div>
                  <p className="pulse-text" style={{
                    color: '#374151',
                    fontWeight: '600',
                    fontSize: '16px',
                  }}>Creating your framed avatar...</p>
                </div>
              ) : framedAvatarUrl ? (
                <div style={{ textAlign: 'center', width: '100%' }}>
                  <div style={{
                    display: 'inline-block',
                    position: 'relative',
                    marginBottom: '24px',
                  }}>
                    <img
                      key={previewKey}
                      src={framedAvatarUrl}
                      alt="Framed Avatar"
                      style={{
                        borderRadius: '16px',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
                        border: '3px solid white',
                        width: `${Math.min(size, 400)}px`,
                        height: `${Math.min(size, 400)}px`,
                      }}
                    />
                  </div>
                  
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
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      <Download size={20} />
                      Download Image
                    </button>
                    
                    <div style={{
                      padding: '16px',
                      background: '#f9fafb',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
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
                          color: '#374151',
                        }}>API URL</div>
                        <button
                          onClick={copyApiUrl}
                          style={{
                            padding: '6px 12px',
                            background: 'white',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            color: '#374151',
                            fontSize: '12px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          {copied ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
                          {copied ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                      <div style={{
                        fontSize: '11px',
                        fontFamily: 'monospace',
                        color: '#6b7280',
                        wordBreak: 'break-all',
                        background: 'white',
                        padding: '10px',
                        borderRadius: '6px',
                        border: '1px solid #e5e7eb',
                      }}>
                        {`${API_BASE_URL}/api/framed-avatar/${username}?theme=${selectedTheme}&size=${size}`}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', color: '#9ca3af' }}>
                  <div style={{
                    position: 'relative',
                    display: 'inline-block',
                    marginBottom: '24px',
                  }}>
                    <Frame size={120} color="#e5e7eb" strokeWidth={1.5} />
                    <Sparkles size={48} color="#d8b4fe" className="pulse-icon" style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                    }} />
                  </div>
                  <p style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#6b7280',
                    marginBottom: '8px',
                  }}>Ready to Create!</p>
                  <p style={{
                    fontSize: '14px',
                    color: '#9ca3af',
                  }}>Enter a GitHub username and click Generate</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse-anim {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        
        .spinner {
          animation: spin 1s linear infinite;
        }
        
        .pulse-icon {
          animation: pulse-anim 2s infinite;
        }
        
        .pulse-text {
          animation: pulse-anim 2s infinite;
        }
        
        .error-shake {
          animation: shake 0.4s ease-out;
        }
        
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
}

export default App;