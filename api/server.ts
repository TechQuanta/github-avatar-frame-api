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

/**
 * GET /api/framed-avatar/:username
 * Example: /api/framed-avatar/octocat?theme=base&size=256
 */
app.get("/api/framed-avatar/:username", async (req: Request, res: Response) => {
  try {
    const username = req.params.username;
    const theme = (req.query.theme as string) || "base";
    const sizeStr = (req.query.size as string) ?? "256";
    const shape = ((req.query.shape as string) || "circle").toLowerCase();
    const radiusStr = req.query.radius as string | undefined;
    const canvasParam = (req.query.canvas as string)?.toLowerCase() || "light"; // "dark" or "light"

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

    // Fetch avatar with better error handling
    const avatarUrl = `https://github.com/${username}.png?size=${size}`;
    let avatarResponse;

    try {
      avatarResponse = await axios.get(avatarUrl, {
        responseType: "arraybuffer",
        timeout: 30000, // Increased to 30 seconds
        validateStatus: (status) => status === 200,
        headers: {
          "User-Agent": "GitHub-Avatar-Frame-API/1.0.0",
        },
      });
    } catch (axiosError) {
      if (axios.isAxiosError(axiosError)) {
        if (axiosError.response?.status === 404) {
          return res
            .status(404)
            .json({ error: `GitHub user '${username}' not found.` });
        }
        if (
          axiosError.code === "ECONNRESET" ||
          axiosError.code === "ETIMEDOUT"
        ) {
          return res.status(503).json({
            error: "Service temporarily unavailable. Please try again later.",
          });
        }
      }
      throw axiosError;
    }

    const contentType = avatarResponse.headers["content-type"] || "";
    if (!contentType.startsWith("image/")) {
      return res
        .status(404)
        .json({ error: `GitHub user '${username}' avatar not found.` });
    }
    const avatarBuffer = Buffer.from(avatarResponse.data);

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
    const paddedFrame = await sharp(frameBuffer)
      .resize({
        width: maxSide,
        height: maxSide,
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .resize(size, size)
      .png()
      .toBuffer();

    // Create mask for rounded corners
    const maskSvg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="${size}" height="${size}" rx="${cornerRadius}" ry="${cornerRadius}" fill="#fff"/>
    </svg>`;
    const maskBuffer = Buffer.from(maskSvg);

    const avatarMasked = await sharp(avatarResized)
      .composite([{ input: maskBuffer, blend: "dest-in" }])
      .png()
      .toBuffer();

    // Compose final image on custom canvas color
    const finalImage = await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: canvasColor,
      },
    })
      .composite([
        { input: avatarMasked, gravity: "center" },
        { input: paddedFrame, gravity: "center" },
      ])
      .png()
      .toBuffer();

    res.set("Content-Type", "image/png");
    res.set("Cache-Control", "public, max-age=3600");
    res.send(finalImage);
  } catch (error) {
    console.error("Error creating framed avatar:", error);
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return res
        .status(404)
        .json({ error: `GitHub user '${req.params.username}' not found.` });
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
    // Use ASSET_BASE_PATH for reliable path resolution
    const framesDir = path.join(ASSET_BASE_PATH, "public", "frames");

    if (!fs.existsSync(framesDir)) {
      return res
        .status(500)
        .json({ error: `Frames directory not found at: ${framesDir}` });
    }

    const themes = fs.readdirSync(framesDir).filter((folder) => {
      const framePath = path.join(framesDir, folder, "frame.png");
      return fs.existsSync(framePath) && fs.statSync(framesDir).isDirectory();
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
