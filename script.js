// Mobile menu toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');

mobileMenuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    mobileMenuToggle.innerHTML = mobileMenu.classList.contains('active') ? 
        '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
});

// Close mobile menu when clicking a link
document.querySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Form handling
const contactForm = document.getElementById('contactForm');
const ctaForm = document.querySelector('.cta-form');
const successMessage = document.getElementById('successMessage');
let submissions = [];

// CTA Form submission
ctaForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('cta-email').value;
    
    if (!email || !isValidEmail(email)) {
        alert('Please enter a valid email address');
        return;
    }

    const submission = {
        email: email,
        timestamp: new Date().toISOString(),
        source: 'landing_page_cta',
        id: Date.now()
    };

    submissions.push(submission);
    successMessage.style.display = 'block';
    document.getElementById('cta-email').value = '';
    
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 5000);

    trackEvent('cta_form_submission', { email: email });
});

// Contact Form submission
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            program: document.getElementById('program').value,
            message: document.getElementById('message').value
        };

        const submission = handleContactForm(formData);
        const formMessage = document.getElementById('form-message');
        
        formMessage.textContent = 'Thank you for your message! We will contact you soon.';
        formMessage.classList.add('success');
        formMessage.style.display = 'block';
        
        contactForm.reset();
        
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function handleContactForm(formData) {
    const contactSubmission = {
        ...formData,
        timestamp: new Date().toISOString(),
        source: 'contact_form',
        id: Date.now()
    };
    
    submissions.push(contactSubmission);
    trackEvent('contact_form_submission', contactSubmission);
    return contactSubmission;
}

// Analytics tracking
function trackEvent(eventName, properties = {}) {
    console.log('Event tracked:', eventName, properties);
    // In a real app, this would send data to analytics service
}

// Track button clicks
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function() {
        trackEvent('button_click', {
            button_text: this.textContent.trim(),
            button_type: this.classList.contains('btn-primary') ? 'primary' : 
                        this.classList.contains('btn-secondary') ? 'secondary' : 'default',
            page_section: this.closest('section')?.id || 'unknown'
        });
    });
});

// Track scroll depth
let maxScrollDepth = 0;
window.addEventListener('scroll', () => {
    const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth;
        if (maxScrollDepth % 25 === 0) {
            trackEvent('scroll_depth', { depth: maxScrollDepth });
        }
    }
});

// Simple backend API simulation
const API = {
    submissions: submissions,
    
    getSubmissions() {
        return {
            success: true,
            data: this.submissions,
            count: this.submissions.length
        };
    },
    
    createSubmission(submissionData) {
        const newSubmission = {
            ...submissionData,
            id: Date.now(),
            timestamp: new Date().toISOString()
        };
        this.submissions.push(newSubmission);
        return {
            success: true,
            data: newSubmission,
            message: 'Submission created successfully'
        };
    },
    
    getSubmission(id) {
        const submission = this.submissions.find(s => s.id === parseInt(id));
        return submission ? 
            { success: true, data: submission } : 
            { success: false, message: 'Submission not found' };
    },
    
    getAnalytics() {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const todaySubmissions = this.submissions.filter(s => 
            new Date(s.timestamp) >= today
        );
        
        return {
            success: true,
            data: {
                total_submissions: this.submissions.length,
                today_submissions: todaySubmissions.length,
                sources: this.submissions.reduce((acc, s) => {
                    acc[s.source] = (acc[s.source] || 0) + 1;
                    return acc;
                }, {}),
                recent_submissions: this.submissions.slice(-5).reverse()
            }
        };
    }
};

window.gradnextAPI = API;

// Performance monitoring
window.addEventListener('load', () => {
    setTimeout(() => {
        const perfData = performance.timing;
        const loadTime = perfData.loadEventEnd - perfData.navigationStart;
        trackEvent('page_load_time', { 
            load_time_ms: loadTime,
            load_time_seconds: Math.round(loadTime / 1000 * 100) / 100
        });
    }, 0);
});

console.log('GradNext Landing Page Loaded');
console.log('Available API methods:', Object.keys(API));