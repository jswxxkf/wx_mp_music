import kfRequest from "../service/index";

export function getTopMV(offset, limit = 10) {
  return kfRequest.get("/top/mv", { offset, limit });
}
