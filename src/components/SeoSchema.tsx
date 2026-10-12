import React from 'react';

interface SeoSchemaProps {
  type?: 'website' | 'product';
  data?: any;
}

export const SeoSchema: React.FC<SeoSchemaProps> = ({ type = 'website', data }) => {
  let schemaJson = {};

  if (type === 'website') {
    schemaJson = {
      '@context': 'https://schema.org',
      '@type': 'OnlineStore',
      name: 'MINIMAL STUDIO E-COMMERCE',
      url: 'https://ecom-universal.vercel.app',
      description: 'แพลตฟอร์มอีคอมเมิร์ซโมเดิร์นมินิมอล รองรับทั้ง Web, iOS และ Android เชื่อมต่อ Shopee และ LINE',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://ecom-universal.vercel.app/?search={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
      paymentAccepted: 'PromptPay, Credit Card, Bank Transfer',
      currenciesAccepted: 'THB',
    };
  } else if (type === 'product' && data) {
    schemaJson = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: data.title,
      image: data.images,
      description: data.description,
      sku: data.sku,
      offers: {
        '@type': 'Offer',
        priceCurrency: 'THB',
        price: data.price,
        itemCondition: 'https://schema.org/NewCondition',
        availability:
          data.stock_quantity > 0
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
      },
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
    />
  );
};

