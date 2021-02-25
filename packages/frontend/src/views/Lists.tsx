import React, { useEffect, useState } from "react";
import { Button, Media } from "react-bootstrap";
import { Link } from "react-router-dom";

import { List, ListService } from "../services";

export const Lists: React.FC = () => {
  const [lists, setLists] = useState<List[]>([]);

  useEffect(() => {
    async function doStuff() {
      const response = await ListService.getLists();
      if (response === undefined) console.log("Could not retrieve lists");
      else setLists(response);
    }

    doStuff();
  }, []);

  return (
    <>
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
    </>
  );
};
