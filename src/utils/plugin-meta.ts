import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import chalk from 'chalk';
import type { MarketplaceJson, PluginJson } from '../types.js';

/**
 * Read marketplace.json from a plugin directory.
 */
export function readMarketplaceJson(pluginDir: string): MarketplaceJson | null {
  const filePath = join(pluginDir, '.claude-plugin', 'marketplace.json');
  if (!existsSync(filePath)) {
    return null;
  }
  try {
    const content = readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as MarketplaceJson;
  } catch {
    console.error(chalk.red(`Error reading marketplace.json in ${pluginDir}`));
    return null;
  }
}

/**
 * Read plugin.json from a plugin directory.
 */
export function readPluginJson(pluginDir: string): PluginJson | null {
  const filePath = join(pluginDir, '.claude-plugin', 'plugin.json');
  if (!existsSync(filePath)) {
    return null;
  }
  try {
    const content = readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as PluginJson;
  } catch {
    console.error(chalk.red(`Error reading plugin.json in ${pluginDir}`));
    return null;
  }
}

/**
 * Check if a directory contains valid Claude plugin metadata.
 */
export function isValidPlugin(pluginDir: string): boolean {
  const marketplaceJsonPath = join(pluginDir, '.claude-plugin', 'marketplace.json');
  return existsSync(marketplaceJsonPath);
}
