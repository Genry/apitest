app = angular.module('apitest', ['ngSanitize']);

app.config(function($interpolateProvider, $httpProvider) {
  $interpolateProvider.startSymbol('{<{');
  $interpolateProvider.endSymbol('}>}');
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
  $httpProvider.defaults.transformRequest = [
    function(data) {
      var param;
      param = function(obj) {
        var fullSubName, innerObj, name, query, subName, subValue, value;
        query = '';
        for (name in obj) {
          name = name;
          value = obj[name];
          if (value instanceof Array) {
            innerObj = {};
            innerObj[name] = value.join(',');
            query += param(innerObj) + '&';
          } else if (value instanceof Object) {
            for (subName in value) {
              subName = subName;
              subValue = value[subName];
              fullSubName = name + '.' + subName;
              innerObj = {};
              innerObj[fullSubName] = subValue;
              query += param(innerObj) + '&';
            }
          } else if (value !== void 0 && value !== null) {
            query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
          }
        }
        if (query.length) {
          return query.substr(0, query.length - 1);
        } else {
          return query;
        }
      };
      if (angular.isObject(data) && String(data) !== '[object File]') {
        return param(data);
      } else {
        return data;
      }
    }
  ];
});

app.controller('MainCtrl', MainCtrl);

function MainCtrl($scope, $http, $sendRequestUrl){
  $scope.params = [];
  $scope.headers = [];
  $scope.form = {
    method: 'GET',
    url: ''
  };
  $scope.addHeader = function(){
    $scope.headers.push({
      name: '',
      value: ''
    })
  };
  $scope.addParam = function(){
    $scope.params.push({
      name: '',
      value: ''
    })
  };

  function getData(){
    var _temp='', data = angular.copy($scope.form);
    for(var i=0; i<$scope.params.length; i++){
      _temp += ($scope.params[i].name + '.' + $scope.params[i].value)
      if(i!=$scope.params.length-1){
        _temp += ','
      }
    }
    data.params = _temp;
    _temp='';
    for(var i=0; i<$scope.headers.length; i++){
      _temp += ($scope.headers[i].name + '.' + $scope.headers[i].value)
      if(i!=$scope.headers.length-1){
        _temp += ','
      }
    }
    data.headers = _temp;
    return data
  }

  $scope.sendRequest = function(){
    return $http({
      method: 'POST',
      url: $sendRequestUrl,
      data: getData()
    }).success(function (response) {
      $('#response').html(response.text)
      $scope.response = response;
    })
  }
}
