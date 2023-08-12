# number formatter
## supported mask characters
'#' stands for optional number

'0' stands for required number (leading zero)

',' or '.' stands for decimal separator

',' or '.' or '(whitespace)' stands for thousands separator



## examples
number 123456.7890 with mask # ###.00 results to 123 456.79

number 123456.7890 with mask # ###.00# results to 123 456.789

number 123456.7890 with mask # ###.## results to 123 456.79

number 123456.7890 with mask # ### results to 123 457

number 123456.7890 with mask ####.00 results to 123456.79

number 123456.7890 with mask # ###,0# results to 123 456,79

number 123456.7890 with mask 000 ### ### results to 000 123 457