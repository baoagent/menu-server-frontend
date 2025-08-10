import axios from 'axios';
import { AxiosResponse } from 'axios';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  menuCategoryId: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  menuItems: MenuItem[];
}

const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api',
});

export const getMenuItems = (): Promise<AxiosResponse<MenuCategory[]>> => {
  return apiClient.get('/menu');
};

export const updateMenuItemPrice = (id: string, price: number): Promise<AxiosResponse<MenuItem>> => {
  return apiClient.put(`/menu/items/${id}`, { price });
};



export const createMenuItem = (item: Omit<MenuItem, 'id'>): Promise<AxiosResponse<MenuItem>> => {
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

