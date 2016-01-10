var WeekCalculator = require("../util/weekCalculator.js");

describe("WeekCalculator compute", function() {
	it("calculates week correctly with monday basis", function() {
		expect(WeekCalculator.compute(new Date(2015,11,30), 1)).toBe(201553);
		expect(WeekCalculator.compute(new Date(2016,0,1), 1)).toBe(201553);
		expect(WeekCalculator.compute(new Date(2016, 0, 3), 1)).toBe(201553);

		expect(WeekCalculator.compute(new Date(2016, 0, 4), 1)).toBe(201601);
		expect(WeekCalculator.compute(new Date(2016, 0, 10), 1)).toBe(201601);

		expect(WeekCalculator.compute(new Date(2016, 0, 11), 1)).toBe(201602);
	});
	it("calculates week correctly with sunday basis", function() {
		expect(WeekCalculator.compute(new Date(2016, 0, 3), 7)).toBe(201553);
		expect(WeekCalculator.compute(new Date(2016, 0, 4), 7)).toBe(201553);
	});
	it("calculates week correctly with tuesday basis", function() {
		expect(WeekCalculator.compute(new Date(2016, 0, 4), 2)).toBe(201553);
		expect(WeekCalculator.compute(new Date(2016, 0, 5), 2)).toBe(201601);
		expect(WeekCalculator.compute(new Date(2016, 0, 6), 2)).toBe(201601);
	});
	it("calculates week correctly with friday basis", function() {
		expect(WeekCalculator.compute(new Date(2016, 0, 7), 5)).toBe(201553);
		expect(WeekCalculator.compute(new Date(2016, 0, 8), 5)).toBe(201601);
		expect(WeekCalculator.compute(new Date(2016, 0, 14), 5)).toBe(201601);
		expect(WeekCalculator.compute(new Date(2016, 0, 15), 5)).toBe(201602);
	});
});
describe("WeekCalculator computePrev", function() {
	it("calculates week correctly with monday basis", function() {
		expect(WeekCalculator.computePrev(new Date(2015,11,30), 1)).toBe(201552);
		expect(WeekCalculator.computePrev(new Date(2016,0,1), 1)).toBe(201552);
		expect(WeekCalculator.computePrev(new Date(2016, 0, 3), 1)).toBe(201552);

		expect(WeekCalculator.computePrev(new Date(2016, 0, 4), 1)).toBe(201553);
		expect(WeekCalculator.computePrev(new Date(2016, 0, 10), 1)).toBe(201553);

		expect(WeekCalculator.computePrev(new Date(2016, 0, 11), 1)).toBe(201601);
	});
	it("calculates week correctly with sunday basis", function() {
		expect(WeekCalculator.computePrev(new Date(2016, 0, 3), 7)).toBe(201552);
		expect(WeekCalculator.computePrev(new Date(2016, 0, 4), 7)).toBe(201552);
	});
	it("calculates week correctly with tuesday basis", function() {
		expect(WeekCalculator.computePrev(new Date(2016, 0, 4), 2)).toBe(201552);
		expect(WeekCalculator.computePrev(new Date(2016, 0, 5), 2)).toBe(201553);
		expect(WeekCalculator.computePrev(new Date(2016, 0, 6), 2)).toBe(201553);
	});
	it("calculates week correctly with friday basis", function() {
		expect(WeekCalculator.computePrev(new Date(2016, 0, 7), 5)).toBe(201552);
		expect(WeekCalculator.computePrev(new Date(2016, 0, 8), 5)).toBe(201553);
		expect(WeekCalculator.computePrev(new Date(2016, 0, 14), 5)).toBe(201553);
		expect(WeekCalculator.computePrev(new Date(2016, 0, 15), 5)).toBe(201601);
	});
});
describe("subtract", function() {
	it("subtracts week correctly with monday basis", function() {
		expect(WeekCalculator.subtract(new Date(2016, 0, 11), 1, 2)).toBe(201553);
		expect(WeekCalculator.subtract(new Date(2016, 0, 11), 1, 0)).toBe(201602);
	});
	it("subtracts week correctly with sunday basis", function() {
		expect(WeekCalculator.subtract(new Date(2016, 0, 11), 7, 2)).toBe(201552);
		expect(WeekCalculator.subtract(new Date(2016, 0, 11), 7, 1)).toBe(201553);
		expect(WeekCalculator.subtract(new Date(2016, 0, 11), 7, 0)).toBe(201601);
	});
});
describe("week start", function() {
	it("gets correctly for monday basis", function() {
		expect(WeekCalculator.getStartOfWeek(new Date(2016, 0, 4), 1)).toEqual(new Date(2016, 0, 4, 9));
		expect(WeekCalculator.getStartOfWeek(new Date(2016, 0, 7), 1)).toEqual(new Date(2016, 0, 4, 9));
		expect(WeekCalculator.getStartOfWeek(new Date(2016, 0, 10), 1)).toEqual(new Date(2016, 0, 4, 9));
	});
	it("gets correctly for wednesday basis", function() {
		expect(WeekCalculator.getStartOfWeek(new Date(2016, 0, 6), 3)).toEqual(new Date(2016, 0, 6, 9));
		expect(WeekCalculator.getStartOfWeek(new Date(2016, 0, 9), 3)).toEqual(new Date(2016, 0, 6, 9));
		expect(WeekCalculator.getStartOfWeek(new Date(2016, 0, 12), 3)).toEqual(new Date(2016, 0, 6, 9));
	});
	it("gets correctly for sunday basis", function() {
		expect(WeekCalculator.getStartOfWeek(new Date(2016, 0, 3), 7)).toEqual(new Date(2016, 0, 3, 9));
		expect(WeekCalculator.getStartOfWeek(new Date(2016, 0, 6), 7)).toEqual(new Date(2016, 0, 3, 9));
		expect(WeekCalculator.getStartOfWeek(new Date(2016, 0, 9), 7)).toEqual(new Date(2016, 0, 3, 9));
	});
});
describe("week end", function() {
	it("gets correctly for monday basis", function() {
		expect(WeekCalculator.getEndOfWeek(new Date(2016, 0, 4), 1)).toEqual(new Date(2016, 0, 10, 9));
		expect(WeekCalculator.getEndOfWeek(new Date(2016, 0, 7), 1)).toEqual(new Date(2016, 0, 10, 9));
		expect(WeekCalculator.getEndOfWeek(new Date(2016, 0, 10), 1)).toEqual(new Date(2016, 0, 10, 9));
	});
	it("gets correctly for wednesday basis", function() {
		expect(WeekCalculator.getEndOfWeek(new Date(2016, 0, 6), 3)).toEqual(new Date(2016, 0, 12, 9));
		expect(WeekCalculator.getEndOfWeek(new Date(2016, 0, 9), 3)).toEqual(new Date(2016, 0, 12, 9));
		expect(WeekCalculator.getEndOfWeek(new Date(2016, 0, 12), 3)).toEqual(new Date(2016, 0, 12, 9));
	});
	it("gets correctly for sunday basis", function() {
		expect(WeekCalculator.getEndOfWeek(new Date(2016, 0, 3), 7)).toEqual(new Date(2016, 0, 9, 9));
		expect(WeekCalculator.getEndOfWeek(new Date(2016, 0, 6), 7)).toEqual(new Date(2016, 0, 9, 9));
		expect(WeekCalculator.getEndOfWeek(new Date(2016, 0, 9), 7)).toEqual(new Date(2016, 0, 9, 9));
	});
});
