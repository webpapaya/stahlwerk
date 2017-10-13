import { assertThat, hasProperties, not, hasProperty, throws } from 'hamjest';
import { factory, trait, sequence } from './index';

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

  it('additional properties can be added', () => {
    assertThat(createUser({ additional: 'property' }),
      hasProperties({ additional: 'property' }));
  });

  describe('trait', () => {
    it('are added correctly', () => {
      assertThat(createUser('isDisabled'),
        hasProperties({ id: 1, name: 'Peter', disabledAt: '2000-01-01' }));
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
  });
});

