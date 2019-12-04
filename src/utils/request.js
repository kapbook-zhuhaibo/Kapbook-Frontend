/**
    使用方法:
    import request from '@/utils/request';
    
    request({
        url:'/login/check_login_ajax',
        data:{
            email: 'haibo.zhu@kapbook.com',
            password: 'YXNkYXNk',
            ver_code: '',
            type: 1
        }
    }).then(res=>{
        console.log(res);
    });
*/

import Axios from 'axios';
import { path } from '@/utils/path';

Axios.defaults.withCredentials=true;// 允许携带cookie

export default function request(options = {}){
    return new Promise(function(resolve, reject){
        const {data,url} = options;
        // formDate 提交方式
        new FormData().append('data',data);
        let param = new URLSearchParams(data);
        Axios.post(path.url+url,param).then(function(res){
            if( res.data.error_code === true || res.data.error_code === false ){
                resolve(res);
            }else if(res.data.error_code === '-1000'){
                window.location.href=path.login;
            }else if( res.data.error_code === "-2000" ){
                window.location.href=path.url+'/user/';
            }else {
                reject(res);
            }
        }).catch((e)=>{ console.log(e); });
    }).catch((e) => { console.log(e); });;
}