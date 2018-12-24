import fetch from './fetch.js'

export const getList = (params = {}) => { // 列表接口
  return fetch('/enterprise/energyConsumption/getList', 'POST', params)
}

export const updateList = (params={})=>{
  return fetch('/enterprise/energyConsumption/update','POST',params)
}

export const getTimeZone = (params='')=>{
  return fetch('/sysbase/sys/getList?key=1&code='+params,'GET')
}

export const getDistricts = ()=>{
  return fetch('/sysbase/sys/getNewArea?key=1','GET')
}

