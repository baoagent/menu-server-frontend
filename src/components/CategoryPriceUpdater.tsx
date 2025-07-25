import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getMenuItems, updateMenuItemPrice } from '../api.ts';

interface CategoryPriceUpdaterProps {
  categories: string[];
  fetchMenu: () => void;
}

const CategoryPriceUpdater: React.FC<CategoryPriceUpdaterProps> = ({ categories, fetchMenu }) => {
  const { t } = useTranslation();
  const [categoryPercentages, setCategoryPercentages] = useState<{ [key: string]: string }>({});

  const handleCategoryPercentageChange = (category: string, value: string) => {
    setCategoryPercentages(prev => ({ ...prev, [category]: value }));
  };

  const handleIncreaseCategoryPrices = async (category: string) => {
    const percentage = parseFloat(categoryPercentages[category]);
    if (!isNaN(percentage) && percentage > 0) {
      try {
        const response = await getMenuItems();
        const menuItems = response.data;
        const itemsToUpdate = menuItems.filter(item => item.category === category);

        for (const item of itemsToUpdate) {
          const newPrice = item.price * (1 + percentage / 100);
          await updateMenuItemPrice(item.id, parseFloat(newPrice.toFixed(2)));
        }

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

  return (
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
                value={categoryPercentages[category] || '10'}
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
  );
};

export default CategoryPriceUpdater;
