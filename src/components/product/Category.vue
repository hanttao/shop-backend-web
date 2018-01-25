<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="success" plain @click="addhandler">添加分类</el-button>
    <div>
      <!-- columns表示所有的列，tree-structure表示数据格式，data-source表示实际的列表数据，deleteCate处理删除操作，showForm处理编辑操作，refresh处理刷新操作 -->
      <tree-grid :columns="columns" :tree-structure="true" :data-source="dataSource" @deleteCate="deleteCategory" @showForm="showEditForm" @refresh="initList"></tree-grid>
    </div>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5, 10, 50, 100]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 商品添加分类 Dialog -->
    <el-dialog title="添加分类" :visible.sync="dialogAddCategoryVisible">
      <div>
        <span>分类名称 :</span>
        <el-input class='cname' v-model="cate.cat_name" placeholder="请输入内容"></el-input>
      </div>
      <div>
        <span>父级分类 :</span>
        <el-cascader
          :options="categoryList"
          :props='propsDefine'
          :show-all-levels="false"
          v-model="selectedOptions"
        ></el-cascader>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddCategoryVisible = false">取 消</el-button>
        <el-button type="primary" @click='submitCategory'>确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改商品分类 Dialog -->
    <el-dialog title="编辑分类" :visible.sync="dialogEditCategoryVisible">
      <div>
        <span>分类名称 :</span>
        <el-input class='cname' v-model="ecate.cat_name" placeholder="请输入内容"></el-input>
      </div>
<!--       <div>
        <span>父级分类 :</span>
        <el-cascader
          :options="categoryList"
          :props='propsDefine'
          :show-all-levels="false"
          v-model="selectedOptions"
        ></el-cascader>
      </div> -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditCategoryVisible = false">取 消</el-button>
        <el-button type="primary" @click='submitEditCategory'>确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 引入自定义组件
import TreeGrid from './TreeGrid.vue'
import {getCategorysData, addCategoryData, getCategoryById, editCategoryData, deleteCategoryData} from '../../api/api.js'
export default {
  data () {
    return {
      ecate: {
        cat_pid: '',
        cat_name: '',
        cat_level: ''
      },
      dialogEditCategoryVisible: false,
      cate: {
        cat_pid: '',
        cat_name: '',
        cat_level: ''
      },
      propsDefine: {
        value: 'cat_id',
        label: 'cat_name'
      },
      categoryList: [],
      ecategoryList: [],
      selectedOptions: [],
      dialogAddCategoryVisible: false,
      dataSource: [],
      columns: [{
        text: '分类名称',
        dataIndex: 'cat_name',
        width: 500
      }, {
        text: '是否有效',
        dataIndex: 'cat_deleted',
        width: 100
      }, {
        text: '排序',
        dataIndex: 'cat_level',
        width: 100
      }],
      pagesize: 5,
      currentPage: 1,
      total: 0
    }
  },
  methods: {
    refresh () {
      console.log('fresh')
    },
    deleteCategory (cid) {
      deleteCategoryData({id: cid}).then(res => {
        if (res.meta.status === 200) {
          // 刷新列表
          this.initList()
          this.$message({
            type: 'success',
            message: res.meta.msg
          })
        }
      })
    },
    submitEditCategory () {
      // 编辑分类 第二步
      // 提交数据和数据库同步
      editCategoryData(this.ecate).then(res => {
        if (res.meta.status === 200) {
          // 刷新列表
          this.initList()
          // 关闭窗口
          this.dialogEditCategoryVisible = false
          // 提示
          this.$message({
            type: 'success',
            message: res.meta.msg
          })
        }
      })
    },
    showEditForm (cid) {
      // 编辑分类 第一步
      // 1 获取分类下拉列表数据
      getCategorysData().then(res => {
        if (res.meta.status === 200) {
          this.ecatetoryList = res.data
          // 获取数据后调用获取分类信息接口
          return getCategoryById({id: cid})
        }
      }).then(res => {
        if (res.meta.status === 200) {
          // 2 数据填充表单
          this.ecate.cat_pid = res.data.cat_id
          this.ecate.cat_name = res.data.cat_name
          this.ecate.cat_level = res.data.cat_level
          // 3 弹窗
          this.dialogEditCategoryVisible = true
        }
      })
    },
    submitCategory () {
      // 添加分类无法确定添加的是顶级分类还是三级分类名称
      // 通过selectedOptions.length是0|1|2判断
      // 处理参数cate.pid cate.level
      // level 是0 1 2 如果从1开始不能添加第三层分类
      if (this.selectedOptions.length === 0) {
        this.cate.cat_pid = 0
        this.cate.cat_level = 0
      } else {
        this.cate.cat_level = this.selectedOptions.length === 1 ? 1 : 2
        this.cate.cat_pid = this.selectedOptions[this.selectedOptions.length - 1]
      }
      addCategoryData(this.cate).then(res => {
        if (res.meta.status === 201) {
          // 刷新列表
          this.initList()
          // 关闭窗口
          this.dialogAddCategoryVisible = false
          // 提示
          this.$message({
            type: 'success',
            message: res.meta.msg
          })
        }
      })
    },
    addhandler () {
      // 点击添加 弹窗 调取分类选项数据
      getCategorysData({type: 2}).then(res => {
        if (res.meta.status === 200) {
          this.dialogAddCategoryVisible = true
          this.categoryList = res.data
        }
      })
    },
    handleSizeChange (val) {
      // 改变每页显示条数
      // console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.initList()
    },
    handleCurrentChange (val) {
      // 改变当前页码
      // console.log(`当前页: ${val}`)
      this.currentPage = val
      this.initList()
    },
    initList () {
      // 初始化数据列表
      getCategorysData({
        type: 3,
        pagenum: this.currentPage,
        pagesize: this.pagesize
      }).then(res => {
        if (res.meta.status === 200) {
          this.dataSource = res.data.result
          this.pagesize = res.data.pagesize
          this.total = res.data.total
          console.log(res)
        }
      })
    }
  },
  components: {
    TreeGrid
  },
  mounted () {
    // 首次加载 初始化数据
    this.initList()
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
  .el-pagination {
    padding-top: 10px;
    background-color: #D3DCE6;
    height: 35px;
    line-height: 40px;
    padding-left: 10px;
  }
  .cname {
    width: 300px;
    margin-bottom: 20px;
  }
</style>
