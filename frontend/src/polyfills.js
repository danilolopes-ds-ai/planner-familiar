// Polyfills para compatibilidade com Node.js modules no navegador
if (typeof global === 'undefined') {
  window.global = window;
}

if (typeof process === 'undefined') {
  window.process = {
    env: {},
    browser: true,
    nextTick: (fn) => setTimeout(fn, 0)
  };
}

// Polyfill para PropTypes
if (typeof PropTypes === 'undefined') {
  window.PropTypes = {
    any: () => {},
    array: () => {},
    bool: () => {},
    func: () => {},
    number: () => {},
    object: () => {},
    string: () => {},
    symbol: () => {},
    node: () => {},
    element: () => {},
    elementType: () => {},
    instanceOf: () => () => {},
    oneOf: () => () => {},
    oneOfType: () => () => {},
    arrayOf: () => () => {},
    objectOf: () => () => {},
    shape: () => () => {},
    exact: () => () => {}
  };
}

// Polyfills para módulos Node.js comuns
const nodeModules = {
  'util': {
    format: () => '',
    deprecate: (fn) => fn,
    inherits: () => {},
    isArray: Array.isArray,
    isFunction: (obj) => typeof obj === 'function',
    isObject: (obj) => obj !== null && typeof obj === 'object'
  },
  'path': {
    join: (...paths) => paths.join('/'),
    resolve: (...paths) => paths.join('/'),
    dirname: (path) => path.split('/').slice(0, -1).join('/'),
    basename: (path) => path.split('/').pop()
  },
  'events': {
    EventEmitter: class EventEmitter {
      constructor() { this.events = {}; }
      on(event, listener) { 
        if (!this.events[event]) this.events[event] = [];
        this.events[event].push(listener);
      }
      emit(event, ...args) {
        if (this.events[event]) {
          this.events[event].forEach(listener => listener(...args));
        }
      }
    }
  },
  'prop-types': window.PropTypes
};

// Polyfill para require (CommonJS)
if (typeof require === 'undefined') {
  window.require = function(module) {
    if (nodeModules[module]) {
      return nodeModules[module];
    }
    console.warn(`Module "${module}" não está disponível no navegador`);
    return {};
  };
}

// Polyfill para Buffer se necessário
if (typeof Buffer === 'undefined') {
  window.Buffer = {
    from: () => ({}),
    isBuffer: () => false,
    alloc: () => ({}),
    allocUnsafe: () => ({})
  };
}

export {};
