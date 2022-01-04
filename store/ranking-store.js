import { HYEventStore } from "hy-event-store";
import { getRankings } from "../service/api_music";

const rankingMap = {
  0: "newRanking",
  1: "hotRanking",
  2: "originRanking",
  3: "thriveRanking",
};

const rankingStore = new HYEventStore({
  state: {
    newRanking: {}, // 0
    hotRanking: {}, // 1
    originRanking: {}, // 2
    thriveRanking: {}, // 3
  },
  actions: {
    // 0:新歌榜  1:热歌榜  2:原创榜  3:飙升榜
    getRankingDataAction(ctx) {
      for (let i = 0; i < 4; i++) {
        getRankings(i).then((res) => {
          const rankingName = rankingMap[i];
          ctx[rankingName] = res.playlist;
        });
      }
    },
  },
});

export { rankingStore };
