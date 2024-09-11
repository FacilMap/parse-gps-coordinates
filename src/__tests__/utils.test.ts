import { expect, test } from "vitest";
import { parseGpsCoordinates } from "..";

test("parseGpsCoordinates", () => {
	// Simple coordinates
	expect(parseGpsCoordinates("1.234,2.345")).toEqual({ lat: 1.234, lon: 2.345 });
	expect(parseGpsCoordinates("-1.234,2.345")).toEqual({ lat: -1.234, lon: 2.345 });
	expect(parseGpsCoordinates("1.234,-2.345")).toEqual({ lat: 1.234, lon: -2.345 });

	// Integers
	expect(parseGpsCoordinates("1,2")).toEqual({ lat: 1, lon: 2 });
	expect(parseGpsCoordinates("-1,2")).toEqual({ lat: -1, lon: 2 });
	expect(parseGpsCoordinates("1,-2")).toEqual({ lat: 1, lon: -2 });

	// With unicode minus
	expect(parseGpsCoordinates("−1.234,2.345")).toEqual({ lat: -1.234, lon: 2.345 });
	expect(parseGpsCoordinates("1.234,−2.345")).toEqual({ lat: 1.234, lon: -2.345 });

	// With spaces
	expect(parseGpsCoordinates("  -  1.234  ,  -  2.345  ")).toEqual({ lat: -1.234, lon: -2.345 });

	// With different separators
	expect(parseGpsCoordinates("-1.234;-2.345")).toEqual({ lat: -1.234, lon: -2.345 });
	expect(parseGpsCoordinates("-1.234 -2.345")).toEqual({ lat: -1.234, lon: -2.345 });

	// Using decimal comma
	expect(parseGpsCoordinates("-1,234,-2,345")).toEqual({ lat: -1.234, lon: -2.345 });
	expect(parseGpsCoordinates("-1,234;-2,345")).toEqual({ lat: -1.234, lon: -2.345 });
	expect(parseGpsCoordinates("-1,234 -2,345")).toEqual({ lat: -1.234, lon: -2.345 });

	// Geo URI
	expect(parseGpsCoordinates("geo:-1.234,-2.345")).toEqual({ lat: -1.234, lon: -2.345 });
	expect(parseGpsCoordinates("geo:-1.234,-2.345?z=10")).toEqual({ lat: -1.234, lon: -2.345, zoom: 10 });

	// With degree sign
	expect(parseGpsCoordinates("-1.234° -2.345°")).toEqual({ lat: -1.234, lon: -2.345 });
	expect(parseGpsCoordinates("-1.234 ° -2.345 °")).toEqual({ lat: -1.234, lon: -2.345 });
	expect(parseGpsCoordinates("-1.234 °, -2.345 °")).toEqual({ lat: -1.234, lon: -2.345 });

	// With "deg"
	expect(parseGpsCoordinates("-1.234deg -2.345deg")).toEqual({ lat: -1.234, lon: -2.345 });
	expect(parseGpsCoordinates("-1.234 deg -2.345 deg")).toEqual({ lat: -1.234, lon: -2.345 });
	expect(parseGpsCoordinates("-1.234 deg, -2.345 deg")).toEqual({ lat: -1.234, lon: -2.345 });

	// With minutes
	expect(parseGpsCoordinates("-1° 24' -2° 36'")).toEqual({ lat: -1.4, lon: -2.6 });
	expect(parseGpsCoordinates("-1° 24', -2° 36'")).toEqual({ lat: -1.4, lon: -2.6 });
	expect(parseGpsCoordinates("-1 ° 24 ' -2 ° 36 '")).toEqual({ lat: -1.4, lon: -2.6 });

	// With unicode minute sign
	expect(parseGpsCoordinates("-1deg 24′ -2deg 36′")).toEqual({ lat: -1.4, lon: -2.6 });
	expect(parseGpsCoordinates("-1deg 24′, -2deg 36′")).toEqual({ lat: -1.4, lon: -2.6 });
	expect(parseGpsCoordinates("-1 deg 24 ′ -2 deg 36 ′")).toEqual({ lat: -1.4, lon: -2.6 });

	// With seconds
	expect(parseGpsCoordinates("-1° 24' 36\" -2° 36' 72\"")).toEqual({ lat: -1.41, lon: -2.62 });
	expect(parseGpsCoordinates("-1° 24' 36\", -2° 36' 72\"")).toEqual({ lat: -1.41, lon: -2.62 });
	expect(parseGpsCoordinates("-1 ° 24 ' 36 \" -2 ° 36 ' 72 \"")).toEqual({ lat: -1.41, lon: -2.62 });
	expect(parseGpsCoordinates("-1° 36\" -2° 72\"")).toEqual({ lat: -1.01, lon: -2.02 });

	// With unicode second sign
	expect(parseGpsCoordinates("-1deg 24′ 36″ -2deg 36′ 72″")).toEqual({ lat: -1.41, lon: -2.62 });
	expect(parseGpsCoordinates("-1deg 24′ 36″, -2deg 36′ 72″")).toEqual({ lat: -1.41, lon: -2.62 });
	expect(parseGpsCoordinates("-1 deg 24 ′ 36 ″ -2 deg 36 ′ 72 ″")).toEqual({ lat: -1.41, lon: -2.62 });
	expect(parseGpsCoordinates("-1deg 36″ -2deg 72″")).toEqual({ lat: -1.01, lon: -2.02 });

	// With unicode quote signs
	expect(parseGpsCoordinates("-1deg 24’ 36” -2deg 36’ 72”")).toEqual({ lat: -1.41, lon: -2.62 });
	expect(parseGpsCoordinates("-1deg 24’ 36”, -2deg 36’ 72”")).toEqual({ lat: -1.41, lon: -2.62 });
	expect(parseGpsCoordinates("-1 deg 24 ’ 36 ” -2 deg 36 ’ 72 ”")).toEqual({ lat: -1.41, lon: -2.62 });
	expect(parseGpsCoordinates("-1deg 36” -2deg 72”")).toEqual({ lat: -1.01, lon: -2.02 });

	// Other hemisphere
	expect(parseGpsCoordinates("1° 24' N 2° 36' E")).toEqual({ lat: 1.4, lon: 2.6 });
	expect(parseGpsCoordinates("N 1° 24' E 2° 36'")).toEqual({ lat: 1.4, lon: 2.6 });
	expect(parseGpsCoordinates("1° 24' S 2° 36' E")).toEqual({ lat: -1.4, lon: 2.6 });
	expect(parseGpsCoordinates("S 1° 24' E 2° 36'")).toEqual({ lat: -1.4, lon: 2.6 });
	expect(parseGpsCoordinates("1° 24' N 2° 36' W")).toEqual({ lat: 1.4, lon: -2.6 });
	expect(parseGpsCoordinates("N 1° 24' W 2° 36'")).toEqual({ lat: 1.4, lon: -2.6 });
	expect(parseGpsCoordinates("1° 24' s 2° 36' w")).toEqual({ lat: -1.4, lon: -2.6 });
	expect(parseGpsCoordinates("s 1° 24' w 2° 36'")).toEqual({ lat: -1.4, lon: -2.6 });

	// Switch lon/lat
	expect(parseGpsCoordinates("1° 24' E 2° 36' N")).toEqual({ lat: 2.6, lon: 1.4 });
	expect(parseGpsCoordinates("E 1° 24' N 2° 36'")).toEqual({ lat: 2.6, lon: 1.4 });
	expect(parseGpsCoordinates("1° 24' E 2° 36' S")).toEqual({ lat: -2.6, lon: 1.4 });
	expect(parseGpsCoordinates("E 1° 24' S 2° 36'")).toEqual({ lat: -2.6, lon: 1.4 });
	expect(parseGpsCoordinates("1° 24' W 2° 36' N")).toEqual({ lat: 2.6, lon: -1.4 });
	expect(parseGpsCoordinates("W 1° 24' N 2° 36'")).toEqual({ lat: 2.6, lon: -1.4 });
	expect(parseGpsCoordinates("1° 24' W 2° 36' S")).toEqual({ lat: -2.6, lon: -1.4 });
	expect(parseGpsCoordinates("W 1° 24' S 2° 36'")).toEqual({ lat: -2.6, lon: -1.4 });

	// Practical examples
	expect(parseGpsCoordinates("N 53°53’42.8928” E 10°44’13.4844”")).toEqual({ lat: 53.895248, lon: 10.737079 }); // Park4night
	expect(parseGpsCoordinates("53°53'42.9\"N 10°44'13.5\"E")).toEqual({ lat: 53.895250, lon: expect.closeTo(10.737083, 6) }); // Google Maps
	expect(parseGpsCoordinates("55°41′34.3″N 12°35′57.4″E")).toEqual({ lat: expect.closeTo(55.692861, 6), lon: expect.closeTo(12.599278, 6) }); // Wikipedia

	// Invalid lon/lat combination
	expect(parseGpsCoordinates("1° 24' N 2° 36' N")).toEqual(undefined);
	expect(parseGpsCoordinates("1° 24' E 2° 36' E")).toEqual(undefined);
	expect(parseGpsCoordinates("1° 24' S 2° 36' S")).toEqual(undefined);
	expect(parseGpsCoordinates("1° 24' W 2° 36' W")).toEqual(undefined);
	expect(parseGpsCoordinates("1° 24' N 2° 36' S")).toEqual(undefined);
	expect(parseGpsCoordinates("1° 24' S 2° 36' N")).toEqual(undefined);
	expect(parseGpsCoordinates("1° 24' W 2° 36' E")).toEqual(undefined);
	expect(parseGpsCoordinates("1° 24' E 2° 36' W")).toEqual(undefined);

	// Invalid hemisphere prefix/suffix combination
	expect(parseGpsCoordinates("N 1° 24' 2° 36'")).toEqual(undefined);
	expect(parseGpsCoordinates("1° 24' E 2° 36'")).toEqual(undefined);
	expect(parseGpsCoordinates("1° 24' 2° 36' E")).toEqual(undefined);
	expect(parseGpsCoordinates("N 1° 24' E 2° 36' E")).toEqual(undefined);
	expect(parseGpsCoordinates("N 1° 24' 2° 36' E")).toEqual(undefined);
	expect(parseGpsCoordinates("1° 24' E N 2° 36'")).toEqual(undefined);
});