import { assertThat, hasProperties, not, hasProperty } from 'hamjest';
import { factory, trait } from './index';

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


