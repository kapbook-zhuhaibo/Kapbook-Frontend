import request from '@/utils/request';

export function getServicesUserList(){
    return request({url:'/equity_plan/company/get_user_list'});
}

export function getServicesDomPeopelArray(){
    return request({url:'/company/people/get_manager_list_ajax'});   
}

export function getServicesDomPeopelCheck(){
    return request({url:'/company/people/check_user_certificate_info'});
}

export function getServicesAddPeopel( sendData ){
    return request({url:'/company/people/add_manager_ajax',data: sendData });
    
}