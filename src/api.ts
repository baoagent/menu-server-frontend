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
  return apiClient.put(`/menu/${id}`, { price });
};

export const increaseCategoryPrice = (category: string, percentage: number): Promise<AxiosResponse<MenuItem[]>> => {
  return apiClient.put(`/menu/category/${category}`, { percentage });
};

export const createMenuItem = (item: Omit<MenuItem, 'id' | 'menuCategoryId' | 'description'>): Promise<AxiosResponse<MenuItem>> => {
  return apiClient.post('/menu', item);
};

export const deleteMenuItem = (id: string): Promise<AxiosResponse<void>> => {
  return apiClient.delete(`/menu/${id}`);
};