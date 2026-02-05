#!/usr/bin/env node

/**
 * Cloud Mail API 使用示例 - 批量创建邮箱账户
 * 
 * 使用方法：
 * 1. 设置环境变量或直接修改下面的配置
 * 2. 运行：node create-email-accounts.js
 */

// ========== 配置区域 ==========
const CONFIG = {
  // Worker 域名（必填）
  WORKER_URL: process.env.WORKER_URL || 'https://你的worker.workers.dev',
  
  // 管理员账号（必填）
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@csiriicb.in',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || '你的密码',
  
  // 要创建的邮箱账户列表
  ACCOUNTS_TO_CREATE: [
    {
      email: 'user1@csiriicb.in',
      password: '123456',        // 可选，不填会自动生成
      roleName: '普通用户'        // 可选，不填使用默认角色
    },
    {
      email: 'user2@csiriicb.in',
      // password 不填，会自动生成随机密码
    },
    {
      email: 'sales@csiriicb.in',
      password: 'Sales2024!',
      roleName: '销售团队'
    }
  ]
};
// ========== 配置结束 ==========

/**
 * 生成身份令牌
 */
async function generateToken() {
  console.log('🔑 正在生成身份令牌...');
  
  const response = await fetch(`${CONFIG.WORKER_URL}/api/public/genToken`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: CONFIG.ADMIN_EMAIL,
      password: CONFIG.ADMIN_PASSWORD
    })
  });

  const data = await response.json();
  
  if (data.code !== 200) {
    throw new Error(`生成令牌失败: ${data.message}`);
  }
  
  console.log('✅ 令牌生成成功:', data.data.token);
  return data.data.token;
}

/**
 * 创建邮箱账户
 */
async function createAccounts(token, accounts) {
  console.log(`\n📧 开始创建 ${accounts.length} 个邮箱账户...`);
  
  const response = await fetch(`${CONFIG.WORKER_URL}/api/public/addUser`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    },
    body: JSON.stringify({
      list: accounts
    })
  });

  const data = await response.json();
  
  if (data.code !== 200) {
    throw new Error(`创建账户失败: ${data.message}`);
  }
  
  console.log('✅ 账户创建成功！');
  return data;
}

/**
 * 查询邮件（示例）
 */
async function queryEmails(token, params = {}) {
  console.log('\n📬 查询邮件...');
  
  const defaultParams = {
    num: 1,
    size: 10,
    timeSort: 'desc',
    ...params
  };
  
  const response = await fetch(`${CONFIG.WORKER_URL}/api/public/emailList`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    },
    body: JSON.stringify(defaultParams)
  });

  const data = await response.json();
  
  if (data.code !== 200) {
    throw new Error(`查询邮件失败: ${data.message}`);
  }
  
  console.log(`✅ 找到 ${data.data.length} 封邮件`);
  return data.data;
}

/**
 * 主函数
 */
async function main() {
  console.log('🚀 Cloud Mail API 工具\n');
  console.log('Worker URL:', CONFIG.WORKER_URL);
  console.log('管理员邮箱:', CONFIG.ADMIN_EMAIL);
  console.log('准备创建账户数:', CONFIG.ACCOUNTS_TO_CREATE.length);
  console.log('━'.repeat(50));

  try {
    // 1. 生成令牌
    const token = await generateToken();
    
    // 2. 创建账户
    await createAccounts(token, CONFIG.ACCOUNTS_TO_CREATE);
    
    // 3. 显示创建的账户
    console.log('\n📋 创建的账户列表:');
    CONFIG.ACCOUNTS_TO_CREATE.forEach((account, index) => {
      console.log(`\n${index + 1}. ${account.email}`);
      console.log(`   密码: ${account.password || '(自动生成)'}`);
      console.log(`   角色: ${account.roleName || '(默认角色)'}`);
    });
    
    // 4. 可选：查询最新邮件
    // const emails = await queryEmails(token, { size: 5 });
    
    console.log('\n✨ 所有操作完成！');
    
  } catch (error) {
    console.error('\n❌ 错误:', error.message);
    process.exit(1);
  }
}

// 运行
if (require.main === module) {
  main();
}

// 导出供其他脚本使用
module.exports = {
  generateToken,
  createAccounts,
  queryEmails
};
