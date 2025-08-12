import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createCategory, deleteCategory } from '../api.ts';
import { MenuCategory } from './MenuItemTable.tsx';

interface CategoryManagerProps {
  menuCategories: MenuCategory[];
  menu: any[]; // This should be more specific, but for now, any is fine
  fetchMenu: () => void;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({ menuCategories, menu, fetchMenu }) => {
  const { t } = useTranslation();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');

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

  const handleDeleteCategory = async () => {
    if (!selectedCategoryId) {
      alert(t('select_category_to_delete'));
      return;
    }
    try {
      await deleteCategory(selectedCategoryId);
      setSelectedCategoryId('');
      fetchMenu();
      alert(t('category_deleted_successfully'));
    } catch (error) {
      console.error("Error deleting category:", error);
      alert(t('failed_to_delete_category'));
    }
  };

  const handleDeleteCategoryFromList = async (categoryId: string) => {
    try {
      await deleteCategory(categoryId);
      fetchMenu();
      alert(t('category_deleted_successfully'));
    } catch (error) {
      console.error("Error deleting category:", error);
      alert(t('failed_to_delete_category'));
    }
  };

  return (
    <div className="section-card">
      <h2 className="section-title">{t('category_management')}</h2>
      <div className="category-controls">
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
      </div>
      <div className="category-list">
        <h3>{t('existing_categories')}</h3>
        <ul>
          {menuCategories.map(cat => (
            <li key={cat.id}>
              {cat.name}
              <button className="delete-category-icon" onClick={() => handleDeleteCategoryFromList(cat.id)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
                </svg>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CategoryManager;
