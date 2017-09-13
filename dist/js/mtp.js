app.controller('MainCtrl', function($scope, $document,$timeout, $log, Auth,$location,$mdToast,$rootScope,$http,$window,$mdDialog) {



$scope.isLogin = false;


  $rootScope.isPath= function(viewLocation) {
      return viewLocation === $location.path();
    };
    $rootScope.userDetails = Auth.getuserDetails();

    console.log($rootScope.userDetails);

    // console.log($scope.userDetails);

    // if($window.localStorage.userDetails){
      if(($rootScope.isPath('/login')===true || $rootScope.isPath('/')===true || ($rootScope.isPath('/register')===true)) && $rootScope.userDetails !=undefined){
        $location.path("/home");

      }
    // }


      if($rootScope.isPath('/home')===true && $rootScope.userDetails ==undefined){
          $location.path("/");
      }





    $scope.logInUser=function (user) {
      $scope.isLogin = true;
    if (user===undefined) {
      $mdToast.show(
        $mdToast.simple()
        .textContent('Please check your input field')
        .position('bottom right')
        .hideDelay(3000)
      );
    }
    Auth.login(user).then(function(response) {
      console.log(response);

        $location.path("/home");


      // $window.location.reload();
      $mdToast.show(
        $mdToast.simple()
        .textContent('User sucessfully logged in!')
        .position('bottom right')
        .hideDelay(3000)
      );


    }, function (error) {
      console.log(error);

      $scope.isLogin = false;
        $mdToast.show(
          $mdToast.simple()
          .textContent(error.data.error)
          .position('bottom right')
          .hideDelay(5000)
        );


  });
};

$scope.fileLoad = function(){

  $http({
      method: "GET",
      url: URL_PREFIX+"api/files/",
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer '+ Auth.getuserDetails().accessToken
          }
  }).then(function (response) {
      $scope.Files = response.data;
      console.log($scope.Files.file0);

  });
}


$scope.filterFiles = function(data){
  if(data=='all'){
    $http({
        method: "GET",
        url: URL_PREFIX+"api/files/",
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          'Authorization': 'Bearer '+ Auth.getuserDetails().accessToken
            }
    }).then(function (response) {
        $scope.Files = response.data;
        console.log($scope.Files.file0);

    });
  }
  else{
    $http({
      url:URL_PREFIX+"api/files/",
      method:"POST",
      headers:{
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer '+ Auth.getuserDetails().accessToken
      },
      data:{
        'division':data,

      }
    }).then(function sucessCallback(response) {
      console.log(response);
      $scope.Files = response.data;
      console.log($scope.Files.file0);

    }, function errorCallback(error) {
      console.log(error);

        $mdToast.show(
          $mdToast.simple()
          .textContent(error.data.message)
          .position('bottom right')
          .hideDelay(3000)
        );

    });

  }

}




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



$rootScope.showAdvanced = function(ev) {
    $mdDialog.show({
      controller: DialogController,
      templateUrl: '../templates/uploadDialog.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
    })
    .then(function(answer) {
      $scope.status = 'You said the information was "' + answer + '".';



    }, function() {
      $scope.status = 'You cancelled the dialog.';
    });
  };


  function DialogController($scope, $mdDialog) {

    $scope.hide = function() {
      $mdDialog.hide();
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $scope.answer = function(answer) {
      $mdDialog.hide(answer);
    };
  }

  $rootScope.logOut = function () {
    console.log("hello");
    console.log("user logged out");
    // $window.location.reload();
  Auth.logout().then(function (result) {
      $location.path("/");

      localStorage.clear();


      $mdToast.show(
        $mdToast.simple()
        .textContent('User logout sucessfully!')
        .position('bottom right')
        .hideDelay(3000)
      );
      $window.location.reload();
  }, function (error) {
    if (error.status=401) {
      console.log("Unauthorized");
      $window.localStorage.userDetails= null;
      $window.location.reload();
    }
  });
  };


});

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

app.controller('uploadCtrl', function($scope, $document, $location, $http, $window,$rootScope,$mdToast,fileUpload) {

console.log("uploadCtrl");

$scope.uploadFile = function(up){
  console.log(up);
    var file = $scope.partneruploadedFile;
    $scope.iscreatePartner = true;
    // console.log(up);
    // console.log(file);
    // console.log(Auth.getuserDetails());
    $scope.uploadingTrue=true;
    if($scope.partneruploadedFile==null){
      $mdToast.show(
        $mdToast.simple()
          .textContent('Please attach file first')
          .hideDelay(5000)
          .position('right bottom')
        );
    }
    else{
      var uploadUrl = URL_PREFIX + 'api/resources/';
      var data=up;
      fileUpload.uploadFileToUrl(file, uploadUrl, data).then(function successCallback(response){
        if(response.status ==200){
          $location.path("/home");
          // $scope.iscreatePartner = false;
        }
        else{
          $mdToast.show(
            $mdToast.simple()
              .textContent('Error Occured')
              .hideDelay(5000)
              .position('right bottom')
            );
        }
        console.log(response);
      });
      // console.log(data);
      // console.log(file);
    }
  };


  $scope.classes = [
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

});
