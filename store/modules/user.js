export default {
  actions: {
    nuxtServerInit ({commit}, {req}) {
      if (req.session && req.session.currentUser) {
        console.log(req.session.currentUser)
        commit('SETUSER', req.session.currentUser)
      } else {
        commit('EXITUSER')
      }
    },
    setUser ({commit}, usr) {
      commit('SETUSER', usr)
    },
    exitUser ({commit}) {
      commit('EXITUSER')
    }
  },
  state: {
    currentUser: {},
    isLogin: false
  },
  mutations: {
    SETUSER (state, usr) {
      state.currentUser = usr
      state.isLogin = true
    },
    EXITUSER (state) {
      // state.currentUser = {}
      // state.isLogin = false
      state.currentUser = {
        id:1,
        createAt:1544767935000,
        updateAt:1544767935000,
        name:"超级管理员",
        fkDpt:{id:1,createAt:1544767931000,updateAt:1544767931000,name:"电商平台服务部",leader:"曹玉林",status:1,remark:null,
          fkOrg:{id:1,createAt:1544767931000,updateAt:1544767931000,name:"江苏智恒达型云网络科技有限公司",simpleName:"型云",status:1,legalRept:null,remark:null}},
        loginAcct:"admin",
        pwd:"1f82c942befda29b6ed487a51da199f78fce7f05",
        phone:"88888888888",
        status:1,
        fkRole:{id:1,createAt:1544767931000,updateAt:1544767931000,name:"superadmin",auths:[],status:1},
        auths:[],
        dataLevel:"公司",
        sex:1,
        national:null,
        position:null,
        edu:null,
        professional:null,
        email:null,
        jobTitle:null,
        telephone:null,
        addr:null,
        nativePlace:null,
        maritalStatus:null,
        politicalLandscape:null,
        birthday:null,
        inTime:null,
        workGroup:null,
        remark:null,
        avatar:null,
        platformCode:null,
        demission:0,
        loginTime:1556086423969,
        ipAddress:"172.16.120.235"
      }
      state.isLogin = true
    }
  }
}