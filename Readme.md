## @marstamm/diagram-js-touch

This diagram-js extension aims to provide touch support for [diagram-js](https://github.com/bpmn-io/diagram-js) based applications, such as the widely popular [bpmn-js](https://github.com/bpmn-io/bpmn-js).

### Usage

Install it via npm:

```bash
npm i @marstamm/diagram-js-touch
```

And include it in you application:

```javascript
import Modeler from "bpm-js/lib/Modeler";
import touchModule from "@marstamm/diagram-js-touch";

var modeler = new Modeler({
  container: "#canvas",
  additionalModules: [touchModule],
});
```
