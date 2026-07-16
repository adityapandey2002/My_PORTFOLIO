document.addEventListener('DOMContentLoaded', () => {
  // Simple terminal typing effect for the hero
  const terminalElements = document.querySelectorAll('.type-effect');
  
  terminalElements.forEach(el => {
    const text = el.getAttribute('data-text');
    el.textContent = '';
    let i = 0;
    
    const type = () => {
      if (i < text.length) {
        el.textContent += text.charAt(i);
        i++;
        setTimeout(type, Math.random() * 50 + 30);
      } else {
        el.style.borderRight = 'none'; // remove cursor when done
      }
    };
    
    // start typing after a short delay
    setTimeout(type, 500);
  });

  // Smooth scrolling for brutalist nav
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});
