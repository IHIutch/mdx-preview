import type { VariantProps } from 'cva'
import { cva } from 'cva.config'
import React from 'react'

const accordion = cva({
  base: 'usa-accordion',
  variants: {
    bordered: {
      true: 'usa-accordion--bordered',
    },
    multiselectable: {
      true: 'usa-accordion--multiselectable',
    },
  },
})

export type AccordionListProps = {
  children: React.ReactNode
  multiselectable?: boolean
} & React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof accordion>

export function AccordionList({
  bordered,
  children,
  className,
  multiselectable,
  ...props
}: AccordionListProps) {
  return (
    <div
      {...props}
      className={accordion({ className, multiselectable, bordered })}
      data-allow-multiple={multiselectable}
    >
      {children}
    </div>
  )
}

export type AccordionItemProps = {
  'aria-expanded': boolean
  'children': React.ReactNode
  'headingText': string
  'id'?: string
  'wrapperAs'?: 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
} & React.HTMLAttributes<HTMLDivElement>
export function AccordionItem({
  'aria-expanded': ariaExpanded = false,
  children,
  headingText,
  id,
  wrapperAs = 'div',
  ...props
}: AccordionItemProps) {
  const Element = wrapperAs
  const uniqueId = React.useId()

  return (
    <>
      <Element className="usa-accordion__heading">
        <button
          className="usa-accordion__button"
          type="button"
          aria-expanded={ariaExpanded}
          aria-controls={id || uniqueId}
        >
          {headingText}
        </button>
      </Element>
      <div
        {...props}
        id={id || uniqueId}
        className="usa-accordion__content usa-prose"
        hidden={!ariaExpanded}
      >
        {children}
      </div>
    </>
  )
}
