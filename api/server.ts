
import express from "express";
import type { Request, Response } from "express";
import axios from "axios";
import sharp from "sharp";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const app = express();

app.use(cors());

// Swagger configuration
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "GitHub Avatar Frame API",
      version: "1.0.0",
      description: "Use this API to generate custom framed GitHub avatars with different themes and styles.",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
      {
        url: "https://github-avatar-frame-api.vercel.app",
        description: "Production server",
      },
    ],
    components: {
      schemas: {
        Error: {
          type: "object",
          properties: {
            error: {
              type: "string",
              description: "Error type"
            },
            message: {
              type: "string",
              description: "Error message"
            }
          }
        },
        Theme: {
          type: "object",
          properties: {
            theme: {
              type: "string",
              description: "Theme identifier"
            },
            name: {
              type: "string",
              description: "Display name of the theme"
            },
            description: {
              type: "string",
              description: "Description of the theme"
            }
          }
        },
        BadgeResponse: {
          type: "object",
          properties: {
            username: {
              type: "string",
              description: "GitHub username"
            },
            badges: {
              type: "object",
              properties: {
                followers: {
                  type: "string",
                  description: "Followers badge URL"
                },
                repos: {
                  type: "string",
                  description: "Repositories badge URL"
                },
                stars: {
                  type: "string",
                  description: "Stars badge URL"
                },
                contributions: {
                  type: "string",
                  description: "Contributions badge URL"
                },
                profile: {
                  type: "string",
                  description: "Profile badge URL"
                }
              }
            },
            stats: {
              type: "object",
              properties: {
                followers: {
                  type: "integer",
                  description: "Number of followers"
                },
                public_repos: {
                  type: "integer",
                  description: "Number of public repositories"
                }
              }
            }
          }
        },
        SmartFrameResponse: {
          type: "object",
          properties: {
            username: {
              type: "string",
              description: "GitHub username"
            },
            recommendedFrame: {
              type: "string",
              description: "Recommended frame theme"
            },
            accentColor: {
              type: "string",
              description: "Recommended accent color (hex)"
            },
            emojis: {
              type: "array",
              items: {
                type: "string"
              },
              description: "Recommended emojis"
            },
            previewURL: {
              type: "string",
              description: "Preview URL for the recommended frame"
            }
          }
        },
        HealthResponse: {
          type: "object",
          properties: {
            status: {
              type: "string",
              example: "ok"
            },
            timestamp: {
              type: "string",
              format: "date-time",
              example: "2024-01-01T00:00:00.000Z"
            }
          }
        }
      },
      parameters: {
        Username: {
          name: "username",
          in: "path",
          required: true,
          schema: {
            type: "string"
          },
          description: "GitHub username",
          example: "octocat"
        },
        Theme: {
          name: "theme",
          in: "query",
          schema: {
            type: "string",
            default: "base"
          },
          description: "Frame theme to apply",
          example: "galaxy"
        },
        Size: {
          name: "size",
          in: "query",
          schema: {
            type: "integer",
            minimum: 64,
            maximum: 1024,
            default: 256
          },
          description: "Image size in pixels (64-1024)",
          example: 300
        },
        Shape: {
          name: "shape",
          in: "query",
          schema: {
            type: "string",
            enum: ["circle", "rounded", "rect"],
            default: "circle"
          },
          description: "Avatar shape",
          example: "circle"
        },
        Canvas: {
          name: "canvas",
          in: "query",
          schema: {
            type: "string",
            enum: ["light", "dark", "transparent"],
            default: "light"
          },
          description: "Background canvas color",
          example: "light"
        },
        AccentColor: {
          name: "accentColor",
          in: "query",
          schema: {
            type: "string",
            pattern: "^#[0-9A-Fa-f]{6}$"
          },
          description: "Custom accent color in hex format (e.g., #FF5733)",
          example: "#FF5733"
        },
        Text: {
          name: "text",
          in: "query",
          schema: {
            type: "string"
          },
          description: "Custom text to overlay on the avatar",
          example: "Darshan Parmar"
        },
        TextColor: {
          name: "textColor",
          in: "query",
          schema: {
            type: "string",
            default: "#ffffff"
          },
          description: "Text color in hex or keyword",
          example: "#ffffff"
        },
        TextSize: {
          name: "textSize",
          in: "query",
          schema: {
            type: "integer",
            minimum: 8,
            maximum: 100,
            default: 20
          },
          description: "Text size in pixels",
          example: 24
        },
        TextPosition: {
          name: "textPosition",
          in: "query",
          schema: {
            type: "string",
            enum: ["top", "bottom", "center"],
            default: "bottom"
          },
          description: "Text position on the avatar",
          example: "bottom"
        },
        Emojis: {
          name: "emojis",
          in: "query",
          schema: {
            type: "string"
          },
          description: "Comma-separated list of emojis",
          example: "🚀,💻,🔥"
        },
        EmojiSize: {
          name: "emojiSize",
          in: "query",
          schema: {
            type: "integer",
            minimum: 16,
            maximum: 120,
            default: 40
          },
          description: "Emoji size in pixels",
          example: 48
        },
        EmojiPosition: {
          name: "emojiPosition",
          in: "query",
          schema: {
            type: "string",
            enum: ["top", "bottom", "corners"],
            default: "top"
          },
          description: "Emoji position on the avatar",
          example: "top"
        },
        Format: {
          name: "format",
          in: "query",
          schema: {
            type: "string",
            enum: ["png", "jpg", "svg"],
            default: "png"
          },
          description: "Output image format",
          example: "png"
        },
        BadgeStyle: {
          name: "style",
          in: "query",
          schema: {
            type: "string",
            default: "flat"
          },
          description: "Badge style for shields.io",
          example: "flat"
        }
      }
    }
  },
  apis: ["./api/server.ts"], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Serve Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: `
    .swagger-ui .topbar { display: none; }
    .swagger-ui .info .title { color: #3b4151; }
    .swagger-ui .top-left-button {
      position: fixed;
      top: 10px;
      left: 10px;
      z-index: 1000;
      background: #007bff;
      color: white;
      padding: 8px 16px;
      text-decoration: none;
      border-radius: 4px;
      font-weight: bold;
      font-size: 14px;
    }
    .swagger-ui .top-left-button:hover {
      background: #0056b3;
    }
  `,
  customJs: `
    window.addEventListener('load', function() {
      var button = document.createElement('a');
      button.className = 'top-left-button';
      button.href = '/';
      button.textContent = 'Back to Home';
      document.body.appendChild(button);
    });
  `
}));


