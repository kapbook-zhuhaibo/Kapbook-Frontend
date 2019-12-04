import request from '@/utils/request';

export function getServicesbreadCrumbList () {
    return request({url:'/equity_plan/company/get_nav'});
}
