const pizza = require('./index');

describe('pizza()', () => {
	it('should work please', () => {
		const result = pizza(42);
		expect(result).toBeTruthy();
	});
});
