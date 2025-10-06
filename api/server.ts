import express, { Request, Response } from "express";
import axios from "axios";
import sharp from "sharp";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
// Use environment PORT for hosting environments like Render, default to 3000 for local dev
const PORT = process.env.PORT || 3000;

// Helper to determine the base directory for assets, reliable across compilation (dist)
// Assumes 'public' is located one level up from the compiled script location.

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

    if (!/^\d+$/.test(sizeStr)) {
      return res.status(400).json({ error: "Bad Request", message: "The 'size' parameter must be a valid integer." });
    }

    const size = Math.max(64, Math.min(parseInt(sizeStr, 10), 1024));

    // determine corner radius
    let cornerRadius: number;
    if (shape === "circle") cornerRadius = Math.floor(size / 2);
    else if (radiusStr && /^\d+$/.test(radiusStr)) cornerRadius = Math.max(0, Math.min(parseInt(radiusStr, 10), Math.floor(size / 2)));
    else cornerRadius = Math.floor(size * 0.1);

    // determine canvas color
    let canvasColor: { r: number; g: number; b: number; alpha: number };
    if (canvasParam === "dark") canvasColor = { r: 34, g: 34, b: 34, alpha: 1 }; // dark gray
    else canvasColor = { r: 240, g: 240, b: 240, alpha: 1 }; // light gray default

    // Fetch avatar
    const avatarUrl = `https://github.com/${username}.png?size=${size}`;
    const avatarResponse = await axios.get(avatarUrl, { responseType: "arraybuffer" });
    const contentType = avatarResponse.headers["content-type"] || "";
    if (!contentType.startsWith("image/")) return res.status(404).json({ error: `GitHub user '${username}' avatar not found.` });
    const avatarBuffer = Buffer.from(avatarResponse.data);

    // Load frame
    const framePath = path.join(ASSET_BASE_PATH, "public", "frames", theme, "frame.png");
    if (!fs.existsSync(framePath)) return res.status(404).json({ error: `Theme '${theme}' not found.` });
    const frameBuffer = fs.readFileSync(framePath);

    // Resize avatar
    const avatarResized = await sharp(avatarBuffer).resize(size, size).png().toBuffer();

    // Resize frame
    const frameMetadata = await sharp(frameBuffer).metadata();
    const maxSide = Math.max(frameMetadata.width || size, frameMetadata.height || size);
    const paddedFrame = await sharp(frameBuffer)
      .resize({ width: maxSide, height: maxSide, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
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
      create: { width: size, height: size, channels: 4, background: canvasColor }
    })
      .composite([
        { input: avatarMasked, gravity: "center" },
        { input: paddedFrame, gravity: "center" }
      ])
      .png()
      .toBuffer();

    res.set("Content-Type", "image/png");
    res.send(finalImage);
  } catch (error) {
    console.error("Error creating framed avatar:", error);
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return res.status(404).json({ error: `GitHub user '${req.params.username}' not found.` });
    }
    res.status(500).json({ error: "Internal Server Error during image processing." });
  }
});

/**
 * GET /api/themes
 * Lists all available themes + metadata
 */
app.get("/api/themes", (req: Request, res: Response) => {
  try {
    // FIX: Use ASSET_BASE_PATH for reliable path resolution (instead of process.cwd())
    const framesDir = path.join(ASSET_BASE_PATH, "public", "frames");
    
    if (!fs.existsSync(framesDir)) {
        return res.status(500).json({ error: `Frames directory not found at: ${framesDir}` });
    }

    const themes = fs.readdirSync(framesDir).filter(folder =>
      fs.existsSync(path.join(framesDir, folder, "frame.png"))
    );

    const result = themes.map(theme => {
      const metadataPath = path.join(framesDir, theme, "metadata.json");
      let metadata = {};
      if (fs.existsSync(metadataPath)) {
        metadata = JSON.parse(fs.readFileSync(metadataPath, "utf-8"));
      }
      return { theme, ...metadata };
    });

    res.json(result);
  } catch (error) {
    console.error("Error listing themes:", error);
    res.status(500).json({ error: "Failed to load themes." });
  }
});


// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
