
import { getOriginal as getOriginalEvent } from 'diagram-js/lib/util/Event';



export default function TouchMove(eventBus, move) {
  eventBus.on('element.touchstart', function(event) {
    var originalEvent = getOriginalEvent(event);

    if (!originalEvent) {
      throw new Error('must supply DOM touchstart event');
    }

    return move.start(originalEvent, event.element);
  });
}


TouchMove.$inject = [ 'eventBus', 'move' ];