<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <el-input placeholder="请输入内容" class="search">
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <el-button type="success" plain @click="dialogFormVisible = true">添加用户</el-button>
      <!-- 打开嵌套表单的 Dialog -->
      <el-dialog title="添加用户" :visible.sync="dialogFormVisible">
        <el-form :model="form" ref="addForm" :rules='rules'>
          <el-form-item label="用户名" :label-width="formLabelWidth" required>
            <el-input v-model="form.username" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" :label-width="formLabelWidth" required>
            <el-input v-model="form.password" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" :label-width="formLabelWidth" required>
            <el-input v-model="form.email" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="电话" :label-width="formLabelWidth" required>
            <el-input v-model="form.mobile" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUserList">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <div>
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
          prop="username"
          label="姓名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="电话"
          width="180">
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          width="180">
        </el-table-column>
        <el-table-column
          prop="mg_state"
          label="用户状态"
          width="180">
          <template slot-scope="scope">
            <!-- 作用域插槽，可以定制数据显示 -->
            <!-- toggleUser 不传参打印的是false true 拿不到数据 所以要带参数 第二个参数是undefind -->
            <el-switch @change='toggleUser(scope.row)' v-model="scope.row.mg_state"></el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="300">
          <template slot-scope="scope">
            <el-button type="primary" size='small' icon="el-icon-edit" @click="dialogEditVisible = true"></el-button>
            <el-button type="primary" size='small' icon="el-icon-check"></el-button>
            <el-button type="primary" size='small' icon="el-icon-delete" @click='deleteUser(scope.row)'></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div>
        <!-- 打开嵌套表单的 Dialog -->
        <el-dialog title="编辑用户" :visible.sync="dialogEditVisible">
          <el-form :model="formEdit">
            <el-form-item label="用户名" :label-width="formLabelWidth" required>
              <el-input v-model="formEdit.username" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" :label-width="formLabelWidth" required>
              <el-input v-model="formEdit.email" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="电话" :label-width="formLabelWidth" required>
              <el-input v-model="formEdit.mobile" auto-complete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogEditVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogEditVisible = false">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
    <div>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 50, 100]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import {getUsersData, toggleUserState, deleteUserData, addUserData} from '../../api/api.js'
export default {
  data () {
    return {
      tableData: [], // 实际的表格列表数据
      currentPage: 1, // 当前页码
      pagesize: 5, // 每页显示条数
      total: 0, // 数据总条数
      dialogFormVisible: false,
      form: {
        username: '',
        password: '',
        mobile: '',
        email: ''
      },
      dialogEditVisible: false,
      formEdit: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      formLabelWidth: '120px',
      rules: {
        // 用户输入规则 element-ui 提供
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    initList () {
      // 初始化数据列表
      getUsersData({
        query: '',
        pagenum: this.currentPage,
        pagesize: this.pagesize
      }).then(res => {
        console.log(res)
        if (res.meta.status === 200) {
          this.tableData = res.data.users
          this.total = res.data.total
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
    toggleUser (data) {
      // 改变用户状态
      toggleUserState({
        uId: data.id, // 用户id
        state: data.mg_state // 用户当前状态
      }).then(res => {
        // console.log(res)
        // 状态 res.data.mg_state 0和1 之间切换,只要判断 res.meta.status是 200 就是设置成功了
        if (res.meta.status === 200) {
          // 弹窗提示成功信息
          this.$message({
            message: res.meta.msg,
            type: 'success'
          })
        }
      })
    },
    deleteUser (data) {
      // 删除用户
      deleteUserData({
        uId: data.id // 用户id
      }).then(res => {
        // console.log(res)
        if (res.meta.status === 200) {
          this.initList()
          this.$message({
            message: res.meta.msg,
            type: 'success'
          })
        }
      })
    },
    addUserList () {
      // console.log(data)
      // 添加用户
      addUserData({
        username: this.form.username,
        password: this.form.password,
        moblie: this.form.mobile,
        email: this.form.email
      }).then(res => {
        console.log(res)
        if (res.meta.status === 201) {
          res.data.mobile = this.form.mobile
          this.initList()
          this.dialogFormVisible = false
          this.$message({
            message: res.meta.msg,
            type: 'success'
          })
        }
      })
    }
  },
  mounted () {
    // 首次加载页面，初始化表格数据
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
  .search {
    width: 300px;
  }
  .el-pagination {
    padding-top: 10px;
    background-color: #D3DCE6;
    height: 35px;
    line-height: 40px;
    padding-left: 10px;
  }
</style>
