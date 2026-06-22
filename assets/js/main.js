// Van Bellen Wijn, staging rebuild
(function(){
  // mobile nav toggle
  var t = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (t && links){
    t.addEventListener('click', function(){
      var open = links.classList.toggle('open');
      t.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.addEventListener('click', function(e){
      if (e.target.tagName === 'A') links.classList.remove('open');
    });
  }
  // demo contact form (no backend on staging)
  var form = document.querySelector('form[data-demo]');
  if (form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var ok = form.querySelector('.form-msg');
      if (ok){ ok.hidden = false; ok.scrollIntoView({behavior:'smooth', block:'center'}); }
      form.reset();
    });
  }
})();
