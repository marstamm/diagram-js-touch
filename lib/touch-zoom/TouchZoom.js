import {
  set as cursorSet,
  unset as cursorUnset
} from 'diagram-js/lib/util/Cursor';

import {
  delta as deltaPos
} from 'diagram-js/lib/util/PositionUtil';

import {
  event as domEvent,
  closest as domClosest
} from 'min-dom';

import {
  toPoint
} from 'diagram-js/lib/util/Event';

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
export default function TouchZoom(eventBus, canvas) {

  var context;

  function handleTouch(event) {
    console.log('handleTouch', event);
    return handleStart(event.originalEvent);
  }

  eventBus.on('element.touchstart', 500, handleTouch);


  function handleMove(event) {
  
    console.log('handleMove', event, event.targetTouches, context);


    var start = context.start,
        position = [toPoint(event.targetTouches[0]), toPoint(event.targetTouches[1])];

    const delta = [deltaPos(start[0], start[1]), deltaPos(position[0], position[1])];

    // Set Canvas zoom level according to change in distance between two fingers
    var startDistance = length(delta[0]);
    var endDistance = length(delta[1]);
    var zoomFactor = endDistance / startDistance;

    console.log(startDistance, endDistance, zoomFactor, context);

    canvas.zoom(zoomFactor * context.startZoom);
        
    // if (!context.dragging && length(delta) > THRESHOLD) {
    //   context.dragging = true;

    //   if (button === 0) {
    //     installClickTrap(eventBus);
    //   }

    //   cursorSet('grab');
    // }

    // if (context.dragging) {

    //   var lastPosition = context.last || context.start;

    //   delta = deltaPos(position, lastPosition);

    //   canvas.scroll({
    //     dx: delta.x,
    //     dy: delta.y
    //   });

    //   context.last = position;
    // }

  }



  function start(event) {
    context = {
      start: [toPoint(event.touches[0]), toPoint(event.touches[1])],
      startZoom: canvas.zoom(),
      startViewbox: canvas.viewbox()
    };

    domEvent.bind(document, 'touchmove', handleMove);
    domEvent.bind(document, 'touchend', handleEnd);
  }

  function end() {
    domEvent.unbind(document, 'touchmove', handleMove);

    context = null;

    cursorUnset();
  }


  function handleEnd(event) {
    if(event.touches.length === 2) {
      start(event);
      return true;
    }

    if(event.touches.length === 0) {
      domEvent.unbind(document, 'touchend', handleEnd);
    }

    end();
  }


  function handleStart(event) {
    if(event.touches.length !== 2) {
      end();
      return;
    }

    console.log([toPoint(event.touches[0]), toPoint(event.touches[1])]);


    start(event);

    event.preventDefault();
    // we've handled the event
    return true;
  }

  this.isActive = function() {
    return !!context;
  };

}


TouchZoom.$inject = [
  'eventBus',
  'canvas'
];



// helpers ///////

function length(point, point2) {
  return Math.sqrt(Math.pow(point.x, 2) + Math.pow(point.y, 2));
}
