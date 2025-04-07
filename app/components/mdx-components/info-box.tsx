import type { VariantProps } from 'cva'
import { cva } from 'cva'

const infoBox = cva({
  base: 'usa-alert',
  variants: {
    variant: {
      info: 'usa-alert--info',
      warning: 'usa-alert--warning',
      success: 'usa-alert--success',
      error: 'usa-alert--error',
      emergency: 'usa-alert--emergency',
    },
    size: {
      slim: 'usa-alert--slim',
    },
    noIcon: {
      true: 'usa-alert--no-icon',
    },
  },
  defaultVariants: {
    variant: 'info',
    noIcon: false,
  },
})

export type InfoBoxProps = ({
  'role': 'region'
  'aria-label': string
  'aria-labelledby'?: never
} | {
  'role': 'alert' | 'status'
  'aria-labelledby'?: string
  'aria-label'?: never
}) & ({
  size: 'slim'
  heading?: never
  headingAs?: never
} | {
  size?: never
  heading: string
  headingAs: 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p'
}) & React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof infoBox>

export function InfoBox({ children, variant, size, noIcon, className, role = 'alert', heading, headingAs = 'p', 'aria-labelledby': ariaLabelledby }: InfoBoxProps) {
  const HeadingTag = headingAs

  return (
    <div className={infoBox({ variant, size, noIcon, className })} role={role} aria-labelledby={ariaLabelledby}>
      <div className="usa-alert__body">
        {heading && size !== 'slim' ? <HeadingTag className="usa-alert__heading text-bold" id={ariaLabelledby}>{heading}</HeadingTag> : null}
        <div className="usa-alert__text">
          {children}
        </div>
      </div>
    </div>
  )
}
