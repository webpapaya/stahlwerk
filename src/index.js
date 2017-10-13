export const factory = (definition) => (...args) => {
  const definitionWithoutTraits = removeTraitsFromDefinition(definition);

  return args.reduce((result, arg) => {
    if (isString(arg) && !isTrait(definition[arg])) { throw new Error('Unknown trait'); }
    return Object.assign(result, isFunction(definition[arg]) ? definition[arg]() : arg);
  }, definitionWithoutTraits);
};

export const trait = (definition) => {
  const fn = () => definition;
  fn.__isTrait = true;
  return fn;
};

export const sequence = (formatter = (x) => x) => {
  let count = 0;
  const fn = () => {
    count += 1;
    return formatter(count);
  };
  fn.__isSequence = true;
  return fn;
};

const removeTraitsFromDefinition = (definition) => {
  return Object.keys(definition).reduce((result, key) => {
    if (isTrait(definition[key])) {
      return result;
    }

    if (isSequence(definition[key])) {
      return addToObject(result, key, definition[key]());
    }

    return addToObject(result, key, definition[key]);
  }, {});
};

const addToObject = (object, key, value) => {
  object[key] = value; // eslint-disable-line no-param-reassign
  return object;
};

const isString = (probablyString) =>
  typeof probablyString === 'string';

const isFunction = (probablyFunction) =>
  typeof probablyFunction === 'function';

const isTrait = (probablyTrait) =>
  isFunction(probablyTrait) && probablyTrait.__isTrait;

const isSequence = (probablySequence) =>
  isFunction(probablySequence) && probablySequence.__isSequence;

