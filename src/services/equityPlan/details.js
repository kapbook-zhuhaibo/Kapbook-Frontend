import request from '@/utils/request';

export const getServicesEquityPlanDetails = id => {
    return request({
        url:'/equity_plan/company/detail',
        data:{
            "plan_id":id
        }
    });
}

export const getServicesDeletePlan = id => {
    return request({
        url:'/equity/company/delete_equity_plan',
        data:{
            "plan_id":id
        }
    });
}

export const getServicesSaveDetails = data => {
    let info = data.info;
    return request({
        url:data.url,
        data:{
            ...info,
            plan_id:info.id,
            document_list: JSON.stringify(info.document_list),
            exercise_window_info: JSON.stringify(info.exercise_window_info),
            exercise_retention_type_arr: JSON.stringify(info.exercise_retention_type_arr),
            periodsType: JSON.stringify(info.periodsType),
            periodsUnit: JSON.stringify(info.periodsUnit),
            is_edit: JSON.stringify(info.is_edit),
            documentInfo: JSON.stringify(info.documentInfo),
            equityInfo: JSON.stringify(info.equityInfo),
        }
    });
}