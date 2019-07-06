<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <router-view/>
  </div>
</template>
<script>
export default {
  data(){
    return {}
  }
}
</script>
<style scoped>
.el-breadcrumb {
  background-color: #d3dce6;
  height: 40px;
  line-height: 40px;
  padding-left: 10px;
}
</style>


