define([
	"./format/properties",
	"./symbol",
	"../util/number/round",
	"../util/number/truncate",
	"../util/string/pad"
], function( numberFormatProperties, numberSymbol, numberRound, numberTruncate, stringPad ) {

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
	var aux, maximumFractionDigits, minimumFractionDigits, minimumIntegerDigits, padding, prefix, properties, ret, round, roundIncrement, suffix;

	// Infinity, -Infinity, or NaN
	if ( !isFinite( number ) ) {
		aux = numberSymbol( isNaN( number ) ? "nan" : "infinity", cldr );
		return number === -Infinity ? numberSymbol( "-", cldr ) + aux : aux;
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

	ret = prefix;

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

		// Fraction
		if ( maximumFractionDigits ) {

			// Rounding
			if ( roundIncrement ) {
				number = round( number, roundIncrement );

			// Maximum fraction digits
			} else {
				number = round( number, Math.pow( 10, -maximumFractionDigits ) );
			}

			// Minimum fraction digits
			if ( minimumFractionDigits ) {
				number = String( number ).split( "." );
				number[ 1 ] = stringPad( number[ 1 ] || "", minimumFractionDigits, true );
				number = number.join( "." );
			}
		} else {
			number = numberTruncate( number );
		}

		number = String( number );

		// Minimum integer digits
		if ( minimumIntegerDigits ) {
			number = number.split( "." );
			number[ 0 ] = stringPad( number[ 0 ], minimumIntegerDigits );
			number = number.join( "." );
		}
	}

	ret += number;

	// Scientific notation
	if ( false ) {
		throw new Error( "Scientific notation not implemented" );
	}

	// Padding
	if ( false ) {
		throw new Error( "Padding not implemented" );
	}

	ret += suffix;

	// Symbols
	return ret.replace( /'[^']+'|[.,\-+E%\u2030]/g, function( symbol ) {
		if ( symbol.charAt( 0 ) === "'" ) {
			return symbol;
		}
		return numberSymbol( symbol, cldr );
	});
};

});
