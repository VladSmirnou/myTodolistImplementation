import { ChangeEvent, useState } from 'react';
import { cleanInputText } from '@/utils/inputTextCleaner';

type EditableSpanPropsType = {
    children: string;
    callBack: (text: string) => void;
};

export const EditableSpan = (props: EditableSpanPropsType) => {
    const [editMode, setEditMode] = useState<boolean>(false);
    const [value, setvalue] = useState<string>('');
    const [error, setError] = useState('');

    const handleDoubleClick = () => {
        setEditMode(true);
        setvalue(props.children);
    };

    const handleOnBlur = () => {
        const cleanedText = cleanInputText(value);
        if (cleanedText) {
            setEditMode(false);
            props.callBack(cleanedText);
            return;
        }
        setError('title cannot be empty!');
        return;
    };

    const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (error) setError('');
        setvalue(e.currentTarget.value);
    };

    return editMode ?
            <>
                <input
                    type="text"
                    value={value}
                    onChange={handleOnChange}
                    onBlur={handleOnBlur}
                    autoFocus
                />
                {error && <span>{error}</span>}
            </>
        :   <span onDoubleClick={handleDoubleClick}>{props.children}</span>;
};
