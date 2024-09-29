import moment from 'moment/moment';

export class NumberFormatter {
  private _parseMask(mask: string): [_decimalSeparator: string, _thousandsSeparator: string, _isNumericMask: boolean, _isWithoutDecimal: boolean] {
    const _thousandsSeparator = mask
      .match(/^[#0]+[,.\s]?[#0]{3}/g)
      ?.shift()
      ?.replace(/[#0]/g, '') ?? '';
    const _decimalSeparator = mask
      .match(/[#0]{3}[,.]?[#0]*$/g)
      ?.pop()
      ?.replace(/[#0]/g, '') ?? '';
    const _isWithoutDecimal = _decimalSeparator === '';
    const _isNumericMask = (/^([#0]+[,.\s]?[#0]{3})|([#0]{3}[,.]?[#0]*)$/g).test(mask);

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
    if (!_isWithoutDecimal) {
      res = res.replace(_decimalSeparator, '.');
    }
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

export class FormatterService {

  set moment(moment: any) {
    this._moment = moment;
  }
  private _moment?: any;

  private _numberFormatter: NumberFormatter = new NumberFormatter();

  formatNumber(number: number, format: string): string | number {
    return this._numberFormatter.formatNumber(number, format);
  }

  /**
   * According to MomentJs patterns
   * @param lang
   */
  getBaseDateFormat(lang: string): string {
    let res = '';
    const dateParts = new Intl.DateTimeFormat(lang).formatToParts();
    dateParts.forEach(part => {
      switch (part.type) {
        case 'day':
          res += part.value.replaceAll(/[0-9]/g, 'D');
          break;
        case 'month':
          res += part.value.replaceAll(/[0-9]/g, 'M');
          break;
        case 'year':
          res += part.value.replaceAll(/[0-9]/g, 'Y');
          break;
        case 'literal':
          res += part.value;
          break;
        default:
          break;
      }
    });
    return res;
  }

  convertFormattedNumberToNumber(
    formattedNumber: string | number,
    mask: string | undefined
  ): number {
    if (mask) {
      return this._numberFormatter.convertToNumber(formattedNumber, mask);
    }
    return parseFloat(<string>formattedNumber);
  }

  /**
   * Use format service to format number by mask
   * @param value Any value, mask is applied only to number
   * @param entityFormatMask
   * @private
   */
  private _formatNumberByMask(
    value: unknown | number,
    entityFormatMask?: string
  ): string | number | unknown {
    if (typeof value !== 'number') {
      value = parseFloat(value as string);
    }
    if (entityFormatMask) {
      return this.formatNumber(<number>value, entityFormatMask);
    }
    return value;
  }

  /**
   * Format a value based on the given format and data type.
   * @returns The formatted value as a string.
   * @param params
   */
  formatValue(params: {
    columnType?: 'number' | 'datetime' | 'selection' | 'string' | undefined,
    prefix?: string,
    suffix?: string,
    mask?: string,
    value?: string | number | Date | null | undefined,
    enumValues?: any[],
  }): string {
    // Check if the value is null or undefined, and return an empty string if so.
    if (params.value === null || params.value === undefined) {
      return '';
    }

    // Ensure value is of type string, number, or Date.
    params.value = <string | number | Date>params.value;

    // Get prefix and suffix from the column entity format, default to empty strings if not defined.
    const prefix = params?.prefix ?? '';
    const suffix = params?.suffix ?? '';

    let formattedValue = '';

    // Determine how to format the value based on its data type.
    switch (params.columnType) {
      case 'number':
        // Format numbers using the specified mask.
        formattedValue = <string>this._formatNumberByMask(params.value, params.mask);
        break;
      case 'datetime':
        // Format date and time values using the specified mask or default format.
        formattedValue = this._moment(new Date(params.value)).format(
          params?.mask ?? this._moment.defaultFormat
        );
        break;
      case 'selection':
        // Format selection values by finding the corresponding name from enumValues.
        formattedValue =
          params?.enumValues?.find((_enum: { value: any }) => _enum.value === params.value)
            ?.name ?? <string>params.value;
        break;
      case 'string':
      default:
        // For string data types or if no data type is specified, keep the value as is.
        formattedValue = <string>params.value;
        break;
    }

    // Combine the prefix, formatted value, and suffix to create the final formatted string.
    return [prefix, formattedValue, suffix].join(' ').trim();
  }
}
