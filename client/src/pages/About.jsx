import React from 'react';
import { Info } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const About = () => {
  const { t } = useLanguage();

  const gallery = [
    { src: '/2.jpg', caption: t('aboutBKN.galleryCaption2') },
    { src: '/3.jpg', caption: t('aboutBKN.galleryCaption3') },
    { src: '/images/4.jpg', caption: t('aboutBKN.galleryCaption4') },
    { src: '/images/5.png', caption: t('aboutBKN.galleryCaption5') }
  ];
  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-100 to-stone-200 text-gray-900">
      {/* Hero Section */}
      <section className="relative h-[320px] sm:h-[420px] md:h-[520px] overflow-hidden">
        <img
          src="/images/main1.jpg"
          alt="BalKrishna Nivas historic facade"
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 " />
        <div className="relative z-10 h-full flex items-center justify-center text-center text-white px-4">
          <div>
            <div className="flex items-center justify-center gap-3 mb-3">
              <Info className="text-orange-300" size={28} />
              <span className="text-orange-200 font-semibold tracking-wide text-xs sm:text-sm">
                {t('aboutBKN.subheading')}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold drop-shadow-lg">
              {t('aboutBKN.heading')}
            </h1>
            <div className="mt-4 w-24 sm:w-32 h-1 bg-gradient-to-r from-transparent via-orange-400 to-transparent mx-auto rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Story Card */}
      <section className="relative -mt-10 sm:-mt-12 md:-mt-16 pb-8 sm:pb-12 md:pb-16 px-3 xs:px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl bg-white/90 backdrop-blur rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10 lg:p-12">
          <div className="prose max-w-none prose-sm sm:prose-base text-gray-800 leading-relaxed">
            <p>{t('aboutBKN.intro1')}</p>
            <p>{t('aboutBKN.intro2')}</p>
            <p>{t('aboutBKN.features')}</p>
            <p>{t('aboutBKN.family')}</p>
            <p>{t('aboutBKN.care')}</p>
            <p>{t('aboutBKN.legacy')}</p>
            <p>{t('aboutBKN.changes')}</p>
          </div>
        </div>
      </section>

      {/* Secondary Feature Image with soft parallax feel */}
      <section className="relative px-3 xs:px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-2xl overflow-hidden shadow-xl">
          <div className="relative group">
            <img
              src="/images/shnkr&vas.jpg"
              alt="BalKrishna Nivas courtyard and details"
              className="w-full h-60 sm:h-80 md:h-[420px] object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold">
                {t('aboutBKN.timelineTitle')}
              </h2>
              <p className="text-xs sm:text-sm text-white/90">
                {t('aboutBKN.subheading')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Historic Gallery */}
      <section className="px-3 xs:px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 md:pt-16 pb-8 sm:pb-12">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-6 sm:mb-8">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {t('aboutBKN.galleryTitle')}
            </h3>
            <div className="mt-3 w-24 sm:w-28 h-1 bg-gradient-to-r from-transparent via-stone-400 to-transparent mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {gallery.map((img, idx) => (
              <figure key={idx} className="relative group rounded-xl overflow-hidden shadow-lg">
                <img
                  src={img.src}
                  alt={img.caption}
                  className="w-full h-36 sm:h-44 md:h-56 object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <figcaption className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-white flex items-end p-2 sm:p-3">
                  <span className="text-[10px] sm:text-xs md:text-sm leading-snug">
                    {img.caption}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-12">
        <div className="text-center">
          <a
            href="/"
            className="inline-block bg-orange-600 hover:bg-orange-700 text-white text-sm sm:text-base font-semibold px-5 py-2.5 rounded-xl shadow-md transition-colors"
          >
            {t('aboutBKN.cta')}
          </a>
        </div>
      </section>
    </div>
  );
};

export default About;