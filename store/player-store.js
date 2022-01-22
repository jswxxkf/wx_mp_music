import { HYEventStore } from "hy-event-store";
import { parseLyric, checkPureMusic } from "../utils/parse-lyric";
import { getSongDetail, getSongLyric } from "../service/api_player";

// const audioContext = wx.createInnerAudioContext();
const audioContext = wx.getBackgroundAudioManager();

const playerStore = new HYEventStore({
  state: {
    isFirstPlay: true, // 是否是第一次播放
    isBgStopped: false, // 是否被后台停止
    isFgChanged: false, // 是否前台切换歌曲(进一步停止上一首导致触发onStop)
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
    async playMusicWithSongIdAction(ctx, { id, isRefresh = false }) {
      // 1.监听audioContext的相关事件
      if (ctx.isFirstPlay) {
        this.dispatch("setupAudioContextListenerAction");
        ctx.isFirstPlay = false;
      }
      if (ctx.id == id && !isRefresh) {
        this.dispatch("changeMusicPlayStatusAction", true);
        return;
      }
      ctx.id = id;
      ctx.isFgChanged = true;
      audioContext.stop(); // 停止上一首音乐
      // 2.重置上一首歌曲信息，避免残影现象
      ctx.currentSong = {};
      ctx.durationTime = 0;
      ctx.lyricInfos = [];
      ctx.currentTime = 0;
      ctx.currentLyricIndex = 0;
      ctx.currentLyricText = "";
      ctx.isPureMusic = false;
      // 3.根据id请求数据
      // 请求歌曲详情
      const res = await getSongDetail(id);
      ctx.currentSong = res.songs[0];
      ctx.durationTime = res.songs[0].dt;
      if (!ctx.playListSongs.find((song) => song.id === id)) {
        ctx.playListSongs = [ctx.currentSong, ...ctx.playListSongs];
        ctx.playListIndex = 0;
      }
      // 请求歌词
      const res2 = await getSongLyric(id);
      const lyricString = res2.lrc.lyric;
      const lyrics = parseLyric(lyricString);
      ctx.lyricInfos = lyrics;
      ctx.isPureMusic = checkPureMusic(lyrics);
      // 4.播放对应id的歌曲
      audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
      // 从歌曲信息中拿到name，设置为后台播放时的title
      audioContext.title = ctx.currentSong.name;
      audioContext.autoplay = true;
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
          ctx.currentLyricText = currentLyricInfo?.text || "";
        }
      });
      // 监听歌曲播放完成
      audioContext.onEnded(() => {
        this.dispatch("changeNewMusicAction");
      });
      // 监听音乐暂停
      audioContext.onPlay(() => {
        ctx.isPlaying = true;
      });
      // 监听音乐暂停
      audioContext.onPause(() => {
        ctx.isPlaying = false;
      });
      // 监听用户在后台停止播放
      audioContext.onStop(() => {
        // 只有真正的后台停止，才需要暂停播放和记录后台停止状态
        // 因为切换上下首歌曲也会来到此回调中
        ctx.isPlaying = false;
        if (!ctx.isFgChanged) {
          ctx.isBgStopped = true;
        }
        ctx.isFgChanged = false;
      });
      // 以下仅IOS支持
      audioContext.onNext(() => {
        this.dispatch("changeNewMusicAction");
      });
      audioContext.onPrev(() => {
        this.dispatch("changeNewMusicAction", false);
      });
    },
    changeMusicPlayStatusAction(ctx, isPlaying = true) {
      ctx.isPlaying = isPlaying;
      if (ctx.isPlaying && ctx.isBgStopped) {
        audioContext.src = `https://music.163.com/song/media/outer/url?id=${ctx.id}.mp3`;
        audioContext.title = ctx.currentSong.name;
      }
      ctx.isPlaying ? audioContext.play() : audioContext.pause();
      if (ctx.isBgStopped) {
        ctx.isBgStopped = false;
      }
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
