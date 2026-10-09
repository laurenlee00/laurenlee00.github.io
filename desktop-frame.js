// On a computer (mouse or trackpad, wide window), show the site exactly as it
// looks on an iPhone: load this same page in a 402×674 "phone screen" and scale
// that screen up to fill the window's height. Every size, line break and overlap
// comes from the real phone layout, so the desktop view always matches it.
(function () {
  var PHONE_W = 402, PHONE_H = 674; // the virtual screen shown on computers
  var isComputer = window.matchMedia(
    "(min-width: 768px) and (hover: hover) and (pointer: fine)"
  ).matches;
  var framed = window.self !== window.top;

  if (framed) {
    // Inside the phone screen: open links in the full window so the address bar
    // updates (links that already open a new tab keep doing so).
    var base = document.createElement("base");
    base.target = "_top";
    document.head.appendChild(base);
    // No scrollbar inside the phone screen (phones don't show one either).
    var noBar = document.createElement("style");
    noBar.textContent = "html{scrollbar-width:none}html::-webkit-scrollbar{display:none}";
    document.head.appendChild(noBar);
    return;
  }
  if (!isComputer) return; // phones and tablets get the page directly

  // Hide the page's own content right away so the wide layout never flashes.
  var hide = document.createElement("style");
  hide.textContent =
    "html,body{margin:0;height:100%;overflow:hidden;background:#fff;-webkit-font-smoothing:antialiased}" +
    "body>*:not(#phone-screen){display:none!important}" +
    "#phone-screen{position:fixed;top:0;border:0;background:#fff;" +
    "transform-origin:0 0;width:" + PHONE_W + "px;height:" + PHONE_H + "px}";
  document.head.appendChild(hide);

  document.addEventListener("DOMContentLoaded", function () {
    var frame = document.createElement("iframe");
    frame.id = "phone-screen";
    frame.title = document.title;
    frame.src = location.href;
    document.body.appendChild(frame);

    var scale = 1;
    function fit() {
      scale = Math.min(window.innerHeight / PHONE_H, window.innerWidth / PHONE_W);
      frame.style.transform = "scale(" + scale + ")";
      frame.style.left = (window.innerWidth - PHONE_W * scale) / 2 + "px";
    }
    fit();
    window.addEventListener("resize", fit);

    // Scrolling over the white space beside the phone screen scrolls it too.
    window.addEventListener("wheel", function (e) {
      if (frame.contentWindow) frame.contentWindow.scrollBy(0, e.deltaY / scale);
      e.preventDefault();
    }, { passive: false });

    // Let keyboard scrolling (arrows, space) work without clicking first.
    frame.addEventListener("load", function () {
      frame.contentWindow.focus();
      // Keep the window title in step with the page shown inside.
      try { document.title = frame.contentDocument.title; } catch (err) {}
    });
  });
})();
