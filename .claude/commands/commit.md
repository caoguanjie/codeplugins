---
allowed-tools: Bash(git:*), Read(*), Edit(*)
argument-hint: [message]
description: Quick git commit - if message provided, use it; otherwise analyze changes
model: claude-3-5-sonnet-20241022
---

# 快速提交

${ARGUMENTS:+**提交信息**: $ARGUMENTS}
${ARGUMENTS:+!git add .}
${ARGUMENTS:+!git commit -m "$ARGUMENTS"}
${ARGUMENTS:+✅ 提交完成！}

${ARGUMENTS:-### 当前变更}
${ARGUMENTS:-!git status --short}
${ARGUMENTS:-}
${ARGUMENTS:-请基于上述变更生成合适的提交信息，然后执行：}
${ARGUMENTS:-```bash}
${ARGUMENTS:-git add .}
${ARGUMENTS:-git commit -m "your-commit-message"}
${ARGUMENTS:-```}