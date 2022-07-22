{# ------------------------------------------------------
LISTING
--------------------------------------------------------#}

{# Graps the menu from the settings config (set in _data/menu.json) #}
{% for item in menu.main %}
  {% if item.url in page.url -%}
    <a href="{{ item.url }}" class="font-bold" title="{{ item.text}}">{{ item.title }}</a>
  {% else %}
    <a href="{{ item.url }}" class=""   title="{{ item.text}}">{{ item.title }}</a>
  {% endif %}
{% endfor %} #}

{# All pages #}
{% for item in collections.allPages | sortByOrder %}
  {% if item.url in page.url -%}
    <a href="{{ item.url }}" class="font-bold">{{item.data.title}}</a>
  {% else %}
    <a href="{{ item.url }}" class="">{{item.data.title}}</a>
  {% endif %}
{% endfor %}

{# All post #}
{% for item in collections.allPosts %}
  {% if item.url in page.url -%}
    <a href="{{ item.url }}" title="{{item.data.title}}">{{item.data.title}}</a>
  {% else %}
    <a href="{{ item.url }}" title="{{item.data.title}}">{{item.data.title}}</a>
  {% endif %}
{% endfor %}

{# Previous - Next #}
{%- if collections.allPosts %}
  {%- set nextPost = collections.allPosts | getNextCollectionItem(page) %}
  {%- set previousPost = collections.allPosts | getPreviousCollectionItem(page) %}
  {%- if nextPost or previousPost %}

    {%- if previousPost %}
      <a href="{{ previousPost.url | url }}">{{ previousPost.data.title }}</a>
    {% endif %}

    {%- if nextPost %}
      <a href="{{ nextPost.url | url }}">{{ nextPost.data.title }}</a>
    {% endif %}

  {%- endif %}
{%- endif %}

{# Tags #}
{%- for tag in tags | filterTagList -%}
  {# grap the markdown files from relation-tag and loop through them  get page gets the  permalink set in relation-tag.json#}
  {% for item in collections.all | getPage("/tags/" + tag + "/") %}
    <a href="/tag/{{ tag }}">{{ item.data.title}}</a>,
    {% endfor %}
{% endfor %}

{# Section is set as a  {{ section }} #}
{% if section %}
  {% for item in collections[section] %}
    <a href="{{ item.url }}" title="{{item.data.title}}">{{item.data.title}}</a>
    <p>{{ item.data.teaser }}</p>
    <div>{{ item.data.image }}</div>
  {% endfor %}
{% endif %}

{# ------------------------------------------------------
Images
--------------------------------------------------------#}
{# {% imageBackgroundStyle "image", “size”, “format webp/png/jpg/gif”  %} #}
{# size: [null] format [null] #}
{% imageBackgroundStyle "assets/img/ident.png", “150” %}

{% image image, [320, 600, 1200], "(min-width: 30em) 50vw, 100vw", "a picture", "shadow-lg", "no lazy" %}



```
---
title: my title
layout: base.njk
eleventyExcludeFromCollections: false

permalink: "mega-awesome-stuff/"
tags: post
date: Last Modified

eleventyNavigation:
  key: contact
  parent: about
  order: 1

---
```