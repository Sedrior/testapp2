var scotchApp = angular.module('scotchApp', ['ngRoute','ngCookies']);

// configure our routes
scotchApp.config(function($routeProvider) {
    $routeProvider
        .when('/',{
            templateUrl:'Login.html',
            controller:'LoginController'
        })

        .when('/newBooking', {
            templateUrl : 'NewBooking.html',
            controller  : 'BookingController'
        })


        .when('/myProfile', {
            templateUrl : 'MyProfile.html',
            controller  : 'ProfileController'
        })


        .when('/myBookings', {
            templateUrl : 'MyBookings.html',
            controller  : 'MyBookingsController'
        })
        .when('/editProfile',{
            templateUrl : 'EditProfile.html',
            controller : 'EditController'
        })
        .when('/driversMap',{
            templateUrl : 'DriversMap.html',
            controller : 'DriversMap'
    });
});

// create the controller and inject Angular's $scope
scotchApp.controller('BookingController',
    function($timeout, $scope, $window, $filter, $http, $cookieStore, $interval)
    {
        var initMap = function ()
        {
            directionsDisplay = new google.maps.DirectionsRenderer();
            directionsService = new google.maps.DirectionsService();
            console.dir(document.getElementById('map'));
            map = new google.maps.Map(document.getElementById('map'), {
                center: {lat: 45.86667, lng: 24.78333},
                zoom: 6
            });
            directionsDisplay.setMap(map);
        };

        var name=$scope.fullName;
        var email=$scope.email;
        var phoneNumber=$scope.phoneNumber;
        var voucherCode=$scope.voucherCode;
        $scope.temp = {
            showPlace: false,
            pickUp: {
                addressName: '',
                lat: '',
                lng: ''
            },
            dropOff : {
                addressName: '',
                lat: '',
                lng: ''
            },
            pickUpSearch:{},
            dropOffSearch:{}
        };

        $scope.distance={
            carType:'',
            distance :'',
            price:''
        };
        $scope.data=[];
        $scope.numberOfSeats=[];
        $scope.cars={};
        $scope.paymentMethod=[];
        $scope.booking_charge = {};
        $scope.paymentsMethod = 'cash';
        $scope.idTypeCars=[];

        $scope.searchLocation = function()
        {
            var request={
                input: $scope.temp.pickUp.addressName,
                componentRestrictions:{country:'ro'}
            };
            var service = new google.maps.places.AutocompleteService();
            service.getPlacePredictions(request,function(predictions,status){
                if (status != google.maps.places.PlacesServiceStatus.OK) {
                    return;
                }
                else
                {
                    console.dir(predictions);
                    $scope.temp.pickUpSearch = predictions;

                }

            });
        };


        $scope.searchLocation2 = function()
        {
            var request={
                input: $scope.temp.dropOff.addressName,
                componentRestrictions:{country:'ro'}
            };
            var service = new google.maps.places.AutocompleteService();
            service.getPlacePredictions(request,function(predictions,status){
                if (status != google.maps.places.PlacesServiceStatus.OK) {
                    return;
                }
                else {
                    console.dir(predictions);
                    $scope.temp.dropOffSearch = predictions;
                }
            });
        };



        $scope.setLocation = function (obj, type)
        {
            if (type !== 'p') {

                console.dir(obj);
            }
            else {

                var geocoder = new google.maps.Geocoder;
                console.dir(obj);
                geocoder.geocode({'placeId': obj.place_id}, function (results, status) {
                    if (status === google.maps.GeocoderStatus.OK) {
                        console.dir(status);
                        console.dir(results);
                        map.setCenter(results[0].geometry.location);
                        $scope.temp.pickUp.addressName=results[0].formatted_address;
                        $scope.temp.pickUp.lat = results[0].geometry.location.lat();
                        $scope.temp.pickUp.lng = results[0].geometry.location.lng();

                    }
                    else
                    {
                        console.dir(status);
                        console.dir(results);

                    }
                    console.dir($scope.temp);
                });

            }
        };


        $scope.setLocation2 = function (obj, type)
        {
            if (type !== 'd')
            {
                console.dir(obj);
            }
            else
            {

                var geocoder = new google.maps.Geocoder;
                console.dir(obj);
                geocoder.geocode({'placeId': obj.place_id}, function (results, status) {
                    if (status === google.maps.GeocoderStatus.OK) {
                        console.dir(status);
                        console.dir(results);
                        map.setCenter(results[0].geometry.location);
                        $scope.temp.dropOff.addressName=results[0].formatted_address;
                        $scope.temp.dropOff.lat = results[0].geometry.location.lat();
                        $scope.temp.dropOff.lng = results[0].geometry.location.lng();
                        var request = {
                            origin: $scope.temp.pickUp.addressName,
                            destination: $scope.temp.dropOff.addressName,
                            travelMode: google.maps.DirectionsTravelMode.DRIVING
                        };

                        directionsService.route(request, function (result, status) {
                            if (status === google.maps.DirectionsStatus.OK) {
                                $scope.distance.distance=result.routes[0].legs[0].distance.value/1000;
                                directionsDisplay.setDirections(result);
                                console.dir($scope.distance);
                            }
                        });

                    }
                    else
                    {
                        console.dir(status);
                        console.dir(results);

                    }
                    console.dir($scope.temp);
                });



            }
        };
        $scope.getDirections= function()
        {
            var request = {
                origin: $scope.temp.pickUp.addressName,
                destination: $scope.temp.dropOff.addressName,
                travelMode: google.maps.DirectionsTravelMode.DRIVING
            };
            directionsService.route(request, function (result, status)
            {
                if (status === google.maps.DirectionsStatus.OK) {
                    $scope.distance.distance=result.routes[0].legs[0].distance.value/1000;
                    directionsDisplay.setDirections(result);
                    console.dir($scope.distance);
                }
            });

        };
        $scope.getCarPrice=function(){
            var i;
            $http.defaults.headers.common['Authorization']='Basic c3VwcG9ydEBpbnNvZnRkLmNvbTppbnMwZnRERVZAfEAyNDg=';
            $http.get('https://api-test.insoftd.com/v1/operator/car_type').then(
                function(obj){
                    for(i=0;i<obj.data.records.length;i++) {
                        $scope.data[i]=obj.data.records[i];
                        $scope.cars[i]={
                            type: $scope.data[i].type,
                            id_type:$scope.data[i].id_type,
                            seats:$scope.data[i].seats_number
                        }
                    }

                }
                ,function()
                {
                    console.dir('error');
                });


            var car=$filter('filter')($scope.car);
            var passengersNumber=$filter('filter')($scope.passengersNumber);
            $scope.car=car;
            $scope.passengersNumber=passengersNumber;
            $scope.newcars={};
            var j=0;
            for(i=0;i<$scope.data.length;i++){
                if(Number(passengersNumber)<=Number($scope.cars[i].seats)){
                    $scope.newcars[j]={
                        type:$scope.cars[i].type,
                        id_type:$scope.cars[i].id_type,
                        seats:$scope.cars[i].seats
                    };

                    j+=1;

                }
            }
            if(car) {
                var data = {
                    "priceList": [{
                        "RouteInfo": {
                            "legs": [2522],
                            "duration": 377,
                            "distance": $scope.distance.distance,
                            "points_list": [{
                                "type": "p",
                                "address": $scope.temp.pickUp.addressName,
                                "lat": $scope.temp.pickUp.lat,
                                "lng": $scope.temp.pickUp.lng
                            }, {
                                "type": "d",
                                "address": $scope.temp.dropOff.addressName,
                                "lat": $scope.temp.dropOff.lat,
                                "lng": $scope.temp.dropOff.lng
                            }]
                        },
                        "Booking": {
                            "id_car_type": $scope.car,
                            "infant_seats_number": 0,
                            "child_seats_number": 0,
                            "booster_seats_number": 0,
                            "id_client": null,
                            "pickup_time": "2017-09-23 14:04:24",
                            "passengers_number": $scope.passengersNumber,
                            "payment_method": $scope.paymentsMethod,
                            "waiting_time": 0,
                            "voucher_code": $scope.voucherCode ? $scope.voucherCode : null
                        }

                    }]
                };

                $http.defaults.headers.common['Authorization'] = 'Basic cG9wb3ZpY2kudHVkb3JAeWFob28uY29tOmFzZGFzZGFzZEB8QDI0OA==';
                var url = 'https://api-test.insoftd.com/v1/operator/price';
                var voucherItem='';
                $http.post(url, data).then(
                    function (obj) {
                        console.dir(obj);
                        if (obj && obj.data && obj.data.records && obj.data.records) {
                            $scope.distance.price = obj.data.records.total_price;
                            $scope.booking_charge = obj.data.records[0].BookingCharge;
                            if($scope.voucherCode){
                                $scope.distance.price=$scope.distance.price - 5;
                                obj.data.records.total_price=$scope.distance.price;
                            }
                        }


                    }
                    , function () {
                        console.dir("error");
                    }
                );
            }
        };
        $scope.sendData= function() {
            var data = {
                "BookingList": [{
                    "Booking": {
                        "id_car_type": $scope.car,
                        "id_client": "1",
                        "order_number": "",
                        "id_driver_to_car": null,
                        "passenger_name": $scope.fullName,
                        "passenger_email": $scope.email,
                        "passenger_mobile": $scope.phoneNumber,
                        "payment_method": $scope.paymentsMethod,
                        "status": "Unallocated",
                        "source": "backoffice",
                        "infant_seats_number": 0,
                        "child_seats_number": 0,
                        "booster_seats_number": 0,
                        "passengers_number":$scope.passengersNumber ,
                        "pickup_address": $scope.temp.pickUp.addressName,
                        "dropoff_address": $scope.temp.dropOff.addressName,
                        "pickup_time": "2017-09-14 15:14:00",
                        "pickup_lat": $scope.temp.pickUp.lat,
                        "pickup_lng": $scope.temp.pickUp.lng,
                        "dropoff_lat": $scope.temp.dropOff.lat,
                        "dropoff_lng": $scope.temp.dropOff.lng,
                        "duration": 1459,
                        "journey_distance": $scope.distance.distance,
                        "waiting_time": 0,
                        "journey_type": "asap",
                        "booking_type": 1,
                        "cancel_reason": null,
                        "id_pickup_zone": "791",
                        "id_dropoff_zone": "791",
                        "pickup_details": "",
                        "dropoff_details": ""
                    },
                    "BookingCharge": $scope.booking_charge,
                    "Payment": {
                        "payment_status": "Pending"
                    }
                }]
            };
            var url='https://api-test.insoftd.com/v1/operator/booking';
            var Key=$cookieStore.get('key');
            $http.defaults.headers.common['Authorization'] = 'Basic '+ Key;
            $http.post(url, data).then(
                function(data){
                    alert("Booking was inserted Successfully");
                    console.dir(data);
                    location.reload();
                }
                , function ()
                {
                    alert("The booking could not be saved");
                    console.dir('error');
                });
        };



        $scope.getConfigList=function(){
            $http.defaults.headers.common['Authorization'] = 'Basic cG9wb3ZpY2kudHVkb3JAeWFob28uY29tOmFzZGFzZGFzZEB8QDI0OA==';
            var url='https://api-test.insoftd.com/v1/operator/config';
            $http.get(url).then(
                function(obj) {
                    var i=0;
                    Object.keys(obj.data.records.paymentMethods).forEach(function(entry)
                    {
                        $scope.paymentMethod[i]=
                            {
                                name: obj.data.records.paymentMethods[entry].name
                                , value: entry
                            };
                        i+=1;
                    });
                }
                ,function(){
                    console.dir('error');
                }
            );
            var paymentsMethod = $filter('filter')($scope.paymentsMethod);
        };

        var getCarPriceRefresh=$interval(function(){
            $scope.getCarPrice();
        }, 1000)

        $timeout(function(){
            $scope.getConfigList();
        }, 50)

        $timeout(function ()
        {
            initMap();
        }, 50)
        // google.maps.event.addDomListener(window,"load",initMap);
    });

