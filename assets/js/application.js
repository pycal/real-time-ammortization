var ammortizeApp = angular.module('ammortizeApp', ['chart.js']);

ammortizeApp.controller('AmortizationController', ['$scope', function ($scope) {

    // Ammortization values
    $scope.purchase_price = 150000;
    $scope.down_payment = 30000;
    $scope.principal = 120000;
    $scope.nominal_rate = 4.0;
    $scope.effective_rate = 4.0;
    $scope.annual_compounding_periods = 2;
    $scope.payments_per_year = 12;
    $scope.cmhc_required = false;
    $scope.mortgage_term = 25;
    $scope.total_cost_of_ammortization;
    $scope.total_cost_of_interest;
    $scope.data = [[],[],[]];

    // Monthly costs
    $scope.condo_fees = 0;
    $scope.property_tax = 0;

    // Chart
    $scope.series = ['Total', 'Principal', 'Interest'];

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
            $scope.purchase_price,
            $scope.down_payment,
            $scope.nominal_rate,
            $scope.mortgage_term,
            $scope.payments_per_year,
            $scope.annual_compounding_periods
        );

        var effective_rate_p = (ammortization.effective_rate * 100).toFixedDown(2);
        $scope.effective_rate = effective_rate_p;
        $scope.total_cost_of_ammortization = ammortization.total_cost_of_ammortization;
        $scope.total_cost_of_interest = ammortization.total_cost_of_interest;
        $scope.principal = ammortization.principal;
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
