import type { ComponentProps, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { buttonClass, type ButtonVariant } from './buttonClass'

type LinkProps = Omit<ComponentProps<typeof Link>, 'className'> & {
  variant?: ButtonVariant
  className?: string
  children: ReactNode
}

/** Tautan navigasi bergaya tombol. */
export function ButtonLink({ variant = 'primary', className, children, ...rest }: LinkProps) {
  return (
    <Link className={buttonClass(variant, className)} {...rest}>
      {children}
    </Link>
  )
}

type ButtonProps = Omit<ComponentProps<'button'>, 'className'> & {
  variant?: ButtonVariant
  className?: string
}

export function Button({ variant = 'primary', className, type = 'button', children, ...rest }: ButtonProps) {
  return (
    <button type={type} className={buttonClass(variant, className)} {...rest}>
      {children}
    </button>
  )
}
