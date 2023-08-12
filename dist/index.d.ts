export declare class NumberFormatter {
    private _parseMask;
    private _formatter;
    formatNumber(number: number, mask: string): string | number;
    convertToNumber(formattedNumber: string | number, mask: string): number;
}
export declare class DateFormatter {
    mapMomentFormatToPrimeNG(momentFormat: string): string;
    private _convertDateFormatPart;
    private _datePartFormatsMapper;
}
