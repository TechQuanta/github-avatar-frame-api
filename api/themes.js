import fs from "fs";
import path from "path";

export default function handler(req, res) {
  try {
    // Use proper path resolution
    const ASSET_BASE_PATH = path.join(__dirname, "..");
    const framesDir = path.join(ASSET_BASE_PATH, "public", "frames");

    if (!fs.existsSync(framesDir)) {
      return res.status(500).json({ error: "Frames directory not found" });
    }

    const themes = fs.readdirSync(framesDir).filter((folder) => {
      const framePath = path.join(framesDir, folder, "frame.png");
      return (
        fs.existsSync(framePath) &&
        fs.statSync(path.join(framesDir, folder)).isDirectory()
      );
    });

    const result = themes.map((theme) => {
      const metadataPath = path.join(framesDir, theme, "metadata.json");
      let metadata = { name: theme, description: `${theme} frame theme` };

      if (fs.existsSync(metadataPath)) {
        try {
          const fileContent = fs.readFileSync(metadataPath, "utf-8");
          metadata = { ...metadata, ...JSON.parse(fileContent) };
        } catch (parseError) {
          console.warn(`Invalid metadata.json for theme ${theme}`);
        }
      }

      return { theme, ...metadata };
    });

    res.json(result);
  } catch (error) {
    console.error("Error listing themes:", error);
    res.status(500).json({ error: "Failed to list themes" });
  }
}
