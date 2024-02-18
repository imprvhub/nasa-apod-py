window.flatpickr("#datePicker", {
    minDate: "1995-06-16",
    onChange: function(selectedDates, dateStr, instance) {
        updateImage();
    }
});

function updateImage() {
    var selectedDate = document.getElementById("datePicker").value;
    var imageElement = document.getElementById("apodImage");
    var expandIcon = document.getElementById("expandIcon");
    var explanation = document.getElementById("explanation");
    var expandedExplanation = document.getElementById("expandedExplanation");

    fetch(`/update_image?date=${selectedDate}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.url.includes("youtube.com")) {
                var videoId = data.url.split('/').pop();
                var iframe = document.createElement("iframe");
                iframe.width = "600";
                iframe.height = "600";
                iframe.src = `https://www.youtube.com/embed/${videoId}?rel=0`;
                iframe.allowFullscreen = true;
                imageElement.innerHTML = '';
                imageElement.appendChild(iframe);
                expandIcon.style.display = "inline";
            } else {
                imageElement.src = data.url;
                imageElement.alt = data.title;
                expandIcon.style.display = "inline";
            }
            explanation.innerText = data.explanation;
            expandedExplanation.innerText = data.explanation; 
        })
        .catch(error => {
            console.error("Error al procesar la solicitud:", error);
            imageElement.src = "static/images/image_not_found.jpeg";
            imageElement.alt = "Not Found";
            expandIcon.style.display = "none";
            explanation.innerText = "";
            expandedExplanation.innerText = ""; 
        });
}

function changeDate(offset) {
    var datePicker = document.getElementById("datePicker");
    var selectedDate = new Date(datePicker.value);
    selectedDate.setDate(selectedDate.getDate() + offset);
    
    var year = selectedDate.getFullYear();
    var month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    var day = String(selectedDate.getDate()).padStart(2, '0');
    
    var newDate = `${year}-${month}-${day}`;
    datePicker.value = newDate;
    updateImage();
}


function expandImage() {
    var expandedContainer = document.getElementById("expandedImageContainer");
    var imageElement = document.getElementById("expandedImage");
    var expandedExplanation = document.getElementById("expandedExplanation");
    imageElement.src = document.getElementById("apodImage").src;
    imageElement.alt = document.getElementById("apodImage").alt;
    expandedExplanation.style.display = "block";
    expandedExplanation.style.overflowY = "auto";
    expandedContainer.style.display = "block";
}

function closeImage() {
    var expandedContainer = document.getElementById("expandedImageContainer");
    var expandedExplanation = document.getElementById("expandedExplanation");
    
    expandedContainer.style.display = "none";
}
