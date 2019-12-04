import React, { Component } from 'react';
import "../../node_modules/normalize.css/normalize.css";
import asyncComponent from '@/pages/common/asyncComponent.js';
import { connect } from 'dva';
import styles from './index.scss';
import zhCN from 'antd/es/locale/zh_CN';
import { ConfigProvider } from 'antd';


const AsyncTopBar = asyncComponent(() => import('@/pages/topBar'));
const AsyncBreadcrumb = asyncComponent(()=>import('@/pages/common/breadCrumb/index'))

@connect(({layouts}) => ({
    ...layouts,
}))
class Index extends Component{
    UNSAFE_componentWillMount = () => {
        const params = this.props.history.location.query;
        const plan_id = params.plan_id;
        const profit_plan_open = params.profit_plan_open;
        const history = this.props.history;
        this.props.dispatch({
            type:'layouts/savePlanID',
            data:{
                plan_id: plan_id,
                profit_plan_open: profit_plan_open === undefined ? false : profit_plan_open,
                history: history,
            }
        });
    };
    
    render(){
        return(
            <ConfigProvider locale={zhCN}>
                <AsyncTopBar />
                <AsyncBreadcrumb />
                <div className={styles.contents}>
                    {this.props.children}
                </div>
            </ConfigProvider>
        )
    }
}

export default Index;
