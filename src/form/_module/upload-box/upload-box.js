import React, { Component, PropTypes } from 'react';
import uploadImgBox from './upload/uploadImgBox';

export default class UploadBox extends Component {
    static defaultProps = {
        label: '',
        defaultValue: {},
        className: '',
        disabled: false,
        style: {},
        error: false,
        errorMsg: '',
        required: false,
        subInfo: '',
        form: ''
    };

    static propTypes = {
        label: PropTypes.string,
        defaultValue: PropTypes.object,
        className: PropTypes.string,
        disabled: PropTypes.bool,
        style: PropTypes.object,
        name: PropTypes.string,
        error: PropTypes.bool,
        errorMsg: PropTypes.string,
        required: PropTypes.bool,
        subInfo: PropTypes.string,
        form: PropTypes.string
    };

    // 对外暴露获取表单数据的方法
    static getData (form) {
        return AddressCom.getData(form)
    }

    // 对外暴露重置表单的方法
    static resetData (form) {
        AddressCom.resetData(form);
    }

    // 对外暴露清空表单的方法
    static clearData (form) {
        AddressCom.clearData(form);
    }

    constructor (props) {
        super(props);
        this.state = {
            error: props.error,
            errorMsg: props.errorMsg,
            address: props.defaultValue
        };

        UploadBox.instance = this;
    }

    addressChange (e) {
        const province = e.province || {};
        const city = e.city || {};
        const area = e.area || {};
        const required = this.props.required;

        if (!province.name && required) {
            this.setState({
                error: true,
                errorMsg: "省不可为空"
            })
            return;
        }

        if (!city.name && required) {
            this.setState({
                error: true,
                errorMsg: "市不可为空"
            })
            return;
        }

        if (!area.name && required){
            this.setState({
                error: true,
                errorMsg: "区不可为空"
            })
            return;
        }

        this.setState({
            error: false
        })
    }

    render () {
        const {
            label,
            text,
            defaultValue,
            className,
            disabled,
            style,
            name,
            required ,
            subInfo,
            form
        } = this.props;

        const {
            error,
            errorMsg
        } = this.state;

        return (
            <div className='mc-module-field'>
                <div className={`mc-field-group clearfix ${className || ''} ${error ? 'mc-field-invaild' : ''}`}>
                    {/* 标题 */}
                    {label || text ?
                        <div className='mc-field-label'>
                            <label htmlFor={name}>
                                { required ? <span className='require'>*</span> : ''}
                                {label || text}
                            </label>
                        </div>
                        : null
                    }

                    {/* 表单 */}
                    <div className='mc-field-body'>
                        <AddressCom
                            defaultProvince={defaultValue.province}
                            defaultCity={defaultValue.city}
                            defaultArea={defaultValue.area}
                            onChange={(e) => this.addressChange(e)}
                            style={style}
                            form={form}
                            provinceDisabled={disabled.provice}
                            cityDisabled={disabled.city}
                            areaDisabled={disabled.area}
                            name={name}
                        />

                        {/* 校验错误提示 */}
                        {errorMsg ?
                            <div className='mc-field-errorMsg'>
                                <div className='mc-field-error-arrow'>
                                    <span className='mc-field-arrow-color' />
                                    <span className='mc-field-arrow-border' />
                                    <span className='mc-field-arrow' />
                                </div>
                                <p className='mc-field-errormsg'>{errorMsg}</p>
                            </div>
                            : null
                        }
                    </div>

                    {/* 子标题 */}
                    <div className='mc-field-subInfo'>
                        <label htmlFor={name}> {subInfo} </label>
                    </div>
                </div>
            </div>
        );
    }
}