// Use environment PORT for hosting environments like Render, default to 3001 for local dev
const PORT = process.env.PORT || 3001;

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
 * @swagger
 * /api/framed-avatar/{username}:
 *   get:
 *     summary: Generate a framed GitHub avatar with custom styling
 *     description: Creates a custom framed avatar by combining a GitHub profile picture with decorative frames, text overlays, emojis, and various styling options.
 *     tags:
 *       - Avatar Generation
 *     parameters:
 *       - $ref: '#/components/parameters/Username'
 *       - $ref: '#/components/parameters/Theme'
 *       - $ref: '#/components/parameters/Size'
 *       - $ref: '#/components/parameters/Shape'
 *       - name: radius
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 0
 *           maximum: 512
 *         description: Corner radius for rounded/rect shapes (auto-calculated if not provided)
 *         example: 32
 *       - $ref: '#/components/parameters/Canvas'
 *       - $ref: '#/components/parameters/AccentColor'
 *       - $ref: '#/components/parameters/Text'
 *       - $ref: '#/components/parameters/TextColor'
 *       - $ref: '#/components/parameters/TextSize'
 *       - $ref: '#/components/parameters/TextPosition'
 *       - $ref: '#/components/parameters/Emojis'
 *       - $ref: '#/components/parameters/EmojiSize'
 *       - $ref: '#/components/parameters/EmojiPosition'
 *       - $ref: '#/components/parameters/Format'
 *     responses:
 *       200:
 *         description: Successfully generated framed avatar
 *         content:
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 *           image/jpeg:
 *             schema:
 *               type: string
 *               format: binary
 *           image/svg+xml:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Bad request - invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Bad Request"
 *               message: "Username is required."
 *       404:
 *         description: User or theme not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               userNotFound:
 *                 value:
 *                   error: "User not found"
 *                   message: "The GitHub user does not exist. Please check the spelling and try again."
 *               themeNotFound:
 *                 value:
 *                   error: "Theme 'invalid-theme' not found."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *     examples:
 *       - summary: Basic framed avatar
 *         description: Generate a basic framed avatar with default settings
 *         value: "/api/framed-avatar/octocat"
 *       - summary: Custom styled avatar
 *         description: Generate avatar with custom theme, size, and text overlay
 *         value: "/api/framed-avatar/octocat?theme=galaxy&size=300&text=Hello%20World&textColor=%23ffffff&format=png"
 *       - summary: Avatar with emojis
 *         description: Generate avatar with emoji decorations
 *         value: "/api/framed-avatar/octocat?theme=neon&emojis=🚀,💻,🔥&emojiPosition=top&accentColor=%23FF5733"
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
    const emojis = req.query.emojis ? decodeURIComponent(req.query.emojis as string) : undefined;
    const emojiSizeStr = (req.query.emojiSize as string) || "40";
    const emojiPosition = ((req.query.emojiPosition as string) || "top").toLowerCase();

    // Format parameter
    const format = ((req.query.format as string) || "png").toLowerCase();

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

    // Validate format parameter
    if (!["png", "jpg", "svg"].includes(format)) {
      return res.status(400).json({
        error: "Bad Request",
        message: "format must be 'png', 'jpg', or 'svg'.",
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

    // Fetch avatar
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
        // User not found, return error instead of fallback
        return res.status(404).json({
          error: "User not found",
          message: "The GitHub user does not exist. Please check the spelling and try again."
        });
      } else {
        // For other network errors, let the outer catch block handle it
        throw axiosError;
      }
    }

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

    // Generate response based on format
    if (format === "svg") {
      // Convert images to base64 for SVG embedding
      const avatarBase64 = avatarMasked.toString('base64');
      const frameBase64 = paddedFrame.toString('base64');

      // Create SVG with embedded images
      let svgContent = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <defs>
          <filter id="textShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="1" dy="1" stdDeviation="1" flood-color="rgba(0,0,0,0.5)"/>
          </filter>
          <clipPath id="avatarClip">
            <rect x="0" y="0" width="${size}" height="${size}" rx="${cornerRadius}" ry="${cornerRadius}"/>
          </clipPath>
        </defs>
        <!-- Canvas background -->
        <rect width="${size}" height="${size}" fill="rgb(${canvasColor.r}, ${canvasColor.g}, ${canvasColor.b})"/>
        <!-- Avatar -->
        <image x="0" y="0" width="${size}" height="${size}" xlink:href="data:image/png;base64,${avatarBase64}" clip-path="url(#avatarClip)"/>
        <!-- Frame -->
        <image x="0" y="0" width="${size}" height="${size}" xlink:href="data:image/png;base64,${frameBase64}"/>`;

      // Add text overlay if provided
      if (textOverlay) {
        const textSvg = textOverlay.toString();
        const textMatch = textSvg.match(/<text[^>]*>[\s\S]*?<\/text>/);
        if (textMatch) {
          svgContent += textMatch[0];
        }
      }

      // Add emoji overlay if provided
      if (emojiOverlay) {
        const emojiSvg = emojiOverlay.toString();
        const emojiMatches = emojiSvg.match(/<text[^>]*>[\s\S]*?<\/text>/g);
        if (emojiMatches) {
          emojiMatches.forEach(match => svgContent += match);
        }
      }

      svgContent += "</svg>";

      res.set("Content-Type", "image/svg+xml");
      res.set("Content-Disposition", `attachment; filename="${username}-avatar.svg"`);
      res.set("Cache-Control", "public, max-age=3600");
      res.send(svgContent);
    } else {
      // PNG or JPG format using Sharp
      const sharpInstance = sharp({
        create: {
          width: size,
          height: size,
          channels: 4,
          background: canvasColor,
        },
      }).composite(compositeLayers);

      let finalImage: Buffer;
      let filename: string;
      if (format === "jpg") {
        finalImage = await sharpInstance.jpeg({ quality: 90 }).toBuffer();
        res.set("Content-Type", "image/jpeg");
        filename = `${username}-avatar.jpg`;
      } else {
        finalImage = await sharpInstance.png().toBuffer();
        res.set("Content-Type", "image/png");
        filename = `${username}-avatar.png`;
      }

      res.set("Content-Disposition", `attachment; filename="${filename}"`);
      res.set("Cache-Control", "public, max-age=3600");
      res.send(finalImage);
    }
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
 * @swagger
 * /api/smart-frame/{username}:
 *   get:
 *     summary: Get AI-powered smart frame recommendations
 *     description: Analyzes a GitHub user's profile and repositories to provide personalized frame, color, and emoji recommendations for their avatar.
 *     tags:
 *       - Smart Recommendations
 *     parameters:
 *       - $ref: '#/components/parameters/Username'
 *     responses:
 *       200:
 *         description: Successfully generated smart frame recommendations
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SmartFrameResponse'
 *             example:
 *               username: "octocat"
 *               recommendedFrame: "tech-minimal"
 *               accentColor: "#61DAFB"
 *               emojis: ["💻", "🚀"]
 *               previewURL: "https://github-avatar-frame-api.onrender.com/api/framed-avatar/octocat?accentColor=%2361DAFB&theme=tech-minimal&emojis=%F0%9F%92%BB%2C%F0%9F%9A%80"
 *       400:
 *         description: Bad request - invalid username
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Bad Request"
 *               message: "Username is required."
 *       404:
 *         description: GitHub user not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "User not found"
 *               message: "GitHub user does not exist."
 *       500:
 *         description: Internal server error during analysis
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Internal Server Error"
 *               message: "Internal Server Error during analysis."
 *       503:
 *         description: Service temporarily unavailable
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Service temporarily unavailable. Please try again later."
 */
app.get("/api/smart-frame/:username", async (req: Request, res: Response) => {
  try {
    const username = req.params.username;

    // Validate username
    if (!username || typeof username !== "string" || username.trim() === "") {
      return res
        .status(400)
        .json({ error: "Bad Request", message: "Username is required." });
    }

    // Fetch GitHub user data
    let userData;
    try {
      const userResponse = await axios.get(`https://api.github.com/users/${username}`, {
        timeout: 10000,
        headers: {
          "User-Agent": "GitHub-Avatar-Frame-API/1.0.0",
        },
      });
      userData = userResponse.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return res.status(404).json({ error: "User not found", message: "GitHub user does not exist." });
      }
      throw error;
    }

    // Fetch user's repositories
    let reposData = [];
    try {
      const reposResponse = await axios.get(`https://api.github.com/users/${username}/repos?per_page=100`, {
        timeout: 10000,
        headers: {
          "User-Agent": "GitHub-Avatar-Frame-API/1.0.0",
        },
      });
      reposData = reposResponse.data;
    } catch (error) {
      console.warn("Failed to fetch repos, proceeding with user data only:", error);
    }

    // Analyze data
    const analysis = analyzeGitHubProfile(userData, reposData);

    // Generate recommendations
    const recommendations = generateRecommendations(analysis);

    // Construct preview URL
    const baseUrl = process.env.BASE_URL || "https://github-avatar-frame-api.onrender.com";
    const previewURL = `${baseUrl}/api/framed-avatar/${username}?accentColor=${encodeURIComponent(recommendations.accentColor)}&theme=${recommendations.recommendedFrame}&emojis=${encodeURIComponent(recommendations.emojis.join(','))}`;

    const response = {
      username,
      recommendedFrame: recommendations.recommendedFrame,
      accentColor: recommendations.accentColor,
      emojis: recommendations.emojis,
      previewURL,
    };

    res.json(response);
  } catch (error) {
    console.error("Error generating smart frame suggestions:", error);
    if (axios.isAxiosError(error)) {
      if (error.code === "ECONNRESET" || error.code === "ETIMEDOUT") {
        return res.status(503).json({
          error: "Service temporarily unavailable. Please try again later.",
        });
      }
    }
    res.status(500).json({ error: "Internal Server Error during analysis." });
  }
});

