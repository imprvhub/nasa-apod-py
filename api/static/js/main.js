window.onload = function() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('image_url')) {
        initScript();
    }

    var today = new Date().toISOString().split('T')[0];
    document.getElementById("datePicker").setAttribute("max", today);

    window.flatpickr("#datePicker", {
        minDate: "1995-06-16",
        maxDate: today,
        onChange: function(selectedDates, dateStr, instance) {
            updateImage();
        }
    });

    initScript();
};

function initScript() {
    const params = new URLSearchParams(window.location.search);
    const imageUrl = params.get('image_url');
    const title = params.get('title');
    const description = params.get('description');

    if (imageUrl) {
        const imageElement = document.getElementById('apodImage');
        if (imageElement) {
            imageElement.setAttribute('src', imageUrl);
        }
    }

    if (title) {
        const titleElement = document.querySelector('h2');
        if (titleElement) {
            titleElement.textContent = title;
        }
    }

    if (description) {
        const descriptionElement = document.querySelector('p');
        if (descriptionElement) {
            descriptionElement.textContent = description;
        }
    }
}

function updateImage() {
    var selectedDate = document.getElementById("datePicker").value;
    var imageElement = document.getElementById("apodImage");
    var titleElement = document.getElementById("title");
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
                iframe.width = "400";
                iframe.height = "300";
                iframe.src = `https://www.youtube.com/embed/${videoId}?rel=0`;
                iframe.allowFullscreen = true;
        
                // Reemplazar imagen con iframe
                imageElement.parentNode.replaceChild(iframe, imageElement);
                
                // Mostrar elementos de título y explicación cuando se carga un video de YouTube
                if (titleElement !== null) {
                    titleElement.style.display = "block";
                }
                if (explanation !== null) {
                    explanation.style.display = "block";
                }
                // Mostrar o ocultar el icono de expansión según sea necesario
                if (expandIcon !== null) {
                    expandIcon.style.display = "inline";
                }
            } else {
                imageElement.src = data.url;
                imageElement.alt = data.title;
        
                // Actualizar título y explicación solo cuando se carga una imagen
                if (titleElement !== null && data.title) {
                    titleElement.innerText = data.title;
                    titleElement.style.display = "block"; // Asegurarse de que estén visibles
                }
                if (explanation !== null && data.explanation) {
                    explanation.innerText = data.explanation;
                    explanation.style.display = "block"; // Asegurarse de que estén visibles
                }
                if (expandedExplanation !== null && data.explanation) {
                    expandedExplanation.innerText = data.explanation;
                }
                // Mostrar o ocultar el icono de expansión según sea necesario
                if (expandIcon !== null) {
                    expandIcon.style.display = "block";
                }
            }
        })
        

        .catch(error => {
            console.error("Error al procesar la solicitud:", error);
            // Manejo de errores
            imageElement.src = "static/images/image_not_found.jpeg";
            imageElement.alt = "Not Found";
            if (titleElement !== null) {
                titleElement.innerText = "";
            }
            // Ocultar el icono de expansión
            if (expandIcon !== null) {
                expandIcon.style.display = "none";
            }
            if (explanation !== null) {
                explanation.innerText = "";
            }
            if (expandedExplanation !== null) {
                expandedExplanation.innerText = "";
            }
        });
}


function changeDate(offset) {
    var datePicker = document.getElementById("datePicker");
    var selectedDate = new Date(datePicker.value);
    selectedDate.setDate(selectedDate.getDate() + offset);
    datePicker.value = selectedDate.toISOString().split('T')[0];
    updateImage();

    
    document.getElementById("recommendedApod").value = "";
}

function selectRecommendedDate() {
    var selectedDate = document.getElementById("recommendedApod").value;
    document.getElementById("datePicker").value = selectedDate;
    updateImage(); 

}

function getRandomDate() {
    var minDate = new Date('1995-06-16');
    var currentDate = new Date();
    var rangeInDays = (currentDate - minDate) / (1000 * 60 * 60 * 24);
    var randomOffset = Math.floor(Math.random() * rangeInDays);
    var randomDate = new Date(minDate.getTime() + randomOffset * 24 * 60 * 60 * 1000);
    return randomDate.toISOString().split('T')[0];

    
}

function diceImage() {
    var randomDate = getRandomDate();
    document.getElementById("datePicker").value = randomDate;
    updateImage();

    document.getElementById("recommendedApod").value = "";
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

function closeTab() {
    window.close();
}

function shareCard() {
    var imageUrl = document.getElementById("apodImage").src;
    var imageTitle = document.getElementById("title").innerText;
    var imageDescription = document.getElementById("explanation").innerText;


    var encodedImageUrl = encodeURIComponent(imageUrl);
    var encodedImageTitle = encodeURIComponent(imageTitle);
    var encodedImageDescription = encodeURIComponent(imageDescription);

    var previewUrl = `/preview?image_url=${encodedImageUrl}&title=${encodedImageTitle}&description=${encodedImageDescription}`;
    var cardWindow = window.open(previewUrl, "_blank");
}
