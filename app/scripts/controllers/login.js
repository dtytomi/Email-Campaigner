'use strict';
/**
 * @ngdoc function
 * @name emailApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Manages authentication to any active providers.
 */
angular.module('emailApp')
  .controller('LoginCtrl', function ($scope, Auth, $location, $q, Ref, $timeout) {
    $scope.oauthLogin = function(provider) {
      $scope.err = null;
      Auth.$signInWithPopup(provider, {rememberMe: true})
        .then(redirect)
        .catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log('User did not sign up correctly');
          console.log(errorCode);
          console.log(errorMessage);
        });
    };

    $scope.anonymousLogin = function() {
      $scope.err = null;
      Auth.$signInAnonymously().then(redirect, showError);
    };

    $scope.passwordLogin = function(email, pass) {
      $scope.err = null;
      Auth.$signInWithEmailAndPassword(email, pass, {rememberMe: true})
        .then(redirect)
        .catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log('User did not sign up correctly');
          console.log(errorCode);
          console.log(errorMessage);
          showError(errorMessage);
        });
    };

    $scope.createAccount = function(email, pass, confirm) {
      $scope.err = null;
      if( !pass ) {
        $scope.err = 'Please enter a password';
      }
      else if( pass !== confirm ) {
        $scope.err = 'Passwords do not match';
      }
      else {
        Auth.$createUserWithEmailAndPassword(email, pass)
          .then(function () {
            // authenticate so we have permission to write to Firebase
            return Auth.$signInWithEmailAndPassword(email, pass, {rememberMe: true});
          })
          .then(createProfile).then(redirect)
          .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log('User did not sign up correctly');
            console.log(errorCode);
            console.log(errorMessage);
            showError(errorMessage);
          });
      }

      function createProfile(user) {
        var ref = Ref.child('users/' + user.uid), def = $q.defer();
        ref.set({email: email, name: firstPartOfEmail(email)}, function(err) {
          $timeout(function() {
            if( err ) {
              def.reject(err);
            }
            else {
              def.resolve(ref);
            }
          });
        });
        return def.promise;
      }
    };

    function firstPartOfEmail(email) {
      return ucfirst(email.substr(0, email.indexOf('@'))||'');
    }

    function ucfirst (str) {
      // inspired by: http://kevin.vanzonneveld.net
      str += '';
      var f = str.charAt(0).toUpperCase();
      return f + str.substr(1);
    }

  

    function redirect() {
      $location.path('/account');
    }

    function showError(err) {
      $scope.err = err;
    }


  });
