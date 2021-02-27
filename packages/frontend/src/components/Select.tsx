import React from "react";
import { Form } from "react-bootstrap";

interface SelectProps {
  items: string[];
  onSelect: (selected: string) => void;
}

export const Select: React.FC<SelectProps> = ({ items, onSelect }) => (
  <Form.Control
    as="select"
    onChange={({ target: { value } }) => onSelect(value)}
  >
    {items.map((item, idx) => (
      <option key={idx}>{item}</option>
    ))}
  </Form.Control>
);
