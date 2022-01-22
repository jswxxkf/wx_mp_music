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

export function codeToToken(code) {
  return kfLoginRequest.post("/login", { code });
}

export function checkToken(token) {
  return kfLoginRequest.post("/auth", {}, { token });
}
