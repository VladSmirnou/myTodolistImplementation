import { ChangeEvent, KeyboardEvent, memo, useState } from 'react';
import { Button } from './SuperButton';
// should be injected
import { cleanInputText } from '@/utils/inputTextCleaner';
//-------------------
type InputTextSenderPropsType = {
    callBack: (text: string) => void;
    placeholder?: string;
};

const handleInputValue = (
    inputValue: string,
    setError: (e: string) => void,
    setValue: (v: string) => void,
    callBack: (t: string) => void,
): void => {
    const cleanedText = cleanInputText(inputValue);
    if (cleanedText) {
        callBack(cleanedText);
        setValue('');
        return;
    }
    setError('title cannot be empty!');
    return;
};

export const InputTextSender = memo(function InputTextSender(
    props: InputTextSenderPropsType,
) {
    const [value, setValue] = useState<string>('');
    const [error, setError] = useState('');

    const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (error) setError('');
        setValue(e.currentTarget.value);
    };

    const handleOnClick = () => {
        handleInputValue(value, setError, setValue, props.callBack);
    };

    const handleOnKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleInputValue(value, setError, setValue, props.callBack);
        }
    };

    return (
        <div>
            <input
                type="text"
                value={value}
                onKeyDown={handleOnKeyDown}
                onChange={handleOnChange}
                placeholder={props.placeholder ?? 'Enter a title'}
            />
            {error && <p>{error}</p>}
            <Button onClick={handleOnClick}>+</Button>
        </div>
    );
});
