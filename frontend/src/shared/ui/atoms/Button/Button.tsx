import {buttonVariants, buttonSizes, baseStyles} from './Button.variants';

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary';
    size?: 'sm' | 'md'| 'lg' ;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    types?: ButtonProps['type'];
}



const Button =({
    children,
    onClick,
    className,
    types = 'button',
    variant= 'primary',
    size= 'md',
    ref,
    ...props
}:ButtonProps & {ref?: React.Ref<HTMLButtonElement>})=>{
    return(
        <button
        type={types}
        ref={ref}
        {...props}
        onClick={onClick}
        className={`${baseStyles}${buttonVariants[variant]} ${buttonSizes[size]} ${className}`}
        >
            {children}
        </button>
    )
}

Button.displayName = 'Button';

export default Button;