// pages/home-music/index.js
import { getBanners } from "../../service/api_music";
import queryRect from "../../utils/query-rect";
import throttle from "../../utils/throttle";

const throttledQueryRect = throttle(queryRect, 200, {
  leading: true,
  trailing: true,
});

Page({
  data: {
    swiperHeight: 60,
    banners: [],
  },

  onLoad: function (options) {
    this.getPageData();
  },

  // 网络请求
  getPageData: function () {
    getBanners().then((res) => this.setData({ banners: res.banners }));
  },

  // 事件处理
  handleSearchClick: function () {
    wx.navigateTo({
      url: "/pages/detail-search/index",
    });
  },

  handleSwiperImageLoaded: function () {
    // 1.获取图片的高度(获取某一个组件的高度)
    throttledQueryRect(".swiper-image").then((res) => {
      const rect = res[0];
      this.setData({ swiperHeight: rect.height });
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
