define([
  '../tools',
  './display_object'
], function(tools, DisplayObject) {
  'use strict';

  /**
   * Constructs an AssetDisplayObject instance
   * (Should not be instantiated directly, should be inherited)
   *
   * @name AssetDisplayObject
   * @constructor
   * @private
   */
  function AssetDisplayObject(loader, source, callback) {

    if (loader) {
      this._loader = loader;
    }

    DisplayObject.call(this);

    if (callback) {
      this.bindAssetCallback(callback);
    }
    
  }

  /** @lends AssetDisplayObject.prototype */
  var proto = AssetDisplayObject.prototype = Object.create(DisplayObject.prototype);

  /**
   * Registers events for a callback function which'll be triggered for both
   * `error` and `load` events (i.e. node-style callback, `function(err, data) {}`)
   *
   * @param {Function} callback The function to be triggered upon `load` or `error`
   *
   * @returns {this}
   */
  proto.bindAssetCallback = function(callback) {

    // We need to unbind both events after either one is fired:
    var unbind = tools.hitch(this, function() {
      this.removeListener('load', loadHandler);
      this.removeListener('error', errorHandler);
    });

    function loadHandler() {
      unbind();
      callback.call(this, null, this);
    }
    function errorHandler(error) {
      unbind();
      callback.call(this, error, this);
    }

    this.on('load', loadHandler);
    this.on('error', errorHandler);
    return this;
  };

  return AssetDisplayObject;
});
