import request from '@/utils/request';

export function getServicestopBarUsers () {
    return request({url:'/common/user/menu_detail'});
}

export function getServicesPendingNum () {
    return request({url:'/common/pending/pending_num'});
}

export function getServicesCompanyName () {
    return request({url:'/common/company/company_name'});
}

export function getServicesCompanyList () {
    return request({url:'/common/company/company_list'});
}