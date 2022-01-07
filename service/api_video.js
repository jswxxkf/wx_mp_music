import kfRequest from "../service/index";

export function getTopMV(offset, limit = 10) {
  return kfRequest.get("/top/mv", { offset, limit });
}

/**
 * 请求MV的播放地址
 * @param {number} id
 */
export function getMVURL(id) {
  return kfRequest.get("/mv/url", { id });
}

/**
 * 请求MV详情数据(包括播放量、歌手、标题等)
 * @param {number} mvid MV的id
 */
export function getMVDetail(mvid) {
  return kfRequest.get("/mv/detail", { mvid });
}

/**
 * 获取相关视频
 * @param {number} id 
 */
export function getRelatedVideo(id) {
  return kfRequest.get("/related/allvideo", { id });
}
