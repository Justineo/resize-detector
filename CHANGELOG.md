## 0.3.0

* Run through buble for ESM output.
* Update deps.

## 0.2.2

* Stop resize triggers from triggering pointer events.

## 0.2.1

* Callback now receives the target element as the first argument.

## 0.2.0

* Support removing listeners without callbacks to remove all listeners on an element.
* Fix removing listeners in IE.

## 0.1.10

* Check for listeners before running callbacks.

## 0.1.9

* Check for listeners before destroy.

## 0.1.8

* Fix compatibility issue for `getComputedStyle` in older versions of Firefox.

## 0.1.7

* Add initial size diff for `ResizeObserver`.

## 0.1.6

* When attaching `ResizeObserver`, do not skip first callback for initially hidden elements.

## 0.1.5

* Fix documentation.

## 0.1.4

* Skip first callback when using `ResizeObserver`.
