"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateFormatter = exports.NumberFormatter = void 0;
var NumberFormatter = /** @class */ (function () {
    function NumberFormatter() {
        var _this = this;
        this._formatter = function (number, mask) {
            var _a, _b, _c, _d, _e;
            number = +number;
            var _formattedNumber = '';
            var _isNegative = false;
            if (isNaN(number))
                return number; // If not a number return as it is
            if (number < 0) {
                _isNegative = true;
                number = Math.abs(number);
            }
            var _f = _this._parseMask(mask), _decimalSeparator = _f[0], _thousandsSeparator = _f[1], _isNumericMask = _f[2], _isWithoutDecimal = _f[3];
            // Format decimal number
            if (_isNumericMask) {
                var _preFormattedDecimals = '';
                var _number = Math.round(number).toString(10);
                if (!_isWithoutDecimal) {
                    // handle decimals
                    var _g = mask.split(_decimalSeparator), _numberMask = _g[0], _decimalsMask = _g[1];
                    var _requiredDecimalsLength = ((_a = _decimalsMask === null || _decimalsMask === void 0 ? void 0 : _decimalsMask.match(/[0]/g)) !== null && _a !== void 0 ? _a : []).length;
                    var _nonRequiredDecimalsLength = ((_b = _decimalsMask === null || _decimalsMask === void 0 ? void 0 : _decimalsMask.match(/[#]/g)) !== null && _b !== void 0 ? _b : []).length;
                    // cut number again for use with decimals
                    var __roundNumberPlacesConst = Math.pow(10, _requiredDecimalsLength + _nonRequiredDecimalsLength);
                    number = Math.round((number * __roundNumberPlacesConst)) / __roundNumberPlacesConst;
                    var _numberDecimalsLength = ((_c = number.toString(10).split('.')[1]) !== null && _c !== void 0 ? _c : '').length;
                    if (_numberDecimalsLength <= _requiredDecimalsLength) {
                        _preFormattedDecimals = number.toFixed(_requiredDecimalsLength);
                    }
                    else {
                        _preFormattedDecimals = number.toFixed(_numberDecimalsLength);
                    }
                    _preFormattedDecimals = (_d = _preFormattedDecimals.split('.')[1]) !== null && _d !== void 0 ? _d : '';
                    if (_preFormattedDecimals.length > 0) {
                        _preFormattedDecimals = _decimalSeparator + _preFormattedDecimals;
                    }
                }
                // handle number
                var _reversedNumber = _number.split('').reverse().join('');
                var _reversedNumberMatch = (_e = _reversedNumber.match(/\d{1,3}/g)) !== null && _e !== void 0 ? _e : [];
                var _preFormattedNumber = _reversedNumberMatch
                    .join(_thousandsSeparator)
                    .split('')
                    .reverse()
                    .join('');
                _formattedNumber =
                    (_isNegative ? '-' : '') +
                        _preFormattedNumber +
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
    NumberFormatter.prototype._parseMask = function (mask) {
        var reversedMask = mask.split('').reverse().join('');
        var _a = reversedMask.match(/[,.\s]/g) || ['', null, null], _decimalSeparatorMatch = _a[0], _thousandSeparatorMatch = _a[1], _isNotDecimalMatch = _a[2];
        var _decimalSeparator = _decimalSeparatorMatch && _decimalSeparatorMatch[0];
        var _thousandsSeparator = (_thousandSeparatorMatch && _thousandSeparatorMatch[0]) ||
            _decimalSeparator;
        var _isNumericMask = _isNotDecimalMatch === undefined;
        var _isWithoutDecimal = _thousandSeparatorMatch === undefined;
        return [_decimalSeparator, _thousandsSeparator, _isNumericMask, _isWithoutDecimal];
    };
    NumberFormatter.prototype.formatNumber = function (number, mask) {
        return this._formatter(number, mask);
    };
    NumberFormatter.prototype.convertToNumber = function (formattedNumber, mask) {
        if (typeof formattedNumber === 'number') {
            return formattedNumber;
        }
        var _a = this._parseMask(mask), _decimalSeparator = _a[0], _thousandsSeparator = _a[1], _isNumericMask = _a[2], _isWithoutDecimal = _a[3];
        var res = '';
        res = formattedNumber.replace(_thousandsSeparator, '');
        res = res.replace(_decimalSeparator, '.');
        return parseFloat(res);
    };
    return NumberFormatter;
}());
exports.NumberFormatter = NumberFormatter;
var DateFormatter = /** @class */ (function () {
    function DateFormatter() {
        this._datePartFormatsMapper = [
            { momentFormatPart: 'YYYY', primengFormatPart: 'yy' },
            { momentFormatPart: 'YY', primengFormatPart: 'y' },
            { momentFormatPart: 'MMMM', primengFormatPart: 'MM' },
            { momentFormatPart: 'MMM', primengFormatPart: 'M' },
            { momentFormatPart: 'MM', primengFormatPart: 'mm' },
            { momentFormatPart: 'M', primengFormatPart: 'm' },
            { momentFormatPart: 'DD', primengFormatPart: 'dd' },
            { momentFormatPart: 'D', primengFormatPart: 'd' },
            { momentFormatPart: 'HH', primengFormatPart: 'HH' },
            { momentFormatPart: 'hh', primengFormatPart: 'hh' },
            { momentFormatPart: 'mm', primengFormatPart: 'mm' },
            { momentFormatPart: 'ss', primengFormatPart: 'ss' },
        ];
    }
    DateFormatter.prototype.mapMomentFormatToPrimeNG = function (momentFormat) {
        var _this = this;
        return momentFormat === null || momentFormat === void 0 ? void 0 : momentFormat.replace(/([a-zA-Z])\1+/g, function (match) { return _this._convertDateFormatPart(match) || match; });
    };
    DateFormatter.prototype._convertDateFormatPart = function (momentFormat) {
        var matchingMapping = this._datePartFormatsMapper.filter(function (mapping) { return mapping.momentFormatPart === momentFormat; })[0];
        return matchingMapping ? matchingMapping.primengFormatPart : momentFormat;
    };
    return DateFormatter;
}());
exports.DateFormatter = DateFormatter;
