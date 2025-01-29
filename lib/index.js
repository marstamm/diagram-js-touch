import interactionEvents from "./interaction-events";
import rotateCanvas from "./rotate-canvas";
import touchCanvasMove from "./touch-canvas-move";
import touchContextPad from "./touch-context-pad";
import touchHoverFix from "./touch-hover-fix";
import touchMove from "./touch-move";
import touchPalette from "./touch-palette";
import touchZoom from "./touch-zoom";

export default {
  __depends__: [
    interactionEvents,
    // rotateCanvas,
    touchMove,
    touchHoverFix,
    touchPalette,
    touchCanvasMove,
    touchContextPad,
    touchZoom,
  ],
};
