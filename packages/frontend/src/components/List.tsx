import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { Button, Form, FormControlProps, InputGroup } from "react-bootstrap";

type ListItemProps = Pick<FormControlProps, "onChange" | "disabled"> & {
  focus?: boolean;
  onDelete: () => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  showDelete?: boolean;
  value: string;
};

const ListItem: React.FC<ListItemProps> = ({
  disabled,
  focus = false,
  onChange,
  onDelete,
  onKeyDown,
  showDelete = false,
  value,
}) => {
  const ref = React.createRef<HTMLInputElement>();

  useEffect(() => {
    if (focus) ref.current?.focus();
  }, [focus, ref]);

  return (
    <InputGroup>
      <InputGroup.Prepend>
        {showDelete && (
          <Button
            disabled={disabled}
            onClick={onDelete}
            variant="outline-danger"
          >
            Delete
          </Button>
        )}
      </InputGroup.Prepend>
      <Form.Control
        disabled={disabled}
        onChange={onChange}
        onKeyDown={onKeyDown}
        ref={ref}
        value={value}
      />
    </InputGroup>
  );
};

interface ListProps {
  initialItems?: string[];
  locked?: boolean;
  onChange?: (items: string[]) => void;
  showDelete?: boolean;
}

export const List: React.FC<ListProps> = ({
  initialItems = [""],
  locked = false,
  onChange,
  showDelete = false,
}) => {
  const [items, setItems] = useState<string[]>(initialItems);
  const [focusIdx, setFocusIdx] = useState<number>();

  // reset focusIdx after render
  useLayoutEffect(() => {
    if (focusIdx !== undefined) setFocusIdx(undefined);
  }, [focusIdx]);

  const deleteItem = useCallback(
    (idx: number) => {
      if (items.length > 1) {
        setItems((cur) => [...cur.slice(0, idx), ...cur.slice(idx + 1)]);
        setFocusIdx(idx === 0 ? 0 : idx - 1);
      }
    },
    [items]
  );

  return (
    <>
      {items.map((item, idx) => (
        <ListItem
          disabled={locked}
          focus={focusIdx === idx}
          key={idx}
          onChange={(event) => {
            const newItems = [
              ...items.slice(0, idx),
              event.target.value,
              ...items.slice(idx + 1),
            ];

            setItems(newItems);
            onChange && onChange(newItems);
          }}
          onDelete={() => deleteItem(idx)}
          onKeyDown={(event) => {
            let defaultCase = false;

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
                if (item.length === 0) deleteItem(idx);
                else defaultCase = true;
                break;
              default:
                defaultCase = true;
            }

            if (!defaultCase) event.preventDefault();
          }}
          showDelete={showDelete && items.length > 1}
          value={item}
        />
      ))}
    </>
  );
};
