import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Modal, Input, DatePicker, Spin, Select, Radio, Tooltip, Icon, Checkbox, Row, Col } from 'antd';
import request from '@/utils/request';
import './index.scss';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');


const formItemLayout = {labelCol: { span: 4 },wrapperCol: { span: 16 }};
const InputWidth = {width:'280px'}
const { Option } = Select;
const { TextArea } = Input;
let datesArr = {};

@connect(({ selectPeopel }) => ({
    ...selectPeopel
}))
class Index extends Component {
    state = {
        cityList:[]
    }
    render() {
        const { visible, domPeopel } = this.props;
        const { getFieldDecorator } = this.props.form;
        return (
            <Modal
                centered
                title='添加参与方'
                width={'700px'}
                maskClosable={false}
                visible={visible}
                onOk={this.fnCreate}
                onCancel={this.fnClose}
                okText={'确定'}
            >
                <Spin spinning={!domPeopel}>
                    <div style={{minHeight:'387px'}}>
                        <Form {...formItemLayout} hideRequiredMark={true}>
                            {domPeopel && domPeopel[1].map( (item, index)=>{
                                return item.type === 'input' ? // input 输入框 类型
                                    item.key === 'phone' ? 
                                        <Form.Item key={index} label={item.name}>
                                            {getFieldDecorator(`${item.key}`, {
                                                rules: [
                                                    { required: item.is_mandatory === '0' ? false : true, message: ' '},
                                                    { validator: this.checkPhoneNub } //自定义检验 手机号
                                                ],
                                                initialValue: ''
                                            })(<Input style={InputWidth} autoComplete="off" />)}
                                        </Form.Item>
                                    : item.key === 'email' ?
                                        <Form.Item key={index} label={item.name}>
                                            {getFieldDecorator(`${item.key}`, {
                                                rules: [
                                                    {type:'email', message: '邮箱格式不正确'},
                                                    { required: item.is_mandatory === '0' ? false : true, message: '请输入'+item.name }
                                                ]
                                            })(<Input style={InputWidth} autoComplete="off" />)}
                                        </Form.Item>
                                    : item.key === 'first_and_last_name' ? 
                                        <Form.Item key={index} label='First Name' style={{marginBottom:0}}>
                                            <Form.Item style={{ display: 'inline-block', width: '100px' }}>
                                                {getFieldDecorator('first_name', { 
                                                    initialValue:item.value,
                                                    rules:[{ required: item.is_mandatory === '0' ? false : true, message: 'cannot be empty first name' } ] 
                                                })(
                                                    <Input autoComplete="off" />
                                                )}
                                            </Form.Item>
                                            <span style={{ display: 'inline-block', width: '80px', textAlign: 'center' }}> Last Name </span>
                                            <Form.Item style={{ display: 'inline-block', width: '100px' }}>
                                                {getFieldDecorator('last_name', { 
                                                    initialValue:item.value,
                                                    rules:[{ required: item.is_mandatory === '0' ? false : true, message: 'cannot be empty last name' } ] 
                                                })(
                                                    <Input autoComplete="off" />
                                                )}
                                            </Form.Item>
                                            { item.is_mandatory === '0' ? <span className="ant-form-text">（英文名选填）</span> : ''}
                                        </Form.Item>
                                    :
                                        <Form.Item key={index} label={item.name}>
                                            {getFieldDecorator(item.key, {
                                                initialValue:'',
                                                rules: [{required: item.is_mandatory === '0' ? false : true, message: '请输入'+item.name}]
                                            })(
                                                <Input style={InputWidth} autoComplete="off" />
                                            )}
                                            { item.is_mandatory === '0' ? <span className="ant-form-text"> （可选）</span> : ''}
                                        </Form.Item>
                                : item.type === 'date' ?  // 日期 类型
                                    <Form.Item key={index} label={item.name}>
                                        {getFieldDecorator(item.key, {
                                            defaultValue: item.value,
                                            rules: [{required: item.is_mandatory === '0' ? false : true, message: '请输入'+item.name}]
                                        })(
                                            <DatePicker onChange={this.naturalDatePicker.bind(this,item.key)} style={InputWidth} autoComplete="off" disabledDate={item.key === 'birth_date' || item.key === 'entry_date' ? this.disabledDate : null} />
                                        )}
                                        { item.is_mandatory === '0' ? <span className="ant-form-text"> （可选）</span> : ''}
                                    </Form.Item>
                                : item.type === 'select' ?   // select 类型
                                    item.key === 'certificate_type_code' ? 
                                        <Form.Item key={index} label="证件号" style={{marginBottom:0}}>
                                            <Form.Item  style={{ display: 'inline-block', width: '100px' }}>
                                                {getFieldDecorator('certificate_type', { 
                                                    initialValue:1,
                                                    rules:[{ required: true, message: '请选择证件类型' } ] 
                                                })(
                                                    <Select placeholder="请选择证件类型">
                                                        {item.value.map( (vItem,vIndex)=>{
                                                            return <Option key={vIndex} value={vItem.id}>{vItem.name}</Option>
                                                        })}
                                                    </Select>
                                                )}
                                            </Form.Item>
                                            <span style={{ display: 'inline-block', width: '10px', textAlign: 'center' }}></span>
                                            <Form.Item style={{ display: 'inline-block', width: '170px' }}>
                                                {getFieldDecorator('certificate_code', { 
                                                    initialValue:'',
                                                    rules:[
                                                        { required: true, message: ' ' },
                                                        { validator: this.checkCertificate } //自定义检验 证件号
                                                    ] 
                                                })(
                                                    <Input autoComplete="off" />
                                                )}
                                            </Form.Item>
                                        </Form.Item>
                                    : item.key === 'pay_taxes_id' ? 
                                        <Form.Item key={index} label={item.name} style={{marginBottom:0}}>
                                            <Form.Item  style={{ display: 'inline-block', width: '135px' }}>
                                                {getFieldDecorator('province_id', { 
                                                    initialValue:'请选择',
                                                    rules:[
                                                        { required: item.is_mandatory === '1' ? true : false, message: '请选择省份' }
                                                    ]
                                                })(
                                                    <Select onChange={this.handleProvinceChange}>
                                                        {item.value.map( (vItem,vIndex)=>{
                                                            return <Option key={vIndex} value={vItem.id}>{vItem.name}</Option>
                                                        })}
                                                    </Select>
                                                )}
                                            </Form.Item>
                                            <span style={{ display: 'inline-block', width: '10px', textAlign: 'center' }}></span>
                                            <Form.Item style={{ display: 'inline-block', width: '135px' }}>
                                                {getFieldDecorator('pay_taxes_id', { 
                                                    initialValue:'',
                                                    rules:[
                                                        { required: item.is_mandatory === '1' ? true : false, message: '请选择城市' }
                                                    ] 
                                                })(
                                                    <Select placeholder="请选择城市">
                                                        {this.state.cityList.length !== 0 ? this.state.cityList.map( ( cVal, cKey ) => {
                                                            return <Option key={cKey} value={cVal.id}>{cVal.name}</Option>
                                                        }):null}
                                                    </Select>
                                                )}
                                                { item.is_mandatory === '0' ? <span className="ant-form-text"> （可选）</span> : ''}
                                            </Form.Item>
                                        </Form.Item>    
                                    : item.key === 'country_id' ? 
                                        <Form.Item key={index} label={item.name} style={{marginBottom:0}}>
                                            <Form.Item  style={{ display: 'inline-block', width: '100px' }}>
                                                {getFieldDecorator(item.key, { 
                                                    initialValue:1,
                                                    rules:[
                                                        { required: item.is_mandatory === '1' ? true : false, message: '请选择'+item.name }
                                                    ]
                                                })(
                                                    <Select>
                                                        {item.value.map( (vItem,vIndex)=>{
                                                            return <Option key={vIndex} value={vItem.id}>{vItem.name}</Option>
                                                        })}
                                                    </Select>
                                                )}
                                                { item.is_mandatory === '0' ? <span className="ant-form-text"> （可选）</span> : ''}
                                            </Form.Item>
                                            <span style={{ display: 'inline-block', width: '10px', textAlign: 'center' }}></span>
                                            <Form.Item style={{ display: 'inline-block', width: '170px' }}>
                                                {getFieldDecorator('country_name' )(
                                                    <Input autoComplete="off"  />
                                                )}
                                            </Form.Item>
                                        </Form.Item>    
                                    :
                                        <Form.Item key={index} label={item.name} style={{marginBottom:0}}>
                                            {getFieldDecorator(item.key, { 
                                                initialValue:1,
                                                rules:[
                                                    { required: item.is_mandatory === '1' ? true : false, message: '请选择'+item.name }
                                                ]
                                            })(
                                                <Select style={InputWidth} >
                                                    {item.value.map( (vItem,vIndex)=>{
                                                        return <Option key={vIndex} value={vItem.id}>{vItem.name}</Option>
                                                    })}
                                                </Select>
                                            )}
                                            { item.is_mandatory === '0' ? <span className="ant-form-text"> （可选）</span> : ''}
                                        </Form.Item>  
                                : item.type === 'radio' ? // radio 类型
                                    <Form.Item key={index} label={item.name} validateStatus="error">
                                        {getFieldDecorator(item.key,{
                                            rules:[
                                                { required: item.is_mandatory === '1' ? true : false, message: '请选择'+item.name },
                                                { validator: this.handleValidator }
                                            ]
                                        })(
                                            <Radio.Group key={item.key}>
                                                {item.value.map((v, k)=>{
                                                        return (
                                                            <Radio key={k} value={v.id}>{v.name}</Radio>
                                                        )
                                                    })
                                                }
                                            </Radio.Group>
                                        )}
                                        { item.key === 'is_affiliate' || item.key === 'is_inside' || item.key === 'is_safe' ? 
                                            <Tooltip placement="right" title={
                                                item.key === 'is_affiliate' ? 
                                                    'Affiliate人员卖出前，须进限售登记，目前系统只能限制对期权发起的委托交易，受限股部分需要激励对象在自己的证券账户中自行处理'
                                                : item.key === 'is_inside' ?
                                                '该人员卖出期权时，需要公司内部的额外批准'
                                                : item.key === 'is_safe' ? 
                                                'SAFE人员对应的收益及税收金需走外管局结汇通道回到境内'
                                                :''
                                            }>
                                                <Icon type="question-circle" style={{color:'#9b9b9b'}} />
                                            </Tooltip>
                                        :null}
                                        { item.is_mandatory === '0' ? <span className="ant-form-text"> （可选）</span> : ''}
                                    </Form.Item>
                                : item.type === 'checkbox' ? // checkbox 类型
                                    <Form.Item key={index}  label={item.name}>
                                        {getFieldDecorator(item.key, {
                                            rules:[
                                                { required: item.is_mandatory === '1' ? true : false, message: '请选择'+item.name },
                                                { validator: this.handleValidatorCheckbox }
                                            ]
                                        })(
                                            <Checkbox.Group style={{ width: '100%' }}>
                                                <Row>
                                                    {item.value.map((v, k)=>{
                                                            return (
                                                                <Col key={k} span={8}>
                                                                    <Checkbox value={v.id}>{v.name}</Checkbox>
                                                                </Col>
                                                            )
                                                        })
                                                    }
                                                </Row>
                                            </Checkbox.Group>
                                        )}
                                    </Form.Item>
                                : item.type === 'textarea' ? // textarea 类型
                                    <Form.Item key={index} label={item.name}>
                                        {getFieldDecorator(`${item.key}`, {rules: [{required: item.is_mandatory === '0' ? false : true, message: '请输入'+item.name}]})(
                                            <TextArea rows={4} />
                                        )}
                                        { item.is_mandatory === '0' ? <span className="ant-form-text"> （可选）</span> : ''}
                                    </Form.Item>
                                :null
                            })}
                        </Form>
                    </div>
                </Spin>
            </Modal>
        );
    }
    // 日期change事件，将date类型值转为 Y-M-D 格式
    naturalDatePicker = ( key, option, dateString ) => datesArr[key] = dateString

