<template>
  <div>
    <div>
      <el-input v-model="query" placeholder="请输入商品ID" class="search">
        <el-button @click="handleQuery" slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <el-button type="success" plain @click="handleAdd">添加商品</el-button>
    </div>
    <el-table :data="tableData" border :height="height" :loading="loading" style="width: 100%">
      <!-- type='index 设置每列显示索引' -->
      <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
      <!-- <el-table-column prop="goods_id" label="商品ID" width="100" align="center"></el-table-column> -->
      <el-table-column prop="goods_name" label="商品名称" show-overflow-tooltip align="center"></el-table-column>
      <el-table-column prop="goods_price" label="价格" width="80" align="center"></el-table-column>
      <el-table-column prop="goods_number" label="重量" width="80" align="center"></el-table-column>
      <el-table-column label="商品状态" width="80" align="center">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.goods_state===2">已审核</el-tag>
          <el-tag type="info" v-else-if="scope.row.goods_state===1">审核中</el-tag>
          <el-tag type="warning" v-else>未通过</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="add_time" label="添加时间" align="center" :formatter="formatter"></el-table-column>
      <el-table-column prop="upd_time" label="更新时间" align="center" :formatter="formatter"></el-table-column>
      <!-- <el-table-column prop="hot_mumber" label="热销品数量" align="center"></el-table-column> -->
      <el-table-column label="是否是热销品" align="center">
        <template slot-scope="scope">
          <span type="success" v-if="scope.row.is_promote===false">否</span>
          <span type="warning" v-else>是</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="success" size="small" icon="el-icon-edit" @click="handleEdit(scope.row)"></el-button>
          <el-button
            type="warning"
            size="small"
            icon="el-icon-delete"
            @click="handleDel(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="pagesizes"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>
<script>
import { getDayTime } from "@/utils";
import {
  getGoodsData,
  getGoodById,
  deleteGoodData,
  editGoodData
} from "@/api/api";
export default {
  data() {
    return {
      query: "",
      tableData: [],
      height: innerHeight - 215,
      currentPage: 1,
      pagesizes: [5, 10, 50, 100],
      pagesize: 10,
      total: 1,
      loading: false
    };
  },
  created() {
    this.getList();
  },
  methods: {
    handleEdit(row) {
      this.$router.push({ name: "editGood", params: { id: row.goods_id } });
    },
    handleAdd() {
      this.$router.push({ name: "addGood" });
    },
    handleConfirm() {},
    handleDel(row) {
      // 点击删除弹窗
      this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 删除
          deleteGoodData({ id: row.goods_id }).then(res => {
            if (res.meta.status === 200) {
              this.getList();
              this.$message({
                type: "success",
                message: "删除成功!"
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    formatter(row, column) {
      return getDayTime(row[column["property"]]);
    },
    handleQuery() {
      this.getList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList();
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.getList();
    },
    async getList() {
      try {
        this.loading = true;
        let { data } = await getGoodsData({
          query: this.query,
          pagenum: this.currentPage,
          pagesize: this.pagesize
        });
        this.tableData = data.goods;
        this.currentPage = parseInt(data.pagenum);
        this.total = data.total;
        this.loading = false;
      } catch (err) {
        this.loading = false;
      }
    }
  }
};
</script>
<style scoped>
.search {
  width: 300px;
}
</style>
