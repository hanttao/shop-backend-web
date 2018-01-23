<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="success" plain @click='dialogVisible4Add = true'>添加角色</el-button>
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <!-- 设置 type='expand'  开启展开功能-->
      <el-table-column type='expand'
        width="50">
        <template slot-scope='scope'>
          <el-row :key="item.id" v-for="item in scope.row.children">
            <el-col :span="3">
              <el-tag @close="deleteRight(scope.row, item.id)" closable>{{item.authName}}</el-tag>
              <i v-if="item.children.length>0" class="el-icon-arrow-right arrow"></i>
            </el-col>
            <el-col :span="21">
              <el-row class="authlist" :key="tag.id" v-for="tag in item.children">
                <el-col :span="4">
                  <el-tag @close="deleteRight(scope.row, tag.id)" type="success" closable>{{tag.authName}}</el-tag>
                  <i v-if="tag.children.length>0" class="el-icon-arrow-right arrow"></i>
                </el-col>
                <el-col :span="20">
                  <el-tag @close="deleteRight(scope.row, btn.id)" :key="btn.id" type="warning" closable v-for="btn in tag.children">{{btn.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column
        type="index"
        label="#"
        width="50">
      </el-table-column>
      <el-table-column
        prop="roleName"
        label="角色名称"
        width="200">
      </el-table-column>
      <el-table-column
        prop="roleDesc"
        label="描述"
        width="500">
      </el-table-column>
      <el-table-column
        label="操作"
        width="260">
        <template slot-scope='scope'>
          <el-button type="success" size='small' icon="el-icon-edit" @click="editHandle(scope.row)"></el-button>
          <el-button type="warning" size='small' icon="el-icon-delete" @click='deleteRole(scope.row)'></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加角色弹窗 -->
    <el-dialog
      title="添加角色"
      @close='closeUserDialog("add")'
      :visible="dialogVisible4Add">
      <el-form ref="roleform" :rules="rules" :model="role" label-width="80px">
        <el-form-item label="角色名称" prop='roleName'>
          <el-input v-model="role.roleName"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop='roleDesc'>
          <el-input v-model="role.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible4Add = false">取 消</el-button>
        <el-button type="primary" @click="submitRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色弹窗 -->
    <el-dialog
      title="编辑角色"
      @close='closeUserDialog("edit")'
      :visible="dialogVisible4Edit"
      width="50%">
      <el-form ref="eroleform" :rules="rules" :model="erole" label-width="80px">
        <el-form-item label="角色名称" prop='roleName'>
          <el-input v-model="erole.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop='roleDesc'>
          <el-input v-model="erole.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible4Edit = false">取 消</el-button>
        <el-button type="primary" @click="submitRole4Edit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {getRoles, addRoleData, getRoleById, editRoleData, deleteRoleData, deleteRoleRight} from '../../api/api.js'
export default {
  data () {
    return {
      role: {
        roleName: '',
        roleDesc: ''
      },
      erole: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      rules: {
        // 用户输入规则 element-ui 提供
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      dialogVisible4Add: false,
      dialogVisible4Edit: false,
      tableData: []
    }
  },
  methods: {
    deleteRight (row, rightId) {
      deleteRoleRight({
        roleId: row.id,
        rightId: rightId
      }).then(res => {
        if (res.meta.status === 200) {
          row.children = res.data
          this.$message({
            type: 'success',
            message: res.meta.msg
          })
        }
      })
    },
    deleteRole (row) {
      // 点击删除弹窗
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除用户
        deleteRoleData({id: row.id}).then(res => {
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
      // 根据id查询角色
      getRoleById({id: row.id}).then(res => {
        if (res.meta.status === 200) {
          this.erole.id = res.data.roleId
          this.erole.roleName = res.data.roleName
          this.erole.roleDesc = res.data.roleDesc
          // 填充表单弹窗
          this.dialogVisible4Edit = true
        }
      })
    },
    submitRole4Edit () {
      // 先验证表单
      this.$refs['eroleform'].validate(valid => {
        if (valid) {
          // 编辑角色并提交
          editRoleData(this.erole).then(res => {
            if (res.meta.status === 200) {
              // 关闭弹窗
              this.dialogVisible4Edit = false
              // 重新渲染页面
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
    submitRole () {
      // 验证表单
      this.$refs['roleform'].validate(valid => {
        if (valid) {
          addRoleData(this.role).then(res => {
            if (res.meta.status === 201) {
              this.role = res.data
              // 关闭弹窗
              this.dialogVisible4Add = false
              // 刷新列表
              this.initList()
              // 提示信息
              this.$message({
                message: res.meta.msg,
                type: 'success'
              })
            }
            // 清空添加表单数据
            this.role = {}
          })
        }
      })
    },
    closeUserDialog (flag) {
      // 关闭弹窗
      if (flag === 'add') {
        this.dialogVisible4Add = false
      } else {
        this.dialogVisible4Edit = false
      }
    },
    initList () {
      // 提取数据
      getRoles().then(res => {
        // console.log(res)
        if (res.meta.status === 200) {
          this.tableData = res.data
        }
      })
    }
  },
  mounted () {
    // 首次加载页面，初始化数据列表
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
</style>
