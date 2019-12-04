import * as Api from '@/services/equityPlan/equityPool';

export default {
    namespace: "equityPool",
    state: {
        dataMenus: false,
        companyType: false,
        dataSource: false,
        poolInfo: false,
        visibleStep1: false,
        visibleStep2: false,
        visibleStep3: false,
        poolChecked: false,
    },
    reducers:{
        save(state, { payload }) {
          return { ...state, ...payload };
        }
    },
    effects:{
        * getModelEquityPools(_,{ call, put, select }) {
            const plan_id = yield select( state => state.layouts.plan_id );
            const res = yield call(Api.getServicesEquityPool, plan_id);
            yield put({
                type: "save",
                payload: {
                    dataMenus: res.data.error_msg.document_list_initialize,
                    companyType: res.data.error_msg.companyType,
                    dataSource: res.data.error_msg.plan_size_list,
                },
            });
        },
        * getModelEquityPoolChangeInfo(_, { call, put, select }){
            yield put({
                type: 'save',
                payload:{
                    ..._.data,
                }
            })
        },
        * getModelPoolModalTooger(_, {call, put, select }){
            const plan_id = yield select( state => state.layouts.plan_id );
            const companyType = yield select( state => state.equityPool.companyType );
            const res = yield call( Api.getServicesPoolModalTooger, plan_id );
            const sessType = !sessionStorage.getItem('checkInfo'+plan_id) && companyType === 2;
            let poolChecked = sessType ? false : true;
            yield put({
                type: 'save',
                payload:{
                    ..._.data,
                    poolInfo: res.data.error_msg,
                    poolChecked: poolChecked,
                }
            })
        }
    },
}
