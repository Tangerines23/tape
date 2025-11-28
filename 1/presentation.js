document.addEventListener('DOMContentLoaded', () => {
    const slides = Array.from(document.querySelectorAll('.presentation-slide'));
    let currentSlide = 0;
    if (slides.length === 0) { console.warn('No slides found'); return; }

    const slideListModal = document.getElementById('slide-list-modal');
    const slideListItems = document.getElementById('slide-list-items');

    const toggleSlideListModal = (show) => {
        if (!slideListModal) return;
        if (show) {
            populateSlideList();
            slideListModal.classList.remove('hidden');
            slideListModal.classList.add('flex');
        } else {
            slideListModal.classList.add('hidden');
            slideListModal.classList.remove('flex');
        }
    };

    const populateSlideList = () => {
        if (!slideListItems) return;
        slideListItems.innerHTML = '';
        slides.forEach((slide, index) => {
            const titleEl = slide.querySelector('h1, h2, h3');
            const title = titleEl ? titleEl.textContent.trim().split(/<br>|\n/)[0] : `슬라이드 ${index + 1}`;
            const li = document.createElement('li');
            li.innerHTML = 
                            `\n                <button class=\"w-full text-left p-3 rounded-md hover:bg-slate-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500\">
                    <span class=\"font-bold text-teal-400 mr-3\">${index + 1}</span>
                    <span class=\"text-slate-200\">${title}</span>
                </button>
                `;
            li.querySelector('button').addEventListener('click', (e) => {
                e.stopPropagation();
                goToSlide(index);
                toggleSlideListModal(false);
            });
            slideListItems.appendChild(li);
        });
    };



    let animatedElementsCache = new WeakMap();
    const getAnimatedElements = (slide) => {
        if (!animatedElementsCache.has(slide)) {
            animatedElementsCache.set(slide, slide.querySelectorAll('[data-animate], .animate-in, .animate-on-enter'));
        }
        return animatedElementsCache.get(slide);
    };
    const clearSlideCache = (slide) => slide && animatedElementsCache.has(slide) && animatedElementsCache.delete(slide);

    const setSlideVisible = (slide, visible) => {
        if (!slide) return;
        if (visible) {
            slide.style.opacity = '1';
            slide.style.visibility = 'visible';
            slide.style.pointerEvents = 'auto';
            slide.style.zIndex = '2';
        } else {
            slide.style.opacity = '0';
            slide.style.visibility = 'hidden';
            slide.style.pointerEvents = 'none';
            slide.style.zIndex = '1';
        }
    };
    

    const animateNumber = (el) => {
        const target = parseInt(el.dataset.target, 10);
        if (isNaN(target)) return;

        let obj = { val: 0 };
        gsap.to(obj, {
            val: target,
            duration: 1.5,
            ease: 'power3.out',
            onUpdate: () => {
                el.textContent = Math.round(obj.val);
            }
        });
    };

    const goToSlide = (slideIndex, isInitial = false) => {
        if (slideIndex < 0 || slideIndex >= slides.length) return false;
        if (slideIndex === currentSlide && !isInitial) return true;

        const [oldSlide, newSlide] = [slides[currentSlide], slides[slideIndex]];
        if (typeof gsap !== 'undefined') gsap.killTweensOf('[data-animate]');
        
        const timeline = gsap.timeline({
            onComplete: () => {
                [oldSlide, newSlide].forEach(slide => {
                    if (slide) getAnimatedElements(slide).forEach(el => el.style.willChange = 'auto');
                });
            }
        });

        if (!isInitial && oldSlide && oldSlide !== newSlide) {
            const oldElements = getAnimatedElements(oldSlide);
            if (oldElements.length > 0) {
                oldElements.forEach(el => el.style.willChange = 'opacity, transform');
                timeline.to(oldElements, { opacity: 0, y: 20, stagger: 0.05, duration: 0.5, ease: 'power3.in' });
            }
        }

        timeline.call(() => {
            if(oldSlide && oldSlide !== newSlide) setSlideVisible(oldSlide, false);
            setSlideVisible(newSlide, true);
            currentSlide = slideIndex;
            updateUIElements();
        }, null, isInitial ? 0 : '+=0.2');

        const newElements = getAnimatedElements(newSlide);
        if (newElements.length > 0) {
            newElements.forEach(el => {
                el.style.willChange = 'opacity, transform';

                if (el.id === 'time-reduction-value' && el.dataset.target) {
                    animateNumber(el);
                }
            });
            timeline.fromTo(newElements, { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out' });
        }
        return true;
    };

    const nextSlide = () => goToSlide(currentSlide + 1);
    const prevSlide = () => goToSlide(currentSlide - 1);
    const firstSlide = () => goToSlide(0);
    const lastSlide = () => goToSlide(slides.length - 1);

    function updateUIElements() {
        const dotsContainer = document.getElementById('presentation-dots');
        const prevButton = document.getElementById('presentation-prev-slide');
        const nextButton = document.getElementById('presentation-next-slide');

        if (dotsContainer) {
            const currentPageSpan = document.getElementById('presentation-current-page');
            if (currentPageSpan) {
                currentPageSpan.textContent = (currentSlide + 1).toString();
            }
        }

        if (prevButton) prevButton.disabled = currentSlide === 0;
        if (nextButton) nextButton.disabled = currentSlide === slides.length - 1;
    }

    let boundElements = new Set();
    
    function initializeUIElements() {
        const navContainer = document.getElementById('presentation-navigation');
        const dotsContainer = document.getElementById('presentation-dots');
        const prevButton = document.getElementById('presentation-prev-slide');
        const nextButton = document.getElementById('presentation-next-slide');

        const totalSlides = slides.length;
        if (totalSlides <= 1) {
            if (navContainer) navContainer.style.display = 'none';
            return;
        }

        if (navContainer) navContainer.style.display = 'flex';

        if (dotsContainer && totalSlides > 1) {
            dotsContainer.innerHTML = '';
            
            const pageIndicator = document.createElement('div');
            pageIndicator.className = 'flex items-center gap-1 text-white/80 text-sm font-medium cursor-pointer hover:text-white transition-colors duration-200';
            pageIndicator.setAttribute('aria-label', 'Jump to slide');
            
            const currentPageSpan = document.createElement('span');
            currentPageSpan.id = 'presentation-current-page';
            currentPageSpan.className = 'inline-block text-center min-w-[1.2em]';
            currentPageSpan.textContent = (currentSlide + 1).toString();
            
            pageIndicator.appendChild(currentPageSpan);
            
            const separator = document.createElement('span');
            separator.className = 'text-white/50';
            separator.textContent = '/';
            pageIndicator.appendChild(separator);
            
            const totalPagesSpan = document.createElement('span');
            totalPagesSpan.className = 'text-white/80 inline-block text-center min-w-[1.2em]';
            totalPagesSpan.textContent = totalSlides.toString();
            pageIndicator.appendChild(totalPagesSpan);
            
            pageIndicator.addEventListener('click', () => {
                toggleSlideListModal(true);
            });
            
            dotsContainer.appendChild(pageIndicator);
        }

        if (prevButton && !boundElements.has(prevButton)) {
            prevButton.addEventListener('click', prevSlide);
            boundElements.add(prevButton);
        }
        if (nextButton && !boundElements.has(nextButton)) {
            nextButton.addEventListener('click', nextSlide);
            boundElements.add(nextButton);
        }
    }

    const announceSlide = () => {
        const announcement = `Slide ${currentSlide + 1} of ${slides.length}`;
        let announcer = document.getElementById('presentation-announcer');
        if (!announcer) {
            announcer = document.createElement('div');
            announcer.id = 'presentation-announcer';
            announcer.setAttribute('aria-live', 'polite');
            announcer.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
            document.body.appendChild(announcer);
        }
        announcer.textContent = announcement;
    };

    window.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;
        
        if (e.key === 'Escape') {
            if (slideListModal && !slideListModal.classList.contains('hidden')) {
                toggleSlideListModal(false);
                e.preventDefault();
                e.stopPropagation();
                return;
            }
        }

        let handled = false;
        const keyMap = {
            'ArrowRight': nextSlide, ' ': nextSlide, 'PageDown': nextSlide,
            'ArrowLeft': prevSlide, 'PageUp': prevSlide,
            'Home': firstSlide, 'End': lastSlide,
        };
        
        if (keyMap[e.key]) {
            keyMap[e.key]();
            handled = true;
        }
        
        if (handled) { e.preventDefault(); e.stopPropagation(); announceSlide(); }
    });

    let touchStartX = null, touchStartY = null;
    document.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) [touchStartX, touchStartY] = [e.touches[0].clientX, e.touches[0].clientY];
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
        if (!touchStartX || !touchStartY || e.changedTouches.length !== 1) {
            touchStartX = touchStartY = null;
            return;
        }
        const [touchEndX, touchEndY] = [e.changedTouches[0].clientX, e.changedTouches[0].clientY];
        const [deltaX, deltaY] = [touchStartX - touchEndX, touchStartY - touchEndY];
        
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
            e.preventDefault();
            deltaX > 0 ? nextSlide() : prevSlide();
        }
        touchStartX = touchStartY = null;
    });

    let wheelTimeout;
    document.addEventListener('wheel', (e) => {
        e.preventDefault();
        clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(() => {
            if (e.deltaY > 50) {
                nextSlide();
            } else if (e.deltaY < -50) {
                prevSlide();
            }
        }, 50);
    }, { passive: false });

    if (slideListModal) {
        slideListModal.addEventListener('click', (e) => {
            // Close if clicking on the modal background
            if (e.target.id === 'slide-list-modal') {
                toggleSlideListModal(false);
            }
        });
    }
    
    try {
        currentSlide = 0;
        initializeUIElements();
        if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
        if (slides.length > 0) {
            updateUIElements();
            slides.forEach((slide, index) => setSlideVisible(slide, index === 0));
        } else {
            console.warn('No slides found');
        }
        document.dispatchEvent(new CustomEvent('presentationReady', { detail: { slideCount: slides.length, currentSlide } }));
    } catch (error) {
        console.error('Failed to initialize:', error);
        if (slides.length > 0) setSlideVisible(slides[0], true);
    }
});