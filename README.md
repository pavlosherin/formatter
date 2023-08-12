# number formatter
## supported mask characters
'#' stands for optional number

'0' stands for required number (leading zero)

',' or '.' stands for decimal separator

',' or '.' or '(whitespace)' stands for thousands separator

## format rules

thousands are formatted by four of '#' or '0', example '#.###'

decimals are formatted by three '#' or '0' then decimal separator and amount of '#' or '0' for decimal length, example '###,00##'

parser regex is /^([#0]+[,.\s]?[#0]{3})|([#0]{3}[,.]?[#0]*)$/g



## examples
number 123456.7890 with mask '# ###.00' results to 123 456.79

number 123456.7890 with mask '# ###.00#' results to 123 456.789

number 123456.7890 with mask '# ###.##' results to 123 456.79

number 123456.7890 with mask '# ###' results to 123 457

number 123456.7890 with mask '#,###' results to 123,457

number 123456.7890 with mask '####.00' results to 123456.79

number 123456.7890 with mask '# ###,0#' results to 123 456,79

number 123456.7890 with mask '# ###,0#####' results to 123 456,789

number 123456.7890 with mask '000 ### ###' results to invalid result ('000 ### ###' is not supported format of mask)