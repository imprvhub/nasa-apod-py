document.addEventListener('DOMContentLoaded', function() {
    const originalUrl = window.location.href;
    document.getElementById('original-url-input').value = originalUrl;
    fetch('/preview', {
        method: 'POST',
        body: new FormData(document.getElementById('url-form'))
    })
    .then(response => response.json())
    .then(data => {
        const shortUrl = data.short_url;
        const facebookIcon = document.getElementById('facebook');
        const whatsappIcon = document.getElementById('whatsapp');
        const twitterIcon = document.getElementById('twitter');
        const dribbbleIcon = document.getElementById('dribbble');
        const linkedinIcon = document.getElementById('linkedin');
        const instagramIcon = document.getElementById('instagram');
        const pinterestIcon = document.getElementById('pinterest');
        const youtubeIcon = document.getElementById('youtube');

        function shareOnFacebook() {
            const facebookUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(shortUrl);
            window.open(facebookUrl, '_blank');
        }

        function shareOnWhatsApp() {
            const whatsappUrl = 'whatsapp://send?text=' + encodeURIComponent(shortUrl);
            window.open(whatsappUrl);
        }

        function shareOnTwitter() {
            const text = 'Check out this link: ' + shortUrl;
            const twitterUrl = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(text);
            window.open(twitterUrl, '_blank');
        }

        function shareOnDribbble() {
            const dribbbleUrl = 'https://dribbble.com/share?url=' + encodeURIComponent(shortUrl);
            window.open(dribbbleUrl, '_blank');
        }

        function shareOnLinkedIn() {
            const linkedInUrl = 'https://www.linkedin.com/shareArticle?url=' + encodeURIComponent(shortUrl);
            window.open(linkedInUrl, '_blank');
        }

        function shareOnInstagram() {
            const instagramUrl = 'https://www.instagram.com/share?url=' + encodeURIComponent(shortUrl);
            window.open(instagramUrl, '_blank');
        }

        function shareOnPinterest() {
            const pinterestUrl = 'https://pinterest.com/pin/create/button/?url=' + encodeURIComponent(shortUrl);
            window.open(pinterestUrl, '_blank');
        }

        function shareOnYoutube() {
            const youtubeUrl = 'https://www.youtube.com/watch?v=' + encodeURIComponent(shortUrl);
            window.open(youtubeUrl, '_blank');
        }

        facebookIcon.addEventListener('click', shareOnFacebook);
        whatsappIcon.addEventListener('click', shareOnWhatsApp);
        twitterIcon.addEventListener('click', shareOnTwitter);
        dribbbleIcon.addEventListener('click', shareOnDribbble);
        linkedinIcon.addEventListener('click', shareOnLinkedIn);
        instagramIcon.addEventListener('click', shareOnInstagram);
        pinterestIcon.addEventListener('click', shareOnPinterest);
        youtubeIcon.addEventListener('click', shareOnYoutube);
    })
    .catch(error => console.error('Error:', error));
});
