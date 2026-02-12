import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import chalk from 'chalk';
import type { MarketplaceJson, PluginJson } from '../types.js';

/**
 * Tool identifier suffix appended to marketplace names to avoid
 * conflicts with official marketplace registries.
 */
const TOOL_SUFFIX = 'codeplugins';

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

/**
 * Append the tool suffix to the marketplace name to prevent conflicts
 * with official marketplace registries.
 *
 * e.g., "superpowers-dev" → "superpowers-dev-codeplugins"
 *
 * If the name already ends with the suffix, it is returned as-is.
 */
export function patchMarketplaceName(originalName: string): string {
  const suffix = `-${TOOL_SUFFIX}`;
  if (originalName.endsWith(suffix)) {
    return originalName;
  }
  return `${originalName}${suffix}`;
}

/**
 * Update the marketplace.json name field in a plugin directory by appending
 * the tool suffix. This ensures the local marketplace name won't collide
 * with the upstream/official one, preventing Claude Code from overwriting
 * the local plugin cache with the official repository.
 *
 * Returns the patched MarketplaceJson, or null if the file could not be read.
 */
export function patchMarketplaceJson(pluginDir: string): MarketplaceJson | null {
  const filePath = join(pluginDir, '.claude-plugin', 'marketplace.json');
  if (!existsSync(filePath)) {
    return null;
  }
  try {
    const content = readFileSync(filePath, 'utf-8');
    const marketplace = JSON.parse(content) as MarketplaceJson;
    const newName = patchMarketplaceName(marketplace.name);

    if (newName !== marketplace.name) {
      marketplace.name = newName;
      writeFileSync(filePath, JSON.stringify(marketplace, null, 2) + '\n', 'utf-8');
    }

    return marketplace;
  } catch {
    console.error(chalk.red(`Error patching marketplace.json in ${pluginDir}`));
    return null;
  }
}
