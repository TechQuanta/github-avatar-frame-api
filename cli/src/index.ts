#!/usr/bin/env node

import { Command } from 'commander';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

const program = new Command();
const DEFAULT_API_URL = 'https://github-avatar-frame-api.onrender.com';
const THEMES = [
  'base', 'classic', 'darkmode', 'eternity', 'flamingo',
  'gitblaze', 'gravityspace', 'hotfire', 'macros', 'minimal', 'neon', 'ocean', 'starry'
];
const THEME_GROUPS: Record<string, string[]> = {
  'Clean & Simple': ['base', 'classic', 'minimal'],
  'Dark & Glow': ['darkmode', 'neon', 'starry', 'gravityspace'],
  'Color Pop': ['flamingo', 'gitblaze', 'hotfire', 'ocean', 'eternity', 'macros'],
};

function printHero(title: string, subtitle?: string) {
  console.log(chalk.magentaBright('┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓'));
  console.log(chalk.magentaBright('┃') + chalk.bold('  ✨ GitHub Avatar Frame Studio CLI       ') + chalk.magentaBright('┃'));
  console.log(chalk.magentaBright('┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛'));
  console.log(chalk.cyanBright(`\n${title}`));
  if (subtitle) console.log(chalk.gray(subtitle));
}

function normalizeBaseUrl(url: string) {
  return url.replace(/\/$/, '');
}

function resolveOutputPath(output: string, format: string) {
  const parsed = path.parse(output);
  const file = parsed.ext ? output : `${output}.${format === 'jpg' ? 'jpg' : format}`;
  return path.resolve(file);
}

program
  .name('github-avatar-frame')
  .description('Interactive CLI tool for generating framed GitHub avatars')
  .version('1.0.0');

program
  .command('generate <username>')
  .description('Generate a framed avatar for a GitHub user')
  .option('-t, --theme <theme>', 'Frame theme (base, classic, darkmode, eternity, flamingo, gitblaze, gravityspace, hotfire, macros, minimal, neon, ocean, starry)', 'base')
  .option('-s, --size <size>', 'Avatar size in pixels (64-1024)', '256')
  .option('-c, --canvas <canvas>', 'Background color (light, dark, transparent)', 'light')
  .option('-sh, --shape <shape>', 'Avatar shape (circle, rounded, rect)', 'circle')
  .option('-r, --radius <radius>', 'Corner radius for rounded/rect shape', '25')
  .option('-f, --format <format>', 'Output format (png, jpg, svg)', 'png')
  .option('-tx, --text <text>', 'Custom text to display')
  .option('-tc, --text-color <color>', 'Text color in HEX format', '#ffffff')
  .option('-ts, --text-size <size>', 'Text size in pixels (8-100)', '20')
  .option('-tp, --text-position <position>', 'Text position (top, bottom, center)', 'bottom')
  .option('-e, --emojis <emojis>', 'Comma-separated list of emojis')
  .option('-es, --emoji-size <size>', 'Emoji size in pixels (16-120)', '40')
  .option('-ep, --emoji-position <position>', 'Emoji position (top, bottom, corners)', 'top')
  .option('-o, --output <file>', 'Output file path or basename', 'avatar')
  .option('-u, --url <url>', 'API base URL', DEFAULT_API_URL)
  .action(async (username, options) => {
    try {
      const format = String(options.format).toLowerCase();
      printHero(`Creating avatar for ${chalk.bold(username)}`, `Theme ${options.theme} • ${options.size}px • ${format.toUpperCase()}`);

      const params: Record<string, string> = {
        theme: options.theme,
        size: options.size,
        canvas: options.canvas,
        shape: options.shape,
        radius: options.radius,
        format,
        textColor: options.textColor,
        textSize: options.textSize,
        textPosition: options.textPosition,
        emojiSize: options.emojiSize,
        emojiPosition: options.emojiPosition,
      };

      if (options.text) params.text = options.text;
      if (options.emojis) params.emojis = options.emojis;

      const baseUrl = normalizeBaseUrl(options.url);
      const queryString = new URLSearchParams(params).toString();
      const url = `${baseUrl}/api/framed-avatar/${encodeURIComponent(username)}?${queryString}`;

      console.log(chalk.gray(`\n↳ ${url}`));
      console.log(chalk.yellow('⏳ Rendering via API...'));

      const response = await axios.get(url, {
        responseType: 'arraybuffer',
        timeout: 30000,
      });

      const outputPath = resolveOutputPath(options.output, format);
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      fs.writeFileSync(outputPath, response.data);

      console.log(chalk.green(`\n✅ Avatar saved to ${outputPath}`));
      console.log(chalk.gray(`   Try: github-avatar-frame suggest ${username}`));
    } catch (error: any) {
      if (error.response) {
        console.error(chalk.red(`❌ API Error: ${error.response.status} - ${error.response.statusText}`));
        if (error.response.data) {
          try {
            const errorData = JSON.parse(error.response.data.toString());
            console.error(chalk.red(`Details: ${errorData.message || errorData.error}`));
          } catch {
            console.error(chalk.red(`Response: ${error.response.data.toString().slice(0, 200)}...`));
          }
        }
      } else if (error.code === 'ENOTFOUND') {
        console.error(chalk.red('❌ Network error: Unable to connect to the API'));
      } else {
        console.error(chalk.red(`❌ Error: ${error.message}`));
      }
      process.exit(1);
    }
  });

