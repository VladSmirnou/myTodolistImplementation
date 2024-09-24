import { ButtonHTMLAttributes, memo } from 'react';

type ButtonPropsType = ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = memo(function Button(props: ButtonPropsType) {
    return <button {...props} />;
});
