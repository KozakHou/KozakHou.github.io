---
layout: default
permalink: /blog/
title: blog
nav: false
nav_order: 2
pagination:
  enabled: true
  collection: posts
  permalink: /page/:num/
  per_page: 5
  sort_field: date
  sort_reverse: true
---
<div class="post">

{% assign blog_name_size = site.blog_name | size %}
{% assign blog_description_size = site.blog_description | size %}

{% if blog_name_size > 0 or blog_description_size > 0 %}

<div class="header-bar">
    <h1>{{ site.blog_name }}</h1>
    <h2>{{ site.blog_description }}</h2>
  </div>
  {% endif %}

{% if site.display_tags or site.display_categories %}

<div class="tag-category-list">
    <ul class="p-0 m-0">
      {% for tag in site.display_tags %}
        <li>
          <i class="fa-solid fa-hashtag fa-sm"></i> <a href="{{ tag | slugify | prepend: '/blog/tag/' | relative_url }}">{{ tag }}</a>
        </li>
        {% unless forloop.last %}
          <p>•</p>
        {% endunless %}
      {% endfor %}
      {% if site.display_categories.size > 0 and site.display_tags.size > 0 %}
        <p>•</p>
      {% endif %}
      {% for category in site.display_categories %}
        <li>
          <i class="fa-solid fa-tag fa-sm"></i> <a href="{{ category | slugify | prepend: '/blog/category/' | relative_url }}">{{ category }}</a>
        </li>
        {% unless forloop.last %}
          <p>•</p>
        {% endunless %}
      {% endfor %}
    </ul>
  </div>
  {% endif %}

{% assign featured_posts = site.posts | where: "featured", "true" %}
{% if featured_posts.size > 0 %}
`<br>`

<div class="container featured-posts">
{% assign is_even = featured_posts.size | modulo: 2 %}
<div class="row row-cols-{% if featured_posts.size <= 2 or is_even == 0 %}2{% else %}3{% endif %}">
{% for post in featured_posts %}
<div class="col mb-4">
<a href="{{ post.url | relative_url }}">
<div class="card hoverable">
<div class="row g-0">
<div class="col-md-12">
<div class="card-body">
<div class="float-right">
<i class="fa-solid fa-thumbtack fa-xs"></i>
</div>
<h3 class="card-title text-lowercase">{{ post.title }}</h3>
<p class="card-text">{{ post.description }}</p>

[[
    {% if post.external_source == blank %}
                      {% assign read_time = post.content | number_of_words | divided_by: 180 | plus: 1 %}
                    {% else %}
                      {% assign read_time = post.feed_content | strip_html | number_of_words | divided_by: 180 | plus: 1 %}
                    {% endif %}
                    {% assign year = post.date | date: &#34;%Y&#34; %}]({{ post.url | relative_url }})]({{ post.url | relative_url }})

[[
    `<p class="post-meta">`
                      {{ read_time }} min read &nbsp; &middot; &nbsp;
                      `<a href="{{ year | prepend: '/blog/' | prepend: site.baseurl}}">`
                        `<i class="fa-solid fa-calendar fa-sm"></i>` {{ year }} `</a>`
                    `</p>`
                  `</div>`
                `</div>`
              `</div>`
            `</div>`
          `</a>`
        `</div>`
      {% endfor %}
      `</div>`
    `</div>`
    `<hr>`]({{ post.url | relative_url }})]({{ post.url | relative_url }})

[[{% endif %}]({{ post.url | relative_url }})]({{ post.url | relative_url }})

[[
    {% if page.pagination.enabled %}
      {% assign postlist = paginator.posts %}
    {% else %}
      {% assign postlist = site.posts %}
    {% endif %}]({{ post.url | relative_url }})]({{ post.url | relative_url }})

[[
    {% for post in postlist %}]({{ post.url | relative_url }})]({{ post.url | relative_url }})

[[
    {% if post.external_source == blank %}
      {% assign read_time = post.content | number_of_words | divided_by: 180 | plus: 1 %}
    {% else %}
      {% assign read_time = post.feed_content | strip_html | number_of_words | divided_by: 180 | plus: 1 %}
    {% endif %}
    {% assign year = post.date | date: &#34;%Y&#34; %}
    {% assign tags = post.tags | join: &#34;&#34; %}
    {% assign categories = post.categories | join: &#34;&#34; %}]({{ post.url | relative_url }})]({{ post.url | relative_url }})

[[
    `<li>`]({{ post.url | relative_url }})]({{ post.url | relative_url }})

[[{% if post.thumbnail %}]({{ post.url | relative_url }})]({{ post.url | relative_url }})

[
    {% if tags != "" %}&nbsp; &middot; &nbsp;
            {% for tag in post.tags %}
            `<a href="{{ tag | slugify | prepend: '/blog/tag/' | prepend: site.baseurl}}">`
              `<i class="fa-solid fa-hashtag fa-sm"></i>` {{ tag }}`</a>`
              {% unless forloop.last %}
                &nbsp;
              {% endunless %}
              {% endfor %}
          {% endif %}]({{ post.url | relative_url }})

[
    {% if categories != "" %}&nbsp; &middot; &nbsp;
            {% for category in post.categories %}
            `<a href="{{ category | slugify | prepend: '/blog/category/' | prepend: site.baseurl}}">`
              `<i class="fa-solid fa-tag fa-sm"></i>` {{ category }}`</a>`
              {% unless forloop.last %}
                &nbsp;
              {% endunless %}
              {% endfor %}
          {% endif %}
    `</p>`]({{ post.url | relative_url }})

[{% if post.thumbnail %}]({{ post.url | relative_url }})

[
{% endif %}
    ]({{ post.url | relative_url }})

[{% endif %}]({{ post.url | relative_url }})

[
    {% endfor %}]({{ post.url | relative_url }})

[{% if page.pagination.enabled %}
{% include pagination.liquid %}
{% endif %}]({{ post.url | relative_url }})
