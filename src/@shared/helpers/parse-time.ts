export function parseTime(timeInStr: string): number {
	const scales = {
		d: 60 * 60 * 24,
		h: 60 * 60,
		m: 60,
		s: 1,
	};

	const scale = timeInStr.replace(/\d+/, '');
	const time = Number(timeInStr.replace(/[dhms]/, ''));

	if (isNaN(time)) {
		throw new Error('invalid time to parse');
	}

	const timeInS = time * scales[scale];
	return timeInS;
}
