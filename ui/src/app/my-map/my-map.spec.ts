import { kilometresAlongShannon } from './my-map';

describe('kilometresAlongShannon', () => {
  it('converts metres to kilometres on the first length', () => {
    expect(kilometresAlongShannon(150_000, 360)).toBe(150);
  });

  it('restarts from the source after each full length', () => {
    expect(kilometresAlongShannon(400_000, 360)).toBe(40);
    expect(kilometresAlongShannon(730_000, 360)).toBe(10);
  });
});
