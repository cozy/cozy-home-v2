// Generated by CoffeeScript 1.7.0
var allSlug, americano, byApps;

americano = require('americano-cozy');

byApps = function() {
  if (doc.type === 'persistent') {
    return emit([doc.app, doc.ref], doc);
  }
};

allSlug = function() {
  return emit(doc.slug, doc);
};

module.exports = {
  user: {
    all: americano.defaultRequests.all
  },
  alarm: {
    all: americano.defaultRequests.all
  },
  cozyinstance: {
    all: americano.defaultRequests.all
  },
  notification: {
    all: americano.defaultRequests.all,
    byApps: byApps
  },
  application: {
    all: americano.defaultRequests.all,
    bySlug: allSlug
  },
  user_preference: {
    all: americano.defaultRequests.all
  }
};
