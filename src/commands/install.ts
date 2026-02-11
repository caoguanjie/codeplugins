import { existsSync, rmSync } from 'fs';
import chalk from 'chalk';
import { confirm, checkbox } from '@inquirer/prompts';
import { ExitPromptError } from '@inquirer/core';
import { parseSource, cloneRepo } from '../utils/git.js';
import { readMarketplaceJson } from '../utils/plugin-meta.js';
import {
  readSettings,
  writeSettings,
  enablePlugin,
  addMarketplace,
} from '../utils/config.js';
import { getPluginDir, getRelativePluginPath } from '../utils/paths.js';
import type { InstallOptions, PluginEntry } from '../types.js';

export async function installCommand(
  source: string,
  options: InstallOptions
): Promise<void> {
  // 1. Parse input
  const { url, repoName } = parseSource(source);
  const pluginDir = getPluginDir(repoName);

  console.log(`Installing from: ${chalk.cyan(source)}`);
  console.log(`Target: ${chalk.blue(pluginDir)}\n`);

  // 2. Check if already exists
  if (existsSync(pluginDir)) {
    if (!options.yes) {
      try {
        const shouldOverwrite = await confirm({
          message: chalk.yellow(
            `Plugin directory '${repoName}' already exists. Overwrite?`
          ),
          default: false,
        });
        if (!shouldOverwrite) {
          console.log(chalk.yellow('Installation cancelled.'));
          return;
        }
      } catch (error) {
        if (error instanceof ExitPromptError) {
          console.log(chalk.yellow('\nCancelled by user'));
          process.exit(0);
        }
        throw error;
      }
    }
    rmSync(pluginDir, { recursive: true, force: true });
  }

  // 3. Clone repository
  cloneRepo(url, pluginDir);

  // 4. Read marketplace.json
  const marketplace = readMarketplaceJson(pluginDir);
  if (!marketplace) {
    console.error(
      chalk.red(
        'Error: No .claude-plugin/marketplace.json found in cloned repository'
      )
    );
    console.error(
      chalk.dim('This repository may not be a valid Claude Code plugin.')
    );
    rmSync(pluginDir, { recursive: true, force: true });
    process.exit(1);
  }

  const marketplaceName = marketplace.name;
  console.log(`\nMarketplace: ${chalk.bold(marketplaceName)}`);
  console.log(`Description: ${chalk.dim(marketplace.description)}`);

  // 5. Select plugins to enable
  let selectedPlugins: PluginEntry[];

  if (marketplace.plugins.length === 0) {
    console.error(chalk.red('Error: No plugins defined in marketplace.json'));
    process.exit(1);
  } else if (marketplace.plugins.length === 1 || options.yes) {
    selectedPlugins = marketplace.plugins;
  } else {
    // Interactive selection for multiple plugins
    try {
      const choices = marketplace.plugins.map((plugin) => ({
        name: `${chalk.bold(plugin.name.padEnd(25))} v${plugin.version}`,
        value: plugin.name,
        description: plugin.description.slice(0, 80),
        checked: true,
      }));

      const selected = await checkbox({
        message: 'Select plugins to enable',
        choices,
        pageSize: 15,
      });

      if (selected.length === 0) {
        console.log(chalk.yellow('No plugins selected.'));
        // Still keep the cloned repo, just don't enable anything
        console.log(
          chalk.dim(`Repository cloned to ${pluginDir} but no plugins enabled.`)
        );
        return;
      }

      selectedPlugins = marketplace.plugins.filter((p) =>
        selected.includes(p.name)
      );
    } catch (error) {
      if (error instanceof ExitPromptError) {
        console.log(chalk.yellow('\nCancelled by user'));
        process.exit(0);
      }
      throw error;
    }
  }

  // 6. Update settings.local.json
  let settings = readSettings();
  const relativePath = getRelativePluginPath(repoName);

  // Add marketplace
  settings = addMarketplace(settings, marketplaceName, relativePath);

  // Enable selected plugins
  for (const plugin of selectedPlugins) {
    settings = enablePlugin(settings, plugin.name, marketplaceName);
    console.log(
      chalk.green(`  ✔ Enabled: ${plugin.name}@${marketplaceName}`)
    );
  }

  writeSettings(settings);

  console.log(
    chalk.green(
      `\n✅ Installation complete: ${selectedPlugins.length} plugin(s) enabled`
    )
  );
  console.log(chalk.dim(`Config updated: .claude/settings.local.json`));
}
