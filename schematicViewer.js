document.addEventListener('DOMContentLoaded', () => {
    const currentImage = document.getElementById('current-schematic-image');
    const nextImage = document.getElementById('next-schematic-image');
    const filmstrip = document.getElementById('schematic-filmstrip');
    const prevButton = document.getElementById('prev-schematic');
    const nextButton = document.getElementById('next-schematic');

    const schematicPaths = Array.from({ length: 10 }, (_, i) => `HEAD/schematic/${i + 1}.png`);
    let currentIndex = 0;
    let isTransitioning = false; // To prevent rapid clicks during transition

    // Initial setup: currentImage is visible, nextImage is hidden and behind
    currentImage.src = schematicPaths[currentIndex];
    currentImage.alt = `현재 회로도 ${currentIndex + 1}`;
    currentImage.style.opacity = '1';
    currentImage.style.zIndex = '20'; // Ensure current is on top
    nextImage.style.opacity = '0';
    nextImage.style.zIndex = '10'; // Ensure next is behind

    function updateViewer(index) {
        if (index < 0 || index >= schematicPaths.length || isTransitioning || index === currentIndex) return;

        isTransitioning = true;

        const oldIndex = currentIndex;
        currentIndex = index;

        // Set the next image's source
        nextImage.src = schematicPaths[currentIndex];
        nextImage.alt = `다음 회로도 ${currentIndex + 1}`;

        // Start fading out currentImage AND fading in nextImage
        currentImage.style.opacity = '0';
        nextImage.style.opacity = '1';

        setTimeout(() => {
            // After transition, swap roles: nextImage becomes currentImage
            currentImage.src = schematicPaths[currentIndex]; // Update currentImage src
            currentImage.alt = `현재 회로도 ${currentIndex + 1}`;
            currentImage.style.opacity = '1'; // Make currentImage visible again
            
            // Reset nextImage for next transition
            nextImage.style.opacity = '0'; 

            isTransitioning = false;
            updateFilmstrip();
            updateNavigationButtons();

            // Scroll filmstrip to center active thumbnail
            const activeThumbnail = filmstrip.querySelector('.thumbnail.active');
            if (activeThumbnail) {
                filmstrip.scrollTo({
                    left: activeThumbnail.offsetLeft - (filmstrip.offsetWidth / 2) + (activeThumbnail.offsetWidth / 2),
                    behavior: 'smooth'
                });
            }
        }, 300); // Match CSS transition duration
    }

    function createThumbnail(path, index) {
        const img = document.createElement('img');
        img.src = path;
        img.alt = `회로도 썸네일 ${index + 1}`;
        img.classList.add('thumbnail', 'w-24', 'h-16', 'object-contain', 'rounded-md', 'cursor-pointer', 'border-2', 'border-transparent', 'hover:border-teal-400', 'transition-all', 'duration-200', 'bg-white', 'p-1');
        img.dataset.index = index;
        img.addEventListener('click', () => updateViewer(index));
        return img;
    }

    function updateFilmstrip() {
        filmstrip.innerHTML = ''; // Clear existing thumbnails
        schematicPaths.forEach((path, index) => {
            const thumbnail = createThumbnail(path, index);
            if (index === currentIndex) {
                thumbnail.classList.add('active', 'border-teal-400', 'scale-105');
            }
            filmstrip.appendChild(thumbnail);
        });
    }

    function updateNavigationButtons() {
        prevButton.disabled = currentIndex === 0;
        nextButton.disabled = currentIndex === schematicPaths.length - 1;
    }

    // Event Listeners for navigation buttons
    prevButton.addEventListener('click', () => updateViewer(currentIndex - 1));
    nextButton.addEventListener('click', () => updateViewer(currentIndex + 1));

    // Keyboard navigation (A/D keys)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'a' || e.key === 'A') {
            updateViewer(currentIndex - 1);
        } else if (e.key === 'd' || e.key === 'D') {
            updateViewer(currentIndex + 1);
        }
    });

    // Initial load
    updateFilmstrip(); // Generate thumbnails
    updateNavigationButtons(); // Set initial button states

    // Render Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});