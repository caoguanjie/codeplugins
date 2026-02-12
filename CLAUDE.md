# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 语言限制
所有回答和思考过程必须返回简体中文。

## 项目概述

CodePlugins 是一个 Claude Code 插件管理器 CLI 工具，提供安装、同步、列出和移除插件的功能。核心价值是在 Claude Code 原生插件系统之上添加项目级可编辑层，解决原生系统无法自定义、无法共享、无法裁剪的问题。

## 开发命令

```bash
npm run build      # 构建到 dist/
npm run dev        # 监听模式构建
npm run test       # 运行 vitest 测试
npm run typecheck  # TypeScript 类型检查
```

本地测试全局命令：
```bash
node dist/cli.js install owner/repo
```

## 架构

### 两层架构

1. **项目级可编辑层** (`.claude/plugins/`)
   - 由 CodePlugins 创建的可编辑工作副本
   - 用户可自由修改、裁剪、添加 skills
   - 可提交到 Git 仓库供团队共享

2. **用户级缓存** (`~/.claude/plugins/cache/`)
   - Claude Code 原生的插件加载位置
   - 通过 `sync` 命令从项目级同步到此位置

### 核心机制

**marketplace 名称补丁**：安装时自动在 `marketplace.json` 的 `name` 字段追加 `-codeplugins` 后缀，避免 Claude Code 从官方仓库下载覆盖本地修改。

例如：`superpowers-dev` → `superpowers-dev-codeplugins`

### 数据流

```
GitHub 仓库
    │  codeplugins install
    ▼
.claude/plugins/{repo}/     ◄── 可编辑工作副本
    │  codeplugins sync
    ▼
~/.claude/plugins/cache/{marketplace}/{plugin}/{version}/
    │  Claude Code 加载
    ▼
Claude Code 运行
```

## 源码结构

```
src/
├── cli.ts              # CLI 入口，定义所有命令
├── types.ts            # TypeScript 类型定义
├── commands/
│   ├── install.ts      # 安装命令：克隆仓库、补丁名称、更新配置
│   ├── sync.ts         # 同步命令：推送到用户级缓存
│   ├── list.ts         # 列出已安装插件
│   └── remove.ts       # 移除插件及清理配置
└── utils/
    ├── config.ts       # settings.local.json 读写操作
    ├── git.ts          # Git 源解析和克隆
    ├── paths.ts        # 路径工具函数
    └── plugin-meta.ts  # marketplace.json 读写和名称补丁
```

## 关键文件位置

| 文件 | 路径 | 说明 |
|------|------|------|
| 插件元数据 | `{plugin}/.claude-plugin/marketplace.json` | 定义 marketplace 和 plugins |
| 项目配置 | `.claude/settings.local.json` | enabledPlugins + extraKnownMarketplaces |
| 项目插件目录 | `.claude/plugins/` | 可编辑工作副本 |
| 用户缓存 | `~/.claude/plugins/cache/` | Claude Code 加载位置 |

## 配置格式

`.claude/settings.local.json`:
```json
{
  "enabledPlugins": {
    "{pluginName}@{marketplaceName}": true
  },
  "extraKnownMarketplaces": {
    "{marketplaceName}": {
      "source": {
        "source": "directory",
        "path": ".claude/plugins/{folderName}"
      }
    }
  }
}
```

## 发布流程

```bash
npm run typecheck && npm run build && npm test
npm version patch|minor|major
npm publish
```
