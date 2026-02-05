export interface User {
  uid: string;
  email: string | null;
  name?: string;
  phone?: string;
  role: 'admin' | 'member';
}

export interface BankAccount {
  id: string;
  label: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
}

export interface ExpectationItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

export interface Service {
  id: string;
  title: string;
  time: string;
  description: string;
  icon?: string;
  imageUrl?: string;
  order: number;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  title: string;
  description: string;
  category: string;
  language: string;
  url: string;
  uploadedAt: Date;
  externalId?: string;
}

export interface CoreValue {
  title: string;
  description: string;
}

export interface CoreBelief {
  title: string;
  description: string;
}

export interface ChurchSettings {
  name: string;
  slogan: string;
  logoUrl: string;
  address: string;
  email: string;
  phone: string;
  facebookUrl: string;
  youtubeUrl: string;
  tiktokUrl: string;
  whatsappUrl: string;
  twitchUrl?: string;
  facebookPageId?: string;
  facebookAccessToken?: string;
  heroImages: string[];
  heroVideoUrl?: string;
  heroTitle: string;
  heroSubtitle: string;
  bankAccounts: BankAccount[];
  isLive: boolean;
  liveVideoUrl?: string;
  themeOfMonth: string;
  visitGuideText: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  stat3Value: string;
  stat3Label: string;
  partnershipWhatsappUrl: string;
  partnershipFeatures: string[];
  flutterwaveLink?: string;
  expectations: ExpectationItem[];
  // Administrative Fields for Home Page
  homeWelcomeSubtitle: string;
  homeWelcomeTitle: string;
  homeWelcomeText: string;
  atmosphereHeading: string;
  mediaHeading: string;
  mediaSubheading: string;
  fireNightHeading: string;
  footerAboutText: string;
  // New Administrative Fields for Giving Page
  givingHeading: string;
  givingSubtitle: string;
  givingFoundationText: string;
}

export interface AboutContent {
  mandate: string;
  vision: string;
  mission: string;
  story: string;
  pastorBio: string;
  pastorImageUrl: string;
  pastorWifeName?: string;
  pastorWifeImageUrl?: string;
  pastorWifeBio?: string;
  values: CoreValue[];
  beliefs: CoreBelief[];
}

export interface PrayerRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  request: string;
  submittedAt: Date;
}

export enum Page {
  Home = 'home',
  About = 'about',
  Departments = 'departments',
  Services = 'services',
  Giving = 'giving',
  Media = 'media',
  Prayer = 'prayer',
  Contact = 'contact',
  Auth = 'auth',
  Account = 'account'
}