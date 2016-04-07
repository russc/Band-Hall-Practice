'use strict';
angular.module('myApp.view1', ['ngRoute']).config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/view1', {
            templateUrl: 'view1/view1.html',
            controller: 'View1Ctrl'
        });
    }
]).controller('View1Ctrl', ['$scope', '$firebase', '$location',
    function($scope, $firebase, $location) {
        //        Array sync
        var ref = new Firebase("https://bandhallpractice.firebaseio.com/");
        var sync = $firebase(ref.child('students'));
        
        

        $scope.practiceSession = sync.$asArray();
        //
        //
        $scope.signIn = function() {
            $location.path("/");
        };
        //
        $scope.updateSession = function(key, id, i, o) {
            ref.child('students/' + id + '/sessions/' + key).set({
                timeIn: i,
                timeOut: o
            });
        };
        //
        $scope.deleteSession = function(key, id) {
            ref.child('students/' + id + '/sessions/' + key).remove();
        };
        $scope.deleteStudent = function(id) {
            ref.child('students/' + id).remove();
            ref.child('checkPracticing/' + id).remove();
        };
        console.log('hello');
    }
]);