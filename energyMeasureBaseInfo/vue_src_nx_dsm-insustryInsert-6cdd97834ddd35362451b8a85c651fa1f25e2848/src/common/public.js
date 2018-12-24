import fetch from './fetch.js'

export const getList = (params = {}) => {
  return fetch('/sysbase/metering/getList', 'POST',params)
}

export const getUserInfo = (params = {})=>{
  return fetch('/auth/account/info','GET')
}

export const updateList = (params = {})=>{
  return fetch('/sysbase/metering/update','POST',params);
}

export const addList = (params={})=>{
  return fetch('/sysbase/metering/add','POST',params);
}

export const delList = (params={})=>{
  return fetch('/sysbase/metering/delByIds','POST',params);
}


