export const subjectLabels = {
  math: 'Mathematical Reasoning',
  rla: 'Reasoning Through Language Arts',
  science: 'Science',
  social_studies: 'Social Studies',
} as const;

export type SubjectId = keyof typeof subjectLabels;
