const menuBtn = document.querySelector('.hamburger-menu');
const navLinks = document.querySelector('.navbar');

menuBtn.addEventListener('click', () => {
  navLinks.classList.toggle('show');
});