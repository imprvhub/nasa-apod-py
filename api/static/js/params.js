const params = new URLSearchParams(window.location.search);
        const imageUrl = params.get('image_url');
        const title = params.get('title');
        const description = params.get('description');
        document.getElementById('apodImage').setAttribute('src', imageUrl);
        document.querySelector('img').setAttribute('alt', title);
        document.querySelector('h2').textContent = title;
        document.querySelector('p').textContent = description;

