import Cookie from 'js-cookie';
import { path } from '@/utils/path';

export const dva = {
    config: {
        onError(err) {
            err.preventDefault();
            console.error(err.message);
        },
    },
};


export function render(oldRender) {
    if( Cookie.get("token") ){
        if( Cookie.get("company_token") ){
            oldRender();
        }else {
            window.location.href=path.url+"/user/";
        }
    }else {
        window.location.href=path.login;
    }
}