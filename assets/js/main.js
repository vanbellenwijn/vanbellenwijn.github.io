// Van Bellen Wijn
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
  // contact form: build a mailto: link from the inputs (no backend)
  var form = document.querySelector('form[data-mailto]');
  if (form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var val = function(name){ var el = form.elements[name]; return el ? el.value.trim() : ''; };
      var naam = val('naam');
      var email = val('email');
      var tel = val('tel');
      var onderwerp = val('onderwerp');
      var bericht = val('bericht');
      var subject = onderwerp ? 'Vraag over ' + onderwerp : 'Bericht via de website';
      var body =
        'Beste Van Bellen Wijn,\n\n' +
        'Ik had een vraag over \'' + onderwerp + '\'.\n\n' +
        bericht + '\n\n' +
        'Met vriendelijke groet,\n' +
        naam +
        (email ? '\n' + email : '') +
        (tel ? '\n' + tel : '') +
        '\n';
      var href = 'mailto:Info@vanbellenwijn.nl'
        + '?subject=' + encodeURIComponent(subject)
        + '&body=' + encodeURIComponent(body);
      var ok = form.querySelector('.form-msg');
      if (ok){ ok.hidden = false; ok.scrollIntoView({behavior:'smooth', block:'center'}); }
      window.location.href = href;
    });
  }
})();
