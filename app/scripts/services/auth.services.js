'use strict';

angular.module('emailApp')
  .factory('Auth', function ($firebaseAuth) {
    // body...
    var ref = firebase.database().ref();
    var auth =  $firebaseAuth(firebase.auth());
    
    return auth;
  });