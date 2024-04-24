window.addEventListener('DOMContentLoaded', (event) => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('image_url')) {
        initScript();
    }

    const today = new Date().toISOString().split('T')[0];
    document.getElementById("datePicker").setAttribute("max", today);

    window.flatpickr("#datePicker", {
        minDate: "1995-06-16",
        maxDate: today,
        onChange: function(selectedDates, dateStr, instance) {
            document.getElementById("recommendedApod").value = "";
            updateImage();
        }
    });
    initScript();
});

function initScript() {
    const params = new URLSearchParams(window.location.search);
    const imageUrl = params.get('image_url');
    const title = params.get('title');
    const description = params.get('description');
    const date = params.get('date');

    const isIframe = document.getElementById('apodImage').tagName === 'IFRAME';

    if (imageUrl && !isIframe) {
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

    if (!date) {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById("datePicker").value = today;
    }
}

function showLoader() {
    const loaderContainer = document.getElementById('loaderContainer');
    loaderContainer.style.display = 'block';
    document.getElementById('spacer').style.display = 'block';
    document.getElementById('loader').style.display = 'block';   
}

function hideLoader() {
    const loaderContainer = document.getElementById('loaderContainer');
    loaderContainer.style.display = 'none';
    document.getElementById('loader').style.display = 'none';
    document.getElementById('spacer').style.display = 'none';
}

function updateImage() {
    const selectedDate = document.getElementById("datePicker").value;
    const imageElement = document.getElementById("apodImage");
    const titleElement = document.getElementById("title");
    const expandIcon = document.getElementById("expandIcon");
    const shareIcon = document.getElementById("shareIcon");
    const explanation = document.getElementById("explanation");
    const expandedExplanation = document.getElementById("expandedExplanation");

    imageElement.style.display = 'none';
    titleElement.style.display = 'none';
    explanation.style.display = 'none';
    expandIcon.style.display = 'none';
    shareIcon.style.display = 'none';

    showLoader();

    fetch(`/update_image?date=${selectedDate}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.url.includes("youtube.com")) {
                hideLoader();
                const videoId = data.url.split('/').pop();
                const iframe = document.createElement("iframe");
                iframe.id = "apodImage";
                iframe.width = "560"; 
                iframe.height = "400";
                iframe.src = `https://www.youtube.com/embed/${videoId}?rel=0`;
                iframe.allowFullscreen = true;
                iframe.style.width = "560px";
                iframe.style.height = "315px";

                if (imageElement && imageElement.parentNode) {
                    imageElement.parentNode.replaceChild(iframe, imageElement);
                }

                if (titleElement && data.title) {
                    titleElement.textContent = data.title;
                    titleElement.style.display = "block";
                }
                if (explanation && data.explanation) {
                    explanation.textContent = data.explanation;
                    explanation.style.display = "block";
                }
                if (expandIcon) {
                    expandIcon.style.display = "inline";
                }
                if (shareIcon) {
                    shareIcon.style.display = "inline";
                }
            } else {
                const newImageElement = document.createElement("img");
                newImageElement.id = "apodImage";
                newImageElement.src = data.url;
                newImageElement.alt = data.title;
                newImageElement.onload = function() {
                    if (imageElement && imageElement.parentNode) {
                        imageElement.parentNode.replaceChild(newImageElement, imageElement);
                    }

                    if (titleElement && data.title) {
                        titleElement.textContent = data.title;
                        titleElement.style.display = "block";
                    }
                    if (explanation && data.explanation) {
                        explanation.textContent = data.explanation;
                        explanation.style.display = "block";
                    }
                    if (expandedExplanation && data.explanation) {
                        expandedExplanation.textContent = data.explanation;
                    }
                    if (expandIcon) {
                        expandIcon.style.display = "block";
                    }
                    if (shareIcon) {
                        shareIcon.style.display = "inline";
                    }
                    hideLoader();
                    imageElement.style.display = 'block';
                    titleElement.style.display = 'block';
                    explanation.style.display = 'block';
                };
            }
        })
        .catch(error => {
            console.error("Error al procesar la solicitud:", error);
            if (imageElement) {
                imageElement.src = "static/images/image_not_found.png";
                imageElement.alt = "Not Found";
            }
            if (titleElement) {
                titleElement.innerText = "404 - Not Found";
            }
            if (expandIcon) {
                expandIcon.style.display = "none";
            }
            if (shareIcon) {
                shareIcon.style.display = "none";
            }
            if (explanation) {
                explanation.innerText = "APOD was not delivered for this date, or is pending, or encountering issues with the API or server. Kindly report this error or choose an alternative date.";
            }
            if (expandedExplanation) {
                expandedExplanation.innerText = "";
            }
            hideLoader();
            imageElement.style.display = 'block';
            titleElement.style.display = 'block';
            explanation.style.display = 'block';
        });
}


