'use strict';
angular.module('myApp.view2', ['ngRoute']).config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'view2/view2.html',
            controller: 'View2Ctrl'
        });
    }
]).controller('View2Ctrl', ['$scope', '$firebase', '$location',
    function($scope, $firebase, $location) {
        var ref = new Firebase("https://bandhallpractice.firebaseio.com");
        ref.child("students").on("value", function(data) {
            data.forEach(function(item) {
                ref.child("leaderBoard").child(item.key()).set({
                    "total": item.child("sessions").numChildren(),
                    "first": item.val().firstName,
                    "last": item.val().lastName
                });
            });
        });
        var practicing = $firebase(ref.child('practicing'));
        $scope.students = practicing.$asArray();
        
        var leaderBoard = $firebase(ref.child('leaderBoard'));
        $scope.leaderBoard = leaderBoard.$asArray();
        //         $scope.calculateStats = function() {
        //             $scope.leaderBoard = [];
        //             ref.child("students").once("value", function(snapshot) {
        //                 snapshot.forEach(function(childSnapshot) {
        //                     //                     if(childSnapshot.val().firstName != 'Test' ) {
        //                     //                         $scope.leaderBoard.push({
        //                     //                             id: childSnapshot.key(),
        //                     //                             total: childSnapshot.child("sessions").numChildren(),
        //                     //                             first: childSnapshot.val().firstName,
        //                     //                             last: childSnapshot.val().lastName
        //                     //                         });
        //                     //                     }
        //                     $scope.leaderBoard.push({
        //                         id: childSnapshot.key(),
        //                         total: childSnapshot.child("sessions").numChildren(),
        //                         first: childSnapshot.val().firstName,
        //                         last: childSnapshot.val().lastName
        //                     });
        //                 });
        //             });
        //         };
        //         $scope.calculateStats();
        $scope.registerMode = false;
        $scope.studentSignIn = function(stu) {
            if(stu == "closeAll") {
                angular.forEach($scope.students, function(item) {
                    $('#signedInAlert').modal('hide');
                    $scope.processSignOut(item, item.id, item.timeIn, item.name);
                });
                $scope.studentId = '';
                //                 $scope.calculateStats();
            } else if(stu == "directorLog") {
                $location.path('/view1');
                $scope.studentId = '';
            } else {
                var refStudents = new Firebase("https://bandhallpractice.firebaseio.com/students");
                refStudents.child(stu).once("value", function(snapshot) {
                    if(snapshot.val() === null) {
                        $scope.registerMode = true;
                        $scope.$apply();
                        //                         console.log('first time ' + $scope.registerMode);
                    } else {
                        $scope.registerMode = false;
                        var first = snapshot.val().firstName;
                        var last = snapshot.val().lastName;
                        $scope.processSignIn(stu, first + " " + last);
                        $scope.studentId = '';
                    }
                });
            }
        };
        $scope.cancelRegister = function() {
            $scope.studentId = '';
            $scope.registerMode = false;
        };
        var studentRef = new Firebase("https://bandhallpractice.firebaseio.com/students");
        $scope.registerStudent = function() {
            studentRef.child($scope.studentId).set({
                firstName: $scope.firstName,
                lastName: $scope.lastName,
                studentId: $scope.studentId
            });
            $scope.processSignIn($scope.studentId, $scope.firstName + " " + $scope.lastName);
            $scope.registerMode = false;
            $scope.studentId = '';
            $scope.firstName = '';
            $scope.lastName = '';
        };
        var whatever = new Firebase("https://bandhallpractice.firebaseio.com/checkPracticing");
        $scope.message = '';
        var funnyMess = ["You so cray cray, tryin' to sign in twice!", "Pay attention!", "Did you know that the word 'gullible' isn't in the dictionary?", "Didn't you notice that you already signed in?", "Forgetful much?", "Ew! Like, sign in only once", "Go practice already! You signed in a long time ago", "Meh!", "Rule Number 1 .... figure it out!", "ICYMI"];
        var funnyAvatar = ["1.png", "2.png", "3.png", "4.png", "5.png", "6.jpeg", "7.jpeg", "8.jpeg", "9.jpeg", "10.jpeg", "11.jpeg"];
        $scope.processSignIn = function(studentId, name) {
            var date = new Date();
            var now = moment(date).format("MMM Do, h:mm a");
            //             var thisDate = moment(date);
            whatever.child(studentId).once("value", function(data) {
                if(data.val()) {
                    console.log('already signed in');
                    var rand = funnyMess[Math.floor(Math.random() * funnyMess.length)];
                    $scope.message = rand;
                    $scope.$apply();
                } else {
                    var rand2 = funnyAvatar[Math.floor(Math.random() * funnyAvatar.length)];
                    $scope.students.$add({
                        timeIn: now,
                        name: name,
                        id: studentId,
                        avatar: "view2/" + rand2
                    });
                    $scope.message = "";
                    $scope.$apply();
                    whatever.child(studentId).set(true);
                    $scope.thisUser = name;
                    $scope.thisTime = now;
                    $scope.state = "signed in";
                    //                     $('#signedInAlert').modal('show');
                    //auto logs out as long as the page hasn't been refreshed.
                    //                     setTimeout(function(studentId) {
                    //                         ref.child('practicing').orderByChild("id").startAt(studentId).once("child_added", function(snapshot) {
                    //                             var then = moment(date).add(3, 'm').format("MMM Do, h:mm a");
                    //                             console.log(snapshot.key() + ", " + snapshot.val().timeIn + " - " + then);
                    //                             var thisKey = snapshot.key();
                    //                             var id = snapshot.val().id;
                    //                             var time = snapshot.val().timeIn;
                    //                             whatever.child(id).remove();
                    //                             ref.child('practicing/' + thisKey).remove();
                    //                             studentRef.child(id + "/sessions").push({
                    //                                 timeIn: time,
                    //                                 timeOut: then
                    //                             });
                    //                         });
                    //                     }, 10000);
                }
            });
        };
        $scope.processSignOut = function(stud, id, time, stamp, name) {
            var date = new Date();
            var now = moment(date).format("MMM Do, h:mm a");
            //             var diff = moment(date).diff(time, "seconds");
            //             console.log(diff);
            whatever.child(id).remove();
            $scope.students.$remove(stud);
            studentRef.child(id + "/sessions").push({
                timeIn: time,
                timeOut: now
            });
            //             $scope.calculateStats();
            $scope.thisUser = name;
            $scope.thisTime = now;
            $scope.state = "signed out";
            //             $('#signedInAlert').modal('show');
        }
        //         $scope.studentSignIn(123456);
        //       
    }
]);