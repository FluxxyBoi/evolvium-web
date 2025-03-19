'use strict';

// Element toggle function
const elemToggleFunc = function (elem) { elem.classList.toggle("active"); }

// Navbar variables
const navbar = document.querySelector("[data-navbar]");
const navbarToggleBtn = document.querySelector("[data-navbar-toggle-btn]");

navbarToggleBtn.addEventListener("click", function () { elemToggleFunc(navbar); });

// Wishlist button
const whishlistBtn = document.querySelectorAll("[data-whishlist-btn]");

for (let i = 0; i < whishlistBtn.length; i++) {
  whishlistBtn[i].addEventListener("click", function () { elemToggleFunc(this); });
}

// Go to top variable
const goTopBtn = document.querySelector("[data-go-top]");

window.addEventListener("scroll", function () {
  if (this.window.scrollY >= 800) {
    goTopBtn.classList.add("active");
  } else {
    goTopBtn.classList.remove("active");
  }
});

// Function to check if an element is in the viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Function to add 'visible' class to elements in the viewport
function handleScroll() {
  const elements = document.querySelectorAll('.animate');
  elements.forEach((element) => {
    if (isInViewport(element)) {
      element.classList.add('visible');
    }
  });
}

// Add event listener for scroll event
window.addEventListener('scroll', handleScroll);

// Initial check to see if elements are in the viewport
handleScroll();

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    if (targetId === '#') return; // Skip if it's just "#"
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80, // Offset for header
        behavior: 'smooth'
      });
    }
  });
});

// Parallax effect for hero section
const heroSection = document.querySelector('.hero');
const heroContent = document.querySelector('.hero-content');
const heroImage = document.querySelector('.hero-banner');

if (heroSection && heroContent && heroImage) {
  window.addEventListener('scroll', function() {
    const scrollPosition = window.scrollY;
    if (scrollPosition < heroSection.offsetHeight) {
      // Apply parallax effect to hero content and image
      heroContent.style.transform = `translateY(${scrollPosition * 0.2}px)`;
      heroImage.style.transform = `translateY(${scrollPosition * 0.1}px)`;
    }
  });
}

// Add hover effects to about cards
const aboutCards = document.querySelectorAll('.about-card');
aboutCards.forEach(card => {
  card.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-10px)';
  });
  
  card.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0)';
  });
});

// Team cards functionality with button animation
const teamCards = document.querySelectorAll('.top-seller-card');
teamCards.forEach(card => {
  // Store the card name and job title for use in the about button
  const cardName = card.querySelector('.card-title').textContent.trim();
  const discordLink = card.getAttribute('data-discord-link');
  
  // Create buttons container element if it doesn't exist
  let buttonsContainer = card.querySelector('.team-card-buttons');
  if (!buttonsContainer) {
    buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'team-card-buttons';
    
    // Create close button
    const closeBtn = document.createElement('div');
    closeBtn.className = 'close-btn';
    closeBtn.innerHTML = '<ion-icon name="close-outline"></ion-icon>';
    closeBtn.addEventListener('click', function(e) {
      e.stopPropagation(); // Prevent card click event from firing
      buttonsContainer.classList.remove('active');
    });
    buttonsContainer.appendChild(closeBtn);
    
    // Create about button
    const aboutBtn = document.createElement('a');
    aboutBtn.className = 'team-card-btn about-btn';
    aboutBtn.innerHTML = `<ion-icon name="person-outline"></ion-icon> About ${cardName}`;
    aboutBtn.addEventListener('click', function(e) {
      e.stopPropagation(); // Prevent card click event from firing
      alert(`Information about ${cardName} coming soon!`);
    });
    buttonsContainer.appendChild(aboutBtn);
    
    // Create discord button with the saved link
    const discordBtn = document.createElement('a');
    discordBtn.className = 'team-card-btn discord-btn';
    discordBtn.href = discordLink;
    discordBtn.target = '_blank'; // Open in new tab
    discordBtn.innerHTML = '<ion-icon name="logo-discord"></ion-icon> Discord Profile';
    discordBtn.addEventListener('click', function(e) {
      e.stopPropagation(); // Prevent card click event from firing
    });
    buttonsContainer.appendChild(discordBtn);
    
    // Add buttons container to the card
    card.appendChild(buttonsContainer);
  }
  
  // Add click event to show buttons
  card.addEventListener('click', function() {
    // Reset all other cards first
    teamCards.forEach(otherCard => {
      const otherButtonsContainer = otherCard.querySelector('.team-card-buttons');
      if (otherButtonsContainer && otherCard !== card) {
        otherButtonsContainer.classList.remove('active');
      }
    });
    
    // Toggle current card's buttons
    buttonsContainer.classList.toggle('active');
  });
  
  // Hover effects
  card.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-10px)';
    this.style.borderColor = '#ff4500';
    this.style.boxShadow = '0 15px 30px rgba(255, 69, 0, 0.2)';
  });
  
  card.addEventListener('mouseleave', function() {
    if (!buttonsContainer.classList.contains('active')) {
      this.style.transform = 'translateY(0)';
      this.style.borderColor = 'transparent';
      this.style.boxShadow = 'var(--box-shadow)';
    }
  });
});

// Add typing effect to the hero title
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
  // Commented out to avoid deleting the original text
  /*
  const text = heroTitle.textContent;
  heroTitle.textContent = '';
  
  let i = 0;
  function typeWriter() {
    if (i < text.length) {
      heroTitle.textContent += text.charAt(i);
      i++;
      setTimeout(typeWriter, 50);
    }
  }
  
  // Uncomment to enable typing effect
  // typeWriter();
  */
}

