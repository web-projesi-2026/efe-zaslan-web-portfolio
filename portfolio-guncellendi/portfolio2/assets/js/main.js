document.addEventListener('DOMContentLoaded', () => {

  // ── Aktif nav linkini işaretle ──
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    const href = a.getAttribute('href').split('/').pop();
    if (href === currentPage) a.classList.add('active');
  });

  // ── Hamburger Menü ──
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });

    // Menü linkine tıklanınca menüyü kapat
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });

    // Dışarı tıklanınca kapat
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      }
    });
  }

  // ── Scroll Reveal Animasyonu ──
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('vis');
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  // ── Beceri Çubukları Animasyonu ──
  const skillsGrid = document.querySelector('.skills-grid');
  if (skillsGrid) {
    const barObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.querySelectorAll('.skill-fill').forEach(bar => {
            const w = parseFloat(bar.style.width) / 100;
            bar.style.transform = 'scaleX(0)';
            setTimeout(() => { bar.style.transform = `scaleX(${w})`; }, 150);
          });
          barObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    barObs.observe(skillsGrid);
  }

  // ── İletişim Formu ──
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      btn.textContent = '✓ Gönderildi!';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = 'Mesaj Gönder';
        btn.disabled = false;
      }, 3000);
    });
  }

  // ── Başa Dön ──
  const backTop = document.querySelector('.footer-up');
  if (backTop) {
    backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

});
