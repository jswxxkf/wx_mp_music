// pages/home-profile/index.js
import { getUserInfo } from "../../service/api_login";
import { PROFILE } from "../../constants/profile-const";
import { TOKEN_KEY } from "../../constants/token-const";

Page({
  data: {
    userInfo: {},
  },
  onLoad: function () {
    this.setData({ userInfo: wx.getStorageSync(PROFILE) });
  },
  // ================== 事件处理 ===================
  handleGetUser: async function () {
    const { userInfo } = await getUserInfo();
    wx.setStorageSync(PROFILE, userInfo);
    this.setData({ userInfo });
    // 再获取一次token，可能用户退出登录后再次登录
    getApp().handleLogin();
  },
  // 点击退出登陆的处理函数
  handleLogoutClick: function () {
    // 1.清除token
    wx.setStorageSync(TOKEN_KEY, "");
    // 2.清除本地缓存中用户信息
    wx.setStorageSync(PROFILE, "");
    // 3.清除当前页面用户数据
    this.setData({ userInfo: {} });
  },
});
