angular.module('CollideOSphere', ['ngRoute','720kb.datepicker'])

.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) { $routeProvider.
    when('/', {
      templateUrl: 'partials/home.html',
      controller: 'appCtrl'
    }).
    when('/requests', {
      templateUrl: 'partials/requests.html',
      controller: 'requestsCtrl'
    }).
    when('/users', {
      templateUrl: 'partials/users.html',
      controller: 'userCtrl'
    }).
    otherwise({
      redirectTo: '/'
    });
//    $locationProvider.html5Mode(true);
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
  $scope.root = $('html, body');

  $http.post('/users/login').success(function(data) {
    $scope.current_user = data;
  });

  $scope.isActive = function(viewLocation) {
    return viewLocation === $location.path();
  };


  $scope.scrollTo = function(link, href){
    $(link).blur();
    console.log(href);

    $scope.root.animate(
      {scrollTop: $(href).offset().top - 50},
      500,
      function (){ window.location.hash = href; }
    );
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
      $('#login-button').button('loading');
    })
  }

  $scope.logOut = function() {
    $http.post('/users/logout').success(function(){
      $scope.current_user = null;
    })
  }
})

.controller('bookCtrl', function($scope, $http) {
  $scope.bookRequest = {};

  $http.get('/places?pending=false').success(function(data){
    $scope.places = data;
  });

  $scope.submitBooking = function() {
    $http.post('/requests', $scope.bookRequest).success(function(data) {
      $('#requestForm')[0].reset();
      alert(data);
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
