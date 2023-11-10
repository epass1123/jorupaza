
function checkLogin() {
    const adminId = document.querySelector("#exampleInputEmail1").value;
    const password = document.querySelector("#exampleInputPassword1").value;
    var data = {
    adminid: adminId,
    password: password
    };
    // fetch("http://ceprj.gachon.ac.kr:60002/manage/jorupaza", {
    //     method: "POST",
    //     body: JSON.stringify(data),
    // })
    if(adminId==""){
        alert("아이디를 입력해주세요")
        return
    }
    else if(password==""){
        alert("비밀번호를 입력해주세요")
        return
    }
    else{
        $.ajax({
            url: "http://ceprj.gachon.ac.kr:60002/admin/login",
            method: "POST",
            data: JSON.stringify(data),
            contentType: "application/json",
            complete:function (response) {
                console.log(response)
                if (response.status === 200) {
                    window.location.href="http://ceprj.gachon.ac.kr:60002/views/html/main.html"
                    alert("로그인")
                }
                else{
                    alert("로그인실패")
                    return

                }
        }
    });
}       
}




