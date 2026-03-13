import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { type VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
    'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] disabled:pointer-events-none disabled:opacity-50',
    {
        variants: {
            variant: {
                default: 'bg-[#2563EB] text-white hover:bg-[#1D4ED8]',
                destructive: 'bg-[#ef4444] text-white hover:bg-[#b91c1c]',
                outline: 'border border-[#30363D] bg-transparent text-[#E6EDF3] hover:bg-[#161B22]',
                secondary: 'bg-[#161B22] border border-[#30363D] text-[#E6EDF3] hover:bg-[#1c2128]',
                ghost: 'hover:bg-[#161B22] text-[#E6EDF3]',
                link: 'text-[#2563EB] underline-offset-4 hover:underline',
                glass: 'bg-white/5 border border-white/10 backdrop-blur-md text-white hover:bg-white/10',
            },
            size: {
                default: 'h-11 px-4 py-2',
                sm: 'h-9 rounded-md px-3',
                lg: 'h-11 rounded-md px-8',
                icon: 'h-10 w-10',
            },
            fullWidth: {
                true: 'w-full',
            }
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, fullWidth, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : 'button';
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, fullWidth, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
