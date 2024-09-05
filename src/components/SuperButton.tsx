import { ButtonHTMLAttributes } from 'react';

type ButtonPropsType = ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = (props: ButtonPropsType) => {
    return <button {...props} />;
};
