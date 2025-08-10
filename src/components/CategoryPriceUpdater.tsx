import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getMenuItems, MenuItem, updateMenuItemPrice } from '../api.ts';
import { MenuCategory } from './MenuItemTable.tsx';

interface CategoryPriceUpdaterProps {
  menuCategories: MenuCategory[];
  fetchMenu: () => void;
}

const CategoryPriceUpdater: React.FC<CategoryPriceUpdaterProps> = ({ menuCategories, fetchMenu }) => {
  const { t } = useTranslation();
  const [categoryPercentages, setCategoryPercentages] = useState<{ [key: string]: string }>({});

  const handleCategoryPercentageChange = (category: string, value: string) => {
    setCategoryPercentages(prev => ({ ...prev, [category]: value }));
  };

  const handleIncreaseCategoryPrices = async (categoryId: string, categoryName: string) => {
    const percentage = parseFloat(categoryPercentages[categoryId]);

    if (!isNaN(percentage) && percentage > 0) {
      try {
        const response = await getMenuItems();
        const allMenuItems: MenuItem[] = response.data.flatMap(categoryItem => categoryItem.menuItems);
        const itemsToUpdate = allMenuItems.filter(item => item.menuCategoryId === categoryId);
        for (const item of itemsToUpdate) {
          const newPrice = item.price * (1 + percentage / 100);
          await updateMenuItemPrice(item.id, parseFloat(newPrice.toFixed(2)));
        }

        fetchMenu(); // Re-fetch menu to show updated prices
        alert(t('prices_increased_by', { category: categoryName, percentage }));
      } catch (error) {
        console.error(`Error increasing prices for ${categoryName}:`, error);
        alert(t('failed_to_increase_prices', { category: categoryName }));
      }
    } else {
      alert(t('enter_valid_percentage'));
    }
  };

  return (
    <div className="section-card">
      <h2 className="section-title">{t('update_category_prices')}</h2>
      <div className="category-updates">
        {menuCategories.map(category => (
          <div className="category-update-item" key={category.id}>
            <div className="category-name">{category.name}</div>
            <div className="update-controls">
              <span>{t('increase_all_prices_by')}</span>
              <input
                type="number"
                className="percentage-input"
                value={categoryPercentages[category.id] || 10}
                min={0}
                max={100}
                onChange={(e) => handleCategoryPercentageChange(category.id, e.target.value)}
              />
              <span>%</span>
              <button className="btn btn-increase" onClick={() => handleIncreaseCategoryPrices(category.id, category.name)}>
                {t('update_prices')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryPriceUpdater;
