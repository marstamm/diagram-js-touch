

import interactionEvents from './interaction-events';
import touchCanvasMove from './touch-canvas-move';
import touchMove from './touch-move';

export default {
    __depends__: [ 
        interactionEvents, 
        touchMove,
        touchCanvasMove
    ]
};