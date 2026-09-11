import Slider, { SliderProps } from '@mui/material/Slider';
import { useFormContext, Controller } from 'react-hook-form';

interface RHFSliderProps extends SliderProps {
    name: string
}


const RHFSliderField = (props: RHFSliderProps) => {
    const { control } = useFormContext();
    return (
        <Controller
            name={props.name}
            control={control}
            render={({ field: { onChange, value, ref } }) => (
                <Slider
                    value={value}
                    onChange={(e, value) => {
                        onChange(value)
                    }}
                    valueLabelDisplay="auto"
                    {...props as SliderProps}
                />
            )}
        >
        </Controller>
    )
}

export default RHFSliderField