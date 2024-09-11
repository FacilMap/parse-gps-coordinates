const lonLatRegexp = (() => {
	const number = `[-\u2212]?\\s*\\d+([.,]\\d+)?`;

	const getCoordinate = (n: number) => (
		`(` +
			`(?<hemispherePrefix${n}>[NWSE])` +
		`)?(` +
			`(?<degrees${n}>${number})` +
			`(\\s*[°]\\s*|\\s*deg\\s*|\\s+|$|(?!\\d))` +
		`)(` +
			`(?<minutes${n}>${number})` +
			`(\\s*['\u2032\u2019]\\s*)` +
		`)?(` +
			`(?<seconds${n}>${number})` +
			`(\\s*["\u2033\u201d]\\s*)` +
		`)?(` +
			`(?<hemisphereSuffix${n}>[NWSE])` +
		`)?`
	);

	const coords = (
		`(geo\\s*:\\s*)?` +
		`\\s*` +
		getCoordinate(1) +
		`(?<separator>\\s*[,;]\\s*|\\s+)` +
		getCoordinate(2) +
		`(\\?z=(?<zoom>\\d+))?`
	);

	return new RegExp(`^\\s*${coords}\\s*$`, "i");
})();

export function parseGpsCoordinates(input: string): ({ lat: number; lon: number; zoom?: number }) | undefined {
	const m = lonLatRegexp.exec(input);

	const prepareNumber = (str: string) => Number(str.replace(",", ".").replace("\u2212", "-").replace(/\s+/, ""));
	const prepareCoords = (deg: string, min: string | undefined, sec: string | undefined, hem: string | undefined) => {
		const degrees = prepareNumber(deg);
		const result = Math.abs(degrees) + (min ? prepareNumber(min) / 60 : 0) + (sec ? prepareNumber(sec) / 3600 : 0);
		return result * (degrees < 0 ? -1 : 1) * (hem && ["s", "S", "w", "W"].includes(hem) ? -1 : 1);
	};

	if (m) {
		const { hemispherePrefix1, degrees1, minutes1, seconds1, hemisphereSuffix1, separator, hemispherePrefix2, degrees2, minutes2, seconds2, hemisphereSuffix2, zoom } = m.groups!;

		let hemisphere1: string | undefined = undefined, hemisphere2: string | undefined = undefined;
		if (hemispherePrefix1 && !hemisphereSuffix1 && hemispherePrefix2 && !hemisphereSuffix2) {
			[hemisphere1, hemisphere2] = [hemispherePrefix1, hemispherePrefix2];
		} else if (!hemispherePrefix1 && hemisphereSuffix1 && !hemispherePrefix2 && hemisphereSuffix2) {
			[hemisphere1, hemisphere2] = [hemisphereSuffix1, hemisphereSuffix2];
		} else if (hemispherePrefix1 && hemisphereSuffix1 && !hemispherePrefix2 && !hemisphereSuffix2 && !separator.trim()) {
			// Coordinate 2 has a hemisphere prefix, but because the two coordinates are separated by whitespace only, it was matched as a coordinate 1 suffix
			[hemisphere1, hemisphere2] = [hemispherePrefix1, hemisphereSuffix1];
		} else if (hemispherePrefix1 || hemisphereSuffix1 || hemispherePrefix2 || hemisphereSuffix2) {
			// Unsupported combination of hemisphere prefixes/suffixes
			return undefined;
		} // else: no hemispheres specified

		const coordinate1 = prepareCoords(degrees1, minutes1, seconds1, hemisphere1);
		const coordinate2 = prepareCoords(degrees2, minutes2, seconds2, hemisphere2);
		const zoomNumber = zoom ? Number(zoom) : undefined;
		const zoomObj = zoomNumber != null && isFinite(zoomNumber) ? { zoom: zoomNumber } : {};

		// Handle cases where lat/lon are switched
		if ([undefined, "n", "N", "s", "S"].includes(hemisphere1) && [undefined, "w", "W", "e", "E"].includes(hemisphere2)) {
			return { lat: coordinate1, lon: coordinate2, ...zoomObj };
		} else if ((["w", "W", "e", "E"] as Array<string | undefined>).includes(hemisphere1) && [undefined, "n", "N", "s", "S"].includes(hemisphere2)) {
			return { lat: coordinate2, lon: coordinate1, ...zoomObj };
		}
	}
}
