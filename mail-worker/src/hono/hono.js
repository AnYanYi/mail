import { Hono } from 'hono';
const app = new Hono();

import result from '../model/result';
import { cors } from 'hono/cors';

// 配置 CORS 以允许跨域请求
app.use('*', cors());

/**
 * 全局错误处理器
 * 捕获并处理所有未捕获的异常
 */
app.onError((err, c) => {
	// 业务异常处理
	if (err.name === 'BizError') {
		console.log(err.message);
	} else {
		// 系统异常
		console.error(err);
	}

	// 检查 KV 数据库是否绑定
	if (err.message === `Cannot read properties of undefined (reading 'get')`) {
		return c.json(result.fail('KV数据库未绑定 KV database not bound',502));
	}

	if (err.message === `Cannot read properties of undefined (reading 'put')`) {
		return c.json(result.fail('KV数据库未绑定 KV database not bound',502));
	}

	// 检查 D1 数据库是否绑定
	if (err.message === `Cannot read properties of undefined (reading 'prepare')`) {
		return c.json(result.fail('D1数据库未绑定 D1 database not bound',502));
	}

	return c.json(result.fail(err.message, err.code));
});

export default app;


