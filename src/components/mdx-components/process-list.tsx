import { cx } from 'cva.config'

export type ProcessListProps = {
  children: React.ReactNode
} & React.HTMLAttributes<HTMLOListElement>

export function ProcessList({
  children,
  className,
  ...props
}: ProcessListProps) {
  return (
    <ol {...props} className={cx('usa-process-list', className)}>
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
  className,
  headingAs = 'p',
  headingText,
  ...props
}: ProcessItemProps) {
  const Element = headingAs

  return (
    <li {...props} className={cx('usa-process-list__item', className)}>
      <Element className="usa-process-list__heading">
        {headingText}
      </Element>
      <div className="margin-top-05">
        {children}
      </div>
    </li>
  )
}
