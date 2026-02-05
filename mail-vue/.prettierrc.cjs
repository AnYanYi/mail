/**
 * Prettier 代码格式化配置
 * 与 ESLint 配合使用，确保代码风格一致
 */
module.exports = {
  // 基础配置
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: false,
  singleQuote: true,
  quoteProps: 'as-needed',
  
  // JSX 配置
  jsxSingleQuote: false,
  
  // 尾随逗号
  trailingComma: 'none',
  
  // 括号空格
  bracketSpacing: true,
  bracketSameLine: false,
  
  // 箭头函数参数
  arrowParens: 'avoid',
  
  // 换行符
  endOfLine: 'lf',
  
  // Vue 文件配置
  vueIndentScriptAndStyle: false,
  
  // HTML 空格敏感度
  htmlWhitespaceSensitivity: 'css',
  
  // 其他配置
  proseWrap: 'preserve',
  embeddedLanguageFormatting: 'auto'
}
