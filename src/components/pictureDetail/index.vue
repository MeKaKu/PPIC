<template>
  <div class="pictureDetail">
    <img-detail />
    <Comment />
  </div>
</template>

<script>
//import { mapGetters } from 'vuex';
import Comment from './Comment';
import ImgDetail from "@/components/pictureDetail/ImgDetail";
export default {
  name: "index",
  components: {
    Comment,
    ImgDetail,
  }
}
</script>

<style scoped>

</style>