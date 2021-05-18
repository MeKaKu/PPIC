import user from './user'
import picture from "./picture";
import pictureLiked from "./pictureLiked";
import comment from "./comment";
import commentLiked from "./commentLiked";
import album from "./album";
import collection from "@/network/api/collection";
import milvus from "@/network/api/milvus";

const api = {
  user,
  picture,
  pictureLiked,
  comment,
  commentLiked,
  album,
  collection,
  milvus,
}

export default api