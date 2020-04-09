declare namespace resizeDetector {
  type ResizeCallback<E extends HTMLElement = HTMLElement> = (this: E, element: E) => void;

  function addListener<E extends HTMLElement = HTMLElement>(elem: E, callback: ResizeCallback<E>): void;

  function removeListener<E extends HTMLElement = HTMLElement>(elem: E, callback?: ResizeCallback<E>): void;
}

export = resizeDetector;
