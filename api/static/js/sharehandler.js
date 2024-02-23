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
        const redditIcon = document.getElementById('reddit');
        const emailIcon = document.getElementById('mail');

        const title = 'Check out this amazing APOD card!';
        const description = 'This APOD card was generated dynamically from NASA public API and I wanted to share it with you!';


        function shareOnFacebook() {
            const facebookUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(shortUrl);
            window.open(facebookUrl, '_blank');
        }

        function shareOnWhatsApp() {
            const whatsappUrl = 'whatsapp://send?text=' + encodeURIComponent(shortUrl);
            window.open(whatsappUrl);
        }

        function shareOnTwitter() {
            const twitterUrl = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(shortUrl) + '&title=' + encodeURIComponent(title);
            window.open(twitterUrl, '_blank');
        }

        function shareOnReddit() {
            const redditUrl = 'https://www.reddit.com/submit?url=' + encodeURIComponent(shortUrl) + '&title=' + encodeURIComponent(title);
            window.open(redditUrl, '_blank');
        }
        
        function shareViaEmail() {
            const subject = 'Check out this amazing APOD card!';
            const emailBody = 'This APOD card was generated dynamically from NASA public API and I wanted to share it with you! ' + shortUrl;
            const emailUrl = 'mailto:?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(emailBody);
            window.open(emailUrl);
        }
        

        facebookIcon.addEventListener('click', shareOnFacebook);
        whatsappIcon.addEventListener('click', shareOnWhatsApp);
        twitterIcon.addEventListener('click', shareOnTwitter);
        redditIcon.addEventListener('click', shareOnReddit);
        emailIcon.addEventListener('click', shareViaEmail);
    })
    .catch(error => console.error('Error:', error));
});
