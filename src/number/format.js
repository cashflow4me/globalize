define([
	"./format/properties",
	"./minus-sign",
	"./numbering-system",
	"./symbol-name",
	"../util/number/truncate",
	"../util/string/pad"
], function( numberFormatProperties, numberMinusSign, numberNumberingSystem, numberSymbolName, numberTruncate, stringPad ) {

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
	var aux, maximumFractionDigits, minimumFractionDigits, minimumIntegerDigits, order, padding, prefix, properties, ret, roundIncrement, suffix,
	numberingSystem = numberNumberingSystem( cldr );

	// Infinity, -Infinity, or NaN
	if ( !isFinite( number ) ) {
		ret = cldr.main([
			"numbers/symbols-numberSystem-" + numberingSystem,
			isNaN( number ) ? "nan" : "infinity"
		]);
		return number === -Infinity ? numberMinusSign( cldr ) + ret : ret;
	}

	properties = numberFormatProperties( pattern, cldr, options );
	prefix = properties[ 0 ];
	padding = properties[ 1 ];
	minimumIntegerDigits = properties[ 2 ];
	minimumFractionDigits = properties[ 3 ];
	maximumFractionDigits = properties[ 4 ];
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
		aux = number;

		// Fraction
		if ( maximumFractionDigits ) {

			// Rounding
			if ( roundIncrement ) {
				aux = Math.round( aux / roundIncrement ) * roundIncrement;
			}

			// Maximum fraction digits
			order = Math.pow( 10, maximumFractionDigits );

			// Truncate
			aux = numberTruncate( aux * order) / order;

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
