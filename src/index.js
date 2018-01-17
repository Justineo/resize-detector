import {
  getAnimation,
  createStyles,
  createElement,
  requestAnimationFrame,
  cancelAnimationFrame
} from './compat'

import triggerStyles from './triggers.css'

let total = 0
let style = null
const ANIM_NAME = 'resize-attach'

export function addListener (elem, callback) {
  if (elem.attachEvent) {
    elem.attachEvent('onresize', callback)
    return
  }

  let listeners = elem.__resize_listeners__

  if (!listeners) {
    elem.__resize_listeners__ = []
    if (window.ResizeObserver) {
      let ro = new ResizeObserver(() => {
        runCallbacks(elem)
      })
      ro.observe(elem)
      elem.__resize_observer__ = ro
    } else {
      if (!total) {
        style = prepareStyles()
      }
      initTriggers(elem)
    }
    // for browsers that support animation, skip first scrollEvent
    elem.__resize_skip___ = !!getAnimation()
  }

  elem.__resize_listeners__.push(callback)
  total++
}

export function removeListener (elem, callback) {
  if (elem.detachEvent) {
    elem.detachEvent('onresize', callback)
    return
  }

  let listeners = elem.__resize_listeners__
  listeners.splice(listeners.indexOf(callback), 1)

  if (!listeners.length) {
    if (elem.__resize_observer__) {
      elem.__resize_observer__.unobserve(elem)
      elem.__resize_observer__ = null
    } else {
      elem.removeEventListener('scroll', callback)
      elem.removeChild(elem.__resize_triggers__.triggers)
      elem.__resize_triggers__ = null
    }
  }

  if (!--total) {
    style.parentNode.removeChild(style)
  }
}

function checkTriggers (elem) {
  let { width, height } = elem.__resize_last__
  return elem.offsetWidth !== width || elem.offsetHeight !== height
}

function handleScroll () {
  // `this` denotes the scrolling element
  resetTriggers(this)
  if (this.__resize_raf__) {
    cancelAnimationFrame(this.__resize_raf__)
  }
  this.__resize_raf__ = requestAnimationFrame(() => {
    if (checkTriggers(this)) {
      this.__resize_last__.width = this.offsetWidth
      this.__resize_last__.height = this.offsetHeight
      runCallbacks(this)
    }
  })
}

function runCallbacks (elem) {
  if (elem.__resize_skip___) {
    elem.__resize_skip___ = false
    return
  }
  elem.__resize_listeners__.forEach(callback => {
    callback.call(elem)
  })
}

function prepareStyles () {
  let animation = getAnimation()
  let styleText = ''

  if (animation) {
    let { property, keyframes } = animation
    styleText = `@${keyframes} ${ANIM_NAME}{0%:{opacity:0;}to:{opacity:0}}.resize-triggers{${property}:1ms ${ANIM_NAME}}`
  }

  styleText += triggerStyles

  return createStyles(styleText)
}

function initTriggers (elem) {
  let position = getComputedStyle(elem).position
  if (position === 'static') {
    elem.style.position = 'relative'
  }

  elem.__resize_old_position__ = position
  elem.__resize_last__ = {}

  let triggers = createElement('div', {
    className: 'resize-triggers'
  })
  let expand = createElement('div', {
    className: 'resize-expand-trigger'
  })
  let expandChild = createElement('div')
  let contract = createElement('div', {
    className: 'resize-contract-trigger'
  })
  expand.appendChild(expandChild)
  triggers.appendChild(expand)
  triggers.appendChild(contract)
  elem.appendChild(triggers)

  elem.__resize_triggers__ = {
    triggers,
    expand,
    expandChild,
    contract
  }

  resetTriggers(elem)

  elem.addEventListener('scroll', handleScroll, true)

  let { startEvent } = getAnimation() || {}
  if (startEvent) {
    triggers.addEventListener(startEvent, ({ animationName }) => {
      if (animationName === ANIM_NAME) {
        resetTriggers(elem)
      }
    })
  }
}

function resetTriggers (elem) {
  let { expand, expandChild, contract } = elem.__resize_triggers__

  contract.scrollLeft = contract.scrollWidth
  contract.scrollTop = contract.scrollHeight
  expandChild.style.width = expand.offsetWidth + 1 + 'px'
  expandChild.style.height = expand.offsetHeight + 1 + 'px'
  expand.scrollLeft = expand.scrollWidth
  expand.scrollTop = expand.scrollHeight
}
