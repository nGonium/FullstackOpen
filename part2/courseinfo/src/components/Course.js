const Header = ({ course }) => <h1>{course}</h1>

const Total = ({ sum }) => <p>Number of exercises {sum}</p>

const Part = ({ part }) => 
  <p>
    {part.name} {part.exercises}
  </p>

const Content = ({ parts }) => {
  const total = parts.reduce((prev, current) => prev + current.exercises, 0)

  return (
    <>
      {parts.map((part) => <Part key={part.id} part={part} />)}    
      <p><strong>total of {total} exercises</strong></p>
    </>
    )
}
const Course = ({ course }) => 
    <>
      <Header course={course.name} />
      <Content parts={course.parts} />
    </>

export default Course