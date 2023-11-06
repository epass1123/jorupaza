
function dataDownload(){
  var image = document.querySelector(".loader");
    image.style.display = "block";
    $.ajax({
        url: "http://ceprj.gachon.ac.kr:60002/admin/mldata",
        method: "GET",
        complete: function(response) {
          console.log(response);
          if (response.status === 200) {
            alert("완료")
            image.style.display = "none";
          }
          else{
            alert("실패")
            image.style.display = "none";

          }
        }
      });
}

function learningRequest(){
  var image = document.querySelector(".loader");
    image.style.display = "block";
    $.ajax({
        url: "http://ceprj.gachon.ac.kr:60002/admin/ai",
        method: "GET",
        complete: function(response) {
          console.log(response);
          if (response.status === 200) {
            alert("시작")
            image.style.display = "none";
          }
          else{
            alert("실패")
            image.style.display = "none";

          }
        }
      });
}

function dataShare(){
  var image = document.querySelector(".loader");
    image.style.display = "block";
    $.ajax({
        url: "http://ceprj.gachon.ac.kr:60002/admin/reccontent",
        method: "GET",
        complete: function(response) {
          console.log(response);
          if (response.status === 200) {
            alert("시작")
            image.style.display = "none";
          }
          else{
            alert("실패")
            image.style.display = "none";

          }
        }
      });
}

function learningStop(){
  var image = document.querySelector(".loader");
    image.style.display = "block";
    $.ajax({
        url: "http://ceprj.gachon.ac.kr:60002/admin/ai",
        method: "DELETE",
        complete: function(response) {
          console.log(response);
          if (response.status === 200) {
            alert("중지")
            image.style.display = "none";
          }
          else{
            alert("실패")
            image.style.display = "none";

          }
        }
      });
}

function shareStop(){
  var image = document.querySelector(".loader");
    image.style.display = "block";
    $.ajax({
        url: "http://ceprj.gachon.ac.kr:60002/admin/reccontent",
        method: "DELETE",
        complete: function(response) {
          console.log(response);
          if (response.status === 200) {
            alert("중지")
            image.style.display = "none";
          }
          else{
            alert("실패")
            image.style.display = "none";

          }
        }
      });
}