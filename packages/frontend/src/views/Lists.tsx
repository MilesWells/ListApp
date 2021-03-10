import React, { useEffect, useState } from "react";
import { Button, Card, Media, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

import { CheckboxList } from "../components";
import { IList, ListService } from "../services";

export const Lists: React.FC = () => {
  const [lists, setLists] = useState<IList[]>([]);

  useEffect(() => {
    async function doStuff() {
      const response = await ListService.getLists();
      if (response === undefined) console.error("Could not retrieve lists");
      else setLists(response);
    }

    doStuff();
  }, []);

  return (
    <Card>
      <Card.Header>
        <Nav variant="pills">
          <Nav.Item>
            <Nav.Link disabled>Lists</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={Link} to="/lists/new">
              Create New List
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </Card.Header>
      <Card.Body>
        <CheckboxList />
        {lists.map(({ _id }, idx) => (
          <Media key={`list-${idx}`}>
            <Button
              variant="outline-danger"
              onClick={async () => {
                const ok = await ListService.deleteList(_id);
                if (ok)
                  setLists((cur) => [
                    ...cur.slice(0, idx),
                    ...cur.slice(idx + 1),
                  ]);
              }}
            >
              Delete
            </Button>
            <Media.Body>
              <Link to={`/lists/${_id}`}>{_id}</Link>
            </Media.Body>
          </Media>
        ))}
      </Card.Body>
    </Card>
  );
};
