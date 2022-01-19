// components/play-list/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    playListSongs: {
      type: Array,
      value: [],
    },
    currentSong: {
      type: Object,
      value: {},
    },
    offsetBottom: {
      type: String,
      value: "60px",
    },
  },

  data: {},

  methods: {
    handleListSongItemPlay(event) {
      const songId = event.currentTarget.dataset.id;
      this.triggerEvent("onListSongItemPlay", songId);
    },
  },
});
