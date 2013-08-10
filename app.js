var request = require('request');
var j = request.jar();
j.add(request.cookie('testcookie=yes'));
j.add(request.cookie('iPlanetDirectoryPro=AQIC5wM2LY4SfcxxTcttwtK6w05N5fgBReKzg5fRsQs+vx8=@AAJTSQACMDE=#'));
j.add(request.cookie('Hm_lvt_d5a76608e07e4903e91fe94d34b3cc0d=1375448500,1375863425,1376097088'));
j.add(request.cookie('Hm_lpvt_d5a76608e07e4903e91fe94d34b3cc0d=1376097088'));
j.add(request.cookie('JSESSIONID=abcXGVEDGxUGL91VdfNbu'));
j.add(request.cookie('SHS_IsLoacal=1'));

request = request.defaults({jar:j});

var Iconv = require('iconv').Iconv;
var iconv = new Iconv('GBK', 'UTF-8//TRANSLIT//IGNORE');
var $ = require('jquery');

request.post('http://aqjy.tongji.edu.cn/shs/theme.do?action=goToListThemeForStudy&', {form: {pageMethod:'page', pageNum:'1'}, encoding:null}, function(error,response,body)
{

    console.log(iconv.convert(body).toString());

});