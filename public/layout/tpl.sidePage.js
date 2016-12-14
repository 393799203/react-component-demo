import React, { Component } from 'react';
import menuData from './menu';
import HeadNav from './headNav';

const OriginMenuData = menuData;

export default class LayoutView extends Component {
    constructor () {
        super();
        this.state = {
            keywords: '',
            menuData: menuData,
            activeUrl: window.location.hash.slice(0, window.location.hash.indexOf('?'))
        };
    }
    componentDidMount () {
        
    }
    activeMenu (item) {
        this.setState({ activeUrl: item.link });
    }
    filterData (e) {
        const filterKey = e.target.value;
        const resultData = [];
        OriginMenuData.map((item) => {
            if (item.title.toLowerCase().indexOf(filterKey) > -1) {
                resultData.push(item);
            }
        });
        this.setState({
            keywords: filterKey,
            menuData: resultData
        });
    }
    render () {
        var { menuData, activeUrl, keywords } = this.state;
        return (
            <div className='app-header-fixed app-aside-fixed'>
                <HeadNav isHome={false} />
                <div>
                    <div className='app-aside bg-light'>
                        <div className='aside-wrap' style={{overflow: 'scroll', paddingBottom: '40px'}}>
                            <div className='input-group wrapper'>
                                <input
                                    value={keywords} 
                                    onChange={(e) => this.filterData(e)}
                                    type='text' 
                                    className='form-control bg-white-only no-border padder ng-pristine ng-valid ng-touched' 
                                    placeholder='搜索'/>
                                <span className='input-group-btn'>
                                    <button type='submit' className='btn bg-white-only'>
                                        <i className='fa fa-search'></i>
                                    </button>
                                </span>
                            </div>
                            {   
                                menuData.length == 0 ? 
                                <div className='wrapper text-center'>
                                    <p>还没有这个组件哦～</p>
                                    <p>
                                        <a className='btn btn-sm btn-danger' href='http://gitlab.mogujie.org/Aveng/meili-base-merchant-component' target='_blank'>
                                            我要贡献一个
                                        </a>
                                    </p>
                                </div> 
                                : null
                            }
                            <ul className='nav' style={{background: '#edf1f2'}}>
                                {
                                    menuData.map( (item, index) => {
                                        return <li 
                                            className={activeUrl === item.link ? 'active' : ''}
                                            key={index} 
                                            onClick={(e) => this.activeMenu(item)}>
                                            <a href={item.link}>{item.title}</a>
                                        </li>
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                    <div className='app-content'>
                        {this.props.children}
                    </div>
                </div>
            </div>
        )
    }
}