scotchApp.controller('ProfileController',
    function($scope,$http, $cookieStore) {
    var i=$cookieStore.get('userdetails');
    $scope.userDetails=JSON.parse(i);
});

scotchApp.controller('MyBookingsController',
    function($scope, $http, $cookieStore) {
        $scope.Bookings=[];
        $scope.getBookings= function() {
            var Key = $cookieStore.get('key');
            $http.defaults.headers.common['Authorization'] = 'Basic ' + Key;
            var url = 'https://api-test.insoftd.com/v1/operator/booking?q=[{"key":"Booking.id_client","op":"=", "value":"1"}]&limit=10';
            $http.get(url).then(
                function (obj) {

                    $scope.Bookings = obj.data.records;

                },
                function () {
                    console.dir('error');
                }
            );

        };


});

scotchApp.controller('NavBarController',
    function($scope,$location){
    $scope.isActive = function(viewLocation) {
        return viewLocation === $location.path();
    };

});
scotchApp.controller('LoginController',
    function($scope,$http,$cookieStore) {
    $scope.sendCredentials = function()
    {
        var e_mail=$scope.email;
        var pass=$scope.password;
        var data = e_mail + ':' + pass + '@|@' + '248';

        var dataencode = btoa(data);

        $http.defaults.headers.common['Authorization'] = 'Basic ' + dataencode;
        var url='https://api-test.insoftd.com/v1/operator/login';

        $http.post(url,{
            email: $scope.email
            , password: $scope.password
            , api_key: '248'
        }).then(
            function(obj){
                alert("User logged successfully")
                console.dir(obj.data.records);
                $cookieStore.put('key', dataencode);
                var stringObj=JSON.stringify(obj.data.records.user_details);
                $cookieStore.put('userdetails',stringObj);
                window.location = '/#/newBooking'
            },
            function(){
                alert("Bad credentials try again");
                console.dir('error');
            }
        );

    };


});

