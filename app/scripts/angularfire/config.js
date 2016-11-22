angular.module('firebase.config', [])
  .constant('FBURL', 'https://email-37597.firebaseio.com')
  .constant('SIMPLE_LOGIN_PROVIDERS', ['password','facebook','google','twitter'])

  .constant('loginRedirectPath', '/login');
