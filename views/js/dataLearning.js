
function dataDownload(){
  var image = document.querySelector(".loader");
    image.style.display = "block";
    $.ajax({
        url: "http://ceprj.gachon.ac.kr:60002/admin/mldata",
        method: "GET",
        complete: function(response) {
          console.log(response);
          if (response.status === 200) {
            alert("성공")
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
            alert("성공")
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
            alert("성공")
            image.style.display = "none";
          }
          else{
            alert("실패")
            image.style.display = "none";

          }
        }
      });
}