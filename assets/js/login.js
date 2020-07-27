$(function(){
    $('#link_reg').on('click',function(){
        $('.login-box').hide();
        $('.reg-box').show();
    })
    $('#link_login').on('click',function(){
        $('.login-box').show();
        $('.reg-box').hide();
    })

    // 自定义校验规则
    var form = layui.form
    var layer = layui.layer

    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
        ] ,
        repwd:function(value){
            var pwd = $('.reg-box [name = password]').val()
            if(pwd != value){
                return '两次密码不一致'
            }
        }
    })

    // 监测注册功能
    $('#form_reg').on('submit',function(e){
        e.preventDefault();


        var data = {
            username:$('#form_reg [name = username]').val(),
            password:$('#form_reg [name = password]').val()
        }
        $.post('/api/reguser',data,function(res){
            if(res.status != 0){
                return layer.msg(res.message)
            }
            layer.msg('注册成功，请登录！');

            $('#link_login').click();
        })
    })


    // 监听登录提交功能
    $('#form_login').submit(function(e){
        e.preventDefault()

        $.ajax({
            url:'/api/login',
            method:'POST',
            data:$(this).serialize(),
            success:function(res){
                if(res.status != 0){
                    return layer.msg('登录失败！')
                }
                layer.msg('登录成功！')

                // 将登录成功得到的token字符串，保存到localstorage中
                localStorage.setItem('token',res.token)

                location.href = '/index.html'
            }
        })
    })

})