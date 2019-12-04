import React, { Component } from 'react';
import styles from './index.scss';
import { connect } from 'dva';
import { path } from '@/utils/path';
import router from 'umi/router';
import QueueAnim from 'rc-queue-anim';

@connect(({layouts, breadCrumb, equityPlan, equityPlanDetails}) => ({
    ...layouts,
    ...breadCrumb,
    ...equityPlan,
    ...equityPlanDetails,
}))

class Index extends Component{
    UNSAFE_componentWillMount = () => {
        this.fnGetModelBreadCrumb();
    };

    render(){
        return(
            <div className={styles.breadCrumbDiv}>
                <QueueAnim delay={300}>
                    <div key='a' style={{zIndex:'100',position:'relative' }}>
                        {this.props.profit_plan_open ? 
                            <React.Fragment>
                                <div className="navStyle" onClick={this.fnLocation.bind(this, path.url+'/bonus/profit/index')}>
                                    <div className="lnav1 fl"></div>
                                    <div className="fl navTitle">虚拟分红</div>
                                </div>
                                <div className="downIconPlan" style={{marginLeft:0}}></div>
                            </React.Fragment>
                        :
                            <React.Fragment>
                                <div className="navStyle" onClick={this.fnLocation.bind(this, path.url+'/equity/company/certificate_list')}>
                                    <div className="nav_company_ico equityIcon fl"></div>
                                    <div className="fl navTitle">期权</div>
                                    <div className="downIcon"></div>
                                    {this.props.BreadCrumbList ? 
                                        <div className="showMenus" style={{ width:'120px',left: '-10px' }}>
                                            {this.props.BreadCrumbList.equityMenu.map((item, index)=>{
                                                return (
                                                    <p onClick={this.fnEquityMenusClick.bind(this,path.url+item.url)} key={index} className={ item.icon === 'childrenIconEquity' ? 'active_m' :''  } style={{paddingLeft: '33px'}}>
                                                        <span className={"childIcon " + item.icon }></span>{item.name}
                                                    </p>
                                                )
                                            })}
                                        </div>
                                    :null}
                                </div>
                                <div className="downIconPlan"></div>
                            </React.Fragment>
                        }
                        {this.props.BreadCrumbList ?
                            <div className="navStyle" style={{marginLeft:'0'}}>
                                <div className="fl navTitle">{this.props.plan_name}</div>
                                <div className="downIcon downIconPlan"></div>
                                <div className="showMenus">
                                    {this.props.BreadCrumbList.planList.map( item =>{
                                        return (
                                            <p 
                                                key={item.plan_id} 
                                                onClick={this.fnPlanListClick.bind(this, item)} 
                                                className={ item.plan_id === this.props.plan_id ? 'active' : '' } 
                                            >
                                                {item.plan_name}
                                            </p>
                                        )
                                    })}
                                </div>
                            </div>
                        :null}
                        {this.props.profit_plan_open ? 
                            <div className="navStyle noHover" style={{marginLeft:'0'}}>
                                <div className="fl navTitle">分红详情</div>
                            </div>
                        :null}
                    </div>
                </QueueAnim>
            </div>
        )
    }

    fnGetModelBreadCrumb = async () => {
        this.props.dispatch({type:'breadCrumb/getBreadCrumbList'})
    }

    fnEquityMenusClick = (url, e) => {
        e.stopPropagation();
        this.props.dispatch({type: 'layouts/getModelLocationCheck',callback:async function(){
            window.location.href=url;
        }});
    }

    fnLocation = url => {
        this.props.dispatch({type: 'layouts/getModelLocationCheck',callback:async function(){
            window.location.href=url
        }});
    };

    fnPlanListClick = item => {
        let $this = this;
        this.props.dispatch({type: 'layouts/getModelLocationCheck',callback:async function(){
            let newSearch = '';
            let newHistory = {
                ...$this.props.history,
            }
            newHistory.location.query.plan_id = item.plan_id;
            newSearch = '?plan_id='+item.plan_id;
            if( newHistory.location.query.profit_plan_open !== undefined ){
                newHistory.location.query.profit_plan_open = '1';
                newSearch += '&profit_plan_open=1';
            }
            newHistory.location.search = newSearch;
            await $this.props.dispatch({type:'breadCrumb/changePlanList',data:item});
            await $this.props.dispatch({type:'layouts/savePlanID',data:item});
            await $this.props.dispatch({type:'equityPlan/changeLoadState',data:true});
            await $this.props.dispatch({type:'equityPlan/changeTbsMenusActive',data:'Details'});
            await $this.props.dispatch({type:'equityPlanDetails/getModelEquityPlanDetails',data:item.plan_id});
            await $this.props.dispatch({type:'equityPlan/changeLoadState',data:false});
            await router.replace('/equityPlan/Details'+newSearch);
        }});
    }
}
export default Index;