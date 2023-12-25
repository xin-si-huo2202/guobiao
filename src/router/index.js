import Vue from "vue";
import VueRouter from "vue-router";


Vue.use(VueRouter);
// 解决报错
const originalPush = VueRouter.prototype.push
const originalReplace = VueRouter.prototype.replace
// push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}
// replace
VueRouter.prototype.replace = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalReplace.call(this, location, onResolve, onReject)
  return originalReplace.call(this, location).catch(err => err)
}

export const routes = [
  {
    path: "/",

    redirect: "/index",
  },
  {
    path: "/index",
    name: "indexpage",
    meta: { title: "实时预览", keepAlive: true },
    component: (resolve) => require(["@/pages/index.vue"], resolve),
  },
  {
    path: "/login",
    name: "login",
    meta: { title: "登录", keepAlive: false },
    component: (resolve) => require(["@/pages/login.vue"], resolve),
  },
  {
    path: "/quyuhuafen",
    name: "quyuhuafen",
    meta: { title: "区域划分", keepAlive: false },
    //component: (resolve) => require(["@/pages/patrolTrack.vue"], resolve),
    component: (resolve) => require(["@/pages/quyuhuafen.vue"], resolve),
  },
  {
    path: "/diaodu",
    name: "videoDispatch",
    meta: { title: "视频调度", keepAlive: true },
    //component: (resolve) => require(["@/pages/obtainEvidence2.vue"], resolve),
    //component: resolve => require(["@/pages/videoDispatch.vue"], resolve)
    component: resolve => require(["@/pages/Jessibuca.vue"], resolve)
  },
  {
    path: "/sjch",
    name: "sjch",
    meta: { title: "警力地图", keepAlive: true },
    component: (resolve) => require(["@/pages/sjch.vue"], resolve),
  },
  {
    path: "/diaodu2",
    name: "videoDispatch2",
    meta: { title: "视频调度", keepAlive: true },
    component: (resolve) => require(["@/pages/videoDispatch3.vue"], resolve),
  },
  {
    path: "/liebiao",
    name: "jcList",
    meta: { title: "视频调度", keepAlive: true },
    component: (resolve) => require(["@/components/jcList3.vue"], resolve),
  },
  {
    path: "/mapbian",
    name: "mapbian",
    meta: { title: "地图编辑", keepAlive: true },
    component: (resolve) => require(["@/components/mapbian.vue"], resolve),
  },
  {
    path: "/jldt",
    name: "jldt",
    meta: { title: "警力地图", keepAlive: true },
    component: (resolve) => require(["@/pages/jldt.vue"], resolve),
  },
  {
    path: "/liebiaocg",
    name: "jcListcg",
    meta: { title: "视频调度", keepAlive: true },
    component: (resolve) => require(["@/components/jcList3cg.vue"], resolve),
  },
  {
    path: "/patrolTrack",
    name: "patrolTrack",
    meta: { title: "巡防轨迹", keepAlive: true },
    component: (resolve) => require(["@/pages/patrolTrack.vue"], resolve),
  },
  {
    path: "/watchmanDetails",
    name: "watchmanDetails",
    meta: { title: "巡防轨迹", keepAlive: true },
    component: (resolve) => require(["@/pages/watchmanDetails.vue"], resolve),
  },
  {
    path: "/obtainEvidence",
    name: "obtainEvidence",
    meta: { title: "视频取证", keepAlive: true },
    //component: (resolve) => require(["@/pages/obtainEvidence.vue"], resolve),
    component: (resolve) => require(["@/pages/obtainEvidence_back.vue"], resolve),
  },
  {
    path: "/collectInfo",
    name: "collectInfo",
    meta: { title: "采集信息", keepAlive: true },
    component: (resolve) => require(["@/pages/collectInfo.vue"], resolve),
  },
  {
    path: "/warningInfo",
    name: "warningInfo",
    meta: { title: "预警信息", keepAlive: true },
    component: (resolve) => require(["@/pages/warningInfo.vue"], resolve),
  },
  {
    path: "/collectionRet",
    name: "collectionRet",
    meta: { title: "人像检索", keepAlive: true },
    component: (resolve) =>
      require(["@/pages/newPage/portraitPage.vue"], resolve),
  },
  ,
  {
    path: "/collectionRetsj",
    name: "collectionRetsj",
    meta: { title: "人像检索", keepAlive: true },
    component: (resolve) =>
      require(["@/pages/collectionRetNewsj.vue"], resolve),
  },
  {
    path: "/collectionRetCar",
    name: "collectionRetCar",
    meta: { title: "车牌检索", keepAlive: true },
    component: (resolve) => require(["@/pages/newPage/platePage.vue"], resolve),
  },
  {
    path: "/statisticalInfo",
    name: "statisticalInfo",
    meta: { title: "统计信息", keepAlive: true },
    component: (resolve) => require(["@/pages/statisticalInfo.vue"], resolve),
  },
  {
    path: "/selectgps",
    name: "selectgps",
    meta: { title: "统计信息", keepAlive: false },
    component: (resolve) => require(["@/pages/selectgps.vue"], resolve),
  },
  {
    path: "/Tracetracing",
    name: "Tracetracing",
    meta: { title: "车牌轨迹", keepAlive: false },
    component: (resolve) => require(["@/pages/Tracetracing.vue"], resolve),
  },
  {
    path: "/Retrospective",
    name: "Retrospective",
    meta: { title: "串号追溯", keepAlive: false },
    component: (resolve) => require(["@/pages/Retrospective.vue"], resolve),
  },
  {
    path: "/setPage",
    name: "setPage",
    meta: { title: "设置", keepAlive: false },
    component: (resolve) => require(["@/pages/setpage.vue"], resolve),
  },
];

const router = new VueRouter({
  mode: 'history',
  routes
});



export default router;