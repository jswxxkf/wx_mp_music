import kfRequest from "./index";

export function getSongDetail(ids) {
  return kfRequest.get("/song/detail", {
    ids,
  });
}
