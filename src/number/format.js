define([
	"./minus-sign",
	"./numbering-system",
	"./pattern-re",
	"./symbol-name",
	"../util/number/truncate",
	"../util/string/pad"
], function( numberMinusSign, numberNumberingSystem, numberPatternRe, numberSymbolName, numberTruncate, stringPad ) {

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
return function( number, pattern, cldr, options ) {
	var aux, fractionPattern, integerPattern, minimumFractionDigits, padding, prefix, ret, scientificNotation, significantPattern, suffix,
	numberingSystem = numberNumberingSystem( cldr );

	// Infinity, -Infinity, or NaN
	if ( !isFinite( number ) ) {
		ret = cldr.main([
			"numbers/symbols-numberSystem-" + numberingSystem,
			isNaN( number ) ? "nan" : "infinity"
		]);
		return number === -Infinity ? numberMinusSign( cldr ) + ret : ret;
	}

	pattern = pattern.match( numberPatternRe );
	if ( !pattern ) {
		return null;
	}

	options = options || {};
	padding = pattern[ 3 ];
	prefix = pattern[ 1 ];
	scientificNotation = pattern[ 9 ];
	significantPattern = pattern[ 8 ];
	suffix = pattern[ 10 ];

	ret = [ prefix ];

	// Percent
	if ( pattern[ 0 ].indexOf( "%" ) !== -1 ) {
		number *= 100;

	// Per mille
	} else if ( pattern[ 0 ].indexOf( "\u2030" ) !== -1 ) {
		number *= 1000;
	}

	// Significant digit format
	if ( significantPattern ) {
		throw new Error( "Significant digit format not implemented" );

	// Integer and fractional format
	} else {
		fractionPattern = pattern[ 7 ] || "";
		integerPattern = pattern[ 6 ] || "";
		aux = number;

		if ( fractionPattern ) {

			// Rounding
			fractionPattern.replace( /[0-9]+/, function( increment ) {
				minimumFractionDigits = increment;
				increment = +( "0." + increment );
				if ( increment ) {
					aux = Math.round( aux / increment ) * increment;
				}
			});

			// Maximum fraction digits
			if ( fractionPattern ) {

				// 1: ignore decimal character
				var order = Math.pow( 10, fractionPattern.length - 1 /* 1 */ );

				// Truncate
				aux = numberTruncate( aux * order) / order;
			}

			// Minimum fraction digits
			if ( minimumFractionDigits ) {
				aux = String( aux ).split( "." );
				aux[ 1 ] = stringPad( aux[ 1 ] || "", minimumFractionDigits.length, true );
				aux = aux.join( "." );
			}
		} else {
			aux = numberTruncate( aux );
		}

		aux = String( aux );

		// Minimum integer digits
		integerPattern.replace( /0+$/, function( minimumIntegerDigits ) {
			aux = aux.split( "." );
			aux[ 0 ] = stringPad( aux[ 0 ], minimumIntegerDigits.length );
			aux = aux.join( "." );
		});

		ret.push( aux );
	}

	// Scientific notation
	if ( scientificNotation ) {
		throw new Error( "Scientific notation not implemented" );
	}

	// Padding
	if ( padding ) {
		throw new Error( "Padding not implemented" );
	}

	ret.push( suffix );

	// Symbols
	return ret.join( "" ).replace( /[.,\-+E%\u2030]/g, function( symbol ) {
		return cldr.main([
			"numbers/symbols-numberSystem-" + numberingSystem,
			numberSymbolName[ symbol ]
		]);
	});
};

});
