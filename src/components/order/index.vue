<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-table :data="tableData" border :height="height" :loading="loading" style="width: 100%">
      <!-- type='index 设置每列显示索引' -->
      <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
      <el-table-column
        prop="order_number"
        label="订单编号"
        align="center"
        show-overflow-tooltip
        :formatter="formatterValue"
      ></el-table-column>
      <el-table-column prop="order_price" label="订单价格" align="center"></el-table-column>
      <el-table-column prop="order_pay" label="订单支付" align="center"></el-table-column>
      <el-table-column prop="is_send" label="是否发货" align="center"></el-table-column>
      <!-- <el-table-column prop="trade_no" label="trade_no" align="center"></el-table-column> -->
      <el-table-column prop="order_fapiao_title" label="订单发票" align="center"></el-table-column>
      <!-- <el-table-column prop="order_fapiao_company" label="order_fapiao_company" align="center"></el-table-column> -->
      <!-- <el-table-column prop="order_fapiao_content" label="order_fapiao_content" align="center"></el-table-column> -->
      <!-- <el-table-column prop="consignee_addr" label="consignee_addr" align="center"></el-table-column> -->
      <el-table-column label="支付状态" align="center">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.pay_status==='1'">已付款</el-tag>
          <el-tag type="danger" v-else>未付款</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="生成时间" align="center" :formatter="formatter"></el-table-column>
      <el-table-column prop="update_time" label="更新时间" align="center" :formatter="formatter"></el-table-column>
      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="scope">
          <el-button type="success" size="small" @click="handleDetails(scope.row)">详情</el-button>

          <!-- type="scope.row.pay_status===1? 'success':'danger'" -->
          <el-button
            :type="scope.row.pay_status==='1'? 'success':'danger'"
            size="small"
            @click="handlePayStatus(scope.row)"
            v-text="scope.row.pay_status==='1'? '已付款':'未付款'"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="pagesizes"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>
<script>
import { getDayTime } from "@/utils";
import { getOrdersData, updateOrderPayStatus } from "@/api/api";
export default {
  data() {
    return {
      query: "",
      tableData: [],
      height: innerHeight - 180,
      pagenum: 1,
      total: 0,
      pagesizes: [5, 10, 50, 100],
      pagesize: 10,
      loading: false
    };
  },
  created() {
    this.getList();
  },
  methods: {
    formatterValue(row, column) {
      return row[column["property"]].substring(7);
    },
    formatter(row, column) {
      return getDayTime(row[column["property"]]);
    },
    handlePayStatus(row) {
      let {
        order_id,
        is_send,
        order_pay,
        order_price,
        order_number,
        pay_status
      } = Object.assign({}, row);

      pay_status = pay_status === "1" ? "0" : "1";

      updateOrderPayStatus({
        id: order_id,
        is_send: is_send,
        order_pay: order_pay,
        order_price: order_price,
        order_number: order_number,
        pay_status: pay_status
      })
        .then(res => {
          this.getList();
          this.$message({
            message: res.meta.msg,
            type: "success"
          });
        })
        .catch(err => {
          this.$message({
            message: res.meta.msg,
            type: "error"
          });
        });
    },
    handleDetails(row) {
      console.log(row);
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      this.getList();
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.getList();
    },
    async getList() {
      try {
        let { data } = await getOrdersData({
          query: "", //	查询参数	可以为空
          pagenum: this.pagenum, //	当前页码	不能为空
          pagesize: this.pagesize, //	每页显示条数	不能为空
          user_id: "", //	用户ID	可以为空
          pay_status: "", //	支付状态	可以为空
          is_send: "", //	是否发货	可以为空
          order_fapiao_title: "", //	['个人','公司']	可以为空
          order_fapiao_company: "", //	公司名称	可以为空
          order_fapiao_content: "", //	发票内容	可以为空
          consignee_addr: "" //	发货地址	可以为空
        });
        this.tableData = data.goods;
        this.pagenum = parseInt(data.pagenum);
        this.total = data.total;
      } catch (err) {}
    }
  }
};
</script>
<style  scoped>
.el-breadcrumb {
  background-color: #d3dce6;
  height: 40px;
  line-height: 40px;
  padding-left: 10px;
}
</style>
