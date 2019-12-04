// import * as Api from '@/services/layouts/index.js';
import { Modal } from 'antd';
const { confirm } = Modal;


export default {
    namespace: "layouts",
    state: {
        plan_id:false,
        profit_plan_open:false,
    },
    reducers:{
        save(state, { payload }) {
          return { ...state, ...payload };
        }
    },
    effects:{
        * savePlanID(_,{ call, put, select }) {
            yield put({
                type: "save",
                payload: _.data
            });
        },
        * getModelLocationCheck(_, {call, put, select}){
            const pathName = yield select( state => state.layouts.history.location.pathname );
            const submitDisabled = yield select( state => state.equityPlanDetails.submitDisabled );
            if( pathName === '/equityPlan/Details' && !submitDisabled ){
                confirm({
                    title: '您确定要离开当前页面吗？离开后系统不会保存您所做的更改。',
                    content: '按“取消”继续留在当前页面。',
                    okText: '离开',
                    okType: 'danger',
                    cancelText: '取消',
                    onOk() {
                        _.callback && _.callback();
                    }
                });
            }else {
                _.callback && _.callback();
            }
        }
    },
    // 路由监听事件
    // subscriptions: {
    //     setup({ dispatch, history }) {
    //         return history.listen(({ pathname, query }) => {
    //             if (pathname !== '/equityPlan/Details') {
    //                 dispatch({
    //                     type: 'loadConfirm'
    //                 })
    //             }
    //         });
    //     }
    // }
}
