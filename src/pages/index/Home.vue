<template>
  <div>
    <div id="top">
      <Nav :value="formatNum(totalOrder)" pic="1.png" msg="总订单"></Nav>
      <Nav :value="formatNum(totalAmount)" pic="2.png" msg="总销售额"></Nav>
      <Nav :value="formatNum(todayOrder)" pic="3.png" msg="今日订单数"></Nav>
      <Nav :value="formatNum(totayAmount)" pic="4.png" msg="今日销售额"></Nav>
    </div>
    <div id="echarts_box"></div>
  </div>
</template>

<script>
import Nav from "../../components/Nav.vue";
import echarts from "echarts";
import { Totaldata_api } from "@/api/apis.js";
export default {
  created() {},
  data() {
    return {
      todayOrder: "",
      totalAmount: "",
      totalOrder: "",
      totayAmount: ""
    };
  },
  methods: {
    formatNum(num) {
      if (!/^(\+|-)?(\d+)(\.\d+)?$/.test(num)) {
        return num;
      }
      var a = RegExp.$1,
        b = RegExp.$2,
        c = RegExp.$3;
      var re = new RegExp().compile("(\\d)(\\d{3})(,|$)");
      while (re.test(b)) b = b.replace(re, "$1,$2$3");
      return a + "" + b + "" + c;
    }
  },
  components: {
    Nav
  },
  mounted() {
    Totaldata_api().then(res => {
      let {
        amountData,
        orderData,
        todayOrder,
        totalAmount,
        totalOrder,
        totayAmount,
        xData
      } = res.data;//解构获取对应的属性的值
      this.todayOrder = todayOrder;
      this.totalAmount = totalAmount;
      this.totalOrder = totalOrder;
      this.totayAmount = totayAmount;
      var myecharts = echarts.init(document.getElementById("echarts_box"));
      //配置表格对象
      let option = {
        title: {
          text: "数据统计"
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["订单", "销售额", "注册人数", "管理员人数"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: xData
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "订单",
            type: "line",
            stack: "总量",
            data: orderData
          },
          {
            name: "销售额",
            type: "line",
            stack: "总量",
            data: amountData
          },
          {
            name: "注册人数",
            type: "line",
            stack: "总量",
            data: [150, 232, 201, 154, 190, 330, 410]
          },
          {
            name: "管理员人数",
            type: "line",
            stack: "总量",
            data: [320, 332, 301, 334, 390, 330, 320]
          }
        ]
      };
      myecharts.setOption(option);
    });
  }
};
</script>

<style lang="less" scoped>
#top {
  display: flex;
  justify-content: space-around;
}
#echarts_box {
  height: 500px;
  margin-top: 20px;
  background: #fff;
  padding: 10px;
}
</style>