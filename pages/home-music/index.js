// pages/home-music/index.js
import { rankingStore, rankingMap } from "../../store/index";

import { getBanners, getSongMenu } from "../../service/api_music";
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
    recommendSongs: [],
    hotSongMenu: [],
    recommendSongMenu: [],
    rankings: { 0: {}, 2: {}, 3: {} },
  },

  onLoad: function (options) {
    // 1.获取页面数据
    this.getPageData();
    // 2.通过action发起共享数据的请求
    rankingStore.dispatch("getRankingDataAction");
    // 3.从store中获取共享的数据
    rankingStore.onState("hotRanking", (res) => {
      if (!res.tracks) return;
      const recommendSongs = res.tracks.slice(0, 6);
      this.setData({ recommendSongs });
    });
    rankingStore.onState("newRanking", this.getRankingHandler(0));
    rankingStore.onState("originRanking", this.getRankingHandler(2));
    rankingStore.onState("thriveRanking", this.getRankingHandler(3));
  },

  // 网络请求
  getPageData: function () {
    getBanners().then((res) => this.setData({ banners: res.banners }));
    getSongMenu().then((res) => this.setData({ hotSongMenu: res.playlists }));
    getSongMenu("华语").then((res) =>
      this.setData({ recommendSongMenu: res.playlists }),
    );
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

  // 更多点击跳转处理
  handleMoreClick: function () {
    this.navigateToDetailSongPage("hotRanking");
  },

  handleRankingItemClick: function (event) {
    const idx = event.currentTarget.dataset.idx;
    const rankingName = rankingMap[idx];
    this.navigateToDetailSongPage(rankingName);
  },

  navigateToDetailSongPage: function (rankingName) {
    wx.navigateTo({
      url: `/pages/detail-songs/index?ranking=${rankingName}&type=rank`,
    });
  },

  // 传入idx是为了保持数据的顺序性
  // 此处使用高阶函数，外部真正得到的是返回的函数，并传入res
  getRankingHandler: function (idx) {
    return (res) => {
      if (Object.keys(res).length === 0) return;
      const name = res.name;
      const coverImgUrl = res.coverImgUrl;
      const songList = res.tracks.slice(0, 3);
      const playCount = res.playCount;
      const rankingObj = { name, coverImgUrl, playCount, songList };
      const newRankings = { ...this.data.rankings, [idx]: rankingObj };
      this.setData({ rankings: newRankings });
    };
  },

  onUnload: function () {
    // rankingStore.offState("newRanking", this.getNewRankingHandler);
  },
});
