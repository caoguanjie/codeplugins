import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import chalk from 'chalk';
import type { SettingsJson } from '../types.js';
import { getSettingsPath } from './paths.js';

/**
 * Read settings.local.json. Returns empty object if file doesn't exist.
 */
export function readSettings(): SettingsJson {
  const settingsPath = getSettingsPath();
  if (!existsSync(settingsPath)) {
    return {};
  }
  try {
    const content = readFileSync(settingsPath, 'utf-8');
    return JSON.parse(content) as SettingsJson;
  } catch {
    console.error(chalk.yellow('Warning: Could not parse settings.local.json, creating new one'));
    return {};
  }
}

/**
 * Write settings.local.json, preserving existing fields.
 */
export function writeSettings(settings: SettingsJson): void {
  const settingsPath = getSettingsPath();
  const dir = dirname(settingsPath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + '\n', 'utf-8');
}

/**
 * Add a plugin to enabledPlugins in settings.
 */
export function enablePlugin(
  settings: SettingsJson,
  pluginName: string,
  marketplaceName: string
): SettingsJson {
  const key = `${pluginName}@${marketplaceName}`;
  if (!settings.enabledPlugins) {
    settings.enabledPlugins = {};
  }
  settings.enabledPlugins[key] = true;
  return settings;
}

/**
 * Add a marketplace entry to extraKnownMarketplaces in settings.
 */
export function addMarketplace(
  settings: SettingsJson,
  marketplaceName: string,
  relativePath: string
): SettingsJson {
  if (!settings.extraKnownMarketplaces) {
    settings.extraKnownMarketplaces = {};
  }
  settings.extraKnownMarketplaces[marketplaceName] = {
    source: {
      source: 'directory',
      path: relativePath,
    },
  };
  return settings;
}

/**
 * Remove a plugin from enabledPlugins by marketplace name.
 */
export function disablePluginsByMarketplace(
  settings: SettingsJson,
  marketplaceName: string
): SettingsJson {
  if (!settings.enabledPlugins) return settings;

  const keysToRemove = Object.keys(settings.enabledPlugins).filter(
    (key) => key.endsWith(`@${marketplaceName}`)
  );
  for (const key of keysToRemove) {
    delete settings.enabledPlugins[key];
  }
  return settings;
}

/**
 * Remove a marketplace entry from extraKnownMarketplaces.
 */
export function removeMarketplace(
  settings: SettingsJson,
  marketplaceName: string
): SettingsJson {
  if (!settings.extraKnownMarketplaces) return settings;
  delete settings.extraKnownMarketplaces[marketplaceName];
  return settings;
}
