#!/usr/bin/env node

import { Command } from 'commander';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

const program = new Command();

program
  .name('github-avatar-frame')
  .description('CLI tool for generating framed GitHub avatars')
  .version('1.0.0');

program
  .command('generate <username>')
  .description('Generate a framed avatar for a GitHub user')
  .option('-t, --theme <theme>', 'Frame theme (base, classic, darkmode, eternity, flamingo, gitblaze, macros, minimal, neon, ocean, starry)', 'base')
  .option('-s, --size <size>', 'Avatar size in pixels (64-1024)', '256')
  .option('-c, --canvas <canvas>', 'Background color (light, dark)', 'light')
  .option('-sh, --shape <shape>', 'Avatar shape (circle, rounded)', 'circle')
  .option('-r, --radius <radius>', 'Corner radius for rounded shape', '25')
  .option('-tx, --text <text>', 'Custom text to display')
  .option('-tc, --text-color <color>', 'Text color in HEX format', '#ffffff')
  .option('-ts, --text-size <size>', 'Text size in pixels (8-100)', '20')
  .option('-tp, --text-position <position>', 'Text position (top, bottom, center)', 'bottom')
  .option('-e, --emojis <emojis>', 'Comma-separated list of emojis')
  .option('-es, --emoji-size <size>', 'Emoji size in pixels (16-120)', '40')
  .option('-ep, --emoji-position <position>', 'Emoji position (top, bottom, corners)', 'top')
  .option('-o, --output <file>', 'Output file path', 'avatar.png')
  .option('-u, --url <url>', 'API base URL', 'https://github-avatar-frame-api.onrender.com')
  .action(async (username, options) => {
    try {
      console.log(chalk.blue(`Generating avatar for ${username}...`));

      // Build query parameters
      const params: Record<string, string> = {
        theme: options.theme,
        size: options.size,
        canvas: options.canvas,
        shape: options.shape,
        radius: options.radius,
        textColor: options.textColor,
        textSize: options.textSize,
        textPosition: options.textPosition,
        emojiSize: options.emojiSize,
        emojiPosition: options.emojiPosition,
      };

      if (options.text) params.text = options.text;
      if (options.emojis) params.emojis = options.emojis;

      // Build URL
      const baseUrl = options.url;
      const queryString = new URLSearchParams(params).toString();
      const url = `${baseUrl}/api/framed-avatar/${username}?${queryString}`;

      console.log(chalk.gray(`API URL: ${url}`));

      // Fetch the image
      const response = await axios.get(url, {
        responseType: 'arraybuffer',
        timeout: 30000,
      });

      // Save to file
      const outputPath = path.resolve(options.output);
      fs.writeFileSync(outputPath, response.data);

      console.log(chalk.green(`✅ Avatar saved to ${outputPath}`));
      console.log(chalk.gray(`Size: ${options.size}px, Theme: ${options.theme}, Shape: ${options.shape}`));

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
  .description('List available themes')
  .action(() => {
    console.log(chalk.blue('Available themes:'));
    const themes = [
      'base', 'classic', 'darkmode', 'eternity', 'flamingo',
      'gitblaze', 'macros', 'minimal', 'neon', 'ocean', 'starry'
    ];
    themes.forEach(theme => console.log(chalk.green(`  • ${theme}`)));
  });

program
  .command('info')
  .description('Show API information')
  .action(() => {
    console.log(chalk.blue('GitHub Avatar Frame API CLI'));
    console.log(chalk.gray('Generate custom framed avatars for GitHub users'));
    console.log('');
    console.log(chalk.yellow('API Endpoint: https://github-avatar-frame-api.onrender.com'));
    console.log(chalk.yellow('Documentation: Check the main repository README'));
    console.log('');
    console.log(chalk.gray('Commands:'));
    console.log(chalk.gray('  generate <username>  - Generate framed avatar'));
    console.log(chalk.gray('  suggest <username>   - Get AI-powered theme suggestions'));
    console.log(chalk.gray('  themes               - List available themes'));
    console.log(chalk.gray('  info                 - Show this information'));
    console.log('');
    console.log(chalk.gray('Use "github-avatar-frame <command> --help" for more details'));
  });

program
  .command('suggest <username>')
  .description('Get AI-powered frame suggestions for a GitHub user')
  .option('-u, --url <url>', 'API base URL', 'https://github-avatar-frame-api.onrender.com')
  .action(async (username, options) => {
    try {
      console.log(chalk.blue(`🤖 Getting AI suggestions for ${username}...`));

      // Make request to AI suggestion endpoint
      const response = await axios.get(`${options.url}/api/ai-suggest/${username}`, {
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