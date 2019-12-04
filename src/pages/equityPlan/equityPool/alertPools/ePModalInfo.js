import React, {Component} from 'react';
import '../../index.scss';
import { connect } from 'dva';
import { Modal, Checkbox, Button, Descriptions, Typography } from 'antd';
import { path } from '@/utils/path';

const { Text } = Typography;

@connect(({ layouts, equityPool })=>({
    ...layouts,
    ...equityPool,
}))
class Index extends Component{
    render(){
        const { poolInfo } = this.props;
        return(
            <Modal
                title="修改期权池"
                visible={this.props.visibleStep1}
                width={'700px'}
                onCancel={this.fnOnCloseModal.bind(this)}
                maskClosable={false}
                footer={[
                    <Button onClick={this.fnChangeCompanyInfo.bind(this)} key="updateInfo" type="primary">
                        更新信息
                    </Button>,
                    <Button onClick={this.fnNextModalPool.bind(this)} disabled={!this.props.poolChecked} key="submit" type="primary">
                        下一步
                    </Button>,
                ]}
                afterClose={() => {
                    this.fnChangeInfo({poolChecked: false});
                } }
            >
                <Text>请先确定如下信息与当前信息是否相符。如有不符请更新信息后。</Text>
                <Descriptions column={1} style={{marginTop:10}}>
                    <Descriptions.Item label="企业类型">{poolInfo.company_type_name}</Descriptions.Item>
                    <Descriptions.Item label="资本币种">{poolInfo.currency_name}</Descriptions.Item>
                    <Descriptions.Item label="注册资本">{poolInfo.company_registered_capital}</Descriptions.Item>
                    <Descriptions.Item label="总股数">{poolInfo.unit + '（每注册资本虚拟为 ' +poolInfo.virtual_number+ ' ）' }</Descriptions.Item>
                    <Descriptions.Item label="期权池">{poolInfo.size + '（'+ poolInfo.per +'% 当有新的融资进入时，原设的期权池会同比例被稀释 ）'}</Descriptions.Item>
                    <Descriptions.Item> <Checkbox onChange={this.fnChangeCheck.bind(this)} checked={this.props.poolChecked}> 以上信息确认无误，并已完成相关决议和授权书的签字</Checkbox> </Descriptions.Item>
                </Descriptions>
            </Modal>
        )
    }

    // 修改 equityPool 数据
    fnChangeInfo = data => this.props.dispatch({ type: 'equityPool/getModelEquityPoolChangeInfo', data: data });

    // 勾选协议
    fnChangeCheck = () => this.fnChangeInfo({poolChecked: !this.props.poolChecked})

    // 更新信息
    fnChangeCompanyInfo = () => window.location.href= path.url+'/company/setting/index';

    // 弹窗 - 关闭
    fnOnCloseModal = () => this.fnChangeInfo({visibleStep1: false})

    // 弹出第二步
    fnNextModalPool = () => {
        sessionStorage.setItem("checkInfo"+this.props.plan_id, 1);
        this.fnChangeInfo({visibleStep1: false, visibleStep2: true});
    }
}
export default Index;
