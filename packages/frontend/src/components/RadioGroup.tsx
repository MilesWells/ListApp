import React, { useState } from "react";
import { Form } from "react-bootstrap";

interface RadioGroupProps<T> {
  initialValue?: T;
  onChange: (value: T) => void;
  values: T[];
}

export const RadioGroup = <T,>({
  initialValue,
  onChange,
  values,
}: RadioGroupProps<T>) => {
  const [selected, setSelected] = useState<T | undefined>(initialValue);

  return (
    <Form.Group>
      {values.map((value, idx) => (
        <div
          key={idx}
          onClick={() => {
            setSelected(value);
            onChange(value);
          }}
        >
          <Form.Check
            checked={selected === value}
            label={value}
            onChange={() => {
              // empty because it's controlled by the parent
            }}
            type="radio"
          />
        </div>
      ))}
    </Form.Group>
  );
};
