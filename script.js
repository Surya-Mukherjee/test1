const input = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const dropArea = document.getElementById("dropArea");
const resultDiv = document.getElementById("result");
const uploadBtn = document.querySelector(".btn"); // your button
const toggle= document.querySelector("#toggle");
const img=document.querySelector("#icon");
const body=document.body;
toggle.addEventListener("click",(e)=>{
  let  ismoved= toggle.classList.toggle('move');
 
    if(ismoved){
          img.src='moon.png';
          let isDark=body.classList.add('Dark_mode');
          uploadBtn.classList.add('uploadBtn');

          
    }else{
          img.src='./static/sun.png';
          body.classList.remove('Dark_mode');
          uploadBtn.classList.remove('uploadBtn');
    }
  
})

dropArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropArea.style.borderColor = "#6294bcff"; // highlight
});

dropArea.addEventListener("dragleave", (e) => {
    dropArea.style.borderColor = "#241a1aff"; // back to normal
});


let selectedFile = null; // store the chosen file

// --- Store file when selected ---
input.addEventListener("change", (e) => {
    selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Preview only
    const reader = new FileReader();
    document.querySelector("#result-tab tbody").innerHTML = "";
    resultDiv.style.display = "none";
    reader.onload = (e) => {
        preview.src = e.target.result;
        preview.style.display = "block";
    };
    reader.readAsDataURL(selectedFile);
});

// --- Store file when dropped ---
dropArea.addEventListener("drop", (e) => {
    e.preventDefault();
    selectedFile = e.dataTransfer.files[0];
    if (!selectedFile) return;
      document.querySelector("#result-tab tbody").innerHTML = "";
    resultDiv.style.display = "none";
    // Preview only
    const reader = new FileReader();
    reader.onload = (e) => {
        preview.src = e.target.result;
        preview.style.display = "block";
    };
    reader.readAsDataURL(selectedFile);
    
});

// --- Upload & Predict button ---
uploadBtn.addEventListener("click", async (e) => {
    e.preventDefault(); // prevent form submission if inside <form>
   
    console.log(e);
    console.log("teri maki chut");
    if (!selectedFile) {
        alert("Please select a file first!");
        return;
    }
     

    const formData = new FormData();
    formData.append("file", selectedFile);
    console.log("hi");

    try {
        const response = await fetch("http://127.0.0.1:5000/predict", {
            method: "POST",
            body: formData
        });
        const data = await response.json();
            console.log(data);
            console.log("Backend response:", data);
            console.log("Type of data:", typeof data);

        if (data.status === "valid") {

    const tbody=document.querySelector("#result-tab tbody");
    const table=document.querySelector("#result-tab");
    tbody.innerHTML=" ";
  
    data.predictions.forEach(pred => {
        let tr=document.createElement('tr');
        let td1=document.createElement('td')
        let td2=document.createElement('td');
        let td3=document.createElement('td');
        td1.innerHTML=`${pred.breed}`;
        td2.innerHTML=`(${(pred.prob*100).toFixed(2)}%)`;
        td3.innerHTML=`${pred.info}`;
        tr.appendChild(td1);
          tr.appendChild(td2);
            tr.appendChild(td3);
       
            tbody.appendChild(tr);
    });
    table.style.display="block";
    result.style.display="block";
      

} else {
    result.style.display="block";
    resultDiv.innerHTML = "<p style='color:red;'>Prediction invalid.</p>";
    
}


    } catch (err) {
        result.style.display="block";
        console.error(err);
        resultDiv.innerHTML = "<p style='color:red;'>Something went wrong.</p>";
     
    }
});
