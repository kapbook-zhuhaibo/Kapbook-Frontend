import React, {Component} from 'react';
import '../../index.scss';
import { connect } from 'dva';
import { Modal, Form, InputNumber, message, Input, DatePicker } from 'antd';
import moment from 'moment';

const { TextArea } = Input;
@connect(({ layouts, equityPool })=>({
    ...layouts,
    ...equityPool,
}))
class Index extends Component{    
    render(){
        return(
            <CollectionCreateForm
                wrappedComponentRef={this.saveFormRef}
                visible={this.props.visibleStep2}
                onCancel={this.fnOnCloseModal}
                onCreate={this.fnNextModalPool}
                propsInfo={this.props.poolInfo}
                />
        )
    }

    // formRef
    saveFormRef = formRef => this.formRef = formRef;

    // 修改 equityPool 数据
    fnChangeInfo = data => this.props.dispatch({ type: 'equityPool/getModelEquityPoolChangeInfo', data: data });

    // 弹窗 - 关闭
    fnOnCloseModal = () => this.fnChangeInfo({ visibleStep2: false })

    // 下一步
    fnNextModalPool = () => {
        const { form } = this.formRef.props;
        form.validateFields((err, values) => {
            if (err) { return; }
            console.log('Received values of form: ', values);
            console.log((values.board_approval_date).replace(/-/g,""))


            // form.resetFields();
            // this.fnChangeInfo({visibleStep2: false, visibleStep3: true});
        });

        // let boardDate = 0;
        // let shareholderDate = 0;
        // // 董事会通过日期
        // if( this.state.dataSource ){
        //     boardDate = parseInt((this.state.dataSource[this.state.dataSource.length-1].board_approval_date).replace(/-/g,""));
        // }
        // // 股东会通过日期
        // if( this.state.dataSource ){
        //     shareholderDate = parseInt((this.state.dataSource[this.state.dataSource.length-1].shareholder_approval_date).replace(/-/g,""));
        // }

        // // 新设置 董事会通过日期
        // let newboardDate = parseInt((data.board_approval_date).replace(/-/g,''))
        // // 新设置 股东会通过日期
        // let newShareholderDate = parseInt((data.shareholder_approval_date).replace(/-/g,''));
        // if( newboardDate < boardDate ){
        //     message.error('董事会通过日期不能小于上次填写日期');
        //     return false;
        // }
        // if( newShareholderDate < shareholderDate ){
        //     message.error('股东会通过日期不能小于上次填写日期')
        //     return false;
        // }

        // // 设置state状态值
        // await this.setState({ submitData:data, visibleLoad:true, });

        // let _this = this;
        // if( this.state.ajaxData.plan_type === '1' ){
        //     this.props.getNewDocumentList({plan_id:this.props.plan_id,size:this.state.submitData.size},function(res){
        //         _this.setState({ 
        //             dataDocumentList:res,
        //             visible_2: false,
        //             visible_3: true,
        //             visibleLoad:false,
        //         });
        //     });
        // }else {
        //     _this.setState({ 
        //         visible_2: false,
        //         visible_3: true,
        //         visibleLoad:false,
        //     }) 
        // }
    }
}

