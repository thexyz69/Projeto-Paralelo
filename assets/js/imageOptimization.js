// Image optimization and lazy loading
class ImageOptimizer {
  constructor() {
    this.observer = null;
    this.init();
  }

  init() {
    this.setupLazyLoading();
    this.optimizeExistingImages();
  }

  setupLazyLoading() {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.loadImage(entry.target);
            this.observer.unobserve(entry.target);
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.01
      });

      this.observeImages();
    } else {
      // Fallback for older browsers
      this.loadAllImages();
    }
  }

  observeImages() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => this.observer.observe(img));
  }

  loadImage(img) {
    const src = img.dataset.src;
    if (!src) return;

    // Create a new image to preload
    const imageLoader = new Image();
    
    imageLoader.onload = () => {
      img.src = src;
      img.classList.remove('lazy-loading');
      img.classList.add('lazy-loaded');
    };

    imageLoader.onerror = () => {
      img.classList.add('lazy-error');
      // Set a fallback image
      img.src = '/assets/imgs/placeholder.png';
    };

    img.classList.add('lazy-loading');
    imageLoader.src = src;
  }

  loadAllImages() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => this.loadImage(img));
  }

  optimizeExistingImages() {
    const images = document.querySelectorAll('img:not([data-src])');
    images.forEach(img => {
      // Add loading attribute for native lazy loading
      if (!img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
      }

      // Add error handling
      img.addEventListener('error', () => {
        img.src = '/assets/imgs/placeholder.png';
        img.alt = 'Imagem não disponível';
      });
    });
  }

  // Convert regular images to lazy loading
  convertToLazyLoading(selector = 'img') {
    const images = document.querySelectorAll(selector);
    images.forEach(img => {
      if (img.src && !img.dataset.src) {
        img.dataset.src = img.src;
        img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E';
        img.classList.add('lazy');
        if (this.observer) {
          this.observer.observe(img);
        }
      }
    });
  }
}

// CSS for lazy loading states
const lazyLoadingCSS = `
  .lazy {
    opacity: 0;
    transition: opacity 0.3s;
  }
  
  .lazy-loading {
    opacity: 0.5;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
  }
  
  .lazy-loaded {
    opacity: 1;
  }
  
  .lazy-error {
    opacity: 0.7;
    filter: grayscale(100%);
  }
  
  @keyframes loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

// Inject CSS
const style = document.createElement('style');
style.textContent = lazyLoadingCSS;
document.head.appendChild(style);

export default new ImageOptimizer();