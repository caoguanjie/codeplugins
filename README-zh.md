<div align="center">

# OpenPlugins

**Claude Code 插件的通用安装器**

从 GitHub 快速安装 Claude Code 插件到您的项目中

[![npm version](https://img.shields.io/npm/v/openplugins.svg)](https://www.npmjs.com/package/openplugins)
[![npm downloads](https://img.shields.io/npm/dm/openplugins.svg)](https://www.npmjs.com/package/openplugins)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

[快速开始](#-快速开始) · [工作原理](#-工作原理) · [命令](#-命令) · [常见问题](#-常见问题)

</div>

---

## ✨ 什么是 OpenPlugins？

OpenPlugins 是一个命令行工具，用于从 GitHub 仓库快速安装 **Claude Code 插件**到您的项目中。

**类似于 npm，但专为 Claude Code 插件设计。**

---

## 🚀 快速开始

```bash
npx openplugins install owner/repo
```

插件将被安装到 `.claude/plugins/` 目录，并自动配置到 `.claude/settings.local.json` 中。

---

## ✅ 为什么选择 OpenPlugins

- **自动配置** — 自动更新 `enabledPlugins` 和 `extraKnownMarketplaces`
- **GitHub 集成** — 支持从任何 GitHub 仓库安装（HTTPS、SSH 或 owner/repo 简写）
- **智能选择** — 如果仓库包含多个插件，提供交互式选择
- **快速克隆** — 使用 `--depth 1` 浅克隆，节省时间和空间
- **项目本地** — 插件安装在项目内，可随项目版本控制

---

## 🧠 工作原理

### 安装流程

1. **解析输入** — 支持三种格式：
   - 简写：`owner/repo` → `https://github.com/owner/repo.git`
   - HTTPS URL：`https://github.com/owner/repo.git`
   - SSH URL：`git@github.com:owner/repo.git`

2. **克隆仓库** — 使用 `git clone --depth 1` 浅克隆到 `.claude/plugins/{repo-name}/`

3. **读取元数据** — 从仓库中读取：
   - `.claude-plugin/marketplace.json` — 市场名称和插件列表
   - `.claude-plugin/plugin.json` — 单个插件的元数据

4. **交互选择** — 如果仓库包含多个插件，提供交互式选择界面

5. **更新配置** — 自动更新 `.claude/settings.local.json`：
   ```json
   {
     "enabledPlugins": ["marketplace-name:plugin-name"],
     "extraKnownMarketplaces": [
       {
         "name": "marketplace-name",
         "path": "/absolute/path/to/.claude/plugins/repo-name"
       }
     ]
   }
   ```

### 配置文件结构

**`.claude-plugin/marketplace.json`** (多插件仓库)：
```json
{
  "name": "my-marketplace",
  "plugins": ["plugin-a", "plugin-b", "plugin-c"]
}
```

**`.claude-plugin/plugin.json`** (单插件)：
```json
{
  "name": "my-plugin",
  "displayName": "My Awesome Plugin",
  "description": "A plugin that does awesome things"
}
```

---

## 🔧 安装插件

### 从 GitHub 仓库（简写）

```bash
npx openplugins install owner/repo
```

### 从 HTTPS URL

```bash
npx openplugins install https://github.com/owner/repo.git
```

### 从 SSH URL

```bash
npx openplugins install git@github.com:owner/repo.git
```

### 跳过确认提示

```bash
npx openplugins install owner/repo -y
```

---

## 🧰 命令

### `install` - 安装插件

```bash
npx openplugins install <source> [options]
```

从 GitHub 仓库安装插件。

**参数：**
- `<source>` — GitHub 仓库（owner/repo、HTTPS URL 或 SSH URL）

**选项：**
- `-y, --yes` — 跳过所有确认提示

**示例：**
```bash
npx openplugins install anthropics/example-plugin
npx openplugins install https://github.com/user/plugin.git -y
npx openplugins install git@github.com:org/private-plugin.git
```

---

### `list` (别名: `ls`) - 列出已安装插件

```bash
npx openplugins list
```

显示所有已安装的插件及其启用状态。

**输出示例：**
```
Installed Plugins:
  ✓ my-marketplace:plugin-a (enabled)
  ✗ my-marketplace:plugin-b (disabled)
  ✓ another-marketplace:plugin-c (enabled)
```

---

### `remove` (别名: `rm`) - 移除插件

```bash
npx openplugins remove <name> [options]
```

移除已安装的插件并清理配置。

**参数：**
- `<name>` — 插件名称（格式：`marketplace:plugin` 或 `plugin`）

**选项：**
- `-y, --yes` — 跳过确认提示

**示例：**
```bash
npx openplugins remove my-marketplace:plugin-a
npx openplugins remove plugin-b -y
```

**注意：** 此命令会：
1. 从 `.claude/plugins/` 删除插件目录
2. 从 `enabledPlugins` 移除插件条目
3. 如果市场下没有其他插件，从 `extraKnownMarketplaces` 移除市场条目

---

## 🛠️ 技术栈

- **TypeScript** — 类型安全的代码
- **commander** — 命令行界面框架
- **chalk** — 终端颜色输出
- **ora** — 优雅的加载动画
- **@inquirer/prompts** — 交互式提示
- **tsup** — 快速的 TypeScript 打包工具
- **vitest** — 单元测试框架

---

## 📂 目录结构

安装后的目录结构：

```
your-project/
├── .claude/
│   ├── plugins/
│   │   ├── repo-name-1/
│   │   │   ├── .claude-plugin/
│   │   │   │   ├── marketplace.json
│   │   │   │   └── plugin-a/
│   │   │   │       └── plugin.json
│   │   │   └── ...
│   │   └── repo-name-2/
│   │       ├── .claude-plugin/
│   │       │   └── plugin.json
│   │       └── ...
│   └── settings.local.json
```

---

## ✅ 使用技巧

- 使用 `npx` 运行 OpenPlugins，无需全局安装
- 使用 `-y` 标志可在 CI/CD 环境中自动化安装
- 插件名称区分大小写，确保使用正确的大小写
- 移除插件前使用 `list` 命令查看已安装的插件

---

## ❓ 常见问题

### OpenPlugins 和 OpenSkills 有什么区别？

**OpenSkills** 安装 skills（技能），这些是包含 `SKILL.md` 的指令文件。

**OpenPlugins** 安装 plugins（插件），这些是 Claude Code 的扩展，包含完整的功能模块。

两者使用不同的目录结构和配置方式：
- OpenSkills → `.claude/skills/` + `AGENTS.md`
- OpenPlugins → `.claude/plugins/` + `.claude/settings.local.json`

### 插件安装在哪里？

插件安装在项目本地的 `.claude/plugins/` 目录下。每个插件都有自己的子目录。

### 如何更新已安装的插件？

目前需要先移除再重新安装：

```bash
npx openplugins remove plugin-name
npx openplugins install owner/repo
```

### 支持私有仓库吗？

支持！使用 SSH URL 格式：

```bash
npx openplugins install git@github.com:your-org/private-plugin.git
```

确保您的 SSH 密钥已配置并有权限访问该仓库。

### 为什么需要 `.claude-plugin/` 目录？

`.claude-plugin/` 目录包含插件的元数据，OpenPlugins 使用这些信息来：
- 识别市场名称（`marketplace.json`）
- 列出可用的插件（`marketplace.json` 中的 `plugins` 数组）
- 读取单个插件的信息（`plugin.json`）

### 如何创建自己的插件？

创建插件仓库需要以下结构：

**单插件仓库：**
```
my-plugin/
├── .claude-plugin/
│   └── plugin.json
└── ... (插件代码)
```

**多插件仓库（市场）：**
```
my-marketplace/
├── .claude-plugin/
│   ├── marketplace.json
│   ├── plugin-a/
│   │   └── plugin.json
│   └── plugin-b/
│       └── plugin.json
└── ... (插件代码)
```

---

## 📋 系统要求

- **Node.js** 18+
- **Git** (用于克隆仓库)

---

## 📜 许可证

MIT License

---

## 🙏 致谢

OpenPlugins 为 Claude Code 插件生态系统提供便捷的安装体验。

**与 Anthropic 无关联。** Claude 和 Claude Code 是 Anthropic, PBC 的商标。
