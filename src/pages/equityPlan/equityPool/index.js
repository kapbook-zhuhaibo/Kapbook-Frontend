import React, {Component} from 'react';
import '../index.scss';
import { connect } from 'dva';
import { Row, Col, Typography, Button, Table, Dropdown, Menu, Icon, Divider, Tooltip } from 'antd';
import asyncComponent from '@/pages/common/asyncComponent.js';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const AsyncePModalInfo = asyncComponent(() => import('./alertPools/ePModalInfo'));
const AsyncePModalForm = asyncComponent(() => import('./alertPools/ePModalForm'));


const { Text } = Typography;

// 表头
const columns = [
    {
      title: '修改日期',
      dataIndex: 'create_date',
      key: 'create_date',
    },
    {
      title: '期权池股数',
      dataIndex: 'new_size',
      key: 'new_size',
    },
    {
      title: '董事会通过日期',
      dataIndex: 'board_approval_date',
      key: 'board_approval_date',
    },
    {
      title: '股东会通过日期',
      dataIndex: 'shareholder_approval_date',
      key: 'shareholder_approval_date',
    },
    {
        title:'修改原因',
        dataIndex: 'modify_reason',
        key: 'modify_reason',
    },
    {
      title: '文档',
      key: 'document_list',
      dataIndex: 'document_list',
      render: tags => (
        <span>
            <Dropdown overlay={(
                <Menu>
                    {tags.map( (item, index) => {
                        return(
                            <Menu.Item key={ index }>
                                <a href={ item.document_path } target={'_blank'} >{ item.document_type_name }</a>
                            </Menu.Item>
                        )
                    } )}
                </Menu>
            )}>
                <Button size='small' style={{fontSize:'12px',color:'#9b9b9b'}}> 下载 <Icon type="down" /></Button>
            </Dropdown>
        </span>
      ),
    },
];

@connect(({ layouts, equityPool, equityPlan })=>({
    ...layouts,
    ...equityPool,
    ...equityPlan,
}))
class Index extends Component{
    
    UNSAFE_componentWillMount = () => {
        this.props.dispatch({type:'equityPlan/changeLoadState',data:false});
        this.fnRequstPools();
    }

    render(){
        const { dataMenus, companyType  } = this.props;
        return(
            <React.Fragment>
                <Row className="EquityPool">
                    <Col span={16}>
                        <h2>期权池修改记录</h2>
                        <Text type="secondary">请先下载修改期权池所需要的文档，进行相关法定程序并签字后，再开始点击修改期</Text>
                        <br/>
                        <Text type="secondary">权池，并回传到系统进行保存，作为本次修改期权池操作的法律依据</Text>
                    </Col>
                    <Col span={8} style={{ textAlign:'right' }}>
                        {companyType && companyType === 2 ?
                            <Dropdown overlay={ ()=>{
                                if( dataMenus ){
                                    return (
                                        <Menu>
                                            <Menu.Item key="1">
                                                <div>
                                                    <a href={ dataMenus[0][1].path }>{ dataMenus[0][1].name }</a>
                                                    <Divider type="vertical" />
                                                    <a href={ dataMenus[0][11].path }>{ dataMenus[0][11].name }</a>
                                                    <Tooltip placement="top" title='董事人数只有一人请下载执行董事决定，董事人数大于一人请下载董事会决议'>
                                                        <Icon type="question-circle" style={{color:'#9b9b9b',marginLeft:'5px'}} />
                                                    </Tooltip>
                                                </div>
                                            </Menu.Item>
                                            <Menu.Item key="2">
                                                <div>
                                                    <a href={ dataMenus[1][2].path }>{ dataMenus[1][2].name }</a>
                                                    <Divider type="vertical" />
                                                    <a href={ dataMenus[1][12].path }>{ dataMenus[1][12].name }</a>
                                                    <Tooltip placement="top" title='股东人数只有一人请下载股东决定，股东人数大于一人请下载股东会决议'>
                                                        <Icon type="question-circle" style={{color:'#9b9b9b',marginLeft:'5px'}} />
                                                    </Tooltip>
                                                </div>
                                            </Menu.Item>
                                            <Menu.Item key="3">
                                                <div>
                                                    <a href={ dataMenus[2][6].path }>{ dataMenus[2][6].name }</a>
                                                </div>
                                            </Menu.Item>
                                        </Menu>
                                    )
                                }else {
                                    return(
                                        <Menu>
                                            <Menu.Item key="0">
                                                <div>
                                                    加载中...
                                                </div>
                                            </Menu.Item>
                                        </Menu>
                                    )
                                }
                            } }>
                                <Button> 签字文档下载 <Icon type="down" /> </Button>
                            </Dropdown>
                        :''}
                        <Button onClick={this.fnEditPoolModal.bind(this)} type="primary" style={{ marginLeft:'10px' }}>修改期权池</Button>
                    </Col>
                    <Col span={24}>
                        <Table 
                            loading={!this.props.dataSource} 
                            pagination={false} 
                            columns={columns} 
                            dataSource={!this.props.dataSource ? [] : this.props.dataSource} 
                            className='shadow'
                            rowKey={record => record.id} 
                            style={{ marginTop:'20px' }}  
                        />
                    </Col>
                </Row>
                
                <AsyncePModalInfo />

                <AsyncePModalForm />

            </React.Fragment>
        )
    }

    fnRequstPools = () => this.props.dispatch({ type:'equityPool/getModelEquityPools' });

    fnEditPoolModal = () => {
        let sendData = {};
        if( !sessionStorage.getItem('checkInfo'+this.props.plan_id) && this.props.companyType === 2 ){
            sendData['visibleStep1'] = !this.props.visibleStep1;
        }else {
            sendData['visibleStep2'] = !this.props.visibleStep2;
        }
        this.props.dispatch({ 
            type: 'equityPool/getModelPoolModalTooger', 
            data: sendData
        })
    }

}
export default Index;
