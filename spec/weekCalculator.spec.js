var WeekCalculator = require("../util/weekCalculator.js");

describe("WeekCalculator", function() {
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
	it("subtracts week correctly", function() {
		expect(WeekCalculator.subtract(new Date(2016, 0, 11), 1, 2)).toBe(201553);
		expect(WeekCalculator.subtract(new Date(2016, 0, 11), 1, 0)).toBe(201602);
	});

});
