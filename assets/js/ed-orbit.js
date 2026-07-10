'use strict';

function edOrbitDepth(phase) {
  return (Math.sin(phase) + 1) / 2;
}

function edOrbitScale(depth) {
  return 0.78 + depth * 0.28;
}

function edOrbitXY(r, phase, tiltRad) {
  return {
    x: Math.cos(phase) * r,
    y: Math.sin(phase) * r * Math.sin(tiltRad),
  };
}

function initEdOrbit(root) {
  if (!root) return;
  var detail = root.querySelector('#ed-orbit-detail');
  var planets = Array.prototype.slice.call(root.querySelectorAll('.ed-orbit-planet'));
  if (!detail || planets.length === 0) return;

  var tiltDeg = parseFloat(root.getAttribute('data-tilt') || '36');
  var tiltRad = (tiltDeg * Math.PI) / 180;
  var angle = 0;
  var vel = 0;
  var dragging = false;
  var lastX = 0;
  var hovered = null;
  var reduced =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mobile =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(max-width: 900px)').matches;

  root.classList.add('ed-orbit-ready');

  function setDetail(planet) {
    if (!planet) {
      detail.classList.remove('show');
      detail.textContent = '';
      return;
    }
    detail.innerHTML = planet.getAttribute('data-detail') || '';
    detail.classList.add('show');
  }

  function place() {
    if (mobile) return;
    var front = null;
    var frontDepth = -1;
    for (var i = 0; i < planets.length; i++) {
      var p = planets[i];
      var r = parseFloat(p.getAttribute('data-r') || '0');
      var phase = parseFloat(p.getAttribute('data-phase') || '0') + angle;
      var xy = edOrbitXY(r, phase, tiltRad);
      var depth = edOrbitDepth(phase);
      var scale = edOrbitScale(depth);
      p.style.transform =
        'translate(' + xy.x + 'px, ' + xy.y + 'px) scale(' + scale + ')';
      p.style.zIndex = String(10 + Math.round(depth * 20));
      if (!hovered) {
        if (depth > 0.72) p.classList.add('clear');
        else p.classList.remove('clear');
      }
      if (depth > frontDepth) {
        frontDepth = depth;
        front = p;
      }
    }
    setDetail(hovered || (frontDepth > 0.55 ? front : null));
  }

  for (var j = 0; j < planets.length; j++) {
    (function (p) {
      p.addEventListener('mouseenter', function () {
        hovered = p;
        for (var k = 0; k < planets.length; k++) {
          if (planets[k] === p) planets[k].classList.add('clear');
          else planets[k].classList.remove('clear');
        }
        setDetail(p);
      });
      p.addEventListener('mouseleave', function () {
        hovered = null;
      });
      p.setAttribute('tabindex', '0');
      p.addEventListener('focus', function () {
        hovered = p;
        setDetail(p);
        for (var k = 0; k < planets.length; k++) {
          if (planets[k] === p) planets[k].classList.add('clear');
          else planets[k].classList.remove('clear');
        }
      });
      p.addEventListener('blur', function () {
        hovered = null;
      });
    })(planets[j]);
  }

  root.addEventListener('pointerdown', function (e) {
    if (mobile || reduced) return;
    dragging = true;
    lastX = e.clientX;
    if (root.setPointerCapture) root.setPointerCapture(e.pointerId);
  });
  root.addEventListener('pointermove', function (e) {
    if (!dragging) return;
    var dx = e.clientX - lastX;
    lastX = e.clientX;
    vel = dx * 0.012;
    angle += vel;
    place();
  });
  root.addEventListener('pointerup', function () {
    dragging = false;
  });
  root.addEventListener('pointercancel', function () {
    dragging = false;
  });

  function onResize() {
    mobile =
      window.matchMedia && window.matchMedia('(max-width: 900px)').matches;
    if (mobile) {
      for (var i = 0; i < planets.length; i++) {
        planets[i].style.transform = '';
        planets[i].classList.add('clear');
      }
      setDetail(null);
    } else {
      place();
    }
  }
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', onResize);
  }

  function tick() {
    if (!mobile) {
      if (reduced) {
        place();
      } else if (!dragging) {
        vel *= 0.94;
        angle += 0.0032 + vel;
        place();
      }
    }
    if (typeof requestAnimationFrame !== 'undefined') {
      requestAnimationFrame(tick);
    }
  }

  onResize();
  if (!mobile && reduced) {
    // Static fan: freeze angle at 0 after first place
    place();
  }
  tick();
}

function bootEdOrbit() {
  var root = document.getElementById('ed-orbit');
  if (root) initEdOrbit(root);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    edOrbitDepth: edOrbitDepth,
    edOrbitScale: edOrbitScale,
    edOrbitXY: edOrbitXY,
    initEdOrbit: initEdOrbit,
  };
} else if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootEdOrbit);
  } else {
    bootEdOrbit();
  }
}
