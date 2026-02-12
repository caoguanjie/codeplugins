import { existsSync, cpSync, rmSync, readdirSync } from 'fs';
import { join } from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { readMarketplaceJson } from '../utils/plugin-meta.js';
import { getPluginsDir, getPluginDir, getPluginCacheDir } from '../utils/paths.js';
import type { SyncOptions } from '../types.js';

/**
 * Resolve the absolute source directory for a plugin entry.
 * The `source` field in marketplace.json is relative to the plugin root.
 * e.g., "./" means the plugin root itself, "./subdir" means a subdirectory.
 */
function resolvePluginSourceDir(pluginDir: string, source: string): string {
  // Normalize: strip leading "./" if present
  const normalized = source.replace(/^\.\//, '');
  return normalized ? join(pluginDir, normalized) : pluginDir;
}

/**
 * Sync a single plugin from the project-level directory to the user-level cache.
 */
function syncPlugin(
  pluginDir: string,
  marketplaceName: string,
  pluginName: string,
  pluginVersion: string,
  pluginSource: string
): boolean {
  const sourceDir = resolvePluginSourceDir(pluginDir, pluginSource);
  const cacheDir = getPluginCacheDir(marketplaceName, pluginName, pluginVersion);

  if (!existsSync(sourceDir)) {
    console.error(
      chalk.red(`  ✖ Source directory not found: ${sourceDir}`)
    );
    return false;
  }

  // Remove existing cache and copy fresh
  if (existsSync(cacheDir)) {
    rmSync(cacheDir, { recursive: true, force: true });
  }

  cpSync(sourceDir, cacheDir, { recursive: true });
  return true;
}

export async function syncCommand(
  name: string | undefined,
  _options: SyncOptions
): Promise<void> {
  const pluginsDir = getPluginsDir();

  if (!existsSync(pluginsDir)) {
    console.error(chalk.red('No plugins directory found (.claude/plugins/)'));
    console.error(
      chalk.dim('Install a plugin first with: codeplugins install <source>')
    );
    process.exit(1);
  }

  // Determine which plugins to sync
  let pluginNames: string[];

  if (name) {
    // Sync a specific plugin
    const pluginDir = getPluginDir(name);
    if (!existsSync(pluginDir)) {
      console.error(chalk.red(`Plugin '${name}' not found in .claude/plugins/`));
      process.exit(1);
    }
    pluginNames = [name];
  } else {
    // Sync all plugins
    const entries = readdirSync(pluginsDir, { withFileTypes: true });
    pluginNames = entries
      .filter((e) => e.isDirectory() && !e.name.startsWith('.'))
      .map((e) => e.name);

    if (pluginNames.length === 0) {
      console.log(chalk.dim('No plugins installed to sync.'));
      return;
    }
  }

  console.log(chalk.bold(`Syncing ${pluginNames.length} plugin(s) to user cache...\n`));

  let totalSynced = 0;
  let totalFailed = 0;

  for (const pluginFolderName of pluginNames) {
    const pluginDir = getPluginDir(pluginFolderName);
    const marketplace = readMarketplaceJson(pluginDir);

    if (!marketplace) {
      console.log(
        `  ${chalk.yellow('?')} ${pluginFolderName} ${chalk.dim('(no marketplace.json, skipped)')}`
      );
      continue;
    }

    const marketplaceName = marketplace.name;

    for (const plugin of marketplace.plugins) {
      const spinner = ora(
        `Syncing ${plugin.name}@${marketplaceName} v${plugin.version}`
      ).start();

      const ok = syncPlugin(
        pluginDir,
        marketplaceName,
        plugin.name,
        plugin.version,
        plugin.source
      );

      if (ok) {
        const cacheDir = getPluginCacheDir(
          marketplaceName,
          plugin.name,
          plugin.version
        );
        spinner.succeed(
          `${plugin.name}@${marketplaceName} v${plugin.version} → ${chalk.dim(cacheDir)}`
        );
        totalSynced++;
      } else {
        spinner.fail(`${plugin.name}@${marketplaceName} v${plugin.version}`);
        totalFailed++;
      }
    }
  }

  console.log();
  if (totalSynced > 0) {
    console.log(chalk.green(`✅ Synced ${totalSynced} plugin(s) to user cache`));
  }
  if (totalFailed > 0) {
    console.log(chalk.red(`✖ Failed to sync ${totalFailed} plugin(s)`));
    process.exit(1);
  }
}
