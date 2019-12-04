import request from '@/utils/request';

export const getServicesTbsMenusList = id => {
    return request({
        url:'/equity_plan/company/get_equity_plan_nav',
        data:{
            "plan_id":id
        }
    });
}