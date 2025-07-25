// Mobile menu toggle
const mobileMenu = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.nav-links');

mobileMenu.addEventListener('click', () => {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
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
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Form submission simulation with backend storage
let submissions = [];

function submitForm() {
    const email = document.getElementById('email').value;
    const successMessage = document.getElementById('successMessage');
    
    if (!email || !isValidEmail(email)) {
        alert('Please enter a valid email address');
        return;
    }

    // Simulate form submission to backend
    const submission = {
        email: email,
        timestamp: new Date().toISOString(),
        source: 'landing_page_cta',
        id: Date.now()
    };

    // Store in memory (simulating backend storage)
    submissions.push(submission);
    
    // Show success message
    successMessage.style.display = 'block';
    document.getElementById('email').value = '';
    
    // Hide success message after 5 seconds
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 5000);

    // Log submission for demonstration
    console.log('Form submitted:', submission);
    console.log('All submissions:', submissions);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Allow form submission with Enter key
document.getElementById('email').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        submitForm();
    }
});

// Contact form handler (for demonstration)
function handleContactForm(formData) {
    const contactSubmission = {
        ...formData,
        timestamp: new Date().toISOString(),
        source: 'contact_form',
        id: Date.now()
    };
    
    submissions.push(contactSubmission);
    console.log('Contact form submitted:', contactSubmission);
    return contactSubmission;
}

// Analytics tracking simulation
function trackEvent(eventName, properties = {}) {
    console.log('Event tracked:', eventName, properties);
}

// Track button clicks
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        trackEvent('button_click', {
            button_text: this.textContent.trim(),
            button_class: this.className,
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
        if (maxScrollDepth % 25 === 0) { // Track at 25%, 50%, 75%, 100%
            trackEvent('scroll_depth', { depth: maxScrollDepth });
        }
    }
});

// Simple backend API simulation
const API = {
    submissions: submissions,
    
    // GET all submissions
    getSubmissions() {
        return {
            success: true,
            data: this.submissions,
            count: this.submissions.length
        };
    },
    
    // POST new submission
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
    
    // GET submission by ID
    getSubmission(id) {
        const submission = this.submissions.find(s => s.id === parseInt(id));
        return submission ? 
            { success: true, data: submission } : 
            { success: false, message: 'Submission not found' };
    },
    
    // Simple analytics
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

// Expose API for testing (in real app, this would be server endpoints)
window.gradnextAPI = API;

// Demo: Log API capabilities
console.log('GradNext Landing Page Loaded');
console.log('Available API methods:', Object.keys(API));
console.log('Try: gradnextAPI.getAnalytics()');

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