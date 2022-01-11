// base-ui/nav-bar/index.js
const globalData = getApp().globalData;

Component({
  // 必须开启多个插槽
  options: {
    multipleSlots: true,
  },

  properties: {
    title: {
      type: String,
      value: "默认标题",
    },
  },

  data: {
    statusBarHeight: globalData.statusBarHeight,
    navBarHeight: globalData.navBarHeight,
  },

  methods: {},
  lifetimes: {
    ready: function () {},
  },
});
