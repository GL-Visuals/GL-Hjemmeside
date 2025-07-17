document.addEventListener('DOMContentLoaded', function() {
    // ===== BURGER MENU & OFF-SCREEN MENU =====
    const burgerMenu = document.getElementById('burgerMenu');
    const offScreenMenu = document.getElementById('offScreenMenu');

    if (burgerMenu && offScreenMenu) {
        burgerMenu.addEventListener('click', function() {
            offScreenMenu.classList.toggle('active');
            burgerMenu.classList.toggle('active');

            const isExpanded = offScreenMenu.classList.contains('active');
            burgerMenu.setAttribute('aria-expanded', isExpanded);

            if (isExpanded) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    }

    if (offScreenMenu) {
        const menuLinks = offScreenMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (offScreenMenu.classList.contains('active')) {
                    offScreenMenu.classList.remove('active');
                    burgerMenu.classList.remove('active');
                    burgerMenu.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                }
            });
        });
    }

    // ===== DYNAMIC YEAR IN FOOTER =====
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }


    // ===== AUTOHIDING HEADER ON SCROLL =====
    let lastScrollTop = 0; // Holder styr på den seneste scroll-position
    const header = document.querySelector('header'); // Vælger header-elementet
    const scrollThreshold = 30; // Hvor mange pixels man skal scrolle, før der sker noget

    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Sørg for at headeren altid er synlig, hvis man er tæt på toppen af siden
        if (scrollTop < 50) { // Juster f.eks. 50px efter behov
            if (header.classList.contains('header-hidden')) {
                header.classList.remove('header-hidden');
            }
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For at undgå fejl på Mac/iOS
            return; // Stop funktionen her, da vi er tæt på toppen
        }

        // Tjek om man har scrollet nok til at det tæller
        if (Math.abs(scrollTop - lastScrollTop) <= scrollThreshold) {
            return;
        }

        // Tjek scroll retning
        if (scrollTop > lastScrollTop) {
            // Scroll ned
            if (!header.classList.contains('header-hidden')) {
                header.classList.add('header-hidden');
            }
        } else {
            // Scroll op
            if (header.classList.contains('header-hidden')) {
                header.classList.remove('header-hidden');
            }
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For at undgå fejl på Mac/iOS
    }, false);


    // ===== LIGHTBOX FUNCTIONALITY (MED NAVIGATION) =====
     const photoThumbnails = document.querySelectorAll('.photo-item img');
     let lightboxOverlay = null;
     let lightboxImage = null;
     let prevButton = null; // Til "Forrige" knap
     let nextButton = null; // Til "Næste" knap

     let currentImageIndex = 0; // Holder styr på det aktuelle billede
     let galleryImages = [];    // Array til at gemme kilderne til alle galleribilleder

     if (photoThumbnails.length > 0) {
         // Gem kilderne til alle thumbnails
         photoThumbnails.forEach(thumb => {
             galleryImages.push(thumb.getAttribute('src'));
         });

         // Opret lightbox-strukturen én gang
         lightboxOverlay = document.createElement('div');
         lightboxOverlay.classList.add('lightbox-overlay');

         const lightboxContent = document.createElement('div');
         lightboxContent.classList.add('lightbox-content');

         lightboxImage = document.createElement('img');
         lightboxImage.setAttribute('src', '');
         lightboxImage.setAttribute('alt', 'Forstørret billede');

         const closeButton = document.createElement('span');
         closeButton.classList.add('lightbox-close');
         closeButton.innerHTML = '×';

         // Opret navigationspile
         prevButton = document.createElement('div');
         prevButton.classList.add('lightbox-nav', 'lightbox-prev');
         prevButton.innerHTML = '❮'; // HTML entity for venstre pil

         nextButton = document.createElement('div');
         nextButton.classList.add('lightbox-nav', 'lightbox-next');
         nextButton.innerHTML = '❯'; // HTML entity for højre pil

         lightboxContent.appendChild(lightboxImage);
         lightboxContent.appendChild(closeButton);
         // Tilføj pile til overlayet, udenfor content for at de kan være ved siden af billedet
         lightboxOverlay.appendChild(prevButton);
         lightboxOverlay.appendChild(lightboxContent);
         lightboxOverlay.appendChild(nextButton);
         document.body.appendChild(lightboxOverlay);

         // Funktion til at opdatere navigationspilene (skjul/vis)
         function updateNavButtons() {
             if (galleryImages.length <= 1) { // Hvis der kun er ét billede
                 prevButton.classList.add('disabled');
                 nextButton.classList.add('disabled');
                 return;
             }
             prevButton.classList.toggle('disabled', currentImageIndex === 0);
             nextButton.classList.toggle('disabled', currentImageIndex === galleryImages.length - 1);
         }

         // Funktion til at vise et specifikt billede baseret på index
         function showImage(index) {
             if (index >= 0 && index < galleryImages.length) {
                 currentImageIndex = index;
                 lightboxImage.setAttribute('src', galleryImages[currentImageIndex]);
                 updateNavButtons();
             }
         }

         function openLightbox(startIndex) {
             lightboxOverlay.classList.add('active');
             document.body.style.overflow = 'hidden';
             showImage(startIndex); // Vis det klikkede billede
         }

         function closeLightbox() {
             lightboxOverlay.classList.remove('active');
             document.body.style.overflow = '';
         }

         // Tilføj event listeners til hvert galleri-billede
         photoThumbnails.forEach((thumbnail, index) => {
             thumbnail.style.cursor = 'pointer';
             thumbnail.addEventListener('click', function() {
                 openLightbox(index); // Send index for det klikkede billede
             });
         });

         // Event listeners for navigationspile
         prevButton.addEventListener('click', function(event) {
             event.stopPropagation(); // Forhindr at klikket også lukker lightboxen
             if (currentImageIndex > 0) {
                 showImage(currentImageIndex - 1);
             }
         });

         nextButton.addEventListener('click', function(event) {
             event.stopPropagation(); // Forhindr at klikket også lukker lightboxen
             if (currentImageIndex < galleryImages.length - 1) {
                 showImage(currentImageIndex + 1);
             }
         });

         lightboxOverlay.addEventListener('click', function(event) {
             if (event.target === lightboxOverlay) {
                 closeLightbox();
             }
         });

         closeButton.addEventListener('click', function() {
             closeLightbox();
         });

         document.addEventListener('keydown', function(event) {
             if (lightboxOverlay.classList.contains('active')) {
                 if (event.key === 'Escape') {
                     closeLightbox();
                 } else if (event.key === 'ArrowLeft') { // Venstre piletast
                     if (currentImageIndex > 0) {
                         showImage(currentImageIndex - 1);
                     }
                 } else if (event.key === 'ArrowRight') { // Højre piletast
                     if (currentImageIndex < galleryImages.length - 1) {
                         showImage(currentImageIndex + 1);
                     }
                 }
             }
         });
     }
 });
