import { ChangeEvent, useState } from 'react';
import { Button } from './SuperButton';

type InputTextSenderPropsType = {
    callBack: (text: string) => void;
    placeholder?: string;
};

export const InputTextSender = (props: InputTextSenderPropsType) => {
    const [value, setValue] = useState<string>('');

    const handleOnChange = (e: ChangeEvent<HTMLInputElement>) =>
        setValue(e.currentTarget.value);

    const handleOnClick = () => {
        props.callBack(value);
        setValue('');
    };

    return (
        <div>
            <input
                type="text"
                value={value}
                onChange={handleOnChange}
                placeholder={props.placeholder ?? 'Enter a title'}
            />
            <Button onClick={handleOnClick}>+</Button>
        </div>
    );
};
