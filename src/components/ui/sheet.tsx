import * as React from 'react'
import * as SheetPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'

export const Sheet = SheetPrimitive.Root
export const SheetTrigger = SheetPrimitive.Trigger
export const SheetClose = SheetPrimitive.Close
export const SheetPortal = SheetPrimitive.Portal

export const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay ref={ref} className={cn('fixed inset-0 z-[60] bg-black/50', className)} {...props} />
))
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName

const sheetContentBaseClass =
  'fixed inset-y-0 start-0 z-[61] flex h-full w-[min(100%,20rem)] max-w-[20rem] flex-col gap-0 overflow-y-auto border-e border-border-card bg-[var(--color-primary)] p-0 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(0.25rem,env(safe-area-inset-top))] text-white shadow-lg'

export type SheetContentProps = React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content> & {
  hideCloseButton?: boolean
}

export const SheetContent = React.forwardRef<React.ElementRef<typeof SheetPrimitive.Content>, SheetContentProps>(
  ({ className, children, hideCloseButton = false, ...props }, ref) => {
    const { t } = useTranslation()
    return (
      <SheetPortal>
        <SheetOverlay />
        <SheetPrimitive.Content ref={ref} className={cn(sheetContentBaseClass, className)} {...props}>
          {children}
          {!hideCloseButton ? (
            <SheetPrimitive.Close
              type="button"
              className="absolute end-3 top-[max(0.75rem,env(safe-area-inset-top))] inline-flex h-10 w-10 items-center justify-center rounded-lg text-white/90 ring-offset-background transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 disabled:pointer-events-none"
              aria-label={t('common.close')}
            >
              <X className="h-5 w-5" strokeWidth={2} aria-hidden />
            </SheetPrimitive.Close>
          ) : null}
        </SheetPrimitive.Content>
      </SheetPortal>
    )
  }
)
SheetContent.displayName = SheetPrimitive.Content.displayName

export const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col gap-1.5 px-6 pb-2 pt-14 text-start', className)} {...props} />
)

export const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title ref={ref} className={cn('text-lg font-semibold leading-none', className)} {...props} />
))
SheetTitle.displayName = SheetPrimitive.Title.displayName

export const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description ref={ref} className={cn('text-sm text-white/80', className)} {...props} />
))
SheetDescription.displayName = SheetPrimitive.Description.displayName
