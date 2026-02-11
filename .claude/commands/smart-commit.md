---
allowed-tools: Bash(git:*), Read(*), Edit(*), Glob(*), Grep(*)
argument-hint: [type] [scope] [description]
description: Enhanced git commit with intelligent message generation
model: claude-3-5-sonnet-20241022
---

# Smart Git Commit - 智能提交助手

${ARGUMENTS:+### 使用参数模式}
${ARGUMENTS:+您提供的参数：}
${ARGUMENTS:+- **类型 (type)**: $1}
${ARGUMENTS:+- **范围 (scope)**: $2}
${ARGUMENTS:+- **描述 (description)**: $3}
${ARGUMENTS:+}
${ARGUMENTS:+生成的提交信息：**$1($2): $3**}
${ARGUMENTS:+}
${ARGUMENTS:+执行提交...}
${ARGUMENTS:+!git add .}
${ARGUMENTS:+!git commit -m "$1($2): $3"}
${ARGUMENTS:+}

${ARGUMENTS:-### 智能分析模式}

## 📊 项目分析

### 项目类型检测
!`find . -maxdepth 2 -name "package.json" -o -name "pyproject.toml" -o -name "Cargo.toml" -o -name "go.mod" -o -name "pom.xml" | head -1 | xargs -I {} basename {} 2>/dev/null || echo "未知项目类型"`

### 当前分支信息
!`git branch --show-current`

## 📋 变更概览

### Git 状态
!`git status --porcelain`

### 变更统计
- **新增文件**: !`git status --porcelain | grep "^??" | wc -l | tr -d ' '` 个
- **修改文件**: !`git status --porcelain | grep "^ M" | wc -l | tr -d ' '` 个
- **删除文件**: !`git status --porcelain | grep "^ D" | wc -l | tr -d ' '` 个
- **重命名文件**: !`git status --porcelain | grep "^ R" | wc -l | tr -d ' '` 个

### 已暂存变更详情
!`git diff --cached --stat`

### 未暂存变更详情
!`git diff --stat`

## 🔍 智能分析

### 文件类型分析

**配置文件变更**:
!`git status --porcelain | grep -E "\.(json|yml|yaml|toml|ini|conf|config)$" || echo "无配置文件变更"`

**文档变更**:
!`git status --porcelain | grep -E "\.(md|txt|doc|pdf|rst)$" || echo "无文档变更"`

**代码文件变更**:
!`git status --porcelain | grep -E "\.(js|ts|jsx|tsx|py|java|cpp|c|go|rs|php|rb|swift|kt)$" || echo "无代码文件变更"`

**测试文件变更**:
!`git status --porcelain | grep -E "(test|spec|__tests__|__mocks__)" || echo "无测试文件变更"`

### 关键文件变更检测

**README 或文档**:
!`git status --porcelain | grep -iE "(readme| changelog| history| todo)" || echo "无 README 相关变更"`

**依赖文件**:
!`git status --porcelain | grep -E "(package\.json|requirements\.txt|yarn\.lock|Pipfile|Gemfile)" || echo "无依赖文件变更"`

**CI/CD 配置**:
!`git status --porcelain | grep -E "(\.github|\.gitlab-ci|Jenkinsfile|Dockerfile)" || echo "无 CI/CD 配置变更"`

## 💡 智能建议

### 基于变更类型的提交建议

**如果有新增功能相关文件**:
- 建议使用: feat(模块): 描述新功能

**如果有修复相关文件**:
- 建议使用: fix(模块): 修复问题描述

**如果只有文档变更**:
- 建议使用: docs: 更新文档说明

**如果只有代码格式变更**:
!`echo "如果有格式化相关变更，建议使用: style: 代码格式化"`

**如果有测试文件变更**:
- 可能使用: test: 添加/修改测试

**如果是依赖更新**:
- 建议使用: chore(deps): 更新依赖包

## 📝 生成提交信息

### Conventional Commits 规范

**格式**: `<type>(<scope>): <description>`

**类型说明**:
- **feat**: 新功能
- **fix**: Bug 修复
- **docs**: 文档更新
- **style**: 代码格式（不影响功能）
- **refactor**: 代码重构
- **perf**: 性能优化
- **test**: 测试相关
- **chore**: 构建工具、辅助工具的变动
- **ci**: CI 配置文件和脚本的变动
- **build**: 构建系统或外部依赖的变动

**Scope 建议**:
- 根据修改的目录或模块确定
- 例如: auth, user, api, ui, utils, config
- 如果涉及多个模块，可以使用 * 或省略

**Description 要求**:
- 使用动词开头，描述做了什么
- 使用祈使语气，如 "add", "fix", "change", "update"
- 首字母小写
- 结尾不加句号

### 示例参考

1. **feat**: `feat(auth): add JWT authentication middleware`
2. **fix**: `fix(api): resolve null pointer exception in user service`
3. **docs**: `docs(readme): update installation instructions`
4. **style**: `style(components): format code with prettier`
5. **refactor**: `refactor(utils): simplify validation logic`
6. **test**: `test(user): add unit tests for login functionality`
7. **chore**: `chore(deps): update dependencies to latest versions`

## ✅ 执行提交

请根据上述分析生成合适的提交信息，然后手动执行：

```bash
# 添加所有变更
git add .

# 提交（请替换为实际的提交信息）
git commit -m "type(scope): description"
```

**或使用智能提交脚本**：
```bash
# 自动添加并提交（需要确认提交信息）
git add . && git commit -m "根据变更自动生成的提交信息"
```

## 📊 提交后验证

提交完成后查看最新提交：
!`git log --oneline -1`
!`git show --stat HEAD`