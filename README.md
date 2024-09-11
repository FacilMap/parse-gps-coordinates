parse-gps-coordinates
=====================

parse-gps-coordinates is a simple TypeScript library to parse user-provided GPS coordinates (latitude and longitude).
Users may provide coordinates in a large variety of formats, such as:
* `-1.234,-2.345` (latitude, longitude)
* `geo:-1.234,-2.345` ([geo URI](https://en.wikipedia.org/wiki/Geo_URI_scheme))
* `geo:-1.234,-2.345?z=10` (geo URI with zoom level)
* `-1.234;-2.345` (semicolon separator)
* `-1.234 -2.345` (space separator)
* `-1,234 -2,345` (decimal comma)
* `−1.234,−2.345` (Unicode minus)
* `-1.234°, -2.345°` (with degree sign)
* `1° 23', 2° 34'` (degrees and minutes)
* `1° 23' 45.67", 2° 34' 56.78"` (degrees, minutes and decimal seconds)
* `1 deg 23' 45.67", 2 deg 34' 56.78"` (using `deg` as degree sign)
* `1° 45.67", 2° 56.78"` (seconds but no minutes)
* `1° 23′ 45.67″, 2° 34′ 56.78″` (Unicode minutes and seconds)
* `1° 23’ 45.67”, 2° 34’ 56.78”` (Unicode quotes for minutes and seconds)
* `-1° 23' 45.67", -2° 34' 56.78"` (negative degrees)
* `1° 23' 45.67" S, 2° 34' 56.78" W` (hemisphere suffix)
* `S 1° 23' 45.67", W 2° 34' 56.78"` (hemisphere prefix)
* `2° 34' 56.78" W 1° 23' 45.67" S` (latitude/longitude switched)

Each of these formats may also contain additional whitespaces in different places.

If you are dealing with yet another format of user input that needs to be parsed, feel free to open an [issue](https://github.com/FacilMap/parse-gps-coordinates/issues) or a [pull request](https://github.com/FacilMap/parse-gps-coordinates/pulls).

## Installation

parse-gps-coordinates is available on [NPM](https://www.npmjs.com/package/parse-gps-coordinates) and can be installed by using `npm install -S parse-gps-coordinates` or `yarn add parse-gps-coordinates`. It is published as an ES module only, so your bundler/environment needs to support ESM. When used in a Node.js CommonJS environment, [dynamic import](https://nodejs.org/api/esm.html#import-statements) needs to be used.

If you want to use parse-gps-coordinates in a static HTML page without using a module bundler (not recommended in production), you need to make sure to import it as a module, for example from esm.sh:
```html
<script type="importmap">
	{
		"imports": {
			"parse-gps-coordinates": "https://esm.sh/parse-gps-coordinates"
		}
	}
</script>
<script type="module">
	import { parseGpsCoordinates } from "parse-gps-coordinates";

	...
</script>
```

## Usage

The library currently exports only one function, [`parseGpsCoordinates()`](#parsegpscoordinates). To use it, import the function and call it with the user-provided coordinate string:

```typescript
import { parseGpsCoordinates } from "parse-gps-coordinates";

const parsedCoordinates = parseGpsCoordinates(input);
```

## API

### `parseGpsCoordinates()`

`parseGpsCoordinates(input: string): ({ lat: number; lon: number; zoom?: number }) | undefined`

Returns the latitude and longitude represented by the provided coordinate string. A negative latitude/longitude is returned for the southern/western hemispheres.

If the input string is not in any supported format, `undefined` is returned.

The `zoom` property is defined only if the input is a geo URI with a zoom parameter.