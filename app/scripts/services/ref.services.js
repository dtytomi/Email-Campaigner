'use strict';

angular.module('emailApp')
  .factory('Ref', function () {
    // body...
    var ref = firebase.database().ref();
    return ref;
  })