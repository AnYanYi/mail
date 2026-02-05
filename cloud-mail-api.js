#!/usr/bin/env node

/**
 * Cloud Mail API 客户端
 * 封装所有 API 操作的便捷类
 */

class CloudMailAPI {
  /**
   * @param {string} workerUrl - Worker 域名
   * @param {string} adminEmail - 管理员邮箱
   * @param {string} adminPassword - 管理员密码
   */
  constructor(workerUrl, adminEmail, adminPassword) {
    this.workerUrl = workerUrl;
    this.adminEmail = adminEmail;
    this.adminPassword = adminPassword;
    this.token = null;
  }

  /**
   * 发送 API 请求
   */
  async request(endpoint, method = 'GET', body = null, needsAuth = true) {
    const url = `${this.workerUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json'
    };

    if (needsAuth && this.token) {
      headers['Authorization'] = this.token;
    }

    const options = {
      method,
      headers
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    const data = await response.json();

    if (data.code !== 200) {
      throw new Error(`API 错误 [${data.code}]: ${data.message}`);
    }

    return data.data;
  }

  /**
   * 生成并保存身份令牌
   */
  async login() {
    console.log('🔐 登录中...');
    const data = await this.request('/api/public/genToken', 'POST', {
      email: this.adminEmail,
      password: this.adminPassword
    }, false);

    this.token = data.token;
    console.log('✅ 登录成功');
    return this.token;
  }

  /**
   * 批量创建邮箱账户
   * @param {Array} accounts - 账户列表 [{email, password?, roleName?}]
   */
  async createAccounts(accounts) {
    if (!this.token) await this.login();
    
    console.log(`📧 创建 ${accounts.length} 个账户...`);
    await this.request('/api/public/addUser', 'POST', { list: accounts });
    console.log('✅ 账户创建成功');
    
    return accounts;
  }

  /**
   * 单个创建邮箱账户
   */
  async createAccount(email, password = null, roleName = null) {
    return this.createAccounts([{ email, password, roleName }]);
  }

  /**
   * 查询邮件
   * @param {Object} params - 查询参数
   */
  async queryEmails(params = {}) {
    if (!this.token) await this.login();
    
    const defaultParams = {
      num: 1,
      size: 20,
      timeSort: 'desc',
      ...params
    };

    return await this.request('/api/public/emailList', 'POST', defaultParams);
  }

  /**
   * 按收件人查询邮件
   */
  async getEmailsByRecipient(email, page = 1, size = 20) {
    return this.queryEmails({
      toEmail: email,
      num: page,
      size
    });
  }

  /**
   * 按发件人查询邮件
   */
  async getEmailsBySender(email, page = 1, size = 20) {
    return this.queryEmails({
      sendEmail: email,
      num: page,
      size
    });
  }

  /**
   * 按主题查询邮件（模糊搜索）
   */
  async searchEmailsBySubject(keyword, page = 1, size = 20) {
    return this.queryEmails({
      subject: `%${keyword}%`,
      num: page,
      size
    });
  }

  /**
   * 获取收件箱邮件
   */
  async getInbox(page = 1, size = 20) {
    return this.queryEmails({
      type: 0,  // 0 = 收件
      isDel: 0, // 0 = 未删除
      num: page,
      size
    });
  }

  /**
   * 获取已发送邮件
   */
  async getSentEmails(page = 1, size = 20) {
    return this.queryEmails({
      type: 1,  // 1 = 发件
      isDel: 0,
      num: page,
      size
    });
  }

  /**
   * 获取已删除邮件
   */
  async getDeletedEmails(page = 1, size = 20) {
    return this.queryEmails({
      isDel: 2,  // 2 = 已删除
      num: page,
      size
    });
  }
}

// ========== 使用示例 ==========

async function example() {
  // 初始化 API 客户端
  const api = new CloudMailAPI(
    'https://你的worker.workers.dev',
    'admin@csiriicb.in',
    '你的密码'
  );

  try {
    // 1. 登录获取令牌
    await api.login();

    // 2. 创建单个账户
    await api.createAccount('user@csiriicb.in', '123456', '普通用户');

    // 3. 批量创建账户
    await api.createAccounts([
      { email: 'sales@csiriicb.in', password: 'Sales123!' },
      { email: 'support@csiriicb.in' }, // 不指定密码会自动生成
      { email: 'info@csiriicb.in', roleName: '客服团队' }
    ]);

    // 4. 查询收件箱
    const inbox = await api.getInbox(1, 10);
    console.log('收件箱邮件:', inbox.length);

    // 5. 搜索邮件
    const results = await api.searchEmailsBySubject('重要通知');
    console.log('搜索结果:', results.length);

    // 6. 查询某个邮箱的邮件
    const userEmails = await api.getEmailsByRecipient('user@csiriicb.in');
    console.log(`user@csiriicb.in 的邮件:`, userEmails.length);

  } catch (error) {
    console.error('❌ 错误:', error.message);
  }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CloudMailAPI;
}

// 如果直接运行此文件，执行示例
if (require.main === module) {
  console.log('📚 Cloud Mail API 客户端示例\n');
  console.log('请修改 example() 函数中的配置后使用');
  console.log('或在其他脚本中导入：const CloudMailAPI = require("./cloud-mail-api.js")');
}
