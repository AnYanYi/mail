# 📧 Cloud Mail API 使用指南

## 🚀 快速开始

### 方式 1：使用封装好的脚本（推荐）

#### 1. 批量创建邮箱账户

编辑 `create-email-accounts.js` 中的配置：

```javascript
const CONFIG = {
  WORKER_URL: 'https://你的worker.workers.dev',
  ADMIN_EMAIL: 'admin@csiriicb.in',
  ADMIN_PASSWORD: '你的密码',
  
  ACCOUNTS_TO_CREATE: [
    {
      email: 'user1@csiriicb.in',
      password: '123456',
      roleName: '普通用户'
    },
    {
      email: 'user2@csiriicb.in'
      // password 不填会自动生成
    }
  ]
};
```

运行脚本：
```bash
node create-email-accounts.js
```

#### 2. 使用 API 客户端类

```javascript
const CloudMailAPI = require('./cloud-mail-api.js');

const api = new CloudMailAPI(
  'https://你的worker.workers.dev',
  'admin@csiriicb.in',
  '你的密码'
);

// 登录
await api.login();

// 创建账户
await api.createAccount('user@csiriicb.in', '123456');

// 批量创建
await api.createAccounts([
  { email: 'sales@csiriicb.in', password: 'Sales123!' },
  { email: 'support@csiriicb.in' }
]);

// 查询邮件
const emails = await api.getInbox(1, 10);
const search = await api.searchEmailsBySubject('重要');
```

---

## 📋 API 接口详解

### 1. 生成身份令牌

**接口**: `POST /api/public/genToken`

**请求示例**:
```bash
curl -X POST "https://你的worker.workers.dev/api/public/genToken" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@csiriicb.in",
    "password": "你的密码"
  }'
```

**响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "token": "9f4e298e-7431-4c76-bc15-4931c3a73984"
  }
}
```

---

### 2. 创建邮箱账户

**接口**: `POST /api/public/addUser`

**请求头**: 
- `Authorization`: 身份令牌（从第一步获取）

**请求参数**:
```json
{
  "list": [
    {
      "email": "user1@csiriicb.in",
      "password": "123456",
      "roleName": "普通用户"
    },
    {
      "email": "user2@csiriicb.in"
    }
  ]
}
```

**参数说明**:
- `email` (必填): 邮箱地址
- `password` (可选): 密码，不填会自动生成
- `roleName` (可选): 权限角色名，不填使用默认角色

**请求示例**:
```bash
curl -X POST "https://你的worker.workers.dev/api/public/addUser" \
  -H "Content-Type: application/json" \
  -H "Authorization: 你的令牌" \
  -d '{
    "list": [
      {
        "email": "user@csiriicb.in",
        "password": "123456"
      }
    ]
  }'
```

**响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

---

### 3. 查询邮件

**接口**: `POST /api/public/emailList`

**请求参数**:
- `toEmail` (可选): 收件人邮箱，支持模糊匹配
- `sendEmail` (可选): 发件人邮箱，支持模糊匹配
- `sendName` (可选): 发件人名字，支持模糊匹配
- `subject` (可选): 邮件主题，支持模糊匹配
- `content` (可选): 邮件内容，支持模糊匹配
- `timeSort` (可选): 时间排序 (`asc` 最旧, `desc` 最新)
- `type` (可选): 邮件类型 (0=收件, 1=发件)
- `isDel` (可选): 是否删除 (0=正常, 2=已删除)
- `num` (可选): 页码，默认 1
- `size` (可选): 每页数量，默认 20

**模糊匹配规则**:
- `'admin'` - 精确匹配
- `'admin%'` - 以 admin 开头
- `'%@example.com'` - 以 @example.com 结尾
- `'%admin%'` - 包含 admin

**请求示例**:
```bash
# 查询收件箱
curl -X POST "https://你的worker.workers.dev/api/public/emailList" \
  -H "Content-Type: application/json" \
  -H "Authorization: 你的令牌" \
  -d '{
    "type": 0,
    "isDel": 0,
    "num": 1,
    "size": 10
  }'

# 搜索主题包含"重要"的邮件
curl -X POST "https://你的worker.workers.dev/api/public/emailList" \
  -H "Content-Type: application/json" \
  -H "Authorization: 你的令牌" \
  -d '{
    "subject": "%重要%",
    "num": 1,
    "size": 20
  }'