/**
 * Analyze GitHub profile data
 */
function analyzeGitHubProfile(userData: any, reposData: any[]) {
  // Dominant languages
  const languageCounts: { [key: string]: number } = {};
  reposData.forEach(repo => {
    if (repo.language) {
      languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
    }
  });
  const dominantLanguage = Object.keys(languageCounts).reduce((a, b) =>
    languageCounts[a] > languageCounts[b] ? a : b, "Unknown"
  );

  // Activity level (based on public repos, followers, etc.)
  const activityLevel = Math.min(userData.public_repos + userData.followers + (userData.following || 0), 100) / 100; // 0-1 scale

  // Bio keywords
  const bio = userData.bio || "";
  const keywords = bio.toLowerCase().split(/\s+/);

  return {
    dominantLanguage,
    activityLevel,
    keywords,
    isStudent: keywords.some((k: string) => k.includes("student") || k.includes("learner")),
    isOpenSource: userData.public_repos > 10,
    isDataScientist: keywords.some((k: string) => k.includes("data") || k.includes("ml") || k.includes("ai")),
    isFrontend: keywords.some((k: string) => k.includes("frontend") || k.includes("react") || k.includes("web")),
    isBackend: keywords.some((k: string) => k.includes("backend") || k.includes("api") || k.includes("server")),
  };
}

