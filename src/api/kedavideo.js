import request from "@/request/request"

export function getKedaVideo(form) {
	return request.get(`/api/gb/getVideoPlayUrl?deviceCode=${form.deviceCode}&channelNo=${form.channelNo}&mediaType=${form.mediaType}`)
}
