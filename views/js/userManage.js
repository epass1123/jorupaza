
$(document).ready(function() {
    $.ajax({
      url: "http://ceprj.gachon.ac.kr:60002/admin/user/selectAll",
      method: "GET",
      complete: function(response) {
        console.log(response);
        if (response.status === 200) {
          const dataArray=response.responseJSON.possible_match
          const table = document.querySelector('table');
          const tableBody = table.querySelector('tbody');
          tableBody.innerHTML = '';
          dataArray.forEach(item => {
              const row = document.createElement('tr');
              row.innerHTML = `
                  <td><input type="checkbox" name="CheckBox"></td>
                  <td>${item.userID}</td>
                  <td>${item.email}</td>
                  <td>${item.regiTime}</td>
              `;
              tableBody.appendChild(row);
          });
        } else {
            alert("불러오기 실패")
          return;
        }
      }
    });
  });

  function deleteUser(event){
			
    var rowD = new Array();
    var tdArr = new Array();

    var checkbox = $("input[name=CheckBox]:checked");
    
    checkbox.each(function(i) {
      var tr = checkbox.parent().parent().eq(i);
      var td = tr.children();
      
      rowD.push(tr.text());
      
      var userid = td.eq(1).text()    
      tdArr.push(userid); 
      console.log(tdArr)
    });    
  
    if (window.confirm("삭제하시겠습니까?")) {
      for(var i=0; i<tdArr.length; i++){
        var userid=tdArr[i]
        $.ajax({
          url: 'http://ceprj.gachon.ac.kr:60002/admin/user/' + userid,
          method: "DELETE",
            complete:function (response) {
              console.log(response)
              if (response.status === 200) {
              }
              else{
                alert("삭제 실패")
                return
              }
          }
        })
        window.location.reload()

      }
  } else {
     
      alert("삭제가 취소되었습니다.");
  }
  }


  function idSearch(){
    var searchText= document.querySelector("#crawlingInput").value;

    $.ajax({
      url: "http://ceprj.gachon.ac.kr:60002/admin/user/selectAll",
      method: "GET",
      complete: function(response) {
        console.log(response);
        if (response.status === 200) {
          const dataArray=response.responseJSON.possible_match
          const table = document.querySelector('table');
          const tableBody = table.querySelector('tbody');
          tableBody.innerHTML = '';
          dataArray.forEach(item => {
            const row = document.createElement('tr');
            if(item.userID.includes(searchText)){
              row.innerHTML = `
              <td><input type="checkbox" name="CheckBox"></td>
              <td>${item.userID}</td>
              <td>${item.email}</td>
              <td>${item.regiTime}</td>
              `;
              tableBody.appendChild(row);
            }
            if(searchText==""){
              row.innerHTML = `
              <td><input type="checkbox" name="CheckBox"></td>
              <td>${item.userID}</td>
              <td>${item.email}</td>
              <td>${item.regiTime}</td>
              `;
              tableBody.appendChild(row);
            }
              
             
          });
        } else {
            alert("불러오기 실패")
          return;
        }
      }
    });
  }

  function allCheck(){
    if($("#cbx_chkAll").is(":checked")){
      $("input[name=CheckBox]").prop("checked", true);
    }else {
      $("input[name=CheckBox]").prop("checked", false);
    }
  }