document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // ETKİLEŞİM 1: HAMBURGEr MENÜ
  // ============================================================
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ============================================================
  // ETKİLEŞİM 2: YUKARI ÇIK BUTONU
  // ============================================================
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      backToTopBtn.classList.toggle('visible', window.scrollY > 300);
    });
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  const footerUp = document.querySelector('.footer-up');
  if (footerUp) {
    footerUp.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // ============================================================
  // ETKİLEŞİM 3: KOYU / AÇIK TEMA DEĞİŞTİRİCİ
  // ============================================================
  const themeBtn = document.getElementById('theme-toggle');
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
    if (themeBtn) themeBtn.textContent = '☀️';
  }
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const isDark = document.body.classList.toggle('dark');
      themeBtn.textContent = isDark ? '☀️' : '🌙';
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  }

  // ============================================================
  // ETKİLEŞİM 4: TYPEWRİTER EFEKTİ
  // ============================================================
  const typewriterEl = document.getElementById('typewriter');
  if (typewriterEl) {
    const words = ['Yazılım Geliştirici.', 'Web Tasarımcısı.', 'Java Geliştiricisi.', 'Öğrenci.'];
    let wordIndex = 0, charIndex = 0, isDeleting = false, typingSpeed = 100;
    function type() {
      const currentWord = words[wordIndex];
      if (isDeleting) {
        typewriterEl.textContent = currentWord.slice(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
      } else {
        typewriterEl.textContent = currentWord.slice(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
      }
      if (!isDeleting && charIndex === currentWord.length) { typingSpeed = 1500; isDeleting = true; }
      else if (isDeleting && charIndex === 0) { isDeleting = false; wordIndex = (wordIndex + 1) % words.length; typingSpeed = 400; }
      setTimeout(type, typingSpeed);
    }
    setTimeout(type, 600);
  }

  // ── Aktif nav linki ──
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    if (a.getAttribute('href').split('/').pop() === currentPage) a.classList.add('active');
  });

  // ── Scroll Reveal ──
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  // ── Beceri Çubukları ──
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

  // ============================================================
  // FORM DOĞRULAMA (VALIDATION)
  // Görev gereksinimleri:
  //  ✅ required alanlar kontrol edilir
  //  ✅ e-posta format kontrolü (regex)
  //  ✅ boş alan denetimi
  //  ✅ hatalı girişte hata mesajı gösterilir
  //  ✅ başarılı gönderimde başarı mesajı gösterilir
  // ============================================================
  const form = document.getElementById('contact-form');

  if (form) {

    // ── Yardımcı: Hata göster ──
    function showError(fieldId, message) {
      const field = document.getElementById(fieldId);
      const group = field.closest('.form-group');
      // Önceki hata varsa temizle
      clearError(fieldId);
      // Input'u hatalı olarak işaretle
      field.classList.add('input-error');
      // Hata mesajı elementi oluştur
      const errEl = document.createElement('span');
      errEl.className = 'form-error';
      errEl.textContent = message;
      group.appendChild(errEl);
    }

    // ── Yardımcı: Hata temizle ──
    function clearError(fieldId) {
      const field = document.getElementById(fieldId);
      const group = field.closest('.form-group');
      field.classList.remove('input-error');
      field.classList.remove('input-success');
      const existing = group.querySelector('.form-error');
      if (existing) existing.remove();
    }

    // ── Yardımcı: Başarılı işaretle ──
    function showSuccess(fieldId) {
      const field = document.getElementById(fieldId);
      clearError(fieldId);
      field.classList.add('input-success');
    }

    // ── E-posta format kontrolü ──
    function isValidEmail(email) {
      // Basit ama etkili e-posta regex'i
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // ── Tek alan doğrulama ──
    function validateField(fieldId) {
      const field = document.getElementById(fieldId);
      const value = field.value.trim();

      if (fieldId === 'name') {
        if (value === '') {
          showError('name', 'Ad Soyad alanı boş bırakılamaz.');
          return false;
        }
        if (value.length < 2) {
          showError('name', 'Ad Soyad en az 2 karakter olmalıdır.');
          return false;
        }
        showSuccess('name');
        return true;
      }

      if (fieldId === 'email') {
        if (value === '') {
          showError('email', 'E-posta alanı boş bırakılamaz.');
          return false;
        }
        if (!isValidEmail(value)) {
          showError('email', 'Geçerli bir e-posta adresi giriniz. (ornek@mail.com)');
          return false;
        }
        showSuccess('email');
        return true;
      }

      if (fieldId === 'subject') {
        if (value === '') {
          showError('subject', 'Konu alanı boş bırakılamaz.');
          return false;
        }
        showSuccess('subject');
        return true;
      }

      if (fieldId === 'message') {
        if (value === '') {
          showError('message', 'Mesaj alanı boş bırakılamaz.');
          return false;
        }
        if (value.length < 10) {
          showError('message', 'Mesajınız en az 10 karakter olmalıdır.');
          return false;
        }
        showSuccess('message');
        return true;
      }

      return true;
    }

    // ── Anlık doğrulama: kullanıcı alandan çıkınca (blur) kontrol et ──
    ['name', 'email', 'subject', 'message'].forEach(id => {
      const field = document.getElementById(id);
      if (field) {
        // Alan odak kaybedince doğrula
        field.addEventListener('blur', () => validateField(id));
        // Yazarken hata varsa temizle (input events)
        field.addEventListener('input', () => {
          if (field.classList.contains('input-error')) {
            validateField(id);
          }
        });
      }
    });

    // ── Form gönderim kontrolü ──
    form.addEventListener('submit', (e) => {
      e.preventDefault(); // Sayfanın yenilenmesini engelle

      // Tüm alanları doğrula
      const nameOk    = validateField('name');
      const emailOk   = validateField('email');
      const subjectOk = validateField('subject');
      const messageOk = validateField('message');

      // Hepsi geçerliyse başarı mesajı göster
      if (nameOk && emailOk && subjectOk && messageOk) {
        // Formu gizle
        form.style.display = 'none';

        // Başarı mesajı göster
        const successBox = document.getElementById('form-success');
        if (successBox) successBox.classList.remove('hidden');

        // 5 saniye sonra formu sıfırla ve tekrar göster
        setTimeout(() => {
          form.reset();
          form.style.display = 'flex';
          if (successBox) successBox.classList.add('hidden');
          ['name', 'email', 'subject', 'message'].forEach(id => {
            const f = document.getElementById(id);
            if (f) { f.classList.remove('input-success', 'input-error'); }
          });
        }, 5000);
      }
    });
  }

});
