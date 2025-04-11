import type { VariantProps } from 'cva'
import { cva } from 'cva.config'

const processList = cva({
  base: 'usa-process-list',
})

export type ProcessListProps = {
  children: React.ReactNode
} & React.HTMLAttributes<HTMLOListElement> &
VariantProps<typeof processList>

export function ProcessList({
  children,
  className,
  ...props
}: ProcessListProps) {
  return (
    <ol {...props} className={processList({ className })}>
      {children}
    </ol>
  )
}
export type ProcessItemProps = {
  children: React.ReactNode
  headingAs?: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  headingText?: string
} & React.HTMLAttributes<HTMLLIElement>

export function ProcessItem({
  children,
  headingAs = 'p',
  headingText,
  ...props
}: ProcessItemProps) {
  const Element = headingAs

  return (
    <li {...props} className="usa-process-list__item">
      <Element className="usa-process-list__heading">
        {headingText}
      </Element>
      <div className="margin-top-05">
        {children}
      </div>
    </li>
  )
}
