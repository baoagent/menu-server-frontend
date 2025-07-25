import React, { useEffect, useState } from 'react';
import { getMenuItems, updateMenuItemPrice, increaseCategoryPrice, createMenuItem, deleteMenuItem } from '../api.ts';
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
  const { t } = useTranslation();
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [newItem, setNewItem] = useState({ category: '', name: '', price: '' });
  const [categoryPercentages, setCategoryPercentages] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const response = await getMenuItems();
      setMenu(response.data);
      const initialPercentages: { [key: string]: string } = {};
      // Assuming categories are unique and can be extracted from menu items
      const categories = Array.from(new Set(response.data.map(item => item.category)));
      categories.forEach(cat => {
        initialPercentages[cat] = '10'; // Default to 10%
      });
      setCategoryPercentages(initialPercentages);
    } catch (error) {
      console.error("Error fetching menu:", error);
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
      await createMenuItem({
        name: newItem.name,
        price: parseFloat(newItem.price),
        category: newItem.category,
      });
      setNewItem({ category: '', name: '', price: '' });
      fetchMenu();
      alert(t('new_item_added_successfully'));
    } catch (error) {
      console.error("Error adding new item:", error);
      alert(t('failed_to_add_new_item'));
    }
  };

  const handleCategoryPercentageChange = (category: string, value: string) => {
    setCategoryPercentages(prev => ({ ...prev, [category]: value }));
  };

  const handleIncreaseCategoryPrices = async (category: string) => {
    const percentage = parseFloat(categoryPercentages[category]);
    if (!isNaN(percentage) && percentage > 0) {
      try {
        await increaseCategoryPrice(category, percentage);
        fetchMenu(); // Re-fetch menu to show updated prices
        alert(t('prices_increased_by', { category, percentage }));
      } catch (error) {
        console.error(`Error increasing prices for ${category}:`, error);
        alert(t('failed_to_increase_prices', { category }));
      }
    } else {
      alert(t('enter_valid_percentage'));
    }
  };

  

  const categories = Array.from(new Set(menu.map(item => item.category)));

  return (
    <div className="container">
      

      {/* Menu Items Management */}
      <div className="section-card">
        <h2 className="section-title">{t('menu_items')}</h2>
        <div className="menu-table-container">
          <table className="menu-table">
            <thead>
              <tr>
                <th>{t('category')}</th>
                <th>{t('item_name')}</th>
                <th>{t('price')} ($)</th>
                <th>{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {menu.map((item, index) => (
                <tr key={item.id}>
                  <td>
                    <select
                      className="category-select"
                      value={item.category}
                      onChange={(e) => handleItemChange(index, 'category', e.target.value)}
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="text"
                      className="item-name-input"
                      value={item.name}
                      onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="price-input"
                      value={item.price != null ? item.price.toFixed(2) : ''}
                      step="0.25"
                      onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                    />
                  </td>
                  <td>
                    <button className="btn btn-save" onClick={() => handleSave(item)}>{t('save')}</button>
                    <button className="btn btn-delete" onClick={() => handleDelete(item.id)}>{t('delete')}</button>
                  </td>
                </tr>
              ))}
              {/* New Item Row */}
              <tr className="new-item-row">
                <td>
                  <select
                    className="category-select"
                    name="category"
                    value={newItem.category}
                    onChange={handleNewItemChange}
                  >
                    <option value="">{t('select_category')}</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="text"
                    className="item-name-input"
                    name="name"
                    placeholder={t('enter_item_name')}
                    value={newItem.name}
                    onChange={handleNewItemChange}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="price-input"
                    name="price"
                    placeholder="0.00"
                    step="0.25"
                    value={newItem.price}
                    onChange={handleNewItemChange}
                  />
                </td>
                <td>
                  <button className="btn btn-save" onClick={handleAddItem}>{t('add_item')}</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Category Price Updates */}
      <div className="section-card">
        <h2 className="section-title">{t('update_category_prices')}</h2>
        <div className="category-updates">
          {categories.map(category => (
            <div className="category-update-item" key={category}>
              <div className="category-name">{category}</div>
              <div className="update-controls">
                <span>{t('increase_all_prices_by')}</span>
                <input
                  type="number"
                  className="percentage-input"
                  value={categoryPercentages[category]}
                  min="0"
                  max="100"
                  onChange={(e) => handleCategoryPercentageChange(category, e.target.value)}
                />
                <span>%</span>
                <button className="btn btn-increase" onClick={() => handleIncreaseCategoryPrices(category)}>
                  {t('update_prices')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuList;