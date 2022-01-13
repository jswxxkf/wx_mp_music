const timeRegExp = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;

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
