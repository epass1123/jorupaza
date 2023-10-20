var graphImage = document.querySelector(".graphImage")

function changeImage(e) {
    if(e==1){
        graphImage.src = "/views/img/graph2.jpg";
        graphImage.alt = "1"; 
    }
    else if(e==2){
        graphImage.src = "/views/img/graph1.jpg";
        graphImage.alt = "3"; 
    }
    else if(e==3){
        graphImage.src = "/views/img/graph3.jpg";
        graphImage.alt = "3"; 
    }
    
}