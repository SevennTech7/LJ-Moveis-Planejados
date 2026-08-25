(function () {
  "use strict";

  /* ---------- Configuração ---------- */

  // WhatsApp principal
  var whatsappNumber = "5534996888918";

  // Segundo WhatsApp
  var whatsappNumber2 = "5534991233329";

  var whatsappMessage =
    "Olá! Gostaria de solicitar um orçamento de móveis planejados.";

  var whatsappLink =
    "https://wa.me/" +
    whatsappNumber +
    "?text=" +
    encodeURIComponent(whatsappMessage);

  var whatsappLink2 =
    "https://wa.me/" +
    whatsappNumber2 +
    "?text=" +
    encodeURIComponent(whatsappMessage);

  var reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  var isTouch = window.matchMedia(
    "(hover: none), (pointer: coarse)"
  ).matches;

  var isMobile = window.matchMedia(
    "(max-width: 900px)"
  ).matches;


  /* ---------- 1. Links de WhatsApp ---------- */

  // Número principal
  document.querySelectorAll("[data-wa]").forEach(function (el) {
    el.setAttribute("href", whatsappLink);
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  });

  // Segundo número
  document.querySelectorAll("[data-wa2]").forEach(function (el) {
    el.setAttribute("href", whatsappLink2);
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  });


  /* ---------- 2. Header dinâmico ---------- */

  var header = document.getElementById("header");

  function updateHeader() {
    if (!header) return;

    header.classList.toggle(
      "is-scrolled",
      window.scrollY > 40
    );
  }


  /* ---------- 3. Menu mobile ---------- */

  var burger = document.getElementById("burger");
  var menu = document.getElementById("menu");

  if (burger && menu) {
    burger.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");

      burger.classList.toggle("is-open", open);

      burger.setAttribute(
        "aria-expanded",
        String(open)
      );

      document.body.style.overflow = open
        ? "hidden"
        : "";
    });

    menu.addEventListener("click", function (e) {
      if (!e.target.closest("a")) return;

      menu.classList.remove("is-open");
      burger.classList.remove("is-open");

      burger.setAttribute(
        "aria-expanded",
        "false"
      );

      document.body.style.overflow = "";
    });
  }


  /* ---------- 4. Scroll suave com offset ---------- */

  document
    .querySelectorAll('a[href^="#"]')
    .forEach(function (link) {
      link.addEventListener("click", function (e) {
        var id = link.getAttribute("href");

        if (!id || id.length < 2) return;

        var target = document.querySelector(id);

        if (!target) return;

        e.preventDefault();

        var top =
          target.getBoundingClientRect().top +
          window.scrollY -
          70;

        window.scrollTo({
          top: top,
          behavior: reduceMotion
            ? "auto"
            : "smooth"
        });
      });
    });


  /* ---------- 5. Scroll reveal ---------- */

  var revealEls =
    document.querySelectorAll(".reveal");

  if (
    reduceMotion ||
    !("IntersectionObserver" in window)
  ) {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  } else {
    var revealObserver =
      new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;

            var el = entry.target;

            var delay = parseInt(
              el.dataset.delay || "0",
              10
            );

            setTimeout(function () {
              el.classList.add("is-visible");
            }, delay);

            revealObserver.unobserve(el);
          });
        },
        {
          threshold: 0.12,
          rootMargin: "0px 0px -6% 0px"
        }
      );

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  }


  /* ---------- 6. Parallax ---------- */

  var parallaxEls = [].slice.call(
    document.querySelectorAll("[data-parallax]")
  );

  var parallaxImgs = [].slice.call(
    document.querySelectorAll("[data-parallax-img]")
  );

  function applyParallax() {
    var vh = window.innerHeight;

    parallaxEls.forEach(function (el) {
      var r = el.getBoundingClientRect();

      if (
        r.bottom < -240 ||
        r.top > vh + 240
      ) {
        return;
      }

      var speed =
        parseFloat(el.dataset.parallax) || 0;

      var offset =
        (r.top + r.height / 2 - vh / 2) *
        speed;

      el.style.transform =
        "translate3d(0," +
        offset.toFixed(2) +
        "px,0)";
    });

    parallaxImgs.forEach(function (img) {
      var r = img.getBoundingClientRect();

      if (
        r.bottom < -240 ||
        r.top > vh + 240
      ) {
        return;
      }

      var speed =
        parseFloat(
          img.dataset.parallaxImg
        ) || 0;

      var offset =
        (r.top + r.height / 2 - vh / 2) *
        speed;

      img.style.transform =
        "translate3d(0," +
        offset.toFixed(2) +
        "px,0) scale(1.02)";
    });
  }


  var ticking = false;

  function onScroll() {
    if (ticking) return;

    ticking = true;

    window.requestAnimationFrame(function () {
      updateHeader();

      if (!reduceMotion) {
        applyParallax();
      }

      ticking = false;
    });
  }


  /* ---------- 7. Tilt 3D nos cards ---------- */

  if (!isTouch && !reduceMotion) {
    document
      .querySelectorAll(
        ".tilt, .card, .why__grid article"
      )
      .forEach(function (el) {
        var raf = null;

        el.style.transition =
          "transform .5s cubic-bezier(.22,.61,.36,1)";

        el.addEventListener(
          "mousemove",
          function (e) {
            var r =
              el.getBoundingClientRect();

            var px =
              (e.clientX - r.left) /
                r.width -
              0.5;

            var py =
              (e.clientY - r.top) /
                r.height -
              0.5;

            if (raf) {
              cancelAnimationFrame(raf);
            }

            raf = requestAnimationFrame(
              function () {
                el.style.transition =
                  "transform .12s linear";

                el.style.transform =
                  "perspective(1100px) rotateY(" +
                  (px * 7).toFixed(2) +
                  "deg) rotateX(" +
                  (-py * 7).toFixed(2) +
                  "deg) translateZ(12px)";
              }
            );
          }
        );

        el.addEventListener(
          "mouseleave",
          function () {
            if (raf) {
              cancelAnimationFrame(raf);
            }

            el.style.transition =
              "transform .6s cubic-bezier(.22,.61,.36,1)";

            el.style.transform = "";
          }
        );
      });
  }


  /* ---------- 8. Contadores animados ---------- */

  function animateCounter(el) {
    var target =
      parseInt(el.dataset.target, 10);

    var prefix =
      el.dataset.prefix || "";

    var suffix =
      el.dataset.suffix || "";

    if (reduceMotion) {
      el.textContent =
        prefix +
        target +
        suffix;

      return;
    }

    var duration = 1700;
    var start = performance.now();

    (function tick(now) {
      var p = Math.min(
        ((now || performance.now()) -
          start) /
          duration,
        1
      );

      var eased =
        1 - Math.pow(1 - p, 3);

      el.textContent =
        prefix +
        Math.round(target * eased) +
        suffix;

      if (p < 1) {
        requestAnimationFrame(tick);
      }
    })(start);
  }


  var counters =
    document.querySelectorAll(".counter");

  if ("IntersectionObserver" in window) {
    var counterObserver =
      new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;

            animateCounter(entry.target);

            counterObserver.unobserve(
              entry.target
            );
          });
        },
        {
          threshold: 0.5
        }
      );

    counters.forEach(function (c) {
      counterObserver.observe(c);
    });
  } else {
    counters.forEach(animateCounter);
  }


  /* ---------- 9. Carrossel de depoimentos ---------- */

  var track =
    document.getElementById("track");

  if (track) {
    var slides = track.children;
    var dots =
      document.getElementById("dots");

    var current = 0;
    var autoplayId = null;

    function goTo(i) {
      current =
        (i + slides.length) %
        slides.length;

      track.style.transform =
        "translateX(" +
        -current * 100 +
        "%)";

      [].forEach.call(
        dots.children,
        function (d, idx) {
          d.classList.toggle(
            "is-active",
            idx === current
          );

          d.setAttribute(
            "aria-selected",
            String(idx === current)
          );
        }
      );
    }

    function startAutoplay() {
      if (reduceMotion) return;

      stopAutoplay();

      autoplayId = setInterval(
        function () {
          goTo(current + 1);
        },
        6500
      );
    }

    function stopAutoplay() {
      if (autoplayId) {
        clearInterval(autoplayId);
      }
    }

    [].forEach.call(
      slides,
      function (_, i) {
        var b =
          document.createElement(
            "button"
          );

        b.type = "button";

        b.setAttribute(
          "role",
          "tab"
        );

        b.setAttribute(
          "aria-label",
          "Depoimento " +
            (i + 1)
        );

        b.addEventListener(
          "click",
          function () {
            goTo(i);
            startAutoplay();
          }
        );

        dots.appendChild(b);
      }
    );

    var prev =
      document.getElementById("prev");

    var next =
      document.getElementById("next");

    if (prev) {
      prev.addEventListener(
        "click",
        function () {
          goTo(current - 1);
          startAutoplay();
        }
      );
    }

    if (next) {
      next.addEventListener(
        "click",
        function () {
          goTo(current + 1);
          startAutoplay();
        }
      );
    }

    var carousel =
      document.getElementById(
        "carousel"
      );

    if (carousel) {
      carousel.addEventListener(
        "mouseenter",
        stopAutoplay
      );

      carousel.addEventListener(
        "mouseleave",
        startAutoplay
      );

      var startX = 0;
      var deltaX = 0;

      carousel.addEventListener(
        "touchstart",
        function (e) {
          startX =
            e.touches[0].clientX;

          stopAutoplay();
        },
        {
          passive: true
        }
      );

      carousel.addEventListener(
        "touchmove",
        function (e) {
          deltaX =
            e.touches[0].clientX -
            startX;
        },
        {
          passive: true
        }
      );

      carousel.addEventListener(
        "touchend",
        function () {
          if (
            Math.abs(deltaX) >
            50
          ) {
            goTo(
              current +
                (deltaX < 0
                  ? 1
                  : -1)
            );
          }

          deltaX = 0;

          startAutoplay();
        }
      );
    }

    goTo(0);
    startAutoplay();
  }


  /* ---------- 10. Cursor personalizado ---------- */

  var cursor =
    document.getElementById(
      "cursor"
    );

  var dot =
    document.getElementById(
      "cursorDot"
    );

  if (
    cursor &&
    dot
  ) {
    if (
      isTouch ||
      reduceMotion
    ) {
      document.body.classList.add(
        "no-cursor"
      );
    } else {
      var mx =
        window.innerWidth / 2;

      var my =
        window.innerHeight / 2;

      var cx = mx;
      var cy = my;

      document.addEventListener(
        "mousemove",
        function (e) {
          mx = e.clientX;
          my = e.clientY;

          dot.style.transform =
            "translate(" +
            (mx - 2.5) +
            "px," +
            (my - 2.5) +
            "px)";
        }
      );

      (function loop() {
        cx +=
          (mx - cx) * 0.16;

        cy +=
          (my - cy) * 0.16;

        cursor.style.transform =
          "translate(" +
          (cx - 17) +
          "px," +
          (cy - 17) +
          "px)";

        requestAnimationFrame(
          loop
        );
      })();

      document
        .querySelectorAll(
          "a, button, .card, .shot, .glass, img"
        )
        .forEach(function (el) {
          el.addEventListener(
            "mouseenter",
            function () {
              cursor.classList.add(
                "is-active"
              );
            }
          );

          el.addEventListener(
            "mouseleave",
            function () {
              cursor.classList.remove(
                "is-active"
              );
            }
          );
        });
    }
  }


  /* ---------- 11. Init ---------- */

  var year =
    document.getElementById("year");

  if (year) {
    year.textContent =
      new Date().getFullYear();
  }

  window.addEventListener(
    "scroll",
    onScroll,
    {
      passive: true
    }
  );

  window.addEventListener(
    "resize",
    function () {
      isMobile =
        window.matchMedia(
          "(max-width: 900px)"
        ).matches;
    }
  );

  updateHeader();

  if (!reduceMotion) {
    applyParallax();
  }

})();