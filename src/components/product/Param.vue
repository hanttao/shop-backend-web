<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-cascader
      :options="categoryList"
      :props='propsDefine'
      :show-all-levels="false"
      v-model="selectedOptions"
      @change='handleChange'
    ></el-cascader>
    <el-tabs type="border-card" :value='nowTab' @tab-click='toggleTab'>
      <el-tab-pane label="动态参数" name='dynamic'>
        <el-button type="success" plain>添加参数</el-button>
        <el-table
          border
          :data="dtableData"
          style="width: 100%">
          <el-table-column
            type="index"
            label="#"
            width="50">
          </el-table-column>
          <el-table-column
            prop="attr_name"
            label="参数名称"
            width="180">
          </el-table-column>
          <el-table-column
            width="280"
            label="操作">
            <template slot-scope="scope">
              <el-button size='small' type="primary" icon="el-icon-edit"></el-button>
              <el-button size='small' type="danger" icon="el-icon-delete"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="静态属性" name='static'>
        <el-button type="success" plain>添加属性</el-button>
        <el-table
          border
          :data="stableData"
          style="width: 100%">
          <el-table-column
            type="index"
            label="#"
            width="50">
          </el-table-column>
          <el-table-column
            prop="attr_name"
            label="属性名称"
            width="180">
          </el-table-column>
           <el-table-column
            prop="attr_vals"
            label="属性值"
            width="180">
          </el-table-column>
          <el-table-column
            width="280"
            label="操作">
            <template slot-scope="scope">
              <el-button size='small' type="primary" icon="el-icon-edit"></el-button>
              <el-button size='small' type="danger" icon="el-icon-delete"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {getCategorysData, getGarams} from '../../api/api.js'
export default {
  data () {
    return {
      nowTab: 'dynamic',
      categoryList: [],
      selectedOptions: [],
      dtableData: [],
      stableData: [],
      propsDefine: {
        value: 'cat_id',
        label: 'cat_name'
      }
    }
  },
  methods: {
    toggleTab (obj) {
      // tab栏切换 obj vue实例
      // 必须赋值给this.nowTab确保与参数flag值一致
      this.nowTab = obj.name
      let str = obj.name === 'static' ? 'stableData' : 'dtableData'
      this._getGarams(str)
      console.log(this[str])
    },
    _getGarams (tabType) {
      let length = this.selectedOptions.length
      if (length !== 3) {
        this.$message({
          type: 'error',
          message: '请选择三级分类'
        })
      }
      let cid = this.selectedOptions[2]
      let flag = this.nowTab === 'dynamic' ? 'many' : 'only'
      getGarams({
        id: cid,
        sel: flag
      }).then(res => {
        if (res.meta.status === 200) {
          this[tabType] = res.data
        }
      })
    },
    handleChange () {
      // 级联选项选中同步表格数据
      // 只能选择三级分类
      // 选择分类名称时候同步表格数据
      // tab栏切换封装函数调用
      this._getGarams('dtableData')
    }
  },
  mounted () {
    getCategorysData().then(res => {
      if (res.meta.status === 200) {
        this.categoryList = res.data
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
