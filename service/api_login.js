import kfRequest, { kfLoginRequest } from "./index";

export function getLoginCode() {
  return new Promise((resolve, reject) => {
    wx.login({
      timeout: 1000,
      success: (res) => {
        const code = res.code;
        resolve(code);
      },
      fail: (err) => {
        console.log(err);
        reject(err);
      },
    });
  });
}

export function checkSessionKey() {
  return new Promise((resolve) => {
    wx.checkSession({
      success: () => {
        resolve(true);
      },
      fail: () => {
        resolve(false);
      },
    });
  });
}

export function getUserInfo() {
  return new Promise((resolve, reject) => {
    wx.getUserProfile({
      desc: "获取用户档案新方式",
      success: resolve,
      fail: reject,
    });
  });
}

export function codeToToken(code) {
  return kfLoginRequest.post("/login", { code });
}

export function checkToken() {
  return kfLoginRequest.post("/auth", {}, true);
}
