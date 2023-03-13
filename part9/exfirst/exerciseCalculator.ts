// import { getArgs, isArrayContainsNan, mapArrayToNumbers } from './utils';

interface ExerciseResult {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

export function calculateExercises(
  dailyExerciseHours: number[],
  targetAverageExerciseHours: number
): ExerciseResult {
  const averageDailyExerciseHours =
    dailyExerciseHours.reduce((sum, current) => sum + current, 0) /
    dailyExerciseHours.length;
  const differenceInHours =
    targetAverageExerciseHours - averageDailyExerciseHours;

  const [rating, ratingDescription] =
    differenceInHours < 0
      ? [1, 'did not meet target']
      : differenceInHours < 2
      ? [2, 'not too bad but could be better']
      : [3, 'well done, greatly exceeded target hours'];

  return {
    periodLength: dailyExerciseHours.length,
    trainingDays: dailyExerciseHours.filter((deh) => deh > 0).length,
    success: averageDailyExerciseHours > targetAverageExerciseHours,
    rating,
    ratingDescription,
    target: targetAverageExerciseHours,
    average: averageDailyExerciseHours,
  };
}

// function startCalculateExercises(): void {
//   const args = getArgs();
//   if (args.length < 2)
//     throw Error(
//       `Incorrect number of arguments (expected >=2, received ${args.length}`
//     );
//   const argsNumberMap = mapArrayToNumbers(args);
//   if (isArrayContainsNan(argsNumberMap))
//     throw Error('arguments could not be cast to a number');
//   const [targetAverageExerciseHours, ...dailyExerciseHours] = argsNumberMap;

//   console.log(
//     calculateExercises(dailyExerciseHours, targetAverageExerciseHours)
//   );
// }

// startCalculateExercises();
