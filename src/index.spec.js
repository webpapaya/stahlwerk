import { assertThat, hasProperties, not, hasProperty } from 'hamjest';

const factory = (definition) => (...args) => {
  const definitionWithoutTraits = Object.keys(definition).reduce((result, key) => {
    if (isTrait(definition[key])) { return result; }
    result[key] = definition[key];
    return result;
  }, {});

  return args.reduce((result, arg) => Object.assign(
    result,
    isFunction(definition[arg]) ? definition[arg]() : arg,
  ), definitionWithoutTraits);
};

const isFunction = (probablyFunction) =>
  typeof probablyFunction === 'function';

const isTrait = (probablyTrait) =>
  isFunction(probablyTrait) && probablyTrait.__isTrait;

const trait = (definition) => {
  const fn = () => definition;
  fn.__isTrait = true;
  return fn;
};

const createUser = factory({
  id: 1,
  name: 'Peter',
  isDisabled: trait({
    disabledAt: '2000-01-01',
  }),
});

describe('create', () => {
  it('responds correct attributes', () => {
    assertThat(createUser(), hasProperties({ id: 1, name: 'Peter' }));
  });

  it('doesn\'t include traits', () => {
    assertThat(createUser(), not(hasProperty('isDisabled')));
  });

  it('trait are added correctly', () => {
    assertThat(createUser('isDisabled'),
      hasProperties({ id: 1, name: 'Peter', disabledAt: '2000-01-01' }));
  });

  it('additional properties can be added', () => {
    assertThat(createUser({ additional: 'property' }),
      hasProperties({ additional: 'property' }));
  });
});


