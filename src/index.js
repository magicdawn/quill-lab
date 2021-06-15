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
const BlockEmbed = Quill.import('blots/block/embed')
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

class Divider extends BlockEmbed {
  static blotName = 'divider'
  static tagName = 'hr'

  static create(value) {
    return super.create(value)
  }

  static value(node) {
    return super.value(node)
  }

  static formats(node) {
    return super.formats(node)
  }
}

class Image extends BlockEmbed {
  static blotName = 'image'
  static tagName = 'img'

  static create(value) {
    const node = super.create()
    for (let [key, val] of Object.entries(value)) {
      node.setAttribute(key, val)
    }
    return node
  }

  static value(node) {
    const keys = ['src', 'alt', 'width', 'height']
    return keys.reduce((o, k) => {
      o[k] = node.getAttribute(k)
      return o
    }, {})
  }
}

Quill.register(Bold)
Quill.register(Italic)
Quill.register(Link)
Quill.register(Blockquote)
Quill.register(Header)
Quill.register(Divider)
Quill.register(Image)

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

$('#divider-button').click(() => {
  const range = quill.getSelection(true)
  // quill.insertText(range.index, '\n', Quill.sources.USER) // 没必要这一步, 在 dom 结构上看不出来, quill will do this after `insertEmbed`
  quill.insertEmbed(range.index, 'divider', true, Quill.sources.USER)
  quill.setSelection(range.index + 1, Quill.sources.SILENT)
})

$('#image-button').click(() => {
  const {index} = quill.getSelection(true)
  quill.insertText(index, '\n', Quill.sources.USER)
  quill.insertEmbed(
    index + 1,
    'image',
    {
      src: 'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png',
      alt: 'bd logo',
      width: 100,
      height: 100,
    },
    Quill.sources.USER
  )
  quill.setSelection(index + 2, Quill.sources.SILENT)
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
