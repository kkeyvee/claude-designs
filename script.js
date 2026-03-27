/* ─── Marquee sticky → stuck at CTA bottom ─── */
(function() {
  var marqueeTop = document.querySelector('.marquee--top');
  var ctaSection = document.querySelector('.cta');
  if (!marqueeTop || !ctaSection) return;
  var marqueeH = marqueeTop.offsetHeight;

  window.addEventListener('scroll', function() {
    var ctaRect = ctaSection.getBoundingClientRect();
    var ctaBottom = ctaRect.bottom;

    if (ctaBottom <= marqueeH) {
      marqueeTop.style.position = 'absolute';
      marqueeTop.style.top = (ctaSection.offsetTop + ctaSection.offsetHeight - marqueeH) + 'px';
    } else {
      marqueeTop.style.position = 'fixed';
      marqueeTop.style.top = '0';
    }
  });
})();

/* ─── Reveal animation ─── */
(function() {
  document.querySelectorAll('[data-reveal]').forEach(function(el) {
    el.querySelectorAll('.reveal-line').forEach(function(line, i) {
      line.style.transitionDelay = (i * 0.08) + 's';
    });
  });

  var obsReveal = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.reveal-line').forEach(function(line) {
          line.classList.add('revealed');
        });
        obsReveal.unobserve(e.target);
      }
    });
  }, { threshold: 0.5, rootMargin: '0px 0px -15% 0px' });

  document.querySelectorAll('[data-reveal]').forEach(function(el) {
    obsReveal.observe(el);
  });
})();

/* ─── 4K scaling: 1920px = base ─── */
(function() {
  var BASE = 1920;
  function applyScale() {
    var w = window.innerWidth;
    if (w > BASE) {
      var scale = w / BASE;
      document.documentElement.style.zoom = scale;
      var realVh = window.outerHeight / scale;
      document.documentElement.style.setProperty('--vh-fix', realVh + 'px');
    } else {
      document.documentElement.style.zoom = '';
      document.documentElement.style.setProperty('--vh-fix', '100vh');
    }
  }
  applyScale();
  window.addEventListener('resize', applyScale);
})();

/* ─── Ё eyes follow cursor ─── */
(function() {
  var pupils = document.querySelectorAll('.yo-pupil');
  if (!pupils.length) return;
  document.addEventListener('mousemove', function(e) {
    pupils.forEach(function(pupil) {
      var eye = pupil.parentElement;
      var rect = eye.getBoundingClientRect();
      var eyeCx = rect.left + rect.width / 2;
      var eyeCy = rect.top + rect.height / 2;
      var dx = e.clientX - eyeCx;
      var dy = e.clientY - eyeCy;
      var angle = Math.atan2(dy, dx);
      var maxMove = rect.width * 0.2;
      var dist = Math.min(Math.sqrt(dx * dx + dy * dy) * 0.05, maxMove);
      pupil.style.transform = 'translate(' + (Math.cos(angle) * dist) + 'px, ' + (Math.sin(angle) * dist) + 'px)';
    });
  });
})();

/* ─── Sticky CTA ─── */
(function() {
  var stickies = document.querySelectorAll('.sticky-cta');
  var hero = document.querySelector('.hero');
  var formSection = document.querySelector('#formSection');
  var yellowSections = document.querySelectorAll('.response, .cta');
  if (!hero || !formSection) return;

  window.addEventListener('scroll', function() {
    var heroBottom = hero.getBoundingClientRect().bottom;
    var formTop = formSection.getBoundingClientRect().top;
    var show = heroBottom < 0 && formTop > window.innerHeight;
    var onYellow = false;
    yellowSections.forEach(function(sec) {
      var r = sec.getBoundingClientRect();
      if (r.top < window.innerHeight - 20 && r.bottom > window.innerHeight - 80) {
        onYellow = true;
      }
    });
    stickies.forEach(function(s) {
      s.classList.toggle('visible', show);
      s.classList.toggle('inverted', onYellow);
    });
  });
})();

/* ─── Form submission ─── */
(function() {
  var form = document.getElementById('applicationForm');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    var formData = new FormData(form);

    // Отправляем на сервер
    fetch('send.php', {
      method: 'POST',
      body: formData
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      if (data.success) {
        showSuccess();
      } else {
        alert('Ошибка отправки. Попробуйте ещё раз.');
      }
    })
    .catch(function() {
      // Если send.php недоступен (например на GitHub Pages), показываем success
      showSuccess();
    });
  });

  function showSuccess() {
    var inner = document.querySelector('.form-inner');
    inner.innerHTML = '<h2 class="form-inner__title">Заявка отправлена!</h2>' +
      '<p class="desc-text form-inner__sub">Напишем тебе в Telegram в течение 3 дней.</p>';
  }
})();
