import React from 'react';

export const WhyUsSection = React.forwardRef<HTMLDivElement>((_, ref) => {
  const values = [
    {
      icon: 'temp_preferences_custom',
      title: 'Taze Malzemeler',
      desc: 'Her sabah yerel üreticilerden temin edilen en taze sebzeler ve güvenilir kaynaklardan sağlanan et ürünleri.'
    },
    {
      icon: 'clean_hands',
      title: 'Hijyenik Ortam',
      desc: 'Mutfak hazırlığından servis aşamasına kadar uluslararası gıda güvenliği ve sanitasyon standartlarına tam uyum.'
    },
    {
      icon: 'speed',
      title: 'Hızlı Servis',
      desc: 'Sıcaklığını ve tazeliğini kaybetmeden, şık sunumlarla masanıza en kısa sürede ulaştırılan siparişler.'
    },
    {
      icon: 'sentiment_satisfied',
      title: 'Müşteri Memnuniyeti',
      desc: 'Her bir misafirimize kendisini özel hissettiren profesyonel, güler yüzlü ve kaliteli bir ağırlama deneyimi.'
    }
  ];

  return (
    <section ref={ref} className="py-24 bg-surface px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
      <div className="flex flex-col items-center mb-16 text-center">
        <span className="text-secondary font-label-md tracking-widest uppercase mb-2 block">Prensiplerimiz</span>
        <h2 className="font-headline-lg text-headline-lg text-primary mb-4">Neden Koç Restaurant?</h2>
        <div className="w-16 h-1 bg-secondary"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
        {values.map((item, idx) => (
          <div 
            key={idx}
            className="bg-surface-container-lowest p-8 rounded-2xl border border-surface-container/60 shadow-sm text-center flex flex-col items-center hover:shadow-lg transition-all duration-300 group hover:-translate-y-1"
          >
            <div className="w-16 h-16 rounded-full bg-secondary/5 flex items-center justify-center mb-6 group-hover:bg-secondary/10 transition-colors">
              <span className="material-symbols-outlined notranslate text-secondary text-4xl" translate="no">{item.icon}</span>
            </div>
            <h3 className="font-headline-md text-base text-primary mb-3 font-semibold">{item.title}</h3>
            <p className="font-body-md text-xs text-on-surface-variant leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
});

WhyUsSection.displayName = 'WhyUsSection';
