import { playerStore } from "../../store/index";

// components/song-item-v1/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
      value: {},
    },
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    handleSongItemClick: function () {
      const id = this.properties.item.id;
      // 1. 页面跳转
      wx.navigateTo({
        url: `/pages/music-player/index?id=${id}`,
      });
      // 2. 派发playStore中请求数据的action(数据请求+其他操作)
      playerStore.dispatch("playMusicWithSongIdAction", { id });
    },
  },
});
