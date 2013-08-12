chrome.tabs.onUpdated.addListener(function(id, info, tab){
    if (tab.url.indexOf('http://aqjy.tongji.edu.cn/') === 0)
    {
        chrome.pageAction.show(id);
    }
});