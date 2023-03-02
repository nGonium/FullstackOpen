import { CoursePart } from '../types';
import Part from './Part';

interface ContentProps {
  courseParts: CoursePart[];
}

const Content = ({ courseParts }: ContentProps): JSX.Element => {
  return (
    <>
      {courseParts.map((part, idx) => (
        <Part part={part} key={idx} />
      ))}
    </>
  );
};

export default Content;
