import type { VariantProps } from 'cva'
import { cva } from 'cva.config'

const button = cva({
  base: 'usa-button',
  variants: {
    colorScheme: {
      primary: null,
      secondary: 'usa-button--secondary',
      cool: 'usa-button--accent-cool',
      warm: 'usa-button--accent-warm',
      base: 'usa-button--base',
      inverse: 'usa-button--inverse',
    },
    size: {
      big: 'usa-button--big',
    },
    variant: {
      outline: 'usa-button--outline',
      unstyled: 'usa-button--unstyled',
    },
  },
  defaultVariants: {
    colorScheme: 'primary',
  },
})

export type ButtonProps = ({
}) & React.HTMLAttributes<HTMLButtonElement> & VariantProps<typeof button>

export function Button({
  children,
  className,
  colorScheme,
  size,
  variant,
  ...props
}: ButtonProps) {
  return (
    // eslint-disable-next-line react-dom/no-missing-button-type
    <button
      className={button({
        colorScheme,
        className,
        size,
        variant,
      })}
      {...props}
    >
      {children}
    </button>
  )
}
