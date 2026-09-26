(function () {
  var btn = document.getElementById('theme-toggle');
  if (!btn) return;

  function updateIcon() {
    var theme = document.documentElement.getAttribute('data-theme') || 'dark';
    btn.textContent = theme === 'light' ? '🌙' : '☀️';
  }

  btn.addEventListener('click', function () {
    var current = document.documentElement.getAttribute('data-theme') || 'dark';
    var next = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
    updateIcon();
  });

  updateIcon();
})();