program
  .command('themes')
  .description('List available themes grouped by vibe')
  .action(() => {
    console.log(chalk.blue('Available themes:'));
    const themes = [
      'base', 'classic', 'darkmode', 'eternity', 'flamingo',
      'gitblaze', 'gravityspace', 'hotfire', 'macros', 'minimal', 'neon', 'ocean', 'starry'
    ];
    themes.forEach(theme => console.log(chalk.green(`  • ${theme}`)));
  });

program
  .command('info')
  .description('Show API information')
  .action(() => {
    printHero('GitHub Avatar Frame API CLI', 'Generate custom framed avatars for GitHub users');
    console.log(chalk.yellow(`API Endpoint: ${DEFAULT_API_URL}`));
    console.log(chalk.yellow(`Documentation: ${DEFAULT_API_URL}/api-docs`));
    console.log('');
    console.log(chalk.gray('Commands:'));
    console.log(chalk.gray('  generate <username>  - Generate framed avatar'));
    console.log(chalk.gray('  suggest <username>   - Get AI-powered theme suggestions'));
    console.log(chalk.gray('  themes               - List available themes'));
    console.log(chalk.gray('  docs                 - Show API docs links'));
    console.log(chalk.gray('  info                 - Show this information'));
  });

program
  .command('suggest <username>')
  .description('Get AI-powered frame suggestions for a GitHub user')
  .option('-u, --url <url>', 'API base URL', DEFAULT_API_URL)
  .action(async (username, options) => {
    try {
      printHero(`AI suggestions for ${username}`, 'Analyzing GitHub profile signals...');

      const response = await axios.get(`${normalizeBaseUrl(options.url)}/api/ai-suggest/${encodeURIComponent(username)}`, {
        timeout: 30000,
      });

      const data = response.data;

      console.log(chalk.green(`\n✅ AI Analysis Complete for ${data.username}`));
      console.log(chalk.gray(`Confidence: ${data.confidence}%`));

      console.log(chalk.yellow('\n🎨 Recommendations:'));
      console.log(`Theme: ${chalk.cyan(data.recommendations.theme)}`);
      console.log(`Canvas: ${chalk.cyan(data.recommendations.canvas)}`);
      console.log(`Shape: ${chalk.cyan(data.recommendations.shape)}`);

      console.log(chalk.yellow('\n📊 Analysis:'));
      console.log(`Activity Level: ${chalk.cyan(data.analysis.contributions.activityLevel)}`);
      console.log(`Followers: ${chalk.cyan(data.analysis.contributions.followers)}`);
      console.log(`Repositories: ${chalk.cyan(data.analysis.contributions.totalRepos)}`);
      console.log(`Total Stars: ${chalk.cyan(data.analysis.contributions.totalStars)}`);

      console.log(chalk.yellow('\n🧠 Reasoning:'));
      data.recommendations.reasoning.forEach((reason: string) => {
        console.log(`• ${reason}`);
      });

      console.log(chalk.yellow('\n🔗 Preview URL:'));
      console.log(chalk.blue(data.previewURL));

      console.log(chalk.gray('\n💡 Tip: Use this theme with the generate command!'));
    } catch (error: any) {
      if (error.response) {
        console.error(chalk.red(`❌ API Error: ${error.response.status} - ${error.response.statusText}`));
        if (error.response.data?.message) {
          console.error(chalk.red(`Details: ${error.response.data.message}`));
        }
      } else if (error.code === 'ENOTFOUND') {
        console.error(chalk.red('❌ Network error: Unable to connect to the API'));
      } else {
        console.error(chalk.red(`❌ Error: ${error.message}`));
      }
      process.exit(1);
    }
  });

program.parse();
