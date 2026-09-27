(function () {
  var grid = document.getElementById('gallery-grid');
  if (!grid) return;

  var pills = document.querySelectorAll('.pill');
  var search = document.getElementById('gallery-search');
  var items = Array.prototype.slice.call(grid.querySelectorAll('.gallery-item'));
  var activeFilter = 'all';

  function applyFilters() {
    var query = (search && search.value || '').toLowerCase().trim();
    items.forEach(function (item) {
      var matchesFilter = activeFilter === 'all' || item.dataset.status === activeFilter;
      var matchesSearch = !query || item.dataset.title.indexOf(query) !== -1;
      item.classList.toggle('hidden', !(matchesFilter && matchesSearch));
    });
  }

  pills.forEach(function (pill) {
    pill.addEventListener('click', function () {
      pills.forEach(function (p) { p.classList.remove('active'); });
      pill.classList.add('active');
      activeFilter = pill.dataset.filter;
      applyFilters();
    });
  });

  if (search) search.addEventListener('input', applyFilters);
})();