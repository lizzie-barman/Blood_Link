import React from 'react';

export const Select = ({
  label,
  id,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  error = '',
  required = false,
  className = '',
  ...props
}) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`form-group ${className}`.trim()}>
      {label && (
        <label htmlFor={selectId} className="form-label">
          {label} {required && <span style={{ color: 'var(--color-danger)' }}>*</span>}
        </label>
      )}
      <select
        id={selectId}
        value={value}
        onChange={onChange}
        required={required}
        className="form-select"
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => {
          const val = typeof option === 'object' ? option.value : option;
          const lbl = typeof option === 'object' ? option.label : option;
          return (
            <option key={val} value={val}>
              {lbl}
            </option>
          );
        })}
      </select>
      {error && <span style={{ color: 'var(--color-danger)', fontSize: 'var(--font-size-xs)' }}>{error}</span>}
    </div>
  );
};

export default Select;