/**
 * Generate recommendations based on analysis
 */
function generateRecommendations(analysis: any) {
  let recommendedFrame = "base";
  let accentColor = "#ffffff";
  let emojis: string[] = [];

  // Frame type based on profile type
  if (analysis.isFrontend) {
    recommendedFrame = "tech-minimal";
    accentColor = "#61DAFB"; // React blue
    emojis = ["💻", "🚀"];
  } else if (analysis.isDataScientist) {
    recommendedFrame = "neural";
    accentColor = "#FFD43B"; // Yellow for data
    emojis = ["🧠", "📊"];
  } else if (analysis.isStudent || analysis.isOpenSource) {
    recommendedFrame = "soft-modern";
    accentColor = "#34D399"; // Green for growth
    emojis = ["🚀", "📚"];
  } else if (analysis.dominantLanguage === "Python") {
    recommendedFrame = "minimal";
    accentColor = "#3776AB"; // Python blue
    emojis = ["🐍", "💻"];
  } else if (analysis.dominantLanguage === "JavaScript") {
    recommendedFrame = "neon";
    accentColor = "#F7DF1E"; // JS yellow
    emojis = ["💻", "⚡"];
  } else {
    // Default
    recommendedFrame = "classic";
    accentColor = "#FF6B6B"; // Red
    emojis = ["🌟", "💻"];
  }

  // Adjust based on activity level
  if (analysis.activityLevel > 0.7) {
    emojis.push("🔥"); // High activity
  }

  return {
    recommendedFrame,
    accentColor,
    emojis,
  };
}

