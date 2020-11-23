$(function () {
  //存储格式： var todolist=[{title:'xxxx',done:false},{,},...]
  //每次打开渲染页面
  load();
  //输入框回车事件
  $("#title").on("keydown", function (event) {
    //判断是不是13键（回车键）
    if (event.keyCode === 13) {
      //判断是否为空
      if ($(this).val()) {
        //获得本地数据
        var local = getData();
        //给数组追加一条数据
        local.push({ title: $(this).val(), done: false });
        //更新本地数据
        setData(local);
        //渲染页面
        load();
        //清空输入框
        $("#title").val("");
      } else {
        alert("输入内容不能为空！");
      }
    }
  });

  //获得本地数据函数
  function getData() {
    var data = localStorage.getItem("todolist");
    if (data !== null) {
      //本地存储的localStorage是字符串形式保存，需要转化为对象数组返回 使用JOSN.parse()将字符串转数组
      return JSON.parse(data);
    } else {
      //如果没有数据则返回空数组
      return [];
    }
  }

  //修改本地数据函数
  function setData(local) {
    //存到localStorage的是字符串，需要用JOSN.stringify将数组转为字符串
    var dataString = JSON.stringify(local);
    localStorage.setItem("todolist", dataString);
  }

  //渲染函数，获取数据进行渲染页面
  function load() {
    //遍历之前先清空页面重新加载
    $("ul").empty();
    var todocount = 0;
    $("ol").empty();
    var local = getData();
    var donecount = 0;
    //遍历数据
    $.each(local, function (i, n) {
      if (n.done) {
        donecount++;
        //已完成事件ol添加li ，给a添加索引，给p添加内容
        $("ol").prepend(
          "<li><input type='checkbox' checked='checked'><p>" +
            n.title +
            "</p> <a href='javascript:;' class='delete' index=" +
            i +
            "></a></li>"
        );
      } else {
        todocount++;
        //未完成事件ul添加li ，给a添加索引，给p添加内容
        $("ul").prepend(
          "<li><input type='checkbox'><p>" +
            n.title +
            "</p> <a href='javascript:;' class='delete' index=" +
            i +
            "></a></li>"
        );
      }
    });
    //修改数量
    $(".todocount").text(todocount);
    $(".donecount").text(donecount);
  }

  //删除函数，删除本地数据，再次渲染
  $("ul ,ol").on("click", "a", function () {
    //得到该a的自定义索引
    var index = $(this).attr("index");
    //获得本地数据
    var data = getData();
    //删除该索引的数据,使用splice函数 splice(删除开始的位置，长度)
    data.splice(index, 1);
    //保存数据
    setData(data);
    //渲染页面
    load();
  });

  //已完成/未完成事件切换[监听勾选框]
  $("ul , ol").on("click", "input", function () {
    //获得本地数据
    var data = getData();
    //获得对象属性
    //获得索引：获得兄弟a的索引，可以一起使用，因为他们在一起
    var index = $(this).siblings("a").attr("index");
    //修改数据中的done,勾选框的checked值为true/false
    data[index].done = $(this).prop("checked");
    //保存数据
    setData(data);
    //渲染
    load();
  });

  //清空页面事件
  $(".clear").on("click", function () {
    localStorage.removeItem("todolist");
    load();
  });
});
