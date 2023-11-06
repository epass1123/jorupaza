

function logout(){
    $.ajax({
        url: "http://ceprj.gachon.ac.kr:60002/admin/logout",
        method: "DELETE",
        complete:function (response) {
            console.log(response)
            if (response.status === 200) {
                alert("로그아웃 되었습니다.")
                window.location.href="/views/html/index.html"
            }
            else{
                alert("로그아웃실패")
                return
            }
    }
});
}

$(document).ready(function() {
    var CrawlError = document.querySelector("#CrawlError")
    var CrawlSuccess = document.querySelector("#CrawlSuccess")
    var contentsNum = document.querySelector("#contentsNum")


    $.ajax({
        url: "http://ceprj.gachon.ac.kr:60002/admin/monitor/date/6",
        method: "GET",
        complete:function (response) {
            console.log(response)
            if (response.status === 200) {
            }
            else{
                return
            }
    }
});

    $.ajax({
        url: "http://ceprj.gachon.ac.kr:60002/admin/dashboard",
        method: "GET",
        complete:function (response) {
            if (response.status === 200) {
                CrawlError.textContent=response.responseJSON.CrawlError
                CrawlSuccess.textContent=response.responseJSON.CrawlSuccess
                contentsNum.textContent=response.responseJSON.contentsNum
            }
            else{
                return
            }
    }
});
})
