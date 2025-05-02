import React from 'react';
import FormField from './FormField';
import { Select } from '../styles/styles';

const SelectField = ({ label, name, options, value, onChange, error, required = true }) => {
    return (
        <FormField
            label={label}
            name={name}
            type="select"
            value={value}
            onChange={onChange}
            error={error}
            required={required}
        >
            <Select 
                name={name}
                value={value}
                onChange={onChange}
                required={required}
            >
                <option value="">Seleccione {label.toLowerCase()}</option>
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </Select>
        </FormField>
    );
};

export default SelectField;