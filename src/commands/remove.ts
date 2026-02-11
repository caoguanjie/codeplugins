import { existsSync, rmSync } from 'fs';
import chalk from 'chalk';
import { confirm } from '@inquirer/prompts';
import { ExitPromptError } from '@inquirer/core';
import { readMarketplaceJson } from '../utils/plugin-meta.js';
import {
  readSettings,
  writeSettings,
  disablePluginsByMarketplace,
  removeMarketplace,
} from '../utils/config.js';
import { getPluginDir } from '../utils/paths.js';
import type { RemoveOptions } from '../types.js';

export async function removeCommand(
  name: string,
  options: RemoveOptions
): Promise<void> {
  const pluginDir = getPluginDir(name);

  if (!existsSync(pluginDir)) {
    console.error(chalk.red(`Plugin '${name}' not found in .claude/plugins/`));
    process.exit(1);
  }

  // Read marketplace info before deletion
  const marketplace = readMarketplaceJson(pluginDir);
  const marketplaceName = marketplace?.name;

  // Confirm deletion
  if (!options.yes) {
    try {
      const shouldRemove = await confirm({
        message: `Remove plugin '${name}'? This will delete the directory and update config.`,
        default: false,
      });
      if (!shouldRemove) {
        console.log(chalk.yellow('Removal cancelled.'));
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

  // Delete plugin directory
  rmSync(pluginDir, { recursive: true, force: true });
  console.log(chalk.green(`  ✔ Deleted: .claude/plugins/${name}/`));

  // Update settings.local.json
  if (marketplaceName) {
    let settings = readSettings();
    settings = disablePluginsByMarketplace(settings, marketplaceName);
    settings = removeMarketplace(settings, marketplaceName);
    writeSettings(settings);
    console.log(chalk.green(`  ✔ Removed config for marketplace: ${marketplaceName}`));
  }

  console.log(chalk.green(`\n✅ Plugin '${name}' removed successfully`));
}
