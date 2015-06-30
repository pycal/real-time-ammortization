

var ammortizeApp = angular.module('ammortizeApp', ['ngRoute', 'chart.js']).config(function($locationProvider, $routeProvider){
    
    $routeProvider
        .when('/', {
            controller: 'AmortizationController',
            template: 'index.html'
        })
        .otherwise({redirectTo:'/'});
    $locationProvider.html5Mode(true);
});

ammortizeApp.controller('AmortizationController', ['$scope', '$location', function ($scope, $location) {
    
    $scope.ppy_options = [
        {
          name: 'Monthly',
          value: '12'
        }, 
        {
          name: 'Bi-monthly',
          value: '26'
        },
        {
          name: 'Weekly',
          value: '52'
        }
    ];

    $scope.cp_options = [
        {
          name: 'Fixed rate',
          value: '2'
        }, 
        {
          name: 'Variable rate',
          value: '12'
        }
    ];
    
    var query_params = $location.search();
    
    // Ammortization values
    $scope.ammortization_params = {
        'purchase_price': 150000,
        'down_payment': 30000,
        'payments_per_year': $scope.ppy_options[0].value,
        'principal': 120000,
        'nominal_rate': 4.0,
        'annual_compounding_periods': $scope.cp_options[0].value,
        'effective_rate': 4.0,
        'mortgage_term': 25,
    };
    
    for (var param in query_params) {
        if ($scope.ammortization_params.hasOwnProperty(param)) $scope.ammortization_params[param] = Number(query_params[param]).toFixed(2);
    };

    ap = $scope.ammortization_params;
    $scope.cmhc_required = false;
    $scope.total_cost_of_ammortization;
    $scope.total_cost_of_interest;
    $scope.data = [[],[],[]];
    $scope.easy_url = "http://localhost:3000"


    // Monthly costs
    $scope.condo_fees = 0;
    $scope.property_tax = 0;

    // Chart
    $scope.series = ['Total', 'Principal', 'Interest'];

    var make_easy_url = function() {
        var easy_url = 'http://localhost:3000/?';
        for (var param in $scope.ammortization_params) {
            easy_url = easy_url + param + '=' + Number($scope.ammortization_params[param]) + '&';
        }
        return easy_url;
    };

    $scope.onClick = function (points, evt) {
      console.log(points, evt);
    };
    
    $scope.onHover = function (points) {
      if (points.length > 0) {
        console.log('Point', points[0].value);
      } else {
        console.log('No point');
      }
    };

    $scope.updateSchedule = function () {

        var ammortization = amortization.getAmmortization(
            $scope.ammortization_params['purchase_price'],
            $scope.ammortization_params['down_payment'],
            $scope.ammortization_params['nominal_rate'],
            $scope.ammortization_params['mortgage_term'],
            $scope.ammortization_params['payments_per_year'],
            $scope.ammortization_params['annual_compounding_periods']
        );

        var effective_rate_p = (ammortization.effective_rate * 100).toFixedDown(2);
        $scope.effective_rate = effective_rate_p;
        $scope.total_cost_of_ammortization = ammortization.total_cost_of_ammortization;
        $scope.total_cost_of_interest = ammortization.total_cost_of_interest;
        $scope.ammortization_params['principal'] = ammortization.principal;
        $scope.cmhc_required = ammortization.cmhc_required;
        $scope.cmhc_amount = ammortization.cmhc_amount
        $scope.average_monthly_mortgage_cost = ammortization.average_monthly_mortgage_cost;
        $scope.total_monthly_cost = $scope.condo_fees + $scope.property_tax + ammortization.average_monthly_mortgage_cost;

        $scope.data = [
          ammortization.payments,
          ammortization.principal_payments,
          ammortization.interest_payments,
        ];
        
        var N = ammortization.payments.length; 
        $scope.labels = range(1, N, 20);
        $scope.easy_url = make_easy_url();
    };

    $scope.updateMonthlyCosts = function () {
        $scope.total_monthly_cost = $scope.condo_fees + $scope.property_tax + $scope.average_monthly_mortgage_cost;
    }
    
    Number.prototype.toFixedDown = function(digits) {
        var re = new RegExp("(\\d+\\.\\d{" + digits + "})(\\d)"),
            m = this.toString().match(re);
        return m ? parseFloat(m[1]) : this.valueOf();
    };

    var range = function(start, count, step) {
        if(arguments.length == 1) {
            count = start;
            start = 0;
        }

        var list = [0];
        for (var i = 0; i < count; i++) {
            list.push((start + i) * step);
        }
        return list;
    };
    $scope.updateSchedule();
}]);