# 查询发给某个邮箱的邮件
curl -X POST "https://你的worker.workers.dev/api/public/emailList" \
  -H "Content-Type: application/json" \
  -H "Authorization: 你的令牌" \
  -d '{
    "toEmail": "user@csiriicb.in",
    "num": 1,
    "size": 10
  }'
```

**响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "emailId": 999,
      "sendEmail": "hello@example.com",
      "sendName": "hello",
      "subject": "Hello world",
      "toEmail": "admin@csiriicb.in",
      "toName": "admin",
      "createTime": "2099-12-30 23:99:99",
      "type": 0,
      "content": "<div>Hello world</div>",
      "text": "Hello world",
      "isDel": 0
    }
  ]
}
```

---

## 💡 使用场景示例

### 场景 1: 为新用户批量开通邮箱

```javascript
const api = new CloudMailAPI(
  'https://你的worker.workers.dev',
  'admin@csiriicb.in',
  '密码'
);

await api.login();

// 批量创建
const users = ['alice', 'bob', 'charlie'];
const accounts = users.map(name => ({
  email: `${name}@csiriicb.in`,
  password: 'Welcome123!',
  roleName: '普通用户'
}));

await api.createAccounts(accounts);
```

### 场景 2: 监控特定邮箱收到的邮件

```javascript
// 每 5 分钟检查一次
setInterval(async () => {
  const emails = await api.getEmailsByRecipient('support@csiriicb.in');
  
  emails.forEach(email => {
    console.log(`新邮件: ${email.subject}`);
    // 可以进行通知、转发等操作
  });
}, 5 * 60 * 1000);
```

### 场景 3: 邮件存档和备份

```javascript
// 获取所有邮件并保存
const allEmails = [];
let page = 1;
let hasMore = true;

while (hasMore) {
  const emails = await api.queryEmails({ num: page, size: 100 });
  allEmails.push(...emails);
  
  hasMore = emails.length === 100;
  page++;
}

// 保存到文件
const fs = require('fs');
fs.writeFileSync('email-backup.json', JSON.stringify(allEmails, null, 2));
console.log(`备份完成：共 ${allEmails.length} 封邮件`);
```

### 场景 4: 创建部门专用邮箱

```javascript
const departments = [
  { name: 'sales', role: '销售团队' },
  { name: 'support', role: '客服团队' },
  { name: 'hr', role: '人力资源' },
  { name: 'tech', role: '技术团队' }
];

for (const dept of departments) {
  await api.createAccount(
    `${dept.name}@csiriicb.in`,
    `${dept.name}2024!`,
    dept.role
  );
  console.log(`✅ ${dept.name} 部门邮箱创建成功`);
}
```

---

## 🔐 安全建议

1. ✅ **妥善保管令牌**: Token 拥有完整权限，不要泄露
2. ✅ **定期更换**: 重新生成 Token 会使旧的失效
3. ✅ **使用环境变量**: 不要将密码硬编码在脚本中
4. ✅ **HTTPS 连接**: 确保使用 HTTPS 协议
5. ✅ **限制 IP**: 在可能的情况下限制 API 访问来源

---

## 🛠️ 环境变量配置

创建 `.env` 文件：

```bash
WORKER_URL=https://你的worker.workers.dev
ADMIN_EMAIL=admin@csiriicb.in
ADMIN_PASSWORD=你的密码
```

在脚本中读取：

```javascript
require('dotenv').config();

const api = new CloudMailAPI(
  process.env.WORKER_URL,
  process.env.ADMIN_EMAIL,
  process.env.ADMIN_PASSWORD
);
```

---

## 📚 更多资源

- [官方文档](https://doc.skymail.ink/)
- [API 文档](https://doc.skymail.ink/api/api-doc.html)
- [GitHub 仓库](https://github.com/AnYanYi/mail)

---

## 🆘 常见问题

### Q: Token 过期了怎么办？
A: 重新调用 `/api/public/genToken` 生成新的 Token

### Q: 可以创建子域名邮箱吗？
A: 可以！只要在 `wrangler.toml` 中配置了对应的域名

### Q: 密码有什么要求？
A: 最少 6 位，不填会自动生成强密码

### Q: 角色名不存在会怎样？
A: 会使用默认角色，建议先在系统中创建好角色

---

**最后更新**: 2026-02-06
