// pages/detail-video/index.js
import {
  getMVDetail,
  getMVURL,
  getRelatedVideo,
} from "../../service/api_video";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    mvURLInfo: {},
    mvDetail: {},
    relatedVideos: [],
    danmuList: [
      {
        text: "第一条弹幕哦~",
        color: "#ff0000",
        time: 1,
      },
      {
        text: "6666",
        color: "#ff00ff",
        time: 3,
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 1.获取传入的 id
    const id = options.id;
    // 2.请求获取页面数据
    this.getPageData(id);
    // 3.其他逻辑
  },

  getPageData(id) {
    // 1.请求播放地址
    getMVURL(id).then((res) => {
      this.setData({ mvURLInfo: res.data });
    });
    // 2.请求视频信息
    getMVDetail(id).then((res) => {
      this.setData({ mvDetail: res.data });
    });
    // 3.请求相关视频
    getRelatedVideo(id).then((res) => {
      this.setData({ relatedVideos: res.data });
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
