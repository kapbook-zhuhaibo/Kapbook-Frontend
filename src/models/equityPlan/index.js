import * as Api from '@/services/equityPlan';

export default {
    namespace: "equityPlan",
    state: {
        loadPage:true,
        tbsMenusActive:'Details',
        tbsMenus:[{ is_red: 0,name: "详情",url: "Details" }]
    },
    reducers:{
        save(state, { payload }) {
          return { ...state, ...payload };
        }
    },
    effects:{
        * getModelTbsMenusList(_,{ call, put, select }) {
            const res = yield call(Api.getServicesTbsMenusList, _.data);
            yield put({
                type: "save",
                payload: {
                    tbsMenus: res.data.error_msg
                },
            });
        },
        * changeTbsMenusActive(_, {call, put, select}){
            yield put({ type: "save", payload: { tbsMenusActive: _.data } });
        },
        * changeLoadState(_, {call, put, select }){
            yield put({
                type: 'save',
                payload: {
                    loadPage: _.data
                }
            })
        }
    },
}
