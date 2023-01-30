export default {
	SESSION_COOKIE:
		process.env.NODE_ENV == 'production' ? '__Secure-user' : 'session',
};
