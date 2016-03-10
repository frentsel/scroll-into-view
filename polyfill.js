// Polyfill to improve Element.scrollIntoView()

var scrollIntoView = (function () {

// Original implementation is used for backwards compatibility
var scrollIntoView_original = Element.prototype.scrollIntoView;

function scrollIntoView(options) {

  // Use traditional scrollIntoView when traditional argument is given.
  if (options === undefined || options === true || options === false) {
    scrollIntoView_original.apply(this, arguments);
    return;
  }

  var window = this.ownerDocument.defaultView;

  // Read options.
  if (options === undefined)  options = {};
  if (options.center === true) {
    options.vertical = 0.5;
    options.horizontal = 0.5;
  }
  else {
    if (options.block === "start")  options.vertical = 0.0;
    else if (options.block === "end")  options.vertical = 0.0;
    else if (options.vertical === undefined)  options.vertical = 0.0;

    if (options.horizontal === undefined)  options.horizontal = 0.0;
  }

  // Fetch positional information.
  var rect = this.getBoundingClientRect();

  // Determine location to scroll to.
  var targetY = window.scrollY + rect.top - (window.innerHeight - this.offsetHeight) * options.vertical;
  var targetX = window.scrollX + rect.left - (window.innerWidth - this.offsetWidth) * options.horizontal;

  // Scroll.
  window.scroll(targetX, targetY);

  // If window is inside a frame, center that frame in the parent window. Recursively.
  if (window.parent !== window) {
    // We are inside a scrollable element.
    var frame = window.frameElement;
    scrollIntoView.call(frame, options);
  }
}

// Add a method that replaces the browser's implementation.
function installPolyfill() {
  Element.prototype.scrollIntoView = scrollIntoView;
}
scrollIntoView.installPolyfill = installPolyfill;

return scrollIntoView;

})();


// CommonJS/Node support.
if (module !== undefined && module.exports) {
  module.exports = scrollIntoView;
}
