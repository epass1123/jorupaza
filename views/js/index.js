
      function checkLogin() {
            const adminId = document.querySelector("#id").value;
            const password = document.querySelector("#pw").value;
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
                    url: "http://localhost:60002/login/jorupaza",
                    method: "POST",
                    data: JSON.stringify(data),
                    contentType: "application/json",
                    complete:function (response) {
                        console.log(response)
                        if (response.status === 200) {
                            sessionStorage.setItem("adminId",adminId)
                            document.body.querySelector('.wrapper').style.opacity="0"
                            setTimeout(function() {
                                window.location.href="/views/html/main.html"
                            }, 1000); 
                        }
                        else{
                            alert("로그인실패")
                            return

                        }
                }
            });
        }       
    }
    const wrapper = document.body.querySelector(".wrapper")
    wrapper.addEventListener("transitionend",function(){
        wrapper.style.display="none"
        alert("성공")
    })

    
    $(document).ready(function () {
        $("#footer").load("footer.html");
    });