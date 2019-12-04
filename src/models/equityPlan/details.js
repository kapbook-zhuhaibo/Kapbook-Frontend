import * as Api from '@/services/equityPlan/details';
import { Modal } from 'antd';
import { path } from '@/utils/path';

export default {
    namespace: "equityPlanDetails",
    state: {
        info:false,
        submitDisabled: true,
    },
    reducers:{
        save(state, { payload }) {
          return { ...state, ...payload };
        }
    },
    effects:{
        * getModelEquityPlanDetails(_,{ call, put, select }) {
            const res = yield call(Api.getServicesEquityPlanDetails, _.data);
            yield put({
                type: "save",
                payload: {
                    info: res.data.error_msg,
                    submitDisabled: true,
                },
            });
        },
        * getModelChangeInfo(_, {call, put, select}){
            const copyInfo = yield select(state => state.equityPlanDetails.info);
            yield put({
                type: 'save',
                payload: {
                    info:{
                        ...copyInfo,
                        ..._.data,
                    },
                    submitDisabled: false
                }
            })
        },
        * getModelDeletePlan(_, {call, put, select}){
            const res = yield call( Api.getServicesDeletePlan, _.data );
            if( res.data.error_code ){
                window.location.href=path.return;
            }else {
                Modal.error({ title:'错误', content:res.data.error_msg, okText:'我知道了' });
            }
        },
        * getModelSaveDetails(_, {call, put, select}){
            const res = yield call( Api.getServicesSaveDetails, _.data );
            !res.data.error_code && Modal.error( {title: '错误', content: res.data.error_msg} );
            res.data.error_code && Modal.success({ title:'成功', content: '数据已更新！'});
            yield put({
                type: 'save',
                payload: {
                    submitDisabled: true
                }
            })
        }
    },
}
