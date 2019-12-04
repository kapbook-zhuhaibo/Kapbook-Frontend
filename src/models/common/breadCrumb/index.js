import * as Api from '@/services/common/breadCrumb/index.js';

export default {
    namespace: "breadCrumb",
    state: {
        plan_name:'',
        BreadCrumbList:false,
    },
    reducers:{
        save(state, { payload }) {
          return { ...state, ...payload };
        }
    },
    effects:{
        * getBreadCrumbList(_,{ call, put, select }) {
            const res = yield call( Api.getServicesbreadCrumbList );
            let plan_name = '';
            const plan_id = yield select(state => state.layouts.plan_id);
            res.data.error_msg.planList.forEach(element => {
                if( element.plan_id === plan_id ){
                    plan_name = element.plan_name;
                }
            });
            yield put({
                type: "save",
                payload: {
                    plan_name: plan_name,
                    BreadCrumbList:res.data.error_msg
                },
            });
        },
        * changePlanList(_, {call, put, select }){
            yield put({
                type: "save",
                payload: {
                    plan_name: _.data.plan_name,
                },
            });

        }
    },
}
