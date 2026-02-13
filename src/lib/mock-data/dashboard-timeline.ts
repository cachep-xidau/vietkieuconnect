import { TimelineActivity } from './dashboard-types';

// Mock timeline activities (15 diverse items spanning different statuses and types)
export const mockActivities: TimelineActivity[] = [
  {
    id: '1',
    type: 'consultation',
    status: 'quoted',
    date: '2026-02-12T10:30:00',
    title: 'Quote received',
    subtitle: 'Dental implant consultation',
    clinic: { name: 'Dental Paradise', city: 'Ho Chi Minh City' },
    price: 1200,
    details: 'Single implant with crown. Treatment time: 2 visits over 3 months.'
  },
  {
    id: '2',
    type: 'booking',
    status: 'confirmed',
    date: '2026-02-11T14:00:00',
    title: 'Appointment confirmed',
    subtitle: 'Initial consultation',
    clinic: { name: 'Nha Khoa Elite', city: 'Ho Chi Minh City' },
    details: 'First visit for treatment planning and x-rays.'
  },
  {
    id: '3',
    type: 'review',
    status: 'completed',
    date: '2026-02-10T09:15:00',
    title: 'Review submitted',
    subtitle: 'Teeth whitening service',
    clinic: { name: 'Smile Studio', city: 'Hanoi' },
    details: 'Gave 5-star rating for excellent service and results.'
  },
  {
    id: '4',
    type: 'consultation',
    status: 'pending',
    date: '2026-02-09T16:20:00',
    title: 'Consultation requested',
    subtitle: 'Veneers consultation',
    clinic: { name: 'Dental Paradise', city: 'Ho Chi Minh City' },
    details: 'Waiting for clinic response (usually 24-48 hours).'
  },
  {
    id: '5',
    type: 'booking',
    status: 'pending',
    date: '2026-02-08T11:00:00',
    title: 'Booking pending',
    subtitle: 'Root canal treatment',
    clinic: { name: 'Premium Dental', city: 'Da Nang' },
    price: 350,
    details: 'Awaiting payment confirmation to finalize booking.'
  },
  {
    id: '6',
    type: 'consultation',
    status: 'quoted',
    date: '2026-02-07T13:45:00',
    title: 'Quote received',
    subtitle: 'Orthodontic braces',
    clinic: { name: 'Ortho Clinic VN', city: 'Ho Chi Minh City' },
    price: 2800,
    details: 'Metal braces with 18-month treatment plan.'
  },
  {
    id: '7',
    type: 'review',
    status: 'completed',
    date: '2026-02-06T10:30:00',
    title: 'Review submitted',
    subtitle: 'Dental cleaning',
    clinic: { name: 'Nha Khoa Elite', city: 'Ho Chi Minh City' },
    details: 'Professional cleaning service was thorough and painless.'
  },
  {
    id: '8',
    type: 'booking',
    status: 'confirmed',
    date: '2026-02-05T15:00:00',
    title: 'Appointment confirmed',
    subtitle: 'Crown replacement',
    clinic: { name: 'Dental Paradise', city: 'Ho Chi Minh City' },
    price: 450,
    details: 'Porcelain crown replacement scheduled.'
  },
  {
    id: '9',
    type: 'consultation',
    status: 'completed',
    date: '2026-02-04T09:00:00',
    title: 'Consultation completed',
    subtitle: 'Wisdom tooth extraction',
    clinic: { name: 'Smile Studio', city: 'Hanoi' },
    details: 'Treatment plan approved, proceeding to booking.'
  },
  {
    id: '10',
    type: 'booking',
    status: 'completed',
    date: '2026-02-03T14:30:00',
    title: 'Treatment completed',
    subtitle: 'Dental filling',
    clinic: { name: 'Premium Dental', city: 'Da Nang' },
    price: 180,
    details: 'Composite filling on upper left molar.'
  },
  {
    id: '11',
    type: 'consultation',
    status: 'quoted',
    date: '2026-02-02T11:15:00',
    title: 'Quote received',
    subtitle: 'Full mouth reconstruction',
    clinic: { name: 'Elite Dental HCMC', city: 'Ho Chi Minh City' },
    price: 8500,
    details: 'Comprehensive treatment including implants and crowns.'
  },
  {
    id: '12',
    type: 'review',
    status: 'completed',
    date: '2026-02-01T16:00:00',
    title: 'Review submitted',
    subtitle: 'Gum treatment',
    clinic: { name: 'Ortho Clinic VN', city: 'Ho Chi Minh City' },
    details: 'Periodontal treatment was effective and professional.'
  },
  {
    id: '13',
    type: 'booking',
    status: 'confirmed',
    date: '2026-01-31T10:00:00',
    title: 'Appointment confirmed',
    subtitle: 'Dental checkup',
    clinic: { name: 'Nha Khoa Elite', city: 'Ho Chi Minh City' },
    details: 'Annual checkup and x-rays scheduled.'
  },
  {
    id: '14',
    type: 'consultation',
    status: 'pending',
    date: '2026-01-30T13:30:00',
    title: 'Consultation requested',
    subtitle: 'Invisalign treatment',
    clinic: { name: 'Smile Studio', city: 'Hanoi' },
    details: 'Submitted inquiry about clear aligner options.'
  },
  {
    id: '15',
    type: 'booking',
    status: 'completed',
    date: '2026-01-29T09:45:00',
    title: 'Treatment completed',
    subtitle: 'Teeth whitening',
    clinic: { name: 'Premium Dental', city: 'Da Nang' },
    price: 280,
    details: 'Professional whitening treatment with excellent results.'
  }
];
