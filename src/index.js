export const factory = (definition) => (...args) => {
  const definitionWithoutTraits = Object.keys(definition).reduce((result, key) => {
    if (isTrait(definition[key])) { return result; }
    if (isSequence(definition[key])) {
      result[key] = definition[key]();
      return result;
    }
    result[key] = definition[key];
    return result;
  }, {});

  return args.reduce((result, arg) => Object.assign(
    result,
    isFunction(definition[arg]) ? definition[arg]() : arg,
  ), definitionWithoutTraits);
};

export const trait = (definition) => {
  const fn = () => definition;
  fn.__isTrait = true;
  return fn;
};

export const sequence = () => {
  let count = 0;
  const fn = () => count += 1;
  fn.__isSequence = true;
  return fn;
};

const isFunction = (probablyFunction) =>
  typeof probablyFunction === 'function';

const isTrait = (probablyTrait) =>
  isFunction(probablyTrait) && probablyTrait.__isTrait;

const isSequence = (probablySequence) =>
  isFunction(probablySequence) && probablySequence.__isSequence;

