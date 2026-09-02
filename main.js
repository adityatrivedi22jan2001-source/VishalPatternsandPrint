// Vishal Patterns & Print — shared interactions
(function(){
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Nav scroll state ---- */
  var nav = document.querySelector('.nav');
  function onScroll(){
    if(!nav) return;
    if(window.scrollY > 30){ nav.classList.add('is-scrolled'); }
    else{ nav.classList.remove('is-scrolled'); }
  }
  onScroll();
  window.addEventListener('scroll', onScroll, {passive:true});

  /* ---- Mobile menu ---- */
  var burger = document.querySelector('.nav-burger');
  var panel = document.querySelector('.mobile-panel');
  if(burger && panel){
    burger.addEventListener('click', function(){
      panel.classList.toggle('is-open');
      document.body.classList.toggle('menu-open');
      document.body.style.overflow = panel.classList.contains('is-open') ? 'hidden' : '';
    });
    panel.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        panel.classList.remove('is-open');
        document.body.classList.remove('menu-open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---- Scroll reveal ---- */
  var fxEls = document.querySelectorAll('.fx, .reveal, .reveal-wipe, .time');
  if('IntersectionObserver' in window && !reduceMotion){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, {threshold:.16, rootMargin:'0px 0px -6% 0px'});
    fxEls.forEach(function(el){ io.observe(el); });
  } else {
    fxEls.forEach(function(el){ el.classList.add('is-visible'); });
  }

  /* ---- Hero parallax ---- */
  var heroMedia = document.querySelectorAll('.hero-media img');
  if(heroMedia.length && !reduceMotion){
    window.addEventListener('scroll', function(){
      var y = window.scrollY;
      if(y < window.innerHeight){
        heroMedia.forEach(function(img){
          img.style.transform = 'translateY(' + (y * 0.32) + 'px) scale(1.08)';
        });
      }
    }, {passive:true});
  }

  /* ---- Signature compare-scroll (About / Home) ---- */
  var compare = document.querySelector('.compare');
  if(compare){
    var stage = compare.querySelector('.compare-stage');
    var newImg = compare.querySelector('.compare-new');
    var line = compare.querySelector('.compare-line');
    function updateCompare(){
      var rect = compare.getBoundingClientRect();
      var total = compare.offsetHeight - stage.offsetHeight;
      var progress = Math.min(Math.max((-rect.top) / total, 0), 1);
      var pct = (1 - progress) * 100;
      newImg.style.clipPath = 'inset(0 0 0 ' + pct + '%)';
      if(line) line.style.left = (100 - pct) + '%';
    }
    updateCompare();
    window.addEventListener('scroll', updateCompare, {passive:true});
    window.addEventListener('resize', updateCompare);
  }

  /* ---- Timeline rail fill ---- */
  var railFill = document.querySelector('.timeline-rail-fill');
  var timeline = document.querySelector('.timeline');
  if(railFill && timeline){
    function updateRail(){
      var rect = timeline.getBoundingClientRect();
      var vh = window.innerHeight;
      var start = vh * 0.75;
      var visible = start - rect.top;
      var pct = Math.min(Math.max(visible / (rect.height + start - vh*0.25), 0), 1);
      railFill.style.height = (pct * 100) + '%';
    }
    updateRail();
    window.addEventListener('scroll', updateRail, {passive:true});
    window.addEventListener('resize', updateRail);
  }

  /* ---- Animated stat counters ---- */
  var stats = document.querySelectorAll('.stat strong[data-count]');
  if(stats.length && 'IntersectionObserver' in window){
    var counted = new WeakSet();
    var sIo = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting && !counted.has(e.target)){
          counted.add(e.target);
          animateCount(e.target);
        }
      });
    }, {threshold:.6});
    stats.forEach(function(el){ sIo.observe(el); });
  }
  function animateCount(el){
    var target = parseInt(el.getAttribute('data-count'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    if(reduceMotion){ el.textContent = target + suffix; return; }
    var dur = 1400, startTime = null;
    function step(ts){
      if(!startTime) startTime = ts;
      var p = Math.min((ts - startTime) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if(p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---- Gallery filter ---- */
  var filterBtns = document.querySelectorAll('.filter-btn');
  var galItems = document.querySelectorAll('[data-cat]');
  if(filterBtns.length){
    filterBtns.forEach(function(btn){
      btn.addEventListener('click', function(){
        filterBtns.forEach(function(b){ b.classList.remove('is-active'); });
        btn.classList.add('is-active');
        var cat = btn.getAttribute('data-filter');
        galItems.forEach(function(item){
          var show = cat === 'all' || item.getAttribute('data-cat') === cat;
          item.style.display = show ? '' : 'none';
        });
      });
    });
  }
})();
