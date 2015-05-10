/*!
 * © 2014 Second Street, MIT License <http://opensource.org/licenses/MIT>
 * Talker.js 1.0.1 <http://github.com/secondstreet/talker.js>
 */
//region Constants
var TALKER_TYPE = 'application/x-talkerjs-v1+json';
var TALKER_ERR_TIMEOUT = 'timeout';
//endregion Constants

//region Third-Party Libraries
/*
 * PinkySwear.js 2.1 - Minimalistic implementation of the Promises/A+ spec
 * Modified slightly for embedding in Talker.js
 *
 * Public Domain. Use, modify and distribute it any way you like. No attribution required.
 *
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 *
 * PinkySwear is a very small implementation of the Promises/A+ specification. After compilation with the
 * Google Closure Compiler and gzipping it weighs less than 500 bytes. It is based on the implementation for
 * Minified.js and should be perfect for embedding.
 *
 * https://github.com/timjansen/PinkySwear.js
 */
var pinkySwearPromise = (function() {
  var undef;

  function isFunction(f) {
    return typeof f == 'function';
  }
  function isObject(f) {
    return typeof f == 'object';
  }
  function defer(callback) {
    if (typeof setImmediate != 'undefined')
  setImmediate(callback);
    else if (typeof process != 'undefined' && process['nextTick'])
  process['nextTick'](callback);
    else
  setTimeout(callback, 0);
  }

  return function pinkySwear() {
    var state;           // undefined/null = pending, true = fulfilled, false = rejected
    var values = [];     // an array of values as arguments for the then() handlers
    var deferred = [];   // functions to call when set() is invoked

    var set = function(newState, newValues) {
      if (state == null && newState != null) {
        state = newState;
        values = newValues;
        if (deferred.length)
          defer(function() {
            for (var i = 0; i < deferred.length; i++)
            deferred[i]();
          });
      }
      return state;
    };

    set['then'] = function (onFulfilled, onRejected) {
      var promise2 = pinkySwear();
      var callCallbacks = function() {
        try {
          var f = (state ? onFulfilled : onRejected);
          if (isFunction(f)) {
            function resolve(x) {
              var then, cbCalled = 0;
              try {
                if (x && (isObject(x) || isFunction(x)) && isFunction(then = x['then'])) {
                  if (x === promise2)
                    throw new TypeError();
                  then['call'](x,
                      function() { if (!cbCalled++) resolve.apply(undef,arguments); } ,
                      function(value){ if (!cbCalled++) promise2(false,[value]);});
                }
                else
                  promise2(true, arguments);
              }
              catch(e) {
                if (!cbCalled++)
                  promise2(false, [e]);
              }
            }
            resolve(f.apply(undef, values || []));
          }
          else
            promise2(state, values);
        }
        catch (e) {
          promise2(false, [e]);
        }
      };
      if (state != null)
        defer(callCallbacks);
      else
        deferred.push(callCallbacks);
      return promise2;
    };
    return set;
  };
})();
/**
 * Object Create
 */
var objectCreate = function(proto) {
    function ctor () { }
    ctor.prototype = proto;
    return new ctor();
};
//endregion

//region Public Methods
/**
 * Talker
 * Used to open a communication line between this window and a remote window via postMessage.
 * @param remoteWindow - The remote `window` object to post/receive messages to/from.
 * @property {Window} remoteWindow - The remote window object this Talker is communicating with
 * @property {string} remoteOrigin - The protocol, host, and port you expect the remote to be
 * @property {number} timeout - The number of milliseconds to wait before assuming no response will be received.
 * @property {boolean} handshaken - Whether we've received a handshake from the remote window
 * @property {function(Talker.Message)} onMessage - Will be called with every non-handshake, non-response message from the remote window
 * @property {Promise} handshake - Will be resolved when a handshake is newly established with the remote window.
 * @returns {Talker}
 * @constructor
 */
