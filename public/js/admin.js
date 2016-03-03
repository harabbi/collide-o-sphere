angular.module('CollideOSphereAdmin', ['ngRoute','720kb.datepicker'])

.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
    when('/requests', {
      templateUrl: '/partials/requests.html',
      controller: 'requestsCtrl'
    }).
    when('/users', {
      templateUrl: '/partials/users.html',
      controller: 'userCtrl'
    }).
    when('/faq', {
      templateUrl: '/partials/faq.html',
      controller: 'faqCtrl'
    }).
    otherwise({
      redirectTo: 'requests'
    });
  }
])

.controller('loginCtrl', function($rootScope, $scope, $http) {
  $scope.showLogin = false;
  $http.post('/users/login').success(function(data) {
    $rootScope.current_user = data;
  });

  $scope.logIn = function() {
    $('#login-button').button('loading');
    $http.post('/users/login', $scope.user).success(function(data) {
      alert('Welcome ' + data.first_name);
      $rootScope.current_user = data;
      $scope.showLogin = false;
      $('#login-button').button('reset');
    }).error(function(){
      alert('That email and password combination was invalid...');
      $('#login-button').button('loading');
    })
  }

  $scope.logOut = function() {
    $http.post('/users/logout').success(function(){
      $rootScope.current_user = null;
    })
  }
})

.controller('requestsCtrl', function($scope, $http) {
  $http.get('/requests').success(function(data){
    $scope.requests = data;
  });

})

.controller('faqCtrl', function($scope, $http) {
  $scope.faq = {};

  $http.get('/faqs').success(function(data){
    $scope.faqs = data;
  });

  $scope.submitQuestion = function() {
    $http.post('/faqs', $scope.faq).success(function(data){
      $('form#faq')[0].reset();
      alert('Your question has been sent in for review.\n Check back to see the answer.');
      $scope.faqs.push(data);
    }).error(function(data){
      alert(data);
    });
  }

  $scope.removeQuestion = function(q_id) {
    if (confirm('Are you SURE?!?!')) {
      $http.delete('/faqs/' + q_id).success(function(){
        $('#faq_' + q_id).hide();
      }).error(function(data){
        alert(data);
      });
    }
  }

  $scope.answerQuestion = function(q) {
    $http.patch('/faqs/' + q.id, q).success(function(){
      alert('Saved...');
    }).error(function(data){
      alert(data);
    });
  }

  $scope.upVote = function(q) {
    q.score += 1;
    $http.patch('/faqs/' + q.id, {score: q.score}).error(function(data){
      alert(data);
    });
  }

  $scope.downVote = function(q) {
    q.score -= 1;
    $http.patch('/faqs/' + q.id, {score: q.score}).error(function(data){
      alert(data);
    });
  }

  $scope.showQuestion = function(q) {
    q.approved = true;
    $http.patch('/faqs/' + q.id, {approved: true}).error(function(data){
      alert(data);
    });
  }

  $scope.hideQuestion = function(q) {
    q.approved = false;
    $http.patch('/faqs/' + q.id, {approved: false}).success(function() {
    }).error(function(data){
      alert(data);
    });
  }
})

.controller('userCtrl', function($scope, $http) {
  $http.get('/users').success(function(data){
    $scope.users = data;
  });

  $scope.confirmEmail = function(user) {
    user.valid_email = true;
    $http.patch('/users/' + user.id, {valid_email: true}).error(function(data){
      alert(data);
    });
  }

  $scope.deleteUser = function(user) {
    $http.delete('/users/' + user.id).success(function() {
      $('tr#user_' + user.id).hide();
    }).error(function(data){
      alert(data);
    });
  }
});