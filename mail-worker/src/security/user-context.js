import JwtUtils from '../utils/jwt-utils';
import constant from '../const/constant';

/**
 * 用户上下文工具
 * 提供当前请求用户信息的访问方法
 */
const userContext = {
	/**
	 * 获取当前用户 ID
	 * @param {Object} c - Context 对象
	 * @returns {number} 用户 ID
	 */
	getUserId(c) {
		return c.get('user').userId;
	},

	getUser(c) {
		return c.get('user');
	},

	async getToken(c) {
		const jwt = c.req.header(constant.TOKEN_HEADER);
		const { token } = JwtUtils.verifyToken(c,jwt);
		return token;
	},
};
export default userContext;
