// ========================
// Dark Mode Toggle
// ========================

const toggleButton = document.getElementById('dark-mode-toggle');
const downloadButton = document.getElementById('download-pdf');
const body = document.body;

/**
 * Initialize dark mode preference from localStorage
 * Defaults to light mode if no preference is saved
 */
function initializeDarkMode() {
    const savedMode = localStorage.getItem('darkMode');
    
    if (savedMode === 'enabled') {
        body.classList.add('dark-mode');
        updateToggleButton(true);
    } else {
        body.classList.remove('dark-mode');
        updateToggleButton(false);
    }
}

/**
 * Update toggle button text and appearance
 * @param {boolean} isDarkMode - True if dark mode is enabled
 */
function updateToggleButton(isDarkMode) {
    if (isDarkMode) {
        toggleButton.textContent = '☀️';
        toggleButton.setAttribute('title', 'Switch to light mode');
    } else {
        toggleButton.textContent = '🌙';
        toggleButton.setAttribute('title', 'Switch to dark mode');
    }
}

/**
 * Handle dark mode toggle click event
 */
toggleButton.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
        updateToggleButton(true);
    } else {
        localStorage.removeItem('darkMode');
        updateToggleButton(false);
    }
});

/**
 * Check system preference for dark mode if no saved preference exists
 * This provides a better user experience on first visit
 */
function checkSystemPreference() {
    const savedMode = localStorage.getItem('darkMode');
    
    // Only use system preference if user hasn't set a preference
    if (!savedMode) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (prefersDark) {
            body.classList.add('dark-mode');
            updateToggleButton(true);
        }
    }
}

/**
 * Listen for system dark mode preference changes
 */
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const savedMode = localStorage.getItem('darkMode');
    
    // Only auto-switch if user hasn't manually set a preference
    if (!savedMode) {
        if (e.matches) {
            body.classList.add('dark-mode');
        } else {
            body.classList.remove('dark-mode');
        }
        updateToggleButton(e.matches);
    }
});

// Initialize dark mode on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeDarkMode();
    checkSystemPreference();
});

// ========================
// PDF Download Functionality
// ========================

/**
 * Generate and download CV as PDF
 * Uses html2pdf library to convert the page content to PDF
 */
downloadButton.addEventListener('click', () => {
    // Disable button during download
    downloadButton.disabled = true;
    const originalText = downloadButton.innerHTML;
    downloadButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
    
    // Get the main content
    const element = document.querySelector('.main-content');
    
    // Configure PDF options
    const options = {
        margin: [10, 10, 10, 10],
        filename: 'Hesham-Azkoul-CV.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, allowTaint: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };
    
    // Generate PDF
    html2pdf()
        .set(options)
        .from(element)
        .save()
        .then(() => {
            // Re-enable button after download
            downloadButton.disabled = false;
            downloadButton.innerHTML = originalText;
        })
        .catch((error) => {
            console.error('PDF generation error:', error);
            downloadButton.disabled = false;
            downloadButton.innerHTML = originalText;
            alert('Error generating PDF. Please try again.');
        });
});

/**
 * Make download button keyboard accessible
 */
downloadButton.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        downloadButton.click();
    }
});

// ========================
// Smooth Scroll Enhancement
// ========================

/**
 * Smooth scroll to element on anchor link click
 */
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

// ========================
// Accessibility Enhancements
// ========================

/**
 * Add keyboard navigation support for dark mode toggle
 */
toggleButton.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleButton.click();
    }
});

/**
 * Reduce motion for users who prefer it
 */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
    const style = document.createElement('style');
    style.textContent = `
        * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
        }
    `;
    document.head.appendChild(style);
}

// ========================
// Performance Optimization
// ========================

/**
 * Lazy load images (if needed in future)
 */
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}
