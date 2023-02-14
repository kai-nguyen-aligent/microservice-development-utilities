import ensurePropertiesDefined from './ensurePropertiesDefined';

interface Foo {
  bar?: number;
  baz?: boolean;
  qux?: string;
}

describe('verifyDefined', () => {
  it('should return the object as-is when checks are met', () => {
    const obj: Foo = {
      bar: 7,
      baz: true
    };

    const { bar, baz, qux } = ensurePropertiesDefined(obj, 'bar', 'baz') as any;

    expect(bar).toBe(7);
    expect(baz).toBe(true);
    expect(qux).toBeUndefined();
  });

  it('should throw an error if a property is missing', () => {
    const obj: Foo = {
      bar: 7,
      baz: true
    };

    try {
      expect(ensurePropertiesDefined(obj, 'qux')).toThrow();
    } catch (ex) {
      expect(ex).toBeTruthy();
    }
  });

  it('should list the missing properties when it errors', () => {
    const obj: Foo = {
      bar: 7,
    };

    try {
      ensurePropertiesDefined(obj, 'qux', 'baz', 'bar');
    } catch (ex) {
      expect(ex.message).toContain('qux');
      expect(ex.message).toContain('baz');
    }
  });

  it('should still return true if the values are defined but falsey', () => {
    const obj: Foo = {
      bar: 0,
      baz: false,
      qux: ''
    };

    const { bar, baz, qux } = ensurePropertiesDefined(obj, 'bar', 'baz', 'qux');
    expect(bar).toBe(0);
    expect(baz).toBe(false);
    expect(qux).toBe('');
  });
});
