// pages/detail-search/index.js
import {
  getSearchHot,
  getSearchSuggest,
  getSearchResult,
} from "../../service/api_search";
import debounce from "../../utils/debounce";
import stringToNodes from "../../utils/string2nodes";
import { updateSearchHistory } from "../../utils/searching";
import { SEARCH_HISTORY } from "../../constants/search-const";

const debouncedGetSearchSuggest = debounce(getSearchSuggest, 300);

Page({
  data: {
    hotKeywords: [],
    suggestSongs: [],
    suggestSongsNodes: [],
    resultSongs: [],
    searchValue: "",
    historyRecords: [],
  },

  onLoad: function (options) {
    this.getPageData();
  },

  getPageData: function () {
    // 网络请求
    getSearchHot().then((res) => {
      this.setData({ hotKeywords: res.result.hots });
    });
    // 本地缓存
    this.setData({ historyRecords: wx.getStorageSync(SEARCH_HISTORY) });
  },

  // 事件处理
  handleSearchChange: function (event) {
    // 1. 获取输入的关键字
    const searchValue = event.detail;
    // 2. 保存关键字
    this.setData({ searchValue });
    // 3. 关键字为空字符串的处理逻辑，需要清空建议歌曲
    if (!searchValue.length) {
      this.setData({
        suggestSongs: [],
        suggestSongsNodes: [],
        resultSongs: [],
      });
      debouncedGetSearchSuggest.cancel();
      return;
    }
    // 4. 根据关键字进行搜索，发送网络请求
    if (!this.data.resultSongs.length) {
      debouncedGetSearchSuggest(searchValue).then((res) => {
        // 4.1 获取建议的关键字歌曲
        const suggestSongs = res.result.allMatch;
        this.setData({ suggestSongs });
        if (!suggestSongs) return;
        // 4.2 转成node节点
        const suggestKeywords = suggestSongs.map((item) => item.keyword);
        const suggestSongsNodes = [];
        for (const keyword of suggestKeywords) {
          const nodes = stringToNodes(keyword, searchValue);
          suggestSongsNodes.push(nodes);
        }
        this.setData({ suggestSongsNodes });
      });
    }
  },

  handleSearchAction: function () {
    const searchValue = this.data.searchValue;
    // 存入历史记录
    this.setData({ historyRecords: updateSearchHistory(searchValue) });
    getSearchResult(searchValue).then((res) => {
      this.setData({ resultSongs: res.result.songs });
    });
  },

  handleKeywordItemClick: function (event) {
    // 1.获取点击的搜索建议中的关键字
    const keyword = event.currentTarget.dataset.keyword;
    // 2.将关键字设置到searchValue中
    this.setData({ searchValue: keyword });
    // 3.发起网络请求
    this.handleSearchAction();
    // 4.存入历史记录
    this.setData({
      historyRecords: updateSearchHistory(keyword),
    });
  },
});
