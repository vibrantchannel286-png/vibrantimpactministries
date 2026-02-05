
import { Service, Department } from './types';

export const ADMIN_EMAILS = ['eiweh123@gmail.com', 'vibrantchannel286@gmail.com', '5ej852963@gmail.com'];

export const DEFAULT_CHURCH_INFO = {
  name: 'Vibrant Impact Ministries',
  slogan: 'Raising Vibrant Believers for Kingdom Impact',
  address: 'Ughele Junction, along Ado Road, Akure, Ondo State, Nigeria',
  email: 'pastorvalentineifedayo@gmail.com',
  phone: '+234 800 000 0000',
  pastor: 'Prophet Valentine Ifedayo',
  logo: 'https://lh3.googleusercontent.com/d/1vV6tbXgw-7RB60wnzL-nGUQLz3xXO8S3',
  bankDetails: {
    bank: 'UBA (United Bank for Africa)',
    account: '1025522432',
    name: 'Valentine Ifedayo Ministries'
  }
};

export const MOCK_SERVICES: Service[] = [
  { id: '1', title: 'Sunday Glory Service', time: '9:00 AM', description: 'Main worship service with powerful praise and prophetic ministry.', icon: '🌟', order: 1 },
  { id: '2', title: 'Tuesday Deliverance', time: '9:00 AM', description: 'Dedicated service for deliverance and pastoral counseling.', icon: '🙏', order: 2 },
  { id: '3', title: 'Tuesday Online Prayer', time: '6:00 PM', description: 'Join us online for focused prayer and intercession.', icon: '💻', order: 3 },
  { id: '4', title: 'Friday Youth Fellowship', time: '4:00 PM', description: 'Vibrant gathering for young people to grow in faith.', icon: '🎯', order: 4 },
  { id: '5', title: 'Friday Bible Study', time: '6:00 PM', description: 'Deep dive into the Word of God to build faith.', icon: '📖', order: 5 },
  { id: '6', title: 'Fire Night Vigil', time: '10:00 PM', description: 'Last Friday of the month. Intense prayer and spiritual encounters.', icon: '🔥', order: 6 }
];

export const MOCK_DEPARTMENTS: Department[] = [
  { id: '1', name: 'Worship Team', description: 'Leading the congregation into God\'s presence through praise.', imageUrl: 'https://picsum.photos/seed/worship/800/600' },
  { id: '2', name: 'Media & Tech', description: 'Broadcasting the gospel through digital platforms.', imageUrl: 'https://picsum.photos/seed/media/800/600' },
  { id: '3', name: 'Ushering', description: 'Maintaining order and welcoming visitors with love.', imageUrl: 'https://picsum.photos/seed/usher/800/600' }
];

export const SOCIAL_LINKS = {
  facebook: 'https://facebook.com/VibrantImpactMinistries',
  youtube: 'https://youtube.com/@ProphetValentineIfedayoChannel',
  tiktok: 'https://tiktok.com/@prophet_valentineifedayo',
  twitch: 'https://twitch.tv/vibrantimpactministries',
  whatsapp: 'https://chat.whatsapp.com/your-group-link'
};

export const HERO_IMAGES = [
  'https://lh3.googleusercontent.com/d/1exCpQcpobaYeFM3LJx8EwrdCPYbmy_wy',
  'https://lh3.googleusercontent.com/d/1wYyfuB0DgYFH6GLFJX4EHcPIQMD_NKoX'
];