var Talker = function(remoteWindow, remoteOrigin) {
    this.remoteWindow = remoteWindow;
    this.remoteOrigin = remoteOrigin;
    this.timeout = 3000;

    this.handshaken = false;
    this.handshake = pinkySwearPromise();
    this._id = 0;
    this._queue = [];
    this._sent = {};

    var _this = this;
    window.addEventListener('message', function(messageEvent) { _this._receiveMessage(messageEvent) }, false);
    this._sendHandshake();

    return this;
};

/**
 * Send
 * Sends a message and returns a promise
 * @param namespace - The namespace the message is in
 * @param data - The data to send, must be a JSON.stringify-able object
 * @param [responseToId=null] - If this is a response to a previous message, its ID.
 * @public
 * @returns {Promise} - May resolve with a {@link Talker.IncomingMessage}, or rejects with an Error
 */
Talker.prototype.send = function(namespace, data, responseToId) {
    var message = new Talker.OutgoingMessage(this, namespace, data, responseToId);

    var promise = pinkySwearPromise();
    this._sent[message.id] = promise;

    this._queue.push(message);
    this._flushQueue();

    setTimeout(function() {
        promise(false, [new Error(TALKER_ERR_TIMEOUT)]); // Reject the promise
    }, this.timeout);

    return promise;
};
//endregion Public Methods

//region Private Methods
/**
 * Handles receipt of a message via postMessage
 * @param {MessageEvent} messageEvent
 * @private
 */
Talker.prototype._receiveMessage = function(messageEvent) {
    var object, isHandshake;

    try {
        object = JSON.parse(messageEvent.data);
    }
    catch (e) {
        object = {};
    }
    if (!this._isSafeMessage(messageEvent.source, messageEvent.origin, object.type)) { return false; }

    isHandshake = object.handshake || object.handshakeConfirmation;
    return isHandshake ? this._handleHandshake(object) : this._handleMessage(object);
};

/**
 * Determines whether it is safe and appropriate to parse a postMessage messageEvent
 * @param {Window} source - Source window object
 * @param {string} origin - Protocol, host, and port
 * @param {string} type - Internet Media Type
 * @returns {boolean}
 * @private
 */
Talker.prototype._isSafeMessage = function(source, origin, type) {
    var safeSource, safeOrigin, safeType;

    safeSource = source === this.remoteWindow;
    safeOrigin = (this.remoteOrigin === '*') || (origin === this.remoteOrigin);
    safeType = type === TALKER_TYPE;

    return safeSource && safeOrigin && safeType;
};

/**
 * Handle a handshake message
 * @param {Object} object - The postMessage content, parsed into an Object
 * @private
 */
Talker.prototype._handleHandshake = function(object) {
    if (object.handshake) { this._sendHandshake(this.handshaken); } // One last handshake in case the remote window (which we now know is ready) hasn't seen ours yet
    this.handshaken = true;
    this.handshake(true, [this.handshaken]);
    this._flushQueue();
};

/**
 * Handle a non-handshake message
 * @param {Object} rawObject - The postMessage content, parsed into an Object
 * @private
 */
Talker.prototype._handleMessage = function(rawObject) {
    var message = new Talker.IncomingMessage(this, rawObject.namespace, rawObject.data, rawObject.id);
    var responseId = rawObject.responseToId;
    return responseId ? this._respondToMessage(responseId, message) : this._broadcastMessage(message);
};

/**
 * Send a response message back to an awaiting promise
 * @param {number} id - Message ID of the waiting promise
 * @param {Talker.Message} message - Message that is responding to that ID
 * @private
 */
Talker.prototype._respondToMessage = function(id, message) {
    if (this._sent[id]) {
        this._sent[id](true, [message]); // Resolve the promise
        delete this._sent[id];
    }
};

/**
 * Send a non-response message to awaiting hooks/callbacks
 * @param {Talker.Message} message - Message that arrived
 * @private
 */
Talker.prototype._broadcastMessage = function(message) {
    if (this.onMessage) { this.onMessage.call(this, message); }
};

/**
 * Send a handshake message to the remote window
 * @param {boolean} [confirmation] - Is this a confirmation handshake?
 * @private
 */
