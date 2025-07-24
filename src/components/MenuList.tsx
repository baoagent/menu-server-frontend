import React, { useEffect, useState } from 'react';
import { getMenuItems, updateMenuItemPrice, increaseCategoryPrice } from '../api.ts';
import { useTranslation } from 'react-i18next';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  menuCategoryId: string;
}

const MenuList: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [newPrice, setNewPrice] = useState<number | string>('');
  const [increaseCategory, setIncreaseCategory] = useState<string | null>(null);
  const [increasePercentage, setIncreasePercentage] = useState<number | string>('');

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const response = await getMenuItems();
      setMenu(response.data);
    } catch (error) {
      console.error("Error fetching menu:", error);
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setNewPrice(item.price);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem && typeof newPrice === 'number') {
      try {
        await updateMenuItemPrice(editingItem.id, newPrice);
        setEditingItem(null);
        fetchMenu();
      } catch (error) {
        console.error("Error updating menu item price:", error);
      }
    }
  };

  const handleIncreaseCategory = (category: string) => {
    setIncreaseCategory(category);
  };

  const handleIncreaseCategoryPrice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (increaseCategory && typeof increasePercentage === 'number') {
      try {
        await increaseCategoryPrice(increaseCategory, increasePercentage);
        setIncreaseCategory(null);
        setIncreasePercentage('');
        fetchMenu();
      } catch (error) {
        console.error("Error increasing category price:", error);
      }
    }
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="menu-list-container">
      <div className="language-switcher">
        <button onClick={() => changeLanguage('en')}>English</button>
        <button onClick={() => changeLanguage('zh')}>中文</button>
        <button onClick={() => changeLanguage('es')}>Español</button>
      </div>
      <h2>{t('menu')}</h2>
      {editingItem && (
        <form onSubmit={handleUpdate} className="edit-price-form">
          <h3>{t('edit_price')}</h3>
          <input
            type="number"
            value={newPrice}
            onChange={(e) => setNewPrice(parseFloat(e.target.value))}
            required
          />
          <button type="submit">{t('submit')}</button>
        </form>
      )}
      {increaseCategory && (
        <form onSubmit={handleIncreaseCategoryPrice} className="increase-price-form">
          <h3>{t('increase_category_price')}</h3>
          <input
            type="number"
            value={increasePercentage}
            onChange={(e) => setIncreasePercentage(parseFloat(e.target.value))}
            placeholder={t('percentage_increase')}
            required
          />
          <button type="submit">{t('submit')}</button>
        </form>
      )}
      <table>
        <thead>
          <tr>
            <th>{t('category')}</th>
            <th>{t('item_name')}</th>
            <th>{t('price')}</th>
            <th>{t('actions')}</th>
          </tr>
        </thead>
        <tbody>
          {menu.map((item) => (
            <tr key={item.id}>
              <td>{item.category}</td>
              <td>{item.name}</td>
              <td>{item.price}</td>
              <td>
                <button onClick={() => handleEdit(item)}>{t('edit')}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="category-buttons">
        <h3>{t('increase_price')}</h3>
        <button onClick={() => handleIncreaseCategory('Appetizer')}>{t('increase_category_price')} - Appetizer</button>
        <button onClick={() => handleIncreaseCategory('Main Course')}>{t('increase_category_price')} - Main Course</button>
        <button onClick={() => handleIncreaseCategory('Dessert')}>{t('increase_category_price')} - Dessert</button>
        <button onClick={() => handleIncreaseCategory('Beverage')}>{t('increase_category_price')} - Beverage</button>
      </div>
    </div>
  );
};

export default MenuList;
