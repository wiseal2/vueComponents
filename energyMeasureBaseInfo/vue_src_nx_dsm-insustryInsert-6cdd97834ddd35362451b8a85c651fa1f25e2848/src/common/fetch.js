// import 'whatwg-fetch'

const headers = {
  "Content-Type": "application/json;charset=utf-8",
  'canry-version': 'dj',
}

const methods = ['GET', 'POST']

// get (url,'GET',options?)
// post (url, 'POST', {} || function)
const commonFetch = (url, method, options = {}, cb) => {
  let used = url.includes('?');
  // url = url + (used?'&':'?') +'auth_aid=' +
  // getQueryString("auth_aid") + '&auth_mid=' + getQueryString("auth_mid") + '&auth_cid=' + getQueryString("auth_cid");
  if (!methods.includes(method)) throw new Error('请求方法必传');
  if (method == 'POST') {
    if (typeof options == 'function') {
      cb = options;
      options = {};
    }
    return fetch(url, {
      method: method,
      body: JSON.stringify(options),
      headers
    }).then(res => {
      if (res.status == 200) {
        return res.json()
      } else {
        throw new Error(url + '\t接口报错\t' + res.status)
      }
    }).then(json => {
      cb && cb(json);
      return json
    }).catch((e) => {
      console.warn(e.message)
    })
  } else {
    if (typeof options == 'function') {
      cb = options;
    }
    return fetch(url, {
      method: method,
      headers
    }).then(res => {
      if (res.status == 200) {
        return res.json()
      } else {
        throw new Error(url + '\t接口报错\t' + res.status)
      }
    }).then(json => {
      cb && cb(json);
      return json
    }).catch((e) => {
      console.warn(e.message)
    })
  }

}

const getQueryString = (name) => {

  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return decodeURIComponent(r[2]);
  return null;

}

export default commonFetch
