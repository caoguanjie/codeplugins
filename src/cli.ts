import { Command } from 'commander';
import { installCommand } from './commands/install.js';
import { listCommand } from './commands/list.js';
import { removeCommand } from './commands/remove.js';
import { syncCommand } from './commands/sync.js';

const program = new Command();

program
  .name('codeplugins')
  .description('CLI tool to install Claude Code plugins from GitHub')
  .version('1.0.0')
  .showHelpAfterError(false)
  .exitOverride((err) => {
    if (
      err.code === 'commander.helpDisplayed' ||
      err.code === 'commander.help' ||
      err.code === 'commander.version'
    ) {
      process.exit(0);
    }
    if (
      err.code === 'commander.missingArgument' ||
      err.code === 'commander.missingMandatoryOptionValue' ||
      err.code === 'commander.unknownOption' ||
      err.code === 'commander.invalidArgument'
    ) {
      process.exit(1);
    }
    process.exit(err.exitCode || 1);
  });

program
  .command('install <source>')
  .description(
    'Install plugin from GitHub (e.g., owner/repo or full git URL)'
  )
  .option('-y, --yes', 'Skip interactive prompts, enable all plugins')
  .action(installCommand);

program
  .command('list')
  .alias('ls')
  .description('List all installed plugins')
  .action(listCommand);

program
  .command('remove <name>')
  .alias('rm')
  .description('Remove an installed plugin and clean up config')
  .option('-y, --yes', 'Skip confirmation prompt')
  .action(removeCommand);

program
  .command('sync [name]')
  .description(
    'Sync project-level plugins to user-level cache (~/.claude/plugins/cache/)'
  )
  .option('-y, --yes', 'Skip confirmation prompt')
  .action(syncCommand);

program.parse();
