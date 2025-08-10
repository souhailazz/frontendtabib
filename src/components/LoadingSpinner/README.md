# LoadingSpinner Component

A modern, customizable circular loading spinner component with smooth animations and multiple variants.

## Features

- 🎨 **Multiple Size Variants**: small, medium, large, xl
- 🌈 **Color Variants**: primary, secondary, success, warning, error, gray, white
- 📝 **Optional Text**: Display loading text below the spinner
- 📱 **Responsive Design**: Automatically adjusts for mobile devices
- ⚡ **Smooth Animations**: CSS-based animations with cubic-bezier easing
- 🎯 **Accessible**: Proper ARIA attributes and reduced motion support

## Installation

The component is already included in the project. Simply import it:

```jsx
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
```

## Usage

### Basic Usage

```jsx
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

function MyComponent() {
  return (
    <div>
      <LoadingSpinner />
    </div>
  );
}
```

### With Custom Size and Color

```jsx
<LoadingSpinner size="large" color="primary" />
```

### With Loading Text

```jsx
<LoadingSpinner 
  size="large" 
  color="primary" 
  text="Loading your data..." 
/>
```

### In Buttons

```jsx
<button className="my-button" disabled={loading}>
  {loading ? (
    <LoadingSpinner size="small" color="white" />
  ) : (
    'Submit'
  )}
</button>
```

### Full Screen Overlay

```jsx
{isLoading && (
  <div className="loading-spinner-overlay">
    <LoadingSpinner size="xl" color="primary" text="Loading page..." />
  </div>
)}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'small' \| 'medium' \| 'large' \| 'xl'` | `'medium'` | Size of the spinner |
| `color` | `'primary' \| 'secondary' \| 'success' \| 'warning' \| 'error' \| 'gray' \| 'white'` | `'primary'` | Color theme of the spinner |
| `text` | `string` | `''` | Optional text to display below the spinner |
| `className` | `string` | `''` | Additional CSS classes |

## Size Variants

- **small**: 16px × 16px (2px border)
- **medium**: 24px × 24px (3px border)
- **large**: 32px × 32px (4px border)
- **xl**: 48px × 48px (5px border)

## Color Variants

- **primary**: Green (#10b981) - Default theme color
- **secondary**: Blue (#3b82f6) - Secondary actions
- **success**: Green (#10b981) - Success states
- **warning**: Orange (#f59e0b) - Warning states
- **error**: Red (#ef4444) - Error states
- **gray**: Gray (#6b7280) - Neutral states
- **white**: White (#ffffff) - For dark backgrounds

## Migration from Old Spinners

The old loading spinners have been replaced throughout the codebase:

- ✅ BookingModal
- ✅ Dashboard
- ✅ PaymentModal
- ✅ ResponseSearch
- ✅ MyConsultation
- ✅ DoctorMap

Old CSS classes like `.loading-spinner` have been removed and replaced with the new component.
