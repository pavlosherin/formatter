"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumberFormatter = void 0;
var NumberFormatter = /** @class */ (function () {
    function NumberFormatter() {
        this.formatter = function (number, mask) {
            var _a, _b, _c, _d, _e, _f;
            number = +number;
            var _formattedNumber = '';
            var _isNegative = false;
            if (isNaN(number))
                return number; // If not a number return as it is
            if (number < 0) {
                _isNegative = true;
                number = Math.abs(number);
            }
            var reversedMask = mask.split('').reverse().join('');
            var _g = (_a = /[,.\s]/g.exec(reversedMask)) !== null && _a !== void 0 ? _a : ['', null, null], _decimalSeparatorMatch = _g[0], _thousandSeparatorMatch = _g[1], _isNotDecimalMatch = _g[2];
            var _decimalSeparator = _decimalSeparatorMatch && _decimalSeparatorMatch[0];
            var _thousandsSeparator = (_thousandSeparatorMatch && _thousandSeparatorMatch[0]) ||
                _decimalSeparator;
            var _isNumericMask = _isNotDecimalMatch === undefined;
            var _isWithoutDecimal = _thousandSeparatorMatch === undefined;
            // Format decimal number
            if (_isNumericMask) {
                var _preFormattedDecimals = '';
                var _number = (_b = number.toString(10).split('.')[0]) !== null && _b !== void 0 ? _b : '';
                if (!_isWithoutDecimal) {
                    // handle decimals
                    var _h = mask.split(_decimalSeparator), _numberMask = _h[0], _decimalsMask = _h[1];
                    var _requiredDecimals = (_c = _decimalsMask === null || _decimalsMask === void 0 ? void 0 : _decimalsMask.match(/[0]/g)) !== null && _c !== void 0 ? _c : [];
                    var _nonRequiredDecimals = (_d = _decimalsMask === null || _decimalsMask === void 0 ? void 0 : _decimalsMask.match(/[#]/g)) !== null && _d !== void 0 ? _d : [];
                    var _numberDecimals = (_e = number.toString(10).split('.')[1]) !== null && _e !== void 0 ? _e : '';
                    if (_numberDecimals.length < _requiredDecimals.length) {
                        _preFormattedDecimals = number
                            .toFixed(_requiredDecimals.length)
                            .split(_decimalSeparator)[1];
                    }
                    else {
                        _preFormattedDecimals = number
                            .toFixed(_requiredDecimals.length + _nonRequiredDecimals.length)
                            .split(_decimalSeparator)[1];
                    }
                }
                // handle number
                var _reversedNumber = _number.split('').reverse().join('');
                var _reversedNumberMatch = (_f = _reversedNumber.match(/\d{1,3}/g)) !== null && _f !== void 0 ? _f : [];
                var _preFormattedNumber = _reversedNumberMatch
                    .join(_thousandsSeparator)
                    .split('')
                    .reverse()
                    .join('');
                _formattedNumber =
                    (_isNegative ? '-' : '') +
                        _preFormattedNumber +
                        _decimalSeparator +
                        _preFormattedDecimals;
            }
            // Format number mask
            else {
                /* empty */
                return number;
            }
            return _formattedNumber;
        };
    }
    NumberFormatter.prototype.formatNumber = function (number, mask) {
        return this.formatter(number, mask);
    };
    return NumberFormatter;
}());
exports.NumberFormatter = NumberFormatter;
