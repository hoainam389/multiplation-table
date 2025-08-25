# Multiplication Table Components

This directory contains the refactored multiplication table application, broken down into smaller, more maintainable components.

## 🏗️ **Component Structure**

### **Core Components**
- **`MultiplicationTable.tsx`** - Main component that orchestrates all other components
- **`useMultiplicationTable.ts`** - Custom hook containing all business logic and state management

### **UI Components**
- **`NumberSelector.tsx`** - Handles number selection for multiplication tables
- **`ModeToggle.tsx`** - Controls practice mode and question type selection
- **`PracticeControls.tsx`** - Practice mode controls and question generation
- **`QuestionDisplay.tsx`** - Displays individual questions and answer options
- **`ResultsSummary.tsx`** - Shows final results and practice completion
- **`TableView.tsx`** - Displays multiplication tables in view mode

### **Supporting Files**
- **`types.ts`** - TypeScript interfaces and type definitions
- **`index.ts`** - Barrel export file for clean imports

## 🎯 **Benefits of This Structure**

### **1. Separation of Concerns**
- **Business Logic**: All state management and business logic is in the custom hook
- **UI Components**: Each component focuses on a specific UI responsibility
- **Types**: Centralized type definitions for better consistency

### **2. Improved Maintainability**
- **Smaller Files**: Each component is focused and easier to understand
- **Reusable Components**: Components can be easily reused or modified
- **Clear Dependencies**: Each component has clear props and responsibilities

### **3. Better Performance**
- **Optimized Rendering**: Components only re-render when their specific props change
- **Memoized Logic**: Expensive calculations are memoized in the custom hook
- **Memory Leak Prevention**: Proper cleanup of timers and resources

### **4. Enhanced Developer Experience**
- **Easier Testing**: Individual components can be tested in isolation
- **Better Debugging**: Issues can be isolated to specific components
- **Cleaner Code**: Each file has a single, clear responsibility

## 🔧 **Usage**

### **Importing Components**
```typescript
// Import individual components
import { NumberSelector, ModeToggle } from './components';

// Import the main component
import { MultiplicationTable } from './components';

// Import types
import { Question, QuestionType } from './components';
```

### **Component Props**
Each component has a clear interface defined in `types.ts`:

```typescript
interface NumberSelectorProps {
  numbers: number[];
  selectedNumbers: number[];
  onNumberToggle: (num: number) => void;
}
```

## 🚀 **Performance Features**

### **Memory Leak Prevention**
- All timers are properly managed with refs
- Comprehensive cleanup on component unmount
- No state-based timer management

### **Optimized Rendering**
- `useCallback` for all event handlers
- `useMemo` for expensive calculations
- Batched state updates to prevent multiple re-renders

### **Efficient State Management**
- Single source of truth in the custom hook
- Optimized dependency arrays
- Minimal re-renders through proper memoization

## 📁 **File Organization**

```
src/components/
├── hooks/
│   └── useMultiplicationTable.ts    # Business logic & state
├── MultiplicationTable.tsx          # Main orchestrator
├── NumberSelector.tsx               # Number selection UI
├── ModeToggle.tsx                   # Mode & type selection
├── PracticeControls.tsx             # Practice controls
├── QuestionDisplay.tsx              # Question display
├── ResultsSummary.tsx               # Results display
├── TableView.tsx                    # Table view mode
├── types.ts                         # Type definitions
├── index.ts                         # Barrel exports
└── README.md                        # This file
```

## 🔄 **Migration from Monolithic Component**

The original `MultiplicationTable.tsx` was a single 700+ line file. It has been refactored into:

- **Main Component**: ~225 lines (68% reduction)
- **Custom Hook**: ~310 lines (business logic)
- **UI Components**: 6 focused components (15-120 lines each)
- **Types & Exports**: Clean, maintainable structure

## 🧪 **Testing Strategy**

Each component can be tested independently:
- **Unit Tests**: Test individual component logic
- **Integration Tests**: Test component interactions
- **Hook Tests**: Test business logic separately from UI
- **E2E Tests**: Test complete user workflows

## 🎨 **Styling**

All components use Tailwind CSS classes and maintain consistent:
- **Color Schemes**: Light/dark mode support
- **Responsive Design**: Mobile-first approach
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Visual Hierarchy**: Consistent spacing and typography
