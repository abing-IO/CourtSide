import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn("cp-card", className)} {...props} />
    )
)
Card.displayName = "Card"

const CardTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn("cp-card-title", className)} {...props} />
    )
)
CardTitle.displayName = "CardTitle"

const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'primary' | 'danger' }>(
    ({ className, variant = 'default', ...props }, ref) => {
        const base = "font-bold text-sm px-4 py-2 rounded-md transition-all active:scale-95 flex items-center justify-center gap-2";
        const variants = {
            default: "bg-sb-card border border-sb-border text-sb-text hover:bg-white/10 hover:border-white/20",
            primary: "bg-sb-home text-white border-none hover:bg-blue-400",
            danger: "bg-sb-away/20 text-sb-away border border-sb-away/30 hover:bg-sb-away hover:text-white"
        };
        return (
            <button ref={ref} className={cn(base, variants[variant], className)} {...props} />
        )
    }
)
Button.displayName = "Button"

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
    ({ className, ...props }, ref) => (
        <input ref={ref} className={cn("cp-input", className)} {...props} />
    )
)
Input.displayName = "Input"

const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
    ({ className, ...props }, ref) => (
        <label ref={ref} className={cn("cp-label", className)} {...props} />
    )
)
Label.displayName = "Label"

export { Card, CardTitle, Button, Input, Label }
