<!-- GSSoC Banner -->
<h1 align="center" style="font-size: 3em; color: #ff4081;">
  GitHub Avatar Frame API
</h1>

<p align="center" style="font-size: 1.3em;">
  <b>Officially accepted for <span style="color: #2196f3;">GSSoC!</span></b>
</p>

<div align="center">
  <img src="public/assets/gssoc.png" alt="GSSOC" width="80%" style="border-radius: 15px; box-shadow: 0px 5px 15px rgba(0,0,0,0.2);">
</div>

<br>

<h2 align="center" style="color:#ff5722;">📊 Project Insights</h2>

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

<h2 style="color:#673ab7;">🎨 About GitHub Avatar Frame API</h2>

<p style="font-size: 1.1em;">
A free and open-source API to frame your GitHub avatar using creative themes. Perfect for README files, portfolios, or social media.
</p>

<p style="font-size: 1.1em;">
<b>🌐 Live API:</b> <a href="https://github-avatar-frame-api.onrender.com" style="color:#ff4081; font-weight:bold;">https://github-avatar-frame-api.onrender.com</a>
</p>

<br>

<h2 style="color:#3f51b5;">📌 API Usage</h2>

<p style="font-size:1.05em;"><b>Base Endpoint:</b></p>
<pre style="background-color:#f9f9f9; padding:10px; border-radius:10px;">
https://github-avatar-frame-api.onrender.com/api/framed-avatar/{username}?theme={theme}&size={size}&canvas={canvas}&shape={shape}&radius={radius}
</pre>

<h3 style="color:#009688;" align=center>Query Parameters:</h3>
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
</tbody>
</table>

</div>
<br>

<h3 style="color:#ff4081;">Canvas, Shape & Radius Explained</h3>

<ul style="font-size:1.05em;">
<li><b>canvas</b>: Sets the avatar background color. Options: <code>light</code> or <code>dark</code>.</li>
<li><b>shape</b>: Sets the avatar outline. Options: <code>circle</code> or <code>rounded</code>.</li>
<li><b>radius</b>: Controls corner rounding in px when <code>shape=rounded</code>. 0 = square, higher = more rounded.</li>
</ul>

<p>Combine all three to customize your avatar:</p>
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
<td><img src="https://github-avatar-frame-api.onrender.com/api/framed-avatar/octocat?theme=classic&size=256&shape=circle&radius=15&canvas=dark" width="80"></td>
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
<td><img src="https://github-avatar-frame-api.onrender.com/api/framed-avatar/octocat?theme=classic&size=256&shape=rounded&radius=20&canvas=dark" width="80"></td>
</tr>
</tbody>
</table>
</div>
<br>

<h3 style="color:#ff4081;">Live Examples by Theme</h3>

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
<td><img src="https://github-avatar-frame-api.onrender.com/api/framed-avatar/octocat?theme=eternity&size=100&canvas=light&shape=circle&radius=0" width="80"></td>
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
<td><img src="https://github-avatar-frame-api.onrender.com/api/framed-avatar/octocat?theme=base&size=100&canvas=light&shape=rounded&radius=20" width="80"></td>
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
<td><img src="https://github-avatar-frame-api.onrender.com/api/framed-avatar/octocat?theme=flamingo&size=100&canvas=light&shape=rounded&radius=30" width="80"></td>
<td>Flamingo theme, light canvas, rounded corners 30px</td>
</tr>
</tbody>
</table>

<br>

<h3 style="color:#3f51b5;" align=left>Embed in README</h3>

<pre style="background-color:#f0f0f0; padding:10px; border-radius:10px;">
![My Avatar](https://github-avatar-frame-api.onrender.com/api/framed-avatar/your-username?theme=flamingo&size=256&canvas=dark&shape=rounded&radius=20)
</pre>

---

<h2 style="color:#ff5722;">🤝 Contributing</h2>

<ul style="font-size:1.05em;">
<li>🎨 Add new themes in <code>public/frames/</code></li>
<li>🐛 Bug fixes</li>
<li>✨ New features</li>
<li>📚 Improve documentation</li>
</ul>

---

<h2 style="color:#673ab7;">⚙ Tech Stack</h2>

<ul style="font-size:1.05em;">
<li>Node.js & Express.js (TypeScript)</li>
<li>Sharp (image processing)</li>
<li>Render (hosting)</li>
<li>TypeScript</li>
</ul>

---

<h2 style="color:#3f51b5;">🔗 Links</h2>

<ul style="font-size:1.05em;">
<li>Live API: <a href="https://github-avatar-frame-api.onrender.com">https://github-avatar-frame-api.onrender.com</a></li>
<li>Issues: <a href="https://github.com/TechQuanta/github-avatar-frame-api/issues">GitHub Issues</a></li>
<li>Contributing Guidelines: <a href="CONTRIBUTING.md">CONTRIBUTING.md</a></li>
<li>Code of Conduct: <a href="CODE_OF_CONDUCT.md">CODE_OF_CONDUCT.md</a></li>
</ul>

---

<h2 style="color:#ff4081;">🌟 Show Your Support</h2>

<ul style="font-size:1.05em;">
<li>⭐ Star the repository</li>
<li>🐛 Report bugs or suggest features</li>
<li>🤝 Contribute new themes</li>
<li>📢 Share with the community</li>
</ul>

---

<h2 style="color:#009688;">📜 License</h2>
<p style="font-size:1.05em;">MIT License</p>
