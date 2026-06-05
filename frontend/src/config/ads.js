// Test Ads Configuration
export const testAds = [
  {
    id: 'top-banner-1',
    placement: 'top-banner',
    title: 'Premium Hosting Solution',
    description: 'Get 50% off your first year of hosting',
    imageUrl: 'https://via.placeholder.com/1200x150?text=Top+Banner+Ad+1',
    cta: 'Learn More',
    link: '#',
    color: 'bg-blue-50',
  },
  {
    id: 'sidebar-1',
    placement: 'sidebar',
    title: 'Tech Learning Platform',
    description: 'Master coding in 30 days - Special discount inside!',
    imageUrl: 'https://via.placeholder.com/300x250?text=Sidebar+Ad',
    cta: 'Enroll Now',
    link: '#',
    color: 'bg-purple-50',
  },
  {
    id: 'in-content-1',
    placement: 'in-content',
    title: 'Email Marketing Tool',
    description: 'Boost your engagement with our email platform',
    imageUrl: 'https://via.placeholder.com/600x200?text=In-Content+Ad+1',
    cta: 'Start Free Trial',
    link: '#',
    color: 'bg-green-50',
  },
  {
    id: 'in-content-2',
    placement: 'in-content',
    title: 'Cloud Database Service',
    description: 'Scalable database solutions for modern apps',
    imageUrl: 'https://via.placeholder.com/600x200?text=In-Content+Ad+2',
    cta: 'Get Started',
    link: '#',
    color: 'bg-orange-50',
  },
  {
    id: 'bottom-banner-1',
    placement: 'bottom-banner',
    title: 'Content Management System',
    description: 'Streamline your content creation workflow',
    imageUrl: 'https://via.placeholder.com/1200x150?text=Bottom+Banner+Ad',
    cta: 'Discover More',
    link: '#',
    color: 'bg-pink-50',
  },
  {
    id: 'sticky-footer-1',
    placement: 'sticky-footer',
    title: 'Web Development Course',
    description: 'Join 10,000+ developers learning full-stack development',
    imageUrl: 'https://via.placeholder.com/1200x100?text=Sticky+Footer+Ad',
    cta: 'Enroll Today',
    link: '#',
    color: 'bg-teal-50',
  },
];

export const ADSENSE_ENABLED = true;
export const ADSENSE_TEST_MODE = true; // Set to true to request safe test ads from Google
export const ADSENSE_CLIENT = 'ca-pub-4992424127755633';
export const ADSENSE_SLOT = '1295057918';
export const ADSENSE_LAYOUT_KEY = '-6t+ed+2i-1n-4w';
export const ADSENSE_FORMAT = 'fluid';

export const getAdsByPlacement = (placement) => {
  return testAds.filter((ad) => ad.placement === placement);
};

