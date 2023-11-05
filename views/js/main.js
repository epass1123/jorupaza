

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

