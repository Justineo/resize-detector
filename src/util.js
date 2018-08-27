let raf = null
export function requestAnimationFrame (callback) {
  if (!raf) {
    raf = (
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      function (callback) {
        return setTimeout(callback, 16)
      }
    ).bind(window)
  }
  return raf(callback)
}

let caf = null
export function cancelAnimationFrame (id) {
  if (!caf) {
    caf = (
      window.cancelAnimationFrame ||
      window.webkitCancelAnimationFrame ||
      window.mozCancelAnimationFrame ||
      function (id) {
        clearTimeout(id)
      }
    ).bind(window)
  }

  caf(id)
}

export function createStyles (styleText) {
  var style = document.createElement('style')
  style.type = 'text/css'

  if (style.styleSheet) {
    style.styleSheet.cssText = styleText
  } else {
    style.appendChild(document.createTextNode(styleText))
  }
  (document.querySelector('head') || document.body).appendChild(style)
  return style
}

export function createElement (tagName, props = {}) {
  let elem = document.createElement(tagName)
  Object.keys(props).forEach(key => {
    elem[key] = props[key]
  })
  return elem
}

export function getComputedStyle (elem, prop, pseudo) {
  // for older versions of Firefox, `getComputedStyle` required
  // the second argument and may return `null` for some elements
  // when `display: none`
  let computedStyle = window.getComputedStyle(elem, pseudo || null) || {
    display: 'none'
  }

  return computedStyle[prop]
}

export function getRenderInfo (elem) {
  if (!document.documentElement.contains(elem)) {
    return {
      detached: true,
      rendered: false
    }
  }

  let current = elem
  while (current !== document) {
    if (getComputedStyle(current, 'display') === 'none') {
      return {
        detached: false,
        rendered: false
      }
    }
    current = current.parentNode
  }

  return {
    detached: false,
    rendered: true
  }
}
