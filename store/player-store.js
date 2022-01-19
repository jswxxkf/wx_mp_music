import { HYEventStore } from "hy-event-store";
import { parseLyric, checkPureMusic } from "../utils/parse-lyric";
import { getSongDetail, getSongLyric } from "../service/api_player";

const audioContext = wx.createInnerAudioContext();

const playerStore = new HYEventStore({
  state: {
    isFirstPlay: true, // 是否是第一次播放
    currentSong: {},
    lyricInfos: [],
    currentTime: 0,
    durationTime: 0,
    currentLyricIndex: 0,
    currentLyricText: "",
    isPlaying: false,
    playModeIndex: 0, // 0:列表循环 1:单曲循环 2:随机播放
    playListSongs: [],
    playListIndex: 0,
    isPureMusic: false, // 是否是纯音乐
  },
  actions: {
    playMusicWithSongIdAction(ctx, { id, isRefresh = false }) {
      if (ctx.id == id && !isRefresh) {
        setTimeout(() => {
          this.dispatch("changeMusicPlayStatusAction", true);
        }, 500);
        return;
      }
      ctx.id = id;
      // 0.修改是否正在播放状态
      ctx.isPlaying = true;
      // 先重置上一首歌曲信息，避免残影现象
      ctx.currentSong = {};
      ctx.durationTime = 0;
      ctx.lyricInfos = [];
      ctx.currentTime = 0;
      ctx.currentLyricIndex = 0;
      ctx.currentLyricText = "";
      ctx.isPureMusic = false;
      // 1.根据id请求数据
      // 请求歌曲详情
      getSongDetail(id).then((res) => {
        ctx.currentSong = res.songs[0];
        ctx.durationTime = res.songs[0].dt;
        if (!ctx.playListSongs.find((song) => song.id === id)) {
          ctx.playListSongs = [...ctx.playListSongs, ctx.currentSong];
        }
      });
      // 请求歌词
      getSongLyric(id).then((res) => {
        const lyricString = res.lrc.lyric;
        const lyrics = parseLyric(lyricString);
        ctx.lyricInfos = lyrics;
        ctx.isPureMusic = checkPureMusic(lyrics);
      });
      // 2.播放对应id的歌曲
      audioContext.stop(); // 停止上一首音乐
      audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
      audioContext.autoplay = true;
      // 3.监听audioContext的相关事件
      if (ctx.isFirstPlay) {
        this.dispatch("setupAudioContextListenerAction");
        ctx.isFirstPlay = false;
      }
    },
    setupAudioContextListenerAction(ctx) {
      // 监听歌曲可以播放
      audioContext.onCanplay(() => {
        audioContext.play();
      });
      // 监听播放时间改变
      audioContext.onTimeUpdate(() => {
        // 1. 获取当前时间
        const currentTime = audioContext.currentTime * 1000;
        // 2. 根据当前时间修改store中currentTime
        ctx.currentTime = currentTime;
        // 3. 根据当前时间查找播放的歌词索引
        if (!ctx.lyricInfos.length) return;
        let i = 0;
        for (; i < ctx.lyricInfos.length; i++) {
          const lyricInfo = ctx.lyricInfos[i];
          if (currentTime < lyricInfo.time) {
            break;
          }
        }
        // 4. 设置当前歌词的索引和内容，并设置向上滚动的距离
        const currentLyricIndex = i - 1;
        if (currentLyricIndex !== ctx.currentLyricIndex) {
          const currentLyricInfo = ctx.lyricInfos[currentLyricIndex];
          ctx.currentLyricIndex = currentLyricIndex;
          ctx.currentLyricText = currentLyricInfo.text || "";
        }
      });
      // 监听歌曲播放完成
      audioContext.onEnded(() => {
        this.dispatch("changeNewMusicAction");
      });
    },
    changeMusicPlayStatusAction(ctx, isPlaying = true) {
      ctx.isPlaying = isPlaying;
      ctx.isPlaying ? audioContext.play() : audioContext.pause();
    },
    changeNewMusicAction(ctx, isNext = true) {
      // 1. 获取当前音乐索引
      let index = ctx.playListIndex;
      // 2. 根据不同的播放模式，获取下一首歌索引
      switch (ctx.playModeIndex) {
        case 0: // 顺序播放
          index = isNext ? index + 1 : index - 1;
          if (index === -1) {
            index = ctx.playListSongs.length - 1;
          } else if (index === ctx.playListSongs.length - 1) {
            index = 0;
          }
          break;
        case 1: // 单曲循环
          break;
        case 2: // 随机播放
          index = Math.floor(Math.random() * ctx.playListSongs.length);
          break;
      }
      // 3. 获取对应的歌曲
      let currentSong = ctx.playListSongs[index];
      if (!currentSong) {
        currentSong = ctx.currentSong;
      } else {
        // 记录最新的索引
        ctx.playListIndex = index;
      }
      // 4. 播放新的歌曲
      this.dispatch("playMusicWithSongIdAction", {
        id: currentSong.id,
        isRefresh: true,
      });
    },
  },
});

export { playerStore, audioContext };
