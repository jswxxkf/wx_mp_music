import kfRequest from "./index";

/**
 * 获取热门搜索列表数据
 */
export function getSearchHot() {
  return kfRequest.get("/search/hot");
}

/**
 * 获取搜索建议(搜索联想)列表数据(移动端数据)
 * @param {string} keyword 输入的搜索关键字
 */
export function getSearchSuggest(keyword) {
  return kfRequest.get("/search/suggest", {
    keywords: keyword,
    type: "mobile",
  });
}

/**
 * 根据搜索关键字，获取搜索到的歌曲结果
 * @param {string} keywords 搜索关键字
 */
export function getSearchResult(keywords) {
  return kfRequest.get("/search", {
    keywords,
  });
}
