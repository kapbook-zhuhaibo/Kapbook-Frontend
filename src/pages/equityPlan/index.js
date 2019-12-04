import React, {Component} from 'react';
import { Row, Radio, Spin, Badge } from 'antd';
import './index.scss';
import { connect } from 'dva';
import router from 'umi/router';
import QueueAnim from 'rc-queue-anim';

@connect(({ layouts, equityPlan, equityPlanDetails })=>({
    ...layouts,
    ...equityPlan,
    ...equityPlanDetails,
}))
class Index extends Component{
    componentDidMount = () => {
        this.fnRequstTbsMenus();
    };
    render(){
        let tbsMenusActive = (this.props.location.pathname).split("/")[2];
        return(
            <div>
                <Row className="detailsRedioMenus">
                    <Radio.Group onChange={this.fnTbsMenusChange} value={tbsMenusActive} buttonStyle="solid">
                        <Spin spinning={this.props.tbsMenus.length === 1 ? true : false } size='small' wrapperClassName='fl'>
                            {this.props.tbsMenus.map((item, index)=>{
                                return (
                                    <Radio.Button key={ index } value={item.url}>
                                        { item.name }
                                        { item.is_red === 1 ? <Badge dot={true} offset={[-6,-9]}></Badge>:'' }
                                    </Radio.Button>
                                )
                            })}
                        </Spin>
                    </Radio.Group>
                </Row>
                <Spin spinning={this.props.loadPage}>
                    <div className='planConentDiv'>
                        <QueueAnim animConfig={[
                            { opacity: [1, 0], translateY: [0, 50] },
                            { opacity: [1, 0], translateY: [0, -50] }
                        ]}>
                            <div key='a'>
                                {this.props.children}
                            </div>
                        </QueueAnim>
                    </div>
                </Spin>
            </div>
        )
    }
    fnRequstTbsMenus = () => {
        let $this = this;
        setTimeout(() => {
            $this.props.dispatch({type:'equityPlan/getModelTbsMenusList',data: $this.props.plan_id});
        }, 10);
    }
    fnTbsMenusChange = async e => {
        let $this = this;
        await this.props.dispatch({type: 'layouts/getModelLocationCheck',callback:async function(){
            router.replace('/equityPlan/'+e.target.value+ $this.props.history.location.search);
            await $this.props.dispatch({type:'equityPlan/changeLoadState',data:true});
            await $this.props.dispatch({type:'equityPlan/changeTbsMenusActive',data:e.target.value});
        }});
    }
}
export default Index;