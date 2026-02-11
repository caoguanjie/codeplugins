import { readdirSync, existsSync } from 'fs';
import { join } from 'path';
import chalk from 'chalk';
import { readMarketplaceJson, readPluginJson } from '../utils/plugin-meta.js';
import { readSettings } from '../utils/config.js';
import { getPluginsDir } from '../utils/paths.js';

export async function listCommand(): Promise<void> {
  const pluginsDir = getPluginsDir();

  if (!existsSync(pluginsDir)) {
    console.log(chalk.dim('No plugins directory found (.claude/plugins/)'));
    console.log(chalk.dim('Install a plugin with: codeplugins install <source>'));
    return;
  }

  const entries = readdirSync(pluginsDir, { withFileTypes: true });
  const dirs = entries.filter((e) => e.isDirectory() && !e.name.startsWith('.'));

  if (dirs.length === 0) {
    console.log(chalk.dim('No plugins installed.'));
    console.log(chalk.dim('Install a plugin with: codeplugins install <source>'));
    return;
  }

  const settings = readSettings();
  const enabledPlugins = settings.enabledPlugins || {};

  console.log(chalk.bold(`Installed plugins (${dirs.length}):\n`));

  for (const dir of dirs) {
    const pluginDir = join(pluginsDir, dir.name);
    const marketplace = readMarketplaceJson(pluginDir);
    const pluginJson = readPluginJson(pluginDir);

    if (!marketplace) {
      console.log(`  ${chalk.yellow('?')} ${dir.name} ${chalk.dim('(no marketplace.json)')}`);
      continue;
    }

    const marketplaceName = marketplace.name;
    const pluginName = pluginJson?.name || marketplace.plugins[0]?.name || dir.name;
    const version = pluginJson?.version || marketplace.plugins[0]?.version || '?';
    const description = pluginJson?.description || marketplace.plugins[0]?.description || '';

    const enabledKey = `${pluginName}@${marketplaceName}`;
    const isEnabled = enabledPlugins[enabledKey] === true;
    const statusIcon = isEnabled ? chalk.green('●') : chalk.dim('○');
    const statusText = isEnabled ? chalk.green('enabled') : chalk.dim('disabled');

    console.log(`  ${statusIcon} ${chalk.bold(pluginName)} ${chalk.dim(`v${version}`)} ${statusText}`);
    console.log(`    ${chalk.dim(`marketplace: ${marketplaceName}`)}`);
    if (description) {
      console.log(`    ${chalk.dim(description.slice(0, 80))}`);
    }
    console.log();
  }
}
