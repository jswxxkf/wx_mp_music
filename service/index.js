import { TOKEN_KEY } from "../constants/token-const";
const token = wx.getStorageSync(TOKEN_KEY);
const BASE_URL = "http://codercba.com:9002";

const LOGIN_BASE_URL = "http://codercba.com:3000";

class KFRequest {
  constructor(baseURL, authHeader = {}) {
    this.baseURL = baseURL;
    this.authHeader = authHeader;
  }
  request(url, method, params, isAuth = false, header = {}) {
    const finalHeader = isAuth ? { ...this.authHeader, ...header } : header;
    return new Promise((resolve, reject) => {
      wx.request({
        url: this.baseURL + url,
        method,
        header: finalHeader,
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
  get(url, params, isAuth = false, header) {
    return this.request(url, "GET", params, isAuth, header);
  }
  post(url, data, isAuth = false, header) {
    return this.request(url, "POST", data, isAuth, header);
  }
}

const kfRequest = new KFRequest(BASE_URL);
const kfLoginRequest = new KFRequest(LOGIN_BASE_URL, { token });

export default kfRequest;
export { kfLoginRequest };