// Add preloader
window.addEventListener('load', function() {
  const preloader = document.createElement('div');
  preloader.className = 'preloader';
  preloader.innerHTML = `
    <div class="spinner"></div>
  `;
  document.body.appendChild(preloader);
  
  setTimeout(() => {
    preloader.style.opacity = '0';
    setTimeout(() => {
      preloader.remove();
    }, 500);
  }, 500);
});

// Create scroll indicator
const scrollIndicator = document.createElement('div');
scrollIndicator.className = 'scroll-indicator';
document.body.appendChild(scrollIndicator);

// Update scroll indicator when scrolling
window.addEventListener('scroll', function() {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  scrollIndicator.style.width = scrolled + '%';
});

// Create back to top button
const backToTopBtn = document.createElement('div');
backToTopBtn.className = 'back-to-top';
backToTopBtn.innerHTML = '<ion-icon name="chevron-up-outline"></ion-icon>';
document.body.appendChild(backToTopBtn);

// Show/hide back to top button
window.addEventListener('scroll', function() {
  if (window.scrollY > 300) {
    backToTopBtn.classList.add('visible');
  } else {
    backToTopBtn.classList.remove('visible');
  }
});

// Action for back to top button
backToTopBtn.addEventListener('click', function() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// Create particles container
const particlesContainer = document.createElement('div');
particlesContainer.className = 'particles-container';
document.body.appendChild(particlesContainer);

// Generate particles
function createParticles() {
  const particleCount = 50;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.style.position = 'absolute';
    particle.style.width = Math.random() * 5 + 2 + 'px';
    particle.style.height = particle.style.width;
    particle.style.backgroundColor = 'rgba(255, 69, 0, ' + (Math.random() * 0.2 + 0.1) + ')';
    particle.style.borderRadius = '50%';
    particle.style.top = Math.random() * 100 + 'vh';
    particle.style.left = Math.random() * 100 + 'vw';
    particle.style.transform = 'translate(-50%, -50%)';
    particle.style.transition = 'transform ' + (Math.random() * 3 + 2) + 's linear, opacity ' + (Math.random() * 3 + 2) + 's ease-out';
    particle.style.zIndex = '-1';
    particle.style.opacity = Math.random() * 0.5 + 0.3;
    
    particlesContainer.appendChild(particle);
    
    // Animate the particle
    setTimeout(function() {
      particle.style.transform = 'translate(-50%, -50%) translate(' + (Math.random() * 100 - 50) + 'px, ' + (Math.random() * 100 - 50) + 'px)';
      particle.style.opacity = '0';
    }, 100);
    
    // Remove and recreate the particle
    setTimeout(function() {
      particle.remove();
      createParticle();
    }, (Math.random() * 3 + 2) * 1000);
  }
}

// Create an individual particle
function createParticle() {
  const particle = document.createElement('div');
  particle.style.position = 'absolute';
  particle.style.width = Math.random() * 5 + 2 + 'px';
  particle.style.height = particle.style.width;
  particle.style.backgroundColor = 'rgba(255, 69, 0, ' + (Math.random() * 0.2 + 0.1) + ')';
  particle.style.borderRadius = '50%';
  particle.style.top = Math.random() * 100 + 'vh';
  particle.style.left = Math.random() * 100 + 'vw';
  particle.style.transform = 'translate(-50%, -50%)';
  particle.style.transition = 'transform ' + (Math.random() * 3 + 2) + 's linear, opacity ' + (Math.random() * 3 + 2) + 's ease-out';
  particle.style.zIndex = '-1';
  particle.style.opacity = '0';
  
  particlesContainer.appendChild(particle);
  
  // Animate the particle
  setTimeout(function() {
    particle.style.opacity = Math.random() * 0.5 + 0.3;
    particle.style.transform = 'translate(-50%, -50%) translate(' + (Math.random() * 100 - 50) + 'px, ' + (Math.random() * 100 - 50) + 'px)';
  }, 100);
  
  // Remove and recreate the particle
  setTimeout(function() {
    particle.remove();
    createParticle();
  }, (Math.random() * 3 + 2) * 1000);
}

// Initialize particles effect
createParticles();

// Add focus effect on mousemove
document.addEventListener('mousemove', function(e) {
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  
  const buttons = document.querySelectorAll('.btn, .cssbuttons-io-button');
  buttons.forEach(button => {
    const rect = button.getBoundingClientRect();
    const buttonX = rect.left + rect.width / 2;
    const buttonY = rect.top + rect.height / 2;
    
    const distance = Math.sqrt(Math.pow(mouseX - buttonX, 2) + Math.pow(mouseY - buttonY, 2));
    
    if (distance < 200) {
      const scale = 1 + (200 - distance) / 2000;
      button.style.transform = `scale(${scale})`;
    } else {
      button.style.transform = 'scale(1)';
    }
  });
});

// Configure custom cursor with cursor-effects library
document.addEventListener('DOMContentLoaded', function() {
  // Remove any custom cursor defined in CSS
  document.body.style.cursor = 'auto';
  document.querySelectorAll('a, button, [role="button"], input[type="submit"], input[type="button"]').forEach(el => {
    el.style.cursor = 'pointer';
  });
  
  // Initialize cursor effect with reduced particles
  new cursoreffects.fairyDustCursor({
    colors: ["#ff7e00", "#ff4500", "#ffc87c", "#ffaa33"],
    size: 3, // Reduced size
    alpha: 0.6, // Reduced opacity
    quantity: 4, // Fewer particles (default is 15)
    trailLength: 6, // Reduced trail length
    rate: 0.3 // Reduced generation rate
  });
});