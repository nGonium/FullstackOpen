/*
 *   Maintained for reference - not used
 */
// import { Entry, EntryType } from './types'

// const throwIfIncorrectType = (type: string, x: unknown, name?: string) => {
//   if (typeof x !== type) {
//     throw new Error(
//       `${name || 'parameter'} of invalid type ${typeof x}, expected string`
//     );
//   }
// };

// function assertString(x: unknown, name?: string): asserts x is string {
//   throwIfIncorrectType('string', x, name);
// }

// function assertNumber(x: unknown, name?: string): asserts x is number {
//   throwIfIncorrectType('number', x, name);
// }

// function assertObject(x: unknown, name?: string): asserts x is object {
//   throwIfIncorrectType('object', x, name);
// }

// const parseDate = (x: unknown, name?: string = 'date') => {
//   assertString(x, name);
//   if (Number.isNaN(Date.parse(x))) {
//     throw new Error(`${name || 'parameter'} value invalid: ${x}`);
//   }
// };

// const parseType = (x: unknown, name?: string = 'type') => {
//   assertString(x, name)
//   if (!Object.values<string>(EntryType).includes(x)) {
//     throw new Error(`${name || 'parameter'} value invalid: ${x}`)
//   }
// }

// const newEntryParsers = {
//   type: parseType,
//   date: parseDate,
// };
