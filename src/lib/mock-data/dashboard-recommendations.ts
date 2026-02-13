import { DashboardRecommendations } from './dashboard-types';

// Mock recommendations data for clinics and treatments
export const mockRecommendations: DashboardRecommendations = {
  clinics: [
    {
      id: '1',
      name: 'Nha Khoa Elite',
      city: 'Ho Chi Minh City',
      rating: 4.9,
      reviewCount: 234,
      matchScore: 98,
      reason: 'Top rated in HCMC',
      specialties: ['Implants', 'Veneers', 'Orthodontics']
    },
    {
      id: '2',
      name: 'Dental Paradise',
      city: 'Ho Chi Minh City',
      rating: 4.8,
      reviewCount: 189,
      matchScore: 95,
      reason: 'Best value for money',
      specialties: ['Cosmetic', 'Crowns', 'Root Canal']
    },
    {
      id: '3',
      name: 'Smile Studio',
      city: 'Hanoi',
      rating: 4.7,
      reviewCount: 156,
      matchScore: 92,
      reason: 'Highly recommended',
      specialties: ['Whitening', 'Cleaning', 'Cosmetic']
    },
    {
      id: '4',
      name: 'Elite Dental HCMC',
      city: 'Ho Chi Minh City',
      rating: 4.9,
      reviewCount: 298,
      matchScore: 97,
      reason: 'Premium service',
      specialties: ['Full Reconstruction', 'Implants', 'Cosmetic']
    }
  ],
  treatments: [
    {
      name: 'Porcelain Veneers',
      usPrice: 1500,
      vnPrice: 400,
      savings: 73,
      trending: true,
      reason: 'Popular this month'
    },
    {
      name: 'Dental Implants',
      usPrice: 3500,
      vnPrice: 1200,
      savings: 66,
      trending: true,
      reason: 'Most requested'
    },
    {
      name: 'Teeth Whitening',
      usPrice: 600,
      vnPrice: 280,
      savings: 53,
      trending: false,
      reason: 'Great value'
    }
  ]
};
