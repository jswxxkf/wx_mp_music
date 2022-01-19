// pages/music-player/index.js
import { audioContext, playerStore } from "../../store/index";

const playModeNames = ["order", "repeat", "random"];

Page({
  data: {
    // 歌曲相关
    id: 0,
    currentSong: {},
    lyricInfos: [],
    durationTime: 0,
    currentTime: 0,
    currentLyricIndex: 0,
    currentLyricText: "",
    playModeIndex: 0,
    playModeName: "order",
    isPlaying: false,
    playingName: "pause",
    isPureMusic: false,
    playListSongs: [],
    // 页面相关
    currentPage: 0,
    contentHeight: 0,
    isMusicLyric: true,
    sliderValue: 0,
    isSliderChanging: false,
    lyricScrollTop: 0,
    isPlaylistShown: false,
  },
  onLoad: function (options) {
    // 1.获取传入的歌曲id
    const id = options.id;
    this.setData({ id });
    // playerStore.dispatch("playMusicWithSongIdAction", { id });
    // 2.设置播放器状态改变的监听
    this.setupPlayerStoreListener();
    // 3.动态计算内容高度
    const globalData = getApp().globalData;
    const screenHeight = globalData.screenHeight;
    const statusBarHeight = globalData.statusBarHeight;
    const navBarHeight = globalData.navBarHeight;
    const deviceRatio = globalData.deviceRatio;
    const contentHeight = screenHeight - statusBarHeight - navBarHeight;
    this.setData({ contentHeight, isMusicLyric: deviceRatio >= 2 });
  },

  // ======================= 事件处理 =======================
  handleSwiperChange: function (event) {
    const current = event.detail.current;
    this.setData({ currentPage: current });
  },

  handleSliderChange: function (event) {
    // 1.获取slider变化的值
    const sliderPercent = event.detail.value;
    // 2.求取需要跳转播放的currentTime
    const currentTime = (this.data.durationTime * sliderPercent) / 100;
    this.setData({ currentTime });
    // 3.设置context，播放currentTime处的音乐
    audioContext.pause(); // 先暂停一下，防止跳动
    audioContext.seek(currentTime / 1000); // 待解码完毕后，会自动执行上面回调中的play()
    // 4.记录最新的sliderValue，将滑块是否滑动中置为false
    this.setData({ sliderValue: sliderPercent, isSliderChanging: false });
  },

  handleSliderChanging: function (event) {
    const sliderPercent = event.detail.value;
    const currentTime = (this.data.durationTime * sliderPercent) / 100;
    this.setData({
      isSliderChanging: true,
      currentTime,
    });
  },

  handleBackBtnClick: function () {
    wx.navigateBack();
  },

  handleModeBtnClick: function () {
    // 计算新的playModeIndex
    let playModeIndex = this.data.playModeIndex + 1;
    if (playModeIndex === 3) {
      playModeIndex = 0;
    }
    playerStore.setState("playModeIndex", playModeIndex);
  },

  handlePlayBtnClick: function () {
    playerStore.dispatch("changeMusicPlayStatusAction", !this.data.isPlaying);
  },

  handlePrevBtnClick: function () {
    playerStore.dispatch("changeNewMusicAction", false); // isNext = false
  },

  handleNextBtnClick: function () {
    playerStore.dispatch("changeNewMusicAction");
  },

  handlePlaylistBtnClick: function () {
    this.setData({ isPlaylistShown: !this.data.isPlaylistShown });
  },

  handleListSongItemPlay: function (event) {
    const songId = event.detail;
    console.log(songId);
  },

  // ======================== 数据监听 =======================
  setupPlayerStoreListener: function () {
    // 1.监听playListSongs,currentSong,durationTime,lyricInfos,isPureMusic
    playerStore.onStates(
      [
        "currentSong",
        "durationTime",
        "lyricInfos",
        "isPureMusic",
        "playListSongs",
      ],
      ({
        currentSong,
        durationTime,
        lyricInfos,
        isPureMusic,
        playListSongs,
      }) => {
        if (currentSong !== undefined) this.setData({ currentSong });
        if (durationTime !== undefined) this.setData({ durationTime });
        if (lyricInfos !== undefined) this.setData({ lyricInfos });
        if (isPureMusic !== undefined) this.setData({ isPureMusic });
        if (playListSongs !== undefined) this.setData({ playListSongs });
      },
    );
    // 2.监听currentTime,currentLyricIndex,currentLyricText
    playerStore.onStates(
      ["currentTime", "currentLyricIndex", "currentLyricText"],
      ({ currentTime, currentLyricIndex, currentLyricText }) => {
        // 时间变化
        if (currentTime !== undefined && !this.data.isSliderChanging) {
          const sliderPercent = (currentTime / this.data.durationTime) * 100;
          this.setData({ sliderValue: sliderPercent, currentTime });
        }
        // 歌词变化
        if (currentLyricIndex !== undefined) {
          this.setData({
            currentLyricIndex,
            lyricScrollTop:
              currentLyricIndex *
              Math.floor((60 * getApp().globalData.screenWidth) / 375),
          });
        }
        if (currentLyricText !== undefined) {
          this.setData({ currentLyricText });
        }
      },
    );
    // 3.监听播放模式的更新
    playerStore.onStates(
      ["playModeIndex", "isPlaying"],
      ({ playModeIndex, isPlaying }) => {
        if (playModeIndex !== undefined) {
          this.setData({
            playModeIndex,
            playModeName: playModeNames[playModeIndex],
          });
        }
        if (isPlaying !== undefined) {
          this.setData({
            isPlaying,
            playingName: isPlaying ? "pause" : "resume",
          });
        }
      },
    );
  },

  onUnload: function () {},
});
