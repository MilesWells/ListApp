import React, { useCallback, useEffect, useState } from "react";
import { Button, Form, FormControlProps, InputGroup } from "react-bootstrap";

type ListItemProps = Pick<FormControlProps, "onChange" | "value"> & {
  focus?: boolean;
  onDelete: () => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  showDelete?: boolean;
};

const ListItem: React.FC<ListItemProps> = ({
  focus = false,
  onChange,
  onDelete,
  onKeyDown,
  showDelete = true,
  value,
}) => {
  const ref = React.createRef<HTMLInputElement>();

  useEffect(() => {
    if (focus) ref.current?.focus();
  }, [focus, ref]);

  return (
    <InputGroup>
      {showDelete && (
        <InputGroup.Prepend>
          <Button onClick={onDelete} variant="outline-danger">
            Delete
          </Button>
        </InputGroup.Prepend>
      )}
      <Form.Control
        ref={ref}
        onChange={onChange}
        onKeyDown={onKeyDown}
        value={value}
      />
    </InputGroup>
  );
};

export const List: React.FC = () => {
  const [items, setItems] = useState<string[]>([""]);
  const [focusIdx, setFocusIdx] = useState<number>();

  useEffect(() => {
    if (focusIdx !== undefined) setFocusIdx(undefined);
  }, [focusIdx]);

  const deleteItem = useCallback(
    (idx: number) => {
      if (items.length > 1)
        setItems((cur) => [...cur.slice(0, idx), ...cur.slice(idx + 1)]);
    },
    [items]
  );

  return (
    <>
      {items.map((item, idx) => (
        <ListItem
          focus={focusIdx === idx}
          key={idx}
          value={item}
          onChange={(event) => {
            setItems((cur) => [
              ...cur.slice(0, idx),
              event.target.value,
              ...cur.slice(idx + 1),
            ]);
          }}
          onDelete={() => deleteItem(idx)}
          onKeyDown={(event) => {
            let defaultCase = false;

            console.log(event.key);
            switch (event.key) {
              case "Enter":
                setItems((cur) => [
                  ...cur.slice(0, idx + 1),
                  "",
                  ...cur.slice(idx + 1),
                ]);
                setFocusIdx(idx + 1);
                break;
              case "Tab":
                event.shiftKey ? setFocusIdx(idx - 1) : setFocusIdx(idx + 1);
                break;
              case "ArrowDown":
                setFocusIdx(idx + 1);
                break;
              case "ArrowUp":
                setFocusIdx(idx - 1);
                break;
              case "Backspace":
                if (item.length === 0) {
                  deleteItem(idx);
                  setFocusIdx(idx === 0 ? 0 : idx - 1);
                } else defaultCase = true;
                break;
              default:
                defaultCase = true;
            }

            if (!defaultCase) event.preventDefault();
          }}
          showDelete={items.length > 1}
        />
      ))}
    </>
  );
};
