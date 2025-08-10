import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createCategory } from '../api.ts';
import { MenuCategory } from './MenuItemTable.tsx';

interface CategoryManagerProps {
  menuCategories: MenuCategory[];
  menu: any[]; // This should be more specific, but for now, any is fine
  fetchMenu: () => void;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({ menuCategories, menu, fetchMenu }) => {
  const { t } = useTranslation();
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleCreateCategory = async () => {
    if (!newCategoryName) {
      alert(t('enter_category_name'));
      return;
    }
    try {
      await createCategory(newCategoryName);
      setNewCategoryName('');
      fetchMenu();
      alert(t('category_created_successfully'));
    } catch (error) {
      console.error("Error creating category:", error);
      alert(t('failed_to_create_category'));
    }
  };

  return (
    <div className="section-card">
      <h2 className="section-title">{t('category_management')}</h2>
      <div className="category-creation">
        <input
          type="text"
          className="category-input"
          placeholder={t('new_category_name')}
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
        <button className="btn btn-save" onClick={handleCreateCategory}>
          {t('create_category')}
        </button>
      </div>
      <div className="category-list">
        <h3>{t('existing_categories')}</h3>
        <ul>
          {menuCategories.map(cat => (
            <li key={cat.id}>
              {cat.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CategoryManager;
