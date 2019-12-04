import * as Api from '@/services/common/selectPeopel/index.js';
import { Modal } from 'antd';

export default {
    namespace: "selectPeopel",
    state: {
        loading: true,
        userList: false,
        allUserList: false,
        checkUser: false,
        visible: false,
        domPeopel:false,
    },
    reducers:{
        save(state, { payload }) {
          return { ...state, ...payload };
        }
    },
    effects:{
        * getModelUsetList(_, {call, put, select }){
            const res =  yield call( Api.getServicesUserList );
            yield put({
                type: "save",
                payload: {
                    loading: false,
                    allUserList: res.data.error_msg,
                    userList: res.data.error_msg.filter((item,index) => {
                        return index < 99
                    })
                },
            });
        },
        * getModelChangeUserList(_, {call, put, select}){
            yield put({ 
                type: 'save',
                payload:{
                    userList: _.data
                }
            });
        },
        * getModelChangeVisible(_, {call, put, select}){
            const visible = yield select(state => state.selectPeopel.visible);
            yield put({ 
                type: 'save',
                payload:{
                    visible: !visible
                }
            });
        },
        * getModelDomPeopelArray(_, {call, put, select}){
            const res = yield call( Api.getServicesDomPeopelArray );
            const check = yield call ( Api.getServicesDomPeopelCheck );
            yield !check && Modal.error({title:'提示',content:res.data.error_msg});
            yield check && put({ 
                type: 'save',
                payload:{
                    domPeopel: res.data.error_msg
                }
            });
        },
        * getModelAddPeopel(_, {call, put, select }){
            const res = yield call( Api.getServicesAddPeopel, _.data );
            yield res.data.error_code && put({ 
                type: 'save',
                payload:{
                    checkUser: res.data.error_msg.toString()
                }
            });
        }
    },
}