scotchApp.controller('EditController',
    function($scope,$http,$cookieStore){
    var changeFirstName = $scope.changeFirstName;
    var changeLastName = $scope.changeLastName;
    var changeMobileNumber = $scope.changeMobileNumber;
    var changeStreet = $scope.changeStreet;
    var changePostCode = $scope.changePostCode;
    var changeCity = $scope.changeCity;
    var changeEmail = $scope.changeEmail;
    var changeAlternativeMobile = $scope.changeAlternativeMobile;
    var i=$cookieStore.get('userdetails');
    $scope.userDetails=JSON.parse(i);

    $scope.changeDetails = function(){

        if($scope.changeFirstName){
            $scope.userDetails.firstname=$scope.changeFirstName;
        }
        else
            if($scope.changeLastName){
            $scope.userDetails.lastname=$scope.changeLastName;
            }
            else
                if($scope.changeMobileNumber){
                $scope.userDetails.mobile_number=$scope.changeMobileNumber;
                }
                else
                    if($scope.changeStreet){
                    $scope.userDetails.street=$scope.changeStreet;
                    }
                    else
                        if($scope.changePostCode){
                        $scope.userDetails.postcode=$scope.changePostCode;
                        }
                        else
                            if($scope.changeCity){
                            $scope.userDetails.city=$scope.changeCity;
                            }
                            else
                                if($scope.changeEmail){
                                $scope.userDetails.email=$scope.changeEmail;
                                }
                                else
                                    if($scope.changeAlternativeMobile){
                                    $scope.userDetails.alternativemobile=$scope.changeAlternativeMobile;
                                    }
        console.dir($scope.userDetails);
        var stringObj=JSON.stringify($scope.userDetails);
        $cookieStore.put('userdetails',stringObj);
        var url='https://api-test.insoftd.com/v1/operator/login';
        var Key=$cookieStore.get('key');
        $http.defaults.headers.common['Authorization'] = 'Basic '+ Key;
        $http.post(url,{
            email: "popovici.tudor@yahoo.com"
            , password: "asdasdasd"
            , api_key: '248'
        }).then(
            function(obj) {
                obj.data.records.user_details=$scope.userDetails;
                console.dir(obj.data.records);

            },
            function(){
                console.dir('error')
            });

        window.location = '/#/myProfile';

    }

    });

