// Select the toggle button and the body
const toggleButton = document.getElementById('dark-mode-toggle');
const body = document.body;

// Check if user has a saved preference for dark mode
const savedMode = localStorage.getItem('darkMode');
if (savedMode === 'enabled') {
    body.classList.add('dark-mode');
    toggleButton.textContent = '☀️';
}

// Event listener for toggle button
toggleButton.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    // Update the button text based on current mode
    if (body.classList.contains('dark-mode')) {
        toggleButton.textContent = '☀️';
        localStorage.setItem('darkMode', 'enabled');
    } else {
        toggleButton.textContent = '🌙';
        localStorage.removeItem('darkMode');
    }
});
