import TextField, { TextFieldProps } from '@mui/material/TextField'
import { ChangeEventHandler } from 'react';
import { useFormContext } from 'react-hook-form'

const RHFTextField = (props: TextFieldProps) => {
    const {
        register,
        setValue,
        watch,
        formState: { errors }
    } = useFormContext();
    const {
        name = "",
        type,
        label,
        placeholder,
        multiline,
        rows,
        disabled,
        size,
        value,
        minRows,
        onChange
    } = props

    const final_placebolder = placeholder ? placeholder : label ? "Enter " + label : "";

    // show error message
    const isError = Boolean(errors?.[name]);
    const errorMsg = isError ? errors?.[name]?.message : null;

    const final_type = type ?? "text";

    const defaultOnChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        let value: number | string = event.target.value;
        switch (final_type) {
            case "number":
                value = Number(value);
                break;

        }
        setValue(name, value)
    }

    const final_onChange = onChange ?? defaultOnChange;

    return (
        <>
            <TextField
                variant="outlined"
                label={label}
                type={final_type}
                placeholder={final_placebolder}
                fullWidth
                {...register(name)}
                error={isError}
                helperText={errorMsg ? <>{errorMsg}</> : null}
                multiline={Boolean(multiline)}
                rows={rows}
                minRows={minRows || 1}
                disabled={disabled ?? false}
                size={size ?? "small"}
                onChange={final_onChange}
            // {...passwordTypeAttr}
            />

        </>
    )
}

export default RHFTextField