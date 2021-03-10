export const getSec = (count: number): number => 1000 * count;

export const getMin = (count: number): number => getSec(60) * count;

export const getHour = (count: number): number => getMin(60) * count;

export const getDay = (count: number): number => getHour(24) * count;
