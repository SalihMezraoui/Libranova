import React from 'react';
import { useTranslation } from 'react-i18next';

const AboutUs = () => {
  const { t } = useTranslation();

  return (
    <div className="container py-5 bg-light rounded shadow-sm">
      <h2 className="mb-4">{t('about_us.title')}</h2>
      <p>{t('about_us.description')}</p>
      <ul>
        <li>{t('about_us.point1')}</li>
        <li>{t('about_us.point2')}</li>
        <li>{t('about_us.point3')}</li>
      </ul>
    </div>
  );
};

export default AboutUs;
