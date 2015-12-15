angular.module('CollideOSphere', ['ngRoute','GoogleMap', '720kb.datepicker'])
.config(['$routeProvider',
  function($routeProvider) { $routeProvider.
    when('/home', {
      templateUrl: 'partials/home.html',
    }).
    when('/book', {
      templateUrl: 'partials/book.html',
      controller: 'bookCtrl'
    }).
    when('/rental-requests', {
      templateUrl: 'partials/requests.html',
      controller: 'requestsCtrl'
    }).
    when('/faq', {
      templateUrl: 'partials/faq.html',
      controller: 'faqCtrl'
    }).
    when('/locations', {
      templateUrl: 'partials/locations.html',
      controller: 'mapCtrl'
    }).
    when('/users', {
      templateUrl: 'partials/users.html',
      controller: 'userCtrl'
    }).
    otherwise({
      redirectTo: '/home'
    });
  }
])

.directive('formAutofillFix', function() {
  return function(scope, elem, attrs) {
    // Fixes Chrome bug: https://groups.google.com/forum/#!topic/angular/6NlucSskQjY
    elem.prop('method', 'POST');

    // Fix autofill issues where Angular doesn't know about autofilled inputs
    if(attrs.ngSubmit) {
      setTimeout(function() {
        elem.unbind('submit').submit(function(e) {
          e.preventDefault();
          elem.find('input, textarea, select').trigger('input').trigger('change').trigger('keydown');
          scope.$apply(attrs.ngSubmit);
        });
      }, 0);
    }
  };
})

.controller('appCtrl', function($scope, $http, $location) {
  $scope.showLogin = false;

  $http.post('/users/login').success(function(data) {
    $scope.current_user = data;
  });

  $scope.isActive = function(viewLocation) {
    return viewLocation === $location.path();
  };

  $scope.logIn = function() {
    $('#login-button').button('loading');
    $http.post('/users/login', $scope.user).success(function(data) {
      alert('Welcome ' + data.first_name);
      $scope.current_user = data;
      $scope.showLogin = false;
      $('#login-button').button('reset');
    }).error(function(){
      alert('That email and password combination was invalid...');
    })
  }

  $scope.logOut = function() {
    $http.post('/users/logout').success(function(){
      $scope.current_user = null;
    })
  }
})

.controller('bookCtrl', function($scope, $http) {
  $http.get('/places?pending=false').success(function(data){
    $scope.places = data;
  });

  $scope.submitRequest = function() {
    $http.post('/requests', {rental: $scope.form}).success(function() {
      alert('You request has been submitted. Look for an email from us soon!');
    }).error(function(data) {
      alert(data);
    });
  }
})

.controller('requestsCtrl', function($scope, $http) {
  $http.get('/requests').success(function(data){
    $scope.requests = data;
  });
})

.controller('mapCtrl', function($scope, $http, $timeout, GoogleMap) {
  $http.get('/places').success(function(data){
    $scope.places = data;
    GoogleMap.load($scope.places);
    $scope.focusPac = function() {
      $timeout(function(){
        $('#pac-input').focus();
      })
    }
  });

  $scope.removePlace = function(place) {
    $http.delete('/places/' + place.id).success(function(){
      $('#' + place.place_id).hide();
    }).error(function(data){
      alert(data);
    });
  }

  $scope.confirmPlace = function(place) {
    place.pending = false;
    $http.patch('/places/' + place.id, {place: {pending: false}}).error(function(data){
      alert(data);
    });
  }
})

.controller('faqCtrl', function($scope, $http) {
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
    $http.patch('/faqs/' + q.id, q).error(function(data){
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
});

$(function(){ $('nav li a').click(function(){
    this.blur();
  })
});