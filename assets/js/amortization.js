/*global window: true*/
(function () {
    "use strict";

	window.amortization = (function () {

        var numPayments = function (mortgage_term, payments_per_year) {
                
                return (mortgage_term * payments_per_year);
            },
            getEffectiveRate = function (nominal_rate, annual_compounding_periods) {

                return (Math.pow((1 + (nominal_rate / annual_compounding_periods)), annual_compounding_periods) - 1);
            },
            periodicRate = function (effective_rate, payments_per_year) {
                
                return (effective_rate / payments_per_year);
            },
            isCMHCRequired = function (purchase_price, down_payment) {
                
                return ((down_payment / purchase_price) < 0.2);
            },
            CMHCAmount = function (purchase_price, down_payment) {
                
                var down_payment_percentage = (down_payment / purchase_price),
                    cmhc_percentage = 0;

                switch (true) {

                    case (down_payment_percentage > 0.1999):
                        cmhc_percentage = 0;
                        break;

                    case (down_payment_percentage < 0.2 && down_payment_percentage > 0.1499):
                        cmhc_percentage = 0.0175;
                        break;

                    case (down_payment_percentage < 0.15 && down_payment_percentage > 0.0999):
                        cmhc_percentage = 0.02;
                        break;

                    case (down_payment_percentage < 0.10):
                        cmhc_percentage = 0.0275;
                        break;
                }

                return (purchase_price - down_payment ) * cmhc_percentage;
            };

        return {
            paymentAmount: function (principal, periodic_rate, num_payments) {

                return principal * (periodic_rate / (1 - Math.pow((1 + periodic_rate), (-1 * num_payments))));
            },
            getAmmortization: function (purchase_price, down_payment, nominal_rate, mortgage_term, payments_per_year, annual_compounding_periods) {

                var cmhc_required = isCMHCRequired(purchase_price, down_payment),
                    cmhc_amount = CMHCAmount(purchase_price, down_payment);
                var principal = purchase_price - down_payment + cmhc_amount;
                    
                var mortgage_total = principal + cmhc_amount,
                    num_payments = numPayments(mortgage_term, payments_per_year),
                    effective_rate = getEffectiveRate((nominal_rate/100), annual_compounding_periods),
                    periodic_rate = periodicRate(effective_rate, payments_per_year);

                var payment = this.paymentAmount(mortgage_total, periodic_rate, num_payments),
                    payments = [],
                    principal_payments = [],
                    interest_payments = [],
                    remaining_balance = mortgage_total,
                    average_monthly_cost,
                    i;

                for (i = 1; i <= num_payments; i += 1) {
                    var interest_payment = (periodic_rate * remaining_balance),
                        principal_payment = (payment - interest_payment);

                    remaining_balance -= principal_payment;

                    if (i % 20 == 0) {
                        payments.push(payment);
                        principal_payments.push(principal_payment);
                        interest_payments.push(interest_payment);
                    };

                    // put total_cost_of_ammortization and total_cost_of_interest here
                }

                var ammortization = {
                    effective_rate: effective_rate,
                    payments: payments,
                    principal_payments: principal_payments,
                    interest_payments: interest_payments,
                    total_cost_of_ammortization: Math.round((num_payments * payment) + cmhc_amount),
                    total_cost_of_interest: Math.round((num_payments * payment) - principal),
                    principal: principal,
                    cmhc_required: cmhc_required,
                    cmhc_amount: cmhc_amount,
                    average_monthly_mortgage_cost: Math.round(((num_payments * payment) + cmhc_amount) / (mortgage_term * 12))
                };

                return ammortization;
            }
        };
	}());
}());
