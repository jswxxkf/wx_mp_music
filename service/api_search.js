import kfRequest from "./index";

export function getSearchHot() {
  return kfRequest.get("/search/hot");
}

export function getSearchSuggest(keyword) {
  return kfRequest.get("/search/suggest", {
    keywords: keyword,
    type: "mobile",
  });
}
