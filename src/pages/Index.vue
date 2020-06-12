<template>
  <div id="box">
    <div id="index">
      <el-container>
        <!-- 左侧框 -->
        <el-aside width="200px" style="background-color: #0a2440">
          <!-- 菜单树 -->
          <el-menu
            text-color="#fff"
            unique-opened
            :default-active="this.$route.path"
            class="el-menu-vertical-demo"
          >
            <p
              style="background:#0a2440;text-align:center;padding-top:20px;padding-bottom:20px"
              class="title"
            >
              <span style="color:#fff;">外卖商家中心</span>
            </p>
            <div v-for="item in treelist" :key="item.index">
              <!-- 循环创建带二级列表的菜单 -->
              <div v-if="item.role.indexOf(role)>=0">
                <el-submenu v-if="item.children" :index="item.index">
                  <template slot="title">
                    <i :class="item.icon"></i>
                    <span>{{item.title}}</span>
                  </template>
                  <el-menu-item
                    v-for="child in item.children"
                    @click="clickTranceform(child.index)"
                    :key="child.index"
                    :index="child.index"
                  >
                    <i :class="child.icon"></i>
                    <span slot="title">{{child.title}}</span>
                  </el-menu-item>
                </el-submenu>
              </div>
              <!-- 循环创建不带二级列表的菜单 -->
              <div v-if="!item.children&&item.role.indexOf(role)>=0">
                <el-menu-item @click="clickTranceform(item.index)" :index="item.index">
                  <i :class="item.icon"></i>
                  <span slot="title">{{item.title}}</span>
                </el-menu-item>
              </div>
            </div>
            <!-- 分割线 -->
          </el-menu>
        </el-aside>
        <el-container>
          <!-- 面包屑 -->
          <el-header>
            <div class="nav">
              <el-breadcrumb separator-class="el-icon-arrow-right">
                <!-- <el-breadcrumb-item v-for="item in breadTxt" :key='item'>{{item}}</el-breadcrumb-item> -->
                <el-breadcrumb-item v-for="(v,i) in this.$route.meta.bread" :key="i">{{v}}</el-breadcrumb-item>
              </el-breadcrumb>
            </div>
            <div @click="clickTranceform('/index/Person')" class="demo-type">
              <span style="margin-right:10px">
                欢迎你，
                <span>{{acc}}</span>
              </span>
              <el-avatar :size="60">
                <img :src="pic" />
              </el-avatar>
            </div>
          </el-header>
          <el-main style="background:#f1f1f1">
            <router-view></router-view>
          </el-main>
        </el-container>
      </el-container>
    </div>
  </div>
</template>

<script>
import { Accountinfo_api } from "@/api/apis.js";

export default {
  created() {
    Accountinfo_api(window.localStorage.getItem("id")).then(res => {
      this.pic = res.data.accountInfo.imgUrl;
    });
  },
  data() {
    return {
      role: localStorage.role,
      pic: "",
      acc: localStorage.acc,
      //面包屑数据
      // breadTxt:['首页','列表'],
      // treelist:列表树
      //index:跳转的hash值
      //icon:图标
      //title:菜单名字
      treelist: [
        {
          index: "/index/Home",
          icon: "el-icon-s-home",
          title: "后台首页",
          role: ["super", "normal"]
        },
        {
          index: "/index/Order",
          icon: "el-icon-document",
          title: "订单管理",
          role: ["super"]
        },
        {
          index: "/goods",
          icon: "el-icon-s-cooperation",
          title: "商品管理",
          children: [
            {
              index: "/index/GoodsList",
              icon: "el-icon-s-promotion",
              title: "商品列表"
            },
            {
              index: "/index/AddGoods",
              icon: "el-icon-s-promotion",
              title: "商品添加"
            },
            {
              index: "/index/Classification",
              icon: "el-icon-s-promotion",
              title: "商品分类"
            }
          ],
          role: ["super", "normal"]
        },
        {
          index: "/index/Store",
          icon: "el-icon-s-promotion",
          title: "店铺管理",
          role: ["super", "normal"]
        },
        {
          index: "/acc",
          icon: "el-icon-user-solid",
          title: "账号管理",
          children: [
            {
              index: "/index/AccList",
              icon: "el-icon-s-promotion",
              title: "账号列表"
            },
            {
              index: "/index/Accadd",
              icon: "el-icon-s-promotion",
              title: "账号添加"
            },
            {
              index: "/index/AccUpdate",
              icon: "el-icon-s-promotion",
              title: "修改密码"
            }
          ],
          role: ["super"]
        },
        {
          index: "/sales",
          icon: "el-icon-pie-chart",
          title: "销售统计",
          children: [
            {
              index: "/index/GoodsMarket",
              icon: "el-icon-s-promotion",
              title: "商品统计"
            },
            {
              index: "/index/OrderMarket",
              icon: "el-icon-s-promotion",
              title: "订单统计"
            }
          ],
          role: ["super"]
        }
      ]
    };
  },
  methods: {
    // 菜单栏点击跳转函数
    clickTranceform(hash) {
      this.$router.push(hash);
      // console.log(this.$route);
    }
  },
  //利用filter过滤数组的到新的数组，在树菜单中循环新的数组得到权限不同的结果
  computed:{
    // newArray(){
    //   return this.treelist.filter(item=>item.role.includes(this.role))
    // }数据过滤产生新的数组来控制权限的显示
  },
  //监听
  watch: {}
};
</script>

<style lang="less" scoped>
#box {
  height: 100vh;
  width: 100vw;
  background: #f1f1f1;
  padding-top: 40px;
}
#index {
  width: 1400px;
  background: #fff;
  margin: 0 auto;
  height: 750px;
  section {
    height: 100%;
    .el-menu {
      border: none;
    }
    ul li {
      background: #0a2440;
      :hover {
        background: darkslateblue;
      }
      .el-menu-item-group__title {
        display: none;
      }
    }
  }
}
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  padding-bottom: 10px;
  .demo-type {
    display: flex;
    align-items: center;
  }
}
</style>