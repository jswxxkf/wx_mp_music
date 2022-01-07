import kfRequest from "./index";

/**
 * 获取热门搜索列表数据
 */
export function getSearchHot() {
  return kfRequest.get("/search/hot");
}

/**
 * 获取搜索建议列表数据(移动端数据)
 * @param {string} keyword 输入的搜索关键字
 */
export function getSearchSuggest(keyword) {
  return kfRequest.get("/search/suggest", {
    keywords: keyword,
    type: "mobile",
  });
}
