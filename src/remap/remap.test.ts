import { remap } from './remap';

describe('remap()', () => {
    it('remaps an object with one value', () => {
        const obj = { foo: 7 };
        const map = [
            ['foo', 'bar']
        ] as const;
        const newObj = remap(obj, map);
        expect(newObj).toEqual({ bar: 7 });
    });

    it('uses a remap function', () => {
        const obj = { foo: 7 };
        const map = [
            ['foo', 'bar', (val: number) => val * 2]
        ] as const;
        const newObj = remap(obj, map);
        expect(newObj).toEqual({ bar: 14 });
    });

    it('remaps through multiple levels', () => {
        const obj = { foo: {
            bar: 5
        }};
        const map = [
            ['foo.bar', 'baz']
        ] as const;
        const newObj = remap(obj, map);
        expect(newObj).toEqual({ baz: 5 });
    });

    it('When the original key is blank, it passes the whole object to the value function', () => {
        const obj = { foo: 7, bar: 3 };
        const fn = jest.fn((val: typeof obj) => {
            return val.foo + val.bar
        });
        const map = [
            ['', 'foo', fn]
        ] as const;
        const newObj = remap(obj, map);
        expect(newObj).toEqual({ foo: 10 });
        expect(fn).toHaveBeenCalledWith(obj);
    });

    it('creates arrays when .# is used', () => {
        const obj = { foo: 1, bar: 2, baz: 7 };
        const map = [
            ['foo', 'foo.0'],
            ['bar', 'foo.1'],
            ['baz', 'foo.2']
        ] as const;
        const newObj = remap(obj, map);
        expect(newObj).toEqual({ foo: [1, 2, 7] });
    })
})
