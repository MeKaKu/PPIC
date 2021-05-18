<template>
  <Collection>
    <template v-slot:cell="props">
      <img-item :item="props.data" />
    </template>
  </Collection>
</template>

<script>
import Collection from "@/components/pictureStream/Collection";
import ImgItem from "@/components/pictureStream/ImgItem";
export default {
  name: "index",
  components :{
    Collection,
    ImgItem,
  },
  data(){
    return {

    }
  },
  created() {

  }
}
</script>

<style scoped>

</style>