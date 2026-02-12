import { join, resolve } from 'path';
import { homedir } from 'os';

/**
 * Convert a path to POSIX-style (forward slashes).
 * Used when writing paths to settings.local.json.
 */
export function toPosixPath(p: string): string {
  return p.split('\\').join('/');
}

/**
 * Get the .claude directory path in the current working directory.
 */
export function getClaudeDir(): string {
  return join(process.cwd(), '.claude');
}

/**
 * Get the plugins directory path.
 */
export function getPluginsDir(): string {
  return join(getClaudeDir(), 'plugins');
}

/**
 * Get the settings.local.json path.
 */
export function getSettingsPath(): string {
  return join(getClaudeDir(), 'settings.local.json');
}

/**
 * Get the plugin directory path for a given folder name.
 */
export function getPluginDir(folderName: string): string {
  return join(getPluginsDir(), folderName);
}

/**
 * Get the relative POSIX path from CWD for settings.local.json.
 * e.g., ".claude/plugins/superpowers"
 */
export function getRelativePluginPath(folderName: string): string {
  return toPosixPath(join('.claude', 'plugins', folderName));
}

/**
 * Validate that a target path stays within the expected parent directory.
 */
export function isPathWithinDir(targetPath: string, parentDir: string): boolean {
  const resolvedTarget = resolve(targetPath);
  const resolvedParent = resolve(parentDir);
  return resolvedTarget.startsWith(resolvedParent + '/') || resolvedTarget === resolvedParent;
}

/**
 * Get the user-level Claude plugins cache directory.
 * e.g., ~/.claude/plugins/cache
 */
export function getUserCacheDir(): string {
  return join(homedir(), '.claude', 'plugins', 'cache');
}

/**
 * Get the cache directory for a specific plugin version.
 * e.g., ~/.claude/plugins/cache/{marketplaceName}/{pluginName}/{version}
 */
export function getPluginCacheDir(
  marketplaceName: string,
  pluginName: string,
  version: string
): string {
  return join(getUserCacheDir(), marketplaceName, pluginName, version);
}
