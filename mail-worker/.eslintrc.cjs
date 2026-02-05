/**
 * ESLint 配置文件 - Worker 后端
 * 用于 Cloudflare Worker 代码质量检查
 */
module.exports = {
  root: true,
  env: {
    es2021: true,
    node: true,
    worker: true
  },
  extends: [
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    // 代码质量规则
    'no-console': 'off', // Worker 环境允许使用 console
    'no-debugger': 'warn',
    'no-unused-vars': ['warn', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }],
    'no-undef': 'error',
    'no-var': 'error',
    'prefer-const': 'warn',
    
    // 异步处理
    'require-await': 'warn',
    'no-async-promise-executor': 'error',
    
    // 代码风格
    'indent': ['error', 'tab', { SwitchCase: 1 }],
    'quotes': ['error', 'single', { avoidEscape: true }],
    'semi': ['error', 'always'],
    'comma-dangle': ['error', 'never'],
    'no-trailing-spaces': 'error',
    'eol-last': ['error', 'always'],
    
    // 最佳实践
    'eqeqeq': ['error', 'always'],
    'no-throw-literal': 'error',
    'prefer-promise-reject-errors': 'error'
  },
  globals: {
    // Cloudflare Worker 全局变量
    Response: 'readonly',
    Request: 'readonly',
    URL: 'readonly',
    crypto: 'readonly'
  }
}
