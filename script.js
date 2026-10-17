// Mobile navigation toggle[cite: 3]
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }));
}

// Reveal content on scroll[cite: 3]
const revealItems = document.querySelectorAll(
  '.section-meta, .philosophy-grid, .principles article, .section-heading, .work-item, .journey-list article, .credentials-grid > div, .future-inner > *, .contact-section > *'
);
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  revealItems.forEach((el, i) => {
    el.classList.add('reveal');
    if (el.matches('.principles article, .journey-list article')) {
      el.style.transitionDelay = `${(i % 3) * 80}ms`;
    }
  });
  const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  }), { threshold: 0.12, rootMargin: '0px 0px -25px 0px' });
  revealItems.forEach(el => revealObserver.observe(el));
}

// Section indicator in navigation[cite: 3]
if ('IntersectionObserver' in window && nav) {
  const sections = document.querySelectorAll('main section[id]');
  const sectionObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    nav.querySelectorAll('a').forEach(link => link.classList.toggle('active', link.hash === `#${entry.target.id}`));
  }), { rootMargin: '-35% 0px -55% 0px' });
  sections.forEach(section => sectionObserver.observe(section));
}

/* ============================================================
   UNDER-TEXT TYPEWRITER EFFECT
   ============================================================ */
(function initTypewriter() {
  const targetElement = document.querySelector('.typewriter-text');
  if (!targetElement) return;

  const phrases = [
    "a Python developer.",
    "a community builder.",
    "an intern at Infosys.",
    "learning GCloud and exploring AWS."
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typeSpeed = 75;
  const deleteSpeed = 38;
  const pauseEnd = 1600;
  const pauseStart = 300;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      charIndex--;
      targetElement.textContent = currentPhrase.substring(0, charIndex);
    } else {
      charIndex++;
      targetElement.textContent = currentPhrase.substring(0, charIndex);
    }

    let delay = isDeleting ? deleteSpeed : typeSpeed;

    if (!isDeleting && charIndex === currentPhrase.length) {
      delay = pauseEnd;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = pauseStart;
    }

    setTimeout(type, delay);
  }

  type();
})();

/* ============================================================
   INTERACTIVE 3D LIVE WALLPAPER (GLIDES BEHIND WRITTEN CONTENT)
   ============================================================ */
