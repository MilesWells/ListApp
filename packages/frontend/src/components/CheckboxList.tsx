import React, { useState } from "react";
import { Form, InputGroup } from "react-bootstrap";

interface TodoListProps {}

export const CheckboxList: React.FC<TodoListProps> = () => {
  const [todoItems, setTodoItems] = useState<string[]>(["test1"]);
  const [checkedItems, setCheckedItems] = useState<string[]>(["test2"]);

  return (
    <>
      {todoItems.map((item, idx) => (
        <InputGroup
          key={`todo-${idx}`}
          onClick={() => {
            const idx = todoItems.findIndex((value) => value === item);
            setTodoItems([
              ...todoItems.slice(0, idx),
              ...todoItems.slice(idx + 1),
            ]);
            setCheckedItems([item, ...checkedItems]);
          }}
        >
          <InputGroup.Prepend>
            <Form.Check readOnly checked={false} type="checkbox" />
          </InputGroup.Prepend>
          {item}
        </InputGroup>
      ))}
      <hr />
      {checkedItems.map((item, idx) => (
        <InputGroup
          key={`checked-${idx}`}
          onClick={() => {
            const idx = checkedItems.findIndex((value) => value === item);
            setCheckedItems([
              ...checkedItems.slice(0, idx),
              ...checkedItems.slice(idx + 1),
            ]);
            setTodoItems([...todoItems, item]);
          }}
        >
          <InputGroup.Prepend>
            <Form.Check readOnly checked type="checkbox" />
          </InputGroup.Prepend>
          {item}
        </InputGroup>
      ))}
    </>
  );
};
