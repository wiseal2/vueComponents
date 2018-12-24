import fetch from './fetch.js'

export const getList = (params = {}) => {
  return fetch('/enterprise/regionalEnergyStatistics/queryPage', 'POST',params)
}

export const getCityList = (params = {})=>{
  return fetch('/sysbase/sys/getNewArea?key=1','GET')
}

export const updateList = (params = {})=>{
  return fetch('/enterprise/regionalEnergyStatistics/edit','POST',params);
}

export const withMinus = (params = {})=>{
  return fetch('/enterprise/regionalEnergyStatistics/withMinus','POST',params);
}

export const withPlus = (params = {})=>{
  return fetch('/enterprise/regionalEnergyStatistics/withPlus','POST',params);
}
