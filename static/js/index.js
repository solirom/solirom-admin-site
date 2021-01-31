solirom = {};

solirom.activateGallery = function(galleryId) {
    document.querySelectorAll("#gallery > *").forEach(item => item.classList.remove('active'));
    document.querySelector(galleryId).classList.add('active');
};

solirom.openInNewTab = function(url) {
    window.open(url, '_blank');
};

document.querySelector("#menu li:first-of-type > a").click();
