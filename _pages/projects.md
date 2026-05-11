---
layout: page
title: Projects
permalink: /projects/
description: Research and engineering projects by Po-Han (Kozak) Hou spanning Reg-PINNs, PINNs, neural operators, lower hybrid wave simulation, HPC, and parallel computing.
keywords: Kozak Hou, Po-Han Hou, Projects, Reg-PINNs, PINN, Neural Operator, Fourier Neural Operator, TST-2, Lower Hybrid Wave, Scientific Computing, Scientific Machine Learning, HPC, Parallel Computing
nav: true
nav_order: 4
display_categories: 
horizontal: false
---
<!-- pages/projects.md -->

This project portfolio covers scientific computing and scientific machine learning work on Reg-PINNs, PINNs, neural operators, lower hybrid wave simulation on TST-2, high-performance computing, and parallel computing.

<div class="projects">
{% if site.enable_project_categories and page.display_categories %}
  <!-- Display categorized projects -->
  {% for category in page.display_categories %}
  <a id="{{ category }}" href=".#{{ category }}">
    <h2 class="category">{{ category }}</h2>
  </a>
  {% assign categorized_projects = site.projects | where: "category", category %}
  {% assign sorted_projects = categorized_projects | sort: "importance" %}
  <!-- Generate cards for each project -->
  {% if page.horizontal %}
  <div class="container">
    <div class="row row-cols-1 row-cols-md-2">
    {% for project in sorted_projects %}
      {% include projects_horizontal.liquid %}
    {% endfor %}
    </div>
  </div>
  {% else %}
  <div class="row row-cols-1 row-cols-md-3">
    {% for project in sorted_projects %}
      {% include projects.liquid %}
    {% endfor %}
  </div>
  {% endif %}
  {% endfor %}

{% else %}

<!-- Display projects without categories -->

{% assign sorted_projects = site.projects | sort: "importance" %}

<!-- Generate cards for each project -->

{% if page.horizontal %}

<div class="container">
    <div class="row row-cols-1 row-cols-md-2">
    {% for project in sorted_projects %}
      {% include projects_horizontal.liquid %}
    {% endfor %}
    </div>
  </div>
  {% else %}
  <div class="row row-cols-1 row-cols-md-3">
    {% for project in sorted_projects %}
      {% include projects.liquid %}
    {% endfor %}
  </div>
  {% endif %}
{% endif %}
</div>
