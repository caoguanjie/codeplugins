---
allowed-tools: Bash(git:*), Read(*), Edit(*)
argument-hint: [custom-message]
description: Smart git commit with auto-generated or custom message
model: claude-3-5-sonnet-20241022
---

# Git Commit Helper

${ARGUMENTS:+### 使用自定义提交信息}
${ARGUMENTS:+**提交信息**: $ARGUMENTS}
${ARGUMENTS:+}
${ARGUMENTS:+执行提交...}
${ARGUMENTS:+!git add .}
${ARGUMENTS:+!git commit -m "$ARGUMENTS"}
${ARGUMENTS:+}

${ARGUMENTS:-### 自动生成提交信息模式}

## 步骤 1: 检查当前状态
!`git status --porcelain`

## 步骤 2: 分析变更内容

### 已暂存的变更：
!`git diff --cached --stat`
!`git diff --cached --name-only`

### 未暂存的变更：
!`git diff --stat`
!`git diff --name-only`

## 步骤 3: 智能生成提交信息

基于上述变更，请生成符合 Conventional Commits 规范的提交信息：

### 格式规范
- **feat**: 新功能 (feature)
- **fix**: 修复 bug
- **docs**: 文档变更
- **style**: 代码格式化（不影响功能）
- **refactor**: 重构代码
- **test**: 添加或修改测试
- **chore**: 构建过程或辅助工具的变动

### 提交信息格式
```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### 示例
- feat(auth): 添加用户登录功能
- fix(ui): 修复按钮对齐问题
- docs(readme): 更新安装说明
- refactor(utils): 简化验证逻辑

请根据变更内容生成合适的提交信息，然后执行：
```bash
git add .
git commit -m "生成的提交信息"
```

## 步骤 4: 查看提交结果
!`git log --oneline -1`