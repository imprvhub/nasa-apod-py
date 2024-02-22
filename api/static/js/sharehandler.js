document.addEventListener('DOMContentLoaded', function() {
    const facebookIcon = document.getElementById('facebook');
    const whatsappIcon = document.getElementById('whatsapp');
    const twitterIcon = document.getElementById('twitter');
    const dribbbleIcon = document.getElementById('dribbble');
    const linkedinIcon = document.getElementById('linkedin');
    const instagramIcon = document.getElementById('instagram');
    const pinterestIcon = document.getElementById('pinterest');
    const youtubeIcon = document.getElementById('youtube');

    function shareOnFacebook() {
        const url = window.location.href;
        const facebookUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url);
        window.open(facebookUrl, '_blank');
    }

    function shareOnWhatsApp() {
        const url = window.location.href;
        const whatsappUrl = 'whatsapp://send?text=' + encodeURIComponent(url);
        window.open(whatsappUrl);
    }

    function shareOnTwitter() {
        const url = window.location.href;
        const text = 'Check out this link: ' + url;
        const twitterUrl = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(text);
        window.open(twitterUrl, '_blank');
    }

    function shareOnDribbble() {
        const url = window.location.href;
        const dribbbleUrl = 'https://dribbble.com/share?url=' + encodeURIComponent(url);
        window.open(dribbbleUrl, '_blank');
    }

    function shareOnLinkedIn() {
        const url = window.location.href;
        const linkedInUrl = 'https://www.linkedin.com/shareArticle?url=' + encodeURIComponent(url);
        window.open(linkedInUrl, '_blank');
    }

    function shareOnInstagram() {
        const url = window.location.href;
        const instagramUrl = 'https://www.instagram.com/share?url=' + encodeURIComponent(url);
        window.open(instagramUrl, '_blank');
    }

    function shareOnPinterest() {
        const url = window.location.href;
        const pinterestUrl = 'https://pinterest.com/pin/create/button/?url=' + encodeURIComponent(url);
        window.open(pinterestUrl, '_blank');
    }

    function shareOnYoutube() {
        const url = window.location.href;
        const youtubeUrl = 'https://www.youtube.com/watch?v=' + encodeURIComponent(url);
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
});