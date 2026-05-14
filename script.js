const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-link');
const revealElements = document.querySelectorAll('.reveal');
const skillItems = document.querySelectorAll('.skill-item');
const sections = document.querySelectorAll('main section[id]');
const form = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const yearElement = document.getElementById('year');
const backToTopLink = document.querySelector('.back-to-top');
const brandLink = document.querySelector('.brand');
const homeSection = document.getElementById('home');

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

const scrollToHome = (event) => {
  if (!homeSection) return;
  event.preventDefault();
  homeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

if (backToTopLink) {
  backToTopLink.addEventListener('click', scrollToHome);
}

if (brandLink) {
  brandLink.addEventListener('click', scrollToHome);
}

// Mobile menu toggle.
if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navItems.forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Fade-in sections when they enter the viewport.
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.18 }
);

revealElements.forEach((element) => revealObserver.observe(element));

// Animate skill bars once the skills section appears.
const skillsSection = document.getElementById('skills');
if (skillsSection) {
  const skillObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        skillItems.forEach((item) => {
          const level = item.getAttribute('data-level') || '0';
          item.style.setProperty('--skill-level', `${level}%`);
          item.classList.add('animate');
        });

        observer.disconnect();
      });
    },
    { threshold: 0.35 }
  );

  skillObserver.observe(skillsSection);
}

// Active nav link highlight based on scroll position.
const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      navItems.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    });
  },
  {
    rootMargin: '-35% 0px -55% 0px',
    threshold: 0.1,
  }
);

sections.forEach((section) => navObserver.observe(section));

// Form validation with inline error messages.
if (form) {
  const fields = {
    name: document.getElementById('name'),
    email: document.getElementById('email'),
    message: document.getElementById('message'),
  };

  const errorNodes = {
    name: document.querySelector('[data-error-for="name"]'),
    email: document.querySelector('[data-error-for="email"]'),
    message: document.querySelector('[data-error-for="message"]'),
  };

  const clearErrors = () => {
    Object.values(errorNodes).forEach((node) => {
      if (node) node.textContent = '';
    });
    if (formStatus) formStatus.textContent = '';
  };

  const showError = (key, message) => {
    if (errorNodes[key]) {
      errorNodes[key].textContent = message;
    }
  };

  const validateEmail = (value) => /^\S+@\S+\.\S+$/.test(value);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    clearErrors();

    const nameValue = fields.name.value.trim();
    const emailValue = fields.email.value.trim();
    const messageValue = fields.message.value.trim();

    let isValid = true;

    if (!nameValue) {
      showError('name', 'Please enter your name.');
      isValid = false;
    }

    if (!emailValue) {
      showError('email', 'Please enter your email.');
      isValid = false;
    } else if (!validateEmail(emailValue)) {
      showError('email', 'Please enter a valid email address.');
      isValid = false;
    }

    if (!messageValue) {
      showError('message', 'Please add a short message.');
      isValid = false;
    } else if (messageValue.length < 10) {
      showError('message', 'Message should be at least 10 characters.');
      isValid = false;
    }

    if (!isValid) {
      if (formStatus) {
        formStatus.textContent = 'Please fix the highlighted fields and try again.';
      }
      return;
    }

    if (formStatus) {
      formStatus.textContent = 'Thanks for reaching out. This demo form is ready for a real backend integration.';
    }

    form.reset();
  });
}
