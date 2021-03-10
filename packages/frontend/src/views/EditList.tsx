import React, { useEffect, useState } from "react";
import { Button, Card, Form, Nav } from "react-bootstrap";
import { Link, useHistory, useParams } from "react-router-dom";

import { List } from "../components";
import { ListService } from "../services";

export const EditList: React.FC = () => {
  const [initItems, setInitItems] = useState<string[]>([]);
  const [items, setItems] = useState<string[]>([]);
  const [name, setName] = useState<string>("");
  const [inFlight, setInFlight] = useState(false);
  const history = useHistory();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    async function doStuff() {
      setInFlight(true);
      const list = await ListService.getList(id);

      if (list === undefined) {
        history.push("/");
        return;
      }

      setInitItems(list.items);
      setName(list.name);
      setInFlight(false);
    }

    doStuff();
  }, [history, id]);

  return (
    <Card>
      <Card.Header>
        <Nav variant="pills">
          <Nav.Item>
            <Nav.Link as={Link} to="/">
              Back
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </Card.Header>
      <Card.Body>
        <Form.Group>
          <Form.Label>Name</Form.Label>
          <Form.Control
            value={name}
            onChange={({ target: { value } }) => setName(value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>List</Form.Label>
          {initItems.length > 0 && (
            <List
              initialItems={initItems}
              onChange={setItems}
              locked={inFlight}
              showDelete
            />
          )}
        </Form.Group>
        <Button
          variant="primary"
          onClick={async () => {
            setInFlight(true);

            try {
              const list = await ListService.updateList(id, items, name);
              if (list) history.push("/");
            } catch (err) {
              console.error(err);
            } finally {
              setInFlight(false);
            }
          }}
        >
          Save
        </Button>
      </Card.Body>
    </Card>
  );
};
