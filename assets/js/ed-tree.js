'use strict';

function initEdTree(root) {
  if (!root) return;
  var detail = root.querySelector('#ed-tree-detail');
  var leaves = Array.prototype.slice.call(root.querySelectorAll('.ed-tree-leaf'));
  if (!detail || leaves.length === 0) return;

  root.classList.add('ed-tree-ready');

  function setDetail(leaf) {
    if (!leaf) {
      detail.textContent = 'Hover a result to read the full explanation.';
      return;
    }
    detail.textContent = leaf.getAttribute('data-detail') || '';
  }

  leaves.forEach(function (leaf) {
    leaf.addEventListener('mouseenter', function () {
      leaves.forEach(function (x) {
        x.classList.toggle('active', x === leaf);
      });
      setDetail(leaf);
    });
    leaf.addEventListener('mouseleave', function () {
      leaf.classList.remove('active');
    });
    leaf.addEventListener('focus', function () {
      leaves.forEach(function (x) {
        x.classList.toggle('active', x === leaf);
      });
      setDetail(leaf);
    });
    leaf.addEventListener('blur', function () {
      leaf.classList.remove('active');
    });
  });
}

function bootEdTree() {
  var root = document.getElementById('ed-tree');
  if (root) initEdTree(root);
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootEdTree);
  } else {
    bootEdTree();
  }
}
