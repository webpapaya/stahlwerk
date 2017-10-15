# Stahlwerk

Stahlwerk is a factory library similar to factory girl. It uses a simple
API and supports traits.

# API

```js
const createUser = factory({
  id: sequence(), // increments automatically
  street: sequence((number) => `Park Street ${number}`),
  name: random([
    'Peter',
    'Maria',
    'Charles',
  ]), // choses one of the given list
  disabledAt: undefined,
  isDisabled: trait({
    disabledAt: '2000-01-01',
  }),
});

const enabledUser = createUser();
// => { id: 1, street: 'Park Street 1', name: 'Peter', disabledAt: undefined };

const disabledUser = createUser('isDisabled');
// => { id: 2, street: 'Park Street 2', name: 'Charles', disabledAt: '2000-01-01' };

const disabledUser = createUser('isDisabled', { name: 'Mike' });
// => { id: 3, street: 'Park Street 3', name: 'Mike', disabledAt: '2000-01-01' };
```

