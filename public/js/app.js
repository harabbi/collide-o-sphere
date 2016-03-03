angular.module('CollideOSphere', ['720kb.datepicker'])

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

.controller('navCtrl', function($scope) {
  $scope.root = $('html, body');
  $scope.active = 'home';

  $scope.isActive = function(target) {
    return ($scope.active == target);
  }

  $scope.scrollTo = function(link, target){
    $scope.active = target;
    $(link).blur();

    $scope.root.animate(
      {scrollTop: $('#' + target).offset().top - 65},
      500
    );
  };

})

.controller('bookCtrl', function($scope, $http) {
  $scope.bookRequest = {};

//  $http.get('/places?pending=false').success(function(data){
//    $scope.places = data;
//  });

  $scope.submitBooking = function() {
    $http.post('/requests', $scope.bookRequest).success(function(data) {
      $('#requestForm')[0].reset();
      alert(data);
    }).error(function(data) {
      alert(data);
    });
  }
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
});
