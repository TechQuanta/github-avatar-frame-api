import express, { Request, Response } from "express";
import axios from "axios";
import sharp from "sharp";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const app = express();

app.use(cors());


// Use environment PORT for hosting environments like Render, default to 3000 for local dev
const PORT = process.env.PORT || 3000;

// Helper to determine the base directory for assets, reliable across compilation (dist)
// Assumes 'public' is located one level up from the compiled script location.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ASSET_BASE_PATH = path.join(__dirname, "..");

//serve static files 
app.use(express.static(path.join(ASSET_BASE_PATH,"public")));

// Helper function to create text overlay
async function createTextOverlay(text: string, textColor: string, textSize: number, textPosition: string, canvasSize: number): Promise<Buffer | null> {
  if (!text || text.trim() === "") return null;
  
  // Create SVG for text overlay
  const svg = `
    <svg width="${canvasSize}" height="${canvasSize}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="textShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="1" dy="1" stdDeviation="1" flood-color="rgba(0,0,0,0.5)"/>
        </filter>
      </defs>
      <text 
        x="50%" 
        y="${textPosition === 'top' ? textSize + 10 : textPosition === 'bottom' ? canvasSize - 10 : canvasSize / 2 + textSize / 2}" 
        text-anchor="middle" 
        dominant-baseline="${textPosition === 'top' ? 'hanging' : textPosition === 'bottom' ? 'baseline' : 'middle'}"
        font-family="Arial, sans-serif" 
        font-size="${textSize}" 
        font-weight="bold"
        fill="${textColor}"
        filter="url(#textShadow)"
      >
        ${text}
      </text>
    </svg>
  `;
  
  return Buffer.from(svg);
}

// Helper function to create emoji overlay
async function createEmojiOverlay(emojis: string, emojiSize: number, emojiPosition: string, canvasSize: number): Promise<Buffer | null> {
  if (!emojis || emojis.trim() === "") return null;
  
  const emojiList = emojis.split(',').map(e => e.trim()).filter(e => e.length > 0);
  if (emojiList.length === 0) return null;
  
  let emojiElements = '';
  const spacing = emojiSize + 10;
  
  if (emojiPosition === 'corners' && emojiList.length >= 4) {
    // Place emojis in corners
    const positions = [
      { x: emojiSize/2 + 5, y: emojiSize/2 + 5 }, // top-left
      { x: canvasSize - emojiSize/2 - 5, y: emojiSize/2 + 5 }, // top-right
      { x: emojiSize/2 + 5, y: canvasSize - emojiSize/2 - 5 }, // bottom-left
      { x: canvasSize - emojiSize/2 - 5, y: canvasSize - emojiSize/2 - 5 } // bottom-right
    ];
    
    emojiList.slice(0, 4).forEach((emoji, index) => {
      emojiElements += `
        <text 
          x="${positions[index].x}" 
          y="${positions[index].y}" 
          text-anchor="middle" 
          dominant-baseline="middle"
          font-size="${emojiSize}"
        >
          ${emoji}
        </text>
      `;
    });
  } else {
    // Place emojis in a row at top or bottom
    const y = emojiPosition === 'top' ? emojiSize + 5 : canvasSize - 5;
    const totalWidth = emojiList.length * spacing;
    const startX = (canvasSize - totalWidth) / 2 + emojiSize / 2;
    
    emojiList.forEach((emoji, index) => {
      const x = startX + index * spacing;
      emojiElements += `
        <text 
          x="${x}" 
          y="${y}" 
          text-anchor="middle" 
          dominant-baseline="middle"
          font-size="${emojiSize}"
        >
          ${emoji}
        </text>
      `;
    });
  }
  
  const svg = `
    <svg width="${canvasSize}" height="${canvasSize}" xmlns="http://www.w3.org/2000/svg">
      ${emojiElements}
    </svg>
  `;
  
  return Buffer.from(svg);
}
/**
 * GET /api/framed-avatar/:username
 * Example: /api/framed-avatar/octocat?theme=base&size=256&accentColor=%23ff6b6b
 * Parameters:
 * - username: GitHub username (required)
 * - theme: Frame theme (default: "base")
 * - size: Image size 64-1024 (default: 256)
 * - shape: "circle", "rounded", or "rect" (default: "circle")
 * - radius: Corner radius for rounded/rect shapes
 * - canvas: "light", "dark", or "transparent" (default: "light")
 * - accentColor: Custom color for frame tinting (hex format, e.g., "#ff6b6b")
 * - text: Custom text to display (e.g., "Darshan Parmar")
 * - textColor: Color of text in HEX or keyword (default: #ffffff)
 * - textSize: Size of text in pixels (default: 20)
 * - textPosition: Position of text — top | bottom | center (default: bottom)
 * - emojis: Comma-separated list of emojis (e.g., 🚀,💻,🔥)
 * - emojiSize: Size of emojis in pixels (default: 40)
 * - emojiPosition: Position of emojis — top | bottom | corners (default: top)
 */
