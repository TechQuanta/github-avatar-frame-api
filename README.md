 <img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="100%">
<!-- GSSoC Banner -->
<h1 align="center" style="font-size: 3em; color: #ff4081;">
  🖼️ GitHub Avatar Frame API
</h1>

<p align="center" style="font-size: 1.3em;">
  <b>Officially accepted for <span style="color: #2196f3;">GSSoC!</span></b>
</p>

<div align="center">
  <img src="public/assets/gssoc.png" alt="GSSOC" width="80%" style="border-radius: 15px; box-shadow: 0px 5px 15px rgba(0,0,0,0.2);">
</div>

<div align="center">
 <a href="https://frame-avatars.vercel.app/"><strong>Explore the Live Demo »</strong></a>
    <br />
    <br />
  
[Report Bug](https://github.com/TechQuanta/github-avatar-frame-api/issues) • [Request Feature](https://github.com/TechQuanta/github-avatar-frame-api/issues)

</div>

 <img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="100%">

<br>

# 🖼️ GitHub Avatar Frame API

<!-- ✅ (2) Added modern badges for repo stats instead of the old table -->
<table align="center" style="width: 90%; border-collapse: collapse; font-size: 0.95em;">
<thead>
<tr style="background-color:#f5f5f5; text-align:center;">
<th>🌟 Stars</th>
<th>🍴 Forks</th>
<th>🐛 Issues</th>
<th>🔔 Open PRs</th>
<th>🔕 Closed PRs</th>
<th>🛠️ Languages</th>
<th>👥 Contributors</th>
</tr>
</thead>
<tbody align="center">
<tr style="background-color:#fafafa;">
<td><img alt="Stars" src="https://img.shields.io/github/stars/TechQuanta/github-avatar-frame-api?style=flat&logo=github"/></td>
<td><img alt="Forks" src="https://img.shields.io/github/forks/TechQuanta/github-avatar-frame-api?style=flat&logo=github"/></td>
<td><img alt="Issues" src="https://img.shields.io/github/issues/TechQuanta/github-avatar-frame-api?style=flat&logo=github"/></td>
<td><img alt="Open PRs" src="https://img.shields.io/github/issues-pr/TechQuanta/github-avatar-frame-api?style=flat&logo=github"/></td>
<td><img alt="Closed PRs" src="https://img.shields.io/github/issues-pr-closed/TechQuanta/github-avatar-frame-api?style=flat&color=critical&logo=github"/></td>
<td><img alt="Languages Count" src="https://img.shields.io/github/languages/count/TechQuanta/github-avatar-frame-api?style=flat&color=green&logo=github"/></td>
<td><img alt="Contributors Count" src="https://img.shields.io/github/contributors/TechQuanta/github-avatar-frame-api?style=flat&color=blue&logo=github"/></td>
</tr>
</tbody>
</table>

<br><hr><br>

## 📚 Table of Contents
- [✨ Vision](#-vision)
- [🎯 Mission](#-mission)
- [⚙️ Setup & Local Development](#️-setup--local-development)
- [📂 Project Structure](#-project-structure)
- [📌 API Usage](#-api-usage)
- [🧮 Query Parameters](#-query-parameters)
- [💡 Why GitHub Avatar Frame API?](#-why-github-avatar-frame-api)
- [🤝 Contributing](#-contributing)
- [🛠️ Troubleshooting](#️-troubleshooting)
- [📜 License](#-license)

---

## ✨ Vision
<p style="font-size: 1.1em;">
Democratize creative avatar customization by providing a free, open-source API that transforms GitHub profiles into engaging visual experiences for developers worldwide.
</p>

 <img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="100%">

<h2 style="color:#ff5722;">🎯 Mission</h2>
<p style="font-size: 1.1em;">
<ul>
 <li>🏗️ Build the most comprehensive and user-friendly avatar framing API</li>
<li>💪 Empower developers to personalize their GitHub presence with minimal effort</li>
<li>🎨 Foster creative expression through customizable themes, text, and emoji overlays</li>
<li>🆓 Maintain a free, accessible service that supports the open-source community</li>
</ul>
</p>

 <img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="100%">

<h2 style="color:#673ab7;">🎨 About GitHub Avatar Frame API</h2>

<p style="font-size: 1.1em;">
A free and open-source API to frame your GitHub avatar using creative themes. Perfect for README files, portfolios, or social media.
</p>

<p style="font-size: 1.1em;">
<b>🌐 Live API:</b> <a href="https://github-avatar-frame-api.onrender.com" style="color:#ff4081; font-weight:bold;">https://github-avatar-frame-api.onrender.com</a>
</p>

<br>
 <img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="100%">

 ## ⚙️ Setup & Local Development

Follow these steps to run the GitHub Avatar Frame API locally for development or testing:

### 🧩 Prerequisites
- 🟢 Node.js 16+ and npm installed
- 🐙 Git for version control
- 🖥️ Code editor (VS Code recommended)
- 📦 Optional: TypeScript knowledge for contributing

### 💻 Steps
### 1. Clone the Repository
```bash
git clone https://github.com/TechQuanta/github-avatar-frame-api.git
cd github-avatar-frame-api
```

### 2. Install Backend Dependencies
```bash
npm install
```

### 3. Setup Frontend
```bash
cd client
npm install
cd ..
```

## Running the Application

### Start Backend (Terminal 1)
```bash
npm run dev
```

The backend will start on `http://localhost:3000`

### Start Frontend (Terminal 2)
```bash
cd client
npm run dev
```

The frontend will start on `http://localhost:5173` (or another port if 5173 is in use)

## Verify Everything Works

1. Open your browser and go to `http://localhost:5173`
2. You should see the GitHub Avatar Frames interface
3. Enter a GitHub username (e.g., "torvalds")
4. Select a theme and click "Generate"
5. If successful, your framed avatar will appear
---

## 📂 Project Structure

```
📦 github-avatar-frame-api
├── 🖥️ api
│   ├── 📄 FRAMETHEMES.md
│   ├── 🖼️ collage.js
│   ├── 🖼️ frames.js
│   ├── 🚀 server.ts
│   └── 🎨 themes.js
├── 🌐 client
│   ├── src
│   │   ├── components
│   │   │   └── 🧩 ThemeSlider.jsx
│   │   ├── pages
│   │   │   └── 📄 NotFound.jsx
│   │   ├── 🎨 App.css
│   │   ├── 📄 App.jsx
│   │   ├── 🎨 index.css
│   │   └── 🚀 main.jsx
│   ├── 📄 index.html
│   ├── ⚡ vite.config.js
│   └── 🌍 vercel.json
├── 🖼️ public
│   └── assets
│       └── 🖼️ gssoc.png
├── 📄 README.md
├── 📄 LICENSE
├── 📄 CODE_OF_CONDUCT.md
├── 📄 CONTRIBUTING.md
├── 📄 CUSTOMIZATION_FEATURE.md
├── 📝 TODO.md
├── 📦 package.json
├── ⚙️ render.yml
└── 📄 tsconfig.server.json
```
 
<h2 style="color:#ff5722;">💡 Why GitHub Avatar Frame API?</h2>
<p style="font-size: 1.1em;">
  <ul>
<li>🆓 Zero Setup: No registration, API keys, or complex configurations needed</li>
<li>⚡ Instant Results: Real-time avatar processing with customizable themes</li>
<li>👨‍💻 Developer-Friendly: Simple REST API with comprehensive documentation</li>
<li>🎭 Creative Freedom: Text overlays, emojis, multiple themes, and shape options</li>
<li>🔓 Open Source: Community-driven development with transparent contributions</li>
<li>💖 Always Free: No usage limits or premium tiers—built for the community</li>
  </ul>
</p>

 <img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="100%">

<h2 style="color:#3f51b5;">📌 API Usage</h2>

<p style="font-size:1.05em;"><b>🔗 Base Endpoint:</b></p>
<pre style="background-color:#f9f9f9; padding:10px; border-radius:10px;">
https://github-avatar-frame-api.onrender.com/api/framed-avatar/{username}?theme={theme}&size={size}&canvas={canvas}&shape={shape}&radius={radius}
</pre>

 <img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="100%">

<h2 style="color:#3f51b5;">🧭 Flowchart</h2>
<div align=center>
 <img width="360" height="600" alt="Untitled diagram-2025-10-14-005556" src="https://github.com/user-attachments/assets/fd49b6b8-07b3-4fa6-ab66-48cc40eb0c38"  />
</div>

<h3 style="color:#009688;" align=center>🧮 Query Parameters:</h3>
<div align=center>
<table style="width:100%; border-collapse:collapse; font-size:1.05em;">
<thead style="background-color:#f5f5f5; text-align:center;">
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Default</th>
<th>Description</th>
<th>Example</th>
</tr>
</thead>
<tbody style="text-align:center;">
<tr><td>username</td><td>string</td><td>required</td><td>GitHub username</td><td>octocat</td></tr>
<tr><td>theme</td><td>string</td><td>base</td><td>Frame theme (eternity, base, flamingo)</td><td>flamingo</td></tr>
<tr><td>size</td><td>integer</td><td>256</td><td>Avatar size in px (64–1024)</td><td>300</td></tr>
<tr><td>canvas</td><td>string</td><td>light</td><td>Background color of avatar canvas: light / dark</td><td>dark</td></tr>
<tr><td>shape</td><td>string</td><td>circle</td><td>Avatar shape: circle or rounded</td><td>rounded</td></tr>
<tr><td>radius</td><td>integer</td><td>25</td><td>Corner radius for rounded shape in px</td><td>50</td></tr>
<tr><td>text</td><td>string</td><td>optional</td><td>Custom text to display on avatar</td><td>Hello World</td></tr>
<tr><td>textColor</td><td>string</td><td>#ffffff</td><td>Color of text in HEX format</td><td>#ff0000</td></tr>
<tr><td>textSize</td><td>integer</td><td>20</td><td>Size of text in pixels (8-100)</td><td>24</td></tr>
<tr><td>textPosition</td><td>string</td><td>bottom</td><td>Position of text: top / bottom / center</td><td>top</td></tr>
<tr><td>emojis</td><td>string</td><td>optional</td><td>Comma-separated list of emojis</td><td>🚀,💻,🔥</td></tr>
<tr><td>emojiSize</td><td>integer</td><td>40</td><td>Size of emojis in pixels (16-120)</td><td>30</td></tr>
<tr><td>emojiPosition</td><td>string</td><td>top</td><td>Position of emojis: top / bottom / corners</td><td>corners</td></tr>
</tbody>
</table>

</div>
<br>

<h3 style="color:#ff4081;">🧱 Canvas, Shape & Radius Explained</h3>

<ul style="font-size:1.05em;">
<li>🎨 <b>canvas</b>: Sets the avatar background color. Options: <code>light</code> or <code>dark</code>.</li>
<li>🔷 <b>shape</b>: Sets the avatar outline. Options: <code>circle</code> or <code>rounded</code>.</li>
<li>📐 <b>radius</b>: Controls corner rounding in px when <code>shape=rounded</code>. 0 = square, higher = more rounded.</li>
</ul>

<p>Combine all three to customize your avatar:</p>

<h3 style="color:#ff4081;">✍️ Text & Emoji Overlays</h3>

<p style="font-size:1.05em;">Add personalized text and emojis to make your avatar more expressive:</p>

<ul style="font-size:1.05em;">
<li>📝 <b>text</b>: Add custom text like your name, role, or tagline.</li>
<li>🎨 <b>textColor</b>: Set text color using HEX format (e.g., #ff0000 for red).</li>
<li>🔠 <b>textSize</b>: Control text size from 8-100 pixels.</li>
<li>📍 <b>textPosition</b>: Place text at top, bottom, or center of the avatar.</li>
<li>😀 <b>emojis</b>: Add multiple emojis separated by commas (e.g., 🚀,💻,🔥).</li>
<li>📏 <b>emojiSize</b>: Control emoji size from 16-120 pixels.</li>
<li>📍 <b>emojiPosition</b>: Place emojis at top, bottom, or in corners.</li>
</ul>

<p><b>📌 Example with text and emojis:</b></p>
<pre style="background-color:#f9f9f9; padding:10px; border-radius:10px;">
https://github-avatar-frame-api.onrender.com/api/framed-avatar/octocat?theme=base&text=GitHub%20User&textColor=%23ffffff&textSize=20&textPosition=bottom&emojis=%F0%9F%9A%80%2C%F0%9F%92%BB%2C%F0%9F%94%A5&emojiSize=30&emojiPosition=top
</pre>
<div align=center>
<table style="width:100%; border-collapse:collapse; font-size:1.05em; text-align:center;">
<thead style="background-color:#f5f5f5;">
<tr>
<th>Canvas</th>
<th>Shape</th>
<th>Radius</th>
<th>Example URL</th>
<th>Preview</th>
</tr>
</thead>
<tbody>
<tr>
<td>light</td>
<td>circle</td>
<td>-</td>
<td><a href="https://github-avatar-frame-api.onrender.com/api/framed-avatar/octocat?canvas=light&shape=circle" target="_blank">URL</a></td>
<td><img src="https://github-avatar-frame-api.onrender.com/api/framed-avatar/octocat?theme=classic&size=256&shape=circle&radius=15&canvas=light" width="80"></td>
</tr>
<tr>
<td>dark</td>
<td>circle</td>
<td>-</td>
<td><a href="https://github-avatar-frame-api.onrender.com/api/framed-avatar/octocat?canvas=dark&shape=circle" target="_blank">URL</a></td>
<td><img src="https://github-avatar-frame-api.onrender.com/api/framed-avatar/octocat?theme=gitblaze&size=256&shape=circle&radius=15&canvas=dark" width="80"></td>
</tr>
<tr>
<td>light</td>
<td>rounded</td>
<td>20</td>
<td><a href="https://github-avatar-frame-api.onrender.com/api/framed-avatar/octocat?canvas=light&shape=rounded&radius=20" target="_blank">URL</a></td>
<td><img src="https://github-avatar-frame-api.onrender.com/api/framed-avatar/octocat?canvas=light&shape=rounded&radius=20&size=100&theme=base" width="80"></td>
</tr>
<tr>
<td>dark</td>
<td>rounded</td>
<td>50</td>
<td><a href="https://github-avatar-frame-api.onrender.com/api/framed-avatar/octocat?canvas=dark&shape=rounded&radius=50" target="_blank">URL</a></td>
<td><img src="https://github-avatar-frame-api.onrender.com/api/framed-avatar/octocat?theme=starry&size=256&shape=rounded&radius=20&canvas=dark" width="80"></td>
</tr>
</tbody>
</table>
</div>
<br>

 <img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="100%">
 
<h3 style="color:#ff4081;">🧪 Live Examples by Theme</h3>

<table style="width:100%; border-collapse:collapse; font-size:1.05em; text-align:center;" align=center>
<thead style="background-color:#f5f5f5;">
<tr>
<th>Theme</th>
<th>Canvas / Shape / Radius</th>
<th>Preview</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>eternity</td>
<td>light / circle / 0</td>
<td><img src="https://github-avatar-frame-api.onrender.com/api/framed-avatar/as?theme=ocean&size=100&canvas=light&shape=circle&radius=0" width="80"></td>
<td>Classic eternity theme, light background, circular avatar</td>
</tr>
<tr>
<td>eternity</td>
<td>dark / circle / 0</td>
<td><img src="https://github-avatar-frame-api.onrender.com/api/framed-avatar/octocat?theme=eternity&size=100&canvas=dark&shape=circle&radius=0" width="80"></td>
<td>Dark canvas version of eternity theme</td>
</tr>
<tr>
<td>base</td>
<td>light / rounded / 20</td>
<td><img src="https://github-avatar-frame-api.onrender.com/api/framed-avatar/octocat?theme=darkmode&size=100&canvas=light&shape=rounded&radius=20" width="80"></td>
<td>Base theme, light background, rounded corners 20px</td>
</tr>
<tr>
<td>base</td>
<td>light / rounded / 50</td>
<td><img src="https://github-avatar-frame-api.onrender.com/api/framed-avatar/octocat?theme=neon&size=100&canvas=light&shape=rounded&radius=50" width="80"></td>
<td>Base theme, light background, rounded corners 50px</td>
</tr>
<tr>
<td>flamingo</td>
<td>dark / circle / 0</td>
<td><img src="https://github-avatar-frame-api.onrender.com/api/framed-avatar/octocat?theme=flamingo&size=100&canvas=dark&shape=circle&radius=0" width="80"></td>
<td>Flamingo theme, dark canvas</td>
</tr>
<tr>
<td>flamingo</td>
<td>light / rounded / 30</td>
<td><img src="https://github-avatar-frame-api.onrender.com/api/framed-avatar/octocat?theme=macros&size=100&canvas=light&shape=rounded&radius=30" width="80"></td>
<td>Flamingo theme, light canvas, rounded corners 30px</td>
</tr>
</tbody>
</table>

<br>

<h3 style="color:#3f51b5;" align=left>📥 Embed in README</h3>

<pre style="background-color:#f0f0f0; padding:10px; border-radius:10px;">
![My Avatar](https://github-avatar-frame-api.onrender.com/api/framed-avatar/your-username?theme=flamingo&size=256&canvas=dark&shape=rounded&radius=20)
</pre>

 <img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="100%">

<h2 style="color:#ff5722;">🧩 Prerequisites</h2>
<p style="font-size: 1.1em;">
<p>
  <ul>
For API Usage:
<li>Any modern web browser or HTTP client</li>
<li>Valid GitHub username</li>
<li>Basic understanding of URL parameters</li>
  
For Development/Contributing:
<li>Node.js 16+ and npm</li>
<li>TypeScript knowledge</li>
<li>Git for version control</li>
<li>Code editor (VS Code recommended)</li>
</ul>
</p>

 <img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="100%">

<h2 style="color:#ff5722;">🤝 Contributing</h2>

<ul style="font-size:1.05em;">
<li>🎨 Add new themes in <code>public/frames/</code></li>
<li>🐛 Bug fixes</li>
<li>✨ New features</li>
<li>📚 Improve documentation</li>
</ul>

 <img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="100%">

<h2 style="color:#673ab7;">⚙ Tech Stack</h2>

<ul style="font-size:1.05em;">
<li>🟢 Node.js & Express.js (TypeScript)</li>
<li>🖼️ Sharp (image processing)</li>
<li>☁️ Render (hosting)</li>
<li>📘 TypeScript</li>
</ul>

 <img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="100%">

<h2 style="color:#673ab7;">🖼️ Screenshot</h2>
<img width="785" height="756" alt="Screenshot 2025-10-14 113128" src="https://github.com/user-attachments/assets/df7698d1-710b-4eed-a714-2e624a6b31e0" />


<h2 style="color:#3f51b5;">🔗 Links</h2>

<ul style="font-size:1.05em;">
<li>Live API: <a href="https://github-avatar-frame-api.onrender.com">https://github-avatar-frame-api.onrender.com</a></li>
<li>Issues: <a href="https://github.com/TechQuanta/github-avatar-frame-api/issues">GitHub Issues</a></li>
<li>Contributing Guidelines: <a href="CONTRIBUTING.md">CONTRIBUTING.md</a></li>
<li>Code of Conduct: <a href="CODE_OF_CONDUCT.md">CODE_OF_CONDUCT.md</a></li>
</ul>

 <img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="100%">

<h2 style="color:#ff4081;">🌟 Show Your Support</h2>

<ul style="font-size:1.05em;">
<li>⭐ Star the repository</li>
<li>🐛 Report bugs or suggest features</li>
<li>🤝 Contribute new themes</li>
<li>📢 Share with the community</li>
</ul>

 <img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="100%">
 
<h2 style="color:#3f51b5;">🛠️ Troubleshooting</h2>
<p>
<h3>🧩 API Issues:</h3>
<h3>🖼️ Avatar not loading</h3>
  <ul>
<li>Check if GitHub username is valid</li>
<li>Verify theme name spelling (eternity, base, flamingo)</li>
<li>Ensure size is between 64-1024 pixels</li>
  </ul>
<h3>🐢 Slow response times</h3>
<ul>
<li>API may be cold-starting (hosted on Render free tier)</li>
<li>Wait 10-15 seconds for first request</li>
<li>Subsequent requests will be faster</li>
</ul>

🔧 Development Issues:
🧰 Installation problems

```npm cache clean --force```
```rm -rf node_modules package-lock.json```
```npm install```

🔌 Port conflicts
🔎 Check if port 3000 is in use
```netstat -ano | findstr :3000```
Kill process or change port in server config
</p>

 <img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="100%">

<h2 style="color:#009688;">📜 License</h2>
<a href="https://github.com/TechQuanta/github-avatar-frame-api?tab=MIT-1-ov-file">MIT License </a>

<div align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&pause=1000&color=FF0000&width=435&lines=Thanks+for+visiting++;GitHub+Avatar+Frame+API+%F0%9F%99%8C;Star+the+repo+%E2%AD%90;Contribute+and+Grow+%F0%9F%8C%8D;Happy+Coding+%E2%9C%A8" alt="Typing SVG" />
</div>
<div align="center">
<img src="https://user-images.githubusercontent.com/74038190/212284158-e840e285-664b-44d7-b79b-e264b5e54825.gif" width="400">
<br><br>
