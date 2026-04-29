export default function StructuredData() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    '@id': 'https://startutoring.uk',
    name: 'Star Tutoring',
    alternateName: 'Star Tutoring Stretford',
    url: 'https://startutoring.uk',
    logo: 'https://startutoring.uk/logo.png',
    description:
      'Premium private and online tutoring centre in Stretford, Manchester. Qualified, DBS-checked tutors offering personalised tuition in Maths, English, Science, Engineering and Business for 11+, KS2, KS3, GCSE, A-Level and Degree-level students. Over 10 years of teaching experience.',
    telephone: '+447828186831',
    email: 'info@startutoring.uk',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '1st Floor, 2 Urmston Lane',
      addressLocality: 'Stretford',
      addressRegion: 'Manchester',
      postalCode: 'M32 9BP',
      addressCountry: 'GB'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 53.4457974,
      longitude: -2.3141703
    },
    areaServed: [
      { '@type': 'City', name: 'Manchester' },
      { '@type': 'City', name: 'Stretford' },
      { '@type': 'City', name: 'Trafford' },
      { '@type': 'City', name: 'Sale' },
      { '@type': 'City', name: 'Urmston' },
      { '@type': 'City', name: 'Old Trafford' },
      { '@type': 'City', name: 'Chorlton' },
      { '@type': 'City', name: 'Didsbury' },
      { '@type': 'City', name: 'Altrincham' }
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Tutoring Services',
      itemListElement: [
        {
          '@type': 'OfferCatalog',
          name: '11+ Preparation',
          itemListElement: [
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: '11+ Maths Tutoring Manchester' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: '11+ English Tutoring Manchester' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: '11+ Verbal Reasoning Tutoring' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: '11+ Non-Verbal Reasoning Tutoring' } }
          ]
        },
        {
          '@type': 'OfferCatalog',
          name: 'GCSE Tutoring',
          itemListElement: [
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'GCSE Maths Tutor Manchester' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'GCSE Physics Tutor Stretford' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'GCSE Chemistry Tutor Manchester' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'GCSE Biology Tutor Manchester' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'GCSE English Tutor Manchester' } }
          ]
        },
        {
          '@type': 'OfferCatalog',
          name: 'A-Level Tutoring',
          itemListElement: [
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'A-Level Maths Tutor Manchester' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'A-Level Physics Tutor Manchester' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'A-Level Chemistry Tutor Manchester' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'A-Level Biology Tutor Manchester' } }
          ]
        },
        {
          '@type': 'OfferCatalog',
          name: 'KS2 & KS3 Tutoring',
          itemListElement: [
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'KS2 Maths Tutor Stretford' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'KS3 Science Tutor Manchester' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Primary School Tutor Manchester' } }
          ]
        }
      ]
    },
    sameAs: [],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '20:00'
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday', 'Sunday'],
        opens: '10:00',
        closes: '18:00'
      }
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      reviewCount: '50',
      bestRating: '5'
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
