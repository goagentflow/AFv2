/* Agent Flow Website JavaScript */

document.addEventListener('DOMContentLoaded', function() {
    // ===== NAVIGATION FUNCTIONALITY =====
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');
    const header = document.getElementById('header');

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('show-menu');
            
            // Toggle hamburger icon
            const icon = navToggle.querySelector('i');
            if (navMenu.classList.contains('show-menu')) {
                icon.setAttribute('data-feather', 'x');
            } else {
                icon.setAttribute('data-feather', 'menu');
            }
            feather.replace();
        });
    }

    // Close mobile menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('show-menu');
            const icon = navToggle.querySelector('i');
            icon.setAttribute('data-feather', 'menu');
            feather.replace();
        });
    });

    // ===== DROPDOWN FUNCTIONALITY =====
    const dropdownItems = document.querySelectorAll('.nav__item--dropdown');

    dropdownItems.forEach(dropdown => {
        const dropdownLink = dropdown.querySelector('.nav__link--dropdown');
        const submenu = dropdown.querySelector('.nav__dropdown');

        if (!dropdownLink || !submenu) return;

        // Ensure ARIA defaults
        dropdownLink.setAttribute('aria-haspopup', 'true');
        // If on mobile, the submenu is visible inline; reflect that
        dropdownLink.setAttribute('aria-expanded', window.innerWidth <= 767 ? 'true' : 'false');
        submenu.setAttribute('role', 'menu');
        submenu.querySelectorAll('a').forEach(a => a.setAttribute('role', 'menuitem'));

        const openDropdown = (focusFirst = false) => {
            dropdown.classList.add('is-active');
            dropdownLink.setAttribute('aria-expanded', 'true');
            if (focusFirst) {
                const firstItem = submenu.querySelector('.nav__dropdown-link');
                firstItem && firstItem.focus();
            }
        };

        const closeDropdown = () => {
            dropdown.classList.remove('is-active');
            dropdownLink.setAttribute('aria-expanded', window.innerWidth <= 767 ? 'true' : 'false');
        };

        // Click/tap toggle (mobile)
        dropdownLink.addEventListener('click', (e) => {
            // Prevent navigation for the toggle control
            e.preventDefault();
            if (window.innerWidth <= 767) {
                if (dropdown.classList.contains('is-active')) {
                    closeDropdown();
                } else {
                    openDropdown();
                }
            }
        });

        // Desktop hover: keep ARIA in sync
        dropdown.addEventListener('mouseenter', () => {
            if (window.innerWidth >= 768) {
                openDropdown();
            }
        });
        dropdown.addEventListener('mouseleave', () => {
            if (window.innerWidth >= 768) {
                closeDropdown();
            }
        });

        // Keyboard support
        dropdownLink.addEventListener('keydown', (e) => {
            const key = e.key;
            if (key === 'Enter' || key === ' ') {
                e.preventDefault();
                if (dropdown.classList.contains('is-active')) {
                    closeDropdown();
                } else {
                    openDropdown(true);
                }
            } else if (key === 'ArrowDown') {
                e.preventDefault();
                openDropdown(true);
            } else if (key === 'Escape') {
                closeDropdown();
                dropdownLink.focus();
            }
        });

        submenu.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                closeDropdown();
                dropdownLink.focus();
            }
        });

        // Mobile dropdown item click: close menu and reset icons
        const dropdownLinks = dropdown.querySelectorAll('.nav__dropdown-link');
        dropdownLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('show-menu');
                closeDropdown();
                const icon = navToggle.querySelector('i');
                if (icon) {
                    icon.setAttribute('data-feather', 'menu');
                    feather.replace();
                }
            });
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav__item--dropdown')) {
            dropdownItems.forEach(dropdown => {
                dropdown.classList.remove('is-active');
                const link = dropdown.querySelector('.nav__link--dropdown');
                if (link) link.setAttribute('aria-expanded', window.innerWidth <= 767 ? 'true' : 'false');
            });
        }
    });

    // ===== HEADER SCROLL EFFECT =====
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        if (scrollY >= 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Back to top button visibility
        const backToTopBtn = document.getElementById('back-to-top');
        if (scrollY >= window.innerHeight * 2) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }
            
            const targetElement = document.querySelector(href);
            
            if (targetElement) {
                e.preventDefault();
                const headerHeight = document.getElementById('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20; // 20px buffer
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== HANDLE INITIAL HASH ON PAGE LOAD =====
    // Scroll to anchor if URL contains a hash (with delay for animations)
    if (window.location.hash) {
        const targetElement = document.querySelector(window.location.hash);
        if (targetElement) {
            // Small delay to allow page to render and animations to initialize
            setTimeout(() => {
                const headerHeight = document.getElementById('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }, 100);
        }
    }

    // ===== BACK TO TOP FUNCTIONALITY =====
    const backToTopBtn = document.getElementById('back-to-top');
    
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Unobserve after animation to improve performance
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all elements with fade-in class
    const fadeInElements = document.querySelectorAll('.fade-in');
    fadeInElements.forEach(element => {
        observer.observe(element);
    });

    // ===== CONTACT FORM FUNCTIONALITY =====
    const contactForm = document.getElementById('contact-form');
    const contactFormModal = document.getElementById('contact-form-modal');
    const contactFormClose = document.getElementById('contact-form-close');

    // Close modal functionality
    if (contactFormClose && contactFormModal) {
        contactFormClose.addEventListener('click', () => {
            contactFormModal.classList.remove('show');
        });

        // Close modal when clicking outside
        contactFormModal.addEventListener('click', (e) => {
            if (e.target === contactFormModal) {
                contactFormModal.classList.remove('show');
            }
        });

        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && contactFormModal.classList.contains('show')) {
                contactFormModal.classList.remove('show');
            }
        });
    }

    // Form submission handling
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            // Show loading state
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            
            // Remove any existing success/error messages
            const existingMessages = this.querySelectorAll('.form-success, .form-error');
            existingMessages.forEach(msg => msg.remove());
            
            try {
                const formData = new FormData(this);
                const response = await fetch(this.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    // Success
                    this.reset();
                    const successMsg = document.createElement('div');
                    successMsg.className = 'form-success';
                    successMsg.textContent = 'Thank you! Your message has been sent successfully.';
                    this.appendChild(successMsg);
                    
                    // Close modal after 2 seconds
                    setTimeout(() => {
                        contactFormModal.classList.remove('show');
                        successMsg.remove();
                    }, 2000);
                    
                } else {
                    throw new Error('Form submission failed');
                }
                
            } catch (error) {
                // Error
                const errorMsg = document.createElement('div');
                errorMsg.className = 'form-error';
                errorMsg.textContent = 'Something went wrong. Please try again later.';
                this.appendChild(errorMsg);
                
                console.error('Form submission error:', error);
            } finally {
                // Reset button state
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    }

    // ===== CALENDLY INTEGRATION HELPERS =====
    window.openContactForm = function() {
        if (contactFormModal) {
            contactFormModal.classList.add('show');
        }
    };

    // Function to check if Calendly URL is configured
    window.checkCalendlyConfig = function() {
        const calendlyButtons = document.querySelectorAll('[onclick*="Calendly"]');
        calendlyButtons.forEach(button => {
            const onclickAttr = button.getAttribute('onclick');
            if (onclickAttr.includes('CALENDLY_URL_PLACEHOLDER')) {
                console.warn('Calendly URL not configured. Using contact form as fallback.');
                // Replace onclick with contact form modal
                button.setAttribute('onclick', 'openContactForm()');
                button.innerHTML = button.innerHTML.replace('Book a Discovery Call', 'Contact Us');
            }
        });
    };

    // Check Calendly configuration on load
    window.checkCalendlyConfig();

    // ===== BOTTLENECK FLOW FUNCTIONALITY =====
    const bottleneckModal = document.getElementById('bottleneck-flow-modal');
    const bottleneckClose = document.getElementById('bottleneck-flow-close');
    const bottleneckStep1 = document.getElementById('bottleneck-step-1');
    const bottleneckStep2 = document.getElementById('bottleneck-step-2');
    const bottleneckSuccess = document.getElementById('bottleneck-success');
    const bottleneckForm = document.getElementById('bottleneck-form');
    const bottleneckNextBtn = document.getElementById('bottleneck-next-btn');
    const bottleneckBackBtn = document.getElementById('bottleneck-back-btn');

    // Open bottleneck flow
    window.openBottleneckFlow = function() {
        if (bottleneckModal) {
            bottleneckModal.style.display = 'flex';
            showBottleneckStep(1);
        }
    };

    // Close bottleneck flow
    function closeBottleneckFlow() {
        if (bottleneckModal) {
            bottleneckModal.style.display = 'none';
            // Reset to step 1
            showBottleneckStep(1);
        }
    }

    // Show specific bottleneck step
    function showBottleneckStep(stepNumber) {
        // Hide all steps
        [bottleneckStep1, bottleneckStep2, bottleneckSuccess].forEach(step => {
            if (step) step.style.display = 'none';
        });

        // Show requested step
        if (stepNumber === 1 && bottleneckStep1) {
            bottleneckStep1.style.display = 'block';
        } else if (stepNumber === 2 && bottleneckStep2) {
            bottleneckStep2.style.display = 'block';
            loadCalendlyWidget();
        } else if (stepNumber === 3 && bottleneckSuccess) {
            bottleneckSuccess.style.display = 'block';
        }
    }

    // Load Calendly widget in step 2
    function loadCalendlyWidget() {
        const calendlyContainer = document.getElementById('calendly-inline-widget');
        if (calendlyContainer && window.Calendly) {
            const company = document.getElementById('bottleneck-company')?.value || '';
            const role = document.getElementById('bottleneck-role')?.value || '';
            const problem = document.getElementById('bottleneck-problem')?.value || '';
            
            window.Calendly.initInlineWidget({
                url: 'https://calendly.com/hamish-goagentflow/30-minute-intro-call?utm_source=agentflow_website&utm_medium=discovery_form&utm_campaign=bottleneck_flow',
                parentElement: calendlyContainer,
                prefill: {
                    name: document.getElementById('bottleneck-name')?.value || '',
                    email: document.getElementById('bottleneck-email')?.value || '',
                    customAnswers: {
                        a1: `AgentFlow Website - Discovery Form${company ? ` | Company: ${company}` : ''}${role ? ` | Role: ${role}` : ''}`,
                        a2: problem ? `Problem: ${problem.substring(0, 250)}` : 'Via AgentFlow Discovery Form'
                    }
                }
            });
        }
    }

    // Handle form submission and progression
    if (bottleneckNextBtn) {
        bottleneckNextBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const form = bottleneckForm;
            if (form && form.checkValidity()) {
                // Show loading state
                const originalText = bottleneckNextBtn.textContent;
                bottleneckNextBtn.textContent = 'Processing...';
                bottleneckNextBtn.disabled = true;

                // Submit form data to Formspree
                const formData = new FormData(form);
                
                fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                })
                .then(response => {
                    if (response.ok) {
                        // Success - move to step 2
                        showBottleneckStep(2);
                    } else {
                        throw new Error('Form submission failed');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('There was an error submitting your information. Please try again.');
                })
                .finally(() => {
                    // Reset button
                    bottleneckNextBtn.textContent = originalText;
                    bottleneckNextBtn.disabled = false;
                });
            } else {
                // Show validation errors
                form.reportValidity();
            }
        });
    }

    // Handle back button
    if (bottleneckBackBtn) {
        bottleneckBackBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showBottleneckStep(1);
        });
    }

    // Handle close button
    if (bottleneckClose) {
        bottleneckClose.addEventListener('click', closeBottleneckFlow);
    }

    // Handle clicking outside modal to close
    if (bottleneckModal) {
        bottleneckModal.addEventListener('click', function(e) {
            if (e.target === bottleneckModal) {
                closeBottleneckFlow();
            }
        });
    }

    // Handle escape key to close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && bottleneckModal && bottleneckModal.style.display !== 'none') {
            closeBottleneckFlow();
        }
    });

    // ===== PROGRESSIVE ENHANCEMENT CHECK =====
    // Verify core functionality works without JavaScript
    console.log('JavaScript loaded successfully. All interactive features are now enabled.');
    
    // Add a class to body to indicate JS is loaded (for CSS styling)
    document.body.classList.add('js-loaded');

    // ===== PERFORMANCE OPTIMIZATIONS =====
    // Lazy load images if any are added later
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // ===== ACCESSIBILITY ENHANCEMENTS =====
    // Keyboard navigation for mobile menu
    if (navToggle) {
        navToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navToggle.click();
            }
        });
    }

    // Focus management for modal
    if (contactFormModal) {
        contactFormModal.addEventListener('show', () => {
            const firstInput = contactFormModal.querySelector('input, textarea');
            if (firstInput) {
                firstInput.focus();
            }
        });
    }

    // ===== ERROR HANDLING =====
    window.addEventListener('error', (e) => {
        console.error('JavaScript error:', e.error);
        // Could send error to analytics service here
    });

    // ===== USE CASES EXPANDABLE FUNCTIONALITY =====
    const useCaseCards = document.querySelectorAll('.use-case__card--expandable');

    useCaseCards.forEach((card, index) => {
        const header = card.querySelector('.use-case__header');

        const clickHandler = (e) => {
            e.preventDefault();
            toggleCard(card);
        };

        // Attach a single listener to the entire header
        if (header) {
            header.addEventListener('click', clickHandler);
            header.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleCard(card);
                }
            });

            // Make focusable and set initial ARIA attributes
            header.setAttribute('tabindex', '0');
            header.setAttribute('role', 'button');
            updateAriaLabels(card, false);
        }
    });

    function collapseCard(card) {
        card.classList.remove('expanded');
        const content = card.querySelector('.use-case__content');
        if (content) content.style.maxHeight = '0';
        updateAriaLabels(card, false);
    }

    function expandCard(card) {
        card.classList.add('expanded');
        const content = card.querySelector('.use-case__content');
        if (content) content.style.maxHeight = content.scrollHeight + 'px';
        updateAriaLabels(card, true);
    }

    function updateAriaLabels(card, isExpanded) {
        const header = card.querySelector('.use-case__header');
        const toggle = card.querySelector('.use-case__toggle');
        const title = card.querySelector('.use-case__title')?.textContent.trim();
        const label = isExpanded ? `Collapse ${title} use case` : `Expand ${title} use case`;

        [header, toggle].forEach(element => {
            if (element) {
                element.setAttribute('aria-expanded', isExpanded);
                element.setAttribute('aria-label', label);
            }
        });
    }

    function toggleCard(clickedCard) {
        const isAlreadyExpanded = clickedCard.classList.contains('expanded');

        // First, collapse all cards
        useCaseCards.forEach(card => {
            if (card.classList.contains('expanded')) {
                collapseCard(card);
            }
        });

        // If the clicked card was not already expanded, expand it
        if (!isAlreadyExpanded) {
            expandCard(clickedCard);
        }
    }
    
    // ===== DEVELOPMENT HELPERS =====
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('Development mode detected. Additional debugging available.');
        
        // Add helper function to test animations
        window.testAnimations = function() {
            const fadeElements = document.querySelectorAll('.fade-in.visible');
            fadeElements.forEach(el => {
                el.classList.remove('visible');
                setTimeout(() => el.classList.add('visible'), 100);
            });
        };
        
        // Add helper to test form
        window.testForm = function() {
            const form = document.getElementById('contact-form');
            if (form) {
                form.name.value = 'Test User';
                form.email.value = 'test@example.com';
                form.company.value = 'Test Company';
                form.message.value = 'This is a test message.';
            }
        };
        
        // Add helper to test use cases
        window.testUseCases = function() {
            const cards = document.querySelectorAll('.use-case__card--expandable');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    const content = card.querySelector('.use-case__content');
                    if (content) {
                        toggleCard(card, content);
                    }
                }, index * 200);
            });
        };
        
        // Add helper to expand all use cases
        window.expandAllUseCases = function() {
            const cards = document.querySelectorAll('.use-case__card--expandable:not(.expanded)');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    const content = card.querySelector('.use-case__content');
                    if (content) {
                        toggleCard(card, content);
                    }
                }, index * 100);
            });
        };
        
        // Add helper to collapse all use cases
        window.collapseAllUseCases = function() {
            const cards = document.querySelectorAll('.use-case__card--expandable.expanded');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    const content = card.querySelector('.use-case__content');
                    if (content) {
                        toggleCard(card, content);
                    }
                }, index * 100);
            });
        };
    }
});

// ===== UTILITIES =====
// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Debounce function for resize events
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Export for potential use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { throttle, debounce };
}
