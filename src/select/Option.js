import React, { Component, PropTypes } from 'react';

export default class Option extends Component {
    static defaultProps = {
        optionData: {},
        handleChange: null
    };
    static propTypes = {
        optionData: PropTypes.object.isRequired,
        handleChange: PropTypes.func
    };
    static timer = null;
    constructor (props, context) {
        super(props, context);
        this.state = {
            showSubOption: false
        };
    }
    toggleValue (value) {
        const state = this.state;
        state[value] = !state[value];
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.setState(state);
        }, 200);
    }
    handleChange (item, subItem, e) {
        if (typeof this.props.handleChange === 'function') {
            e.stopPropagation();
            const data = {};
            if (subItem.text) {
                data.text = subItem.text;
                data.value = [item.value, subItem.value].join(',');
            } else {
                data.text = item.text;
                data.value = item.value;
            }
            this.props.handleChange(data);
        }
    }
    render () {
        const { optionData } = this.props;
        const { showSubOption } = this.state;
        // 判断当前是否有子选项
        const hasSubOption = optionData.options && optionData.options.length;
        return (<li onClick={e => this.handleChange(optionData, '', e)} onMouseEnter={() => this.toggleValue('showSubOption')} onMouseLeave={() => this.toggleValue('showSubOption')}>
            {optionData.text}
            <span className={hasSubOption ? 'sub-arrow' : ''}><em /></span>
            {
                hasSubOption
                ? <ol className={showSubOption ? '' : ''}>
                    {optionData.options.map((item, index) => {
                        return (<li key={index} onClick={e => this.handleChange(optionData, item, e)}>
                            {item.text}
                        </li>);
                    })
                }
                </ol>
                : null
            }
        </li>);
    }
}