(function init3DExperience() {
  if (typeof THREE === 'undefined') return;

  const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  window.addEventListener('mousemove', (e) => {
    mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  /* ----------------------------------------------------------
     1. Background 3D Scene: Wireframe shapes moving behind text
     ---------------------------------------------------------- */
  const bgCanvas = document.getElementById('bg-canvas');
  if (bgCanvas) {
    const bgRenderer = new THREE.WebGLRenderer({ canvas: bgCanvas, alpha: true, antialias: true });
    bgRenderer.setSize(window.innerWidth, window.innerHeight);
    bgRenderer.setPixelRatio(window.devicePixelRatio || 1);

    const bgScene = new THREE.Scene();
    const bgCamera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    bgCamera.position.z = 32;

    const bgGroup = new THREE.Group();
    bgScene.add(bgGroup);

    const accentColor = 0xef5b35;
    const lineColor = 0xd2d0c5;

    const shapes = [];

    function createWireShape(geometry, color, opacity, x, y, z, rotSpeed) {
      const mat = new THREE.MeshBasicMaterial({
        color: color,
        wireframe: true,
        transparent: true,
        opacity: opacity,
      });
      const mesh = new THREE.Mesh(geometry, mat);
      mesh.position.set(x, y, z);
      bgGroup.add(mesh);
      shapes.push({ mesh, rotSpeed, baseX: x, baseY: y });
    }

    createWireShape(new THREE.IcosahedronGeometry(7, 1), accentColor, 0.38, 14, 5, -8, { x: 0.003, y: 0.004 });
    createWireShape(new THREE.TorusGeometry(11, 0.2, 16, 70), lineColor, 0.45, -12, -18, -14, { x: 0.002, y: 0.003 });
    createWireShape(new THREE.OctahedronGeometry(6, 1), accentColor, 0.3, -15, -35, -10, { x: 0.004, y: 0.002 });
    createWireShape(new THREE.IcosahedronGeometry(14, 2), lineColor, 0.35, 12, -60, -18, { x: 0.001, y: 0.002 });

    const particleCount = 100;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 60;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 120;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({ size: 1.2, color: 0xef5b35, transparent: true, opacity: 0.35 });
    const pMesh = new THREE.Points(pGeo, pMat);
    bgGroup.add(pMesh);

    function animateBackground() {
      requestAnimationFrame(animateBackground);

      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      const maxScroll = document.documentElement.scrollHeight - window.innerHeight || 1;
      const scrollProgress = window.scrollY / maxScroll;

      shapes.forEach(item => {
        item.mesh.rotation.x += item.rotSpeed.x;
        item.mesh.rotation.y += item.rotSpeed.y;
        item.mesh.position.x = item.baseX + mouse.x * 2;
        item.mesh.position.y = item.baseY + mouse.y * 2;
      });

      bgCamera.position.y = -scrollProgress * 55;
      bgCamera.position.x = mouse.x * 1.5;

      bgRenderer.render(bgScene, bgCamera);
    }
    animateBackground();

    window.addEventListener('resize', () => {
      bgCamera.aspect = window.innerWidth / window.innerHeight;
      bgCamera.updateProjectionMatrix();
      bgRenderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  /* ----------------------------------------------------------
     2. Hero Interactive 3D Artifact Stage
     ---------------------------------------------------------- */
  const heroCanvas = document.getElementById('hero-canvas');
  const heroContainer = document.getElementById('hero-3d-stage');
  if (heroCanvas && heroContainer) {
    const heroRenderer = new THREE.WebGLRenderer({ canvas: heroCanvas, alpha: true, antialias: true });
    heroRenderer.setSize(heroContainer.clientWidth, heroContainer.clientHeight);
    heroRenderer.setPixelRatio(window.devicePixelRatio || 1);

    const heroScene = new THREE.Scene();
    const heroCamera = new THREE.PerspectiveCamera(45, heroContainer.clientWidth / heroContainer.clientHeight, 0.1, 100);
    heroCamera.position.z = 7;

    const group = new THREE.Group();
    heroScene.add(group);

    const innerGeo = new THREE.IcosahedronGeometry(1.6, 2);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0xef5b35,
      wireframe: true,
      transparent: true,
      opacity: 0.9,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    group.add(innerMesh);

    const ringGeo = new THREE.TorusGeometry(2.4, 0.018, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x171916, wireframe: true, opacity: 0.5, transparent: true });

    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    ring1.rotation.x = Math.PI / 3;
    group.add(ring1);

    const ring2 = new THREE.Mesh(ringGeo, ringMat);
    ring2.rotation.y = Math.PI / 4;
    group.add(ring2);

    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };

    heroCanvas.addEventListener('mousedown', (e) => {
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => (isDragging = false));

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMousePos.x;
      const deltaY = e.clientY - prevMousePos.y;

      group.rotation.y += deltaX * 0.008;
      group.rotation.x += deltaY * 0.008;

      prevMousePos = { x: e.clientX, y: e.clientY };
    });

    heroCanvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    });

    window.addEventListener('touchend', () => (isDragging = false));

    window.addEventListener('touchmove', (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevMousePos.x;
      const deltaY = e.touches[0].clientY - prevMousePos.y;

      group.rotation.y += deltaX * 0.008;
      group.rotation.x += deltaY * 0.008;

      prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    });

    function animateHero() {
      requestAnimationFrame(animateHero);

      if (!isDragging) {
        group.rotation.x += 0.003;
        group.rotation.y += 0.005;
        ring1.rotation.z += 0.002;
        ring2.rotation.x -= 0.003;
      }

      heroRenderer.render(heroScene, heroCamera);
    }
    animateHero();

    window.addEventListener('resize', () => {
      if (!heroContainer) return;
      heroCamera.aspect = heroContainer.clientWidth / heroContainer.clientHeight;
      heroCamera.updateProjectionMatrix();
      heroRenderer.setSize(heroContainer.clientWidth, heroContainer.clientHeight);
    });
  }
})();