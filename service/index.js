const BASE_URL = "http://123.207.32.32:9001";

const LOGIN_BASE_URL = "http://123.207.32.32:3000";

class KFRequest {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }
  request(url, method, params, header = {}) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: this.baseURL + url,
        method,
        header,
        data: params,
        success: function (res) {
          resolve(res.data);
        },
        // 失败时，本质就是要通过传入err回调reject，
        // 而reject的执行也仅需将err作为入参，故可简写
        fail: reject,
      });
    });
  }
  get(url, params, header) {
    return this.request(url, "GET", params, header);
  }
  post(url, data, header) {
    return this.request(url, "POST", data, header);
  }
}

class KFLoginRequest {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }
  request(url, method, params, header = {}) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: this.baseURL + url,
        method,
        header,
        data: params,
        success: function (res) {
          resolve(res.data);
        },
        // 失败时，本质就是要通过传入err回调reject，
        // 而reject的执行也仅需将err作为入参，故可简写
        fail: reject,
      });
    });
  }
  get(url, params, header) {
    return this.request(url, "GET", params, header);
  }
  post(url, data, header) {
    return this.request(url, "POST", data, header);
  }
}

const kfRequest = new KFRequest(BASE_URL);
const kfLoginRequest = new KFLoginRequest(LOGIN_BASE_URL);

export default kfRequest;
export { kfLoginRequest };
