

import interactionEvents from './interaction-events';
import rotateCanvas from './rotate-canvas';
import touchCanvasMove from './touch-canvas-move';
import touchMove from './touch-move';
import touchZoom from './touch-zoom';

export default {
    __depends__: [ 
        interactionEvents,
        rotateCanvas, 
        touchMove,
        touchCanvasMove,
        touchZoom
    ]
};