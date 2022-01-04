import kfRequest from "./index";

export function getBanners() {
  return kfRequest.get("/banner", { type: 2 });
}

export function getRankings(idx) {
  return kfRequest.get("/top/list", { idx });
}

export function getSongMenu(cat = "全部", limit = 6, offset = 0) {
  return kfRequest.get("/top/playlist", {
    cat,
    limit,
    offset,
  });
}
