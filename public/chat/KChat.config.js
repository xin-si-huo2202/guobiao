// 以下只做示例使用，业务方请自行修改配置
window.KChatConfig = {
	service: {
		// 视信通服务地址https://192.168.9.111:443
		host:'https://41.205.32.230:39443',
		// 流媒体服务地址
		//webrtc: 'wss://2.46.4.142:30443',
		// 是否显示录像按钮
		isDemandRecor: true,
		// 录像服务地址
		recordUrl: 'http://192.168.7.102',
		validDay: 30,
		version: '2.3.1',
		// 多端登录配置
		deviceType: 'WEB_CHROME',
		// 端口需要跟host中保持一致
		webPort: 39443,
		// 免密登陆配置
		clientId: 'ptt',
		clientSecret: 'J2neO5'
	},
	kmap: {
		configUrl: '/kmap/kmap.config.json',
		cityJSON: '/kmap/city.json'
	}
};