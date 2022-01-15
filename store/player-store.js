import { HYEventStore } from "hy-event-store";
import { parseLyric } from "../utils/parse-lyric";
import { getSongDetail, getSongLyric } from "../service/api_player";

const audioContext = wx.createInnerAudioContext();

const playerStore = new HYEventStore({
  state: {
    currentSong: {},
    lyricInfos: [],
    currentTime: 0,
    durationTime: 0,
    currentLyricIndex: 0,
    currentLyricText: "",
    isPlaying: false,
    playModeIndex: 0, // 0:列表循环 1:单曲循环 2:随机播放
  },
  actions: {
    playMusicWithSongIdAction(ctx, { id }) {
      ctx.id = id;
      // 0.修改是否正在播放状态
      ctx.isPlaying = true;
      // 1.根据id请求数据
      // 请求歌曲详情
      getSongDetail(id).then((res) => {
        ctx.currentSong = res.songs[0];
        ctx.durationTime = res.songs[0].dt;
      });
      // 请求歌词
      getSongLyric(id).then((res) => {
        const lyricString = res.lrc.lyric;
        const lyrics = parseLyric(lyricString);
        ctx.lyricInfos = lyrics;
      });
      // 2.播放对应id的歌曲
      audioContext.stop(); // 停止上一首音乐
      audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
      audioContext.autoplay = true;
      // 3.监听audioContext的相关事件
      this.dispatch("setupAudioContextListenerAction");
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
          ctx.currentLyricText = currentLyricInfo.text;
        }
      });
    },
    changeMusicPlayStatusAction(ctx) {
      ctx.isPlaying = !ctx.isPlaying;
      ctx.isPlaying ? audioContext.play() : audioContext.pause();
    },
  },
});

export { playerStore, audioContext };
