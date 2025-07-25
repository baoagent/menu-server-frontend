import axios, { AxiosResponse } from 'axios';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  menuCategoryId: string;
}

const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api',
});

export const getMenuItems = (): Promise<AxiosResponse<MenuItem[]>> => {
  return apiClient.get('/menu');
};

export const updateMenuItemPrice = (id: string, price: number): Promise<AxiosResponse<MenuItem>> => {
  return apiClient.put(`/menu/items/${id}`, { price });
};



export const createMenuItem = (item: Omit<MenuItem, 'id' | 'menuCategoryId' | 'description'>): Promise<AxiosResponse<MenuItem>> => {
  return apiClient.post('/menu/items', item);
};

export const deleteMenuItem = (id: string): Promise<AxiosResponse<void>> => {
  return apiClient.delete(`/menu/items/${id}`);
};

export const createCategory = (name: string): Promise<AxiosResponse<{ id: string; name: string }>> => {
  return apiClient.post('/menu/categories', { name });
};

export const getMenuPdf = (): Promise<AxiosResponse<Blob>> => {
  return apiClient.get('/menu/pdf', { responseType: 'blob' });
};

