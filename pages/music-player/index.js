// pages/music-player/index.js
import { getSongDetail, getSongLyric } from "../../service/api_player";
import { parseLyric } from "../../utils/parse-lyric";
import { audioContext } from "../../store/index";

Page({
  data: {
    // 歌曲相关
    id: 0,
    currentSong: {},
    currentTime: 0,
    durationTime: 0,
    lyricInfos: [],
    currentLyricIndex: 0,
    currentLyricText: "",
    // 页面相关
    currentPage: 0,
    contentHeight: 0,
    isMusicLyric: true,
    sliderValue: 0,
    isSliderChanging: false,
  },
  onLoad: function (options) {
    // 1.获取传入的歌曲id
    const id = options.id;
    this.setData({ id });
    // 2.根据id获取歌曲信息
    this.getPageData(id);
    // 3.动态计算内容高度
    const globalData = getApp().globalData;
    const screenHeight = globalData.screenHeight;
    const statusBarHeight = globalData.statusBarHeight;
    const navBarHeight = globalData.navBarHeight;
    const deviceRatio = globalData.deviceRatio;
    const contentHeight = screenHeight - statusBarHeight - navBarHeight;
    this.setData({ contentHeight, isMusicLyric: deviceRatio >= 2 });
    // 4.使用audioContext播放歌曲
    audioContext.stop(); // 停止上一首音乐
    audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
    audioContext.autoplay = true;
    // 5.设置播放器相关监听器
    this.setupAudioContextListener();
  },

  // ======================= 网络请求 =======================
  getPageData: function (id) {
    getSongDetail(id).then((res) => {
      this.setData({
        currentSong: res.songs[0],
        durationTime: res.songs[0].dt,
      });
    });
    getSongLyric(id).then((res) => {
      const lyricString = res.lrc.lyric;
      const lyrics = parseLyric(lyricString);
      this.setData({ lyricInfos: lyrics });
    });
  },

  // ======================= audio事件监听 =======================
  setupAudioContextListener: function () {
    audioContext.onCanplay(() => {
      audioContext.play();
    });
    // 监听时间改变
    audioContext.onTimeUpdate(() => {
      // 1. 获取当前时间
      const currentTime = audioContext.currentTime * 1000;
      // 2. 根据当前时间修改slider的滑块进度
      if (!this.data.isSliderChanging) {
        const sliderPercent = (currentTime / this.data.durationTime) * 100;
        this.setData({ sliderValue: sliderPercent, currentTime });
      }
      // 3. 根据当前时间查找播放的歌词
      let i = 0;
      for (; i < this.data.lyricInfos.length; i++) {
        const lyricInfo = this.data.lyricInfos[i];
        if (currentTime < lyricInfo.time) {
          break;
        }
      }

      // 设置当前歌词的索引和内容
      const currentLyricIndex = i - 1;
      if (currentLyricIndex !== this.data.currentLyricIndex) {
        const currentLyricInfo = this.data.lyricInfos[currentLyricIndex];
        this.setData({
          currentLyricText: currentLyricInfo.text,
          currentLyricIndex,
        });
      }
    });
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
      sliderValue: sliderPercent,
    });
  },

  onUnload: function () {},
});