Talker.prototype._sendHandshake = function(confirmation) {
    var message = { type: TALKER_TYPE };
    var handshakeType = confirmation ? 'handshakeConfirmation' : 'handshake';
    message[handshakeType] = true;
    this._postMessage(message);
};

/**
 * Increment the internal ID and return a new one.
 * @returns {number}
 * @private
 */
Talker.prototype._nextId = function() {
    return this._id += 1;
};

/**
 * Wrapper around window.postMessage to only send if we have the necessary objects
 * @param {Object} data - A JSON.stringify'able object
 * @private
 */
Talker.prototype._postMessage = function(data) {
    if (this.remoteWindow && this.remoteOrigin) {
        this.remoteWindow.postMessage(JSON.stringify(data), this.remoteOrigin);
    }
};

/**
 * Flushes the internal queue of outgoing messages, sending each one.
 * @returns {Array} - Returns the queue for recursion
 * @private
 */
Talker.prototype._flushQueue = function() {
    if (this.handshaken) {
        var message = this._queue.shift();
        if (!message) { return this._queue; }
        this._postMessage(message);
        if (this._queue.length > 0) { return this._flushQueue(); }
    }
    return this._queue;
};
//endregion Private Methods

//region Talker Message
/**
 * Talker Message
 * Used to wrap a message for Talker with some extra metadata and methods
 * @param {Talker} talker - A {@link Talker} instance that will be used to send responses
 * @param {string} namespace - A namespace to with which to categorize messages
 * @param {Object} data - A JSON.stringify-able object
 * @property {number} id
 * @property {number} responseToId
 * @property {string} namespace
 * @property {Object} data
 * @property {string} type
 * @property {Talker} talker
 * @returns {Talker.Message}
 * @constructor
 */
Talker.Message = function(talker, namespace, data) {
    this.talker = talker;
    this.namespace = namespace;
    this.data = data;
    this.type = TALKER_TYPE;

    return this;
};
//endregion Talker Message

//region Talker Outgoing Message
/**
 * Talker Outgoing Message
 * @extends Talker.Message
 * @param {Talker} talker - A {@link Talker} instance that will be used to send responses
 * @param {string} namespace - A namespace to with which to categorize messages
 * @param {Object} data - A JSON.stringify-able object
 * @param [responseToId=null] - If this is a response to a previous message, its ID.
 * @constructor
 */
Talker.OutgoingMessage = function(talker, namespace, data, responseToId) {
    Talker.Message.call(this, talker, namespace, data);
    this.responseToId = responseToId || null;
    this.id = this.talker._nextId();
};
Talker.OutgoingMessage.prototype = objectCreate(Talker.Message.prototype);
Talker.OutgoingMessage.prototype.constructor = Talker.Message;

/**
 * @returns {Object}
 * @public
 */
Talker.OutgoingMessage.prototype.toJSON = function() {
    return {
        id: this.id,
        responseToId: this.responseToId,
        namespace: this.namespace,
        data: this.data,
        type: this.type
    };
};
//endregion Talker Outgoing Message

//region Talker Incoming Message
/**
 * Talker Incoming Message
 * @extends Talker.Message
 * @param {Talker} talker - A {@link Talker} instance that will be used to send responses
 * @param {string} namespace - A namespace to with which to categorize messages
 * @param {Object} data - A JSON.stringify-able object
 * @param {number} id - The ID received from the other side
 * @constructor
 */
Talker.IncomingMessage = function(talker, namespace, data, id) {
    Talker.Message.call(this, talker, namespace, data);
    this.id = id;
};
Talker.IncomingMessage.prototype = objectCreate(Talker.Message.prototype);
Talker.IncomingMessage.prototype.constructor = Talker.Message;

/**
 * Respond
 * Responds to a message
 * @param {Object} data - A JSON.stringify-able object
 * @public
 * @returns {Promise} - Resolves with a {@link Talker.IncomingMessage}, or rejects with an Error
 */
Talker.IncomingMessage.prototype.respond = function(data) {
    return this.talker.send(null, data, this.id);
};
//endregion Talker Incoming Message
