import { SEARCH_HISTORY } from "../constants/search-const";

export function updateSearchHistory(newRecord) {
  let historyRecords = wx.getStorageSync(SEARCH_HISTORY);
  if (!historyRecords) {
    historyRecords = [];
    wx.setStorageSync(SEARCH_HISTORY, historyRecords);
  }
  if (historyRecords.includes(newRecord)) {
    const index = historyRecords.findIndex((record) => record === newRecord);
    historyRecords.splice(index, 1);
  }
  historyRecords.unshift(newRecord);
  // 最多保留10条
  if (historyRecords.length > 10) {
    historyRecords.pop();
  }
  wx.setStorageSync(SEARCH_HISTORY, historyRecords);
  return historyRecords;
}
