# 🚀 自动部署配置指南

## 📝 第一步：创建 Cloudflare API Token

1. 访问：https://dash.cloudflare.com/profile/api-tokens
2. 点击 **Create Token**
3. 使用 **Edit Cloudflare Workers** 模板
4. 添加以下权限：

```
Account Permissions:
✓ Workers Scripts - Edit
✓ Workers KV Storage - Edit  
✓ Workers R2 Storage - Edit
✓ D1 - Edit

Zone Permissions:
✓ Email Routing Rules - Edit
```

5. 点击 **Continue** → **Create Token**
6. 复制生成的 Token（只显示一次！）

---

## 🔐 第二步：配置 GitHub Secrets

访问你的仓库：https://github.com/AnYanYi/mail/settings/secrets/actions

点击 **New repository secret**，添加以下密钥：

### 必需的 Secrets：

| Secret 名称 | 值 | 说明 |
|------------|-------|------|
| `CLOUDFLARE_API_TOKEN` | `你的API Token` | 刚才创建的 API Token |
| `CLOUDFLARE_ACCOUNT_ID` | `ec1cadbd8b4cbfcbebf83a74ae842f07` | 你的 Account ID |

### 可选的 Secrets（用于完整自动部署）：

如果希望自动初始化数据库，还需要添加：

| Secret 名称 | 值 | 说明 |
|------------|-------|------|
| `D1_DATABASE_ID` | `你的D1数据库ID` | 在 Cloudflare Dashboard 查看 |
| `KV_NAMESPACE_ID` | `你的KV ID` | Workers & Pages → KV |
| `R2_BUCKET_NAME` | `你的R2桶名` | R2 对象存储名称 |
| `DOMAIN` | `["csiriicb.in"]` | 邮件域名（JSON 数组格式）|
| `ADMIN` | `admin@csiriicb.in` | 管理员邮箱 |
| `JWT_SECRET` | `随机字符串` | JWT 密钥（至少32位）|
| `INIT_URL` | `https://你的worker.workers.dev/api/public/init` | 初始化URL |

---

## ✅ 第三步：测试自动部署

配置完成后：

1. 推送代码到 GitHub：
```bash
git add .
git commit -m "配置自动部署"
git push
```

2. 查看部署状态：
   - 访问：https://github.com/AnYanYi/mail/actions
   - 应该看到 "Deploy to Cloudflare Workers" 工作流正在运行

3. 等待部署完成（约 2-3 分钟）

---

## 🎯 自动部署触发条件

- ✅ 推送到 `main` 分支时自动部署
- ✅ 也可以在 Actions 页面手动触发

---

## 📧 Email Routing API 常用接口

### 获取 Email Routing 状态
```bash
curl -X GET "https://api.cloudflare.com/client/v4/zones/{zone_id}/email/routing" \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

### 创建邮件转发规则
```bash
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/email/routing/rules" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "actions": [{
      "type": "worker",
      "value": ["your-worker-name"]
    }],
    "matchers": [{
      "type": "all"
    }],
    "enabled": true,
    "name": "Send all to worker"
  }'
```

### 列出所有转发规则
```bash
curl -X GET "https://api.cloudflare.com/client/v4/zones/{zone_id}/email/routing/rules" \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

---

## 🔍 获取你的 Zone ID

访问：https://dash.cloudflare.com/ec1cadbd8b4cbfcbebf83a74ae842f07/csiriicb.in

右侧会显示你的 **Zone ID**

---

## 💡 提示

- API Token 只显示一次，务必保存好
- 每次推送 main 分支会自动部署
- 部署日志可在 GitHub Actions 中查看
- 首次部署后需要手动初始化数据库

---

## 🆘 遇到问题？

1. **部署失败** - 检查 API Token 权限
2. **Worker 404** - 检查 wrangler.toml 配置
3. **邮件收不到** - 检查 Email Routing 规则

查看详细日志：https://github.com/AnYanYi/mail/actions
