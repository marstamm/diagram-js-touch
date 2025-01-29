export default function RotateCanvas(canvas) {
  this._canvas = canvas;

  this._canvas.rotate = (rotation, center) => {
    // rotate the canvas
    const node = canvas._viewport;
    let matrix = node.getCTM();

    if (rotation) {
      canvas._changeViewbox(function () {
        center = center || {
          x: node.clientWidth / 2,
          y: node.clientHeight / 2,
        };

        matrix = canvas._svg
          .createSVGMatrix()
          .translate(center.x, center.y)
          .rotate(rotation)
          .translate(-center.x, -center.y)
          .multiply(matrix);

        setCTM(node, matrix);
      });
    }

    // get current rotation from matrix

    const a = matrix.a;
    const b = matrix.b;
    const rotationAngle = Math.atan2(b, a) * (180 / Math.PI);

    console.log(rotationAngle);
    return rotationAngle;
  };
}

RotateCanvas.$inject = ["canvas"];

function setCTM(node, m) {
  const mstr =
    "matrix(" +
    m.a +
    "," +
    m.b +
    "," +
    m.c +
    "," +
    m.d +
    "," +
    m.e +
    "," +
    m.f +
    ")";
  node.setAttribute("transform", mstr);
}
