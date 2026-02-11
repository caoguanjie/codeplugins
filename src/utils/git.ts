import { execSync } from 'child_process';
import { rmSync } from 'fs';
import { join } from 'path';
import ora from 'ora';
import chalk from 'chalk';

/**
 * Check if a source string is a git URL.
 */
export function isGitUrl(source: string): boolean {
  return (
    source.startsWith('git@') ||
    source.startsWith('git://') ||
    source.startsWith('http://') ||
    source.startsWith('https://') ||
    source.endsWith('.git')
  );
}

/**
 * Parse a source string into a git clone URL and extract the repo name.
 * Accepts:
 *   - GitHub shorthand: "owner/repo"
 *   - HTTPS URL: "https://github.com/owner/repo.git"
 *   - SSH URL: "git@github.com:owner/repo.git"
 */
export function parseSource(source: string): { url: string; repoName: string } {
  if (isGitUrl(source)) {
    // Extract repo name from URL
    const repoName = extractRepoName(source);
    return { url: source, repoName };
  }

  // GitHub shorthand: owner/repo
  const parts = source.split('/');
  if (parts.length === 2) {
    return {
      url: `https://github.com/${source}.git`,
      repoName: parts[1],
    };
  }

  throw new Error(
    `Invalid source format: ${source}\nExpected: owner/repo or a git URL`
  );
}

/**
 * Extract the repository name from a git URL.
 */
function extractRepoName(url: string): string {
  // Remove trailing .git
  let cleaned = url.replace(/\.git$/, '');

  // Handle SSH URLs: git@github.com:owner/repo
  if (cleaned.startsWith('git@')) {
    const match = cleaned.match(/:([^/]+\/)?(.+)$/);
    if (match) return match[2];
  }

  // Handle HTTPS/git:// URLs
  const parts = cleaned.split('/');
  return parts[parts.length - 1];
}

/**
 * Clone a git repository with --depth 1 to the target directory.
 * Removes the .git directory after cloning to avoid nested git repo issues.
 */
export function cloneRepo(url: string, targetDir: string): void {
  const spinner = ora('Cloning repository...').start();
  try {
    execSync(`git clone --depth 1 --quiet "${url}" "${targetDir}"`, {
      stdio: 'pipe',
    });

    // Remove .git directory to avoid nested git repository issues
    const gitDir = join(targetDir, '.git');
    rmSync(gitDir, { recursive: true, force: true });

    spinner.succeed('Repository cloned');
  } catch (error) {
    spinner.fail('Failed to clone repository');
    const err = error as { stderr?: Buffer };
    if (err.stderr) {
      console.error(chalk.dim(err.stderr.toString().trim()));
    }
    console.error(
      chalk.yellow(
        '\nTip: For private repos, ensure git SSH keys or credentials are configured'
      )
    );
    process.exit(1);
  }
}
