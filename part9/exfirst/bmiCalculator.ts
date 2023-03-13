// import { getArgs, isArrayContainsNan, mapArrayToNumbers } from './utils';

export const calculateBmi = (height: number, mass: number): string => {
  if (height === 0) throw Error('height must not be zero');
  const bmi = mass / (height / 100) ** 2;
  if (bmi < 18.5) return 'underweight';
  if (bmi < 24.9) return 'normal weight';
  if (bmi < 29.9) return 'overweight';
  return 'obese';
};

// function start(): void {
//   const args = getArgs();
//   if (args.length !== 2)
//     throw Error(
//       `Incorrect number of arguments (expected 2, received ${args.length}`
//     );
//   const [height, weight] = mapArrayToNumbers(args);
//   if (isArrayContainsNan([height, weight]))
//     throw Error('arguments could not be cast to a number');
//   console.log(calculateBmi(height, weight));
// }

// start();
