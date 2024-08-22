document.addEventListener('DOMContentLoaded', function() {
    const carrousels = document.querySelectorAll('.carrousel');
    
    carrousels.forEach(carrousel => {
        const items = carrousel.querySelectorAll('.carrousel-item');
        const leftArrow = carrousel.parentElement.querySelector('.left-arrow');
        const rightArrow = carrousel.parentElement.querySelector('.right-arrow');

        // Clonar elementos para el carrusel infinito
        items.forEach(item => {
            const clone = item.cloneNode(true);
            carrousel.appendChild(clone);
        });

        // Configurar Intersection Observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    entry.target.classList.remove('inactive');
                } else {
                    entry.target.classList.remove('active');
                    entry.target.classList.add('inactive');
                }
            });
        }, { 
            root: carrousel,
            threshold: 0.5 
        });

        // Observar cada item del carrusel
        carrousel.querySelectorAll('.carrousel-item').forEach(item => observer.observe(item));

        // Función para mover el carrusel
        function moveCarrousel(direction) {
            const itemWidth = items[0].offsetWidth;
            const currentScroll = carrousel.scrollLeft;
            const totalWidth = carrousel.scrollWidth / 2;

            let newScroll = direction === 'left' 
                ? currentScroll - itemWidth 
                : currentScroll + itemWidth;

            // Lógica para el carrusel infinito
            if (newScroll < 0) {
                newScroll = totalWidth + newScroll;
            } else if (newScroll >= totalWidth) {
                newScroll = newScroll - totalWidth;
            }
            
            carrousel.scrollTo({
                left: newScroll,
                behavior: 'smooth'
            });
        }

        // Event listeners para las flechas
        leftArrow.addEventListener('click', () => moveCarrousel('left'));
        rightArrow.addEventListener('click', () => moveCarrousel('right'));

        // Manejar el scroll del carrusel
        carrousel.addEventListener('scroll', () => {
            const totalWidth = carrousel.scrollWidth / 2;
            if (carrousel.scrollLeft === 0) {
                carrousel.scrollLeft = totalWidth;
            } else if (carrousel.scrollLeft === carrousel.scrollWidth - carrousel.clientWidth) {
                carrousel.scrollLeft = totalWidth - carrousel.clientWidth;
            }
        });

        // Nuevo código para manejar el desplazamiento con el ratón
        let isDown = false;
        let startX;
        let scrollLeft;

        carrousel.addEventListener('mousedown', (e) => {
            isDown = true;
            carrousel.classList.add('active');
            startX = e.pageX - carrousel.offsetLeft;
            scrollLeft = carrousel.scrollLeft;
        });

        carrousel.addEventListener('mouseleave', () => {
            isDown = false;
            carrousel.classList.remove('active');
        });

        carrousel.addEventListener('mouseup', () => {
            isDown = false;
            carrousel.classList.remove('active');
        });

        carrousel.addEventListener('mousemove', (e) => {
            if(!isDown) return;
            e.preventDefault();
            const x = e.pageX - carrousel.offsetLeft;
            const walk = (x - startX) * 3; //scroll-fast
            carrousel.scrollLeft = scrollLeft - walk;
        });
    });



    // Funcionalidad para abrir imágenes en modal
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const closeBtn = document.getElementsByClassName('close')[0];
    const modalGallery = document.getElementById('modalGallery');

    let hideGalleryTimeout;

    // Definir las imágenes que tendrán galería
    const imagesWithGallery = {
        'fantasy': ['assets/carrousel/Digital/Fantasy Redraw 1.png', 'assets/carrousel/Digital/Fantasy Redraw 2.png', 'assets/carrousel/Digital/Fantasy Redraw 3.png'],
        'bañera': ['assets/carrousel/Digital/bañera (1).png', 'assets/carrousel/Digital/bañera (2).png'],
        'truco-trato': ['assets/carrousel/Digital/trikandtreat.gif','assets/carrousel/Digital/trick and treat (1).jpg', 'assets/carrousel/Digital/trick and treat (2).jpg'],
        'halloween': ['assets/carrousel/Digital/halloween.gif', 'assets/carrousel/Digital/Halloween.png'],
        'frankestein': ['assets/carrousel/Digital/My frankenstein 2.jpg', 'assets/carrousel/Digital/My frankenstein.jpg'],
        'habitacion': ['assets/carrousel/Pixelart/Room gif.gif', 'assets/carrousel/Pixelart/Mañana.png', 'assets/carrousel/Pixelart/Tarde.png', 'assets/carrousel/Pixelart/Noche.png'],
        'angel': ['assets/carrousel/Pixelart/Angel.png', 'assets/carrousel/Pixelart/Angelmensaje.png'],
        'fermine': ['assets/carrousel/Pixelart/fermine.gif', 'assets/carrousel/Pixelart/Fermine.jpg']
    };

    document.querySelectorAll('.carrousel-item .item-photo img').forEach(img => {
        img.onclick = function() {
            const parentId = this.closest('.carrousel-item').querySelector('.item-photo').id;
            openModal(this.src, parentId);
        }
    });

    function openModal(src, parentId) {
        modal.style.display = 'block';
        modalImg.src = src;
        document.body.classList.add('modal-open');
    
        modalGallery.innerHTML = '';
        modalGallery.classList.remove('active');
    
        if (imagesWithGallery[parentId]) {
            imagesWithGallery[parentId].forEach(imgSrc => {
                const galleryImg = document.createElement('img');
                galleryImg.src = imgSrc;
                galleryImg.onclick = () => {
                    modalImg.src = galleryImg.src;
                    modalGallery.querySelectorAll('img').forEach(img => img.classList.remove('active'));
                    galleryImg.classList.add('active');
                };
                if (imgSrc === src) {
                    galleryImg.classList.add('active');
                }
                modalGallery.appendChild(galleryImg);
            });
            
            modalGallery.classList.add('active');
            showGallery();
            modal.dataset.hasGallery = 'true';
        } else {
            modal.dataset.hasGallery = 'false';
        }
    }
    

    function showGallery() {
        if (modal.dataset.hasGallery === 'true') {
            modalGallery.classList.add('active');
            clearTimeout(hideGalleryTimeout);
            hideGalleryTimeout = setTimeout(() => {
                modalGallery.classList.remove('active');
            }, 1000); // TIEMPO INACTIVIDAD OCULTAR GALERÍA
        }
    }
    

    modal.addEventListener('mousemove', () => {
        if (modal.dataset.hasGallery === 'true') {
            showGallery();
        }
    });
    modal.addEventListener('touchstart', () => {
        if (modal.dataset.hasGallery === 'true') {
            showGallery();
        }
    }, {passive: true});
    

    function closeModal() {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
        clearTimeout(hideGalleryTimeout);
    }

    closeBtn.onclick = closeModal;

    window.onclick = function(event) {
        if (event.target == modal) {
            closeModal();
        }
    }

    document.addEventListener('keydown', function(e) {
        if (modal.style.display === 'block') {
            if (e.key === 'Escape') {
                closeModal();
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                navigateGallery(e.key === 'ArrowRight' ? 1 : -1);
            }
        }
    });

    function navigateGallery(direction) {
        const activeImg = modalGallery.querySelector('img.active');
        if (activeImg) {
            const images = Array.from(modalGallery.querySelectorAll('img'));
            let currentIndex = images.indexOf(activeImg);
            currentIndex = (currentIndex + direction + images.length) % images.length;
            images[currentIndex].click();
        }
    }
});
