const timeRegExp = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;

/**
 * 解析歌词，返回歌词数组
 * @param {string} lyricString 待解析的后端返回的歌词隔行字符串
 */
export function parseLyric(lyricString) {
  const lyricInfos = [];
  const lyricLines = lyricString.split("\n");
  for (const lineString of lyricLines) {
    const timeResult = timeRegExp.exec(lineString);
    if (!timeResult) continue;
    // 1. 获取时间
    const minute = timeResult[1] * 60 * 1000;
    const second = timeResult[2] * 1000;
    const millisecondTime = timeResult[3];
    const millisecond =
      millisecondTime.length === 2 ? millisecondTime * 10 : millisecondTime * 1;
    const time = minute + second + millisecond;
    // 2. 获取歌词文本
    const text = lineString.replace(timeRegExp, "");
    const lyricInfo = {
      time,
      text,
    };
    lyricInfos.push(lyricInfo);
  }
  return lyricInfos;
}

/**
 * 判断是否是纯音乐
 * @param {Array} lyricInfos 解析后的歌词信息数组
 */
export function checkPureMusic(lyricInfos) {
  return lyricInfos.find((lyricInfo) => lyricInfo.text === "纯音乐，请欣赏");
}
