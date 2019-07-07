<template>
  <div>
    <div class="title">添加商品信息</div>
    <el-steps :active="active" finish-status="success" align-center>
      <el-step title="步骤1" description></el-step>
      <el-step title="步骤2" description></el-step>
      <el-step title="步骤3" description></el-step>
      <el-step title="步骤4" description></el-step>
    </el-steps>
    <el-form ref="addProductForm" :rules="rules" label-width="80px">
      <el-tabs :tab-position="tabPosition" :value="nowTab" @tab-click="toggleTabs">
        <el-tab-pane label="基本信息" name="basic">
          <!-- 基本信息 -->
          <el-form-item label="商品名称">
            <el-input v-model="aform.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="aform.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="aform.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="aform.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader
              placeholder="请选择分类"
              expand-trigger="hover"
              :change-on-select="false"
              :show-all-levels="false"
              :options="aform.pcategory"
              :props="aform.selfDefineAttr"
              v-model="aform.selectedOptions"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="是否促销">
            <el-radio-group v-model="aform.is_promote" size="medium">
              <el-radio border label="true">是</el-radio>
              <el-radio border label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="动态参数" name="params">
          <!-- 动态参数 -->
          <el-form-item :key="item.attr_id" v-for="item in aform.dparam" :label="item.attr_name">
            <el-checkbox-group size="medium" v-model="item.attr_vals">
              <el-checkbox
                border
                :key="index"
                v-for="(tag, index) in item.attr_vals"
                :label="tag"
                :name="'p'+item.attr_id"
              ></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="attrs">
          <!-- 静态属性 -->
          <!-- <el-form-item :key="item.attr_id" v-for="item in aform.sparam" :label="item.attr_name">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>-->
        </el-tab-pane>
        <el-tab-pane label="图片上传" name="uploader">
          <!-- 图片上传 -->
          <!-- <el-upload
            :action="baseUrl"
            :headers="token"
            list-type="picture"
            multiple
            :on-preview="handlePictureCardPreview"
            :on-success="handleSuccess"
            :on-remove="handleRemove"
          >
            <el-button type="success" plain>
              上传
              <i class="el-icon-upload el-icon--right"></i>
            </el-button>
          </el-upload>-->
          <!-- <el-dialog :visible.sync="dialogVisible" append-to-body>
            <img width="100%" :src="dialogImageUrl" alt />
          </el-dialog>-->
        </el-tab-pane>
        <el-tab-pane label="商品详情" name="detail">
          <!-- <my-editor :defaultMsg="defaultMsg" :config="config" :id="editorId" ref="editor"></my-editor> -->
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <div class="footer">
      <el-button>取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
    </div>
  </div>
</template>
<script>
import { getCategorysData, getParams } from "@/api/api";
export default {
  data() {
    return {
      active: 2,
      tabPosition: "left",
      nowTab: "basic",
      rules: {},
      aform: {
        is_promote: false,
        pcategory: [],
        selectedOptions: [],
        dparam: [],
        dtype: [],
        sparam: [],
        richText: "",
        pictures: [],
        selfDefineAttr: {
          value: "cat_id",
          label: "cat_name"
        }
      },
      dialogImageUrl: "",
      dialogVisible: false,
      token: { authorization: localStorage.getItem("mytoken") },
      baseUrl: "http://localhost:8888/api/private/v1/upload"
    };
  },
  created() {
    this.getCategorysData();
  },
  methods: {
    async _handleParam(id) {
      try {
        let { data } = await getParams({ id: id, sel: "many" });
        this.aform.dparam = data.map(res => {
          res.attr_vals = res.attr_vals ? res.attr_vals.split(",") : [];
          return res;
        });
      } catch (err) {}
    },
    _handleAttrs() {},
    toggleTabs(param) {
      console.log(this.aform.selectedOptions);
      if (this.aform.selectedOptions.length !== 3) {
        // 没有选择三级分类，提示并终止运行
        this.$message({
          type: "error",
          message: "请选择三级分类"
        });
        return;
      }
      // 设置当前选中
      this.nowTab = param.name;
      if (this.nowTab === "params") {
        // 处理动态参数
        this._handleParam(this.aform.selectedOptions[2]);
      } else if (this.nowTab === "attrs") {
        // 处理静态参数
        this._handleAttrs(this.aform.selectedOptions[2]);
      }
    },
    handlePictureCardPreview(file) {
      // 图片预览
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleSuccess() {},
    handleRemove() {},
    handleConfirm() {},
    async getCategorysData() {
      try {
        let { data } = await getCategorysData({ type: 3 });
        this.aform.pcategory = data;
      } catch (err) {}
    }
  }
};
</script>
<style scoped>
.title {
  height: 45px;
  line-height: 45px;
  background-color: #d7e2ef;
  padding-left: 20px;
}
.el-steps {
  margin: 15px 0px;
  padding-left: 20px;
}
.footer {
  margin-top: 10px;
  text-align: center;
}
</style>