const CollectionCreateForm = Form.create({ name: 'form_in_modal' })(
    class extends React.Component {
        state={
            EquPool:1,
            nextBtnStatus:true,
        }

        render() {
            const { visible, onCancel, onCreate, form, propsInfo, companyType } = this.props;
            const { getFieldDecorator } = form;
            const formItemLayout = { labelCol: { xs: { span: 24 }, sm: { span: 5 }, }, wrapperCol: { xs: { span: 24 }, sm: { span: 19 }, }, };
            return (
                <Modal
                    visible={visible}
                    title="修改期权池"
                    width={'700px'}
                    okText="下一步"
                    maskClosable={false}
                    onCancel={onCancel}
                    onOk={onCreate}
                    afterClose={() => {
                        const form = this.props.form;
                        form.resetFields();
                    } }
                >
                    <Form {...formItemLayout} hideRequiredMark={true}>
                        <Form.Item label="新期权池" extra={ 
                                companyType === 2 ? 
                                    <p className='txtP'>当前期权池（持股平台）股数 { propsInfo.size } 可用 {propsInfo.size_number} 股</p> 
                                : 
                                    <p className='txtP'>当前期权池股数 {propsInfo.size},已授予 {propsInfo.size_number} 股</p> 
                                } 
                            >
                            <Form.Item style={{ display: 'inline-block', width: 'calc(36% - 12px)' }}>
                                {getFieldDecorator('size', { rules: [{ required: true, message: '请输入正确的新期权池数量' }] })(
                                        <InputNumber
                                            min={1}
                                            style={{width:163}}
                                            onChange={this.handleCalcEqupool.bind(this)} 
                                            onBlur={this.handleBlur.bind(this)}
                                            formatter={value => ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                        />   
                                    )
                                }
                            </Form.Item>
                            {propsInfo.company_type === '2' ? 
                                <Form.Item style={{ display: 'inline-block', width: 'calc(36% - 12px)' }}>
                                    <span>股，即</span>
                                    {getFieldDecorator('size_pro',{ rules:[{ required:true, message: '请输入正确的新期权池百分比' }] })(
                                        <InputNumber 
                                            max={100}
                                            onChange={this.handleCalcEqupool_b.bind(this)} 
                                            onBlur={this.handleBlurPro.bind(this)}
                                            style={{width:120,marginLeft:5}}
                                            formatter={value => `${value}%`}
                                            parser={value => value.replace('%', '')}
                                            />
                                    )}
                                </Form.Item>
                            :null}
                        </Form.Item>

                        <Form.Item label="计划通过日期">
                            <Form.Item 
                                help="董事会通过日期"
                                style={{ display: 'inline-block', width: 'calc(33% - 12px)' }}
                            >
                                {getFieldDecorator('board_approval_date',{ rules:[{ required:true, message: '请选择董事会通过日期' }] })(
                                    <DatePicker onChange={this.handleBlurPro} disabledDate={this.disabledDate} style={{ width:'160px',marginRight:'10px' }} />
                                )}
                            </Form.Item>
                            <span style={{ display: 'inline-block', width: '24px', textAlign:'center' }}>-</span>
                            <Form.Item 
                                help='股东会通过日期'
                                style={{ display: 'inline-block', width: 'calc(33% - 12px)' }}
                            >
                                {getFieldDecorator('shareholder_approval_date',{ rules:[{ required:true, message: '请选择股东会通过日期' }] })(
                                    <DatePicker onChange={this.handleBlurPro} disabledDate={this.disabledDate} style={{ width:'160px' }} />
                                )}
                            </Form.Item>
                        </Form.Item>

                        <Form.Item label='修改原因 (可选)'>
                            {getFieldDecorator('modify_reason')(
                                <TextArea style={{width:342}}></TextArea>
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
            );
        }

        disabledDate = e => { return e > moment().endOf('day') }

        // 数量
        handleBlur = e => {
            let ajaxData = this.props.propsInfo
            let value = parseInt((e.target.value).replace(/\$\s?|(,*)/g, ''));
            let issued_amount = parseInt(ajaxData.issued_amount);
            let unit_number = parseInt(ajaxData.unit_number);
            if( ajaxData.unit_number !== '0' && ajaxData.unit_number !== undefined && ajaxData.unit_number !== 0 ){
                unit_number = parseInt((ajaxData.unit_number).replace(/,/g,''))
            }
            let nextBtnStatusType = false;
            if( value < issued_amount ){
                issued_amount = issued_amount.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,")
                message.warning('新的期权池不能小于已发放期权总量 '+issued_amount+' 股');
                nextBtnStatusType = true;
            }
            if( value > unit_number ){
                let valThou = value.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,");
                message.warning('暂时您仅拥有 '+ajaxData.unit+' 普通股，无法支持新的期权池 '+valThou+' 股的计划！');
                nextBtnStatusType = true;
            }
            this.setState({ nextBtnStatus:nextBtnStatusType })
        }
        handleCalcEqupool(value){
            const { propsInfo  } = this.props
            if( propsInfo.company_type === '2' ){   
                if( value === '' ){
                    this.props.form.setFieldsValue({
                        size_pro: '',
                    });
                }else {
                    let unit_number = (propsInfo.unit_number).replace(/\$\s?|(,*)/g, '');
                    let calcPool = (value / parseInt(unit_number) * 100).toFixed(4);
                    this.props.form.setFieldsValue({
                        size_pro: calcPool,
                    });
                }
            }
        }

        // 比例
        handleCalcEqupool_b(value) {
            const { propsInfo  } = this.props
            let unit_number = (propsInfo.unit_number).replace(/\$\s?|(,*)/g, '');
            let calcPool = parseInt(value / 100 * parseInt(unit_number))
            this.props.form.setFieldsValue({
                size: calcPool,
            });
        }
        handleBlurPro = () => this.setState({ nextBtnStatus:false });

    },
);


export default Index;
