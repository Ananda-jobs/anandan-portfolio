document.addEventListener('DOMContentLoaded', () => {

    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');

            // Toggle hamburger icon
            const icon = hamburger.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Close mobile menu when a link is clicked
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                const icon = hamburger.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });

    // Navbar Scrolled State
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Intersection Observer for Scroll Animations
    const faders = document.querySelectorAll('.fade-in, .fade-in-up');

    const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function (entries, observer) {
        entries.forEach((entry, index) => {
            if (!entry.isIntersecting) {
                return;
            } else {
                // Staggered appear effect
                setTimeout(() => {
                    entry.target.classList.add('appear');

                    // Specific logic for skill bars
                    const skillBars = entry.target.querySelectorAll('.skill-bar-fill');
                    skillBars.forEach(bar => {
                        bar.style.width = bar.getAttribute('data-width');
                    });
                }, index * 100);

                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    // Simple Form Submission feedback
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;

            btn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
            btn.style.opacity = '0.7';

            // Simulate API call
            setTimeout(() => {
                btn.innerHTML = 'Message Sent! <i class="fas fa-check"></i>';
                btn.style.background = 'linear-gradient(135deg, #00b09b, #96c93d)';
                btn.style.opacity = '1';
                contactForm.reset();

                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = '';
                }, 3000);
            }, 1500);
        });
    }
    // --- Click Sound Effect ---
    function playClickSound() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const audioCtx = new AudioContext();

            // Create oscillator and gain nodes
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            // Modern, soft pop/click sound
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(10, audioCtx.currentTime + 0.04);

            // Volume envelope
            gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);

            // Connect and play
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.04);
        } catch (e) {
            console.log("Web Audio API not supported", e);
        }
    }

    // Attach click sound to interactive elements (links, buttons, cards, mobile menu)
    const interactiveElements = document.querySelectorAll('a, button, input[type="submit"], .project-card, .skill-card, .service-row, .hamburger');

    interactiveElements.forEach(el => {
        el.addEventListener('click', playClickSound);
    });
    // --- Modal Logic ---
    function setupModal(modalId, btnId) {
        const modal = document.getElementById(modalId);
        const btnOpenModal = document.getElementById(btnId);

        if (!modal || !btnOpenModal) return;

        const closeBtn = modal.querySelector('.close-modal');

        // Open modal
        btnOpenModal.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('show');
            document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
        });

        // Close modal (X button)
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('show');
                document.body.style.overflow = 'auto'; // Re-enable scrolling
            });
            // Add click sound to modal close button
            closeBtn.addEventListener('click', playClickSound);
        }

        // Close modal (click outside)
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
                document.body.style.overflow = 'auto';
            }
        });
    }

    setupModal('project-modal', 'btn-coconut-modal');
    setupModal('adagency-modal', 'btn-adagency-modal');
    setupModal('holidayinn-modal', 'btn-holidayinn-modal');

    // --- Premium UI Interactions ---

    // Custom Cursor Tracking
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    if (cursorDot && cursorOutline && window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            // Dot follows exactly
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            // Outline follows with a slight delay interpolation
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOutline.classList.add('hovering');
            });
            el.addEventListener('mouseleave', () => {
                cursorOutline.classList.remove('hovering');
            });
        });
    }

    // 3D Tilt Hover Effect
    const tiltCards = document.querySelectorAll('.project-card, .service-row, .skill-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -8; // 8deg max tilt
            const rotateY = ((x - centerX) / centerX) * 8;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // Magnetic Buttons Hover Effect
    const magneticElements = document.querySelectorAll('.btn-primary, .btn-secondary, .social-links a');
    magneticElements.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // Magnet pull limits
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) scale(1.05)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });

    // Parallax Scroll Depth Effect
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const bgCanvas = document.querySelector('.hero-bg-canvas');
        if (bgCanvas) {
            // Slower background scrolling gives depth
            bgCanvas.style.transform = `translateY(${scrolled * 0.4}px)`;
        }
    });

    // --- Sci-Fi Particle Background Animation ---
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particlesArray;

        // Set canvas size
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        window.addEventListener('resize', function () {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            init();
        });

        // Particle constructor
        class Particle {
            constructor(x, y, dx, dy, size) {
                this.x = x;
                this.y = y;
                this.dx = dx;
                this.dy = dy;
                this.size = size;
            }

            // Draw particle
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = 'rgba(0, 210, 255, 0.5)'; // Electric blue color
                ctx.fill();
            }

            // Update particle position
            update() {
                if (this.x > canvas.width || this.x < 0) {
                    this.dx = -this.dx;
                }
                if (this.y > canvas.height || this.y < 0) {
                    this.dy = -this.dy;
                }

                // Mouse interaction can go here

                this.x += this.dx;
                this.y += this.dy;

                this.draw();
            }
        }

        // Initialize particles
        function init() {
            particlesArray = [];
            // Amount of particles based on screen width
            let numberOfParticles = (canvas.height * canvas.width) / 9000;
            if (numberOfParticles > 150) numberOfParticles = 150; // Cap particles for performance

            for (let i = 0; i < numberOfParticles; i++) {
                let size = (Math.random() * 2) + 1;
                let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
                let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
                // Slower particle movement for an elegant float
                let dx = (Math.random() * 0.4) - 0.2;
                let dy = (Math.random() * 0.4) - 0.2;

                particlesArray.push(new Particle(x, y, dx, dy, size));
            }
        }

        // Connect particles with lines
        function connect() {
            let opacityValue = 1;
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) +
                        ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));

                    if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                        opacityValue = 1 - (distance / 20000);
                        ctx.strokeStyle = 'rgba(111, 0, 255, ' + opacityValue + ')'; // Purple lines
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear entire canvas

            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
            }
            connect();
        }

        init();
        animate();
    }

    // --- Language Detection & Translation ---
    const userLang = navigator.language || navigator.userLanguage;
    const isFrench = userLang.toLowerCase().startsWith('fr');
    const targetLang = isFrench ? 'fr' : 'en';

    document.documentElement.lang = targetLang;

    const translatableElements = document.querySelectorAll('[data-en][data-fr]');

    translatableElements.forEach(el => {
        const translatedContent = el.getAttribute(`data-${targetLang}`);
        if (translatedContent) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = translatedContent;
            } else {
                el.innerHTML = translatedContent;
            }
        }
    });

});
