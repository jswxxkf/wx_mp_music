import kfRequest from "./index";

export function getSongDetail(ids) {
  return kfRequest.get("/song/detail", {
    ids,
  });
}

export function getSongLyric(id) {
  return kfRequest.get("/lyric", {
    id,
  });
}
