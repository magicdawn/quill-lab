/* eslint-env browser */

import Quill from 'quill'
import 'quill/dist/quill.core.css'
import './assets/css/style.css'

import Toolbar from 'quill/modules/toolbar'
import Snow from 'quill/themes/snow'

// import Bold from 'quill/formats/bold'
// import Italic from 'quill/formats/italic'

const quill = new Quill('#editor-container')
const Inline = Quill.import('blots/inline')
const Block = Quill.import('blots/block')
window.quill = quill

// basic formatting
class Bold extends Inline {
  static blotName = 'bold'
  static tagName = 'strong'
}
class Italic extends Inline {
  static blotName = 'italic'
  static tagName = 'em'
}

class Link extends Inline {
  static blotName = 'link'
  static tagName = 'a'

  static create(value) {
    const node = super.create()
    const {target = '_blank', href} = value
    node.setAttribute('href', href)
    node.setAttribute('target', target)
    return node
  }

  static formats(node) {
    return {
      target: node.getAttribute('target'),
      href: node.getAttribute('href'),
    }
  }
}

class Blockquote extends Block {
  static blotName = 'blockquote'
  static tagName = 'blockquote'
}

class Header extends Block {
  static blotName = 'header'
  static tagName = ['H1', 'H2', 'H3', 'H4']

  // super.create 见 parchment ShadowBlot.create
  // super.create(value: number) -> tagName[value -1]
  // super.create(tagName: string)
  // super.create(invalid) -> tagName[0]
  static create(value) {
    const {tagName} = value
    console.log('Header.create: %s', tagName)
    return super.create(tagName)
  }

  // 成为 delta 的 attributes, { insert: 'Hello', attributes: { header: { tagName: 'H2' } } }
  static formats(node) {
    return {tagName: node.tagName}
  }
}

Quill.register(Bold)
Quill.register(Italic)
Quill.register(Link)
Quill.register(Blockquote)
Quill.register(Header)

$('#bold-button').click(() => {
  quill.format('bold', true)
})

$('#italic-button').click(() => {
  quill.format('italic', true)
})

$('#link-button').click(() => {
  const link = prompt('enter link')
  if (!link) return
  quill.format('link', {href: link, abc: 123}) // abc useless
})

$('#blockquote-button').click(() => {
  quill.format('blockquote', true)
})

$('.header-button').click(function () {
  const level = $(this).find('sub').text()
  quill.format('header', {tagName: 'H' + level})
})

// API usage
window.quillApi = {
  insertText() {
    quill.insertText(10, 'test insert text', {bold: true})
  },

  formatText(val = true) {
    quill.formatText(0, 4, 'italic', !!val) // true as value
  },

  getFormat() {
    return quill.getFormat(0, 4)
  },
}
