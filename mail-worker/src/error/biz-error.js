/**
 * 业务异常类
 * 用于处理可预期的业务错误（如验证失败、权限不足等）
 */
class BizError extends Error {
	/**
	 * @param {string} message - 错误消息
	 * @param {number} [code=501] - HTTP 状态码
	 */
	constructor(message, code) {
		super(message);
		this.code = code ? code : 501;
		this.name = 'BizError';
	}
}

export default BizError;
