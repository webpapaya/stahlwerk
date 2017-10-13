import { assertThat, hasProperties, not, hasProperty, throws, number, hasItem } from 'hamjest';
import { factory, trait, sequence, random } from './index';

const createUser = factory({
  id: 1,
  name: 'Peter',
  isDisabled: trait({
    disabledAt: '2000-01-01',
  }),
  knowsGerman: trait({
    language: 'de',
  }),
});

describe('create', () => {
  it('responds correct attributes', () => {
    assertThat(createUser(), hasProperties({ id: 1, name: 'Peter' }));
  });

  it('doesn\'t include traits', () => {
    assertThat(createUser(), not(hasProperty('isDisabled')));
  });

  it('additional properties can be added', () => {
    assertThat(createUser({ additional: 'property' }),
      hasProperties({ additional: 'property' }));
  });

  describe('trait', () => {
    it('are added correctly', () => {
      assertThat(createUser('isDisabled', 'knowsGerman'),
        hasProperties({ id: 1, name: 'Peter', disabledAt: '2000-01-01', language: 'de' }));
    });

    it('throws error on unknown trait', () => {
      assertThat(() => createUser('isDisableddd'), throws());
    });
  });

  describe('sequence', () => {
    it('starts at 1 and the second id is 2', () => {
      const createCompany = factory({ id: sequence() });
      assertThat(createCompany(), hasProperties({ id: 1 }));
      assertThat(createCompany(), hasProperties({ id: 2 }));
    });

    it('accepts a formatter as argument', () => {
      const createCompany = factory({ name: sequence((x) => `name${x}`) });
      assertThat(createCompany(), hasProperties({ name: 'name1' }));
      assertThat(createCompany(), hasProperties({ name: 'name2' }));
    });
  });

  describe('random', () => {
    it('responds a random number', () => {
      const createCompany = factory({ id: random() });
      assertThat(createCompany(), hasProperty('id', number()));
    });

    it('responds one element of the given list', () => {
      const list = ['first', 'second', 'third'];
      const createCompany = factory({ id: random(list) });
      assertThat(list, hasItem(createCompany().id));
    });
  });
});