    handleValidator = (rule, val, callback) => {
        if (!val) { callback(); }
        callback();
    }

    handleValidatorCheckbox = (rule, val, callback) => {
        if (!val) {
            callback();
        }
        callback();
    }

    // 城市联动select
    handleProvinceChange = value => {
        this.props.form.setFields({
            pay_taxes_id:{
                value:'',
            }
        })
        let $this = this;
        request({
            url:'/company/people/getCommonLocationCityList_ajax',
            data:{'province_id':value}
        }).then((res)=>{
            if( res.data.error_code ){
                $this.setState({ cityList:res.data.error_msg })
            }
        });
    }

    // 日期限制，不可选择今天之后的日期
    disabledDate = (current) => { return current > moment().endOf('day') }

    //手机号码验证 regEx:第一位数字必须是1，11位数字
    checkPhoneNub(rule, value, callback) {
        var regu = "^1[0-9]{10}$";
        var re = new RegExp(regu);
        if ( re.test(value) ) {
            callback();
        }else {
            callback('请正确输入手机号！');
        }
    }

    /* 校验 身份证，日期，手机号等 */
    checkCertificate=(rule,value,callback)=>{
        if( this.props.form.getFieldsValue().certificate_type === 1 ){
            let reg = /(^\d{18}$)/;
            if(!reg.test(value)){
                callback([new Error('证件号不合法')]);
            }else{
                callback();
            }
        }else {
            callback();
        }
    }

    // 确定
    fnCreate = () => {
        const { form } = this.props;
        form.validateFields( async (err, values) => {
            if (err) {return;}
            let sendData = {
                ...values,
                ...datesArr,
                type: 1,
                board_type: 0,
                add_type: 1,
                is_send_email: 0,
            }
            await this.props.dispatch({type:'selectPeopel/getModelAddPeopel', data: sendData});
            await form.resetFields();
            await this.props.dispatch({type:'selectPeopel/getModelChangeVisible'});
            await this.props.propsfnChange(this.props.checkUser);
        });
    }
    fnClose = () => {
        this.props.dispatch({type:'selectPeopel/getModelChangeVisible'});
    }
}

export default Form.create({ name: 'form_in_modal' })(Index);;