/**
 * GET /api/ai-suggest/:username
 * AI-powered frame suggestion based on avatar colors and GitHub activity
 */
app.get("/api/ai-suggest/:username", async (req: Request, res: Response) => {
  try {
    const username = req.params.username;

    // Validate username
    if (!username || typeof username !== "string" || username.trim() === "") {
      return res
        .status(400)
        .json({ error: "Bad Request", message: "Username is required." });
    }

    console.log(`🤖 AI analyzing profile for: ${username}`);

    // Fetch GitHub user data
    let userData;
    try {
      const userResponse = await axios.get(`https://api.github.com/users/${username}`, {
        timeout: 10000,
        headers: {
          "User-Agent": "GitHub-Avatar-Frame-API/1.0.0",
        },
      });
      userData = userResponse.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return res.status(404).json({ error: "User not found", message: "GitHub user does not exist." });
      }
      throw error;
    }

    // Simple avatar analysis (placeholder - would need image processing)
    const avatarAnalysis = {
      dominantTone: "neutral",
      brightness: 0.5,
      isDark: false,
      isColorful: false,
      dominantColor: "#ffffff"
    };

    // Analyze contribution activity
    const contributionAnalysis = await analyzeContributionActivity(username);

    // Generate AI-powered recommendations
    const recommendations = generateAISuggestions(avatarAnalysis, contributionAnalysis, userData);

    // Construct preview URL
    const baseUrl = process.env.BASE_URL || "https://github-avatar-frame-api.onrender.com";
    const previewURL = `${baseUrl}/api/framed-avatar/${username}?theme=${recommendations.theme}&canvas=${recommendations.canvas}&shape=${recommendations.shape}`;

    const response = {
      username,
      analysis: {
        avatar: avatarAnalysis,
        contributions: contributionAnalysis
      },
      recommendations,
      previewURL,
      confidence: recommendations.confidence,
      reasoning: recommendations.reasoning
    };

    console.log(`✅ AI suggestions generated for ${username}: ${recommendations.theme} (${recommendations.confidence}% confidence)`);
    res.json(response);

  } catch (error) {
    console.error("Error in AI suggestion generation:", error);
    if (axios.isAxiosError(error)) {
      if (error.code === "ECONNRESET" || error.code === "ETIMEDOUT") {
        return res.status(503).json({
          error: "Service temporarily unavailable. Please try again later.",
        });
      }
    }
    res.status(500).json({ error: "Internal Server Error during AI analysis." });
  }
});

