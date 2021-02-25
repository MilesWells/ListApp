import { API_URL } from ".";

export interface List {
  _id: string;
  items: string[];
}

const baseUrl = `${API_URL}/lists`;

export const ListService = {
  getLists: async () => {
    try {
      const response = await fetch(baseUrl);
      return (await response.json()) as List[];
    } catch (err) {
      console.error(err);
    }
  },
  getList: async (id: string) => {
    try {
      const response = await fetch(`baseUrl/${id}`);
      return (await response.json()) as List;
    } catch (err) {
      console.error(err);
    }
  },
  createList: async (list: string[]) => {
    try {
      const response = await fetch(baseUrl, {
        method: "POST",
        body: JSON.stringify(list),
      });
      return (await response.json()) as List;
    } catch (err) {
      console.error(err);
    }
  },
};
