'use strict'

const fs = require('fs')

const libDomDTsText = fs.readFileSync(require.resolve('typescript/lib/lib.dom.d.ts'), 'utf8')

// ------------------------------------------------------------------------------
// Update html-elements.json
// ------------------------------------------------------------------------------
updateHTMLElements()
function updateHTMLElements () {
  const HTML_ELEMENTS_PATH = require.resolve('../lib/utils/html-elements.json')
  const elements = new Set(require(HTML_ELEMENTS_PATH))
  const deprecatedHtmlElements = new Set(require('../lib/utils/deprecated-html-elements.json'))
  const htmlElementTagNameMapText = /interface\s+HTMLElementTagNameMap\s+\{([\s\S]*?)\}/u.exec(libDomDTsText)
  const strPattern = /"([^"]+)"/gu
  let result
  while ((result = strPattern.exec(htmlElementTagNameMapText))) {
    if (deprecatedHtmlElements.has(result[1])) {
      continue
    }
    elements.add(result[1])
  }
  for (const tag of require('html-tags')) {
    if (deprecatedHtmlElements.has(tag)) {
      continue
    }
    elements.add(tag)
  }
  fs.writeFileSync(HTML_ELEMENTS_PATH, JSON.stringify([...elements].sort(), null, 2) + '\n', 'utf8')
}

// ------------------------------------------------------------------------------
// Update svg-elements.json
// ------------------------------------------------------------------------------
updateSVGElements()
function updateSVGElements () {
  const SVG_ELEMENTS_PATH = require.resolve('../lib/utils/svg-elements.json')
  const elements = new Set(require(SVG_ELEMENTS_PATH))
  const svgElementTagNameMapText = /interface\s+SVGElementTagNameMap\s+\{([\s\S]*?)\}/u.exec(libDomDTsText)
  const strPattern = /"([^"]+)"/gu
  let result
  while ((result = strPattern.exec(svgElementTagNameMapText))) {
    elements.add(result[1])
  }
  for (const tag of require('svg-tags')) {
    elements.add(tag)
  }
  fs.writeFileSync(SVG_ELEMENTS_PATH, JSON.stringify([...elements].sort(), null, 2) + '\n', 'utf8')
}

// ------------------------------------------------------------------------------
// Update native-events.json
// ------------------------------------------------------------------------------
updateNativeEvents()
function updateNativeEvents () {
  // The result of running the following script in a browser:  var keys=[];for(const k in document.createElement('div')){keys.push(k)};JSON.stringify(keys.sort().filter(k=>k.startsWith('on')).map(k=>k.slice(2)))
  const BROWSER_NATIVE_EVENTS = ['abort', 'animationend', 'animationiteration', 'animationstart', 'auxclick', 'beforecopy', 'beforecut', 'beforepaste', 'blur', 'cancel', 'canplay', 'canplaythrough', 'change', 'click', 'close', 'contextmenu', 'copy', 'cuechange', 'cut', 'dblclick', 'drag', 'dragend', 'dragenter', 'dragleave', 'dragover', 'dragstart', 'drop', 'durationchange', 'emptied', 'ended', 'error', 'focus', 'formdata', 'fullscreenchange', 'fullscreenerror', 'gotpointercapture', 'input', 'invalid', 'keydown', 'keypress', 'keyup', 'load', 'loadeddata', 'loadedmetadata', 'loadstart', 'lostpointercapture', 'mousedown', 'mouseenter', 'mouseleave', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'mousewheel', 'paste', 'pause', 'play', 'playing', 'pointercancel', 'pointerdown', 'pointerenter', 'pointerleave', 'pointermove', 'pointerout', 'pointerover', 'pointerrawupdate', 'pointerup', 'progress', 'ratechange', 'reset', 'resize', 'scroll', 'search', 'seeked', 'seeking', 'select', 'selectionchange', 'selectstart', 'stalled', 'submit', 'suspend', 'timeupdate', 'toggle', 'transitionend', 'volumechange', 'waiting', 'webkitanimationend', 'webkitanimationiteration', 'webkitanimationstart', 'webkitfullscreenchange', 'webkitfullscreenerror', 'webkittransitionend', 'wheel']
  const NATIVE_EVENTS_PATH = require.resolve('../lib/utils/native-events.json')
  const events = new Set()// new Set(require(NATIVE_EVENTS_PATH))

  for (const e of BROWSER_NATIVE_EVENTS) {
    events.add(e)
  }
  const eventMapPattern = /interface\s+[a-z]*EventMap\s+(?:extends[^{]*)?\{([\s\S]*?)\}/giu
  let eventMapResult
  while ((eventMapResult = eventMapPattern.exec(libDomDTsText))) {
    const eventMapText = eventMapResult[1]
    const strPattern = /"([^"]+)"/gu
    let result
    while ((result = strPattern.exec(eventMapText))) {
      events.add(result[1])
    }
  }

  fs.writeFileSync(NATIVE_EVENTS_PATH, JSON.stringify([...events].sort(), null, 2) + '\n', 'utf8')
}
