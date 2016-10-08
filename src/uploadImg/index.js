var React = require('react');
var ReactDOM = require('react-dom');
// var Notification = require('source_path/notification');

// 多传接口地址
var UPLOAD_URL = window.location.href.indexOf("meilishuo.com") > -1 ? "http://media.meilishuo.com/image/put?appKey=11m" : "http://media.xiaodian.com/image/put?appKey=11m";

// 获取回调方法名（单传）
var getCallBackFuncName = function(){
    var prefix = 'upload_callback_';
    var rand = Math.floor(Math.random()*99+1);
    return prefix + rand;
};

// 多传
var multipleUpload = function(event, self) {
    var target = event.target;
    var files = target.files;
    uploadImgs(files, function(resultArr, i){
        if(resultArr && resultArr.length){
            self.props.onFinish( resultArr );
        }else{
            self.props.onFailed('上传失败',resultArr);
        }
        target.value = '';
    }, self.props.uploadUrl );
};

// 单传
var singleUpload = function(event, self){
    ReactDOM.findDOMNode(self).submit();
    window[self.props.callbackFuncName] = function( res ) {
        if( res && res.status && res.status.code == 1001 || res.status.code == 200 ) {
            // 完成回调
            self.props.onFinish( res );
        } else {
            self.props.onFailed( res );
        }
    };
    event.target.value = '';
};

/**
 * 批量上传图片
 * @param  {Array}   files
 * @param  {Function} callback
 * @param  {String} uploadUrl 自定义上传路径
 */
var uploadImgs = function(files, callback , uploadUrl) {

    var self = this,
        _url = uploadUrl || UPLOAD_URL,
        i = 0,
        length = files.length - 1,
        resultArr = [];

    // 这里是进度条 哇哈哈！HTML5的接口 靠谱！可以考虑 做 整体的 %分比 用Length + 当前 % 然后算总数 二期再搞。。。
    var _uploadProgress = function(ev) {

        //判断a有没有超出范围
        if (i < length && i != length) {

            //此处的evt就是文件上传的所有信息。

            //evt.lengthComputable,文件是否是空
            if (ev.lengthComputable) {
                //evt.loaded：文件上传的大小   evt.total：文件总的大小
                var percentComplete = Math.round((ev.loaded) * 100 / ev.total);

                //如果上传的结果是100时才让加载下一个文件。如果不够100会继续上传原来的文档。
                if (percentComplete == 100) {
                    i++;
                    //提交下一个文档
                    _submit(files[i]);
                }
            }
        }
    };

    // 提交
    var _submit = function(files){
        var fd = new FormData();
        fd.append('image', files);

        // 创建XMLHttpRequest 提交对象
        var xhr = new XMLHttpRequest();
        //xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

        // 监听的是上传进度条
        xhr.upload.addEventListener("progress", _uploadProgress, false);

        // XHR提交成功后的返回
        xhr.addEventListener("load", function(e){
            // XHR 的 LOAD 返回事件 具体结构 建议CONSOLE E 的结构
            var result = JSON.parse(e.target.responseText);

            resultArr.push(result);

            // 集齐全部图片返回值之后 执行回调
            if(resultArr.length == length + 1) {
                // CALLBACK 优先 传递值第二 默认值第三
                if(callback){
                    callback(resultArr,i);
                }
            }
        }, false);

        //跨域传cookie的时候有用,added by yingu 2016.3.25
        xhr.withCredentials = true;

        xhr.open("POST", _url, true);
        xhr.setRequestHeader('Access-Control-Allow-Headers','*');//chrome升级到 52之后cors校验加强了
        xhr.send(fd);
    };

    _submit(files[i]);
};

var UploadImg = React.createClass({
    propTypes: {

        //上传地址
        // uploadUrl: React.PropTypes.string,

        // 默认批量上传
        isMultiple: React.PropTypes.bool,

        // 上传开始
        onStart: React.PropTypes.func,

        // 上传完成
        onFinish: React.PropTypes.func,

        // 上传失败
        onFailed: React.PropTypes.func
    },
    getDefaultProps: function () {
        return {
            callbackFuncName: getCallBackFuncName(),
            isMultiple: false,
            onStart: function() {
                return true;
            },
            onFinish: function () {
                return true;
            },
            onFailed: function() {
                return true;
            }
        };
    },
    handleChange: function(e) {
        // 对于ie9以下的浏览器
        if(!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(e.target.value) ){
            e.target.value = '';
            // Notification.open({message: '不支持此种格式的图片'});
            console.error('不支持此种格式的图片');
            return
        }
        // 开始回调
        var me = this,
            props = me.props,
            beforeStart = props.beforeStart;  //上传前的校验函数,内部可能是异步也可能是同步

        var uploadHandler = function (e) {  // 判断是否支持多图上传
            window.localStorage && window.WebSocket ? multipleUpload(e, this) : singleUpload(e, this);
        };

        var isPromise = function (func) {  //是否是promise
            return func.then && (typeof func.then === 'function');
        };

        if (beforeStart) {
            var val = beforeStart(e);
            if (val && isPromise(val)) {  //如果有返回值且返回值为promise则执行异步回调成功后上传
                e.persist();  //保持event对象，防止setState时React recycles events objects将event的所有属性全部置为null
                val.then(function() {  //需要位置e在内存中
                    me.props.onStart(e);
                    uploadHandler.apply(me, [e]);
                });
            } else if (val === true) {  //校验结果返回false
                me.props.onStart(e);
                uploadHandler.apply(me, [e]);
            }
        } else {
            me.props.onStart(e);
            uploadHandler.apply(me, [e]);
        }
    },
    render: function() {
        // this.props.uploadUrl 自定义上传接口
        return (
            <form action={ UPLOAD_URL } method="post" encType="multipart/form-data" target="J_UploadImageFrame">
                {this.props.isMultiple ? <input type="file" name="image" className="file" onChange={this.handleChange} multiple accept="image/png,image/jpg,image/jpeg,image/gif" /> : <input type="file" name="image" className="file" onChange={this.handleChange} accept="image/png,image/jpg,image/jpeg,image/gif" />}
                <input type="hidden" value={this.props.callbackFuncName} name="callback" />
            </form>
        );
    }
});

module.exports = UploadImg;