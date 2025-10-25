import axios from "axios";
import sharp from "sharp";
import fs from "fs";
import path from "path";

// define asset path constant
const ASSET_BASE_PATH = process.cwd();

export default async function handler(req, res) {
  let avatarBuffer;
  try {
    // Get username from query parameter
    const username = req.query.username;
    const theme = req.query.theme || "base";
    const size = Math.max(64, Math.min(Number(req.query.size || 256), 1024));
    const canvas = req.query.canvas || "light";
    const accentColor = req.query.accentColor || null;
    // Validate username
    if (!username || typeof username !== "string" || username.trim() === "") {
      return res.status(400).json({ error: "Username is required" });
    }

    // Validate theme
    // if (!theme || typeof theme !== "string" || theme.trim() === "") {
    //   return res.status(400).json({ error: "Theme is required" });
    // }

    // // Validate size
    // if (isNaN(size) || size < 64 || size > 1024) {
    //   return res
    //     .status(400)
    //     .json({ error: "Size must be between 64 and 1024" });
    // }

    console.log(
      `Fetching avatar for username=${username}, theme=${theme}, size=${size}`
    );
    
    // Fetch GitHub avatar
    const avatarUrl = `https://github.com/${username}.png?size=${size}`;
    

    try {
      const avatarResponse = await axios.get(avatarUrl, {
        responseType: "arraybuffer",
        timeout: 10000,
        validateStatus: (status) => status === 200,
      });
      avatarBuffer = Buffer.from(avatarResponse.data);
    } catch (axiosError) {
      console.warn("Failed to fetch Github avatar, using fallback...");
      avatarBuffer=getFallbackBuffer();
    }



    // Get frame 
    
    const themePath = path.join(
      ASSET_BASE_PATH,
      "public",
      "frames",
      theme,
      "frame.png"
    );
    let frameBuffer=null;
    let frameResized= null;
    if (fs.existsSync(themePath)) {
      frameBuffer = fs.readFileSync(themePath);
      console.log(`Frame loaded for theme: ${theme}`);
      // const fallbackImage= await sharp(avatarBuffer).resize(size, size).png().toBuffer();
      // res.setHeader("Content-Type", "image/png");
      // return res.send(fallbackImage);
    } else{
      console.warn(`Theme '${theme}' not isFunctionDeclaration, skipping frameBuffer.`)
    }
    

    // Resize and overlay
    const avatarResized = await sharp(avatarBuffer)
      .resize(size, size)
      .png()
      .toBuffer();
    // only resize frame if it was successfully loaded
    if(frameBuffer){
      let frameProcessor = sharp(frameBuffer).resize(size, size);
      
      // Apply custom accent color if provided
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
      
      frameResized = await frameProcessor.png().toBuffer();
    }
    // composition logic for transparency and avatar clipping
    let imageProcessor;
    let layers=[];
    if(canvas==="transparent"){
      imageProcessor=sharp({
        create: {
          width: size,
          height: size,
          channels: 4,
          background:{r:0, g:0, b:0, alpha: 0}
        },
      })
    //avatae is added as first layer
    layers.push({input: avatarResized, gravity: "center"});
  } else{
    //start with avatar as base image
    imageProcessor=sharp(avatarResized);
  }
  //add frame as border layer if it exists
  if(frameResized){
    layers.push({input: frameResized, gravity: "center"});
  }
    const finalImage = await (layers.length > 0
      ? imageProcessor.composite(layers)
      : imageProcessor)
      .png()
      .toBuffer();

    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(finalImage);
  } catch (error) {
    console.error("Error processing avatar:", error);
    try{
      //serve fallback image on failure
      const fallbackBuffer= getFallbackBuffer();
      res.setHeader("Content-Type","image/png");
      res.send(fallbackBuffer);
    } catch(fallbackError){
      console.error("Fallback image is missing or unreadable:", fallbackError);
    res.status(500).json({ error: "Internal Server Error: Fallback image is missing." });
  }
  }
}
/**
 * Load fallback image safely
 */
function getFallbackBuffer() {
  const fallbackPath= path.join(ASSET_BASE_PATH,"public", "images", "fallback.png");
  if (!fs.existsSync(fallbackPath)){
    throw new Error(`Fallback image not found at :${fallbackPath}`);
  }
  return fs.readFileSync(fallbackPath);
}