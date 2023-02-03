export function createDate(dateStr: string): Date {
	const date = new Date(dateStr);
	if (isNaN(date.getTime())) return new Date();
	return date;
}
