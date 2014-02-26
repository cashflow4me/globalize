define([
	"../pattern-re",
], function( numberPatternRe ) {

/**
 * format( number, pattern, cldr )
 *
 * @number [Number].
 *
 * @pattern [String] raw pattern for numbers.
 *
 * @cldr [Cldr instance].
 *
 * Return the formatted number.
 * ref: http://www.unicode.org/reports/tr35/tr35-numbers.html
 */
return function( pattern, cldr, options ) {
	var fractionPattern, integerPattern, maximumFractionDigits, minimumFractionDigits, minimumIntegerDigits, padding, prefix, roundIncrement, scientificNotation, significantPattern, suffix;

	pattern = pattern.match( numberPatternRe );
	if ( !pattern ) {
		return null;
	}

	options = options || {};
	prefix = pattern[ 1 ];
	padding = pattern[ 3 ];
	significantPattern = pattern[ 8 ];
	scientificNotation = pattern[ 9 ];
	suffix = pattern[ 10 ];

	// Significant digit format
	if ( significantPattern ) {
		throw new Error( "Significant digit format not implemented" );

	// Integer and fractional format
	} else {
		fractionPattern = pattern[ 7 ];
		integerPattern = pattern[ 6 ];

		if ( fractionPattern ) {

			// Minimum fraction digits, and rounding.
			fractionPattern.replace( /[0-9]+/, function( match ) {
				minimumFractionDigits = match;
			});
			if ( minimumFractionDigits ) {
				roundIncrement = +( "0." + minimumFractionDigits );
				minimumFractionDigits = minimumFractionDigits.length;
			}

			// Maximum fraction digits
			// 1: ignore decimal character
			maximumFractionDigits = fractionPattern.length - 1 /* 1 */;
		}

		// Minimum integer digits
		integerPattern.replace( /0+$/, function( match ) {
			minimumIntegerDigits = match.length;
		});
	}

	// Scientific notation
	if ( scientificNotation ) {
		throw new Error( "Scientific notation not implemented" );
	}

	// Padding
	if ( padding ) {
		throw new Error( "Padding not implemented" );
	}

	// Return:
	// 0: @prefix String
	// 1: @padding Array [ <character>, <count> ] TODO
	// 2: @minimumIntegerDigits non-negative integer Number value indicating the minimum integer digits to be used. Numbers will be padded with leading zeroes if necessary.
	// 3: @minimumFractionDigits and
	// 4: @maximumFractionDigits are non-negative integer Number values indicating the minimum and maximum fraction digits to be used. Numbers will be rounded or padded with trailing zeroes if necessary.
	// 5: @roundIncrement Decimal round increment or null
	// 6: @suffix String
	return [
		prefix,
		padding,
		minimumIntegerDigits,
		minimumFractionDigits,
		maximumFractionDigits,
		roundIncrement,
		suffix
	];
};

});
