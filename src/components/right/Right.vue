<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <!-- type='index 设置每列显示索引' -->
      <el-table-column
        type="index"
        label="#"
        width="180">
      </el-table-column>
      <el-table-column
        prop="authName"
        label="权限名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="path"
        label="路径"
        width="180">
      </el-table-column>
      <el-table-column
        prop="level"
        label="层级"
        width="180">
        <template slot-scope='scope'>
          <span v-if='scope.row.level === "0"'>一级</span>
          <span v-else-if='scope.row.level === "1"'>二级</span>
          <span v-else>三级</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {rightList} from '../../api/api.js'
export default {
  data () {
    return {
      tableData: []
    }
  },
  mounted () {
    // 展示数据列表
    rightList({type: 'list'}).then(res => {
      // console.log(res)
      if (res.meta.status === 200) {
        this.tableData = res.data
      }
    })
  }
}
</script>

<style scoped>
  .el-breadcrumb {
    background-color: #D3DCE6;
    height: 40px;
    line-height: 40px;
    padding-left: 10px;
  }
</style>
