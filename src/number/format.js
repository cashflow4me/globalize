define([
	"./format/properties",
	"./minus-sign",
	"./numbering-system",
	"./symbol-name",
	"../util/number/round",
	"../util/number/truncate",
	"../util/string/pad"
], function( numberFormatProperties, numberMinusSign, numberNumberingSystem, numberSymbolName, numberRound, numberTruncate, stringPad ) {

/**
 * format( number, pattern, cldr )
 *
 * @number [Number].
 *
 * @pattern [String] raw pattern for numbers.
 *
 * @cldr [Cldr instance].
 *
 * @options [Object]:
 * - minimumIntegerDigits [Number] 
 * - minimumFractionDigits, maximumFractionDigits [Number] 
 * - round [String] "ceil", "floor", "round" (default), or "truncate".
 *
 * Return the formatted number.
 * ref: http://www.unicode.org/reports/tr35/tr35-numbers.html
 */
return function( number, pattern, cldr, options ) {
	var aux, maximumFractionDigits, minimumFractionDigits, minimumIntegerDigits, padding, prefix, properties, ret, round, roundIncrement, suffix,
	numberingSystem = numberNumberingSystem( cldr );

	// Infinity, -Infinity, or NaN
	if ( !isFinite( number ) ) {
		ret = cldr.main([
			"numbers/symbols-numberSystem-" + numberingSystem,
			isNaN( number ) ? "nan" : "infinity"
		]);
		return number === -Infinity ? numberMinusSign( cldr ) + ret : ret;
	}

	options = options || {};
	round = numberRound( options.round );
	properties = numberFormatProperties( pattern );
	prefix = properties[ 0 ];
	padding = properties[ 1 ];
	minimumIntegerDigits = options.minimumIntegerDigits || properties[ 2 ];
	minimumFractionDigits = options.minimumFractionDigits || properties[ 3 ];
	maximumFractionDigits = options.maximumFractionDigits || properties[ 4 ];
	roundIncrement = properties[ 5 ];
	suffix = properties[ 6 ];

	ret = [ prefix ];

	// Percent
	if ( pattern.indexOf( "%" ) !== -1 ) {
		number *= 100;

	// Per mille
	} else if ( pattern.indexOf( "\u2030" ) !== -1 ) {
		number *= 1000;
	}

	// Significant digit format
	if ( false ) {
		throw new Error( "Significant digit format not implemented" );

	// Integer and fractional format
	} else {

		// Sanity check.
		if ( minimumFractionDigits > maximumFractionDigits ) {
			maximumFractionDigits = minimumFractionDigits;
		}

		aux = number;

		// Fraction
		if ( maximumFractionDigits ) {

			// Rounding
			if ( roundIncrement ) {
				aux = round( aux, roundIncrement );

			// Maximum fraction digits
			} else {
				aux = round( aux, Math.pow( 10, -maximumFractionDigits ) );
			}

			// Minimum fraction digits
			if ( minimumFractionDigits ) {
				aux = String( aux ).split( "." );
				aux[ 1 ] = stringPad( aux[ 1 ] || "", minimumFractionDigits, true );
				aux = aux.join( "." );
			}
		} else {
			aux = numberTruncate( aux );
		}

		aux = String( aux );

		// Minimum integer digits
		if ( minimumIntegerDigits ) {
			aux = aux.split( "." );
			aux[ 0 ] = stringPad( aux[ 0 ], minimumIntegerDigits );
			aux = aux.join( "." );
		}

		ret.push( aux );
	}

	// Scientific notation
	if ( false ) {
		throw new Error( "Scientific notation not implemented" );
	}

	// Padding
	if ( false ) {
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
