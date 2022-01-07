const BASE_URL = "http://123.207.32.32:9001";

class KFRequest {
  request(url, method, params) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: BASE_URL + url,
        method,
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
  get(url, params) {
    return this.request(url, "GET", params);
  }
  post(url, data) {
    return this.request(url, "POST", data);
  }
}

const kfRequest = new KFRequest();

export default kfRequest;
