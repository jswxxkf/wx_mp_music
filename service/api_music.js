import kfRequest from "./index";

export function getBanners() {
  return kfRequest.get("/banner", { type: 2 });
}

export function getRankings(idx) {
  return kfRequest.get("/top/list", { idx });
}
