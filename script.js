// Smooth Scroll for Navigation Links
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

// Modal Functionality
const modal = document.getElementById('forviaModal');
const forviaCard = document.querySelector('[data-card="forvia"]');
const modalClose = document.querySelector('.modal-close');

if (forviaCard) {
    forviaCard.addEventListener('click', () => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
}

if (modalClose) {
    modalClose.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
}

// Close modal when clicking outside content
if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Animated Tag Rotation
const tags = document.querySelectorAll('.hero-tags .tag');
let currentTag = 0;

if (tags.length > 0) {
    setInterval(() => {
        tags[currentTag].style.transform = 'translateY(-3px)';
        tags[currentTag].style.borderColor = 'var(--accent)';
        
        setTimeout(() => {
            tags[currentTag].style.transform = '';
            tags[currentTag].style.borderColor = '';
        }, 500);
        
        currentTag = (currentTag + 1) % tags.length;
    }, 2000);
}

// Intersection Observer for Card Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards
document.querySelectorAll('.card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    cardObserver.observe(card);
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-content');
    
    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        hero.style.opacity = 1 - (scrolled / window.innerHeight);
    }
});

// Add active state to nav on scroll
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        nav.style.background = 'rgba(10, 10, 10, 0.95)';
    } else {
        nav.style.background = 'rgba(10, 10, 10, 0.8)';
    }
});

// Cursor glow effect on cards
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// Console message
console.log('%c👨‍💻 Portfolio by Hamdi Jawher', 'color: #6366f1; font-size: 16px; font-weight: bold;');
console.log('%cInterested in the code? Check out the GitHub repo!', 'color: #8b5cf6; font-size: 12px;');

// Morphing Circle Cursor
const cursor = document.createElement('div');
cursor.classList.add('custom-cursor');
document.body.appendChild(cursor);

let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;
let currentCard = null;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateCursor() {
    const ease = 0.15;
    cursorX += (mouseX - cursorX) * ease;
    cursorY += (mouseY - cursorY) * ease;
    
    if (currentCard) {
        // Morph to card shape
        const rect = currentCard.getBoundingClientRect();
        cursor.style.width = rect.width + 'px';
        cursor.style.height = rect.height + 'px';
        cursor.style.left = rect.left + 'px';
        cursor.style.top = rect.top + 'px';
        cursor.style.borderRadius = getComputedStyle(currentCard).borderRadius;
    } else {
        // Default circle
        cursor.style.width = '20px';
        cursor.style.height = '20px';
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        cursor.style.borderRadius = '50%';
    }
    
    requestAnimationFrame(animateCursor);
}
animateCursor();

// Card hover detection
const cards = document.querySelectorAll('.card');
cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        currentCard = card;
        border = '3px solid rgba(124, 58, 237, 1)'

    });
    
    card.addEventListener('mouseleave', () => {
        currentCard = null;
                cursor.style.border = '2px solid rgba(124, 58, 237, 0.8)';
