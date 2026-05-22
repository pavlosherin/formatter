# formatter

Utility for formatting numbers and dates.

## Number Formatting

### Supported mask characters
'#' stands for optional number

'0' stands for required number (leading zero)

',' or '.' stands for decimal separator

',' or '.' or '(whitespace)' stands for thousands separator

### Format rules

thousands are formatted by four of '#' or '0', example '#.###'

decimals are formatted by three '#' or '0' then decimal separator and amount of '#' or '0' for decimal length, example '###,00##'

parser regex is `/^([#0]+[,.\s]?[#0]{3})|([#0]{3}[,.]?[#0]*)$/g`

### Examples
number 123456.7890 with mask '# ###.00' results to 123 456.79

number 123456.7890 with mask '# ###.00#' results to 123 456.789

number 123456.7890 with mask '# ###.##' results to 123 456.79

number 123456.7890 with mask '# ###' results to 123 457

number 123456.7890 with mask '#,###' results to 123,457

number 123456.7890 with mask '####.00' results to 123456.79

number 123456.7890 with mask '# ###,0#' results to 123 456,79

number 123456.7890 with mask '# ###,0#####' results to 123 456,789

number 123456.7890 with mask '000 ### ###' results to invalid result ('000 ### ###' is not supported format of mask)

## Date Formatting

The library uses **Luxon** for date formatting.

### DateFormatter

`DateFormatter` provides methods to map between PrimeNG and Luxon date formats.

- `mapPrimeNGToLuxonFormat(primengFormat: string): string`
- `mapLuxonFormatToPrimeNG(luxonFormat: string): string`

#### Supported mappings:

| Luxon | PrimeNG | Description |
| :--- | :--- | :--- |
| `yyyy` | `yy` | year (four digit) |
| `yy` | `y` | year (two digit) |
| `MMMM` | `MM` | month name long |
| `MMM` | `M` | month name short |
| `MM` | `mm` | month of year (two digit) |
| `M` | `m` | month of year (no leading zero) |
| `dd` | `dd` | day of month (two digit) |
| `d` | `d` | day of month (no leading zero) |
| `HH` | `HH` | 24-hour (two digit) |
| `hh` | `hh` | 12-hour (two digit) |
| `mm` | `mm` | minutes (two digit) |
| `ss` | `ss` | seconds (two digit) |

## FormatterService

`FormatterService` is a high-level service that combines number and date formatting.

### Setup
No setup is required for date formatting. `FormatterService` uses Luxon `DateTime` internally.

```typescript
const formatterService = new FormatterService();
```

### Methods

#### `formatValue(params: FormatterParams): string | undefined`

Formats a value based on the `columnType`.

**Params:**
- `columnType`: `'number' | 'datetime' | 'date' | 'time' | 'selection' | 'string'`
- `value`: The value to format (`string | number | Date`)
- `mask`: Optional format mask
- `prefix`: Optional prefix
- `suffix`: Optional suffix
- `enumValues`: Required for `'selection'` type to map values to names.

#### `formatNumber(number: number, format: string): string | number`
Formats a number using `NumberFormatter`.

#### `getBaseDateFormat(lang: string): string`
Returns a default Luxon date format string for the given locale using `Intl.DateTimeFormat`.

#### `convertFormattedNumberToNumber(formattedNumber: string | number, mask: string | undefined): number`
Converts a formatted string back to a number.