app.get("/api/framed-avatar/:username", async (req: Request, res: Response) => {
  try {
    const username = req.params.username;
    const theme = (req.query.theme as string) || "base";
    const sizeStr = (req.query.size as string) ?? "256";
    const shape = ((req.query.shape as string) || "circle").toLowerCase();
    const radiusStr = req.query.radius as string | undefined;
    const canvasParam = (req.query.canvas as string)?.toLowerCase() || "light"; // "dark" or "light"
    const accentColor = req.query.accentColor as string | undefined;
    
    // Text overlay parameters
    const text = req.query.text as string | undefined;
    const textColor = (req.query.textColor as string) || "#ffffff";
    const textSizeStr = (req.query.textSize as string) || "20";
    const textPosition = ((req.query.textPosition as string) || "bottom").toLowerCase();
    
    // Emoji overlay parameters
    const emojis = req.query.emojis as string | undefined;
    const emojiSizeStr = (req.query.emojiSize as string) || "40";
    const emojiPosition = ((req.query.emojiPosition as string) || "top").toLowerCase();

    // Validate username
    if (!username || typeof username !== "string" || username.trim() === "") {
      return res
        .status(400)
        .json({ error: "Bad Request", message: "Username is required." });
    }

    // Validate theme
    if (!theme || typeof theme !== "string" || theme.trim() === "") {
      return res
        .status(400)
        .json({ error: "Bad Request", message: "Theme is required." });
    }

    // Validate size parameter
    if (!/^\d+$/.test(sizeStr)) {
      return res.status(400).json({
        error: "Bad Request",
        message: "The 'size' parameter must be a valid integer.",
      });
    }

    const size = Math.max(64, Math.min(parseInt(sizeStr, 10), 1024));

    // Validate shape parameter
    if (!["circle", "rounded", "rect"].includes(shape)) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Shape must be 'circle', 'rounded', or 'rect'.",
      });
    }

    // Validate text parameters
    const textSize = Math.max(8, Math.min(parseInt(textSizeStr, 10), 100));
    if (!["top", "bottom", "center"].includes(textPosition)) {
      return res.status(400).json({
        error: "Bad Request",
        message: "textPosition must be 'top', 'bottom', or 'center'.",
      });
    }

    // Validate emoji parameters
    const emojiSize = Math.max(16, Math.min(parseInt(emojiSizeStr, 10), 120));
    if (!["top", "bottom", "corners"].includes(emojiPosition)) {
      return res.status(400).json({
        error: "Bad Request",
        message: "emojiPosition must be 'top', 'bottom', or 'corners'.",
      });
    }

    // determine corner radius
    let cornerRadius: number;
    if (shape === "circle") cornerRadius = Math.floor(size / 2);
    else if (radiusStr && /^\d+$/.test(radiusStr))
      cornerRadius = Math.max(
        0,
        Math.min(parseInt(radiusStr, 10), Math.floor(size / 2))
      );
    else cornerRadius = Math.floor(size * 0.1);

    // determine canvas color
    let canvasColor: { r: number; g: number; b: number; alpha: number };
    if (canvasParam === "dark")
      canvasColor = { r: 34, g: 34, b: 34, alpha: 1 }; // dark gray
    else canvasColor = { r: 240, g: 240, b: 240, alpha: 1 }; // light gray default

    // Load frame first to validate theme exists
    const framePath = path.join(
      ASSET_BASE_PATH,
      "public",
      "frames",
      theme,
      "frame.png"
    );
    if (!fs.existsSync(framePath)) {
      return res.status(404).json({ error: `Theme '${theme}' not found.` });
    }

    // --- MODIFICATION START ---
    // Fetch avatar or use fallback if user not found
    let avatarBuffer: Buffer;
    const avatarUrl = `https://github.com/${username}.png?size=${size}`;

    try {
      const avatarResponse = await axios.get(avatarUrl, {
        responseType: "arraybuffer",
        timeout: 30000,
        validateStatus: (status) => status === 200,
        headers: {
          "User-Agent": "GitHub-Avatar-Frame-API/1.0.0",
        },
      });
      avatarBuffer = Buffer.from(avatarResponse.data);
    } catch (axiosError) {
      if (axios.isAxiosError(axiosError) && axiosError.response?.status === 404) {
        // User not found, so we load the fallback placeholder image
        const fallbackAvatarPath = path.join(
          ASSET_BASE_PATH,
          "public",
          "not-found.png"
        );
        if (!fs.existsSync(fallbackAvatarPath)) {
          console.error("Fallback avatar not-found.png is missing!");
          return res
            .status(500)
            .json({ error: "Internal Server Error: Fallback image is missing." });
        }
        avatarBuffer = fs.readFileSync(fallbackAvatarPath);
      } else {
        // For other network errors, let the outer catch block handle it
        throw axiosError;
      }
    }
    // --- MODIFICATION END ---

    // Load frame
    const frameBuffer = fs.readFileSync(framePath);

    // Resize avatar
    const avatarResized = await sharp(avatarBuffer)
      .resize(size, size)
      .png()
      .toBuffer();

    // Resize frame
    const frameMetadata = await sharp(frameBuffer).metadata();
    const maxSide = Math.max(
      frameMetadata.width || size,
      frameMetadata.height || size
    );
    
    // Apply custom accent color if provided
    let frameProcessor = sharp(frameBuffer)
      .resize({
        width: maxSide,
        height: maxSide,
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .resize(size, size);
    
    if (accentColor) {
      // Convert hex color to RGB for processing
      const hex = accentColor.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      
      // Apply color tint to the frame
      frameProcessor = frameProcessor.modulate({
        brightness: 1.1, // Slightly brighten
        saturation: 1.3, // Increase saturation
      }).tint({ r, g, b });
    }
    
    const paddedFrame = await frameProcessor.png().toBuffer();

    // Create mask for rounded corners
    const maskSvg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="${size}" height="${size}" rx="${cornerRadius}" ry="${cornerRadius}" fill="#fff"/>
    </svg>`;
    const maskBuffer = Buffer.from(maskSvg);

    const avatarMasked = await sharp(avatarResized)
      .composite([{ input: maskBuffer, blend: "dest-in" }])
      .png()
      .toBuffer();

    // Create text and emoji overlays
    const textOverlay = text ? await createTextOverlay(text, textColor, textSize, textPosition, size) : null;
    const emojiOverlay = emojis ? await createEmojiOverlay(emojis, emojiSize, emojiPosition, size) : null;

    // Build composite layers
    const compositeLayers = [
      { input: avatarMasked, gravity: "center" },
      { input: paddedFrame, gravity: "center" },
    ];

    // Add text overlay if provided
    if (textOverlay) {
      compositeLayers.push({ input: textOverlay, gravity: "center" });
    }

    // Add emoji overlay if provided
    if (emojiOverlay) {
      compositeLayers.push({ input: emojiOverlay, gravity: "center" });
    }

    // Compose final image on custom canvas color
    const finalImage = await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: canvasColor,
      },
    })
      .composite(compositeLayers)
      .png()
      .toBuffer();

    res.set("Content-Type", "image/png");
    res.set("Cache-Control", "public, max-age=3600");
    res.send(finalImage);
  } catch (error) {
    console.error("Error creating framed avatar:", error);
    if (axios.isAxiosError(error)) {
        if (
            error.code === "ECONNRESET" ||
            error.code === "ETIMEDOUT"
        ) {
            return res.status(503).json({
                error: "Service temporarily unavailable. Please try again later.",
            });
        }
    }
    res
      .status(500)
      .json({ error: "Internal Server Error during image processing." });
  }
});

/**
 * GET /api/themes
 * Lists all available themes + metadata
 */
app.get("/api/themes", (req: Request, res: Response) => {
  try {
    const framesDir = path.join(ASSET_BASE_PATH, "public", "frames");

    if (!fs.existsSync(framesDir)) {
      return res
        .status(500)
        .json({ error: `Frames directory not found at: ${framesDir}` });
    }

    const themes = fs.readdirSync(framesDir).filter((folder) => {
      const themeDir = path.join(framesDir, folder);
      const framePath = path.join(themeDir, "frame.png");
      return fs.existsSync(themeDir) && fs.statSync(themeDir).isDirectory() && fs.existsSync(framePath);
    });

    const result = themes.map((theme) => {
      const metadataPath = path.join(framesDir, theme, "metadata.json");
      let metadata = { name: theme, description: `${theme} frame theme` };

      if (fs.existsSync(metadataPath)) {
        try {
          const fileContent = fs.readFileSync(metadataPath, "utf-8");
          metadata = { ...metadata, ...JSON.parse(fileContent) };
        } catch (parseError) {
          console.warn(`Invalid metadata.json for theme ${theme}:`, parseError);
        }
      }

      return { theme, ...metadata };
    });

    res.json(result);
  } catch (error) {
    console.error("Error listing themes:", error);
    res.status(500).json({ error: "Failed to load themes." });
  }
});

// Health check endpoint
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📁 Asset base path: ${ASSET_BASE_PATH}`);
  console.log(`🎨 Available endpoints:`);
  console.log(`   GET /api/themes - List available themes`);
  console.log(`   GET /api/framed-avatar/:username - Generate framed avatar`);
  console.log(`   GET /api/health - Health check`);
});