/**
 * Analyze avatar image colors using Sharp
 */
/*
async function analyzeAvatarColors(avatarUrl: string) {
  try {
    // Fetch avatar image
    const response = await axios.get(avatarUrl, {
      responseType: 'arraybuffer',
      timeout: 10000,
      headers: {
        'User-Agent': 'GitHub-Avatar-Frame-API/1.0.0'
      }
    });

    const imageBuffer = Buffer.from(response.data);

    // Get image stats using Sharp
    const stats = await sharp(imageBuffer).stats();

    // Calculate dominant color and brightness
    const { channels } = stats;
    const red = channels[0].mean;
    const green = channels[1].mean;
    const blue = channels[2].mean;

    // Calculate brightness (0-1 scale)
    const brightness = (red * 0.299 + green * 0.587 + blue * 0.114) / 255;

    // Determine if image is dark
    const isDark = brightness < 0.4;

    // Calculate colorfulness (standard deviation of colors)
    const colorfulness = Math.sqrt(
      Math.pow(channels[0].stdev, 2) +
      Math.pow(channels[1].stdev, 2) +
      Math.pow(channels[2].stdev, 2)
    ) / 255;

    const isColorful = colorfulness > 0.15;

    // Determine dominant tone
    let dominantTone = "neutral";
    if (isDark) {
      dominantTone = "dark";
    } else if (brightness > 0.7) {
      dominantTone = "bright";
    } else if (isColorful) {
      dominantTone = "colorful";
    }

    // Convert RGB to hex
    const dominantColor = `#${Math.round(red).toString(16).padStart(2, '0')}${Math.round(green).toString(16).padStart(2, '0')}${Math.round(blue).toString(16).padStart(2, '0')}`;

    return {
      dominantTone,
      brightness: Math.round(brightness * 100) / 100,
      isDark,
      isColorful,
      dominantColor,
      colorfulness: Math.round(colorfulness * 100) / 100
    };

  } catch (error) {
    console.error("Error analyzing avatar colors:", error);
    throw error;
  }
}
*/

