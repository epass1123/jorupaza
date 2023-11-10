const itemsPerPage = 10; // 한 페이지당 표시할 항목 수
  let currentPage = 1; // 현재 페이지
  let dataArray; // 전체 데이터 배열

  function displayPage(dataArray) {
    const table = document.querySelector('table');
    const tableBody = table.querySelector('tbody');
    tableBody.innerHTML = '';

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = dataArray.slice(startIndex, endIndex);

    currentData.forEach(item => {

      const row = document.createElement('tr');
      row.innerHTML = `
      <td><input type="checkbox" name="CheckBox"></td>
      <td>${item.userID}</td>
      <td>${item.email}</td>
      <td>${item.regiTime}</td>
      `;
      tableBody.appendChild(row);
    });
  }


  function createPagination(dataArray) {
    const totalPages = Math.ceil(dataArray.length / itemsPerPage);
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
      const pageButton = document.createElement('button');
      pageButton.classList.add('page-item', 'page-link'); // 클래스 추가

      pageButton.innerText = i;
      pageButton.addEventListener('click', () => {
        currentPage = i;
        displayPage(dataArray);
        createPagination(dataArray);
      });

      pagination.appendChild(pageButton);
    }
  }


$(document).ready(function() {
    $.ajax({
      url: "http://ceprj.gachon.ac.kr:60002/admin/user/selectAll",
      method: "GET",
      complete: function(response) {
        console.log(response);
        if (response.status === 200) {
          dataArray=response.responseJSON.possible_match
          displayPage(dataArray);
        createPagination(dataArray);
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
          dataArray=response.responseJSON.possible_match
          displayPage(dataArray);
        createPagination(dataArray);
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