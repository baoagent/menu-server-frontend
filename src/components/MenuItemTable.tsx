import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';


interface MenuItem {
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

interface MenuItemTableProps {
  menu: MenuItem[];
  menuCategories: MenuCategory[];
  newItem: { category: string; name: string; price: string };
  handleItemChange: (index: number, field: string, value: string | number) => void;
  handleSave: (item: MenuItem) => Promise<void>;
  handleDelete: (itemId: string) => void;
  handleNewItemChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleAddItem: () => void;
}

const MenuItemTable: React.FC<MenuItemTableProps> = ({
  menu,
  newItem,
  handleItemChange,
  handleSave,
  handleDelete,
  handleNewItemChange,
  handleAddItem,
  menuCategories,
}) => {
  const { t } = useTranslation();
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});

  const toggleCategory = (categoryId: string) => {
    setOpenCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* Interactive Tree View */}
      <div style={{ minWidth: 200, marginRight: 24 }}>
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          {menuCategories.map(category => (
            <li key={category.id}>
              <div
                style={{ cursor: 'pointer', userSelect: 'none', fontWeight: 'bold' }}
                onClick={() => toggleCategory(category.id)}
              >
                {openCategories[category.id] ? '▼' : '▶'} {category.name}
              </div>
              {openCategories[category.id] && (
                <ul style={{ paddingLeft: 20 }}>
                  {category.menuItems.map(item => (
                    <li key={item.id}>{item.name}</li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
      {/* Table */}
      <div style={{ flex: 1 }}>
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
                        value={item.menuCategoryId}
                        onChange={(e) => handleItemChange(index, 'menuCategoryId', e.target.value)}
                      >
                        {menuCategories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
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
                      {menuCategories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
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
      </div>
    </div>
  );
};

export default MenuItemTable;
