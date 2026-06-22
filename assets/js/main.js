// Van Bellen Wijn
(function(){
  // bron van de agenda. Bij livegang: vervang door de gepubliceerde Google Sheet CSV-URL.
  var AGENDA_SHEET = 'assets/data/agenda-sample.csv';

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
    prefillSignup(form);
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var val = function(name){ var el = form.elements[name]; return el ? el.value.trim() : ''; };
      var naam = val('naam');
      var email = val('email');
      var tel = val('tel');
      var onderwerp = val('onderwerp');
      var bericht = val('bericht');
      var avond = form.getAttribute('data-avond');
      var subject = avond ? 'Aanmelding ' + avond
        : (onderwerp ? 'Vraag over ' + onderwerp : 'Bericht via de website');
      var lead = avond ? '' : ('Ik had een vraag over \'' + onderwerp + '\'.\n\n');
      var body =
        'Beste Van Bellen Wijn,\n\n' +
        lead +
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

  // agenda: render geplande avonden uit een gepubliceerde Google Sheet (CSV)
  var agenda = document.getElementById('agenda');
  if (agenda){ renderAgenda(agenda); }

  var GROUPS = [
    {key:'open', title:'Open wijnproefavonden'},
    {key:'cursus', title:'Wijncursussen'},
    {key:'gezelschap', title:'Voor gezelschappen'}
  ];

  function renderAgenda(el){
    fetch(AGENDA_SHEET).then(function(r){
      if (!r.ok){ throw new Error('http ' + r.status); }
      return r.text();
    }).then(function(text){
      var items = parseAgenda(text);
      var today = new Date(); today.setHours(0, 0, 0, 0);
      items = items.filter(function(it){
        if (!it.datum){ return false; }
        var d = new Date(it.datum);
        return !isNaN(d.getTime()) && d >= today;
      });
      items.sort(function(a, b){ return a.datum < b.datum ? -1 : a.datum > b.datum ? 1 : 0; });
      if (!items.length){ el.innerHTML = fallbackHTML(); return; }
      el.innerHTML = buildAgenda(items);
    }).catch(function(){
      el.innerHTML = fallbackHTML();
    });
  }

  // CSV -> array van avond-objecten (zonder filter/sort)
  function parseAgenda(text){
    var rows = parseCSV(text).filter(function(row){
      return row.some(function(c){ return c.trim() !== ''; });
    });
    if (rows.length < 2){ return []; }
    var head = rows[0].map(function(h){ return h.trim().toLowerCase(); });
    var col = {};
    head.forEach(function(h, i){ col[h] = i; });
    return rows.slice(1).map(function(r){
      return {
        datum: cell(r, col.datum),
        type: cell(r, col.type).toLowerCase(),
        plekken: cell(r, col.plekken),
        status: cell(r, col.status).toLowerCase(),
        notitie: cell(r, col.notitie)
      };
    });
  }

  function cell(row, i){ return (i == null || row[i] == null) ? '' : row[i].trim(); }

  // komma-/quote-bewuste CSV-parser (notities mogen komma's bevatten)
  function parseCSV(text){
    var rows = [], row = [], field = '', q = false;
    for (var i = 0; i < text.length; i++){
      var c = text[i];
      if (q){
        if (c === '"' && text[i + 1] === '"'){ field += '"'; i++; }
        else if (c === '"'){ q = false; }
        else { field += c; }
      } else if (c === '"'){ q = true; }
      else if (c === ','){ row.push(field); field = ''; }
      else if (c === '\n'){ row.push(field); rows.push(row); row = []; field = ''; }
      else if (c !== '\r'){ field += c; }
    }
    if (field !== '' || row.length){ row.push(field); rows.push(row); }
    return rows;
  }

  function buildAgenda(items){
    var html = '';
    GROUPS.forEach(function(g){
      var list = items.filter(function(it){ return it.type === g.key; });
      if (list.length){ html += groupHTML(g.title, list); }
    });
    var rest = items.filter(function(it){
      return GROUPS.every(function(g){ return g.key !== it.type; });
    });
    if (rest.length){ html += groupHTML('Geplande activiteiten', rest); }
    return html;
  }

  function groupHTML(title, list){
    var lis = list.map(function(it){
      var b = badgeFor(it);
      var note = it.notitie ? '<span class="agenda-note">' + esc(it.notitie) + '</span>' : '';
      return '<li><span class="agenda-date">' + fmtDate(it.datum) + note + '</span>'
        + '<span class="agenda-actions"><span class="badge badge--' + b.cls + '">' + esc(b.txt) + '</span>'
        + signupHTML(it) + '</span></li>';
    }).join('');
    return '<div class="agenda-group"><h3>' + esc(title) + '</h3>'
      + '<ul class="agenda-list">' + lis + '</ul></div>';
  }

  function badgeFor(it){
    var n = parseInt(it.plekken, 10);
    if (it.status === 'vol' || n === 0){ return {cls:'vol', txt:'vol'}; }
    if (it.status === 'datumprikker'){ return {cls:'info', txt:'in overleg'}; }
    if (!isNaN(n) && n > 0){ return {cls:'open', txt:'nog ' + n + (n === 1 ? ' plek' : ' plekken') + ' over'}; }
    return {cls:'info', txt:'beschikbaar'};
  }

  function signupHTML(it){
    var b = badgeFor(it);
    if (b.cls === 'vol'){ return ''; }
    var txt = it.status === 'datumprikker' ? 'Aanmelden' : 'Inschrijven';
    return '<a class="btn btn--ghost agenda-btn" href="contact.html?datum='
      + encodeURIComponent(it.datum) + '&type=' + encodeURIComponent(it.type) + '">' + txt + '</a>';
  }

  function signupLabel(it){
    var words = {open:'wijnproefavond', cursus:'wijncursus', gezelschap:'besloten avond'};
    var w = words[it.type] || 'activiteit';
    var title = it.notitie ? ' ' + it.notitie : '';
    var d = new Date(it.datum);
    var date = isNaN(d.getTime()) ? it.datum
      : new Intl.DateTimeFormat('nl-NL', {weekday:'long', day:'numeric', month:'long', year:'numeric'}).format(d);
    return w + title + ' op ' + date;
  }

  function fmtDate(iso){
    var d = new Date(iso);
    if (isNaN(d.getTime())){ return esc(iso); }
    var wd = new Intl.DateTimeFormat('nl-NL', {weekday:'long'}).format(d);
    var rest = new Intl.DateTimeFormat('nl-NL', {day:'numeric', month:'long', year:'numeric'}).format(d);
    return '<span class="wd">' + esc(wd) + '</span>' + esc(rest);
  }

  function fallbackHTML(){
    return '<p class="agenda-status">De actuele data zijn in voorbereiding. '
      + '<a href="contact.html">Vraag de beschikbaarheid op via contact.</a></p>';
  }

  function esc(s){
    return String(s).replace(/[&<>"]/g, function(c){
      return {'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;'}[c];
    });
  }

  // vul het contactformulier voor wanneer men via een agenda-knop binnenkomt (?datum=...&type=...)
  // avond + beschikbaarheid komen uit de sheet zelf, niet uit de URL (die is door de bezoeker aanpasbaar)
  function prefillSignup(form){
    var params = new URLSearchParams(window.location.search);
    var datum = params.get('datum');
    if (!datum){ return; }
    var type = params.get('type');
    fetch(AGENDA_SHEET).then(function(r){
      if (!r.ok){ throw new Error('http ' + r.status); }
      return r.text();
    }).then(function(text){
      var items = parseAgenda(text);
      var found = null;
      for (var i = 0; i < items.length; i++){
        if (items[i].datum === datum && (!type || items[i].type === type)){ found = items[i]; break; }
      }
      applySignup(form, found);
    }).catch(function(){ applySignup(form, null); });
  }

  function applySignup(form, it){
    var note = form.querySelector('#signup-note');
    if (!it){
      if (note){
        note.innerHTML = 'De gekozen avond is niet gevonden. Vermeld in je bericht om welke avond het gaat.';
        note.hidden = false;
      }
      return;
    }
    var avond = signupLabel(it);
    form.setAttribute('data-avond', avond);
    if (note){
      note.innerHTML = 'Je schrijft je in voor: <strong>' + esc(avond) + '</strong>'
        + '<br><span class="signup-plek">Beschikbaarheid: ' + esc(badgeFor(it).txt) + '</span>';
      note.hidden = false;
    }
    var sel = form.elements['onderwerp'];
    if (sel){
      var want = it.type === 'cursus' ? 'Wijncursus' : 'Wijnproeverij';
      for (var i = 0; i < sel.options.length; i++){
        if (sel.options[i].text === want){ sel.selectedIndex = i; break; }
      }
    }
    var msg = form.elements['bericht'];
    if (msg && !msg.value){ msg.value = 'Inschrijving voor: ' + avond + '\nAantal personen: \nOpmerking: '; }
    var naam = form.elements['naam'];
    if (naam){ naam.focus(); }
  }
})();
