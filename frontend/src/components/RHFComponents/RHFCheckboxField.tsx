import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Controller, useFormContext } from 'react-hook-form'

const RHFCheckboxField = ({ label, name }: {
    label: string, name: string
}) => {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { name, onChange, value } }) => {
                return <FormControlLabel
                    control={
                        <Checkbox
                            checked={value}
                            onChange={onChange}
                            name={name}
                        />
                    }
                    label={label}
                />
            }}

        />

    )
}

export default RHFCheckboxField