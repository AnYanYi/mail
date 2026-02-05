#!/usr/bin/env node

/**
 * Cloudflare Email Routing API 测试脚本
 * 使用方法：node test-email-api.js
 */

const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN || 'YOUR_API_TOKEN';
const ACCOUNT_ID = 'ec1cadbd8b4cbfcbebf83a74ae842f07';
const ZONE_ID = process.env.ZONE_ID || 'YOUR_ZONE_ID'; // 需要从 Cloudflare Dashboard 获取

const BASE_URL = 'https://api.cloudflare.com/client/v4';

/**
 * 发送 API 请求
 */
async function request(method, endpoint, body = null) {
  const options = {
    method,
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json'
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, options);
  const data = await response.json();
  
  if (!data.success) {
    console.error('❌ API 错误:', data.errors);
    return null;
  }
  
  return data.result;
}

/**
 * 获取 Email Routing 设置
 */
async function getEmailRoutingSettings() {
  console.log('\n📧 获取 Email Routing 设置...');
  const result = await request('GET', `/zones/${ZONE_ID}/email/routing`);
  if (result) {
    console.log('✅ 状态:', result.enabled ? '已启用' : '未启用');
    console.log('📝 配置:', result);
  }
}

/**
 * 列出所有转发规则
 */
async function listRoutingRules() {
  console.log('\n📋 获取转发规则列表...');
  const result = await request('GET', `/zones/${ZONE_ID}/email/routing/rules`);
  if (result) {
    console.log(`✅ 找到 ${result.length} 条规则:`);
    result.forEach((rule, index) => {
      console.log(`\n规则 ${index + 1}:`);
      console.log(`  名称: ${rule.name}`);
      console.log(`  启用: ${rule.enabled ? '是' : '否'}`);
      console.log(`  匹配: ${JSON.stringify(rule.matchers)}`);
      console.log(`  动作: ${JSON.stringify(rule.actions)}`);
    });
  }
}

/**
 * 列出目标地址
 */
async function listDestinationAddresses() {
  console.log('\n📬 获取目标地址列表...');
  const result = await request('GET', `/accounts/${ACCOUNT_ID}/email/routing/addresses`);
  if (result) {
    console.log(`✅ 找到 ${result.length} 个目标地址:`);
    result.forEach((addr, index) => {
      console.log(`\n地址 ${index + 1}:`);
      console.log(`  邮箱: ${addr.email}`);
      console.log(`  已验证: ${addr.verified ? '是' : '否'}`);
      console.log(`  标签: ${addr.tag || '无'}`);
    });
  }
}

/**
 * 创建转发到 Worker 的规则示例
 */
async function createWorkerRule() {
  console.log('\n🔧 创建转发到 Worker 的规则...');
  
  const rule = {
    name: 'Forward all emails to worker',
    enabled: true,
    matchers: [{
      type: 'all'
    }],
    actions: [{
      type: 'worker',
      value: ['cloud-mail'] // Worker 名称
    }]
  };

  const result = await request('POST', `/zones/${ZONE_ID}/email/routing/rules`, rule);
  if (result) {
    console.log('✅ 规则创建成功!');
    console.log('规则 ID:', result.id);
  }
}

/**
 * 主函数
 */
async function main() {
  console.log('🚀 Cloudflare Email Routing API 测试\n');
  console.log('Account ID:', ACCOUNT_ID);
  console.log('Zone ID:', ZONE_ID);
  console.log('API Token:', API_TOKEN.substring(0, 10) + '...\n');

  if (API_TOKEN === 'YOUR_API_TOKEN' || ZONE_ID === 'YOUR_ZONE_ID') {
    console.error('⚠️  请先设置环境变量:');
    console.error('   export CLOUDFLARE_API_TOKEN="your_token"');
    console.error('   export ZONE_ID="your_zone_id"');
    return;
  }

  try {
    await getEmailRoutingSettings();
    await listRoutingRules();
    await listDestinationAddresses();
    
    console.log('\n\n💡 提示:');
    console.log('  - 要创建 Worker 转发规则，取消注释 createWorkerRule() 调用');
    console.log('  - Zone ID 可在 Cloudflare Dashboard 右侧找到');
    console.log('  - 需要先在 Email Routing 中启用域名');
    
    // 如果需要创建规则，取消下面的注释
    // await createWorkerRule();
    
  } catch (error) {
    console.error('❌ 错误:', error.message);
  }
}

// 运行
main();
