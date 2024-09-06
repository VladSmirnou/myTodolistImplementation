import { ChangeEvent, useState } from 'react';
import { Button } from './SuperButton';
import { cleanInputText } from '@/utils/inputTextCleaner';

type InputTextSenderPropsType = {
    callBack: (text: string) => void;
    placeholder?: string;
};

export const InputTextSender = (props: InputTextSenderPropsType) => {
    const [value, setValue] = useState<string>('');
    const [error, setError] = useState('');

    const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (error) setError('');
        setValue(e.currentTarget.value);
    };

    const handleOnClick = () => {
        const cleanedText = cleanInputText(value);
        if (cleanedText) {
            props.callBack(cleanedText);
            setValue('');
            return;
        }
        setError('title cannot be empty!');
        return;
    };

    return (
        <div>
            <input
                type="text"
                value={value}
                onChange={handleOnChange}
                placeholder={props.placeholder ?? 'Enter a title'}
            />
            {error && <p>{error}</p>}
            <Button onClick={handleOnClick}>+</Button>
        </div>
    );
};
