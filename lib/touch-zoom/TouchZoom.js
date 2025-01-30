import { unset as cursorUnset } from "diagram-js/lib/util/Cursor";

import { delta as deltaPos } from "diagram-js/lib/util/PositionUtil";

import { event as domEvent } from "min-dom";

import { toPoint } from "diagram-js/lib/util/Event";

/**
 * Move the canvas via mouse.
 *
 * @param {EventBus} eventBus
 * @param {Canvas} canvas
 */
export default function TouchZoom(eventBus, canvas) {
  var context;

  function handleTouch(event) {
    return handleStart(event.originalEvent);
  }

  eventBus.on("element.touchstart", 500, handleTouch);

  function handleMove(event) {
    // Something went wrong
    if (event.touches.length !== 2) {
      return;
    }

    var start = context.start,
      position = [toPoint(event.touches[0]), toPoint(event.touches[1])];

    const delta = [
      deltaPos(start[0], start[1]),
      deltaPos(position[0], position[1]),
    ];

    // Set Canvas zoom level according to change in distance between two fingers
    var startDistance = length(delta[0]);
    var endDistance = length(delta[1]);
    var zoomFactor = endDistance / startDistance;

    // Zoom relative to the center of the two fingers
    var center = {
      x: (position[0].x + position[1].x) / 2,
      y: (position[0].y + position[1].y) / 2,
    };

    canvas.zoom(zoomFactor * context.startZoom, center);
  }

  function start(event) {
    context = {
      start: [toPoint(event.touches[0]), toPoint(event.touches[1])],
      startZoom: canvas.zoom(),
      startViewbox: canvas.viewbox(),
    };

    domEvent.bind(document, "touchmove", handleMove);
    domEvent.bind(document, "touchend", handleEnd);
  }

  function end() {
    domEvent.unbind(document, "touchmove", handleMove);

    context = null;

    cursorUnset();
  }

  function handleEnd(event) {
    if (event.touches.length === 2) {
      start(event);
      return true;
    }

    if (event.touches.length === 0) {
      domEvent.unbind(document, "touchend", handleEnd);
    }

    end();
  }

  function handleStart(event) {
    if (event.touches.length !== 2) {
      end();
      return;
    }

    start(event);

    event.preventDefault();
    // we've handled the event
    return true;
  }

  this.isActive = function () {
    return !!context;
  };
}

TouchZoom.$inject = ["eventBus", "canvas"];

// helpers ///////

function length(point) {
  return Math.sqrt(Math.pow(point.x, 2) + Math.pow(point.y, 2));
}
