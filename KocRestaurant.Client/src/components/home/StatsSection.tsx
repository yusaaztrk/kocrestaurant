import React from 'react';

interface StatsSectionProps {
  menuCount: number;
}

export const StatsSection = React.forwardRef<HTMLDivElement, StatsSectionProps>(
  ({ menuCount }, ref) => {
    const stats = [
      {
        value: '1000+',
        label: 'Mutlu Müşteri',
        icon: 'diversity_1',
        desc: 'Bizleri tercih eden değerli misafirlerimiz'
      },
      {
        value: `${menuCount || 37}+`,
        label: 'Lezzetli Ürün Çeşidi',
        icon: 'restaurant_menu',
        desc: 'Usta şeflerimizin elinden taze ürünler'
      },
      {
        value: '5 Dk',
        label: 'Ortalama Servis',
        icon: 'avg_time',
        desc: 'Hızlı, taze ve sıcak servis garantisi'
      },
      {
        value: '4.9',
        label: 'Müşteri Puanı',
        icon: 'star',
        desc: 'Google & yerel platform değerlendirmeleri'
      }
    ];

    return (
      <section 
        ref={ref} 
        className="relative py-24 bg-primary-container overflow-hidden"
      >
        {/* Visual elements / Background Glows */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-72 h-72 bg-secondary/5 blur-[120px] rounded-full"></div>
        <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-72 h-72 bg-secondary/5 blur-[120px] rounded-full"></div>

        <div className="relative max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop w-full">
          <div className="flex flex-col items-center mb-16 text-center">
            <span className="text-secondary-fixed-dim font-label-md tracking-widest uppercase mb-2 block">Başarılarımız</span>
            <h2 className="font-headline-lg text-headline-lg text-white mb-4">Rakamlarla Koç Restaurant</h2>
            <div className="w-16 h-1 bg-secondary"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {stats.map((item, idx) => (
              <div 
                key={idx}
                className="bg-black/40 border border-white/5 p-8 rounded-2xl text-center flex flex-col items-center hover:border-secondary/40 transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-secondary/10 transition-colors">
                  <span className="material-symbols-outlined notranslate text-secondary text-2xl" translate="no">
                    {item.icon === 'star' ? 'star_rate' : item.icon === 'avg_time' ? 'schedule' : item.icon}
                  </span>
                </div>
                
                <span className="font-display-lg text-4xl text-secondary-fixed-dim font-bold mb-2 tracking-tight group-hover:scale-105 transition-transform duration-300">
                  {item.value}
                </span>
                
                <h3 className="font-headline-md text-base text-white mb-2 font-medium">{item.label}</h3>
                <p className="font-body-md text-xs text-white/50 leading-relaxed max-w-[200px]">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
);

StatsSection.displayName = 'StatsSection';
