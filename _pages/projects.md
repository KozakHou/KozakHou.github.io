---
layout: editorial
title: Research
permalink: /projects/
ed_active: research
keywords: Kozak Hou, PoHan Hou, Research, Projects, Reg-PINNs, PINN, Neural Operator, Fourier Neural Operator, TST-2, Lower Hybrid Wave, Scientific Computing, Scientific Machine Learning, HPC, Parallel Computing
nav_order: 4
---

<div class="ed-research-head">
  <h1 class="ed-h1">Research &amp; Projects</h1>
  <p class="ed-sub">Scientific machine learning applied to plasma physics, fluid dynamics, and high-performance computing.</p>
</div>

<div class="ed-cards">
  <a class="ed-card" href="{{ '/projects/physics-based-ml-2d-lower-hybrid-wave-tst2/' | relative_url }}">
    <img src="{{ '/assets/img/TST2.jpeg' | relative_url }}" alt="TST-2 Spherical Tokamak">
    <div class="ed-card-body">
      <div class="ed-card-kicker">PHD RESEARCH · UTOKYO</div>
      <div class="ed-card-title">Physics-based ML Scheme for Accelerating 2D Lower-Hybrid Wave Simulation on TST-2</div>
      <p class="ed-card-desc">Physics-Informed Neural Operator surrogate for lower hybrid waves — 281.8× faster inference in rectangular domains, 25.8× in TST-2 circular geometry, within a 498 MB footprint.</p>
      <div class="ed-card-more">Read more →</div>
    </div>
  </a>
  <a class="ed-card" href="{{ '/projects/pretrained-fourier-neural-operator-for-non-newtonian-fluid-dynamics/' | relative_url }}">
    <img src="{{ '/assets/img/cae.jpg' | relative_url }}" alt="Mold flow analysis">
    <div class="ed-card-body">
      <div class="ed-card-kicker">OPERATOR LEARNING</div>
      <div class="ed-card-title">Pretrained Fourier Neural Operator for Non-Newtonian Fluid Dynamics</div>
      <p class="ed-card-desc">FNO surrogate for mold-flow analysis in Moldex3D — predicting pressure (MAE &lt; 3 Pa) and melt front time (MAE &lt; 0.3 s).</p>
      <div class="ed-card-more">Read more →</div>
    </div>
  </a>
  <a class="ed-card" href="{{ '/projects/regression-based-physics-informed-neural-networks-for-magentopause-tracking/' | relative_url }}">
    <img src="{{ '/assets/img/mag.jpg' | relative_url }}" alt="Magnetopause tracking">
    <div class="ed-card-body">
      <div class="ed-card-kicker">SPACE PHYSICS · PUBLISHED</div>
      <div class="ed-card-title">Reg-PINNs for Magnetopause Tracking</div>
      <p class="ed-card-desc">Regression-based Physics-Informed Neural Networks combining empirical models with deep learning — ~30% RMSE reduction vs. Shue et al. [1998].</p>
      <div class="ed-card-more">Read more →</div>
    </div>
  </a>
  <a class="ed-card" href="{{ '/projects/parallel-computing-with-applications-in-quantitative-strategies/' | relative_url }}">
    <img src="{{ '/assets/img/CCON.png' | relative_url }}" alt="Parallel computing benchmark">
    <div class="ed-card-body">
      <div class="ed-card-kicker">HPC</div>
      <div class="ed-card-title">Parallel Computing, with Applications in Quantitative Strategies</div>
      <p class="ed-card-desc">Multicore benchmarking of a volatility-momentum equity strategy on an HPC cluster.</p>
      <div class="ed-card-more">Read more →</div>
    </div>
  </a>
</div>
