define([
	"./common/get-locale",
	"./core",
	"./number/format"
], function( commonGetLocale, Globalize, numberFormat ) {

var formatSuper;

/**
 * Globalize.format( value, pattern, locale )
 *
 * @value [Number]
 *
 * @pattern [String or Object] see date/expand_pattern for more info.
 *
 * @locale [String]
 *
 * Formats a date or number according to the given pattern string and the given locale (or the default locale if not specified).
 */
formatSuper = Globalize.format;
Globalize.format = function( value, pattern, locale ) {
	if ( formatSuper ) {
		value = formatSuper.apply( Globalize, arguments );
	}

	if ( typeof value === "number" ) {
		locale = commonGetLocale( locale );
		value = numberFormat( value, pattern, locale );
	}

	return value;
};

/**
 * Globalize.parseNumber( value, patterns, locale )
 *
 * @value [String]
 *
 * @patterns [TBD]
 *
 * @locale [String]
 *
 * Return a Number or null.
 */
Globalize.parseNumber = function( /*value, patterns, locale*/ ) {
	return null;
};

return Globalize;

});
