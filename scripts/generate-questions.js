const fs = require('fs');
const path = require('path');

// Configuration
const MAX_TABLE = 10; // Generate questions for tables 1-10
const OUTPUT_FILE = path.join(__dirname, '../src/data/questions.json');

// Generate all possible questions
function generateAllQuestions() {
  const allQuestions = [];
  
  // Generate multiplication questions
  for (let tableNumber = 1; tableNumber <= MAX_TABLE; tableNumber++) {
    for (let multiplier = 1; multiplier <= MAX_TABLE; multiplier++) {
      allQuestions.push({
        tableNumber, // Key to identify which table this question belongs to
        number: tableNumber,
        multiplier,
        answer: tableNumber * multiplier,
        type: "multiplication",
        question: `${tableNumber} × ${multiplier} = ?`,
        difficulty: calculateDifficulty(tableNumber, multiplier, "multiplication")
      });
    }
  }
  
  // Generate division questions
  for (let tableNumber = 1; tableNumber <= MAX_TABLE; tableNumber++) {
    for (let multiplier = 1; multiplier <= MAX_TABLE; multiplier++) {
      const dividend = tableNumber * multiplier;
      allQuestions.push({
        tableNumber, // Key to identify which table this question belongs to
        number: dividend,
        divisor: tableNumber,
        answer: multiplier,
        type: "division",
        question: `${dividend} ÷ ${tableNumber} = ?`,
        difficulty: calculateDifficulty(tableNumber, multiplier, "division")
      });
    }
  }
  
  return allQuestions;
}

// Calculate difficulty level (1-5, where 1 is easiest)
function calculateDifficulty(tableNumber, multiplier, type) {
  if (type === "multiplication") {
    // Easy: 1-5 tables
    if (tableNumber <= 5 && multiplier <= 5) return 1;
    // Medium: 6-10 tables
    if (tableNumber <= 10 && multiplier <= 10) return 2;
  } else {
    // Division is generally harder
    if (tableNumber <= 5 && multiplier <= 5) return 2;
    if (tableNumber <= 10 && multiplier <= 10) return 3;
  }
  return 2; // Default medium difficulty
}

// Generate multiple choice options for each question
function generateMultipleChoiceOptions(correctAnswer, questionType) {
  const options = [correctAnswer];
  let attempts = 0;
  const maxAttempts = 100; // Prevent infinite loops
  
  // Generate 3 wrong answers
  while (options.length < 4 && attempts < maxAttempts) {
    attempts++;
    let wrongAnswer;
    
    if (questionType === "multiplication") {
      // For multiplication, wrong answers should be close to correct
      wrongAnswer = correctAnswer + Math.floor(Math.random() * 10) - 5;
    } else {
      // For division, wrong answers should be reasonable divisors
      wrongAnswer = Math.max(1, correctAnswer + Math.floor(Math.random() * 6) - 3);
    }
    
    if (wrongAnswer > 0 && wrongAnswer !== correctAnswer && !options.includes(wrongAnswer)) {
      options.push(wrongAnswer);
    }
  }
  
  // If we couldn't generate enough unique options, fill with simple alternatives
  while (options.length < 4) {
    let fallbackAnswer = correctAnswer + options.length;
    if (fallbackAnswer <= 0) fallbackAnswer = 1;
    if (!options.includes(fallbackAnswer)) {
      options.push(fallbackAnswer);
    } else {
      options.push(fallbackAnswer + 1);
    }
  }
  
  // Shuffle options (Fisher-Yates algorithm)
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  
  return options;
}

// Main execution
function main() {
  console.log('Generating all possible questions for tables 1-10...');
  
  const allQuestions = generateAllQuestions();
  console.log(`Generated ${allQuestions.length} questions`);
  
  // Generate multiple choice options for each question
  console.log('Generating multiple choice options...');
  const questionsWithOptions = allQuestions.map((question, index) => {
    if (index % 50 === 0) {
      console.log(`  Processed ${index}/${allQuestions.length} questions...`);
    }
    return {
      ...question,
      options: generateMultipleChoiceOptions(question.answer, question.type)
    };
  });
  console.log('Multiple choice options generated successfully.');
  
  // Create the data structure
  const questionsData = {
    metadata: {
      totalQuestions: questionsWithOptions.length,
      maxTable: MAX_TABLE,
      generatedAt: new Date().toISOString(),
      version: "2.0.0",
      description: "Multiplication and division questions for tables 1-10 with tableNumber key for filtering"
    },
    questions: questionsWithOptions
  };
  
  // Ensure the directory exists
  const dir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  // Write to file
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(questionsData, null, 2));
  
  console.log(`Questions saved to: ${OUTPUT_FILE}`);
  console.log(`Total questions: ${questionsData.questions.length}`);
  console.log(`Multiplication questions: ${questionsData.questions.filter(q => q.type === 'multiplication').length}`);
  console.log(`Division questions: ${questionsData.questions.filter(q => q.type === 'division').length}`);
  
  // Show table distribution
  console.log('\nQuestions per table:');
  for (let table = 1; table <= MAX_TABLE; table++) {
    const tableQuestions = questionsData.questions.filter(q => q.tableNumber === table);
    const multCount = tableQuestions.filter(q => q.type === 'multiplication').length;
    const divCount = tableQuestions.filter(q => q.type === 'division').length;
    console.log(`  Table ${table}: ${multCount} multiplication + ${divCount} division = ${tableQuestions.length} total`);
  }
  
  // Show some statistics
  const difficulties = questionsData.questions.reduce((acc, q) => {
    acc[q.difficulty] = (acc[q.difficulty] || 0) + 1;
    return acc;
  }, {});
  
  console.log('\nDifficulty distribution:');
  Object.entries(difficulties).forEach(([level, count]) => {
    console.log(`  Level ${level}: ${count} questions`);
  });
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { generateAllQuestions, generateMultipleChoiceOptions, main };
