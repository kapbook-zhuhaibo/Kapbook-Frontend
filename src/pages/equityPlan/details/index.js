import React, {Component} from 'react';
import { connect } from 'dva';
import { Button, Divider, Modal, Row, Badge, Input, DatePicker, Upload, Tooltip, Icon, Radio, message  } from 'antd';
import '../index.scss';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { path } from '@/utils/path';
import asyncComponent from '@/pages/common/asyncComponent.js';
import router from 'umi/router';

const AsyncSelectPeopel = asyncComponent(() => import('@/pages/common/selectPeopel'));
moment.locale('zh-cn');

const { confirm } = Modal;
const { TextArea } = Input;

@connect(({ layouts, equityPlan, equityPlanDetails, selectPeopel })=>({
    ...layouts,
    ...equityPlan,
    ...selectPeopel,
    ...equityPlanDetails,
}))
class Index extends Component{
    
    componentDidMount = () => this.fnRequstDetails();

    render(){
        const info = this.props.info;
        const uploadsFile = {
            action: path.url+'/upload',
            headers: {'X-Requested-With':null},
            withCredentials:true,
            multiple: true,
        };
        return(
            <div className='planDetails'>
                <div>
                    <div className="detailsMan detDiv">
                        {/* 基本信息 */}
                        <div>
                            <Row>
                                <Badge count={1} className="fl" style={{ backgroundColor: '#4d9edb' }} /> 
                                <h4 className="ml10 fl">基本信息</h4>
                            </Row>
                            <div className="detailsInfoTable">
                            <table>
                                <tbody>
                                    {/* 计划名称 */}
                                    <tr>
                                        <td>
                                            { info.company_type === '2' && info.plan_type === "2" ? 
                                            '（登记）' 
                                            : info.company_type === '2' && info.plan_type === "1" ? 
                                            '（在线）' 
                                            : info.company_type === '1' ?
                                            '股权'
                                            :''}
                                            激励计划名称
                                        </td>
                                        <td>
                                            { info.plan_type === "2" ? 
                                                info.plan_name
                                            : info.plan_type === '1' ? 
                                                <Input style={{ width:'400px' }} onChange={this.fnEditPlanName.bind(this)} value={info.plan_name} />
                                            : null}
                                        </td>
                                    </tr>
                                    {/* （1）基本信息 */}
                                    {(info.company_type === '2' && info.plan_type === '2') 
                                        || ( info.company_type === '1' && ( info.company_currency === 2 || info.company_currency === 3 ) ) 
                                        || ( info.company_type === '1' && info.company_currency === 1 ) ? 
                                        <React.Fragment>
                                            {/* 【股份有限公司 - 激励计划列表】 */}
                                            {info.company_type === '1' && info.company_currency === 1 ? 
                                                <React.Fragment>
                                                    {/* 已发行总股数 */}
                                                    <this.CpmtCompanyRegisteredCapital info={info} />
                                                    <tr>
                                                        <td>股权激励计划文件</td>
                                                        <td>
                                                            {info.planDocumentInfo.map( (item, index)=>{
                                                                return (
                                                                    <p key={index}><a href={item.url}>{item.name}</a></p>
                                                                )
                                                            })}
                                                        </td>
                                                    </tr>
                                                </React.Fragment>
                                            :
                                                <tr>
                                                    <td>激励计划文件</td>
                                                    <td>
                                                        <div style={{padding:'10px 0px'}}>
                                                            <Upload 
                                                                {...uploadsFile} 
                                                                fileList={info.planDocumentInfo}
                                                                accept=".doc,.docx,.xls"
                                                                onChange={this.fnFileUploadChange.bind(this)}
                                                            >
                                                                <Button ghost type="primary" shape="round" size="small">更新</Button>
                                                            </Upload>
                                                        </div>
                                                    </td>
                                                </tr>
                                            }

                                            {/* 计划通过日期 */}
                                            <this.CpmtBoardShareDate info={info} />
                                            
                                            {/* 【VIE上市前登记】 - 已发行总股数 */}
                                            {info.company_type === '1' && ( info.company_currency === 2 || info.company_currency === 3 ) ? 
                                                info.company_is_ipo === '0' ? 
                                                    <this.CpmtCompanyRegisteredCapital info={info} />
                                                :null
                                            :null}

                                            {/* 【有限责任公司登记 and VIE 上市前登记】 - 计划有效期 */}
                                            {(info.company_type === '2' && info.plan_type === '2') || (info.company_type === '1' && ( info.company_currency === 2 || info.company_currency === 3 )) ? 
                                                <tr>
                                                    <td>计划有效期</td>
                                                    <td>{info.term_plan_year}年</td>
                                                </tr>
                                            :null}
                                        </React.Fragment>
                                    : info.company_type === '2' && info.plan_type === '1' ? 
                                        <React.Fragment>
                                            <tr>
                                                <td>计划管理人</td>
                                                <td>
                                                    <AsyncSelectPeopel propsInfo={info} propsChangePeopel={this.fnChangePeopel.bind(this)} />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>注册资本</td>
                                                <td>{ info.company_registered_capital.replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,") } 元人民币</td>
                                            </tr>
                                            <tr>
                                                <td>融资轮次</td>
                                                <td>{info.stage_name}</td>
                                            </tr>
                                            <tr>
                                                <td>估值</td>
                                                <td>{ info.valuation_price.replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,") === '0.00' ? '--' : `${info.valuation_price.replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,")}元人民币`}</td>
                                            </tr>
                                        </React.Fragment>
                                    :null}
                                </tbody>
                            </table>
                        </div>
                        </div>
                        
                        {/* 期权池 */}
                        <div>
                            <Row>
                                <Badge count={2} className="fl" style={{ backgroundColor: '#4d9edb' }} /> 
                                <h4 className="ml10 fl">期权池</h4>
                                <div onClick={this.fnTbsMenusChangeMod.bind(this, 'EquityPool')} className="editIcon fl"></div>
                            </Row>
                            <div className="detailsInfoTable">
                            <table>
                                <tbody>
                                    {info.company_type === '2' ? 
                                        <tr>
                                            <td>公司总股数</td>
                                            <td>{info.unit.replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,")} 股</td>
                                        </tr>
                                    :null}
                                     <tr>
                                        <td>期权池</td>
                                        <td>
                                            { info.company_type === '1' ? 
                                                info.size_registered_capital === 0 ?
                                                '--' 
                                                : info.size_registered_capital.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,")+' 股'
                                                : info.option_size
                                            }
                                        </td>
                                    </tr>
                                    {
                                        info.company_type === '1' && (info.company_currency === 2 || info.company_currency === 3) && info.company_is_ipo === '0' ? null
                                        : info.company_type === '1' && (info.company_currency === 2 || info.company_currency === 3) && info.company_is_ipo === '1' ? null
                                        : info.company_type === '1' && (info.company_currency === 2 || info.company_currency === 3) && info.company_is_ipo === '2' ? null
                                        :
                                        <tr>
                                            <td>期权持有方式</td>
                                            <td>{info.source_type_name}</td>
                                        </tr>
                                        }
                                </tbody>
                            </table>
                        </div>
                        </div>
                        
                        {/* 行权管理人 - VIE已上市、港股  */}
                        <div>
                            {info.company_type === '1' && info.company_currency === 3 && ( info.company_is_ipo === '1' || info.company_is_ipo === '2' ) ?
                                <React.Fragment>
                                    <Row>
                                        <Badge count={3} className="fl" style={{ backgroundColor: '#4d9edb' }} /> 
                                        <h4 className="ml10 fl">行权管理人</h4>
                                    </Row>
                                    <div className="detailsInfoTable">
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <td>行权管理人</td>
                                                    <td>
                                                        <div className="ptb10">
                                                            <AsyncSelectPeopel propsInfo={{ company_user_id: info.exercise_admin_cuid, company_user_name: info.exercise_window_info.name }} propsChangePeopel={this.fnChangePeopelCuid.bind(this)} />
                                                            <p className='textinfo'>激励对象发起行权后公司方需要进行审批及后续操作的管理人员</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </React.Fragment>
                            :null}
                        </div>
                        
                        {/* 行权设置 */}
                        <div>
                            { info.company_type === '2' ? 
                                // 有限责任公司行权设置
                                <this.CpmtExerciseDom typeTxt={'行权'} info={info}  />
                            : info.company_type === '1' && (info.company_currency === 2 || info.company_currency === 3) && info.company_is_ipo === '0' ?
                                // vie 上市前确权设置
                                <this.CpmtExerciseDom typeTxt={'确权'} info={info} />
                            :null }

                            {info.company_type === '1' && info.company_currency === 1 && info.company_is_ipo === '0' ?
                                // 股份有限公司 - 股权激励计划有效期
                                <div>
                                    <Row>
                                        <Badge count={3} className="fl" style={{ backgroundColor: '#4d9edb' }} /> 
                                        <h4 className="ml10 fl">股权激励计划有效期</h4>
                                    </Row>
                                    <div className="detailsInfoTable">
                                        <table>
                                            <tbody>
                                            <tr>
                                                <td>计划有效期</td>
                                                <td>{info.term_plan_year} 年</td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            :null}
                            {info.company_type !== '2' ? 
                                <div>
                                    <Row>
                                        <Badge 
                                            count={
                                                (info.company_type === '1' && info.company_currency === 3 && ( info.company_is_ipo === '1' || info.company_is_ipo === '2' ))
                                                || ( info.company_type === '1' && info.company_currency === 1 && info.company_is_ipo === '0' )
                                                ||  (info.company_type === '1' && info.company_currency === 2 && info.company_is_ipo === '0' ) ? '4' : '3'
                                            }
                                            className="fl" 
                                            style={{ backgroundColor: '#4d9edb' }} 
                                        /> 
                                        <h4 className="ml10 fl">行权有效期</h4>
                                    </Row>
                                    <div className="detailsInfoTable">
                                        <table>
                                            <tbody>
                                                {info && info.exercisePeriodsInfo.map( (item,index)=>{
                                                    return(
                                                        <tr key={index}>
                                                            <td>{item.name}</td>
                                                            <td>{item.value}</td>
                                                        </tr>
                                                    )
                                                })}       
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            :null}
                        </div>
                        
                        {/* 签字及盖章设置 */}
                        <div>
                            {info.company_type === '2' && info.plan_type === '1' ? 
                                <React.Fragment>
                                    <Row>
                                        <Badge count={4} className="fl" style={{ backgroundColor: '#4d9edb' }} /> 
                                        <h4 className="ml10 fl">签字及盖章设置</h4>
                                        <div onClick={this.fnTbsMenusChangeMod.bind(this, 'Template')} className="editIcon fl"></div>
                                    </Row>
                                    <div className="detailsInfoTable">
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <td>期权授予</td>
                                                    <td>{info.sign_content}</td>
                                                </tr>
                                                <tr>
                                                    <td>受限股授予</td>
                                                    <td>{info.sign_content_sahre}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <Row>
                                        <Badge count={5} className="fl" style={{ backgroundColor: '#4d9edb' }} /> 
                                        <h4 className="ml10 fl">计划文档 <i>（您可以选择性上传相关议程文件，如果上传，可以在资料库中下载查看）</i></h4>
                                    </Row>
                                    <div className="detailsInfoTable">
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <div className="ptb10">
                                                            <Radio.Group onChange={this.fnChangeRadio.bind(this, 0)} value={info.documentInfo[0].check}>
                                                                <Radio value={2} style={{marginBottom:5}}>执行董事决定</Radio>
                                                                <Radio value={1}>董事会决议</Radio>
                                                            </Radio.Group>
                                                        </div>
                                                    </td>
                                                    <td className='ptb10'>
                                                           
                                                        { info.documentInfo[0].is_update === 0 ?
                                                            <div className='posR'>
                                                                <div className="fl" style={{width:'100%'}}>
                                                                    <Upload 
                                                                        disabled={ info.documentInfo[0].check === 0 ? true : false }
                                                                        {...uploadsFile} 
                                                                        fileList={info.documentInfo[0].up_files}
                                                                        onChange={this.fnFileUploadChangeShare.bind(this, 0)}
                                                                        accept=".doc,.docx,.xls"
                                                                    >
                                                                        {info.documentInfo[0].check === 0 ?
                                                                            <Tooltip placement="right" title={'请先选择文档类型'}>
                                                                                <Button shape="round" size='small' disabled type="primary" ghost>{info.documentInfo[0].up_files.length === 0 ? '上传' : '更新'}</Button>
                                                                            </Tooltip>
                                                                        :
                                                                            <Button shape="round" size='small' type="primary" ghost>{info.documentInfo[0].up_files.length === 0 ? '上传' : '更新'}</Button>
                                                                        }
                                                                    </Upload>

                                                                </div>    
                                                                <div className="fileDowDiv">
                                                                    <a style={{ marginRight:'10px' }} href={info.documentInfo[0].default_files.url_1}>董事会决议</a>
                                                                    /
                                                                    <a style={{ marginLeft:'10px' }} href={info.documentInfo[0].default_files.url_2}>执行董事会决定</a>
                                                                </div>
                                                            </div>
                                                            :
                                                                <Upload 
                                                                    {...uploadsFile} 
                                                                    fileList={info.documentInfo[0].up_files}
                                                                    onChange={this.fnFileUploadChangeShare.bind(this, 0)}
                                                                    accept=".doc,.docx,.xls"
                                                                >
                                                                    <Button shape="round" size='small' type="primary" ghost>更新</Button>
                                                                </Upload>
                                                        }
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="ptb10">
                                                            <Radio.Group onChange={this.fnChangeRadio.bind(this, 1)} value={info.documentInfo[1].check}>
                                                                <Radio value={2} style={{marginBottom:5}}>股东会决议</Radio>
                                                                <Radio value={1}>股东决定</Radio>
                                                            </Radio.Group>
                                                        </div>
                                                    </td>
                                                    <td className='ptb10'>
                                                            { info && info.documentInfo[1].is_update === 0 ?
                                                                <React.Fragment>
                                                                    <div style={{ position:'relative' }}>
                                                                        <div className="fl" style={{width:'100%'}}>
                                                                            <Upload 
                                                                                disabled={ info.documentInfo[1].check === 0 ? true : false }
                                                                                {...uploadsFile} 
                                                                                fileList={info.documentInfo[1].up_files}
                                                                                onChange={this.fnFileUploadChangeShare.bind(this, 1)}
                                                                                accept=".doc,.docx,.xls"
                                                                            >   
                                                                            {info.documentInfo[1].check === 0 ?
                                                                                <Tooltip placement="right" title={'请先选择文档类型'}>
                                                                                    <Button shape="round" size='small' disabled type="primary" ghost>{info.documentInfo[1].up_files.length === 0 ? '上传' : '更新'}</Button>   
                                                                                </Tooltip>
                                                                            :
                                                                                <Button shape="round" size='small' type="primary" ghost>{info.documentInfo[1].up_files.length === 0 ? '上传' : '更新'}</Button>   
                                                                            }
                                                                            
                                                                                
                                                                            </Upload>
                                                                        </div>    
                                                                        <div className="fileDowDiv">
                                                                            <a style={{ marginRight:'10px' }} href={info.documentInfo[1].default_files.url_1}>股东会决议</a>
                                                                            /
                                                                            <a style={{ marginLeft:'10px' }} href={info.documentInfo[1].default_files.url_2}>股东决定</a>
                                                                        </div>
                                                                    </div>
                                                                </React.Fragment>
                                                                :
                                                                    <Upload 
                                                                        {...uploadsFile} 
                                                                        fileList={info.documentInfo[1].up_files}
                                                                        onChange={this.fnFileUploadChangeShare.bind(this, 1)}
                                                                        accept=".doc,.docx,.xls"
                                                                    >   
                                                                        <Button shape="round" size='small' type="primary" ghost>更新</Button>
                                                                    </Upload>
                                                            }
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>授权书</td>
                                                    <td className='ptb10'>
                                                        {info && info.documentInfo[2].is_update === 1 ? 
                                                            <React.Fragment>
                                                                <Upload 
                                                                    {...uploadsFile} 
                                                                    fileList={info.documentInfo[2].up_files}
                                                                    onChange={this.fnFileUploadChangeBook.bind(this)}
                                                                    accept=".doc,.docx,.xls"
                                                                >
                                                                    <Button shape="round" size='small' type="primary" ghost>更新</Button>
                                                                </Upload>
                                                            </React.Fragment>
                                                        : 
                                                            <div style={{ position:'relative' }}>
                                                                <div style={{ float:'left',width:'100%' }}>
                                                                    <Upload 
                                                                        {...uploadsFile} 
                                                                        fileList={info.documentInfo[2].up_files}
                                                                        onChange={this.fnFileUploadChangeBook.bind(this)}
                                                                        accept=".doc,.docx,.xls"
                                                                    >
                                                                        <Button shape="round" size='small' type="primary" ghost>{info.documentInfo[2].up_files.length === 0 ? '上传' : '更新'}</Button>   
                                                                    </Upload>
                                                                </div>
                                                                <div className='fileDowDiv'>
                                                                    <a href={info.documentInfo[2].default_files.url}>授权书</a>
                                                                </div>
                                                            </div>
                                                        }
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>计划通过日期</td>
                                                    <td>
                                                        <div className="ptb10">
                                                            <div className="fl">
                                                                <DatePicker onChange={this.fnBoardDatePicker.bind(this)} placeholder="" value={info.board_approval_date !== '' ? moment(`${info.board_approval_date}`, 'YYYY-MM-DD') : undefined } />
                                                                <p>董事会决议通过日期</p>
                                                            </div>
                                                            <div className="fl ml30">
                                                                <DatePicker onChange={this.fnShareDatePicker.bind(this)} placeholder="" value={info.shareholder_approval_date !== '' ? moment(`${info.shareholder_approval_date}`, 'YYYY-MM-DD') : undefined } />
                                                                <p>股东会决议通过日期</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>股权激励计划</td>
                                                    <td>
                                                        <a target={'_blank'} href={info.document_list[3]}>下载</a>
                                                    </td>
                                                </tr>
                                                   
                                            </tbody>
                                        </table>
                                    </div>
                                </React.Fragment>
                            :null}
                        </div>
                        
                        {/* 协议模板 */}
                        {info.plan_type === '2' ? 
                            <Row>
                                <Row>
                                    <Badge count={ 
                                            info.company_type === '1' && info.company_currency === 1 ? '5' 
                                            : info.company_type === '1' && info.company_currency === 2 && info.company_is_ipo === '0' ?  '5'
                                            : info.company_type === '1' && info.company_currency === 2 && info.company_is_ipo === '1' ?  '4'
                                            : info.company_type === '1' && info.company_currency === 3 && info.company_is_ipo === '0' ?  '5'
                                            : info.company_type === '1' && info.company_currency === 3 && info.company_is_ipo === '2' ?  '5'
                                            : '4'  
                                        } 
                                    className="fl" style={{ backgroundColor: '#4d9edb' }} /> 
                                    <h4 className="ml10 fl">
                                        协议模板
                                        {info.company_type === '1'?
                                            <Tooltip overlayStyle={{width:'400px'}} placement="right" title=
                                            '协议模板上传后，股书将会把您上传的文本文件初始化为系统可识别的模板文件，初始化过程将耗费1-2个工作日，在此期间您可先了解股书功能介绍。处理完成后，系统将以邮件方式通知您，设置相关签名人员后您可使用股书发放并管理全新的期权或者生成其他初始化后的法律文档。*模板电子化后文字样式可能会有细微改变，文字内容不会有变化。'
                                            >
                                                <Icon type="question-circle" style={{ marginLeft:'5px',marginRight:'5px' }} />
                                            </Tooltip>
                                        :null}
                                    </h4>
                                    <div onClick={this.fnTbsMenusChangeMod.bind(this, 'Template')} className="editIcon fl"></div>
                                </Row>
                                <div className="detailsInfoTable">
                                    <table>
                                        <tbody>
                                            {info.documentNameInfo && info.documentNameInfo.length === 0 ? 
                                                <tr>
                                                    <td></td>
                                                    <td>暂无模板</td>
                                                </tr>
                                                :   
                                                info.documentNameInfo.map((item,index)=>{
                                                    return(
                                                        <tr key={index}>
                                                            <td>{item.template_name}</td>
                                                            <td><p>{item.name_show}</p></td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </Row> 
                        :null}

                        {/* 备注 */}
                        <div>
                            <Row>
                                <Badge count={ 
                                    info.company_type === '1' && info.company_currency === 1 ? '6' 
                                    : info.company_type === '2' && info.plan_type === '2' ? '5' 
                                    : info.company_type === '1' && info.company_currency === 2 && info.company_is_ipo === '1' ?  '5'
                                    : info.company_type === '1' && info.company_currency === 3 && info.company_is_ipo === '2' ?  '6'
                                    : '6' 
                                    } className="fl" style={{ backgroundColor: '#4d9edb' }} /> 
                                <h4 className="ml10 fl">备注<i>（可选）</i></h4>
                            </Row>
                            <div className="detailsInfoTable">
                            <table>
                                <tbody>
                                    <tr>
                                        <td style={{ lineHeight:"86px" }}>备注</td>
                                        <td>
                                            <div className="ptb10">
                                                <TextArea rows={4} style={{width:"600px"}} onChange={this.fnEditNotes.bind(this)} value={info.notes}></TextArea>
                                                <span style={{ color:"#9b9b9b",fontSize:"12px",marginLeft:"10px" }}>200个字以内</span>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        </div>
                    </div>
                    <div className="detailsFooter">
                        <Divider />
                        <div className="btnDiv">
                            { info && !info.is_delete ? <Button onClick={this.showDeleteConfirm} type="danger" ghost>删除</Button> :null }
                            <Button disabled={this.props.submitDisabled} onClick={this.fnSubmit.bind(this)} type="primary" className=" ml20" style={{width:'88px'}}>更新</Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // 已发行总股数 - 函数组件
    CpmtCompanyRegisteredCapital = props => {
        let info = props.info;
        return (
            <tr>
                <td>已发行总股数</td>
                <td>{info.company_registered_capital.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,")} 股</td>
            </tr>
        )
    }

    // 计划通过日期 - 函数组件
    CpmtBoardShareDate = props => {
        let info = props.info;
        return (
            <tr>
                <td>计划通过日期</td>
                <td>
                    <div className='ptb10'>
                        <div className="fl">
                            <DatePicker onChange={this.fnBoardDatePicker.bind(this)} placeholder="" value={info.board_approval_date !== '' ? moment(`${info.board_approval_date}`, 'YYYY-MM-DD') : undefined } />
                            <p>董事会决议通过日期</p>
                        </div>
                        <div className="fl ml30">
                            <DatePicker onChange={this.fnShareDatePicker.bind(this)} placeholder="" value={info.shareholder_approval_date !== '' ? moment(`${info.shareholder_approval_date}`, 'YYYY-MM-DD') : undefined } />
                            <p>股东会决议通过日期</p>
                        </div>
                    </div>
                </td>
            </tr>
        )
    }

    // 行权/确权设置 - 函数组件
    CpmtExerciseDom = props => {
        let info = props.info;
        let typeTxt = props.typeTxt;
        return(
            <div>
                <Row>
                    <Badge count={3} className="fl" style={{ backgroundColor: '#4d9edb' }} /> 
                    <h4 className="ml10 fl">{typeTxt}设置</h4>
                    <div onClick={this.fnTbsMenusChangeMod.bind(this, 'Exercise')} className="editIcon fl"></div>
                </Row>
                <div className="detailsInfoTable">
                    <table>
                        <tbody>
                            <tr>
                                <td>{typeTxt}窗口期</td>
                                <td>
                                    <div className='fl mr10'>
                                        {info.exerciseTypeInfo.map( (item, index) =>{
                                            return <div key={index}>{item}</div>
                                        })}
                                    </div>
                                    &nbsp;
                                    <Tooltip placement="right" title={'期权成熟后，可'+typeTxt+'的区间'}>
                                        <Icon type="question-circle" style={{color:'#9b9b9b'}} />
                                    </Tooltip>
                                </td>
                            </tr>
                            <tr>
                                <td>{typeTxt}有效期</td>
                                <td>
                                    {
                                        info.exercise_window_info.exercise_retention_amount === '0' 
                                        ? '默认至本计划有效期截止日' 
                                        : info.exercise_window_info.exercise_retention_amount
                                    }
                                    {
                                        info.exercise_window_info.exercise_retention_type === '1' ? '年' 
                                        :info.exercise_window_info.exercise_retention_type === '2' ? '月' 
                                        :info.exercise_window_info.exercise_retention_type === '3' ? '天' 
                                        :null
                                    }
                                    &nbsp; 
                                    
                                    <Tooltip placement="right" title={'期权成熟后，可申请'+typeTxt+'的期限，超过该期限，持有人未申请'+typeTxt+'，则视为自动放弃该部分权利，该部分期权自动回归期权池。'}>
                                        <Icon type="question-circle" style={{color:'#9b9b9b'}} />
                                    </Tooltip>
                                </td>
                            </tr>
                            <tr>
                                <td>{ typeTxt==='行权' ? '行权及回购管理人' : '确权签字人' }</td>
                                <td>
                                    {info.exercise_window_info.name}
                                    &nbsp; 
                                    <Tooltip placement="right" title={'负责公司发起'+typeTxt+'，或审核批准员工申请'+typeTxt+'的管理人员'}>
                                        <Icon type="question-circle" style={{color:'#9b9b9b'}} />
                                    </Tooltip>
                                </td>
                            </tr>
                            <tr>
                                <td>付款凭证</td>
                                <td>
                                    {info.exercise_window_info.is_upload_voucher === '1' ? '非必传'
                                    : info.exercise_window_info.is_upload_voucher === '2' ? '必传'
                                    : null} &nbsp; 
                                    
                                    <Tooltip placement="right" title=
                                    {info.exercise_window_info.is_upload_voucher === '1' 
                                        ? '当授予受限股和申请'+typeTxt+'时，激励对象确认时可以选择上传或不上传付款凭证'
                                        : '当授予受限股和申请'+typeTxt+'时，需要激励对象确认时必须上传付款凭证'
                                    }>
                                        <Icon type="question-circle" style={{color:'#9b9b9b'}} />
                                    </Tooltip>    
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

    // 发起请求 - 获取 details 详情
    fnRequstDetails = async () => {
        await this.props.dispatch({type:'equityPlanDetails/getModelEquityPlanDetails',data:this.props.plan_id});
        await this.props.dispatch({type:'equityPlan/changeLoadState',data:false});
    }

    // 修改计划名称
    fnEditPlanName = e => {
        this.props.dispatch({
            type: 'equityPlanDetails/getModelChangeInfo', 
            data: { plan_name: e.target.value }
        });
    }

    // 计划管理人 - 修改当前选中人员
    fnChangePeopel = id => {
        // * 将父级数组中的人员信息变更
        let ResData = this.props.info;
        ResData.company_user_id = id;
        for (let index = 0; index < this.props.allUserList.length; index++) {
            const element = this.props.allUserList[index];
            if( element.company_user_id === id ){
                ResData.company_user_name = element.company_user_name;
            }
        }
        this.props.dispatch({type:'equityPlanDetails/getModelChangeInfo', data: ResData});
    } 

    // 行权管理人  VIE已上市、港股
    fnChangePeopelCuid = id => {
        let ResData = this.props.info;
        ResData.exercise_admin_cuid = id;
        ResData.exercise_window_info.exercise_admin_cuid = id;
        for (let index = 0; index < this.props.allUserList.length; index++) {
            const element = this.props.allUserList[index];
            if( element.company_user_id === id ){
                ResData.exercise_window_info.name = element.company_user_name;
                ResData.exercise_window_info.uid = '0';
            }
        }
        this.props.dispatch({type:'equityPlanDetails/getModelChangeInfo', data: ResData});
    }

    // 计划文档 Radio change 事件
    fnChangeRadio = ( key, e) => {
        let newInfo = this.props.info.documentInfo[key].check = e.target.value
        this.props.dispatch({ type: 'equityPlanDetails/getModelChangeInfo', data: newInfo });
    };

    // 董事会决议通过日期
    fnBoardDatePicker = (date, dateString) => this.props.dispatch({ type: 'equityPlanDetails/getModelChangeInfo', data: { board_approval_date: dateString } });
    
    // 股东会决议通过日期
    fnShareDatePicker = (date, dateString) => this.props.dispatch({ type: 'equityPlanDetails/getModelChangeInfo', data: { shareholder_approval_date: dateString } });

    // 登记 - 计划文档 上传 onChonge 事件
    fnFileUploadChange = info => {
        let fileList = [...info.fileList];
        fileList = fileList.map(file => {
            if (file.response) {
                file.url = file.response.error_msg.file_url;
            }
            return file;
        });
        this.props.dispatch({
            type: 'equityPlanDetails/getModelChangeInfo', 
            data: {
                planDocumentInfo: fileList,
            }
        });
    };

    // 授权书 上传文档 onChange 事件
    fnFileUploadChangeBook = info => {
        let fileList = [...info.fileList];
        fileList = fileList.slice(-1);
        fileList = fileList.map(file => {
            if (file.response) {
                file.url = file.response.error_msg.file_url;
            }
            return file;
        });
        
        let newDocumentInfo = this.props.info.documentInfo
        newDocumentInfo[2].up_files = fileList;
        this.props.dispatch({
            type: 'equityPlanDetails/getModelChangeInfo', 
            data: {
                documentInfo: newDocumentInfo,
            }
        });
    }

    // 股东会决议 上传文档 onChange 事件
    fnFileUploadChangeShare = (key, info) => {
        let fileList = [...info.fileList];
        fileList = fileList.slice(-1);
        fileList = fileList.map(file => {
            if (file.response) {
                file.url = file.response.error_msg.file_url;
            }
            return file;
        });
        
        let newDocumentInfo = this.props.info.documentInfo
        newDocumentInfo[key].up_files = fileList;
        this.props.dispatch({
            type: 'equityPlanDetails/getModelChangeInfo', 
            data: {
                documentInfo: newDocumentInfo,
            }
        });
    }
    
    // 锚点事件
    fnTbsMenusChangeMod = async nav => {
        router.replace('/equityPlan/'+nav+this.props.history.location.search);
        await this.props.dispatch({type:'equityPlan/changeLoadState',data:true});
        await this.props.dispatch({type:'equityPlan/changeTbsMenusActive',data:nav})
    }

    // 修改备注
    fnEditNotes = e => {
        this.props.dispatch({ type: 'equityPlanDetails/getModelChangeInfo', data: { notes: e.target.value } })
    }

    // 删除
    showDeleteConfirm = () => {
        let _this = this;
        confirm({
            title: '您确定要删除本计划吗？',
            content: '请注意授予有效期权后，本计划将无法被删除，可以通过联系客服人员进行咨询',
            okText: '删除',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                _this.props.dispatch({type:'equityPlanDetails/getModelDeletePlan', data:_this.props.plan_id });
            }
        });
    }

    // 更新
    fnSubmit = () => {
        let info = this.props.info;
        let url = this.props.info.plan_type === '2' ? '/equity_plan/company/edit_equity_plan' : '/equity_plan/online/edit_ajax';
        let submitType = true;
        
        // 计划名称 
        if( info.plan_name === '' ){
            submitType = false;
            message.error('请填写计划名称');
        }

        // 计划管理人
        if( info.plan_type === '1' ){
            if( info.company_user_id === 0 
                || info.company_user_id === '0' 
                || info.company_user_id === ''
                || info.company_user_id === undefined
            ){
                submitType = false;
                message.error('请选择计划管理人');
            }
        }

        // 计划通过日期
        if( info.board_approval_date === '' || info.shareholder_approval_date === '' ){
            submitType = false;
            message.error('请选择计划通过日期');
        }

        // 激励计划文件
        if( info.plan_type === '2' && info.planDocumentInfo === '[]' ){
            submitType = false;
            message.error('请上传激励计划文件');
        }
        
        // 提交
        submitType && this.props.dispatch({
            type:'equityPlanDetails/getModelSaveDetails', 
            data:{
                url:url,
                info:info
            }
        });
    }
}
export default Index;