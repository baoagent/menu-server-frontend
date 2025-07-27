import React, { useEffect, useState } from 'react';
import { getMenuItems, updateMenuItemPrice, createMenuItem, deleteMenuItem } from '../api.ts';
import { useTranslation } from 'react-i18next';
import CategoryManager from './CategoryManager.tsx';
import CategoryPriceUpdater from './CategoryPriceUpdater.tsx';
import MenuItemTable from './MenuItemTable.tsx';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  menuCategoryId: string;
}

const MenuList: React.FC = () => {
  const { t } = useTranslation();
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [newItem, setNewItem] = useState({ category: '', name: '', price: '', description: '' });
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchMenu();
    fetchCategories();
  }, []);

  const fetchMenu = async () => {
    try {
      const response = await getMenuItems();
      const allMenuItems = response.data.flatMap(category => category.menuItems);
      setMenu(allMenuItems);
    } catch (error) {
      console.error("Error fetching menu:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getMenuItems();
      const uniqueCategories = Array.from(new Set(response.data.map(category => category.name)));
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const updatedMenu = [...menu];
    if (field === 'price') {
      updatedMenu[index].price = parseFloat(value as string);
    } else if (field === 'name') {
      updatedMenu[index].name = value as string;
    } else if (field === 'category') {
      updatedMenu[index].category = value as string;
    }
    setMenu(updatedMenu);
  };

  const handleSave = async (item: MenuItem) => {
    try {
      await updateMenuItemPrice(item.id, item.price);
      alert(t('item_updated_successfully'));
    } catch (error) {
      console.error("Error updating menu item:", error);
      alert(t('failed_to_update_item'));
    }
  };

  const handleDelete = async (itemId: string) => {
    try {
      await deleteMenuItem(itemId);
      fetchMenu();
      alert(t('item_updated_successfully'));
    } catch (error) {
      console.error("Error deleting menu item:", error);
      alert(t('failed_to_delete_item'));
    }
  };

  const handleNewItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewItem(prev => ({ ...prev, [name]: value }));
  };

  const handleAddItem = async () => {
    if (!newItem.category || !newItem.name || !newItem.price) {
      alert(t('fill_all_fields'));
      return;
    }
    try {
      const allCategories = await getMenuItems();
      const selectedCategory = allCategories.data.find(cat => cat.name === newItem.category);

      if (!selectedCategory) {
        alert(t('category_not_found'));
        return;
      }

      await createMenuItem({
        name: newItem.name,
        description: newItem.description,
        price: parseFloat(newItem.price),
        menuCategoryId: selectedCategory.id,
      });
      setNewItem({ category: '', name: '', price: '' });
      fetchMenu();
      alert(t('new_item_added_successfully'));
    } catch (error) {
      console.error("Error adding new item:", error);
      alert(t('failed_to_add_new_item'));
    }
  };

  return (
    <div className="container">
      <CategoryManager
        categories={categories}
        menu={menu}
        fetchMenu={fetchMenu}
        fetchCategories={fetchCategories}
      />
      <MenuItemTable
        menu={menu}
        categories={categories}
        newItem={newItem}
        handleItemChange={handleItemChange}
        handleSave={handleSave}
        handleDelete={handleDelete}
        handleNewItemChange={handleNewItemChange}
        handleAddItem={handleAddItem}
      />
      <CategoryPriceUpdater
        categories={categories}
        fetchMenu={fetchMenu}
      />
    </div>
  );
};

export default MenuList;