scotchApp.controller('DriversMap',
    function($scope,$http,$timeout,$cookieStore){
        var initMap = function ()
        {
            directionsDisplay = new google.maps.DirectionsRenderer();
            directionsService = new google.maps.DirectionsService();
            console.dir(document.getElementById('mapEngland'));
            map = new google.maps.Map(document.getElementById('mapEngland'), {
                center: {lat: 52.3781, lng: -2.4360},
                zoom: 7
            });
            directionsDisplay.setMap(map);
        };

        $scope.getDrivers = function(){
            var url='https://api-test.insoftd.com/v1/operator/driver_to_car/monitoring_list?fields=(Driver.tag;Driver.first_name;Driver.last_name;Car.id_car;Car.model;Car.reg_number;CarType.rank;CarType.type;Driver.id;Driver.picture;DriverToCar.available_from;DriverToCar.id_driver_to_car;DriverToCar.updated_at;DriverToCar.lat;DriverToCar.id_plot_zone;DriverToCar.lng;DriverToCar.speed;DriverToCar.accuracy)&order=(DriverToCar.order_number%20ASC)';
            var Key=$cookieStore.get('key');
            $http.defaults.headers.common['Authorization'] = 'Basic '+ Key;
            $http.get(url).then(
                function(obj)
                {
                    console.dir(obj);
                },
            function()
            {
                    console.dir("eroor");
            }
            );
        };

        $timeout(function ()
        {
            initMap();
        }, 50)

        $scope.getDrivers();
    });