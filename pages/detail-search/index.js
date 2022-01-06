// pages/detail-search/index.js
import { getSearchHot, getSearchSuggest } from "../../service/api_search";

Page({
  data: {
    hotKeywords: [],
    suggestSongs: [],
    searchValue: "",
  },

  onLoad: function (options) {
    this.getPageData();
  },

  getPageData: function () {
    getSearchHot().then((res) => {
      this.setData({ hotKeywords: res.result.hots });
    });
  },

  // 事件处理
  handleSearchChange: function (event) {
    // 1. 获取输入的关键字
    const searchValue = event.detail;
    // 2. 保存关键字
    this.setData({ searchValue });
    // 3. 关键字为空字符串的处理逻辑，需要清空建议歌曲
    if (!searchValue.length) {
      this.setData({ suggestSongs: [] });
      return;
    }
    // 4. 根据关键字进行搜索，发送网络请求
    getSearchSuggest(searchValue).then((res) => {
      this.setData({ suggestSongs: res.result.allMatch });
    });
  },
});
