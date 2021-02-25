import { API_URL } from "./config";

export interface IList {
  _id: string;
  items: string[];
  name: string;
}

const baseUrl = `${API_URL}/lists`;

export const ListService = {
  createList: async (items: string[], name: string) => {
    try {
      const response = await fetch(baseUrl, {
        method: "POST",
        body: JSON.stringify({ items, name }),
      });
      return (await response.json()) as IList;
    } catch (err) {
      console.error(err);
    }
  },
  deleteList: async (id: string) => {
    try {
      const response = await fetch(`${baseUrl}/${id}`, { method: "DELETE" });
      return response.ok;
    } catch (err) {
      console.error(err);
    }
  },
  getList: async (id: string) => {
    try {
      const response = await fetch(`${baseUrl}/${id}`);
      return (await response.json()) as IList;
    } catch (err) {
      console.error(err);
    }
  },
  getLists: async () => {
    try {
      const response = await fetch(baseUrl);
      return (await response.json()) as IList[];
    } catch (err) {
      console.error(err);
    }
  },
  updateList: async (id: string, items: string[], name: string) => {
    try {
      const response = await fetch(`${baseUrl}/${id}`, {
        method: "PUT",
        body: JSON.stringify({ items, name }),
      });
      return response.ok;
    } catch (err) {
      console.error(err);
    }
  },
};
