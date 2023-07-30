export class NumberFormatter {
  private formatter = (number: number, mask: string): string | number => {
    number = +number;

    let _formattedNumber = '';
    let _isNegative = false;

    if (isNaN(number)) return number; // If not a number return as it is

    if (number < 0) {
      _isNegative = true;
      number = Math.abs(number);
    }

    const reversedMask = mask.split('').reverse().join('');
    const [
      _decimalSeparatorMatch,
      _thousandSeparatorMatch,
      _isNotDecimalMatch,
    ] = /[,.\s]/g.exec(reversedMask) ?? ['', null, null];
    const _decimalSeparator =
      _decimalSeparatorMatch && _decimalSeparatorMatch[0];
    const _thousandsSeparator =
      (_thousandSeparatorMatch && _thousandSeparatorMatch[0]) ||
      _decimalSeparator;
    const _isNumericMask = _isNotDecimalMatch === undefined;
    const _isWithoutDecimal = _thousandSeparatorMatch === undefined;

    // Format decimal number
    if (_isNumericMask) {
      let _preFormattedDecimals = '';
      const _number = number.toString(10).split('.')[0] ?? '';

      if (!_isWithoutDecimal) {
        // handle decimals
        const [_numberMask, _decimalsMask] = mask.split(_decimalSeparator);
        const _requiredDecimals = _decimalsMask?.match(/[0]/g) ?? [];
        const _nonRequiredDecimals = _decimalsMask?.match(/[#]/g) ?? [];
        const _numberDecimals = number.toString(10).split('.')[1] ?? '';

        if (_numberDecimals.length < _requiredDecimals.length) {
          _preFormattedDecimals = number
            .toFixed(_requiredDecimals.length)
            .split(_decimalSeparator)[1];
        } else {
          _preFormattedDecimals = number
            .toFixed(_requiredDecimals.length + _nonRequiredDecimals.length)
            .split(_decimalSeparator)[1];
        }
      }

      // handle number
      const _reversedNumber = _number.split('').reverse().join('');
      const _reversedNumberMatch = _reversedNumber.match(/\d{1,3}/g) ?? [];
      const _preFormattedNumber = _reversedNumberMatch
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

  public formatNumber(number: number, mask: string): string | number {
    return this.formatter(number, mask);
  }
}
