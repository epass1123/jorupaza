
const outlineTable=document.getElementsByClassName("outlineWrapper")
const userSearchTable=document.getElementsByClassName("userSearchTable")
const ottSearchTable=document.getElementsByClassName("ottSearchTable")
const ottAddTable=document.getElementsByClassName("ottAddTable")
var keyword=outlineTable
function outlineClick(){
    keyword[0].style.display="none"
    keyword=outlineTable
    $(".right").load("outline.html");
    // $(".right").load("http://ceprj.gachon.ac.kr:60002/views/html/tap/outline.html");
}


function userSearchClick(){
    keyword[0].style.display="none"
    keyword=userSearchTable
    $(".right").load("userSearch.html");
    //$(".right").load("http://ceprj.gachon.ac.kr:60002/views/html/userSearch.html");

}

function ottSearchClick(){
    keyword[0].style.display="none"
    keyword=ottSearchTable
    $(".right").load("ottSearch.html");
    // $(".right").load("http://ceprj.gachon.ac.kr:60002/views/html/tap/ottSearch.html");

}


function ottAddClick(){
    keyword[0].style.display="none"
    keyword=ottAddTable
    
    $(".right").load("ottAdd.html");
    // $(".right").load("http://ceprj.gachon.ac.kr:60002/views/html/tap/ottAdd.html");

}

function logout(){
    
    $.ajax({
        url: "http://localhost:60002/logout",
        method: "GET",
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



$(document).ready(function () {
    $("#footer").load("footer.html");
});

$(document).ready(function () {
    $(".right").load("outline.html");
});

