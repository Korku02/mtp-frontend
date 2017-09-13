app.controller('RegisterCtrl', function($scope, $document, $location, $http, $window,$rootScope,$mdToast) {


$rootScope.classes = [
          "1st",
          "2nd",
          "3rd",
          "4th",
          "5th",
          "6th",
          "7th",
          "8th",
          "9th",
          "10th",
          "11th",
          "12th"
];

$scope.isRegister = false;

$scope.isStd = true;
$scope.isTeacher = false;
$scope.flex = "100";

$scope.chechRole = function(a){
  if(a == "std"){

    $scope.flex = "50";
    return true;
  }
  else if (a == "Teacher") {

    $scope.flex = "100";
    return false;
  }
}


$scope.signUp=function (user) {
  console.log("working signUp function");
  console.log(user.role);

    if(user.password == user.confirm_password){
      console.log(user);
      $scope.isRegister = true;

    $http({
      url:URL_PREFIX+"register/",
      method:"POST",
      headers:{
        'Content-Type': 'application/json; charset=UTF-8'
      },
      data:{
        'email':user.email,
        'user_name':user.name,
        'user_role':user.role,
        'password':user.password,
        'confirm_password':user.confirm_password,
        'division':user.class
      }
    }).then(function sucessCallback(response) {
      console.log(response);
      if (response.status===200){
        console.log(response);
        $location.path("/login");
        $scope.isRegister = false;

        $mdToast.show(
          $mdToast.simple()
          .textContent("Please Check your email to verify your email address")
          .position('bottom right')
          .hideDelay(3000)
        );

      }
    }, function errorCallback(error) {
      console.log(error);
      $scope.isRegister = false;
        $mdToast.show(
          $mdToast.simple()
          .textContent(error.data.error)
          .position('bottom right')
          .hideDelay(3000)
        );

    });
  }

  else{
    $mdToast.show(
      $mdToast.simple()
      .textContent('Please Confirm password')
      .position('bottom right')
      .hideDelay(3000)
    );
  }
  };




});
