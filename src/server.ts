import express, { Request, Response } from "express";
import axios from "axios";
import sharp from "sharp";
import path from "path";
import fs from "fs";

const app = express();
const PORT = 3000;
//root route(server check)
app.get("/",(req:Request,res:Response)=>{
  res.send("API is running");
});
/**
 * GET /api/framed-avatar/:username
 * Example: /api/framed-avatar/octocat?theme=classic&size=256
 */
app.get("/api/framed-avatar/:username", async (req: Request, res: Response) => {
  try {
    const username = req.params.username;
    const theme = (req.query.theme as string) || "classic";
    const size = Number(req.query.size ?? 256);

    if (isNaN(size) || size <= 0 || size > 1024) {
      return res.status(400).json({ error: "Invalid size parameter" });
    }

    // 1. Fetch GitHub avatar
    const avatarUrl = `https://github.com/${username}.png?size=${size}`;
    const avatarResponse = await axios.get(avatarUrl, { responseType: "arraybuffer" });
    const avatarBuffer = Buffer.from(avatarResponse.data);

    // 2. Load and validate frame
    const framePath = path.join(__dirname, "..", "public", "frames", theme, "frame.png");
    if (!fs.existsSync(framePath)) {
      return res.status(404).json({ error: `Theme '${theme}' not found.` });
    }
    const frameBuffer = fs.readFileSync(framePath);

    // 3. Resize avatar to match requested size
    const avatarResized = await sharp(avatarBuffer)
      .resize(size, size)
      .png()
      .toBuffer();

    // 4. Pad frame to square (if needed) and resize
    const frameMetadata = await sharp(frameBuffer).metadata();
    const maxSide = Math.max(frameMetadata.width!, frameMetadata.height!);

    const paddedFrame = await sharp(frameBuffer)
      .resize({
        width: maxSide,
        height: maxSide,
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 }, // Transparent background
      })
      .resize(size, size)
      .png()
      .toBuffer();

    // 5. Compose avatar + frame on transparent canvas
    const finalImage = await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite([
        { input: avatarResized, gravity: "center" },
        { input: paddedFrame, gravity: "center" },
      ])
      .png()
      .toBuffer();

    res.set("Content-Type", "image/png");
    res.send(finalImage);
  } catch (error) {
    console.error("Error creating framed avatar:", error);
    res.status(500).json({ error: "Something went wrong." });
  }
});

/**
 * GET /api/themes
 * Lists all available themes + metadata
 */
app.get("/api/themes", (req: Request, res: Response) => {
  try {
    const framesDir = path.join(__dirname, "..", "public", "frames");
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
