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

const ANIM_PROP_PREFIXES = ['Webkit', 'Moz', 'O', 'ms']
const ANIM_START_EVENTS = [
  'webkitAnimationStart',
  'animationstart',
  'oAnimationStart',
  'MSAnimationStart'
]

let animation = null
export function getAnimation () {
  if (!animation) {
    let el = document.createElement('div')
    if (el.style.animation !== undefined) {
      animation = {
        property: 'animation',
        startEvent: 'animationstart',
        keyframes: 'keyframes'
      }
      return animation
    }

    ANIM_PROP_PREFIXES.some((prefix, i) => {
      let property = `${prefix}Animation`
      if (el.style[property] !== undefined) {
        animation = {
          property,
          startEvent: ANIM_START_EVENTS[i],
          keyframes: `-${prefix.toLowerCase()}-keyframes`
        }
        return true
      }
    })

    return animation
  }
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
