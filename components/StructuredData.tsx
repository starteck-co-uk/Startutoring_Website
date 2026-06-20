export default function StructuredData() {
  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    '@id': 'https://startutoring.uk',
    name: 'Star Tutoring',
    alternateName: 'Star Tutoring Stretford',
    url: 'https://startutoring.uk',
    logo: 'https://startutoring.uk/logo.png',
    description:
      'Premium private and online tutoring centre in Stretford, Manchester. Qualified, DBS-checked tutors offering personalised tuition in Maths, English, Verbal Reasoning and Non-Verbal Reasoning for 11+ GL Assessment, KS2, KS3, GCSE and A-Level students. Over 10 years of teaching experience.',
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
          name: 'KS2 & KS3 Tutoring',
          itemListElement: [
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'KS2 Maths Tutor Stretford' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'KS3 Maths Tutor Manchester' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'KS2 English Tutor Manchester' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Primary School Tutor Manchester' } }
          ]
        },
        {
          '@type': 'OfferCatalog',
          name: 'GCSE & A-Level Tutoring',
          itemListElement: [
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'GCSE Maths Tutor Manchester' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'GCSE English Tutor Manchester' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'A-Level Maths Tutor Manchester' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'A-Level English Tutor Manchester' } }
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

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How much does private tutoring in Manchester cost?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our rates are designed to be affordable for every family. We offer flexible payment plans with no hidden fees. Contact us for a personalised quote based on your child\'s needs and schedule.'
        }
      },
      {
        '@type': 'Question',
        name: 'Do you offer online tutoring as well as in-person?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! We offer both online and in-person tutoring from our centre in Stretford, Manchester. Online sessions use interactive tools and every lesson is recorded so students can revisit material anytime.'
        }
      },
      {
        '@type': 'Question',
        name: 'What subjects do you cover for GCSE and A-Level?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We specialise in Maths, English, Verbal Reasoning and Non-Verbal Reasoning across all levels. Our core focus is 11+ GL Assessment preparation, with expert tuition available for KS2, KS3, GCSE and A-Level.'
        }
      },
      {
        '@type': 'Question',
        name: 'How does the free assessment work?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We invite your child for a friendly, no-pressure assessment to understand their current level, strengths, and areas to improve. Based on this, we create a personalised learning plan tailored to their goals.'
        }
      },
      {
        '@type': 'Question',
        name: 'Are your tutors qualified and DBS checked?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Absolutely. All our tutors are fully qualified with relevant degrees, have 10+ years of teaching experience, and are DBS-checked. Our director holds degrees in Electronics Engineering, International Business Management, and Educational Leadership.'
        }
      },
      {
        '@type': 'Question',
        name: 'Do you prepare students for the 11+ exam in Manchester?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, we run a structured 11+ preparation programme covering Maths, English, Verbal Reasoning, and Non-Verbal Reasoning. This includes weekly mock exams, detailed feedback, and exam technique training.'
        }
      }
    ]
  };

  const localBusinessJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Star Tutoring',
    image: 'https://startutoring.uk/logo.png',
    '@id': 'https://startutoring.uk/#localbusiness',
    url: 'https://startutoring.uk',
    telephone: '+447828186831',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '1st Floor, 2 Urmston Lane',
      addressLocality: 'Stretford',
      addressRegion: 'Greater Manchester',
      postalCode: 'M32 9BP',
      addressCountry: 'GB'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 53.4457974,
      longitude: -2.3141703
    },
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
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
    </>
  );
}
