document.addEventListener('DOMContentLoaded', () => {
  // ── Aktif nav linkini işaretle ──
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href').split('/').pop();
    if (href === currentPage) a.classList.add('active');
  });

  // ── Scroll reveal ──
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

  // ── Skill bar animasyonu ──
  const barObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.skill-fill').forEach(b => {
          const w = parseFloat(b.style.width) / 100;
          b.style.transform = 'scaleX(0)';
          setTimeout(() => { b.style.transform = `scaleX(${w})`; }, 100);
        });
        barObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  const skillsSection = document.querySelector('.skills-grid');
  if (skillsSection) barObs.observe(skillsSection);

  // ── Proje filtresi (projeler.html) ──
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('#plist .project-card');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('btn-primary'));
      filterBtns.forEach(b => b.classList.add('btn-secondary'));
      btn.classList.remove('btn-secondary');
      btn.classList.add('btn-primary');
      const cat = btn.dataset.filter;
      projectCards.forEach(c => {
        c.style.display = (cat === 'all' || c.dataset.cat === cat) ? 'flex' : 'none';
      });
    });
  });

  // ── İletişim formu (contact.html) ──
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      btn.textContent = '✓ Gönderildi!';
      btn.disabled = true;
      setTimeout(() => { btn.textContent = 'Mesaj Gönder'; btn.disabled = false; }, 3000);
    });
  }

  // ── Başa dön ──
  const backTop = document.querySelector('.footer-up');
  if (backTop) backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
});
