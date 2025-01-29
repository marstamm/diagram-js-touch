import {
  domify,
  query as domQuery,
  attr as domAttr,
  clear as domClear,
  classes as domClasses,
  matches as domMatches,
  delegate as domDelegate,
  event as domEvent,
} from "min-dom";

import { delta as deltaPos } from "diagram-js/lib/util/PositionUtil";

import { toPoint } from "diagram-js/lib/util/Event";

export default function TouchMove(palette, eventBus) {
  function _init() {
    let context = {};

    function handleMove(event) {
      const newPos = toPoint(event.touches[0]);
      // Only trigger create when the touch has moved more than 10px

      const delta = deltaPos(context.start, newPos);
      const distance = length(delta);
      if (distance < 10) {
        return;
      }

      palette.trigger("dragstart", event);

      handleEnd(event);
    }

    function handleEnd() {
      domEvent.unbind(document, "touchmove", handleMove);
      domEvent.unbind(document, "touchend", handleEnd);
    }

    function handleStart(event) {
      // palette.trigger('dragstart', event);
      // event.preventDefault();
      context = {
        start: toPoint(event.touches[0]),
      };

      domEvent.bind(document, "touchmove", handleMove);
      domEvent.bind(document, "touchend", handleEnd);
    }

    console.log(palette);

    domDelegate.bind(palette._container, ".entry", "touchstart", handleStart);
  }

  eventBus.on("palette.create", _init);
  // eventBus.on('element.touchstart', function(event) {
  // });
}

TouchMove.$inject = ["palette", "eventBus"];

function length(point, point2) {
  return Math.sqrt(Math.pow(point.x, 2) + Math.pow(point.y, 2));
}