function changeDate(offset) {
    const datePicker = document.getElementById("datePicker");
    const selectedDate = new Date(datePicker.value);
    selectedDate.setDate(selectedDate.getDate() + offset);

    const today = new Date().toISOString().split('T')[0];
    const maxDate = new Date(datePicker.getAttribute("max"));
    const nextDateButton = document.getElementById("nextDate");

    if (selectedDate > maxDate || selectedDate < new Date("1995-06-16")) {
        nextDateButton.style.opacity = 0.5;
        nextDateButton.style.pointerEvents = "none"; 
    } else {
        var formattedDate = selectedDate.toISOString().split('T')[0];
        datePicker.value = formattedDate;
        updateImage();
        document.getElementById("recommendedApod").value = "";

        nextDateButton.style.opacity = 1;
        nextDateButton.style.pointerEvents = "auto";
    };
}

function selectRecommendedDate() {
    const selectedDate = document.getElementById("recommendedApod").value;
    document.getElementById("datePicker").value = selectedDate;
    updateImage(); 
}

function getRandomDate() {
    const minDate = new Date('1995-06-16');
    const currentDate = new Date();
    const rangeInDays = (currentDate - minDate) / (1000 * 60 * 60 * 24);
    const randomOffset = Math.floor(Math.random() * rangeInDays);
    const randomDate = new Date(minDate.getTime() + randomOffset * 24 * 60 * 60 * 1000);
    return randomDate.toISOString().split('T')[0];
}

function diceImage() {
    const randomDate = getRandomDate();
    document.getElementById("datePicker").value = randomDate;
    updateImage();
    document.getElementById("recommendedApod").value = "";
}

function expandImage() {
    const expandedContainer = document.getElementById("expandedImageContainer");
    const imageElement = document.getElementById("expandedImage");
    const expandedExplanation = document.getElementById("expandedExplanation");
    imageElement.src = document.getElementById("apodImage").src;
    imageElement.alt = document.getElementById("apodImage").alt;
    expandedExplanation.style.display = "block";
    expandedExplanation.style.overflowY = "auto";
    expandedContainer.style.display = "block";
}

function closeImage() {
    const expandedContainer = document.getElementById("expandedImageContainer");
    const expandedExplanation = document.getElementById("expandedExplanation");
    
    expandedContainer.style.display = "none";
}

function closeTab() {
    window.close();
}

function handleMouseOverExpand() {
    document.getElementById("expandLabel").style.color = "#E85D2B";
    document.querySelector("#expandIcon img").style.filter = "invert(35%) sepia(94%) saturate(3580%) hue-rotate(341deg) brightness(100%) contrast(100%)";
}

function handleMouseOutExpand() {
    document.getElementById("expandLabel").style.color = "white";
    document.querySelector("#expandIcon img").style.filter = "invert(0%)";
}

function handleMouseOver() {
    document.getElementById("labelElement").style.color = "#E85D2B";
    document.querySelector("#shareIcon img").style.filter = "invert(35%) sepia(94%) saturate(3580%) hue-rotate(341deg) brightness(100%) contrast(100%)";
}

function handleMouseOut() {
    document.getElementById("labelElement").style.color = "white";
    document.querySelector("#shareIcon img").style.filter = "invert(0%)";
}

function handleMouseOverDice() {
    document.getElementById("diceLabel").style.color = "#E85D2B";
    document.querySelector("#diceIcon img").style.filter = "invert(35%) sepia(94%) saturate(3580%) hue-rotate(341deg) brightness(100%) contrast(100%)";
}

function handleMouseOutDice() {
    document.getElementById("diceLabel").style.color = "white";
    document.querySelector("#diceIcon img").style.filter = "invert(0%)";
}

function shareCard() {
    const imageUrl = document.getElementById("apodImage").src;
    const imageTitle = document.getElementById("title").innerText;
    const imageDescription = document.getElementById("explanation").innerText;
    const encodedImageUrl = encodeURIComponent(imageUrl);
    const encodedImageTitle = encodeURIComponent(imageTitle);
    const encodedImageDescription = encodeURIComponent(imageDescription);
    const previewUrl = `/preview?image_url=${encodedImageUrl}&title=${encodedImageTitle}&description=${encodedImageDescription}`;
    const cardWindow = window.open(previewUrl, "_blank");
}

function openModal(id) {
    document.getElementById(id).classList.add('open');
    document.body.classList.add('jw-modal-open');
}

function closeModal() {
    document.querySelector('.jw-modal.open').classList.remove('open');
    document.body.classList.remove('jw-modal-open');
}

window.addEventListener('load', function() {
    document.addEventListener('click', event => {
        if (event.target.classList.contains('jw-modal')) {
            closeModal();
        }
    });
});