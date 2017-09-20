const pizza = require('./index');

describe('pizza()', () => {
	it('should work please', () => {
		const result = pizza(1);
		expect(result).toBe(2);
	});
});
