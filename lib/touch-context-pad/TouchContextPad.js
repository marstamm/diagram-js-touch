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

const log = [];

let pleaseDontClose = false;

export default function TouchContextPad(contextPad, eventBus) {
  const originalClose = contextPad.close;

  // We need to keep the originating target DOM element in the tree
  // We only hide the context pad and remove it after we are done touching
  contextPad.close = () => {
    if (pleaseDontClose) {
      // Set container to display=none
      contextPad._container.style.display = "none";
      return;
    }

    contextPad._container.style.display = "";

    originalClose.call(contextPad);
  };

  let context = {};

  function handleMove(event) {
    const newPos = toPoint(event.touches[0]);
    // Only trigger create when the touch has moved more than 10px

    const delta = deltaPos(context.start, newPos);
    const distance = length(delta);
    if (distance < 10) {
      return;
    }

    pleaseDontClose = true;
    contextPad.trigger("dragstart", event);
    document.removeEventListener("touchmove", handleMove);
  }

  function handleEnd() {
    document.removeEventListener("touchmove", handleMove);
    document.removeEventListener("touchend", handleEnd, true);

    if (pleaseDontClose) {
      pleaseDontClose = false;
      contextPad.close();
    }
  }

  function handleStart(event) {
    if (!contextPad._container.contains(event.target)) {
      return;
    }

    context = {
      start: toPoint(event.touches[0]),
    };

    document.addEventListener("touchmove", handleMove);
    // Need to listen in capture phase, otherwise we might close the context pad
    // after a new one was opened
    document.addEventListener("touchend", handleEnd, true);
  }

  document.addEventListener("touchstart", handleStart);
}

TouchContextPad.$inject = ["contextPad", "eventBus"];

function length(point, point2) {
  return Math.sqrt(Math.pow(point.x, 2) + Math.pow(point.y, 2));
}
