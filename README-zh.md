<div align="center">

# CodePlugins

**Claude Code 插件管理器**

安装、定制、同步、分享 —— 一站式管理 Claude Code 插件

[![npm version](https://img.shields.io/npm/v/codeplugins.svg)](https://www.npmjs.com/package/codeplugins)
[![npm downloads](https://img.shields.io/npm/dm/codeplugins.svg)](https://www.npmjs.com/package/codeplugins)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

[English](README.md) · [简体中文](README-zh.md)

[快速开始](#快速开始) · [工作原理](#工作原理) · [命令详解](#命令详解) · [团队协作](#团队协作) · [使用示例](#使用示例) · [常见问题](#常见问题)

</div>

---

## 什么是 CodePlugins？

CodePlugins 是一个 **Claude Code 插件管理器**，在 Claude Code 原生插件系统之上增加了一个**项目级可编辑层**。

它不只是一个安装器 —— 它让你能够**安装、定制、裁剪、同步、分享**插件。

### Claude Code 原生插件系统的三个痛点

Claude Code 的原生插件系统中，无论是项目级还是用户级安装的插件，最终都只存放在用户级缓存目录 `~/.claude/plugins/cache/{marketplace}/{plugin}/{version}/` 中。这个缓存是**只读黑盒**，下一次插件更新就会覆盖。

这带来了三个问题：

| 痛点 | 描述 |
|------|------|
| **想定制插件的技能？** | 没有可编辑的源码副本，缓存中的代码不应该修改（更新会覆盖） |
| **想分享改过的插件给团队？** | 缓存是用户私有的，无法提交到项目仓库 |
| **插件内容太多用不上？** | 无法裁剪，只能全量加载 |

**CodePlugins 解决了这三个问题。** 它在项目的 `.claude/plugins/` 目录中创建一个**可编辑工作副本**，让你自由定制后再同步到缓存中供 Claude Code 加载。

---

## 快速开始

### 方式一：全局安装（推荐）

```bash
npm install -g codeplugins

codeplugins install owner/repo
```

### 方式二：使用 npx（一次性运行）

```bash
npx codeplugins install owner/repo
```

### 两种方式的区别

| 方式 | 命令 | 优点 | 适用场景 |
|------|------|------|----------|
| **全局安装** | `codeplugins` | 启动更快，无需重复下载 | 频繁使用插件管理 |
| **npx 运行** | `npx codeplugins` | 无需安装，总是使用最新版本 | 偶尔使用或 CI 环境 |

---

## 为什么选择 CodePlugins

- **可定制** — 在项目目录中自由编辑插件技能、指令、配置，打造专属版本
- **可裁剪** — 删除不需要的技能或命令，减少加载内容，提升效率
- **可分享** — 编辑后的插件可提交到项目 Git 仓库，团队成员同步即用
- **零配置** — 自动设置 `enabledPlugins` 和 `extraKnownMarketplaces`
- **无冲突** — 自动修补市场名称，追加 `-codeplugins` 后缀，避免与官方注册表冲突
- **缓存同步** — 一条命令将编辑后的插件推送到用户级缓存
- **GitHub 原生** — 支持从任何公开或私有 GitHub 仓库安装
- **多种格式** — 支持 `owner/repo`、HTTPS URL、SSH URL
- **交互式** — 如果仓库包含多个插件，提供交互式选择
- **干净卸载** — 一条命令移除插件并清理配置

---

## 工作原理

### Claude Code 原生插件系统

在 Claude Code 的原生设计中，**不存在**项目级的插件目录。无论是项目级安装还是用户级安装，插件都只会缓存到：

```
~/.claude/plugins/cache/{marketplace}/{plugin}/{version}/
```

这个缓存目录由 Claude Code 自身管理，是一个**只读黑盒**：

- 用户**不应该**直接编辑缓存中的代码
- 插件更新时，Claude Code 会从 GitHub 重新下载并**覆盖**缓存内容
- 缓存是用户私有的，**无法**提交到项目 Git 仓库

### 三个痛点

1. **无法定制** — 你拿到的是一个已编译好的缓存副本，没有可安全编辑的源码工作区。想要修改一个技能？改了缓存文件，下次更新就被覆盖。
2. **无法分享** — 缓存在 `~/.claude/` 用户主目录下，是个人私有的。你无法将定制后的插件提交到项目仓库让团队成员使用。
3. **无法裁剪** — 插件是整体加载的。即使你只需要其中 2 个技能，也必须加载全部 20 个技能。

### CodePlugins 如何解决

CodePlugins 在 Claude Code 原生插件系统之上增加了一个**项目级可编辑层**：

1. **`codeplugins install`** — 将插件从 GitHub 克隆到项目的 `.claude/plugins/` 目录，创建一个**可编辑工作副本**
2. **用户自由编辑** — 在项目目录中定制技能、删除不需要的部分、添加自己的技能
3. **`codeplugins sync`** — 将编辑后的内容推送到用户级缓存，Claude Code 立即加载新版本
4. **团队协作** — `.claude/plugins/` 可以提交到项目 Git 仓库，队友 `git pull` 后执行 `codeplugins sync` 即可同步

### 架构对比图

```
原生 Claude Code 插件流程（只读黑盒）:

  GitHub 仓库
      │
      │  Claude Code 自动下载
      ▼
  ~/.claude/plugins/cache/{marketplace}/{plugin}/{version}/
      │
      │  Claude Code 加载（只读，不可编辑，更新会覆盖）
      ▼
  Claude Code 运行插件


CodePlugins 插件流程（项目级可编辑层）:

  GitHub 仓库
      │
      │  codeplugins install（克隆到项目目录）
      ▼
  项目/.claude/plugins/{repo}/          ◄── 可编辑工作副本
      │                                     你可以：定制/裁剪/添加技能
      │  codeplugins sync（推送到缓存）
      ▼
  ~/.claude/plugins/cache/{marketplace-codeplugins}/{plugin}/{version}/
      │
      │  Claude Code 加载（带 -codeplugins 后缀，不会被官方更新覆盖）
      ▼
  Claude Code 运行你的定制版插件
```

### 双层架构详解

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  项目级可编辑层（由 CodePlugins 创建和管理）                     │
│  路径: 项目/.claude/plugins/                                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  superpowers/                    ◄── 可编辑工作副本     │  │
│  │  ├── .claude-plugin/marketplace.json                  │  │
│  │  ├── skills/          ◄── 可定制、可裁剪、可添加        │  │
│  │  └── commands/                                        │  │
│  └───────────────────────────────────────────────────────┘  │
│        │                                                    │
│        │  codeplugins sync                                  │
│        ▼                                                    │
│  用户级缓存（Claude Code 原生的加载位置）                       │
│  路径: ~/.claude/plugins/cache/                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  superpowers-dev-codeplugins/    ◄── 带后缀，防止覆盖  │  │
│  │  └── superpowers/                                     │  │
│  │      └── 4.2.0/                                       │  │
│  │          ├── skills/             ◄── Claude Code       │  │
│  │          └── commands/               从这里加载         │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 安装流程

```
codeplugins install owner/repo
```

1. **解析输入** — 将 `owner/repo` 转换为 `https://github.com/owner/repo.git`
2. **克隆仓库** — 使用 `git clone --depth 1` 浅克隆到 `.claude/plugins/{repo-name}/`
3. **删除 `.git`** — 删除 `.git` 目录，避免嵌套 Git 仓库问题
4. **修补市场名称** — 在 `marketplace.json` 的 `name` 字段后追加 `-codeplugins` 后缀，防止 Claude Code 从官方 GitHub 仓库下载并覆盖本地修改
   - 例如：`superpowers-dev` → `superpowers-dev-codeplugins`
5. **读取元数据** — 解析 `.claude-plugin/marketplace.json` 获取插件列表
6. **交互式选择** — 如果存在多个插件，提示你选择要启用的插件
7. **更新配置** — 写入 `.claude/settings.local.json`

### 市场名称修补说明

安装时，CodePlugins 会自动在 `marketplace.json` 的 `name` 字段后追加 `-codeplugins` 后缀。这是一个关键机制：

- **为什么？** — Claude Code 根据市场名称来管理插件。如果本地的市场名称与官方注册表相同（如 `superpowers-dev`），Claude Code 会从官方 GitHub 仓库重新下载并覆盖你的本地文件，你所有的定制都会丢失。
- **效果** — 追加后缀后（`superpowers-dev-codeplugins`），Claude Code 将其视为一个独立的市场，不会尝试从官方源更新，你的本地修改得以保留。

### 安装后的配置

运行 `codeplugins install obra/superpowers` 后，`.claude/settings.local.json` 内容如下：

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

### 同步流程

```
codeplugins sync [name]
```

当你在 `.claude/plugins/` 中编辑了插件文件后（定制技能、删除不需要的内容、添加新技能等），用户级缓存不会自动更新。`sync` 命令将项目级的编辑内容推送到缓存中，让 Claude Code 立即加载你的定制版本：

```
源目录:  .claude/plugins/superpowers/
目标:    ~/.claude/plugins/cache/superpowers-dev-codeplugins/superpowers/4.2.0/
```

缓存路径规则：`~/.claude/plugins/cache/{市场名称}/{插件名称}/{版本号}/`

### 手动安装 vs CodePlugins

| 方面 | 手动安装 | CodePlugins |
|------|----------|-------------|
| **克隆** | 手动执行 `git clone` | 自动完成 |
| **配置** | 手动编辑 JSON | 自动完成 |
| **名称冲突** | 需要手动重命名 | 自动追加 `-codeplugins` 后缀 |
| **缓存同步** | 手动复制文件 | `codeplugins sync` |
| **定制插件** | 无安全的编辑位置 | 项目级可编辑工作副本 |
| **团队分享** | 缓存私有，无法分享 | 提交到 Git 仓库即可 |
| **多插件选择** | 手动挑选 | 交互式选择 |
| **卸载** | 删除目录 + 编辑配置 | `codeplugins remove` |
| **查看已安装** | 手动查看配置 | `codeplugins list` |

---

## 命令详解

> **提示**：以下示例使用 `codeplugins`（全局安装）。如果使用 npx 方式，请将 `codeplugins` 替换为 `npx codeplugins`。

### `install` — 安装插件

```bash
# 从 GitHub（简写）
codeplugins install owner/repo

# 从 HTTPS URL
codeplugins install https://github.com/owner/repo.git

# 从 SSH URL
codeplugins install git@github.com:owner/repo.git

# 跳过确认提示（适用于 CI）
codeplugins install owner/repo -y
```

**选项：**
- `-y, --yes` — 跳过确认提示，启用所有插件

**执行步骤：**
1. 克隆仓库到 `.claude/plugins/{repo-name}/`，创建可编辑工作副本
2. 删除 `.git` 目录
3. 修补 `marketplace.json` 名称（追加 `-codeplugins`）
4. 更新 `.claude/settings.local.json`

### `sync` — 将编辑后的插件同步到用户缓存

```bash
# 同步所有已安装的插件
codeplugins sync

# 同步指定插件
codeplugins sync superpowers
```

**使用场景：** 在 `.claude/plugins/` 中编辑了插件文件后（定制技能、裁剪内容、添加新技能等），运行 `sync` 将改动推送到用户级缓存，让 Claude Code 加载你的定制版本。

**执行步骤：**
1. 读取每个项目级插件的 `marketplace.json`
2. 确定缓存目标路径：`~/.claude/plugins/cache/{市场名}/{插件名}/{版本}/`
3. 用项目级文件替换缓存中的版本

### `list`（别名：`ls`）— 列出已安装插件

```bash
codeplugins list
# 或
codeplugins ls
```

显示所有已安装的插件及其启用/禁用状态。

### `remove`（别名：`rm`）— 移除插件

```bash
codeplugins remove plugin-name
# 或
codeplugins rm plugin-name

# 跳过确认
codeplugins remove plugin-name -y
```

**选项：**
- `-y, --yes` — 跳过确认提示

**执行步骤：**
1. 从 `.claude/plugins/` 删除插件目录
2. 从 `enabledPlugins` 移除插件条目
3. 从 `extraKnownMarketplaces` 移除市场条目

---

## 完整命令参考

```bash
codeplugins install <source> [options]   # 从 GitHub 安装插件到项目可编辑目录
codeplugins sync [name]                  # 将编辑后的插件同步到用户缓存
codeplugins list                         # 列出已安装插件（别名：ls）
codeplugins remove <name> [options]      # 移除插件（别名：rm）
```

### 支持的源格式

| 格式 | 示例 |
|------|------|
| **简写** | `owner/repo` |
| **HTTPS URL** | `https://github.com/owner/repo.git` |
| **SSH URL** | `git@github.com:owner/repo.git` |

---

## 团队协作

CodePlugins 的一大优势是支持通过 Git 仓库分享定制后的插件。

### 工作流程

```
团队成员 A（定制插件）:

  1. codeplugins install obra/superpowers     # 安装插件到项目 .claude/plugins/
  2. 编辑 .claude/plugins/superpowers/skills/  # 定制技能、裁剪内容
  3. codeplugins sync                          # 同步到本地缓存，验证效果
  4. git add .claude/plugins/ .claude/settings.local.json
  5. git commit -m "添加定制版 superpowers 插件"
  6. git push


团队成员 B（使用定制插件）:

  1. git pull                                  # 拉取包含定制插件的代码
  2. codeplugins sync                          # 将项目级插件同步到本地缓存
  3. 开始使用定制版插件                           # Claude Code 自动加载
```

### 关键说明

- `.claude/plugins/` 目录是 CodePlugins 创建的**可编辑工作副本**，可以安全地提交到 Git 仓库
- `.claude/settings.local.json` 包含插件配置，也应该提交到仓库
- 团队成员拉取代码后，只需运行 `codeplugins sync` 就能将插件同步到各自的用户级缓存
- 每个团队成员的用户级缓存 `~/.claude/plugins/cache/` 是各自独立的，互不影响

---

## 使用示例

### 安装插件

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

### 定制插件后同步缓存

```bash
# 1. 在项目级插件目录中定制技能
vim .claude/plugins/superpowers/skills/my-custom-skill.md

# 2. 删除不需要的技能
rm .claude/plugins/superpowers/skills/unused-skill.md

# 3. 将定制后的插件同步到用户缓存
$ codeplugins sync superpowers
Syncing 1 plugin(s) to user cache...

✔ superpowers@superpowers-dev-codeplugins v4.2.0 → ~/.claude/plugins/cache/superpowers-dev-codeplugins/superpowers/4.2.0

✅ Synced 1 plugin(s) to user cache
```

### 列出已安装插件

```bash
$ codeplugins list
Installed plugins (2):

  ● superpowers v4.2.0 enabled
    marketplace: superpowers-dev-codeplugins
    Core skills library for Claude Code

  ○ another-plugin v1.0.0 disabled
    marketplace: another-marketplace-codeplugins
```

### 移除插件

```bash
$ codeplugins remove superpowers
? Remove plugin 'superpowers'? This will delete the directory and update config. Yes
  ✔ Deleted: .claude/plugins/superpowers/
  ✔ Removed config for marketplace: superpowers-dev-codeplugins

✅ Plugin 'superpowers' removed successfully
```

---

## 目录结构

### 项目级目录（由 CodePlugins 创建和管理）

这是 CodePlugins 在你项目中创建的**可编辑工作副本**，Claude Code 原生并没有这个目录：

```
your-project/
├── .claude/
│   ├── plugins/                                 # 由 CodePlugins 创建
│   │   └── superpowers/                         # 可编辑工作副本
│   │       ├── .claude-plugin/
│   │       │   ├── marketplace.json             # name: "superpowers-dev-codeplugins"
│   │       │   └── plugin.json
│   │       ├── skills/                          # 可定制、可裁剪、可添加
│   │       ├── commands/
│   │       └── ...
│   └── settings.local.json                      # 由 CodePlugins 自动管理
└── ...
```

### 用户级缓存（Claude Code 原生的加载位置）

这是 Claude Code 原生使用的缓存目录，通过 `codeplugins sync` 将项目级内容推送到此处：

```
~/.claude/plugins/cache/
└── superpowers-dev-codeplugins/                 # 市场名称（已修补，带 -codeplugins 后缀）
    └── superpowers/                             # 插件名称
        └── 4.2.0/                               # 版本号
            ├── .claude-plugin/
            ├── skills/                          # Claude Code 从这里加载
            ├── commands/
            └── ...
```

---

## 插件元数据格式

### `.claude-plugin/marketplace.json`

```json
{
  "name": "my-marketplace",
  "description": "自定义市场描述",
  "owner": {
    "name": "作者名",
    "email": "author@example.com"
  },
  "plugins": [
    {
      "name": "my-plugin",
      "description": "插件功能描述",
      "version": "1.0.0",
      "source": "./",
      "author": {
        "name": "作者名",
        "email": "author@example.com"
      }
    }
  ]
}
```

> 通过 CodePlugins 安装后，`name` 字段会被修补为 `my-marketplace-codeplugins`，防止被官方更新覆盖。

### `.claude-plugin/plugin.json`

```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "description": "插件功能描述"
}
```

---

## 配置说明

CodePlugins 自动管理 `.claude/settings.local.json`：

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

**字段说明：**

- `enabledPlugins` — 已启用的插件列表，key 格式为 `{插件名}@{市场名}`
- `extraKnownMarketplaces` — 额外注册的市场列表，告诉 Claude Code 从哪里加载插件
  - `source.source` — 固定为 `"directory"`，表示从本地目录加载
  - `source.path` — 项目级插件目录的相对路径

---

## 常见问题

### 为什么 CodePlugins 要重命名市场名称？

Claude Code 根据市场名称来管理插件。如果你本地的市场名称与官方名称相同（如 `superpowers-dev`），Claude Code 会从官方 GitHub 仓库下载官方版本并**覆盖**你的本地文件，导致所有定制丢失。

通过追加 `-codeplugins` 后缀，本地市场变成了一个独立实体（`superpowers-dev-codeplugins`），Claude Code 不会尝试从官方源更新它，你的定制得以安全保留。

### 为什么需要 `codeplugins sync`？

Claude Code 从**用户级缓存**（`~/.claude/plugins/cache/`）读取插件，而不是直接从你的项目目录读取。当你在 `.claude/plugins/` 中编辑文件后，这些改动不会立即生效，需要先同步到缓存中。

`codeplugins sync` 将你编辑后的项目级内容推送到用户级缓存，Claude Code 就能立即加载你的定制版本。

### Claude Code 原生有项目级插件目录吗？

**没有。** Claude Code 原生的插件系统中，所有插件都只存放在用户级缓存 `~/.claude/plugins/cache/` 中。项目的 `.claude/plugins/` 目录是由 CodePlugins 创建的**可编辑层**，是 CodePlugins 提供的核心价值。

### 如何定制插件？

1. 使用 `codeplugins install` 安装插件到项目的 `.claude/plugins/` 目录
2. 直接编辑该目录下的文件：
   - 修改现有技能（编辑 `skills/` 下的文件）
   - 删除不需要的技能或命令
   - 添加你自己的技能文件
3. 运行 `codeplugins sync` 将改动推送到用户级缓存
4. 重新启动 Claude Code 会话，新的定制版本即刻生效

### 如何与团队分享定制后的插件？

1. 将 `.claude/plugins/` 和 `.claude/settings.local.json` 提交到项目 Git 仓库
2. 团队成员 `git pull` 拉取代码后，运行 `codeplugins sync` 即可将插件同步到各自的用户级缓存
3. 所有人都能使用同一套定制版插件，保持团队一致性

### CodePlugins 和手动安装有什么区别？

手动安装需要：
1. 克隆仓库
2. 查找插件元数据
3. 重命名市场名称避免冲突
4. 手动编辑 `.claude/settings.local.json`
5. 手动复制文件到用户级缓存

CodePlugins 用一两条命令就能完成以上所有操作，并且提供了完整的定制和团队协作工作流。

### 支持私有仓库吗？

支持！使用 SSH URL 格式：

```bash
codeplugins install git@github.com:your-org/private-plugin.git
```

确保你的 SSH 密钥已配置并有权限访问该仓库。

### 如果仓库包含多个插件怎么办？

CodePlugins 会弹出交互式选择界面，让你选择要启用的插件。

### 插件安装在哪里？

插件通过 `codeplugins install` 安装在当前项目的 `.claude/plugins/` 目录（项目级可编辑工作副本）。通过 `codeplugins sync` 同步到 `~/.claude/plugins/cache/`（用户级缓存，Claude Code 的原生加载位置）。

### 如何更新已安装的插件？

重新运行安装命令，会提示你是否覆盖：

```bash
codeplugins install owner/repo
```

重新安装后，如果你之前有定制修改，需要重新应用定制。然后运行 `codeplugins sync` 将更新推送到缓存。

### 适用于 Claude Desktop 吗？

CodePlugins 专为 Claude Code（CLI 工具）设计。如需在 Claude Desktop 中使用，请参考官方插件文档。

### CodePlugins 和 OpenSkills 有什么区别？

**OpenSkills** 安装 skills（技能），这些是包含 `SKILL.md` 的指令文件。

**CodePlugins** 安装 plugins（插件），这些是 Claude Code 的完整功能扩展，并且提供了定制、裁剪、同步、分享的完整管理工作流。

两者使用不同的目录结构和配置方式：
- OpenSkills → `.claude/skills/` + `AGENTS.md`
- CodePlugins → `.claude/plugins/` + `.claude/settings.local.json`

---

## 技术栈

- **TypeScript** — 类型安全的代码
- **Commander** — 命令行界面框架
- **Chalk** — 终端颜色输出
- **Ora** — 优雅的加载动画
- **@inquirer/prompts** — 交互式提示
- **tsup** — TypeScript 打包工具
- **vitest** — 单元测试框架

---

## 系统要求

- **Node.js** 18+
- **Git**（用于克隆仓库）

---

## 许可证

MIT License

---

## 致谢

CodePlugins 为 Claude Code 插件生态系统提供完整的安装、定制、同步和分享体验。

**与 Anthropic 无关联。** Claude 和 Claude Code 是 Anthropic, PBC 的商标。
