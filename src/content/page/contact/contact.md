---
order: 1
layout: page/page.liquid
date: 2023-06-21 20:03:22
title: Contact Page
url: contact
image: https://images.unsplash.com/photo-1595740041673-6a525c7be994?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZWxldmVufGVufDB8fDB8fHww
components:
  - type: form
    title: "Contact form "
    name: contact
    action: /contact/thanx
    template: components/form/form.liquid
    elements:
      - type: text
        inputtype: text
        required: true
        title: Name
        placeholder: "Your Name "
      - type: text
        inputtype: email
        required: true
        title: Email
        placeholder: Email
      - type: options
        inputtype: Dropdown
        required: false
        title: Dropdown
        option:
          - checked: true
            title: this is a second option
          - checked: false
            title: This is the default value
      - type: textarea
        title: Message
        required: true
      - type: button
        title: Send
        resettitle: Reset
        reset: true
    text: |-
      Y﻿ou can totally contact us :)
      t﻿ext with stuff on it
eleventyExcludeFromCollections: false
eleventyNavigation:
  title: Contact
  parent: footermenu
  order: 20
  target: false
  url: ""
  key: ""
---