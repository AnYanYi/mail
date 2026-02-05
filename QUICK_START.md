# 快速开始 - 代码质量工具

## 📦 安装依赖

### 前端
```bash
cd mail-vue
pnpm add -D eslint eslint-plugin-vue prettier eslint-config-prettier
```

### 后端
```bash
cd mail-worker
pnpm add -D eslint prettier
```

## 🚀 使用命令

### 代码检查
```bash
# 前端
cd mail-vue && pnpm lint

# 后端
cd mail-worker && pnpm lint
```

### 自动修复
```bash
# 前端
cd mail-vue && pnpm lint:fix

# 后端
cd mail-worker && pnpm lint:fix
```

### 代码格式化
```bash
# 前端
cd mail-vue && pnpm format

# 后端
cd mail-worker && pnpm format
```

## 📝 主要改进

✅ 修复密码验证 bug  
✅ 移除所有 console.log 调试代码  
✅ 添加 15+ JSDoc 注释  
✅ 创建 ESLint 和 Prettier 配置  
✅ 添加 GitHub Actions 自动检查  
✅ 改进错误处理注释  

详细说明请查看 [OPTIMIZATION.md](./OPTIMIZATION.md)

## 🎯 建议工作流

1. 开发前运行 `pnpm lint` 检查代码
2. 提交前运行 `pnpm lint:fix` 自动修复
3. 定期运行 `pnpm format` 格式化代码
4. Push 代码时 GitHub Actions 会自动检查

## 💡 VS Code 集成

建议安装以下插件：
- ESLint
- Prettier - Code formatter
- Vue Language Features (Volar)

在 `.vscode/settings.json` 中配置：
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```
