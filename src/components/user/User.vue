<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <el-input v-model='query' placeholder="请输入内容" class="search">
        <el-button @click='queryHandle' slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <el-button type="success" plain @click="dialogFormVisible = true">添加用户</el-button>
    </div>
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <!-- type='index 设置每列显示索引' -->
      <el-table-column
        type="index"
        label="#"
        width="50">
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
        prop="role_name"
        label="角色"
        width="180">
      </el-table-column>
      <el-table-column
        prop="mg_state"
        label="用户状态"
        width="100">
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
          <el-button type="success" size='small' icon="el-icon-edit" @click="editHandle(scope.row)"></el-button>
          <el-button type="warning" size='small' icon="el-icon-delete" @click='deleteUser(scope.row)'></el-button>
          <el-button type="primary" size='small' icon="el-icon-check" @click='grantRole(scope.row)'></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5, 10, 50, 100]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 添加用户弹窗 Dialog -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisible">
      <el-form :model="user" ref="addUser" :rules='rules'>
        <el-form-item label="用户名" :label-width="formLabelWidth" prop='username'>
          <el-input v-model="user.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth" prop='password'>
          <el-input v-model="user.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop='email'>
          <el-input v-model="user.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth" prop='mobile'>
          <el-input v-model="user.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUserList">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改用户弹窗 Dialog -->
    <el-dialog title="编辑用户" :visible.sync="dialogEditVisible">
      <el-form :model="editUser" ref="editForm" :rules='rules'>
        <el-form-item label="用户名" :label-width="formLabelWidth" prop='username'>
          <el-input v-model="editUser.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop='email'>
          <el-input v-model="editUser.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth" prop='mobile'>
          <el-input v-model="editUser.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditVisible = false">取 消</el-button>
        <el-button type="primary" @click='editUserList'>确 定</el-button>
      </div>
    </el-dialog>
    <!-- 角色分配弹窗 Dialog -->
    <el-dialog title="角色分配" :visible.sync="dialogRoleVisible">
      <div>
        <span>当前用户名 :</span>
        <span>{{currentUser.username}}</span>
      </div>
      <div>
        <span>请选择角色 :</span>
        <el-select v-model="currentRole" placeholder="请选择">
          <el-option
            v-for="item in roleList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click='submitGrant'>确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {getUsersData, toggleUserState, addUserData, getUserById, editUserData, deleteUserData, getRoles, grantUserRole} from '../../api/api.js'
export default {
  data () {
    return {
      user: {
        username: '',
        password: '',
        mobile: '',
        email: ''
      },
      editUser: {
        id: '',
        username: '',
        password: '',
        mobile: '',
        email: ''
      },
      rules: {
        // 用户输入规则 element-ui 提供
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入电话', trigger: 'blur' }
        ]
      },
      dialogFormVisible: false,
      dialogEditVisible: false,
      dialogRoleVisible: false,
      formLabelWidth: '120px',
      tableData: [], // 实际的表格列表数据
      currentPage: 1, // 当前页码
      pagesize: 5, // 每页显示条数
      total: 0, // 数据总条数
      query: '',
      roleList: [],
      currentUser: {},
      currentRole: ''
    }
  },
  methods: {
    submitGrant () {
      grantUserRole({
        id: this.currentUser.id,
        rid: this.currentRole
      }).then(res => {
        if (res.meta.status === 200) {
          // 关闭弹窗
          this.dialogRoleVisible = false
          // 刷新列表
          this.initList()
          // 提示信息
          this.$message({
            message: res.meta.msg,
            type: 'success'
          })
        }
      })
      this.currentRole = ''
    },
    grantRole (row) {
      // 调获取角色数据接口填充下拉框
      this.currentUser = row
      getRoles().then(res => {
        if (res.meta.status === 200) {
          this.roleList = res.data
        }
      })
      this.dialogRoleVisible = true
    },
    queryHandle () {
      // 关键字搜索 双向绑定的
      this.initList()
    },
    deleteUser (row) {
      // 点击删除弹窗
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除用户
        deleteUserData({id: row.id}).then(res => {
          if (res.meta.status === 200) {
            this.initList()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    editHandle (row) {
      // 根据id查询用户
      getUserById({id: row.id}).then(res => {
        if (res.meta.status === 200) {
          // 填充表单
          this.editUser.id = res.data.id
          this.editUser.username = res.data.username
          this.editUser.email = res.data.email
          this.editUser.mobile = res.data.mobile
          // 修改弹窗
          this.dialogEditVisible = true
        }
      })
    },
    editUserList () {
      // 验证表单
      this.$refs['editForm'].validate(valid => {
        if (valid) {
          editUserData(this.editUser).then(res => {
            // 关闭弹窗
            this.dialogEditVisible = false
            // 刷新列表
            this.initList()
            // 提示信息
            this.$message({
              message: res.meta.msg,
              type: 'success'
            })
          })
        }
      })
    },
    addUserList () {
      this.$refs['addUser'].validate(valid => {
        if (valid) {
          // 添加用户
          addUserData(this.user).then(res => {
            if (res.meta.status === 201) {
              // 清空内容
              this.user = {}
              // 关闭弹窗
              this.dialogFormVisible = false
              // 重绘页面
              this.initList()
              // 提示信息
              this.$message({
                message: res.meta.msg,
                type: 'success'
              })
            }
          })
        }
      })
    },
    toggleUser (data) {
      // 改变用户状态
      toggleUserState({
        id: data.id, // 用户id
        state: data.mg_state // 用户当前状态
      }).then(res => {
        // console.log(res)
        // 状态 res.data.mg_state 0和1 之间切换,只要判断 res.meta.status是 200 就是设置成功了
        if (res.meta.status === 200) {
          // 弹窗提示成功信息
          this.$message({
            message: res.meta.msg,
            duration: 1000,
            type: 'success'
          })
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
      getUsersData({
        query: this.query,
        pagenum: this.currentPage,
        pagesize: this.pagesize
      }).then(res => {
        console.log(res)
        if (res.meta.status === 200) {
          this.tableData = res.data.users
          this.total = res.data.total
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
