---
layout: editorial
title: About
permalink: /
ed_active: about
description: PoHan (Kozak) Hou (侯博瀚) is a PhD student at the University of Tokyo working on scientific machine learning for fusion plasma simulations.
keywords: Kozak Hou, PoHan Hou, 侯博瀚, Hou PoHan, Hóu Bó-Hàn, Reg-PINNs, PINN, Neural Operator, Physics-Informed Neural Operator, Fusion Science, University of Tokyo, UTokyo, Imperial College London, National Central University, Scientific Computing, Scientific Machine Learning, TST-2, Nuclear Fusion, Plasma, Lower Hybrid Wave, HPC
og_image: /assets/img/selfie.jpg
nav_order: 1
---

<div class="personal-home">
  <section class="personal-intro" aria-labelledby="home-title">
    <div class="personal-intro-copy">
      <h1 id="home-title">Hi, I’m Kozak.</h1>
      <p class="personal-lede">
        I work on fusion physics, scientific machine learning, and the awkward gap between a good equation and code that runs fast enough.
      </p>
      <p>
        At the <a href="https://www.u-tokyo.ac.jp/en/" target="_blank" rel="noopener">University of Tokyo</a>,
        I’m researching physics-informed neural operators for two-dimensional lower-hybrid-wave simulations on the TST-2 spherical tokamak.
      </p>
      <p>
        Before Tokyo, I studied computational science in London and space science in Taiwan. I also build production software and help engineering teams decide when a learned surrogate is genuinely useful.
      </p>
      <nav class="personal-inline-links" aria-label="Profile links">
        <a href="{{ '/projects/' | relative_url }}">Research</a>
        <a href="{{ '/publications/' | relative_url }}">Publications</a>
        <a href="{{ '/CV/' | relative_url }}">CV</a>
        <a href="https://github.com/KozakHou" target="_blank" rel="noopener">GitHub</a>
        <a href="mailto:kozak20010716@gmail.com">Email</a>
      </nav>
    </div>

    <figure class="personal-portrait">
      <img src="{{ '/assets/img/selfie.jpg' | relative_url }}" alt="Kozak Hou outdoors, with Florence in the background">
      <figcaption>Florence, Italy, 2025</figcaption>
    </figure>
  </section>

  <section class="personal-now" aria-labelledby="now-title">
    <div class="personal-section-mark">Right now</div>
    <div>
      <h2 id="now-title">Making wave simulations fast enough to explore.</h2>
      <p>
        My PhD work asks whether a neural operator can preserve the physics of a lower-hybrid-wave solver while cutting the time needed for each run. The current scheme reaches <strong>281.8× faster inference</strong> in a rectangular domain and <strong>25.8×</strong> in TST-2 circular geometry.
      </p>
      <a class="personal-text-link" href="{{ '/projects/physics-based-ml-2d-lower-hybrid-wave-tst2/' | relative_url }}">Read the project <span aria-hidden="true">↗</span></a>
    </div>
    <aside class="personal-desk-note">
      <span>On the desk</span>
      TST-2 geometry<br>
      neural operators<br>
      a lot of profiler output
    </aside>
  </section>

  <section class="personal-work" aria-labelledby="work-title">
    <header class="personal-section-heading">
      <div class="personal-section-mark">Selected work</div>
      <div>
        <h2 id="work-title">A few problems I’ve spent real time on.</h2>
        <p>Research papers, production experiments, and the numerical details in between.</p>
      </div>
    </header>

    <div class="personal-project-list">
      <a class="personal-project" href="{{ '/projects/physics-based-ml-2d-lower-hybrid-wave-tst2/' | relative_url }}">
        <div class="personal-project-place">Tokyo · now</div>
        <div class="personal-project-copy">
          <h3>Making lower-hybrid-wave simulation fast enough to iterate on</h3>
          <p>A physics-informed neural-operator surrogate for TST-2, with a 498 MB footprint and up to 281.8× faster inference.</p>
          <span>PhD research · fusion plasma</span>
        </div>
        <img src="{{ '/assets/img/TST2.jpeg' | relative_url }}" alt="TST-2 spherical tokamak">
      </a>

      <a class="personal-project" href="{{ '/projects/pretrained-fourier-neural-operator-for-non-newtonian-fluid-dynamics/' | relative_url }}">
        <div class="personal-project-place">Moldex3D · 2023</div>
        <div class="personal-project-copy">
          <h3>Replacing hours of mold-flow simulation with seconds of inference</h3>
          <p>A Fourier neural operator for non-Newtonian fluid dynamics, tested against a production simulation workflow at under 3% error.</p>
          <span>Industry R&amp;D · operator learning</span>
        </div>
        <img src="{{ '/assets/img/cae.jpg' | relative_url }}" alt="Mold-flow analysis result">
      </a>

      <a class="personal-project" href="{{ '/projects/regression-based-physics-informed-neural-networks-for-magentopause-tracking/' | relative_url }}">
        <div class="personal-project-place">Taiwan/UK · 2025</div>
        <div class="personal-project-copy">
          <h3>Teaching a neural network where the magnetopause ought to be</h3>
          <p>Reg-PINNs combine an empirical physics model with a neural network and reduce RMSE by roughly 30% over Shue et al. [1998].</p>
          <span>Published research · space physics</span>
        </div>
        <img src="{{ '/assets/img/mag.jpg' | relative_url }}" alt="Magnetopause simulation">
      </a>
    </div>

    <a class="personal-all-work" href="{{ '/projects/' | relative_url }}">See all research and projects <span aria-hidden="true">→</span></a>
  </section>

  <section class="personal-coordinates" aria-labelledby="coordinates-title">
    <header>
      <div class="personal-section-mark">A few coordinates</div>
      <h2 id="coordinates-title">Taiwan → London → Tokyo</h2>
      <p>The subjects changed along the way. The habit of moving between physics and software did not.</p>
    </header>
    <ol>
      <li>
        <span>Japan</span>
        <strong>University of Tokyo</strong>
        <small>PhD · nuclear fusion research</small>
      </li>
      <li>
        <span>UK</span>
        <strong>Imperial College London</strong>
        <small>MSc · applied computational science</small>
      </li>
      <li>
        <span>Taiwan</span>
        <strong>National Central University</strong>
        <small>BSc · space science &amp; engineering</small>
      </li>
    </ol>
  </section>

  <section class="personal-signoff" aria-labelledby="signoff-title">
    <div>
      <div class="personal-section-mark">Work with me</div>
      <h2 id="signoff-title">Have a simulation that takes too long?</h2>
      <p>Send me the solver, geometry, runtime, and the bottleneck you care about. I’ll give you an honest first read on whether scientific ML or classical HPC is the better answer.</p>
    </div>
    <div class="personal-signoff-links">
      <a href="{{ '/consulting/' | relative_url }}">Consulting details <span aria-hidden="true">→</span></a>
      <a href="mailto:kozak20010716@gmail.com">kozak20010716@gmail.com</a>
    </div>
  </section>
</div>
