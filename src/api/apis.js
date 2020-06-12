import axios from 'axios';
axios.defaults.baseURL='http://localhost:5000';


//登陆接口 account 账号  password  密码
export const Login_api=(account,password)=>axios.post('/users/checkLogin',{account,password});

//添加账号接口 account 账号  password  密码 userGroup 分组
export const Addcount_api=(account,password,userGroup)=>axios.post('/users/add',{account,password,userGroup});

//验证登陆是否已经过期
export const Token_api=(token)=>axios.get('/users/checktoken',{params:{token}});

//获取账号列表接口 currentPage当前页码   pageSize 每页条数
export const Acclist_api=(currentPage,pageSize)=>axios.get('/users/list',{params:{currentPage,pageSize}});

//删除账号接口 id 数据编号
export const Deleteacc_api=(id)=>axios.get('/users/del',{params:{id}});

//批量删除账号接口 ids 数据编号的数组字符串
export const Batchdel_api=(ids)=>axios.get('/users/batchdel',{params:{ids}});

//修改账号接口 id 要修改的数据的ID  account 账号  userGroup 组别
export const Edit_api=(id,account,userGroup)=>axios.post('/users/edit',{id,account,userGroup});

//检查旧密码是否正确
export const Checkoldpwd_api=(oldPwd,id)=>axios.get('/users/checkoldpwd',{params:{oldPwd,id}});

//新密码跟新
export const Editpwd_api=(newPwd,id)=>axios.post('/users/editpwd',{newPwd,id});

//个人信息
export const Accountinfo_api=(id)=>axios.get('/users/accountinfo',{params:{id}});

//头像上传接口
export const Avatar_api=(id)=>axios.post('/users/avatar_upload',{id});

//商品模块

//获取商品分类
export const Catelist_api=(currentPage,pageSize)=>axios.get('/goods/catelist',{params:{currentPage,pageSize}});

//查询所有商品分类
export const Categories_api=()=>axios.get('/goods/categories',{params:{}});

//删除商品分类
export const Delcate_api=(id)=>axios.get('/goods/delcate',{params:{id}});

//修改商品分类
export const Editcate_api=(id,cateName,state)=>axios.post('/goods/editcate',{id,cateName,state});

//添加商品分类
export const Addcate_api=(cateName,state)=>axios.post('/goods/addcate',{cateName,state});

//商品列表
export const List_api=(currentPage,pageSize)=>axios.get('/goods/list',{params:{currentPage,pageSize}});

//删除商品
export const Delgoods_api=(id)=>axios.get('/goods/del',{params:{id}});

//修改商品
export const Editgoods_api=(name,category,price,imgUrl,goodsDesc,id)=>axios.post('/goods/edit',{name,category,price,imgUrl,goodsDesc,id});

//获取订单列表
export const Order_list=(currentPage,pageSize,orderNo,consignee,phone,orderState,date)=>axios.get('/order/list',{params:{currentPage,pageSize,orderNo,consignee,phone,orderState,date}});

//添加商品
export const Addgoods_api=(name,category,price,imgUrl,goodsDesc)=>axios.post('/goods/add',{name,category,price,imgUrl,goodsDesc});

//商品图片上传接口
export const img_upload_api=()=>axios.post('/goods/goods_img_upload',{});

//查询订单列表
export const Search_list=(currentPage,pageSize,orderNo,consignee,phone,orderState,date)=>axios.get('/order/search',{params:{currentPage,pageSize,orderNo,consignee,phone,orderState,date}});

//订单详情
export const Detail_api=(id)=>axios.get('/order/detail',{params:{id}});

//修改订单
export const Order_edit_api=(id,orderNo,orderTime,phone,consignee,deliverAddress,deliveryTime,remarks,orderAmount,orderState)=>axios.post('/order/edit',{id,orderNo,orderTime,phone,consignee,deliverAddress,deliveryTime,remarks,orderAmount,orderState});

//获取店铺详情
export const Shop_api=()=>axios.get('/shop/info',{params:{}});

//修改店铺内容
export const Shop_edit_api=(id,name,bulletin,avatar,deliveryPrice,deliveryTime,description,score,sellCount,supports,date,pics)=>axios.post('/shop/edit',{id,name,bulletin,avatar,deliveryPrice,deliveryTime,description,score,sellCount,supports,date,pics});

//首页报表接口
export const Totaldata_api=()=>axios.get('/order/totaldata',{params:{}});

//订单报表接口
export const Ordertotal_api=(date)=>axios.get('/order/ordertotal',{params:{date}});
