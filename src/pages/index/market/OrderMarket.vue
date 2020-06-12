<template>
  <div>
    <div class="top" style="display:flex;align-items: center;">
      <span>时间范围:</span>
      <div class="block" style="margin:0px 20px">
        <el-date-picker
          v-model="value"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </div>
      <el-button @click="search" type="primary">查询</el-button>
    </div>
    <div id="echarts" style="height:500px;background:#fff"></div>
  </div>
</template>

<script>
import { Ordertotal_api } from "@/api/apis.js";
import echarts from "echarts";
export default {
  mounted() {
    this.search();
  },
  data() {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      value: ["2020-06-04 00:00:00", "2020-06-05 23:59:59"]
      // value2: ''
    };
  },
  methods: {
    date(arr) {
      for (let i in arr) {
        // console.log(arr[i]);
        let date = new Date(arr[i]);
        //获取年
        let year = date.getFullYear();
        let month = date.getMonth();
        month = month < 9 ? "0" + (month + 1) : month + 1;
        let day = date.getDate();
        day = day < 10 ? "0" + day : day;
        let h = date.getHours();
        h = h < 10 ? "0" + h : h;
        let m = date.getMinutes();
        m = m < 10 ? "0" + m : m;
        let s = date.getSeconds();
        s = s < 10 ? "0" + s : s;
        arr[i] = `${year}-${month}-${day} ${h}:${m}:${s}`;
      }
      return arr;
    },
    search() {
      Ordertotal_api(JSON.stringify(this.date(this.value))).then(res => {
       if (res.data.data.length==0) return alert('无此段数据，点击确认取消本次查询')
        let date = [];
        let amount = [];
        for (let i in res.data.data) {
          date.push(res.data.data[i].orderTime);
          amount.push(res.data.data[i].orderAmount);
        }
        date = this.date(date);
        var myecharts = echarts.init(document.getElementById("echarts"));
        let option = {
          xAxis: {
            type: "category",
            data: date
          },
          yAxis: {
            type: "value"
          },
          series: [
            {
              data: amount,
              type: "bar",
              showBackground: true,
              backgroundStyle: {
                color: "rgba(220, 220, 220, 0.8)"
              }
            }
          ]
        };
        myecharts.showLoading();
        setTimeout(() => {
          myecharts.setOption(option);
          myecharts.hideLoading();
        }, 1500);
      });
    }
  }
};
</script>

<style lang="less" scoped>
</style>