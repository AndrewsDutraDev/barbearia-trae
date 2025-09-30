// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== VARIÁVEIS GLOBAIS =====
    const header = document.getElementById('header');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const appointmentForm = document.getElementById('appointmentForm');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const lightbox = document.getElementById('lightbox');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxImage = document.querySelector('.lightbox-image');

    // ===== MENU MOBILE =====
    function initMobileMenu() {
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', function() {
                navToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
                document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
            });

            // Fechar menu ao clicar em um link
            navLinks.forEach(link => {
                link.addEventListener('click', function() {
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.style.overflow = '';
                });
            });

            // Fechar menu ao clicar fora
            document.addEventListener('click', function(e) {
                if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }
    }

    // ===== HEADER FIXO COM SCROLL =====
    function initScrollHeader() {
        if (header) {
            window.addEventListener('scroll', function() {
                if (window.scrollY > 100) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            });
        }
    }

    // ===== SCROLL SUAVE =====
    function initSmoothScroll() {
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection && header) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Scroll suave para botões CTA
        const ctaButtons = document.querySelectorAll('a[href^="#"]');
        ctaButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection && header) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ===== ANIMAÇÕES DE SCROLL =====
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll, .service-card, .gallery-item, .about-text, .hero-content');
        
        if (animatedElements.length > 0) {
            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            animatedElements.forEach(element => {
                observer.observe(element);
            });
        }

        // Animação dos números das estatísticas
        const statNumbers = document.querySelectorAll('.stat-number');
        if (statNumbers.length > 0) {
            const statsObserver = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateNumber(entry.target);
                        statsObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            statNumbers.forEach(stat => {
                statsObserver.observe(stat);
            });
        }
    }

    // Função para animar números
    function animateNumber(element) {
        const target = parseInt(element.textContent.replace(/\D/g, ''));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            const suffix = element.textContent.includes('+') ? '+' : '';
            element.textContent = Math.floor(current) + suffix;
        }, 16);
    }

    // ===== FILTROS DA GALERIA =====
    function initGalleryFilters() {
        if (filterBtns.length > 0 && galleryItems.length > 0) {
            filterBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    const filter = this.getAttribute('data-filter');
                    
                    // Atualizar botão ativo
                    filterBtns.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Filtrar itens
                    galleryItems.forEach(item => {
                        if (filter === 'all' || item.classList.contains(filter)) {
                            item.style.display = 'block';
                            setTimeout(() => {
                                item.style.opacity = '1';
                                item.style.transform = 'scale(1)';
                            }, 10);
                        } else {
                            item.style.opacity = '0';
                            item.style.transform = 'scale(0.8)';
                            setTimeout(() => {
                                item.style.display = 'none';
                            }, 300);
                        }
                    });
                });
            });
        }
    }

    // ===== LIGHTBOX =====
    function initLightbox() {
        if (galleryItems.length > 0 && lightbox && lightboxImage && lightboxClose) {
            galleryItems.forEach(item => {
                item.addEventListener('click', function() {
                    const img = this.querySelector('img');
                    if (img) {
                        lightboxImage.src = img.src;
                        lightboxImage.alt = img.alt;
                        lightbox.classList.add('active');
                        document.body.style.overflow = 'hidden';
                    }
                });
            });

            // Fechar lightbox
            lightboxClose.addEventListener('click', closeLightbox);
            lightbox.addEventListener('click', function(e) {
                if (e.target === lightbox) {
                    closeLightbox();
                }
            });

            // Fechar com ESC
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                    closeLightbox();
                }
            });
        }
    }

    function closeLightbox() {
        if (lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // ===== VALIDAÇÃO DO FORMULÁRIO =====
    function initFormValidation() {
        if (appointmentForm) {
            const nameInput = appointmentForm.querySelector('#name');
            const phoneInput = appointmentForm.querySelector('#phone');
            const serviceSelect = appointmentForm.querySelector('#service');
            const dateInput = appointmentForm.querySelector('#date');
            const timeSelect = appointmentForm.querySelector('#time');

            appointmentForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                let isValid = true;
                
                // Validar nome
                if (!nameInput.value.trim()) {
                    showError(nameInput, 'Nome é obrigatório');
                    isValid = false;
                } else {
                    showSuccess(nameInput);
                }
                
                // Validar telefone
                if (!phoneInput.value.trim() || phoneInput.value.length < 14) {
                    showError(phoneInput, 'Telefone válido é obrigatório');
                    isValid = false;
                } else {
                    showSuccess(phoneInput);
                }
                
                // Validar serviço
                if (!serviceSelect.value) {
                    showError(serviceSelect, 'Selecione um serviço');
                    isValid = false;
                } else {
                    showSuccess(serviceSelect);
                }
                
                // Validar data
                if (!dateInput.value) {
                    showError(dateInput, 'Data é obrigatória');
                    isValid = false;
                } else {
                    showSuccess(dateInput);
                }
                
                // Validar horário
                if (!timeSelect.value) {
                    showError(timeSelect, 'Horário é obrigatório');
                    isValid = false;
                } else {
                    showSuccess(timeSelect);
                }
                
                if (isValid) {
                    showSuccessMessage();
                    appointmentForm.reset();
                }
            });

            // Validação em tempo real
            [nameInput, phoneInput, serviceSelect, dateInput, timeSelect].forEach(input => {
                if (input) {
                    input.addEventListener('blur', function() {
                        validateField(this);
                    });
                    
                    input.addEventListener('input', function() {
                        clearError(this);
                    });
                }
            });
        }
    }

    function validateField(field) {
        const value = field.value.trim();
        
        switch (field.id) {
            case 'name':
                if (!value) {
                    showError(field, 'Nome é obrigatório');
                } else {
                    showSuccess(field);
                }
                break;
            case 'phone':
                if (!value || value.length < 14) {
                    showError(field, 'Telefone válido é obrigatório');
                } else {
                    showSuccess(field);
                }
                break;
            case 'service':
                if (!value) {
                    showError(field, 'Selecione um serviço');
                } else {
                    showSuccess(field);
                }
                break;
            case 'date':
                if (!value) {
                    showError(field, 'Data é obrigatória');
                } else {
                    showSuccess(field);
                }
                break;
            case 'time':
                if (!value) {
                    showError(field, 'Horário é obrigatório');
                } else {
                    showSuccess(field);
                }
                break;
        }
    }

    function showError(field, message) {
        field.classList.add('error');
        field.classList.remove('success');
        
        let errorElement = field.parentNode.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('span');
            errorElement.className = 'error-message';
            field.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }

    function showSuccess(field) {
        field.classList.add('success');
        field.classList.remove('error');
        
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }

    function clearError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }

    function showSuccessMessage() {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <div class="success-content">
                <h3>Agendamento Realizado!</h3>
                <p>Seu agendamento foi enviado com sucesso. Entraremos em contato em breve para confirmar.</p>
            </div>
        `;
        
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            successDiv.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(successDiv);
            }, 300);
        }, 3000);
    }

    // ===== MÁSCARA DE TELEFONE =====
    function initPhoneMask() {
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                
                if (value.length <= 11) {
                    value = value.replace(/(\d{2})(\d)/, '($1) $2');
                    value = value.replace(/(\d{4})(\d)/, '$1-$2');
                    value = value.replace(/(\d{4})-(\d)(\d{4})/, '$1$2-$3');
                }
                
                e.target.value = value;
            });
        }
    }

    // ===== RESTRIÇÕES DE DATA =====
    function initDateRestrictions() {
        const dateInput = document.getElementById('date');
        if (dateInput) {
            // Definir data mínima como hoje
            const today = new Date();
            const minDate = today.toISOString().split('T')[0];
            dateInput.setAttribute('min', minDate);
            
            // Definir data máxima como 3 meses à frente
            const maxDate = new Date();
            maxDate.setMonth(maxDate.getMonth() + 3);
            dateInput.setAttribute('max', maxDate.toISOString().split('T')[0]);
        }
    }

    // ===== NAVEGAÇÃO ATIVA =====
    function initActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        
        if (sections.length > 0 && navLinks.length > 0) {
            window.addEventListener('scroll', function() {
                const scrollPosition = window.scrollY + 100;
                
                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.offsetHeight;
                    const sectionId = section.getAttribute('id');
                    
                    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                        navLinks.forEach(link => {
                            link.classList.remove('active');
                            if (link.getAttribute('href') === `#${sectionId}`) {
                                link.classList.add('active');
                            }
                        });
                    }
                });
            });
        }
    }

    // ===== INICIALIZAÇÃO =====
    function init() {
        initMobileMenu();
        initScrollHeader();
        initSmoothScroll();
        initScrollAnimations();
        initGalleryFilters();
        initLightbox();
        initFormValidation();
        initPhoneMask();
        initDateRestrictions();
        initActiveNavigation();
        
        console.log('Site da Barbearia carregado com sucesso!');
    }

    // Inicializar todas as funcionalidades
    init();
});

// ===== FUNÇÕES UTILITÁRIAS =====

// Debounce para otimizar performance em eventos de scroll
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle para otimizar performance
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

// Verificar se é dispositivo móvel
function isMobile() {
    return window.innerWidth <= 768;
}

// Função de scroll suave personalizada
function smoothScrollTo(target, duration = 1000) {
    const targetElement = document.querySelector(target);
    if (!targetElement) return;

    const targetPosition = targetElement.offsetTop;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
}