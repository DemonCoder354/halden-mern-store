// Apply the saved theme before first paint to avoid a flash.
try {
  var t = localStorage.getItem('halden-theme');
  if (t) document.documentElement.dataset.theme = t;
} catch (e) {}
