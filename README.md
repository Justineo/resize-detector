# Resize Listener

### developit/simple-element-resize-detector

- **Is polyfill**

  No.

- **Native first**

  No.

- **Strategy**

  Listen to `resize` events via hidden `<iframe>`s.

- **Pros**

  Dead simple.

- **Side effects**

  * Targets with `position: static` will become `position: relative`.
  * Several hidden elements will be injected into the target elements.
  * Relatively low performance.

- **Limitations**

  * Inapplicable for void elements.
  * Cannot track detach/attach or visibility change.

### que-etc/resize-observer-polyfill

- **Is polyfill**

  No.

- **Native first**

  Yes.

- **Fallback Strategy**

  Use `MutationObserver` to observe every mutation in a document. For IE9/10, use Mutation Events instead.

- **Pros**

  * Minimal side effects on target elements.
  * Can track detach/attach or visibility change as soon as it's triggered by DOM mutation.

- **Limitations**

  * Need extra transition event handling to catch size change from user interaction pseudo classes like `:hover`.
  * Delayed transitions will receive only one notification with the latest dimensions of an element.

### pelotoncycle/resize-observer

- **Is polyfill?**

  Yes.

- **Native first**

  Yes.

- **Fallback Strategy**

  Long polling using `requestAnimationFrame` or `setTimeout`.

- **Pros**

  Dead simple.

- **Side effects**

  * Might be not so performant by checking rendered metrics on each animation frame.

### wnr/element-resize-detector

- **Is polyfill?**

  No.

- **Native first**

  No.

- **Strategy**

  Either hidden `<object>`s or scroll-based.

- **Pros**

  Two approaches available (Really, why?) with scroll-based approach being much faster than hidden `<object>`s.

- **Side effects**

  * Targets with `position: static` will become `position: relative`.
  * Several hidden elements will be injected into the target elements.

- **Limitations**

  * Inapplicable for void elements.
  * Cannot track detach/attach or visibility change.

### sdecima/javascript-detect-element-resize

- **Is polyfill?**

  No.

- **Native first**

  No.

- **Strategy**

  Scroll-based.

- **Pros**

  * Higher performance comparing to hidden `<object>`s.
  * Compatible with down to IE7.

- **Side effects**

  * Targets with `position: static` will become `position: relative`.
  * Several hidden elements will be injected into the target elements.

- **Limitations**

  * Cannot track detach/attach or visibility change on IE10 and below.


