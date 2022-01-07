import kfRequest from "./index";

/**
 * 请求Mobile轮播图数据
 */
export function getBanners() {
  return kfRequest.get("/banner", { type: 2 });
}

/**
 * 请求歌曲排行数据
 * @param {number} idx 榜单idx 0:新歌 1:热门 2:原创 3:飙升
 */
export function getRankings(idx) {
  return kfRequest.get("/top/list", { idx });
}

/**
 * 请求歌单(网友精选碟歌单)数据
 * @param {string} cat 歌曲列表类型
 * @param {number} limit 限定数目
 * @param {number} offset 偏移数目，但此处无需用于pagination~
 */
export function getSongMenu(cat = "全部", limit = 6, offset = 0) {
  return kfRequest.get("/top/playlist", {
    cat,
    limit,
    offset,
  });
}

/**
 * 请求歌单详情数据, 如评论数, 是否收藏, 播放数
 * @param {number} id 歌单id
 */
export function getSongMenuDetail(id) {
  return kfRequest.get("/playlist/detail/dynamic", {
    id,
  });
}
