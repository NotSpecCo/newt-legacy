(function(i, s, o, g, r, a, m) {
  i["GoogleAnalyticsObject"] = r;
  (i[r] =
    i[r] ||
    function() {
      (i[r].q = i[r].q || []).push(arguments);
    }),
    (i[r].l = 1 * new Date());
  (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
  a.async = 1;
  a.src = g;
  m.parentNode.insertBefore(a, m);
})(
  window,
  document,
  "script",
  "https://www.google-analytics.com/analytics.js",
  "ga"
);
ga("create", "UA-39728602-11", "auto");
ga("set", "checkProtocolTask", function() {});
ga('set', 'appName', 'Newt - A Better New Tab');
ga('set', 'appId', 'newt');
ga("set", "appVersion", "5.6.5");
ga("require", "displayfeatures");
