import { ReactNode } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import Select, { Props, StylesConfig } from 'react-select';

interface RHFSelectOptions {
    value: string;
    label: string | ReactNode;
}



const RHFSelectField = ({ name, options = [], selectStyles, placeholder }:
    { name: string, options: RHFSelectOptions[], selectStyles?: any, placeholder?: string }) => {
    const { control } = useFormContext();
    const container = selectStyles?.container || {}
    const menuList = selectStyles?.menuList || {}
    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { onChange, value, ref } }) => (
                <Select
                    ref={ref}
                    value={options.find(f => f.value === value) || null}
                    onChange={(selected) => onChange(selected ? selected.value : null)}
                    options={options}
                    placeholder={placeholder ?? ""}
                    // menuIsOpen
                    styles={{
                        container: (baseStyles, state) => ({
                            ...baseStyles,
                            zIndex: 10,
                            ...container
                        }),
                        menuList: (baseStyles, state) => ({
                            ...baseStyles,
                            zIndex: 10,
                            ...menuList
                        }),
                    }}
                />
            )}
        >
        </Controller>
    )
}

export default RHFSelectField