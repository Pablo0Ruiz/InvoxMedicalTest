import {
    base,
    inputVariants,
    labelBase,
    labelContainerBase,
    labelContainerVariants
} from "./Input.variants";




export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    types?: InputProps['type'];
    placeholder?: string;
    value?: string;
    variant?: 'primary' | 'secondary';
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    label?: string;
    labelLayout?: 'horizontal' | 'vertical';
}


const Input = ({
    types,
    ref,
    placeholder,
    value,
    onChange,
    className,
    label,
    labelLayout = 'horizontal',
    variant = 'primary',
    ...props
}: InputProps & { ref?: React.Ref<HTMLInputElement> }) => {
    return (
        <label
            className={`${labelContainerBase} ${labelContainerVariants[labelLayout]}`}>
            {label && <span className={labelBase}>{label}</span>}
            <input
                type={types}
                placeholder={placeholder}
                value={value}
                className={`${base} ${inputVariants[variant]} ${className || ''}`}
                onChange={onChange}
                {...props}
                ref={ref}
            />
        </label>
    )
}


Input.display = 'Input';

export default Input;