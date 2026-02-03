// =============================================
// AVENOIR.AI - Main JavaScript
// =============================================

document.addEventListener('DOMContentLoaded', function () {

    // ========== Header Scroll Effect ==========
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // ========== Mobile Menu Toggle ==========
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });
    }

    // ========== Smooth Scroll for Anchor Links ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // ========== Intersection Observer for Animations ==========
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all reveal elements
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
        revealObserver.observe(el);
    });

    // ========== Stats Counter Animation ==========
    const statNumbers = document.querySelectorAll('.stat__number');

    function animateValue(element, start, end, duration) {
        const isPercentage = end.toString().includes('%');
        const isPlus = end.toString().includes('+');
        const numericEnd = parseInt(end.toString().replace(/[^0-9]/g, ''));

        let startTime = null;

        function animate(currentTime) {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeOut * numericEnd);

            let display = current.toString();
            if (isPlus) display += '+';
            if (isPercentage) display = current + '%';

            element.textContent = display;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = end;
            }
        }

        requestAnimationFrame(animate);
    }

    if (statNumbers.length > 0) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const endValue = target.textContent;
                    target.textContent = '0';
                    animateValue(target, 0, endValue, 2000);
                    counterObserver.unobserve(target);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(el => counterObserver.observe(el));
    }

    // ========== Case Studies Metric Counter Animation ==========
    const caseMetrics = document.querySelectorAll('.case-card__metric-value[data-count]');

    function animateCounter(element, target, duration = 1500) {
        let startTime = null;
        const startValue = 0;

        function update(currentTime) {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeOut * target);

            element.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = target;
            }
        }

        requestAnimationFrame(update);
    }

    if (caseMetrics.length > 0) {
        const metricsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const targetValue = parseInt(el.getAttribute('data-count'));
                    animateCounter(el, targetValue);
                    metricsObserver.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        caseMetrics.forEach(el => metricsObserver.observe(el));
    }

    // ========== Process Timeline Animation ==========
    const processTimeline = document.querySelector('.process__timeline');
    if (processTimeline) {
        const processObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('scrolled-in');
                    processObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        processObserver.observe(processTimeline);
    }

    // ========== Staggered Reveal (Services) ==========
    const staggerItems = document.querySelectorAll('.service-card');
    if (staggerItems.length > 0) {
        // Add reveal class initial state
        staggerItems.forEach(el => el.classList.add('reveal-stagger'));

        const staggerObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    // Find index to calculate delay
                    const index = Array.from(staggerItems).indexOf(entry.target);
                    // Mobile optimization: Less delay to feel snappier
                    const delay = window.innerWidth < 768 ? 50 : 100;

                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index % 3 * delay); // Stagger by column group

                    staggerObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        staggerItems.forEach(el => staggerObserver.observe(el));
    }

    // ========== 3D Tilt Effect (Services) ==========
    const tiltCards = document.querySelectorAll('.service-card');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', handleTilt);
        card.addEventListener('mouseleave', resetTilt);
    });

    function handleTilt(e) {
        if (window.innerWidth < 1024) return; // Disable on tablet/mobile for performance

        const card = this;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -5; // Max 5deg tilt
        const rotateY = ((x - centerX) / centerX) * 5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    }

    function resetTilt() {
        this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        this.style.transition = 'transform 0.5s ease';
    }

    // ========== System Core Interaction (Holo + Terminal) ==========
    const holoCards = document.querySelectorAll('.holo-card');
    const terminalContent = document.getElementById('terminalContent');
    const defaultTerminalHTML = `
        <div class="cmd-line"><span class="cmd-prompt">></span> SYSTEM_INIT... [COMPLETE]</div>
        <div class="cmd-line"><span class="cmd-prompt">></span> AWAITING_MODULE_SELECTION...</div>
        <div class="cmd-line"><span class="cmd-prompt">></span> _<span class="cmd-cursor"></span></div>
    `;

    const serviceData = {
        'salesforce': [
            "DETECTED_MODULE: <span class='cmd-highlight'>SALESFORCE_CLOUD</span>",
            "STATUS: OPTIMIZED_FOR_GROWTH",
            "ACTION: SCALING_REVENUE_OPERATIONS...",
            "> Deploying Avenoir Custom Apex Triggers...",
            "<span class='cmd-success'>SUCCESS: Lead Conversion +40%</span>"
        ],
        'data': [
            "DETECTED_MODULE: <span class='cmd-highlight'>MODERN_DATA_STACK</span>",
            "PIPELINE: SNOWFLAKE_DATABRICKS_MESH",
            "ACTION: ACTIVATING_REAL_TIME_ETL...",
            "> Ingesting 10M+ Rows/Hr...",
            "<span class='cmd-success'>SUCCESS: Instant BI Dashboard Ready</span>"
        ],
        'ai': [
            "DETECTED_MODULE: <span class='cmd-highlight'>GENERATIVE_AI_CORE</span>",
            "MODEL: CUSTOM_LLM_FINE_TUNING",
            "ACTION: AUTOMATING_WORKFLOWS...",
            "> Predicting Market Trends with 98% Accuracy...",
            "<span class='cmd-success'>SUCCESS: Strategic Advantage Unlocked</span>"
        ],
        'sap': [
            "DETECTED_MODULE: <span class='cmd-highlight'>SAP_ENTERPRISE_ERP</span>",
            "PROTOCOL: GLOBAL_SUPPLY_CHAIN",
            "ACTION: SYNCHRONIZING_LOGISTICS...",
            "> Reducing Inventory Latency...",
            "<span class='cmd-success'>SUCCESS: Operational Costs Reduced by 25%</span>"
        ]
    };

    const serviceColors = {
        'salesforce': '#38bdf8', // Sky Blue
        'data': '#f59e0b',       // Amber
        'ai': '#ef4444',         // Red (High Contrast)
        'sap': '#10b981'         // Emerald
    };

    holoCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const serviceKey = card.dataset.service;
            if (serviceData[serviceKey]) {
                const color = serviceColors[serviceKey] || '#38bdf8';

                // Clone and modify lines to inject the specific color
                const lines = serviceData[serviceKey].map(line => {
                    // Replace the generic class with the specific color style for this service
                    // Handle BOTH 'cmd-highlight' and 'cmd-success'
                    return line
                        .replace("class='cmd-highlight'", `style='color: ${color}; font-weight: 700;'`)
                        .replace("class='cmd-success'", `style='color: ${color}; font-weight: 700;'`);
                });

                let html = `<div class="cmd-line"><span class="cmd-prompt" style="color: ${color}">></span> TARGET_LOCKED: <span style="color: ${color}">${serviceKey.toUpperCase()}</span></div>`;

                // Animate typing effect conceptually by adding lines
                terminalContent.innerHTML = html;

                lines.forEach((line, index) => {
                    setTimeout(() => {
                        const div = document.createElement('div');
                        div.className = 'cmd-line';
                        // Also color the prompt for this session
                        div.innerHTML = `<span class="cmd-prompt" style="color: ${color}">></span> ${line}`;
                        terminalContent.appendChild(div);
                        // Auto scroll to bottom
                        terminalContent.scrollTop = terminalContent.scrollHeight;
                    }, index * 150);
                });
            }
        });

        card.addEventListener('mouseleave', () => {
            // Optional: Reset after a delay or keep last state
            // terminalContent.innerHTML = defaultTerminalHTML; 
        });
    });

    // ========== Form Handling ==========
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const formData = new FormData(this);
            const data = Object.fromEntries(formData);

            if (!data.name || !data.email || !data.message) {
                alert('Please fill in all required fields.');
                return;
            }

            // TODO: Replace with actual form submission
            alert('Thank you for your message! We\'ll get back to you within 24 hours.');
            this.reset();
        });
    }

    // ========== Parallax effect on hero (subtle) ==========
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            const parallaxElements = hero.querySelectorAll('.hero__particles span');
            parallaxElements.forEach((el, index) => {
                const speed = 0.1 + (index * 0.02);
                el.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }

});
