'use client';

import { useState } from 'react';

interface ServiceCardProps {
  icon: string;
  title: string;
  description: string;
  features: string[];
  price: string;
  period?: string;
  isPopular?: boolean;
  ctaText: string;
  ctaLink: string;
}

export default function ServiceCard({
  icon,
  title,
  description,
  features,
  price,
  period,
  isPopular = false,
  ctaText,
  ctaLink
}: ServiceCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
        isPopular ? 'ring-2 ring-purple-500' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
            Популярный
          </span>
        </div>
      )}

      {/* Icon */}
      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mb-6">
        <span className="text-2xl">{icon}</span>
      </div>

      {/* Title */}
      <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>

      {/* Description */}
      <p className="text-gray-400 mb-6 leading-relaxed">{description}</p>

      {/* Features */}
      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-gray-300">
            <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>

      {/* Price */}
      <div className="mb-6">
        <div className="text-4xl font-bold text-white mb-1">{price}</div>
        {period && <div className="text-gray-400">{period}</div>}
      </div>

      {/* CTA Button */}
      <a
        href={ctaLink}
        className={`block w-full py-3 px-6 rounded-lg font-semibold text-center transition-all duration-200 ${
          isPopular
            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
            : 'bg-gray-700 text-white hover:bg-gray-600'
        }`}
      >
        {ctaText}
      </a>
    </div>
  );
}
