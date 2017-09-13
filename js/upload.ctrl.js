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
