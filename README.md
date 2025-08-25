# Multiplication Table Web App

A beautiful and interactive multiplication table web application built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Multiple Number Selection**: Choose multiple numbers from 1-12 to create comprehensive practice sessions
- **Two Learning Modes**:
  - **View Mode**: See complete multiplication tables for selected numbers
  - **Practice Mode**: Test your knowledge with customizable question sets
- **Three Question Types**:
  - **Multiplication**: Traditional multiplication questions (e.g., 7 × 8 = ?)
  - **Division**: Division questions based on multiplication facts (e.g., 56 ÷ 7 = ?)
  - **Mixed**: Combination of both multiplication and division questions
- **Multiple Choice Questions**: Toggle between text input and multiple choice formats
- **Dynamic Question Generation**: Generate practice questions from selected numbers (up to 288 questions with mixed mode)
- **Real-time Feedback**: Get immediate feedback on correct/incorrect answers
- **Score Tracking**: Track your performance with percentage scores
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Dark Mode Support**: Automatically adapts to your system preferences
- **Beautiful UI**: Modern, clean design with smooth animations

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd multiplication-table
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## How to Use

### 1. **Select Numbers**
- Click on any numbers from 1-12 to select them
- Multiple selection is supported - you can choose several numbers at once
- Selected numbers are highlighted and displayed below the selection grid

### 2. **Toggle Modes**
- **Show/Hide Answers**: Reveal or hide the correct answers
- **View Mode**: See complete multiplication tables for selected numbers
- **Practice Mode**: Generate practice questions from selected numbers

### 3. **Practice Mode Features**
- **Question Type Selection**: Choose between Multiplication, Division, or Mixed questions
- **Generate Questions**: Create practice questions from your selected numbers
- **Question Count**: 
  - Multiplication/Division: selected numbers × 12 questions
  - Mixed: selected numbers × 24 questions (12 multiplication + 12 division)
- **Multiple Choice**: Toggle between text input and multiple choice formats
- **Answer Checking**: Check your answers to see your score
- **Progress Tracking**: View your score as both count and percentage

### 4. **Question Types Explained**
- **Multiplication**: Standard multiplication facts (e.g., 7 × 8 = 56)
- **Division**: Division problems using multiplication facts (e.g., 56 ÷ 7 = 8)
- **Mixed**: Random combination of both types for comprehensive practice

### 5. **Multiple Choice Mode**
- Each question presents 4 options (1 correct, 3 incorrect)
- Wrong answers are intelligently generated:
  - **Multiplication**: Close to the correct answer for realistic practice
  - **Division**: Reasonable divisor values near the correct answer
- Click on your chosen answer to select it
- Visual feedback shows correct/incorrect selections

## Technology Stack

- **Frontend Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks (useState)
- **Font**: Inter (Google Fonts)

## Project Structure

```
src/
├── app/
│   ├── globals.css      # Global styles and Tailwind imports
│   ├── layout.tsx       # Root layout component
│   └── page.tsx         # Main page component
├── components/
│   └── MultiplicationTable.tsx  # Main multiplication table component
```

## Customization

- **Table Range**: Modify the `numbers` array in `MultiplicationTable.tsx` to change the range (currently 1-12)
- **Question Generation**: Adjust the question generation logic for different difficulty levels
- **Multiple Choice Options**: Customize how wrong answers are generated for each question type
- **Styling**: Customize colors and themes in `tailwind.config.js` and `globals.css`
- **Features**: Add new features like timed quizzes, difficulty levels, or sound effects

## Contributing

Feel free to submit issues, feature requests, or pull requests to improve the application.

## License

This project is open source and available under the [MIT License](LICENSE).
