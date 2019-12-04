import * as Api from '@/services/topBar/index.js';
import defaultUserImg from '@/assets/images/topBar/defaultuser.png';

export default {
    namespace: "topBar",
    state: {
        userImg:defaultUserImg,
        userName:'注册/登录',
        pending_num:0,
        companyList:'',
        companyName:'',
    },
    reducers:{
        save(state, { payload }) {
          return { ...state, ...payload };
        }
    },
    effects:{
        * getModeltopBarUsers(_,{ call, put, select }) {
            const res = yield call( Api.getServicestopBarUsers );
            yield put({
                type: "save",
                payload: {
                    userName:"你好，"+res.data.error_msg.username,
                    userImg:res.data.error_msg.avatar,
                },
            });
        },
        * getModelPendingNum(_,{call, put, select}) {
            const res = yield call( Api.getServicesPendingNum );
            yield put({
                type: "save",
                payload: {
                    pending_num: res.data.error_msg
                },
            });
        },
        * getModelCompanyName(_, { call, put, select }) {
            const res = yield call( Api.getServicesCompanyName );
            yield put({
                type:'save',
                payload:{
                    companyName : res.data.error_msg
                }
            })
        },
        * getModelCompanyList( _,{ call, put, select } ){
            const res = yield call( Api.getServicesCompanyList );
            yield put({
                type: "save",
                payload: {
                    companyList: res.data.error_msg
                },
            });
        }

        
    },
}
