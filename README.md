<div align="center">

# CodePlugins

**Plugin Manager for Claude Code**

Install, customize, sync, and share — all-in-one Claude Code plugin management.

[![npm version](https://img.shields.io/npm/v/codeplugins.svg)](https://www.npmjs.com/package/codeplugins)
[![npm downloads](https://img.shields.io/npm/dm/codeplugins.svg)](https://www.npmjs.com/package/codeplugins)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

[English](README.md) · [简体中文](README-zh.md)

[Quick Start](#quick-start) · [How It Works](#how-it-works) · [Commands](#commands) · [Team Collaboration](#team-collaboration) · [Examples](#examples) · [FAQ](#faq)

</div>

---

## What Is CodePlugins?

CodePlugins is a **plugin manager for Claude Code** that adds a **project-level editable layer** on top of Claude Code's native plugin system.

It's not just an installer — it lets you **install, customize, trim, sync, and share** plugins.

### Three Pain Points of Claude Code's Native Plugin System

In Claude Code's native plugin system, all plugins — whether installed at project scope or user scope — end up in a single user-level cache directory: `~/.claude/plugins/cache/{marketplace}/{plugin}/{version}/`. This cache is a **read-only black box** that gets overwritten on the next plugin update.

This creates three problems:

| Pain Point | Description |
|------------|-------------|
| **Want to customize plugin skills?** | No editable source copy — cache files shouldn't be modified (updates overwrite them) |
| **Want to share modified plugins with your team?** | Cache is user-private and can't be committed to a project repo |
| **Plugin has too many unused skills?** | No way to trim — everything is loaded in full |

**CodePlugins solves all three.** It creates an **editable working copy** in your project's `.claude/plugins/` directory, letting you freely customize and then sync to the cache for Claude Code to load.

---

## Quick Start

### Option 1: Global Install (Recommended)

```bash
npm install -g codeplugins

codeplugins install owner/repo
```

### Option 2: Use with npx (One-time)

```bash
npx codeplugins install owner/repo
```

### Comparison

| Method | Command | Advantages | Use Case |
|--------|---------|------------|----------|
| **Global Install** | `codeplugins` | Faster startup, no repeated downloads | Frequent plugin management |
| **npx** | `npx codeplugins` | No installation, always latest version | Occasional use or CI environments |

---

## Why CodePlugins

- **Customizable** — Freely edit plugin skills, instructions, and config in your project directory
- **Trimmable** — Remove unneeded skills or commands to reduce loaded content
- **Shareable** — Commit edited plugins to your project's Git repo for team-wide use
- **Zero config** — Automatically sets up `enabledPlugins` and `extraKnownMarketplaces`
- **No conflicts** — Auto-patches marketplace names with `-codeplugins` suffix to avoid official registry collisions
- **Cache sync** — One command pushes edited plugins to user-level cache
- **GitHub-native** — Install from any public or private GitHub repo
- **Multiple formats** — Supports `owner/repo`, HTTPS URLs, and SSH URLs
- **Interactive** — Prompts you if a repo contains multiple plugins
- **Clean removal** — Uninstall plugins and clean up config with one command

---

## How It Works

### Claude Code's Native Plugin System

In Claude Code's native design, there is **no** project-level plugin directory. Whether installed at project scope or user scope, plugins are only cached to:

```
~/.claude/plugins/cache/{marketplace}/{plugin}/{version}/
```

This cache directory is managed by Claude Code itself and is a **read-only black box**:

- You **should not** directly edit code in the cache
- When plugins update, Claude Code re-downloads from GitHub and **overwrites** the cached content
- The cache is user-private and **cannot** be committed to a project Git repo

### Three Pain Points

1. **Can't customize** — You get a pre-built cache copy with no safe editing workspace. Want to modify a skill? Edit the cache file and the next update wipes your changes.
2. **Can't share** — The cache lives under `~/.claude/` in your home directory, making it user-private. You can't commit customized plugins to a project repo for team use.
3. **Can't trim** — Plugins load as a whole. Even if you only need 2 skills, all 20 skills get loaded.

### How CodePlugins Solves This

CodePlugins adds a **project-level editable layer** on top of Claude Code's native plugin system:

1. **`codeplugins install`** — Clones the plugin from GitHub into the project's `.claude/plugins/` directory, creating an **editable working copy**
2. **User edits freely** — Customize skills, remove unneeded parts, add your own skills in the project directory
3. **`codeplugins sync`** — Pushes edited content to user-level cache so Claude Code immediately loads the new version
4. **Team collaboration** — `.claude/plugins/` can be committed to the project Git repo; teammates `git pull` and run `codeplugins sync` to get in sync

### Architecture Comparison

```
Native Claude Code plugin flow (read-only black box):

  GitHub repo
      │
      │  Claude Code auto-downloads
      ▼
  ~/.claude/plugins/cache/{marketplace}/{plugin}/{version}/
      │
      │  Claude Code loads (read-only, not editable, updates overwrite)
      ▼
  Claude Code runs plugin


CodePlugins plugin flow (project-level editable layer):

  GitHub repo
      │
      │  codeplugins install (clones to project directory)
      ▼
  project/.claude/plugins/{repo}/       ◄── Editable working copy
      │                                      You can: customize/trim/add skills
      │  codeplugins sync (pushes to cache)
      ▼
  ~/.claude/plugins/cache/{marketplace-codeplugins}/{plugin}/{version}/
      │
      │  Claude Code loads (with -codeplugins suffix, won't be overwritten by official updates)
      ▼
  Claude Code runs your customized plugin
```

### Two-Tier Architecture Detail

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Project-Level Editable Layer (created by CodePlugins)      │
│  Path: project/.claude/plugins/                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  superpowers/                ◄── Editable working copy│  │
│  │  ├── .claude-plugin/marketplace.json                  │  │
│  │  ├── skills/          ◄── Customizable, trimmable     │  │
│  │  └── commands/                                        │  │
│  └───────────────────────────────────────────────────────┘  │
│        │                                                    │
│        │  codeplugins sync                                  │
│        ▼                                                    │
│  User-Level Cache (Claude Code's native load location)      │
│  Path: ~/.claude/plugins/cache/                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  superpowers-dev-codeplugins/  ◄── Suffixed, no       │  │
│  │  └── superpowers/                  overwrite risk     │  │
│  │      └── 4.2.0/                                       │  │
│  │          ├── skills/           ◄── Claude Code        │  │
│  │          └── commands/              loads from here    │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Installation Flow

```
codeplugins install owner/repo
```

1. **Parse input** — Converts `owner/repo` to `https://github.com/owner/repo.git`
2. **Clone repo** — Runs `git clone --depth 1` into `.claude/plugins/{repo-name}/`
3. **Remove `.git`** — Deletes the `.git` directory to avoid nested git repo issues
4. **Patch marketplace name** — Appends `-codeplugins` suffix to the `name` field in `marketplace.json` to prevent Claude Code from downloading from the official GitHub repo and overwriting local modifications
   - e.g. `superpowers-dev` → `superpowers-dev-codeplugins`
5. **Read metadata** — Parses `.claude-plugin/marketplace.json` for plugin entries
6. **Interactive selection** — If multiple plugins exist, prompts you to choose
7. **Update config** — Writes to `.claude/settings.local.json`

### Marketplace Name Patching

During installation, CodePlugins automatically appends `-codeplugins` to the `name` field in `marketplace.json`. This is a critical mechanism:

- **Why?** — Claude Code manages plugins by marketplace name. If your local marketplace name matches an official registry (e.g. `superpowers-dev`), Claude Code will re-download from the official GitHub repo and overwrite your local files, losing all customizations.
- **Effect** — With the suffix appended (`superpowers-dev-codeplugins`), Claude Code treats it as an independent marketplace and won't attempt to update from the official source, preserving your local modifications.

### Config After Installation

After running `codeplugins install obra/superpowers`, `.claude/settings.local.json` looks like:

```json
{
  "enabledPlugins": {
    "superpowers@superpowers-dev-codeplugins": true
  },
  "extraKnownMarketplaces": {
    "superpowers-dev-codeplugins": {
      "source": {
        "source": "directory",
        "path": ".claude/plugins/superpowers"
      }
    }
  }
}
```

### Sync Flow

```
codeplugins sync [name]
```

After editing plugin files in `.claude/plugins/` (customizing skills, removing unneeded content, adding new skills, etc.), the user-level cache won't update automatically. The `sync` command pushes project-level edits to the cache so Claude Code immediately loads your customized version:

```
Source:  .claude/plugins/superpowers/
Target:  ~/.claude/plugins/cache/superpowers-dev-codeplugins/superpowers/4.2.0/
```

Cache path formula: `~/.claude/plugins/cache/{marketplace-name}/{plugin-name}/{version}/`

### Manual Install vs CodePlugins

| Aspect | Manual Install | CodePlugins |
|--------|----------------|-------------|
| **Clone** | `git clone` manually | Automatic |
| **Config** | Edit JSON by hand | Automatic |
| **Name conflicts** | Must rename manually | Auto-patched with `-codeplugins` suffix |
| **Cache sync** | Copy files manually | `codeplugins sync` |
| **Customize plugins** | No safe editing location | Project-level editable working copy |
| **Team sharing** | Cache is private, can't share | Commit to Git repo |
| **Multiple plugins** | Pick one manually | Interactive prompt |
| **Uninstall** | Delete folder + edit config | `codeplugins remove` |
| **List plugins** | Check config manually | `codeplugins list` |

---

## Commands

> **Note**: The following examples use `codeplugins` (global install). If using npx, replace `codeplugins` with `npx codeplugins`.

### `install` — Install a Plugin

```bash
# From GitHub (shorthand)
codeplugins install owner/repo

# From GitHub (HTTPS)
codeplugins install https://github.com/owner/repo.git

# From GitHub (SSH)
codeplugins install git@github.com:owner/repo.git

# Skip prompts (for CI)
codeplugins install owner/repo -y
```

**Options:**
- `-y, --yes` — Skip confirmation prompts, enable all plugins

**What it does:**
1. Clones the repo into `.claude/plugins/{repo-name}/`, creating an editable working copy
2. Removes the `.git` directory
3. Patches `marketplace.json` name (appends `-codeplugins`)
4. Updates `.claude/settings.local.json`

### `sync` — Sync Edited Plugins to User Cache

```bash
# Sync all installed plugins
codeplugins sync

# Sync a specific plugin
codeplugins sync superpowers
```

**When to use:** After editing any files in `.claude/plugins/` (customizing skills, trimming content, adding new skills, etc.), run `sync` to push changes to the user-level cache so Claude Code loads your customized version.

**What it does:**
1. Reads `marketplace.json` from each project-level plugin
2. Determines the cache target path: `~/.claude/plugins/cache/{marketplace}/{plugin}/{version}/`
3. Replaces the cached version with the project-level files

### `list` (alias: `ls`) — List Installed Plugins

```bash
codeplugins list
# or
codeplugins ls
```

Shows all installed plugins with their enabled/disabled status.

### `remove` (alias: `rm`) — Remove a Plugin

```bash
codeplugins remove plugin-name
# or
codeplugins rm plugin-name

# Skip confirmation
codeplugins remove plugin-name -y
```

**Options:**
- `-y, --yes` — Skip confirmation prompt

**What it does:**
1. Deletes the plugin directory from `.claude/plugins/`
2. Removes plugin entries from `enabledPlugins`
3. Removes marketplace entry from `extraKnownMarketplaces`

---

## Full Command Reference

```bash
codeplugins install <source> [options]   # Install plugin from GitHub to project editable directory
codeplugins sync [name]                  # Sync edited plugins to user cache
codeplugins list                         # List installed plugins (alias: ls)
codeplugins remove <name> [options]      # Remove plugin (alias: rm)
```

### Supported Source Formats

| Format | Example |
|--------|---------|
| **Shorthand** | `owner/repo` |
| **HTTPS URL** | `https://github.com/owner/repo.git` |
| **SSH URL** | `git@github.com:owner/repo.git` |

---

## Team Collaboration

A key advantage of CodePlugins is sharing customized plugins through your Git repository.

### Workflow

```
Team Member A (customizes plugin):

  1. codeplugins install obra/superpowers     # Install plugin to project .claude/plugins/
  2. Edit .claude/plugins/superpowers/skills/  # Customize skills, trim content
  3. codeplugins sync                          # Sync to local cache, verify it works
  4. git add .claude/plugins/ .claude/settings.local.json
  5. git commit -m "Add customized superpowers plugin"
  6. git push


Team Member B (uses customized plugin):

  1. git pull                                  # Pull code containing customized plugins
  2. codeplugins sync                          # Sync project-level plugins to local cache
  3. Start using customized plugin             # Claude Code loads automatically
```

### Key Points

- The `.claude/plugins/` directory is an **editable working copy** created by CodePlugins — safe to commit to Git
- `.claude/settings.local.json` contains plugin config and should also be committed
- After pulling code, teammates just run `codeplugins sync` to sync plugins to their own user-level cache
- Each team member's user-level cache `~/.claude/plugins/cache/` is independent and doesn't interfere with others

---

## Examples

### Install a plugin

```bash
$ codeplugins install obra/superpowers
Installing from: obra/superpowers
Target: /path/to/project/.claude/plugins/superpowers

✔ Repository cloned

Marketplace: superpowers-dev-codeplugins
  (renamed from "superpowers-dev" to avoid conflicts with official registry)
Description: Development marketplace for Superpowers core skills library

  ✔ Enabled: superpowers@superpowers-dev-codeplugins

✅ Installation complete: 1 plugin(s) enabled
Config updated: .claude/settings.local.json
```

### Customize plugin and sync to cache

```bash
# 1. Customize skills in the project-level plugin directory
vim .claude/plugins/superpowers/skills/my-custom-skill.md

# 2. Remove unneeded skills
rm .claude/plugins/superpowers/skills/unused-skill.md

# 3. Sync customized plugin to user cache
$ codeplugins sync superpowers
Syncing 1 plugin(s) to user cache...

✔ superpowers@superpowers-dev-codeplugins v4.2.0 → ~/.claude/plugins/cache/superpowers-dev-codeplugins/superpowers/4.2.0

✅ Synced 1 plugin(s) to user cache
```

### List installed plugins

```bash
$ codeplugins list
Installed plugins (2):

  ● superpowers v4.2.0 enabled
    marketplace: superpowers-dev-codeplugins
    Core skills library for Claude Code

  ○ another-plugin v1.0.0 disabled
    marketplace: another-marketplace-codeplugins
```

### Remove a plugin

```bash
$ codeplugins remove superpowers
? Remove plugin 'superpowers'? This will delete the directory and update config. Yes
  ✔ Deleted: .claude/plugins/superpowers/
  ✔ Removed config for marketplace: superpowers-dev-codeplugins

✅ Plugin 'superpowers' removed successfully
```

---

## Directory Structure

### Project-Level Directory (Created by CodePlugins)

This is the **editable working copy** created by CodePlugins in your project — Claude Code does not natively have this directory:

```
your-project/
├── .claude/
│   ├── plugins/                                 # Created by CodePlugins
│   │   └── superpowers/                         # Editable working copy
│   │       ├── .claude-plugin/
│   │       │   ├── marketplace.json             # name: "superpowers-dev-codeplugins"
│   │       │   └── plugin.json
│   │       ├── skills/                          # Customizable, trimmable, extensible
│   │       ├── commands/
│   │       └── ...
│   └── settings.local.json                      # Auto-managed by CodePlugins
└── ...
```

### User-Level Cache (Claude Code's Native Load Location)

This is Claude Code's native cache directory. Use `codeplugins sync` to push project-level content here:

```
~/.claude/plugins/cache/
└── superpowers-dev-codeplugins/                 # Marketplace name (patched with -codeplugins suffix)
    └── superpowers/                             # Plugin name
        └── 4.2.0/                               # Version
            ├── .claude-plugin/
            ├── skills/                          # Claude Code loads from here
            ├── commands/
            └── ...
```

---

## Plugin Metadata Format

### `.claude-plugin/marketplace.json`

```json
{
  "name": "my-marketplace",
  "description": "My custom marketplace",
  "owner": {
    "name": "Author Name",
    "email": "author@example.com"
  },
  "plugins": [
    {
      "name": "my-plugin",
      "description": "Does something useful",
      "version": "1.0.0",
      "source": "./",
      "author": {
        "name": "Author Name",
        "email": "author@example.com"
      }
    }
  ]
}
```

> After installation by CodePlugins, the `name` field will be patched to `my-marketplace-codeplugins` to prevent official updates from overwriting.

### `.claude-plugin/plugin.json`

```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "description": "Does something useful"
}
```

---

## Configuration

CodePlugins manages `.claude/settings.local.json` automatically:

```json
{
  "enabledPlugins": {
    "superpowers@superpowers-dev-codeplugins": true
  },
  "extraKnownMarketplaces": {
    "superpowers-dev-codeplugins": {
      "source": {
        "source": "directory",
        "path": ".claude/plugins/superpowers"
      }
    }
  }
}
```

**Field descriptions:**

- `enabledPlugins` — List of enabled plugins, key format is `{pluginName}@{marketplaceName}`
- `extraKnownMarketplaces` — Additional registered marketplaces, telling Claude Code where to load plugins from
  - `source.source` — Always `"directory"`, indicating loading from a local directory
  - `source.path` — Relative path to the project-level plugin directory

---

## FAQ

### Why does CodePlugins rename the marketplace name?

Claude Code manages plugins by marketplace name. If your local marketplace name matches an official name (e.g. `superpowers-dev`), Claude Code will download the official version from GitHub and **overwrite** your local files, losing all customizations.

By appending `-codeplugins`, the local marketplace becomes a distinct entity (`superpowers-dev-codeplugins`), and Claude Code won't attempt to update it from the official source, keeping your customizations safe.

### Why do I need `codeplugins sync`?

Claude Code reads plugins from the **user-level cache** (`~/.claude/plugins/cache/`), not directly from your project directory. When you edit files in `.claude/plugins/`, those changes don't take effect until they're synced to the cache.

`codeplugins sync` pushes your edited project-level content to the user-level cache so Claude Code can immediately load your customized version.

### Does Claude Code natively have a project-level plugin directory?

**No.** In Claude Code's native plugin system, all plugins are stored only in the user-level cache `~/.claude/plugins/cache/`. The `.claude/plugins/` directory in your project is an **editable layer** created by CodePlugins — this is the core value CodePlugins provides.

### How do I customize plugins?

1. Install a plugin to the project's `.claude/plugins/` directory with `codeplugins install`
2. Directly edit files in that directory:
   - Modify existing skills (edit files under `skills/`)
   - Remove unneeded skills or commands
   - Add your own skill files
3. Run `codeplugins sync` to push changes to the user-level cache
4. Restart your Claude Code session — the customized version takes effect immediately

### How do I share customized plugins with my team?

1. Commit `.claude/plugins/` and `.claude/settings.local.json` to your project Git repo
2. Teammates `git pull` and run `codeplugins sync` to sync plugins to their own user-level cache
3. Everyone uses the same customized plugins, maintaining team consistency

### How is this different from manual installation?

Manual installation requires:
1. Cloning the repo
2. Finding plugin metadata
3. Renaming marketplace name to avoid conflicts
4. Editing `.claude/settings.local.json` by hand
5. Copying files to user-level cache

CodePlugins does all of this in one or two commands, plus provides a complete customization and team collaboration workflow.

### Can I install from private repos?

Yes! Use SSH URLs:

```bash
codeplugins install git@github.com:your-org/private-plugin.git
```

Make sure your SSH keys are configured with GitHub.

### What if a repo has multiple plugins?

CodePlugins will show an interactive prompt to choose which plugins to enable.

### Where are plugins installed?

Plugins are installed to `.claude/plugins/` in your current project directory (project-level editable working copy) via `codeplugins install`. They are then synced to `~/.claude/plugins/cache/` (user-level cache, Claude Code's native load location) via `codeplugins sync`.

### How do I update an installed plugin?

Re-run the install command — it will prompt you to overwrite:

```bash
codeplugins install owner/repo
```

After re-installing, if you had prior customizations, you'll need to re-apply them. Then run `codeplugins sync` to push the update to the cache.

### Does this work with Claude Desktop?

CodePlugins is designed for Claude Code (the CLI tool). For Claude Desktop, check the official plugin documentation.

### What's the difference between CodePlugins and OpenSkills?

**OpenSkills** installs skills — instruction files containing `SKILL.md`.

**CodePlugins** installs plugins — full-featured Claude Code extensions, with a complete management workflow for customizing, trimming, syncing, and sharing.

They use different directory structures and configuration:
- OpenSkills → `.claude/skills/` + `AGENTS.md`
- CodePlugins → `.claude/plugins/` + `.claude/settings.local.json`

---

## Tech Stack

- **TypeScript** — Type-safe implementation
- **Commander** — CLI framework
- **Chalk** — Terminal styling
- **Ora** — Loading spinners
- **@inquirer/prompts** — Interactive prompts
- **tsup** — Bundler
- **vitest** — Testing

---

## Requirements

- **Node.js** 18+
- **Git** (for cloning repositories)

---

## License

MIT

---

## Attribution

CodePlugins provides a complete install, customize, sync, and share experience for the Claude Code plugin ecosystem.

**Not affiliated with Anthropic.** Claude and Claude Code are trademarks of Anthropic, PBC.
