
import React from 'react';
import { Helmet } from 'react-helmet';
// The Link and ChevronRight imports are no longer needed as breadcrumbs are removed.
// import { Link } from 'react-router-dom';
// import { ChevronRight } from 'lucide-react';
import ProductsList from '@/components/ProductsList';

const StorePage = () => {
  return (
    <>
      <Helmet>
        <title>Maslow Store - Support The Cause</title>
        <meta name="description" content="Purchase Maslow merchandise and support our mission to provide dignified public restrooms in NYC." />
      </Helmet>
      
      <div className="min-h-screen bg-[#F5F1E8]">
        {/* The breadcrumbs section and any other hero/title elements have been removed as per Task 1. */}
        {/* Product Grid */}
        <div className="container mx-auto px-4 py-6 pb-24"> {/* Adjusted top padding for content start */}
          <ProductsList />
        </div>
      </div>
    </>
  );
};

export default StorePage;
