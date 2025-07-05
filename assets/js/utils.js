// Utility functions for the gaming catalog

// Debounce function for search optimization
export function debounce(func, wait) {
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

// Lazy loading for images
export function lazyLoadImages() {
  const images = document.querySelectorAll('img[data-src]');
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach(img => imageObserver.observe(img));
}

// Local storage utilities
export const storage = {
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  },

  get(key) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.warn('Failed to read from localStorage:', error);
      return null;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('Failed to remove from localStorage:', error);
    }
  }
};

// Error handling utility
export function handleError(error, context = '') {
  console.error(`Error ${context}:`, error);
  
  // Show user-friendly error message
  const errorMessage = document.createElement('div');
  errorMessage.className = 'error-message';
  errorMessage.textContent = 'Algo deu errado. Tente novamente.';
  errorMessage.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #ff4444;
    color: white;
    padding: 16px;
    border-radius: 8px;
    z-index: 10000;
    animation: slideIn 0.3s ease;
  `;
  
  document.body.appendChild(errorMessage);
  
  setTimeout(() => {
    errorMessage.remove();
  }, 5000);
}

// Performance monitoring
export function measurePerformance(name, fn) {
  return async function(...args) {
    const start = performance.now();
    try {
      const result = await fn.apply(this, args);
      const end = performance.now();
      console.log(`${name} took ${end - start} milliseconds`);
      return result;
    } catch (error) {
      const end = performance.now();
      console.log(`${name} failed after ${end - start} milliseconds`);
      throw error;
    }
  };
}

// Mobile menu toggle
export function initMobileMenu() {
  const menuToggle = document.createElement('button');
  menuToggle.className = 'menu-toggle';
  menuToggle.innerHTML = '☰';
  menuToggle.style.cssText = `
    position: fixed;
    top: 20px;
    left: 20px;
    z-index: 1001;
    background: var(--primary-bg);
    color: var(--primary-text);
    border: none;
    padding: 12px;
    border-radius: 8px;
    font-size: 18px;
    cursor: pointer;
    display: none;
  `;

  document.body.appendChild(menuToggle);

  menuToggle.addEventListener('click', () => {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('open');
  });

  // Show menu toggle on mobile
  const mediaQuery = window.matchMedia('(max-width: 768px)');
  function handleMediaQuery(e) {
    menuToggle.style.display = e.matches ? 'block' : 'none';
  }
  
  mediaQuery.addListener(handleMediaQuery);
  handleMediaQuery(mediaQuery);
}

// Smooth scroll to top
export function addScrollToTop() {
  const scrollButton = document.createElement('button');
  scrollButton.className = 'scroll-to-top';
  scrollButton.innerHTML = '↑';
  scrollButton.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: var(--accent-color);
    color: white;
    border: none;
    font-size: 20px;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 1000;
  `;

  document.body.appendChild(scrollButton);

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      scrollButton.style.opacity = '1';
    } else {
      scrollButton.style.opacity = '0';
    }
  });

  scrollButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}