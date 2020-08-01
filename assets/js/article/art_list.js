$(function(){
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage

    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }

    initTable()
    initCate()

     // 定义美化时间格式的过滤器
     template.defaults.imports.dataFormat = function(date){
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth())
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + '   ' + hh +':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n){
        return n > 9 ? n : '0' + n
    }


    // 实现筛选功能
    $('#form-search').on('submit',function(e){
        e.preventDefault()
        var  cate_id = $('[name=cate_id]').val()
        var  state = $('[name=state]').val()

        q.cate_id = cate_id
        q.state = state
        // 根据最新数据的筛选，重新渲染表格的数据
        initTable()
    })


    

    // 获取文章列表数据的方法
    function initTable(){
        $.ajax({
            method:'GET',
            url:'/my/article/list',
            data:q,
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('获取文章列表失败！')
                }
                var htmlStr = template('tpl-table',res)
                $('tbody').html(htmlStr)

                // 调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }
    
    //初始化文章分类的方法
    function initCate(){
        $.ajax({
            method:'GET',
            url:'/my/article/cates',
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('获取分类数据失败！')
                }
                layer.msg('获取分类数据成功！')
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate',res)
                $('[name=cate_id]').html(htmlStr)

                // 通过layui重新渲染表单区域的ui结构
                form.render()
            }
        })
    }

    // 定义渲染分页的方法，接收一个总数量的参数
    function renderPage(total){
        // console.log(total);
        laypage.render({
            elem: 'pageBox',   //分页容器的id
            count: total, //数据总数，从服务端得到
            limit: q.pagesize,  // 每页显示几条数据
            curr: q.pagenum,  // 设置默认被选中的分页
            layout: ['count','limit','prev','next','skip'],
            limits:[2,3,5,10],   // 每页展示多少条
            jump: function(obj, first){
                //分页发生切换的时候，触发 jump 回调
                console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                //   console.log(obj.limit); //得到每页显示的条数/
                q.pagenum = obj.curr

                q.pagesize = obj.limit
              
              //首次不执行
              if(!first){
                //do something
                initTable()
              }
            }
        });
    }

    // 为删除按钮绑定点击事件 
    $('tbody').on('click','.btn-delete',function(){
        var id = $(this).attr('data-id')
        var len = $('.btn-delete').length

        layer.confirm('确认删除嘛?', {icon: 3, title:'提示'}, function(index){
            //do something
            $.ajax({
                method:'GET',
                url:'/my/article/delete/' + id,
                success:function(res){
                    if(res.status !== 0){
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                    if(len === 1){
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1 
                    }
                    initTable()
                }
            })
            layer.close(index);
        });  
    })
   
})