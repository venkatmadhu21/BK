import React from 'react';
import { HeartHandshake, History, Info, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import '../styles/heritage-background.css';

const About = () => {
  const { t } = useLanguage();

  const gallery = [
    { src: '/2.jpg', caption: t('aboutBKN.galleryCaption2') },
    { src: '/3.jpg', caption: t('aboutBKN.galleryCaption3') },
    { src: '/images/4.jpg', caption: t('aboutBKN.galleryCaption4') },
    { src: '/images/5.png', caption: t('aboutBKN.galleryCaption5') }
  ];

  const narrative = [t('aboutBKN.intro1'), t('aboutBKN.intro2')];

  const contentKeys = [
    t('aboutBKN.features'),
    t('aboutBKN.family'),
    t('aboutBKN.care'),
    t('aboutBKN.legacy'),
    t('aboutBKN.changes')
  ];

  const icons = [Sparkles, Users, HeartHandshake, ShieldCheck, History];

  const focusAreas = contentKeys.map((text, index) => ({
    Icon: icons[index],
    text
  }));

  return (
    <div className="heritage-bg relative min-h-screen overflow-hidden text-gray-900">
      <div className="heritage-gradient-overlay"></div>
      <div className="heritage-decoration"></div>
      <div className="heritage-decoration"></div>
      <div className="heritage-decoration"></div>
      <div className="heritage-decoration"></div>
      <div className="heritage-content relative">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <span className="absolute -left-24 top-32 hidden h-64 w-64 rounded-full bg-orange-500/18 blur-3xl sm:block"></span>
          <span className="absolute -right-20 bottom-16 hidden h-56 w-56 rounded-full bg-amber-400/18 blur-3xl md:block"></span>
          <span className="absolute left-1/2 top-0 h-32 w-32 -translate-x-1/2 rounded-full bg-white/10 blur-2xl"></span>
        </div>
        <section className="relative z-10 h-[340px] overflow-hidden rounded-b-[56px] shadow-2xl shadow-black/25 sm:h-[460px] md:h-[560px]">
          <img
            src="/images/main1.jpg"
            alt="BalKrishna Nivas historic facade"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/55 to-black/80"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/35 via-transparent to-transparent mix-blend-screen"></div>
          <div className="relative z-10 flex h-full items-center justify-center px-4 text-center text-white">
            <div className="max-w-3xl space-y-5">
              <div className="inline-flex items-center justify-center gap-3 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-orange-200">
                <Info className="h-4 w-4" />
                <span>{t('aboutBKN.subheading')}</span>
              </div>
              <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
                {t('aboutBKN.heading')}
              </h1>
              <div className="mx-auto h-1 w-28 rounded-full bg-gradient-to-r from-transparent via-orange-400 to-transparent"></div>
            </div>
          </div>
        </section>
        <section className="relative z-10 -mt-16 px-4 pb-20 sm:px-6 lg:-mt-24 lg:px-8">
          <div className="mx-auto max-w-6xl rounded-[34px] border border-white/60 bg-white/80 shadow-2xl backdrop-blur-xl">
            <div className="grid gap-12 p-8 sm:p-10 lg:grid-cols-[1.15fr,0.85fr] lg:gap-16 lg:p-14">
              <div className="space-y-6 text-sm leading-relaxed text-slate-700 sm:text-base">
                <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                  {t('aboutBKN.timelineTitle')}
                </h2>
                {narrative.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
              <div className="relative flex flex-col gap-6 pt-6">
                <span className="absolute left-10 top-10 h-[calc(100%-2.5rem)] w-px bg-gradient-to-b from-orange-300/80 via-orange-200/70 to-transparent"></span>
                {focusAreas.map(({ Icon, text }, index) => (
                  <div
                    key={index}
                    className="relative rounded-3xl bg-white/90 p-6 pl-16 shadow-xl shadow-black/5 transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl"
                  >
                    <span className="absolute left-6 top-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500/20 via-orange-400/10 to-white shadow-inner">
                      <Icon className="h-6 w-6 text-orange-500" />
                    </span>
                    <p className="text-sm leading-relaxed text-slate-700 sm:text-base">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        <section className="relative z-10 px-4 pb-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl overflow-hidden rounded-[34px] border border-white/50 bg-slate-900/85 shadow-2xl">
            <div className="grid divide-y divide-white/10 md:grid-cols-[0.9fr,1.1fr] md:divide-x md:divide-y-0">
              <div className="relative h-72 overflow-hidden md:h-full">
                <img
                  src="/images/shnkr&vas.jpg"
                  alt="BalKrishna Nivas courtyard and details"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-transparent"></div>
              </div>
              <div className="flex flex-col justify-center gap-6 p-8 text-white sm:p-10">
                <div className="space-y-3">
                  <span className="inline-flex rounded-full border border-white/30 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-orange-200">
                    {t('aboutBKN.subheading')}
                  </span>
                  <h3 className="text-2xl font-bold sm:text-3xl">
                    {t('aboutBKN.heading')}
                  </h3>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {focusAreas.map(({ text }, index) => (
                    <div key={index} className="rounded-3xl border border-white/15 bg-white/5 p-4 shadow-inner">
                      <div className="flex items-center gap-3 text-sm font-semibold tracking-wide text-orange-200">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-orange-200/60 text-xs">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span>{t('aboutBKN.subheading')}</span>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-white/80">
                        {text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="relative z-10 px-4 pb-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
              <h3 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                {t('aboutBKN.galleryTitle')}
              </h3>
              <p className="text-sm text-slate-600 sm:text-base">
                {t('aboutBKN.subheading')}
              </p>
              <div className="h-1 w-24 rounded-full bg-gradient-to-r from-transparent via-slate-500 to-transparent"></div>
            </div>
            <div className="mt-10 grid auto-rows-[180px] grid-cols-2 gap-4 sm:auto-rows-[230px] sm:gap-6 md:grid-cols-4">
              {gallery.map((img, index) => (
                <figure
                  key={index}
                  className="group relative flex h-full overflow-hidden rounded-3xl border border-white/40 bg-white/65 shadow-xl backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl"
                >
                  <img
                    src={img.src}
                    alt={img.caption}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <figcaption className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-black/45 to-transparent px-4 pb-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <span className="text-[11px] font-medium leading-snug text-white sm:text-xs md:text-sm">
                      {img.caption}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
        <section className="relative z-10 pb-20">
          <div className="mx-auto flex max-w-xl flex-col items-center gap-6 text-center">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-orange-500/18 via-orange-400/12 to-transparent blur-2xl"></div>
            <a
              href="/"
              className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-rose-500 px-9 py-3 text-sm font-semibold text-white shadow-xl transition-all duration-500 hover:translate-y-[-2px] hover:shadow-2xl sm:text-base"
            >
              <span>{t('aboutBKN.cta')}</span>
              <span aria-hidden="true" className="text-lg">→</span>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
