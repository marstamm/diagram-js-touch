import { closest as domClosest } from "min-dom";

import { toPoint } from "diagram-js/lib/util/Event";

var HIGH_PRIORITY = 1500;

export default function HoverFix(elementRegistry, eventBus, injector) {
  var self = this;

  var dragging = injector.get("dragging", false);

  /**
   * Make sure we are god damn hovering!
   *
   * @param {Event} dragging event
   */
  function ensureHover(event) {
    var originalEvent = event.originalEvent;

    if (!(originalEvent instanceof TouchEvent)) {
      return;
    }

    var gfx = self._findTargetGfx(originalEvent);

    var element = gfx && elementRegistry.get(gfx);

    if (element === event.hover) {
      return;
    }

    if (gfx && element) {
      // 1) cancel current mousemove
      event.stopPropagation();

      // 2) emit fake hover for new target
      dragging.hover({ element: element, gfx: gfx });

      // 3) re-trigger move event
      dragging.move(originalEvent);
    }
  }

  if (dragging) {
    eventBus.on("drag.start", function (event) {
      eventBus.on("drag.move", HIGH_PRIORITY, function (event) {
        ensureHover(event);
      });
    });
  }

  this._findTargetGfx = function (event) {
    var position, target;

    if (!(event instanceof TouchEvent)) {
      return;
    }

    position = toPoint(event);
    target = document.elementFromPoint(position.x, position.y);

    return getGfx(target);
  };
}

HoverFix.$inject = ["elementRegistry", "eventBus", "injector"];

// helpers /////////////////////

function getGfx(target) {
  return domClosest(target, "svg, .djs-element", true);
}
