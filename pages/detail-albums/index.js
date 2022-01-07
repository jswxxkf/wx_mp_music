// pages/detail-albums/index.js
import { getSongMenu, getHotRankingCatagories } from "../../service/api_music";

Page({
  data: {
    loadedListCount: 0,
    catNames: [],
    catData: [],
  },
  onLoad: async function (options) {
    this.getPageData(0);
  },
  onUnload: function () {},
  onReachBottom: async function () {
    // 判断是否到达最后一个类别列表
    const { loadedListCount } = this.data;
    if (loadedListCount >= this.data.catNames.length) return;
    this.setData({ loadedListCount: loadedListCount + 1 });
    this.getPageData(this.data.loadedListCount - 1);
  },
  onPullDownRefresh: async function () {
    // 1. 清空/重置数据
    this.setData({ catNames: [], catData: [], loadedListCount: 0 });
    // 2. 重新请求数据
    this.getPageData(0);
  },

  // 获取页面数据
  getPageData: async function (listIndex) {
    wx.showNavigationBarLoading();
    // 1. 发起热门(默认)歌单分类数据的请求
    // (仅当列表索引为0时, 即初次加载时, 并非上拉更多时)
    if (listIndex === 0) {
      let _catNames = [];
      const res = await getHotRankingCatagories();
      for (const tag of res.tags) {
        _catNames.push(tag.name);
      }
      if (_catNames.length === 0) return;
      this.setData({ catNames: _catNames, loadedListCount: 1 });
    }
    // 2. 根据传入的列表索引，获取对应分类名称下的歌单数据列表
    const { catNames } = this.data;
    const catName = catNames[listIndex];
    getSongMenu(catName, 6).then((res) => {
      const newCatData = [
        ...this.data.catData,
        { name: catName, list: res.playlists },
      ];
      this.setData({ catData: newCatData });
      wx.hideNavigationBarLoading();
    });
    if (listIndex === 0) {
      wx.stopPullDownRefresh();
    }
  },

  // 事件处理
  handleAlbumItemClick: function (event) {
    const id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/detail-songs/index?type=menu&id=${id}`,
    });
  },
});
