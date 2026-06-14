import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toSlug } from '../../utils/slugify';

interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

interface CategoriesSectionProps {
  categories: Category[];
}

export const CategoriesSection = React.forwardRef<HTMLDivElement, CategoriesSectionProps>(
  ({ categories }, ref) => {
    const navigate = useNavigate();

    return (
      <section ref={ref} className="py-24 bg-surface px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
        <div className="flex flex-col items-center mb-16 text-center">
          <h2 className="font-headline-lg text-headline-lg text-primary mb-4">Lezzet Yolculuğumuz</h2>
          <div className="w-16 h-1 bg-secondary"></div>
        </div>
        
        {categories.length === 0 ? (
          // Grid placeholders in case database is not populated yet
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-gutter">
            {[
              { name: 'Mezeler', tag: 'Geleneksel Başlangıçlar', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBrH9XW_SyAE5m5jpNaPz6wqDINQoYfIdGes171lVkEhsuLcjiYGHALwhGWCMznElvB1F75CwU4zIfwceS9DUMvOHrN7iWVwzJ047YBr76jGh9J264LWoOE3PYFFHLvcgpjRyDFUOZCQp0UrkdM03WT4HTwPffgVO8JWNsOXYsQvwLYHV5QD6WLVJD11PuVlEgIEeT1ifEInRyjFgiKXu3F3M_ZnK7JM4IU7Pv06kxpw1s6lp5CDJn8io2kmcwT1SuOPtVOjFssf_-G' },
              { name: 'Izgaralar', tag: 'Ateşin Sanatı', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwojtyDGbzSqwbYWMbwnlQucTVa03eg8jUzbWJTfcC_ZXbUM2oivm-wdEAeRU5YnHjsPJWNKw8mvkFbeAo4R5e-nDYy9NMXKX4EYx0cVFOdfHIY2dQ-1KExFnz_4-3UftzURywB_d3zBO-RJc3OGDz8quoz0y_1CumGhozIFjsZmSmEqRMouKUqUHo9fkjqRjSzPQMP-VXRjgZSQknmioi4VRx6ffWt8OkBrKr42W7JmmXrUfinDDvm_ybdvzTjd6C0G21amzR8DNb' },
              { name: 'Tatlılar', tag: 'Tatlı Sonlar', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDum2Zq9gQWAe04yIbazt2GwlaB8Y3i9ZtxMROz6VNIRJVN6xKuG1JONtt9BdWgafZTgmP2ibFt0KPzAT2SGBdv3fGYazKziGWZ5j2lNxHmRHuVqi3VamJ1B1fcac28TYfd15V3PPwstbSS_DSunqwFdA4tSg5lGKyXguBndjgBoUCMp0ngJ6CO04BpHSPnbnOy6QVlWEpMMacEZPzI1dmWnc7ezxWKPuqihv7-fZr2Qk5eHZsRD234k8D5PPnMIwfsfNU3lJ1E18c-' },
              { name: 'İçecekler', tag: 'Özel Seçkiler', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnXAUo0VN4kThi-cPtgf1fTsLS41WQQDgmG7m5uymtUTJdvNTQtCJnel6lNljA9kBkuVigzUSV_nlhRpu9tQEAJFjVxZx-pnpxxtojlzkXoYBJO9BBEG2Ru9fA5TfZCj4ojICslLu8YOpRZbaV9Kj-DrQGxshn4PhB6Y-zTcPM8ZrzNKUXOos4vyGdVIvl2VHTKpVBcT-y8glnr4zwZjV6wbbvVK_eID2Q60nT7uZiZHwlaMg6zqVwLmxc0Mg3VZqr0ia0Y7ZYZdA6' }
            ].map((item, idx) => (
              <div 
                key={idx} 
                onClick={() => navigate(`/menu?category=${toSlug(item.name)}`)}
                className="group relative aspect-[4/5] overflow-hidden rounded-xl shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer"
              >
                <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.name} src={item.img} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-white font-headline-md text-headline-md">{item.name}</h3>
                  <p className="text-white/70 font-label-md">{item.tag}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Dynamic Category Grid
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-gutter">
            {categories.map((category) => (
              <div 
                key={category.id} 
                onClick={() => navigate(`/menu?category=${toSlug(category.name)}`)}
                className="group relative aspect-[4/5] overflow-hidden rounded-xl shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer"
              >
                <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={category.name} src={category.imageUrl} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-white font-headline-md text-headline-md">{category.name}</h3>
                  <p className="text-white/70 font-label-md truncate">{category.description || 'En Seçkin Lezzetler'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    );
  }
);

CategoriesSection.displayName = 'CategoriesSection';
