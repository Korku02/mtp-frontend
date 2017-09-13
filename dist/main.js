var app = angular.module('boxer', ['ngMaterial','ngAnimate','ngRoute']);
var URL_PREFIX = 'http://localhost:8080/';
var CLIENT_ID = 'tHgq6fv6NgVYwYZyyIalM9DSGBTypJSEawjF2LxL';
var CLIENT_SECRET = 'kjofIA2WVnLS0Yo036TdYBu45hL6IMPaFn37Cet3HLJVxskv2F3JlStswSW1lNeW4UDcAUv2bWtRSAiuDX2yFnAHjdBUstdOA9vQJfxOWWblq6YlArtG05bEJfKSBjyE';


app.config(["$routeProvider", "$locationProvider", function($routeProvider, $locationProvider) {
  $routeProvider.when("/", {
    controller: "MainCtrl",
    templateUrl: "templates/login.html"
  }).when("/home", {
    controller: "MainCtrl",
    templateUrl: "templates/home.html",

  }).when("/login", {
    controller: "MainCtrl",
    templateUrl: "templates/login.html",

  }).when("/register", {
    controller: "RegisterCtrl",
    templateUrl: "templates/register.html",

  }).otherwise({
    controller: "MainCtrl",
    templateUrl: "templates/error.html"
  });
}]);

app.directive('fileModel', ['$parse', function ($parse) {
    return {
    restrict: 'A',
    link: function(scope, element, attrs) {
        var model = $parse(attrs.fileModel);
        var modelSetter = model.assign;

        element.bind('change', function(){
            scope.$apply(function(){
                modelSetter(scope, element[0].files[0]);
            });
        });
    }
   };
}]);
app.service('fileUpload', ['$http','$mdDialog','$q','$mdToast','$rootScope','Auth','$location', function ($http,$q,$mdDialog,$mdToast,$rootScope,Auth,$scope,$location) {
    this.uploadFileToUrl = function(file, uploadUrl, data){
        // $scope.iscreateCampaign = true;
         var fd = new FormData();

         fd.append('file_upload', file);
         fd.append('size', file.size);
         fd.append('type', file.type);
         fd.append('file_name', data.partner);
         fd.append('division', data.division);

        var $createCampaign =  $http.post(uploadUrl, fd, {
             transformRequest: angular.identity,
             headers: {
               'Content-Type': undefined,
               'Authorization':"Bearer "+Auth.getuserDetails().accessToken
             }
         });
         $createCampaign.then(function successCallback(response) {
           $mdToast.show(
             $mdToast.simple()
               .textContent("Campaign Created Succesfully")
               .hideDelay(5000)
               .position('right bottom')
             );



            //  console.log(response.data);
           $rootScope.isLoading=true;
         }, function errorCallback(error) {
           console.log(error);
           $mdToast.show(
             $mdToast.simple()
               .textContent(error)
               .hideDelay(5000)
               .position('right bottom')
             );

         });
         return $createCampaign;
     };



 }]);




//
//
//
app.run(["$rootScope", "$location", function ($rootScope, $location) {
    $rootScope.$on("$routeChangeSuccess", function (userDetails) {
        // console.log(userDetails);
    });
    $rootScope.$on("$routeChangeError", function (event, current, previous, eventObj) {
        if (eventObj.authenticated === false) {
            $location.path("/");
        }
    });
}]);
app.factory("Auth", ["$http","$q","$window",function ($http, $q, $window) {
    var userDetails;
    function login(user) {
        var url=URL_PREFIX+'login/';
        var deferred = $q.defer();
        $http({
             method: "POST",
             transformRequest: function(obj) {
                var str = [];
                for(var p in obj)
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
             },
             data: {
                'email':user.email,
                'password':user.password,
                'client_id':CLIENT_ID,
                'client_secret':CLIENT_SECRET,
                'grant_type':'client_credentials'

             },
             headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
             url: url,
           }).then(function successCallback(response) {
             isLoading = false;
             console.log(response);
             userDetails = {
                 accessToken: response.data.access_token,
                 role:response.data.role,
                 name:response.data.user_name,
                 email: response.data.email,
                 roleType:response.data.role_type

             };
             $window.localStorage.userDetails = JSON.stringify(userDetails);
             deferred.resolve(userDetails);
           }, function errorCallback(error) {
             deferred.reject(error);
         });
         return deferred.promise;
    };

    function logout() {
        var deferred = $q.defer();
        $http({
            method: "POST",
            url: URL_PREFIX+"logout/",
            headers: {
              'Content-Type': 'application/json; charset=UTF-8',
              'Authorization':'Token '+userDetails.access_token
            }
        }).then(function (result) {
            // console.log(result);
            userDetails = null;
            $window.localStorage.userDetails = null;
            deferred.resolve(result);
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    function getuserDetails() {
        return userDetails;
    }
    function init() {
        if ($window.localStorage.userDetails) {
            userDetails = JSON.parse($window.localStorage.userDetails);
        }
    }
    init();
    return {
        login: login,
        logout: logout,
        getuserDetails: getuserDetails
    };
}]);
