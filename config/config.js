var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'jsplayground'
    },
    port: 3000,
    db: 'mongodb://localhost/jsplayground-development'
    
  },

  test: {
    root: rootPath,
    app: {
      name: 'jsplayground'
    },
    port: 3000,
    db: 'mongodb://localhost/jsplayground-test'
    
  },

  production: {
    root: rootPath,
    app: {
      name: 'jsplayground'
    },
    port: 3000,
    db: 'mongodb://localhost/jsplayground-production'
    
  }
};

module.exports = config[env];
