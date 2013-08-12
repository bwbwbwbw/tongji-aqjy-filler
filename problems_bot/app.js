var request = require('request');
var j = request.jar();

var cookie = '////***** FILL YOUR COOKIES HERE *****////';

cookie.split(';').forEach(function(c)
{
    j.add(request.cookie(c.trim()));
});

request = request.defaults({jar:j});

var Iconv = require('iconv').Iconv;
var iconv = new Iconv('GBK', 'UTF-8//TRANSLIT//IGNORE');
var $ = require('jquery');

var problems = [];

function parseProblemAns($p, $opt, $ans)
{
    var p = 
    {

        title:  $p.find('td').eq(1).text().trim(),
        type:   $p.find('td').eq(3).text().trim()

    }

    var opt = [];

    if ($opt != null)
    {

        $opt.find('.TableTRA').each(function()
        {
            opt.push($(this).text().trim().replace(/\s+/g,' '))
        });

    }

    var ans = $ans.find('font').eq(0).text().trim().replace(/\s+/g,' ');

    if (p.type == '判断')
    {
        ans = {'对': 'A', '错': 'B'}[ans];
    }
    else if (p.type == '多选')
    {
        ans = ans.split(' ');
    }
    else if (p.type == '单选')
    {
        ans = ans;
    }
    else
    {
        console.log('Invalid problem type: title=', p.title);
    }

    problems.push(
    {
        p: p,
        opt: opt,
        ans: ans
    });
}

function parsePage(page, okCallback)
{
    request.post('http://aqjy.tongji.edu.cn/shs/theme.do?action=goToListThemeForStudy&', {form: {pageMethod: 'pager', pageNum: page}, encoding: null}, function(error,response,body)
    {

        body = iconv.convert(body).toString();

        var begin = body.toString().indexOf('<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">');
        body = body.substr(begin);

        var $page = $(body);

        $page.find('.TableTitle').each(function()
        {

            var $p = $(this);
            var $sub = $p.next().children('tr');

            if ($sub.length == 1)
            {
                //判断题
                var $options = null;
                var $ans = $($sub[0]);
            }
            else
            {
                var $options = $($sub[0]);
                var $ans = $($sub[1]);
            }

            parseProblemAns($p, $options, $ans);

        });

        okCallback();
    });
}

var currentPage = 0;

function next()
{
    currentPage++;

    if (currentPage == 91)
    {
        onEnd();
        return;
    }

    console.log('Parsing page ', currentPage);
    parsePage(currentPage, next);
}


function onEnd()
{
    var fs = require('fs');
    fs.writeFileSync('data.json', JSON.stringify(problems));

    console.log('OK');
}

next();