// pages/home-music/index.js
import { rankingStore, rankingMap, playerStore } from "../../store/index";

import { getBanners, getSongMenu } from "../../service/api_music";
import queryRect from "../../utils/query-rect";
import throttle from "../../utils/throttle";

const throttledQueryRect = throttle(queryRect, 500, {
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
    currentSong: {},
    currentLyricText: "",
    isPlaying: false,
    isPureMusic: false,
    playAnimState: "paused",
    playListSongs: [],
    currentTime: 0,
    durationTime: 0,
    // ui visibility
    isPlaylistShown: false,
  },

  onLoad: function (options) {
    // 0.先行播放一首歌曲
    // playerStore.dispatch("playMusicWithSongIdAction", { id: 1353301300 });
    // 1.获取页面数据
    this.getPageData();
    // 2.通过action发起共享数据的请求
    rankingStore.dispatch("getRankingDataAction");
    // 3.从store中获取共享的数据
    this.setupStoreListener();
  },

  // 网络请求
  getPageData: function () {
    getBanners().then((res) => this.setData({ banners: res.banners }));
    getSongMenu().then((res) => this.setData({ hotSongMenu: res.playlists }));
    getSongMenu("华语").then((res) =>
      this.setData({ recommendSongMenu: res.playlists }),
    );
  },

  // =================== 事件处理 ======================
  // 点击搜索框，跳转搜索详情页
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

  // 热门(推荐)歌单更多点击处理
  handleMoreClick: function () {
    this.navigateToDetailSongPage("hotRanking");
  },

  // 底部巅峰榜中各榜单点击处理
  handleRankingItemClick: function (event) {
    const idx = event.currentTarget.dataset.idx;
    const rankingName = rankingMap[idx];
    this.navigateToDetailSongPage(rankingName);
  },

  // 推荐歌曲点击处理
  handleSongItemClick: function (event) {
    const index = event.currentTarget.dataset.index;
    playerStore.setState("playListSongs", this.data.recommendSongs);
    playerStore.setState("playerListIndex", index);
  },

  // 点击底部播放栏中播放按钮的处理函数
  handlePlayBtnClick: function () {
    playerStore.dispatch("changeMusicPlayStatusAction", !this.data.isPlaying);
  },

  // 点击底部播放栏中封面的处理函数
  handlePlayBarClick: function () {
    wx.navigateTo({
      url: `/pages/music-player/index?id={${this.data.currentSong.id}}`,
    });
  },

  // 点击底部播放栏中播放列表按钮的处理函数
  handlePlaylistBtnClick: function () {
    this.setData({ isPlaylistShown: !this.data.isPlaylistShown });
  },

  // 歌曲列表中列表项点击的处理函数
  handleListSongItemPlay: function (event) {
    const songId = event.detail;
    wx.navigateTo({
      url: `/pages/music-player/index?id=${songId}`,
    });
    playerStore.dispatch("playMusicWithSongIdAction", { id: songId });
  },

  // 真正跳转进入歌单详情页
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

  // 设置store对应共享数据的监听
  setupStoreListener: function () {
    // 1. 排行榜相关监听
    rankingStore.onState("hotRanking", (res) => {
      if (!res.tracks) return;
      const recommendSongs = res.tracks.slice(0, 6);
      this.setData({ recommendSongs });
    });
    rankingStore.onState("newRanking", this.getRankingHandler(0));
    rankingStore.onState("originRanking", this.getRankingHandler(2));
    rankingStore.onState("thriveRanking", this.getRankingHandler(3));
    // 2. 播放器相关监听
    playerStore.onState("playListSongs", (playListSongs) => {
      if (playListSongs.length) {
        this.setData({ playListSongs });
      }
    });
    playerStore.onStates(
      ["currentSong", "isPlaying"],
      ({ currentSong, isPlaying }) => {
        if (currentSong !== undefined) this.setData({ currentSong });
        if (isPlaying !== undefined) {
          this.setData({
            isPlaying,
            playAnimState: isPlaying ? "running" : "paused",
          });
        }
      },
    );
    // 监听歌词相关
    playerStore.onStates(
      ["currentLyricText", "isPureMusic"],
      ({ currentLyricText, isPureMusic }) => {
        if (isPureMusic !== undefined) this.setData({ isPureMusic });
        if (currentLyricText !== undefined) {
          this.setData({
            currentLyricText: this.data.isPureMusic
              ? "纯音乐，请欣赏~"
              : currentLyricText,
          });
        }
      },
    );
    playerStore.onStates(
      ["currentTime", "durationTime"],
      ({ currentTime, durationTime }) => {
        if (currentTime !== undefined) this.setData({ currentTime });
        if (durationTime !== undefined) this.setData({ durationTime });
      },
    );
  },

  onUnload: function () {
    // rankingStore.offState("newRanking", this.getNewRankingHandler);
  },
});
