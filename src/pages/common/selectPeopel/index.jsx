import React, { Component } from 'react';
import { connect } from 'dva';
import './index.scss';
import { Select, Spin  } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import asyncComponent from '@/pages/common/asyncComponent.js';
const AsyncAddSelectPeopel = asyncComponent(() => import('@/pages/common/selectPeopel/add'));;


moment.locale('zh-cn');
const { Option } = Select;

@connect(({ selectPeopel }) => ({
    ...selectPeopel
}))

class Index extends Component{
    state={
        loadAjaxloading: false,
    }
    UNSAFE_componentWillMount() {
        this.fnGetUserList();
    }

    render(){
        const propsInfo = this.props.propsInfo;
        return(
            <div>
                <Select
                    onSearch={this.onSearch}
                    onChange={this.props.propsChangePeopel}
                    loading={this.props.loading}
                    style={this.props.propsStyle ? this.props.propsStyle : { width: 260 }}
                    // value={ propsInfo.company_user_id }
                    defaultValue={ propsInfo.company_user_name }
                    firstActiveValue={propsInfo.company_user_id}
                    showSearch
                    allowClear={true}
                    placeholder="请选择人员"
                    optionFilterProp="children"
                    filterOption={(input, option) => option.props.children[0].toLowerCase().indexOf(input.toLowerCase()) >= 0 }
                    dropdownClassName='selectPeopelDiv'
                    dropdownMatchSelectWidth={false}
                    dropdownStyle={{ width:'500px',minHeight:'200px' }}
                    dropdownRender={ menu => (
                        <React.Fragment>
                            {menu}
                            <div onClick={this.handleAddPeople.bind(this)} onMouseDown={e => e.preventDefault()} className='addPropelBtn' >
                                <Spin size='small' spinning={this.state.loadAjaxloading} delay={500}> 添加人员 </Spin>
                            </div>
                        </React.Fragment>
                    )}
                    notFoundContent={!this.props.userList ? <Spin>加载中...</Spin> : null}
                >
                    {this.props.userList ? this.props.userList.map( (item, index) => {
                        return  <Option key={index} value={item.company_user_id}>
                                    {item.company_user_name} <div className='peopelEmailInfo'>{item.email}</div>
                                </Option>
                    }) :null}
                </Select>
                <AsyncAddSelectPeopel propsfnChange={this.fnResGetUserList.bind(this)} />
            </div>
        )
    }

    // 获取人员列表
    fnGetUserList = () => this.props.dispatch({type: 'selectPeopel/getModelUsetList',data:this.props.propsInfo});

    fnResGetUserList = async id => {
        await this.fnGetUserList();
        await this.props.propsChangePeopel(id);
    }
    
    // 人员搜索 -  数量限制100条
    onSearch = (e) => {
        let $this = this;
        setTimeout(function(){
            const arrData = $this.props.allUserList;   //获得2k条数据
            let newOptionsData = [];
            if(arrData.length >= 0){
                let len;
                if(arrData.length < 100)len = arrData.length;
                if(arrData.length >= 100)len = 100;
                if(e === ''){
                    newOptionsData = arrData.filter((item, index) => index < len)
                }
                else{
                    let newArr = arrData.filter(item => item.company_user_name.indexOf(e) !== -1)
                    newOptionsData = newArr.filter((item, index) => index < 100)
                } 
            }
            $this.props.dispatch({type:'selectPeopel/getModelChangeUserList', data: newOptionsData });
        },300)
    }

    // 添加 - 人员
    handleAddPeople = () => {
        !this.props.domPeopel && this.props.dispatch({type:'selectPeopel/getModelDomPeopelArray'})
        this.props.dispatch({type:'selectPeopel/getModelChangeVisible'});
    }

}

export default Index;