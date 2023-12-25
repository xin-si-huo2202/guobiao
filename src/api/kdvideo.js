import request from '@/request/request'

//科达  云台控制
/*	 @param deviceCode 设备国标编号  必填
	 * @param channelNo 通道号  必填
	 * @param command 控制指令,允许值: left, right, up, down, upleft, upright, downleft, downright, zoomin, zoomout, stop  必填
	 * @param horizonSpeed 水平速度   非必填
	 * @param verticalSpeed 垂直速度  非必填
	 * @param zoomSpeed 缩放速度 非必填 */

export function kdControl(form) {


	return request.get(`/api/gb/yt/control?deviceCode=${form.deviceCode}&channelNo=${form.channelNo}&command=${form.command}&horizonSpeed =${form.horizonSpeed}&zoomSpeed =${form.zoomSpeed}`)


}

// 视频回放 == 获取指定时间录像记录
export function gbBackPlay(form) {
	return request.get(`/api/gb/back/record?deviceCode=${form.deviceCode}&channelNo=${form.channelNo}&startTime=${form.startTime}&endTime=${form.endTime}`)
}
// 视频回放 == 回放播放
export function gbBackRecord(form) {
	return request.get(`/api/gb/back/play?deviceCode=${form.deviceCode}&channelNo=${form.channelNo}&startTime=${form.startTime}&endTime=${form.endTime}`)
}
// 视频回放 == 回放暂停
export function gbBackPause(stream) {
	return request.get(`/api/gb/back/pause?stream=${stream}`)
}
// 视频回放 == 回放恢复
export function gbBackResume(stream) {
	return request.get(`/api/gb/back/resume?stream=${stream}`)
}
// 视频回放 == 回放关闭
export function gbBackStop(form) {
	return request.get(`/api/gb/back/stop?deviceCode=${form.deviceCode}&channelNo=${form.channelNo}&stream=${form.stream}`)
}
// 视频播放 == 播放关闭
export function gbBackStopNow(form) {
	return request.get(`/api/gb/stopPlay?deviceCode=${form.deviceCode}&channelNo=${form.channelNo}`)
}