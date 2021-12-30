import kfRequest from "./index";

export function getBanners() {
  return kfRequest.get("/banner", { type: 2 });
}
