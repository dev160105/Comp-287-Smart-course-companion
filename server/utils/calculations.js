/**
 * Server-side grade and GPA calculation utilities.
 * All calculations happen here per project requirement.
 */

/**
 * Calculate percentage score for an assessment
 */
const calculatePercentage = (score, maxPoints) => {
  if (maxPoints === 0) return 0;
  return Math.round((score / maxPoints) * 100 * 10) / 10;
};

/**
 * Convert a percentage to a letter grade
 */
const percentageToLetterGrade = (percentage) => {
  if (percentage >= 97) return 'A+';
  if (percentage >= 93) return 'A';
  if (percentage >= 90) return 'A-';
  if (percentage >= 87) return 'B+';
  if (percentage >= 83) return 'B';
  if (percentage >= 80) return 'B-';
  if (percentage >= 77) return 'C+';
  if (percentage >= 73) return 'C';
  if (percentage >= 70) return 'C-';
  if (percentage >= 67) return 'D+';
  if (percentage >= 63) return 'D';
  if (percentage >= 60) return 'D-';
  return 'F';
};

/**
 * Convert a letter grade to GPA points
 */
const letterGradeToGPA = (letterGrade) => {
  const gradeMap = {
    'A+': 4.0, 'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D+': 1.3, 'D': 1.0, 'D-': 0.7,
    'F': 0.0,
  };
  return gradeMap[letterGrade] ?? 0.0;
};

/**
 * Calculate the average score across a set of grades for a course.
 * grades: array of { score, maxPoints }
 * Returns { percentage, letterGrade, gpaPoints }
 */
const calculateCourseAverage = (grades) => {
  if (!grades || grades.length === 0) {
    return { percentage: 0, letterGrade: 'N/A', gpaPoints: 0 };
  }

  const totalEarned = grades.reduce((sum, g) => sum + g.score, 0);
  const totalMax = grades.reduce((sum, g) => sum + g.maxPoints, 0);

  if (totalMax === 0) return { percentage: 0, letterGrade: 'N/A', gpaPoints: 0 };

  const percentage = calculatePercentage(totalEarned, totalMax);
  const letterGrade = percentageToLetterGrade(percentage);
  const gpaPoints = letterGradeToGPA(letterGrade);

  return { percentage, letterGrade, gpaPoints };
};

/**
 * Calculate overall GPA from an array of course results.
 * courseResults: array of { credits, gpaPoints }
 * Uses weighted GPA (credits × grade points / total credits)
 */
const calculateGPA = (courseResults) => {
  if (!courseResults || courseResults.length === 0) return 0;

  const totalCredits = courseResults.reduce((sum, c) => sum + c.credits, 0);
  if (totalCredits === 0) return 0;

  const weightedSum = courseResults.reduce(
    (sum, c) => sum + c.credits * c.gpaPoints,
    0
  );

  return Math.round((weightedSum / totalCredits) * 100) / 100;
};

module.exports = {
  calculatePercentage,
  percentageToLetterGrade,
  letterGradeToGPA,
  calculateCourseAverage,
  calculateGPA,
};
