interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface CoursePartBaseWithDescription extends CoursePartBase {
  description: string;
}

interface CoursePartBasic extends CoursePartBaseWithDescription {
  kind: 'basic';
}

interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: 'group';
}

interface CoursePartBackround extends CoursePartBaseWithDescription {
  backroundMaterial: string;
  kind: 'background';
}

export type CoursePart =
  | CoursePartBasic
  | CoursePartGroup
  | CoursePartBackround;
