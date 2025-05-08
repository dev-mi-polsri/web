# UI Components

## Component Architecture

### Overview

The MI Polsri website uses a component-based architecture built on:

- shadcn/ui as the base component library
- Tailwind CSS for styling
- Radix UI primitives for accessibility
- Custom components for specific needs

## Component Categories

### 1. Core UI Components

Located in `components/ui/`:

- Button
- Input
- Card
- Dialog
- Select
- etc.

These are shadcn/ui components that serve as building blocks.

### 2. Layout Components

Located in `components/layout/`:

- Header
- Footer
- Sidebar
- Container
- Grid

### 3. Feature Components

Located in `components/features/`:

- NewsCard
- ProfileCard
- StudyProgramCard
- EventList
- etc.

## Usage Examples

### Basic Components

```tsx
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

function LoginForm() {
  return (
    <form>
      <Input type="email" placeholder="Email" className="mb-4" />
      <Button type="submit">Login</Button>
    </form>
  )
}
```

## Styling Approach

### 1. Tailwind CSS

Base styling using Tailwind utility classes:

```tsx
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
  <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
</div>
```

### 2. CSS Variables

Theme configuration using CSS variables:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --secondary: 210 40% 96.1%;
  --accent: 210 40% 96.1%;
}
```

### 3. Component Variants

Using cva (class-variance-authority) for component variants:

```tsx
const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium',
  {
    variants: {
      variant: {
        default: 'bg-primary text-white hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        outline: 'border border-input bg-background hover:bg-accent',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3',
        lg: 'h-11 px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)
```

## Component Best Practices

### 1. Composition

Prefer composition over inheritance:

```tsx
function Card({ children, header, footer }) {
  return (
    <div className="rounded-lg border bg-card">
      {header && <div className="p-4 border-b">{header}</div>}
      <div className="p-4">{children}</div>
      {footer && <div className="p-4 border-t">{footer}</div>}
    </div>
  )
}
```

### 2. Props API

Clear and consistent props interface:

```tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline'
  size?: 'default' | 'sm' | 'lg'
  isLoading?: boolean
}
```

### 3. Accessibility

Built-in accessibility features:

```tsx
function Dialog({ title, children, ...props }) {
  return (
    <DialogPrimitive.Root {...props}>
      <DialogPrimitive.Trigger />
      <DialogPrimitive.Content>
        <DialogPrimitive.Title>{title}</DialogPrimitive.Title>
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Root>
  )
}
```

## Performance Optimization

### 1. Code Splitting

Using dynamic imports for large components:

```tsx
const RichTextEditor = dynamic(() => import('./rich-text-editor'), {
  loading: () => <Skeleton className="h-[200px]" />,
})
```

### 2. Image Optimization

Using Next.js Image component:

```tsx
import Image from 'next/image'

function ProfileImage({ src, alt }) {
  return (
    <Image src={src} alt={alt} width={200} height={200} className="rounded-full" priority={false} />
  )
}
```

### 3. Memoization

Using memo for expensive components:

```tsx
const MemoizedDataGrid = memo(function DataGrid({ data }) {
  return (
    // Complex rendering logic
  )
}, areEqual)
```

## Testing Components

### 1. Unit Tests

```tsx
describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('Click me')
  })

  it('handles click events', () => {
    const onClick = jest.fn()
    render(<Button onClick={onClick}>Click me</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalled()
  })
})
```

### 2. Integration Tests

```tsx
describe('NewsCard', () => {
  it('displays news data correctly', () => {
    const news = {
      title: 'Test News',
      excerpt: 'Test excerpt',
      image: '/test.jpg',
    }

    render(<NewsCard {...news} />)
    expect(screen.getByText(news.title)).toBeInTheDocument()
    expect(screen.getByText(news.excerpt)).toBeInTheDocument()
    expect(screen.getByRole('img')).toHaveAttribute('src', news.image)
  })
})
```
