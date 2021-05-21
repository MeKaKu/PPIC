import user from './user'
import picture from "./picture";
import pictureLiked from "./pictureLiked";
import comment from "./comment";
import commentLiked from "./commentLiked";
import album from "./album";
import collection from "@/network/api/collection";
import milvus from "@/network/api/milvus";
import msg from "@/network/api/msg";

const api = {
  user,
  picture,
  pictureLiked,
  comment,
  commentLiked,
  album,
  collection,
  milvus,
  msg,
}

export default api