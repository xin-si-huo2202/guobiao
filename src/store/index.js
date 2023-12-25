import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

/**
 * Vuex全局状态管理
 * @param openTab {Array} 用于渲染tabs的数组
 */
const state = {
    info: '', //实时消息
    MapAction: process.env.VUE_APP_CURRENTMODE=='nysj'?4:1, //实时预览地图指向
    quYu: sessionStorage.QUYULIST?JSON.parse(sessionStorage.QUYULIST)[0]: [],
    infocoord: null, //
    warningId: null, //预警样式id
    menuaction: null,
    zdMenu:  sessionStorage.navigation ? JSON.parse(sessionStorage.navigation) : [], //路由菜单
    userName: sessionStorage.UserName || `` ,
    jSTXPWD: sessionStorage.JSTXPWD || `` ,
    openTab:[],//所有打开的路由
    activeIndex:'/examine/map', //激活状态
    ViewPath: {}, //存储二级路由
    arrcar:[],
    warn_selct_id:null,

    nuReadChatNum:0,  //即时通讯未读消息总个数
    nuReadChatMsg:{},   //即时通讯未读消息json内容
    chatWindowShow:false,//聊天弹出框的状态
    sourceTitle:"",  //即时通讯未读消息总个数
    huancun:[
        'map',  //首页
        'collect', //采集库
        'chat',  //即时通讯
        'infocompare', //采集检索
        'statistics',  //数据统计
        'derived', // 统计报表
        'caralarm', //车牌预警
        'facealarm', //人像预警
        'carcontril', //车辆布控
        'facecontril',  //人像布控
        'videoDispatch',
        'Video',
        'Tracetracing'
    ],
    isupdate:0,  //0更新  1查询轨迹  2查询预警
}
// 对数据获取之前的再次编译，可以理解为state的计算属性 this.$store.getters.方法名。
const getters = {
    info: state => state.info,
    MapAction: state => state.MapAction,
    quYu: state => state.quYu,
    infocoord: state => state.infocoord,
    warningId: state => state.warningId,
    menuaction: state => state.menuaction,
    userName: state => state.userName,
    jSTXPWD: state => state.jSTXPWD,
    ViewPath: state => state.ViewPath,
    zdMenu: state=> state.zdMenu,
    arrcar:state=> state.arrcar,
    warn_selct_id:state => state.warn_selct_id,
    chatWindowShow:state=>state.chatWindowShow,
    nuReadChatNum:state=>state.nuReadChatNum,
    nuReadChatMsg:state=>state.nuReadChatMsg,
    sourceTitle:state=>state.sourceTitle,
    isupdate:state => state.isupdate,  //0更新  1查询轨迹  2查询预警
}
const mutations =  {
    changehuancun(state,val) {
        state.huancun = val
    },
    // tabs
    delTagsItem(state, data) {
        state
            .openTab
            .splice(data.index, 1);
    },
    setTagsItem(state, data) {
        state
            .openTab
            .push(data)
    },
    clearTags(state) {
        state.openTab = []
    },
    closeTagsOther(state, data) {
        state.openTab = data;
    },
    // tabs
    //条数
    GET_Info(state,info){
        state.info = info
    },
    SET_isupdate(state,val){
        state.isupdate = val
    },
    // 首页 在线车辆 指向
    SET_MAPACTION(state,val){
        state.MapAction = val
    },
    SET_QUYU(state,val){
        state.quYu = val
        sessionStorage.setItem('QUYU',JSON.stringify(val));
    },
    //未读
    GET_INFOCOORD(state,val){
        state.infocoord = val
    },
    //预警
    GET_WARNING(state,val){
        state.warningId = val
    },
    SET_warn_selct_id(state,val){
        state.warn_selct_id = val
    },
    //    SETMENUACTIONS(state,val){
    //        state.menuaction = val
    //    },
    // 所属部门
    GETUSER(state,val){
        sessionStorage.setItem('UserName',val)
        state.userName = val
    },

    SETJSTXPWD(state,val){
        sessionStorage.setItem('JSTXPWD',val)
        state.jSTXPWD = val
    },
   
    // 设置当前激活的tab
    SET_ACTIVEINDEX(state, index) {
        this.state.activeIndex = index;
    },
    //当前目录
    SETViewPath(state, val){
        sessionStorage.setItem("currentVal",JSON.stringify(val))
        this.state.ViewPath = val;
    },
    GetMenu(state,val){
        let menu = val.filter(father => {
            // 循环所有项，并添加children属性
            let branchArr = val.filter(child => father.id == child.menuSuperId); // 返回每一项的子级数组
            branchArr.length > 0 ? (father.children = branchArr) : ""; //给父级添加一个children属性，并赋值
            return father.menuSuperId == 0; //返回第一层
        });
        sessionStorage.setItem("navigation",JSON.stringify(menu));
        // menu.push({
        //     path:'/404',
        //     menuUrl:'/404'
        // })
       
        state.zdMenu = menu;
    },
    Get_arrcar(state,val){
        state.arrcar=val
    },

    // 设置聊天弹出框的状态
    Set_ChatWindowShow(state,val) {
        state.chatWindowShow = val
    },
    // 设置聊天弹出框的状态
    Set_NuReadChatNum(state,val) {
        state.nuReadChatNum=val;
    },
    Set_NuReadChatMsg(state,val){
        state.nuReadChatMsg=val;
    },
    Set_SourceTitle(state,val){
        state.sourceTitle=val;
    }
}
// 异步操作
const actions = {
    
    SETUSER({ commit },val){
        commit( 'GETUSER' , val)
    },
    SETJSTXPWD({ commit },val){
        commit( 'SETJSTXPWD' , val)
    },
    GEINFO({ commit },info){
        commit( 'GET_Info' , info)
    },
    SETMAPACTION({ commit },val){
        commit( 'SET_MAPACTION' , val)
    },
    SETQUYU({ commit },val){
        commit( 'SET_QUYU' , val)
    },
    GET_INFOCOORD({ commit },val){
        commit( 'GET_INFOCOORD' , val)
    },
    GETWARNING({ commit },val){
        commit( 'GET_WARNING' , val)
    },
    SETwarnselctID({ commit },val){
        commit( 'SET_warn_selct_id' , val)
    },
    // SETMENUACTIONS({ commit },val){
    //     commit( 'SETMENUACTIONS' , val)
    // },
    SETVIEWPATH({ commit },val){
        commit( 'SETViewPath',val)
    },
    //储存菜单
    SETMENU({ commit },val){
        commit('GetMenu',val)
    },

    Getarrcar({ commit },val){
        commit('Get_arrcar',val)
    },
    SetNuReadChatNum({ commit },val){
        commit('Set_NuReadChatNum',val)
    },
    SetNuReadChatMsg({ commit },val){
        commit('Set_NuReadChatMsg',val)
    },
    SetSourceTitle({ commit },val){
        commit('Set_SourceTitle',val)
    }
}
export default new Vuex.Store({
    state,
    getters,
    mutations,
    actions,
});
