import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  onSnapshot, 
  collection, 
  query, 
  orderBy,
  addDoc,
  deleteDoc,
  Timestamp
} from 'firebase/firestore';
import { MediaItem, Service, Department, AboutContent, ChurchSettings, BankAccount, PrayerRequest } from '../types';
import { MOCK_SERVICES, MOCK_DEPARTMENTS, DEFAULT_CHURCH_INFO, HERO_IMAGES, SOCIAL_LINKS } from '../constants';

const firebaseConfig = {
  apiKey: "AIzaSyCq_oTglifUXtmrlAAmEmySLA83N8oAuK0",
  authDomain: "vibrant-impact-ministries.firebaseapp.com",
  projectId: "vibrant-impact-ministries",
  storageBucket: "vibrant-impact-ministries.firebasestorage.app",
  messagingSenderId: "506206194708",
  appId: "1:506206194708:web:7edfa504027a74d3b22b01",
  measurementId: "G-ZCMB23P9QV"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const COLLECTIONS = {
  MEDIA: 'media',
  SERVICES: 'services',
  DEPARTMENTS: 'departments',
  ABOUT: 'about',
  SETTINGS: 'settings',
  PRAYER: 'prayer_requests'
};

const DEFAULT_SETTINGS: ChurchSettings = {
  name: DEFAULT_CHURCH_INFO.name,
  slogan: DEFAULT_CHURCH_INFO.slogan,
  logoUrl: DEFAULT_CHURCH_INFO.logo,
  address: DEFAULT_CHURCH_INFO.address,
  email: DEFAULT_CHURCH_INFO.email,
  phone: DEFAULT_CHURCH_INFO.phone,
  facebookUrl: SOCIAL_LINKS.facebook,
  youtubeUrl: SOCIAL_LINKS.youtube,
  tiktokUrl: SOCIAL_LINKS.tiktok,
  whatsappUrl: SOCIAL_LINKS.whatsapp,
  twitchUrl: SOCIAL_LINKS.twitch,
  heroImages: HERO_IMAGES,
  heroVideoUrl: '', 
  heroTitle: "Where Your Soul Finds Purpose",
  heroSubtitle: "A Glorious People • A Vibrant People",
  bankAccounts: [
    { id: '1', label: 'TITHE & OFFERING', bankName: 'UBA', accountNumber: '1025522432', accountName: 'Valentine Ifedayo Ministries' },
    { id: '2', label: 'BUILDING PROJECT', bankName: 'Zenith Bank', accountNumber: '1234567890', accountName: 'VIM Building Fund' }
  ],
  isLive: false,
  liveVideoUrl: '',
  themeOfMonth: 'Divine Acceleration',
  visitGuideText: 'Welcome to Akure! Vibrant Impact Ministries is located at Ughele Junction, easy to find from any part of the city. We recommend arriving 15 minutes early to find good parking and soak in the atmosphere.',
  stat1Value: '12+',
  stat1Label: 'GLOBAL CENTERS',
  stat2Value: '5k+',
  stat2Label: 'LIVES IMPACTED',
  stat3Value: '24/7',
  stat3Label: 'PRAYER ACCESS',
  partnershipWhatsappUrl: 'https://chat.whatsapp.com/your-partnership-link',
  partnershipFeatures: [
    "Prophetic Cover & Systematic Prayer",
    "Access to Monthly Partners' Insight Library",
    "Priority Seating at VIM Global Conferences"
  ],
  flutterwaveLink: 'https://flutterwave.com/pay/vim-partnership',
  homeWelcomeSubtitle: "A Heartfelt Welcome",
  homeWelcomeTitle: "Raising Vibrant Believers",
  homeWelcomeText: "Vibrant Impact Ministries is a global prophetic hub where we gather to experience the raw power of God, walk in deep spiritual enlightenment, and undergo territorial transformation.",
  atmosphereHeading: "Experience God's Power",
  mediaHeading: "The Library",
  mediaSubheading: "Apostolic teachings for the global believer.",
  fireNightHeading: "Prepare for the Fire",
  footerAboutText: "We are a global apostolic and prophetic ministry commissioned with the mandate to raise vibrant believers who burn for God and transform territories through the uncompromised Word.",
  givingHeading: "Giving & Seed",
  givingSubtitle: "A Generous Soul Prosper",
  givingFoundationText: "Give, and it shall be given unto you; good measure, pressed down, and shaken together, and running over...",
  expectations: [
    { id: '1', title: 'Atmosphere', description: 'Expect a warm, high-energy environment filled with faith and the palpable presence of the Holy Spirit.', imageUrl: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=400&q=80' },
    { id: '2', title: 'Worship Style', description: 'Our worship is vibrant, prophetic, and deep—designed to lift your spirit and connect you to the throne room.', imageUrl: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=400&q=80' },
    { id: '3', title: 'Message', description: 'Prepare for the uncompromised Word of God, delivered with apostolic authority and prophetic clarity.', imageUrl: 'https://images.unsplash.com/photo-1544427920-c49ccfb85579?auto=format&fit=crop&w=400&q=80' },
    { id: '4', title: 'Parking & Access', description: 'Our hospitality team will guide you to convenient parking right at the Ughele Junction entrance.', imageUrl: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=400&q=80' }
  ]
};

const DEFAULT_ABOUT: AboutContent = {
  mandate: "Raising vibrant believers for kingdom impact through the uncompromised Word of God and the demonstration of the Spirit's power.",
  vision: "To see a generation ignited with the fire of the Holy Spirit, walking in divine authority and transforming territories for Christ.",
  mission: "Equipping the saints through deep prophetic insights, intensive prayers, and the teaching of sound biblical principles.",
  story: "Vibrant Impact Ministries (VIM) started with a divine commission given to Prophet Valentine Ifedayo to 'Go and raise me a vibrant people.' Since its inception in Akure, the ministry has been a lighthouse of hope and spiritual awakening.",
  pastorBio: "Prophet Valentine Ifedayo is a dynamic prophetic voice called to this generation. Known for his accuracy in the prophetic and deep passion for souls, he leads VIM with a fatherly heart and a burning desire for kingdom advancement.",
  pastorImageUrl: "https://lh3.googleusercontent.com/d/1vV6tbXgw-7RB60wnzL-nGUQLz3xXO8S3",
  values: [
    { title: "Spiritual Vibrancy", description: "A lifestyle of constant communion with the Holy Spirit." },
    { title: "Integrity", description: "Upholding kingdom standards in all character and conduct." },
    { title: "Excellence", description: "Doing ministry with high quality for the glory of God." },
    { title: "Love", description: "Unconditional commitment to God and humanity." }
  ],
  beliefs: [
    { title: "The Holy Bible", description: "The inspired and only infallible, authoritative Word of God." },
    { title: "The Trinity", description: "There is one God, eternally existent in three persons: Father, Son and Holy Spirit." },
    { title: "Salvation", description: "Regeneration by the Holy Spirit is absolutely essential for personal salvation." }
  ]
};

let cachedMedia: MediaItem[] = [];
let cachedServices: Service[] = MOCK_SERVICES;
let cachedDepartments: Department[] = MOCK_DEPARTMENTS;
let cachedAbout: AboutContent = DEFAULT_ABOUT;
let cachedSettings: ChurchSettings = DEFAULT_SETTINGS;
let cachedPrayers: PrayerRequest[] = [];

// A safer sanitize function that avoids deep recursion on internal objects 
// and strips any potential circularity by only allowing plain serializable types.
const sanitizeData = (data: any): any => {
  return JSON.parse(JSON.stringify(data, (key, value) => {
    if (value instanceof Date) return value.toISOString();
    if (value && typeof value === 'object' && value.seconds !== undefined && value.nanoseconds !== undefined) {
      // Handle potential Firestore Timestamps that might be passed in
      try {
        return new Date(value.seconds * 1000).toISOString();
      } catch (e) {
        return value;
      }
    }
    return value;
  }));
};

export const Store = {
  subscribeAll: (callbacks: {
    onMedia?: (m: MediaItem[]) => void,
    onServices?: (s: Service[]) => void,
    onDepartments?: (d: Department[]) => void,
    onAbout?: (a: AboutContent) => void,
    onSettings?: (st: ChurchSettings) => void,
    onPrayers?: (p: PrayerRequest[]) => void,
  }) => {
    const unsubscribers: (() => void)[] = [];

    unsubscribers.push(onSnapshot(query(collection(db, COLLECTIONS.MEDIA), orderBy('uploadedAt', 'desc')), (snap) => {
      const items = snap.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        uploadedAt: doc.data().uploadedAt ? new Date(doc.data().uploadedAt) : new Date()
      })) as MediaItem[];
      cachedMedia = items;
      callbacks.onMedia?.(items);
    }));

    unsubscribers.push(onSnapshot(doc(db, 'config', COLLECTIONS.SERVICES), (snap) => {
      if (snap.exists()) {
        const items = snap.data().items as Service[];
        cachedServices = items;
        callbacks.onServices?.(items);
      } else {
        Store.saveServices(MOCK_SERVICES);
        callbacks.onServices?.(MOCK_SERVICES);
      }
    }));

    unsubscribers.push(onSnapshot(doc(db, 'config', COLLECTIONS.DEPARTMENTS), (snap) => {
      if (snap.exists()) {
        const items = snap.data().items as Department[];
        cachedDepartments = items;
        callbacks.onDepartments?.(items);
      } else {
        Store.saveDepartments(MOCK_DEPARTMENTS);
        callbacks.onDepartments?.(MOCK_DEPARTMENTS);
      }
    }));

    unsubscribers.push(onSnapshot(doc(db, 'config', COLLECTIONS.ABOUT), (snap) => {
      if (snap.exists()) {
        cachedAbout = snap.data() as AboutContent;
        callbacks.onAbout?.(cachedAbout);
      } else {
        Store.saveAbout(DEFAULT_ABOUT);
        callbacks.onAbout?.(DEFAULT_ABOUT);
      }
    }));

    unsubscribers.push(onSnapshot(doc(db, 'config', COLLECTIONS.SETTINGS), (snap) => {
      if (snap.exists()) {
        cachedSettings = snap.data() as ChurchSettings;
        callbacks.onSettings?.(cachedSettings);
      } else {
        Store.saveSettings(DEFAULT_SETTINGS);
        callbacks.onSettings?.(DEFAULT_SETTINGS);
      }
    }));

    unsubscribers.push(onSnapshot(query(collection(db, COLLECTIONS.PRAYER), orderBy('submittedAt', 'desc')), (snap) => {
      const items = snap.docs.map(doc => {
        const data = doc.data();
        let submittedAt = new Date();
        if (data.submittedAt instanceof Timestamp) {
          submittedAt = data.submittedAt.toDate();
        } else if (data.submittedAt) {
          submittedAt = new Date(data.submittedAt);
        }
        return { 
          id: doc.id, 
          ...data,
          submittedAt
        };
      }) as PrayerRequest[];
      cachedPrayers = items;
      callbacks.onPrayers?.(items);
    }));

    return () => unsubscribers.forEach(u => u());
  },

  getMedia: () => cachedMedia,
  getServices: () => cachedServices,
  getDepartments: () => cachedDepartments,
  getAbout: () => cachedAbout,
  getSettings: () => cachedSettings,
  getPrayers: () => cachedPrayers,

  addMedia: async (item: Omit<MediaItem, 'id' | 'uploadedAt'>) => {
    try {
      await addDoc(collection(db, COLLECTIONS.MEDIA), {
        ...sanitizeData(item),
        uploadedAt: new Date().toISOString()
      });
      return true;
    } catch (e) { return false; }
  },

  deleteMedia: async (id: string) => {
    try {
      await deleteDoc(doc(db, COLLECTIONS.MEDIA, id));
    } catch (e) { console.error(e); }
  },

  addPrayerRequest: async (request: Omit<PrayerRequest, 'id' | 'submittedAt'>) => {
    try {
      await addDoc(collection(db, COLLECTIONS.PRAYER), {
        ...sanitizeData(request),
        submittedAt: Timestamp.now()
      });
      return true;
    } catch (e) { return false; }
  },

  deletePrayerRequest: async (id: string) => {
    try {
      await deleteDoc(doc(db, COLLECTIONS.PRAYER, id));
    } catch (e) { console.error(e); }
  },

  saveServices: async (items: Service[]) => {
    try {
      await setDoc(doc(db, 'config', COLLECTIONS.SERVICES), { items: sanitizeData(items) });
      return true;
    } catch (e) { return false; }
  },

  saveDepartments: async (items: Department[]) => {
    try {
      await setDoc(doc(db, 'config', COLLECTIONS.DEPARTMENTS), { items: sanitizeData(items) });
      return true;
    } catch (e) { return false; }
  },

  saveAbout: async (content: AboutContent) => {
    try {
      await setDoc(doc(db, 'config', COLLECTIONS.ABOUT), sanitizeData(content));
      return true;
    } catch (e) { return false; }
  },

  saveSettings: async (settings: ChurchSettings) => {
    try {
      await setDoc(doc(db, 'config', COLLECTIONS.SETTINGS), sanitizeData(settings));
      return true;
    } catch (e) { return false; }
  }
};