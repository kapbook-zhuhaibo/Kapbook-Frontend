import request from '@/utils/request';

export const getServicesEquityPool = id => {
    return request({
        url:'/equity_plan/company/get_option_pool_list',
        data:{
            "plan_id":id
        }
    });
}

export const getServicesPoolModalTooger = id => {
    return request({
        url:'/equity_plan/company/get_option_pool_info_ajax',
        data:{
            "plan_id":id
        }
    });
}



