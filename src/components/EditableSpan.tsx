import { ChangeEvent, useState } from 'react';

type EditableSpanPropsType = {
    children: string;
    callBack: (text: string) => void;
};

export const EditableSpan = (props: EditableSpanPropsType) => {
    const [editMode, setEditMode] = useState<boolean>(false);
    const [value, setvalue] = useState<string>('');

    const handleDoubleClick = () => {
        setEditMode(true);
        setvalue(props.children);
    };

    const handleOnBlur = () => {
        setEditMode(false);
        props.callBack?.(value);
    };

    const handleOnChange = (e: ChangeEvent<HTMLInputElement>) =>
        setvalue(e.currentTarget.value);

    return editMode ?
            <input
                type="text"
                value={value}
                onChange={handleOnChange}
                onBlur={handleOnBlur}
                autoFocus
            />
        :   <span onDoubleClick={handleDoubleClick}>{props.children}</span>;
};
