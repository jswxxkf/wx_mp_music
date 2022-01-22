// app.js
import {
  getLoginCode,
  checkSessionKey,
  codeToToken,
  checkToken,
} from "./service/api_login";
import { TOKEN_KEY } from "./constants/token-const";

App({
  globalData: {
    screenWidth: 0,
    screenHeight: 0,
    statusBarHeight: 0,
    navBarHeight: 44,
    deviceRatio: 2,
  },
  onLaunch: async function () {
    // 1.获取设备信息
    const info = wx.getSystemInfoSync();
    this.globalData.screenWidth = info.screenWidth;
    this.globalData.screenHeight = info.screenHeight;
    this.globalData.statusBarHeight = info.statusBarHeight;
    const deviceRatio = info.screenHeight / info.screenWidth;
    this.globalData.deviceRatio = deviceRatio;
    // 2.让用户【默认】进行登录
    // 先看一下是否已登录
    const token = wx.getStorageSync(TOKEN_KEY);
    // 再看一下token是否过期
    const checkResult = await checkToken(token);
    // 最后看一下sessionKey是否过期
    const isSessionKeyExpired = await checkSessionKey();
    if (!token || checkResult.errorCode || !isSessionKeyExpired) {
      this.loginAction();
    }
  },
  loginAction: async function () {
    // 1.获取code
    const code = await getLoginCode();
    // 2.将code发送给开发者服务器
    const result = await codeToToken(code);
    const token = result.token;
    wx.setStorageSync(TOKEN_KEY, token);
  },
});
