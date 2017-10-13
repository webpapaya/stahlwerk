import { assertThat, hasProperties, not, hasProperty } from 'hamjest';

const factory = (definition) => () => definition;
const trait = (definition) => {
  const fn = () => definition;
  fn.__isTrait = true;
  return fn;
};

const create = (factoryFn, ...args) => {
  const definition = factoryFn();
  const definitionWithoutTraits = Object.keys(definition).reduce((result, key) => {
    if (typeof definition[key] === 'function' && definition[key].__isTrait) { return result; }
    result[key] = definition[key];
    return result;
  }, {});

  return args.reduce((result, arg) => Object.assign(
    result,
    definition[arg](),
  ), definitionWithoutTraits);
};


const userFactory = factory({
  id: 1,
  name: 'Peter',
  isDisabled: trait({
    disabledAt: '2000-01-01',
  }),
});

describe('create', () => {
  it('responds correct attributes', () => {
    assertThat(create(userFactory), hasProperties({ id: 1, name: 'Peter' }));
  });

  it('doesn\'t include traits', () => {
    assertThat(create(userFactory), not(hasProperty('isDisabled')));
  });

  it('trait works as well', () => {
    assertThat(create(userFactory, 'isDisabled'),
      hasProperties({ id: 1, name: 'Peter', disabledAt: '2000-01-01' }));
  });
});


