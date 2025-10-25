# Custom Accent Color Picker & Random Theme Generator

## Overview
This document describes the new personalization features added to the GitHub Avatar Frame API project.

## Features Added

### 1. Custom Accent Color Picker 🎨
- **Location**: Added below the theme selection area in the "Customization & Discovery" section
- **Functionality**: 
  - Color picker input for selecting custom accent colors
  - Quick color presets with 6 popular colors
  - Reset button to restore default theme colors
  - Real-time preview with CSS variables
- **API Integration**: Custom colors are passed via `accentColor` parameter to the backend
- **Backend Processing**: Uses Sharp.js to apply color tinting and modulation to frames

### 2. Random Theme Generator 🎲
- **Location**: Next to the color picker in the "Customization & Discovery" section
- **Functionality**:
  - Randomly selects one of the available themes
  - 30% chance to also randomize accent color for extra variety
  - Toast notifications for user feedback
  - Disabled state when no themes are available
- **User Experience**: 
  - "✨ Surprise Style Loaded!" for theme-only randomization
  - "🎲 Random Theme + Color Applied!" when both theme and color are randomized

### 3. Toast Notification System
- **Design**: Slide-in animation from the right
- **Duration**: 3 seconds auto-dismiss
- **Styling**: Matches the app's design system with proper dark/light mode support
- **Usage**: Provides feedback for random theme selection and color reset actions

## Technical Implementation

### Frontend (React)
- Added state management for `customAccentColor`, `originalThemeColor`, and toast notifications
- Updated API URL generation to include accent color parameter
- Enhanced UI with responsive design for mobile and desktop
- Added CSS animations for toast notifications

### Backend (Node.js/Sharp.js)
- Added `accentColor` query parameter handling
- Implemented color processing using Sharp.js:
  - Hex to RGB conversion
  - Color tinting with custom colors
  - Brightness and saturation modulation for better visual results

### API Endpoints
- Updated `/api/framed-avatar/{username}` to accept `accentColor` parameter
- Example: `?theme=minimal&accentColor=%23ff6b6b&size=256`

## System Architecture Flow

```
User Interface
├── Theme Selection (existing)
├── Custom Color Picker (new)
│   ├── Color Input Field
│   ├── Quick Color Presets
│   └── Reset Button
├── Random Theme Generator (new)
│   ├── Random Theme Selection
│   └── Optional Random Color (30% chance)
└── Toast Notifications (new)

API Request
├── theme: selected theme
├── accentColor: custom color (optional)
├── size, canvas, shape, radius (existing)
└── style (existing)

Backend Processing
├── Fetch GitHub Avatar
├── Load Theme Frame
├── Apply Custom Color Tint (if provided)
│   ├── Convert hex to RGB
│   ├── Apply color modulation
│   └── Enhance brightness/saturation
└── Composite Final Image

Response
└── Framed Avatar with Custom Colors
```

## User Experience Enhancements

### Quick Color Presets
Six predefined colors for easy selection:
- Purple: `#7c3aed`
- Pink: `#ec4899` 
- Orange: `#f97316`
- Green: `#10b981`
- Blue: `#3b82f6`
- Violet: `#8b5cf6`

### Responsive Design
- Color picker and controls adapt to mobile screens
- Proper spacing and alignment across different screen sizes
- Touch-friendly button sizes

### Accessibility
- Proper ARIA labels and tooltips
- Keyboard navigation support
- Color contrast compliance

## Future Enhancements
- Save custom color combinations
- Export/import color themes
- Color history for recently used colors
- Advanced color picker with HSL/HSV support
- Theme preview with custom colors before generation

## Usage Examples

### Basic Custom Color
1. Select a theme (e.g., "minimal")
2. Click the color picker and choose a custom color
3. Generate the avatar with the custom accent color

### Quick Color Selection
1. Use the quick color presets for instant color changes
2. Colors are applied immediately without opening the color picker

### Random Theme Discovery
1. Click "🎲 Random Theme" to discover new themes
2. Sometimes includes random accent colors for extra variety
3. Toast notification confirms the selection

### Reset to Default
1. When a custom color is selected, a "↻ Reset" button appears
2. Click to restore the original theme colors
3. Toast notification confirms the reset
