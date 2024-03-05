
document.addEventListener("DOMContentLoaded", function() {
    const params = new URLSearchParams(window.location.search);
    const imageUrl = params.get('image_url');
    const title = params.get('title');
    const description = params.get('description');

    const imageElementContainer = document.getElementById('apodImageContainer');
    const titleElement = document.getElementById('title');
    const descriptionElement = document.getElementById('explanation');

    if (imageUrl) {
        imageElementContainer.innerHTML = `<img id="apodImage" src="${imageUrl}" alt="${title}" onclick="expandImage()">`;
    }

    if (titleElement) {
        titleElement.textContent = title;
    }

    if (descriptionElement) {
        descriptionElement.textContent = description;
    }
});

document.addEventListener("DOMContentLoaded", function() {
    const images = document.querySelectorAll('#apodImageContainer img');

    images.forEach(image => {
        const imageUrl = image.getAttribute('src');
        if (imageUrl && imageUrl.includes("youtube.com")) {
            const videoId = extractYouTubeVideoId(imageUrl);
            const iframeSrc = `https://www.youtube.com/embed/${videoId}`;
            const iframe = document.createElement('iframe');
            iframe.width = "560";
            iframe.height = "400";
            iframe.src = iframeSrc;
            iframe.setAttribute('allowfullscreen', '');
            image.parentNode.replaceChild(iframe, image);
        }
    });
});

function extractYouTubeVideoId(url) {
    const videoIdMatches = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return videoIdMatches && videoIdMatches[1];
}

