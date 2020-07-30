$(function(){
    var layer = layui.layer
    // 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    
    // 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    $('#btnChooseImage').on('click', function() {
        $('#file').click()
    })

    // 为文件选择框绑定事件
    $('#file').on('change',function(e){
        var filelist = e.target.files   //获取用户选择文件列表
        if(filelist.length === 0){
            return layer.msg('请选择照片！')
        }

        // 拿到用户选择的文件
        var file = e.target.files[0]
        // 将文件转化为路径
        var imgURL = URL.createObjectURL(file)
        // 重新初始化剪裁区域
        $image
        .cropper('destroy')   //销毁旧的剪裁区域
        .attr('src',imgURL)   //重新设置图片路径
        .cropper(options)     // 重新初始化剪裁区域

        $('#toUpload').on('click',function(){
            var dataURL = $image.cropper('getCroppedCanvas', {
            // 创建一个 Canvas 画布
            width: 100,
            height: 100
            }).toDataURL('image/png')


            $.ajax({
                method: 'POST',
                url: '/my/update/avatar',
                data: {
                    avatar: dataURL
                },
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('更换头像失败！')
                    }
                    layer.msg('更换头像成功！')
                    window.parent.getUserInfo()
                }
            })
        })

        
    })


    
})