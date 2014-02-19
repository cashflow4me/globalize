define([
	"./numbering-system"
], function( numberNumberingSystem ) {

/**
 * MinusSign( cldr )
 *
 * Return the localized minus sign.
 */
return function( cldr ) {
	return cldr.main([
		"numbers/symbols-numberSystem-" + numberNumberingSystem( cldr ),
		"minusSign"
	]);
};

});
