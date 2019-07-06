<template>
  <div>edit</div>
</template>
<script>
export default {
  data() {
    return {};
  },
  created() {
    let id = this.$route.params.id
    this.getGood(id);
  },
  methods: {
    async getGood(id) {
      try {
        // let res = await 
        console.log(id)
      } catch (err) {}
    }
  }
};
</script>

