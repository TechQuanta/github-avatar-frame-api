import express, { Request, Response } from "express";
import axios from "axios";
import sharp from "sharp";
import path from "path";
import fs from "fs";

const app = express();
const PORT = 3000;

// Health check route (optional)
app.get("/", (req, res) => {
  res.send("API is running");
});

/**
 * GET /api/framed-avatar/:username
 * Example: /api/framed-avatar/octocat?theme=base&size=256
 */
app.get("/api/framed-avatar/:username", async (req: Request, res: Response) => {
  try {
    const username = req.params.username;
    const theme = (req.query.theme as string) || "base"; // Default to base theme for testing
    const size = Math.max(64, Math.min(Number(req.query.size ?? 256), 1024)); // Limit size between 64 and 1024

    console.log(`Fetching avatar for username=${username}, theme=${theme}, size=${size}`);

    // Fetch GitHub avatar
    const avatarUrl = `https://github.com/${username}.png?size=${size}`;
    const avatarResponse = await axios.get(avatarUrl, { responseType: "arraybuffer" });
    const avatarBuffer = Buffer.from(avatarResponse.data);

    // Locate theme frame
    const themePath = path.join(__dirname, "..", "public", "frames", theme, "frame.png");
    if (!fs.existsSync(themePath)) {
      return res.status(404).json({ error: `Theme '${theme}' not found` });
    }
    const frameBuffer = fs.readFileSync(themePath);

    // Resize and overlay
    const avatarResized = await sharp(avatarBuffer).resize(size, size).png().toBuffer();
    const frameResized = await sharp(frameBuffer).resize(size, size).png().toBuffer();

    const finalImage = await sharp(avatarResized)
      .composite([{ input: frameResized, gravity: "center" }])
      .png()
      .toBuffer();

    res.set("Content-Type", "image/png");
    res.send(finalImage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong." });
  }
});

/**
 * GET /api/themes
 * Lists all available themes + metadata
 */
app.get("/api/themes", (req: Request, res: Response) => {
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
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
