import express from 'express';
import { calculateBmi } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';
const app = express();

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);
  if (isNaN(height) || isNaN(weight))
    return res.status(400).send({ error: 'malformatted parameters' });
  return res.send({
    weight,
    height,
    bmi: calculateBmi(height, weight),
  });
});

app.use(express.json());
app.post('/exercises', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body;
  if (daily_exercises === undefined || target === undefined) {
    res.status(400).send({ error: 'parameters missing' });
    return;
  }

  if (!Array.isArray(daily_exercises)) {
    res.status(400).send({ error: 'malformatted parameters' });
    return;
  }

  if (
    typeof target !== 'number' ||
    daily_exercises.findIndex(
      (el) => typeof el !== 'number' || Number.isNaN(el)
    ) > -1
  ) {
    res.status(400).send({ error: 'malformatted parameters' });
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const result = calculateExercises(daily_exercises, target);
  res.send(result);
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Server: http://localhost:${PORT}`);
});
