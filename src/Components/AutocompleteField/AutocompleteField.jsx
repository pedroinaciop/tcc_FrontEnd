import { Controller } from "react-hook-form";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import styles from '../InputField/InputField.module.css';

function AutocompleteField({
    name,
    control,
    label,
    options,
    error,
    defaultValue,
    getOptionLabel = (option) => option.code,
    isOptionEqualToValue = (option, value) => option?.code === value?.code,
    placeholder,
    requiredMessage = "Campo obrigatório",
    sx,
    ...rest
}) {
    return (
        <div className={styles.autoCompleteField}>
            <p className={styles.labelAutocomplete}>{label}</p>
            <Controller
                name={name}
                control={control}
                rules={{ required: requiredMessage }}
                render={({ field }) => (
                    <Autocomplete
                        options={options}
                        getOptionLabel={(option) => typeof option === 'object' && option !== null ? `${option.code} - ${option.label}` : ''}
                        value={options.find(opt => opt.code === field.value) || null}
                        isOptionEqualToValue={(option, value) => option.code === value}
                        onChange={(_, selectedOption) => {
                            field.onChange(selectedOption?.code || '');
                        }}
                        renderInput={(params) => (
                            <TextField
                            {...params}
                            sx={{
                                    '& .MuiOutlinedInput-root': {
                                    paddingBottom: '0px !important',
                                    paddingTop: '0px !important',
                                    },
                                }}
                            error={Boolean(error)}
                            helperText={error?.message}
                            placeholder={placeholder}
                            />
                        )}
                        {...rest}
                    />
                )}
                />

        </div>
    );
}

export default AutocompleteField;