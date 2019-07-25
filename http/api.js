import fly from './fly'

export const get = (url, params) => {
	return fly.get(url,params)
}

export const post = (url,params) => {
	return fly.post(url,params)
}

export const fullUrl = (doMain) => {
	return '/mobile.php?act=module&name=supplier_bg&do='+doMain
}

export const myGet = (doMain, params) => {
	return fly.get('/mobile.php?act=module&name=supplier_bg&do='+doMain,params)
}

export const myPost = (doMain,params) => {
	return fly.post('/mobile.php?act=module&name=supplier_bg&do='+doMain,params)
}

export const baseURL = fly.config.baseURL
export const imgBgUrl = fly.config.baseURL+'/source/modules/supplier_bg/template/mobile/images/'