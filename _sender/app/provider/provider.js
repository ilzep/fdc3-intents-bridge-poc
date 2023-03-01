import {interopOverride} from './interop_override.js';

function init() {
  fin.Platform.init({ interopOverride });
}

init();