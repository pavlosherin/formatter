export class NumberFormatter {
  private _parseMask(mask: string): [_decimalSeparator: string, _thousandsSeparator: string, _isNumericMask: boolean, _isWithoutDecimal: boolean] {
    const reversedMask = mask.split('').reverse().join('');
    const [
      _decimalSeparatorMatch,
      _thousandSeparatorMatch,
      _isNotDecimalMatch,
    ] = reversedMask.match(/[,.\s]/g) || ['', null, null];
    const _decimalSeparator =
      _decimalSeparatorMatch && _decimalSeparatorMatch[0];
    const _thousandsSeparator =
      (_thousandSeparatorMatch && _thousandSeparatorMatch[0]) ||
      _decimalSeparator;
    const _isNumericMask = _isNotDecimalMatch === undefined;
    const _isWithoutDecimal = _thousandSeparatorMatch === undefined;

    return [_decimalSeparator, _thousandsSeparator, _isNumericMask, _isWithoutDecimal];
  }
  private _formatter = (number: number, mask: string): string | number => {
    number = +number;

    let _formattedNumber = '';
    let _isNegative = false;

    if (isNaN(number)) return number; // If not a number return as it is

    if (number < 0) {
      _isNegative = true;
      number = Math.abs(number);
    }

    const [_decimalSeparator, _thousandsSeparator, _isNumericMask, _isWithoutDecimal] = this._parseMask(mask);

    // Format decimal number
    if (_isNumericMask) {
      let _preFormattedDecimals = '';
      let _number = Math.round(number).toString(10);

      if (!_isWithoutDecimal) {
        // handle decimals
        const [_numberMask, _decimalsMask] = mask.split(_decimalSeparator);
        const _requiredDecimalsLength = (_decimalsMask?.match(/[0]/g) ?? []).length;
        const _nonRequiredDecimalsLength = (_decimalsMask?.match(/[#]/g) ?? []).length;

        // cut number again for use with decimals
        const __roundNumberPlacesConst = Math.pow(10, _requiredDecimalsLength + _nonRequiredDecimalsLength)
        number = Math.round((number * __roundNumberPlacesConst)) / __roundNumberPlacesConst;

        const _numberDecimalsLength = (number.toString(10).split('.')[1] ?? '').length;

        if (_numberDecimalsLength <= _requiredDecimalsLength) {
          _preFormattedDecimals = number.toFixed(_requiredDecimalsLength);
        } else {
          _preFormattedDecimals = number.toFixed(_numberDecimalsLength);
        }
        _preFormattedDecimals = _preFormattedDecimals.split('.')[1] ?? '';
        if (_preFormattedDecimals.length > 0) {
          _preFormattedDecimals = _decimalSeparator + _preFormattedDecimals;
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
    return this._formatter(number, mask);
  }

  public convertToNumber(formattedNumber: string | number, mask: string): number {
    if (typeof formattedNumber === 'number') {
      return formattedNumber;
    }
    const [_decimalSeparator, _thousandsSeparator, _isNumericMask, _isWithoutDecimal] = this._parseMask(mask);
    let res = '';
    res = (formattedNumber as string).replace(_thousandsSeparator, '');
    res = res.replace(_decimalSeparator, '.');
    return parseFloat(res);
  }
}

export class DateFormatter {
  public mapMomentFormatToPrimeNG(momentFormat: string): string {
    return momentFormat?.replace(
      /([a-zA-Z])\1+/g,
      match => this._convertDateFormatPart(match) || match
    );
  }

  private _convertDateFormatPart(momentFormat: string): string {
    const matchingMapping = this._datePartFormatsMapper.filter(
      mapping => mapping.momentFormatPart === momentFormat
    )[0];
    return matchingMapping ? matchingMapping.primengFormatPart : momentFormat;
  }

  private _datePartFormatsMapper: {
    momentFormatPart: string;
    primengFormatPart: string;
  }[] = [
    { momentFormatPart: 'YYYY', primengFormatPart: 'yy' }, // year (four digit)
    { momentFormatPart: 'YY', primengFormatPart: 'y' }, // year (two digit)
    { momentFormatPart: 'MMMM', primengFormatPart: 'MM' }, // month name long
    { momentFormatPart: 'MMM', primengFormatPart: 'M' }, // month name short
    { momentFormatPart: 'MM', primengFormatPart: 'mm' }, // month of year (two digit)
    { momentFormatPart: 'M', primengFormatPart: 'm' }, // month of year (no leading zero)
    { momentFormatPart: 'DD', primengFormatPart: 'dd' }, // day of month (two digit)
    { momentFormatPart: 'D', primengFormatPart: 'd' }, // day of month (no leading zero)
    { momentFormatPart: 'HH', primengFormatPart: 'HH' },
    { momentFormatPart: 'hh', primengFormatPart: 'hh' },
    { momentFormatPart: 'mm', primengFormatPart: 'mm' },
    { momentFormatPart: 'ss', primengFormatPart: 'ss' },
  ];
}