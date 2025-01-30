import {
  set as cursorSet,
  unset as cursorUnset,
} from "diagram-js/lib/util/Cursor";

import { install as installClickTrap } from "diagram-js/lib/util/ClickTrap";

import { delta as deltaPos } from "diagram-js/lib/util/PositionUtil";

import { event as domEvent, closest as domClosest } from "min-dom";

import { toPoint } from "diagram-js/lib/util/Event";

/**
 * @typedef {import('diagram-js/lib/core/Canvas').default} Canvas
 * @typedef {import('diagram-js/lib/core/EventBus').default} EventBus
 */

var THRESHOLD = 15;

/**
 * Move the canvas via mouse.
 *
 * @param {EventBus} eventBus
 * @param {Canvas} canvas
 */
export default function TocuhMoveCanvas(eventBus, canvas) {
  var context;

  function handleTouch(event) {
    return handleStart(event.originalEvent);
  }

  // This prevents browser navigation on Canvas elements
  canvas.getContainer().style.touchAction = "none";

  eventBus.on("element.touchstart", 500, handleTouch);

  function handleMove(event) {
    var start = context.start,
      button = context.button,
      position = toPoint(event),
      delta = deltaPos(position, start);

    if (!context.dragging && length(delta) > THRESHOLD) {
      context.dragging = true;

      if (button === 0) {
        installClickTrap(eventBus);
      }

      cursorSet("grab");
    }

    if (context.dragging) {
      var lastPosition = context.last || context.start;

      delta = deltaPos(position, lastPosition);

      canvas.scroll({
        dx: delta.x,
        dy: delta.y,
      });

      context.last = position;
    }
  }

  function start(event) {
    context = {
      start: toPoint(event),
      identifier: event.touches[0].identifier,
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
    if (event.touches.length === 1) {
      start(event);
      return true;
    }

    if (event.touches.length === 0) {
      domEvent.unbind(document, "touchend", handleEnd);
    }

    end();
  }

  function handleStart(event) {
    // event is already handled by '.djs-draggable'
    if (domClosest(event.target, ".djs-draggable")) {
      return;
    }

    if (event.touches.length > 1) {
      end();

      // Do not return anything, let Zoom handle the event
      return;
    }

    context = {
      start: toPoint(event),
      identifier: event.touches[0].identifier,
    };

    start(event);
    // we've handled the event
    return true;
  }

  this.isActive = function () {
    return !!context;
  };
}

TocuhMoveCanvas.$inject = ["eventBus", "canvas"];

// helpers ///////

function length(point) {
  return Math.sqrt(Math.pow(point.x, 2) + Math.pow(point.y, 2));
}
