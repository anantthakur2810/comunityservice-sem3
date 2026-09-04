export function TextField({ label, ...props }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <input className="field-input" {...props} />
    </label>
  );
}

export function TextAreaField({ label, ...props }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <textarea className="field-input" rows={4} {...props} />
    </label>
  );
}

export function SelectField({ label, options, ...props }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <select className="field-input" {...props}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}