<div align="center">

# OpenPlugins

**Universal plugin installer for Claude Code**

Install MCP plugins from GitHub with one command.

[![npm version](https://img.shields.io/npm/v/openplugins.svg)](https://www.npmjs.com/package/openplugins)
[![npm downloads](https://img.shields.io/npm/dm/openplugins.svg)](https://www.npmjs.com/package/openplugins)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

[Quick Start](#-quick-start) · [How It Works](#-how-it-works) · [Commands](#-commands) · [Examples](#-examples) · [FAQ](#-faq)

</div>

---

## ✨ What Is OpenPlugins?

OpenPlugins is a CLI tool that makes installing **Claude Code plugins** from GitHub effortless.

**Think of it as npm install for Claude Code plugins.**

Instead of manually cloning repos, editing config files, and managing paths — just run one command.

---

## 🚀 Quick Start

```bash
npx openplugins install owner/repo
```

That's it. OpenPlugins will:
- Clone the plugin repo into `.claude/plugins/`
- Read the plugin metadata
- Update your `.claude/settings.local.json` automatically

---

## ✅ Why OpenPlugins

- **Zero config** — automatically sets up `enabledPlugins` and `extraKnownMarketplaces`
- **GitHub-native** — install from any public or private GitHub repo
- **Multiple formats** — supports `owner/repo`, HTTPS URLs, and SSH URLs
- **Interactive** — prompts you if a repo contains multiple plugins
- **Clean removal** — uninstall plugins and clean up config with one command
- **Project-scoped** — plugins live in your project and can be versioned

---

## 🧠 How It Works

### Claude Code Plugin Structure

Claude Code plugins are MCP servers with metadata files:

```
my-plugin/
├── .claude-plugin/
│   ├── marketplace.json    # Marketplace info
│   └── plugin.json         # Plugin metadata
└── src/
    └── index.ts            # Plugin implementation
```

### OpenPlugins Installation Flow

1. **Parse input** — converts `owner/repo` to `https://github.com/owner/repo.git`
2. **Clone repo** — runs `git clone --depth 1` into `.claude/plugins/{repo-name}/`
3. **Read metadata** — parses `.claude-plugin/marketplace.json` and `.claude-plugin/plugin.json`
4. **Interactive selection** — if multiple plugins exist, prompts you to choose
5. **Update config** — adds plugin to `.claude/settings.local.json`:
   - Adds to `enabledPlugins` array
   - Adds marketplace to `extraKnownMarketplaces`

### Side-by-Side

| Aspect | Manual Install | OpenPlugins |
|--------|----------------|-------------|
| **Clone** | `git clone` manually | Automatic |
| **Config** | Edit JSON by hand | Automatic |
| **Multiple plugins** | Pick one manually | Interactive prompt |
| **Uninstall** | Delete folder + edit config | `openplugins remove` |
| **List plugins** | Check config manually | `openplugins list` |

---

## 🔧 Commands

### Install a Plugin

```bash
# From GitHub (shorthand)
npx openplugins install owner/repo

# From GitHub (HTTPS)
npx openplugins install https://github.com/owner/repo.git

# From GitHub (SSH)
npx openplugins install git@github.com:owner/repo.git

# Skip prompts (for CI)
npx openplugins install owner/repo -y
```

**Options:**
- `-y, --yes` — Skip confirmation prompts

### List Installed Plugins

```bash
npx openplugins list
# or
npx openplugins ls
```

Shows all installed plugins with their enabled status.

### Remove a Plugin

```bash
npx openplugins remove plugin-name
# or
npx openplugins rm plugin-name

# Skip confirmation
npx openplugins remove plugin-name -y
```

Removes the plugin folder and cleans up `.claude/settings.local.json`.

**Options:**
- `-y, --yes` — Skip confirmation prompt

---

## 🧰 Full Command Reference

```bash
npx openplugins install <source> [options]  # Install plugin from GitHub
npx openplugins list                        # List installed plugins (alias: ls)
npx openplugins remove <name> [options]     # Remove plugin (alias: rm)
```

### Supported Source Formats

| Format | Example |
|--------|---------|
| **Shorthand** | `owner/repo` |
| **HTTPS URL** | `https://github.com/owner/repo.git` |
| **SSH URL** | `git@github.com:owner/repo.git` |

---

## 💡 Examples

### Install a plugin

```bash
$ npx openplugins install anthropics/example-plugin
✔ Cloning repository...
✔ Reading plugin metadata...
✔ Plugin installed: example-plugin
✔ Updated .claude/settings.local.json
```

### Install from a private repo (SSH)

```bash
$ npx openplugins install git@github.com:myorg/private-plugin.git
✔ Cloning repository...
✔ Reading plugin metadata...
✔ Plugin installed: private-plugin
✔ Updated .claude/settings.local.json
```

### List installed plugins

```bash
$ npx openplugins list
Installed plugins:
✓ example-plugin (enabled)
✓ another-plugin (enabled)
✗ disabled-plugin (disabled)
```

### Remove a plugin

```bash
$ npx openplugins remove example-plugin
? Are you sure you want to remove example-plugin? Yes
✔ Removed plugin: example-plugin
✔ Updated .claude/settings.local.json
```

---

## 📁 Directory Structure

After installation, your project structure looks like this:

```
your-project/
├── .claude/
│   ├── plugins/
│   │   ├── plugin-one/
│   │   │   ├── .claude-plugin/
│   │   │   │   ├── marketplace.json
│   │   │   │   └── plugin.json
│   │   │   └── src/
│   │   └── plugin-two/
│   │       └── ...
│   └── settings.local.json
└── ...
```

---

## 🔍 Plugin Metadata Format

OpenPlugins reads two key files from each plugin repo:

### `.claude-plugin/marketplace.json`

```json
{
  "name": "my-marketplace",
  "displayName": "My Marketplace",
  "plugins": [
    {
      "name": "my-plugin",
      "displayName": "My Plugin"
    }
  ]
}
```

### `.claude-plugin/plugin.json`

```json
{
  "name": "my-plugin",
  "displayName": "My Plugin",
  "description": "Does something useful",
  "version": "1.0.0"
}
```

---

## ⚙️ Configuration

OpenPlugins updates `.claude/settings.local.json` automatically:

```json
{
  "enabledPlugins": [
    "my-marketplace:my-plugin"
  ],
  "extraKnownMarketplaces": [
    {
      "name": "my-marketplace",
      "displayName": "My Marketplace",
      "location": "absolute/path/to/.claude/plugins/plugin-repo"
    }
  ]
}
```

---

## ❓ FAQ

### How is this different from installing plugins manually?

Manual installation requires:
1. Clone the repo
2. Find the plugin metadata
3. Edit `.claude/settings.local.json` by hand
4. Add the plugin to `enabledPlugins`
5. Add the marketplace to `extraKnownMarketplaces`

OpenPlugins does all of this in one command.

### Can I install from private repos?

Yes. Use SSH URLs:

```bash
npx openplugins install git@github.com:your-org/private-plugin.git
```

Make sure your SSH keys are configured with GitHub.

### What if a repo has multiple plugins?

OpenPlugins will show an interactive prompt to choose which plugin to install.

### Can I install multiple plugins at once?

Not yet. Run `openplugins install` multiple times for now.

### Where are plugins installed?

Plugins are installed to `.claude/plugins/` in your current working directory.

### Does this work with Claude Desktop?

OpenPlugins is designed for Claude Code (the CLI tool). For Claude Desktop, check the official plugin documentation.

### How do I update an installed plugin?

Re-run the install command:

```bash
npx openplugins install owner/repo
```

OpenPlugins will re-clone the latest version.

---

## 🛠️ Tech Stack

- **TypeScript** — type-safe implementation
- **Commander** — CLI framework
- **Chalk** — terminal styling
- **Ora** — loading spinners
- **@inquirer/prompts** — interactive prompts
- **tsup** — bundler
- **vitest** — testing

---

## 📋 Requirements

- **Node.js** 18+
- **Git** (for cloning repositories)

---

## 📜 License

MIT

---

## Attribution

**Not affiliated with Anthropic.** Claude and Claude Code are trademarks of Anthropic, PBC.

