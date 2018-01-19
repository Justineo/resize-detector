import {
  createStyles,
  createElement,
  requestAnimationFrame,
  cancelAnimationFrame,
  getRenderInfo
} from './util'

import triggerStyles from './triggers.css'

let total = 0
let style = null

export function addListener (elem, callback) {
  if (!elem.__resize_mutation_handler__) {
    elem.__resize_mutation_handler__ = handleMutation.bind(elem)
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
    } else if (elem.attachEvent && elem.addEventListener) {
      // targeting IE9/10
      elem.__resize_legacy_resize_handler__ = function handleLegacyResize () {
        runCallbacks(elem)
      }
      elem.attachEvent('onresize', elem.__resize_legacy_resize_handler__)
      document.addEventListener('DOMSubtreeModified', elem.__resize_mutation_handler__)
    } else {
      if (!total) {
        style = createStyles(triggerStyles)
      }
      initTriggers(elem)

      elem.__resize_rendered__ = getRenderInfo(elem).rendered
      if (window.MutationObserver) {
        let mo = new MutationObserver(elem.__resize_mutation_handler__)
        mo.observe(document, {
          attributes: true,
          childList: true,
          characterData: true,
          subtree: true
        })
        elem.__resize_mutation_observer__ = mo
      }
    }
  }

  elem.__resize_listeners__.push(callback)
  total++
}

export function removeListener (elem, callback) {
  // targeting IE9/10
  if (elem.detachEvent && elem.removeEventListener) {
    elem.detachEvent('onresize', elem.__resize_legacy_resize_handler__)
    document.removeEventListener('DOMSubtreeModified', elem.__resize_mutation_handler__)
    return
  }

  let listeners = elem.__resize_listeners__
  listeners.splice(listeners.indexOf(callback), 1)

  if (!listeners.length) {
    if (elem.__resize_observer__) {
      elem.__resize_observer__.unobserve(elem)
      elem.__resize_observer__ = null
    } else {
      if (elem.__resize_mutation_observer__) {
        elem.__resize_mutation_observer__.unobserve(elem)
      }
      elem.removeEventListener('scroll', handleScroll)
      elem.removeChild(elem.__resize_triggers__.triggers)
      elem.__resize_triggers__ = null
      elem.__resize_listeners__ = null
    }
  }

  if (!--total && style) {
    style.parentNode.removeChild(style)
  }
}

function getUpdatedSize (elem) {
  let { width, height } = elem.__resize_last__
  let { offsetWidth, offsetHeight } = elem
  if (offsetWidth !== width || offsetHeight !== height) {
    return {
      width: offsetWidth,
      height: offsetHeight
    }
  }
  return null
}

function handleMutation () {
  // `this` denotes the scrolling element
  let { rendered, detached } = getRenderInfo(this)
  if (rendered !== this.__resize_rendered__) {
    if (!detached && this.__resize_triggers__) {
      resetTriggers(this)
      this.addEventListener('scroll', handleScroll, true)
    }
    this.__resize_rendered__ = rendered
    runCallbacks(this)
  }
}

function handleScroll () {
  // `this` denotes the scrolling element
  resetTriggers(this)
  if (this.__resize_raf__) {
    cancelAnimationFrame(this.__resize_raf__)
  }
  this.__resize_raf__ = requestAnimationFrame(() => {
    let updated = getUpdatedSize(this)
    if (updated) {
      this.__resize_last__ = updated
      runCallbacks(this)
    }
  })
}

function runCallbacks (elem) {
  elem.__resize_listeners__.forEach(callback => {
    callback.call(elem)
  })
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

  elem.__resize_last__ = {
    width: elem.offsetWidth,
    height: elem.offsetHeight
  }
}

function resetTriggers (elem) {
  let { expand, expandChild, contract } = elem.__resize_triggers__

  // batch read
  let { scrollWidth: csw, scrollHeight: csh } = contract
  let { offsetWidth: eow, offsetHeight: eoh, scrollWidth: esw, scrollHeight: esh } = expand

  // batch write
  contract.scrollLeft = csw
  contract.scrollTop = csh
  expandChild.style.width = eow + 1 + 'px'
  expandChild.style.height = eoh + 1 + 'px'
  expand.scrollLeft = esw
  expand.scrollTop = esh
}