/**
 * Analyze GitHub contribution activity
 */
async function analyzeContributionActivity(username: string) {
  try {
    // Fetch contribution data from GitHub's contribution graph
    // Note: GitHub doesn't provide direct contribution API, so we'll use user stats
    const userResponse = await axios.get(`https://api.github.com/users/${username}`, {
      timeout: 10000,
      headers: {
        "User-Agent": "GitHub-Avatar-Frame-API/1.0.0",
      },
    });

    const userData = userResponse.data;

    // Get recent repositories for activity analysis
    const reposResponse = await axios.get(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`, {
      timeout: 10000,
      headers: {
        "User-Agent": "GitHub-Avatar-Frame-API/1.0.0",
      },
    });

    const repos = reposResponse.data;

    // Calculate activity metrics
    const totalStars = repos.reduce((sum: number, repo: any) => sum + (repo.stargazers_count || 0), 0);
    const totalForks = repos.reduce((sum: number, repo: any) => sum + (repo.forks_count || 0), 0);
    const recentActivity = repos.filter((repo: any) => {
      const updatedDate = new Date(repo.updated_at);
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return updatedDate > monthAgo;
    }).length;

    // Determine activity level
    let activityLevel = "beginner";
    const totalRepos = userData.public_repos || 0;
    const followers = userData.followers || 0;

    if (totalRepos > 50 || followers > 100 || totalStars > 100) {
      activityLevel = "expert";
    } else if (totalRepos > 20 || followers > 50 || totalStars > 20) {
      activityLevel = "advanced";
    } else if (totalRepos > 5 || followers > 10) {
      activityLevel = "intermediate";
    }

    // Check for consistency (recent activity)
    const isConsistent = recentActivity >= 3;

    return {
      activityLevel,
      totalRepos,
      followers,
      totalStars,
      totalForks,
      recentActivity,
      isConsistent,
      contributionScore: Math.min(totalRepos + followers + totalStars, 1000) // 0-1000 scale
    };

  } catch (error) {
    console.error("Error analyzing contribution activity:", error);
    throw error;
  }
}

/**
 * Generate AI-powered theme suggestions
 */
function generateAISuggestions(avatarAnalysis: any, contributionAnalysis: any, userData: any) {
  let theme = "base";
  let canvas = "light";
  let shape = "circle";
  let confidence = 75;
  let reasoning = [];

  // Theme selection based on avatar colors (simplified for now)
  if (avatarAnalysis.dominantTone === "dark") {
    theme = "starry";
    canvas = "dark";
    reasoning.push("Dark avatar suggests cosmic/galaxy themes");
    confidence += 10;
  } else if (avatarAnalysis.dominantTone === "bright") {
    theme = "minimal";
    canvas = "light";
    reasoning.push("Bright avatar pairs well with clean, minimal designs");
    confidence += 5;
  } else if (avatarAnalysis.isColorful) {
    theme = "neon";
    canvas = "dark";
    reasoning.push("Colorful avatar complements vibrant neon themes");
    confidence += 15;
  }

  // Adjust based on contribution activity
  if (contributionAnalysis.activityLevel === "expert") {
    if (theme === "starry") {
      theme = "gitblaze"; // More professional for experts
    }
    shape = "rounded";
    reasoning.push("Expert level activity suggests professional, polished themes");
    confidence += 10;
  } else if (contributionAnalysis.activityLevel === "beginner") {
    theme = "classic";
    canvas = "light";
    reasoning.push("Beginner-friendly classic theme for new developers");
    confidence += 5;
  } else if (contributionAnalysis.activityLevel === "advanced") {
    if (avatarAnalysis.isDark) {
      theme = "ocean"; // Professional but creative
    } else {
      theme = "eternity";
    }
    reasoning.push("Advanced users get sophisticated, balanced themes");
    confidence += 8;
  }

  // Special cases based on follower/repo ratios
  const followerRatio = contributionAnalysis.followers / Math.max(contributionAnalysis.totalRepos, 1);
  if (followerRatio > 5) {
    theme = "flamingo";
    reasoning.push("High follower-to-repo ratio suggests popular, eye-catching themes");
    confidence += 12;
  }

  // Consistency bonus
  if (contributionAnalysis.isConsistent) {
    reasoning.push("Consistent activity indicates dedication - theme reflects reliability");
    confidence += 5;
  }

  // Ensure confidence doesn't exceed 100%
  confidence = Math.min(confidence, 95);

  return {
    theme,
    canvas,
    shape,
    confidence,
    reasoning
  };
}

/**
 * GET /api/badge/:username
 * Generates dynamic badge URLs for GitHub stats
 */
app.get("/api/badge/:username", async (req: Request, res: Response) => {
  try {
    const username = req.params.username;
    const style = (req.query.style as string) || "flat";

    // Validate username
    if (!username || typeof username !== "string" || username.trim() === "") {
      return res
        .status(400)
        .json({ error: "Bad Request", message: "Username is required." });
    }

    // Fetch GitHub user data
    let userData;
    try {
      const userResponse = await axios.get(`https://api.github.com/users/${username}`, {
        timeout: 10000,
        headers: {
          "User-Agent": "GitHub-Avatar-Frame-API/1.0.0",
        },
      });
      userData = userResponse.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return res.status(404).json({ error: "User not found", message: "GitHub user does not exist." });
      }
      throw error;
    }

    // Generate badge URLs using shields.io
    const baseUrl = "https://img.shields.io";
    const badges = {
      followers: `${baseUrl}/github/followers/${username}?style=${style}&label=Followers&color=blue`,
      repos: `${baseUrl}/github/repos/${username}?style=${style}&label=Repos&color=green`,
      stars: `${baseUrl}/github/stars/${username}?style=${style}&label=Stars&color=yellow`,
      contributions: `${baseUrl}/github/commit-activity/m/${username}?style=${style}&label=Commits&color=orange`,
      profile: `${baseUrl}/github/followers/${username}?style=${style}&label=Profile&color=purple&logo=github`,
    };

    // Also include current stats
    const stats = {
      followers: userData.followers,
      public_repos: userData.public_repos,
      // Note: stars and contributions require additional API calls, simplified here
    };

    res.json({
      username,
      badges,
      stats,
    });
  } catch (error) {
    console.error("Error generating badges:", error);
    if (axios.isAxiosError(error)) {
      if (error.code === "ECONNRESET" || error.code === "ETIMEDOUT") {
        return res.status(503).json({
          error: "Service temporarily unavailable. Please try again later.",
        });
      }
    }
    res.status(500).json({ error: "Internal Server Error during badge generation." });
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

// Catch-all for invalid API routes
app.use("/api/*", (req: Request, res: Response) => {
  res.status(404).json({ error: "Not Found", message: "API endpoint not found." });
});

// Catch-all for SPA: serve index.html for non-API routes
app.get("*", (req: Request, res: Response) => {
  const indexPath = path.join(ASSET_BASE_PATH, "public", "index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ error: "Not Found", message: "Page not found." });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📁 Asset base path: ${ASSET_BASE_PATH}`);
  console.log(`🎨 Available endpoints:`);
  console.log(`   GET /api/themes - List available themes`);
  console.log(`   GET /api/framed-avatar/:username - Generate framed avatar`);
  console.log(`   GET /api/ai-suggest/:username - AI-powered frame suggestions based on avatar & activity`);
  console.log(`   GET /api/smart-frame/:username - AI-powered smart frame suggestions`);
  console.log(`   GET /api/badge/:username - Generate GitHub stats badges`);
  console.log(`   GET /api/health - Health check`);
});
