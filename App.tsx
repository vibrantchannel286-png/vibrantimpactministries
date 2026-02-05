import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import VimAssistant from './components/VimAssistant';
import AdminDashboard from './components/AdminDashboard';
import LoginForm from './components/LoginForm';
import AboutPage from './components/AboutPage';
import DepartmentsPage from './components/DepartmentsPage';
import GivingPage from './components/GivingPage';
import ContactPage from './components/ContactPage';
import ServicesPage from './components/ServicesPage';
import PropheticSection from './components/PropheticSection';
import AtmosphereSection from './components/AtmosphereSection';
import FireNightSection from './components/FireNightSection';
import { Page, MediaItem, AboutContent, Department, Service, ChurchSettings } from './types';
import { Store } from './services/store';

const getYouTubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url?.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const getFacebookEmbedUrl = (url: string) => {
  if (!url) return null;
  if (url.includes('facebook.com') || url.includes('fb.watch')) {
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0&t=0&autoplay=1&mute=1`;
  }
  return null;
};

const resolveVideoUrl = (url: string) => {
  if (!url) return '';
  let finalUrl = url.trim();
  
  // Handle Dropbox specifically
  if (finalUrl.includes('dropbox.com')) {
    // Use the direct access subdomain
    finalUrl = finalUrl.replace('www.dropbox.com', 'dl.dropboxusercontent.com');
    // Ensure it has a parameter that triggers direct stream/download
    if (!finalUrl.includes('raw=1') && !finalUrl.includes('dl=1')) {
      finalUrl += (finalUrl.includes('?') ? '&' : '?') + 'raw=1';
    }
  }
  return finalUrl;
};

const isDirectVideo = (url: string) => {
  if (!url) return false;
  const lowerUrl = url.toLowerCase();
  return lowerUrl.includes('.mp4') || 
         lowerUrl.includes('.webm') || 
         lowerUrl.includes('.mov') ||
         lowerUrl.includes('raw=1') || 
         lowerUrl.includes('dropbox.com') ||
         lowerUrl.includes('dl=1');
};

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>(Page.Home);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(Store.getMedia());
  const [aboutContent, setAboutContent] = useState<AboutContent>(Store.getAbout());
  const [departments, setDepartments] = useState<Department[]>(Store.getDepartments());
  const [services, setServices] = useState<Service[]>(Store.getServices());
  const [settings, setSettings] = useState<ChurchSettings>(Store.getSettings());
  
  const [heroIndex, setHeroIndex] = useState(0);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    const unsubscribe = Store.subscribeAll({
      onMedia: setMediaItems,
      onServices: setServices,
      onDepartments: setDepartments,
      onAbout: setAboutContent,
      onSettings: setSettings
    });

    const heroTimer = setInterval(() => {
      if (settings.heroImages.length > 0) {
        setHeroIndex(prev => (prev + 1) % settings.heroImages.length);
      }
    }, 8000);

    const countdownTimer = setInterval(() => {
      setCountdown(calculateNextFireNight());
    }, 1000);

    return () => {
      unsubscribe();
      clearInterval(heroTimer);
      clearInterval(countdownTimer);
    };
  }, [settings.heroImages.length]);

  const calculateNextFireNight = () => {
    const now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth();
    
    const findLastFriday = (y: number, m: number) => {
      const lastDay = new Date(y, m + 1, 0);
      let day = lastDay.getDay();
      let diff = (day >= 5) ? (day - 5) : (day + 2);
      const lastFriday = new Date(y, m, lastDay.getDate() - diff);
      lastFriday.setHours(22, 0, 0, 0);
      return lastFriday;
    };

    let target = findLastFriday(year, month);
    if (now > target) {
      target = findLastFriday(year, month + 1);
    }

    const difference = target.getTime() - now.getTime();
    
    return {
      days: Math.max(0, Math.floor(difference / (1000 * 60 * 60 * 24))),
      hours: Math.max(0, Math.floor((difference / (1000 * 60 * 60)) % 24)),
      mins: Math.max(0, Math.floor((difference / 1000 / 60) % 60)),
      secs: Math.max(0, Math.floor((difference / 1000) % 60)),
    };
  };

  const handleLogin = (email: string) => {
    setIsAdmin(true);
    setActivePage(Page.Account);
    window.scrollTo(0, 0);
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setActivePage(Page.Home);
    window.scrollTo(0, 0);
  };

  if (isAdmin && activePage === Page.Account) {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  const renderBackground = () => {
    // Prioritize Live Stream if active
    const liveUrl = settings.isLive ? settings.liveVideoUrl : null;
    const heroVideoUrl = settings.heroVideoUrl;
    const activeVideoUrl = liveUrl || heroVideoUrl;

    if (activeVideoUrl) {
      const youtubeId = getYouTubeId(activeVideoUrl);
      const fbEmbedUrl = getFacebookEmbedUrl(activeVideoUrl);

      if (youtubeId) {
        return (
          <div className="absolute inset-0 z-0 bg-vimNavy pointer-events-none">
            <iframe
              className="w-full h-[120%] -top-[10%] absolute scale-[1.4] pointer-events-none opacity-60"
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&enablejsapi=1`}
              frameBorder="0"
              allow="autoplay; encrypted-media"
            ></iframe>
          </div>
        );
      } else if (fbEmbedUrl) {
        return (
          <div className="absolute inset-0 z-0 bg-vimNavy pointer-events-none">
            <iframe
              className="w-full h-full absolute scale-[1.4] pointer-events-none opacity-60"
              src={fbEmbedUrl}
              frameBorder="0"
              allow="autoplay; encrypted-media"
              scrolling="no"
              allowFullScreen={true}
            ></iframe>
          </div>
        );
      } else if (isDirectVideo(activeVideoUrl)) {
        const finalUrl = resolveVideoUrl(activeVideoUrl);
        return (
          <div className="absolute inset-0 z-0 bg-vimNavy">
            <video 
              key={finalUrl} // Force reload when source changes
              autoPlay 
              loop 
              muted 
              playsInline 
              className="w-full h-full object-cover opacity-60 scale-105"
            >
              <source src={finalUrl} type="video/mp4" />
              <source src={finalUrl} type="video/webm" />
              Your browser does not support the video tag.
            </video>
          </div>
        );
      }
    }

    // Fallback to slideshow
    return (
      <div className="absolute inset-0 z-0 bg-vimNavy">
        {settings.heroImages.length > 0 ? (
          settings.heroImages.map((img, idx) => (
            <div 
              key={idx} 
              className={`absolute inset-0 transition-all duration-[3000ms] ease-in-out ${heroIndex === idx ? 'opacity-60 scale-105' : 'opacity-0 scale-100'}`}
            >
              <img src={img} className="w-full h-full object-cover" alt="Hero Background" />
            </div>
          ))
        ) : (
          <div className="absolute inset-0 bg-vimNavy"></div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    switch (activePage) {
      case Page.Home:
        return (
          <div className="animate-in fade-in duration-1000">
            {/* Immersive Hero Section with Intelligent Background Resolver */}
            <section className="relative h-screen w-full bg-vimNavy overflow-hidden">
              {renderBackground()}

              {/* Cinematic Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-b from-vimNavy/80 via-vimNavy/20 to-vimNavy z-[1]"></div>
              
              <div className="relative h-full flex flex-col justify-center items-center text-center px-8 z-10">
                <div className="mb-6 overflow-hidden">
                   {settings.isLive ? (
                     <div className="flex items-center gap-3 bg-red-600 px-8 py-3 rounded-full shadow-gold animate-in slide-in-from-top duration-700">
                        <span className="w-2.5 h-2.5 bg-white rounded-full animate-ping"></span>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Live Stream Active</span>
                     </div>
                   ) : (
                     <p className="text-vimGold text-[10px] md:text-xs font-black uppercase tracking-[0.6em] animate-in slide-in-from-bottom duration-700">
                       {settings.heroSubtitle}
                     </p>
                   )}
                </div>
                
                <h2 className="text-white font-serif text-6xl md:text-[10rem] font-black leading-[0.9] tracking-tighter mb-12 max-w-6xl text-balance animate-in slide-in-from-bottom duration-1000">
                  {settings.heroTitle}
                </h2>

                <div className="flex flex-col md:flex-row gap-6 mt-4 animate-in fade-in duration-1000 delay-500">
                  <button 
                    onClick={() => setActivePage(Page.About)} 
                    className="bg-white text-vimNavy px-14 py-4 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-vimGold hover:text-white transition-all shadow-2xl"
                  >
                    Explore Our Vision
                  </button>
                  <button 
                    onClick={() => setActivePage(Page.Services)} 
                    className="bg-transparent border-2 border-white/40 text-white px-14 py-4 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all backdrop-blur-sm"
                  >
                    Plan Your Visit
                  </button>
                </div>

                {/* Floating Countdown Widget */}
                <div className="absolute bottom-12 right-12 hidden lg:block animate-in slide-in-from-right duration-1000 delay-700">
                  <div className="bg-vimNavy/40 backdrop-blur-2xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl min-w-[340px]">
                    <div className="flex items-center gap-3 mb-8">
                      <span className="w-2 h-2 bg-vimGold rounded-full animate-pulse"></span>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/80">Next Fire Night Vigil</p>
                    </div>
                    <div className="flex gap-10">
                      <div className="text-left">
                        <p className="text-5xl font-black text-white leading-none tracking-tighter">{countdown.days.toString().padStart(2, '0')}</p>
                        <p className="text-[9px] font-black text-vimGold uppercase tracking-[0.2em] mt-3">Days</p>
                      </div>
                      <div className="text-left">
                        <p className="text-5xl font-black text-white leading-none tracking-tighter">{countdown.hours.toString().padStart(2, '0')}</p>
                        <p className="text-[9px] font-black text-vimGold uppercase tracking-[0.2em] mt-3">Hrs</p>
                      </div>
                      <div className="text-left">
                        <p className="text-5xl font-black text-white leading-none tracking-tighter">{countdown.mins.toString().padStart(2, '0')}</p>
                        <p className="text-[9px] font-black text-vimGold uppercase tracking-[0.2em] mt-3">Mins</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Welcome & Prophetic Insight */}
            <section className="bg-white py-32 overflow-hidden">
              <div className="max-w-[1400px] mx-auto px-8 lg:px-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
                  <div className="lg:col-span-7 space-y-12">
                    <div className="space-y-4">
                      <span className="text-vimGold font-black uppercase tracking-[0.4em] text-[10px]">{settings.homeWelcomeSubtitle}</span>
                      <h3 className="text-vimNavy font-serif text-5xl md:text-7xl font-black leading-tight tracking-tighter">{settings.homeWelcomeTitle}</h3>
                      <p className="text-gray-500 text-xl font-light leading-relaxed max-w-2xl">
                        {settings.homeWelcomeText}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-12 md:gap-16">
                      <div className="space-y-1">
                        <p className="text-vimNavy font-black text-5xl md:text-6xl tracking-tighter italic leading-none">{settings.stat1Value}</p>
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{settings.stat1Label}</p>
                      </div>
                      <div className="hidden md:block w-px h-16 bg-gray-100"></div>
                      <div className="space-y-1">
                        <p className="text-vimNavy font-black text-5xl md:text-6xl tracking-tighter italic leading-none">{settings.stat2Value}</p>
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{settings.stat2Label}</p>
                      </div>
                      <div className="hidden md:block w-px h-16 bg-gray-100"></div>
                      <div className="space-y-1">
                        <p className="text-vimNavy font-black text-5xl md:text-6xl tracking-tighter italic leading-none">{settings.stat3Value}</p>
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{settings.stat3Label}</p>
                      </div>
                    </div>
                  </div>
                  <div className="lg:col-span-5">
                    <PropheticSection />
                  </div>
                </div>
              </div>
            </section>

            <AtmosphereSection services={services} />

            <FireNightSection countdown={countdown} onEnlist={() => setActivePage(Page.Contact)} />
          </div>
        );

      case Page.About: return <AboutPage content={aboutContent} />;
      case Page.Departments: return <DepartmentsPage departments={departments} />;
      case Page.Giving: return <GivingPage />;
      case Page.Contact: return <ContactPage />;
      case Page.Services: return <ServicesPage services={services} settings={settings} />;
      case Page.Media:
        return (
          <div className="pt-40 pb-40 px-8 lg:px-24 bg-white">
            <div className="max-w-[1400px] mx-auto">
               <div className="mb-24 space-y-4">
                 <h2 className="text-vimNavy text-6xl md:text-8xl font-serif font-black tracking-tighter">{settings.mediaHeading}</h2>
                 <p className="text-gray-400 text-xl font-light italic">{settings.mediaSubheading}</p>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
                 {mediaItems.map(item => (
                   <div key={item.id} className="group cursor-pointer space-y-6">
                      <div className="aspect-video bg-vimNavy rounded-[2.5rem] overflow-hidden relative shadow-premium border border-slate-100">
                         {item.type === 'video' ? (
                           <div className="w-full h-full flex items-center justify-center bg-slate-900 overflow-hidden">
                              <img src={item.url?.includes('data:image') || !item.url?.includes('video') ? item.url : 'https://picsum.photos/seed/' + item.id + '/800/450'} className="absolute inset-0 w-full h-full object-cover opacity-20 blur-sm" />
                              <div className="z-10 w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:bg-vimGold group-hover:text-vimNavy transition-all">
                                 <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 20 20"><path d="M4.5 3.5l11 6.5-11 6.5v-13z" /></svg>
                              </div>
                           </div>
                         ) : (
                           <img src={item.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 grayscale group-hover:grayscale-0" alt="Media" />
                         )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <p className="text-vimGold text-[9px] font-black uppercase tracking-widest">{item.category}</p>
                          <p className="text-gray-300 text-[9px] font-black uppercase tracking-widest">{item.uploadedAt instanceof Date ? item.uploadedAt.getFullYear() : '2024'}</p>
                        </div>
                        <h4 className="text-vimNavy font-black text-2xl leading-tight group-hover:text-vimGold transition-colors tracking-tighter">{item.title}</h4>
                      </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        );
      case Page.Auth: return <LoginForm onLogin={handleLogin} />;
      case Page.Account: return isAdmin ? <AdminDashboard onLogout={handleLogout} /> : <LoginForm onLogin={handleLogin} />;
      default: return <div className="h-screen flex items-center justify-center font-serif text-2xl text-vimNavy italic">Coming Soon...</div>;
    }
  };

  return (
    <Layout activePage={activePage} onNavigate={(p) => { setActivePage(p); }} isLive={settings.isLive} settings={settings}>
      {renderContent()}
      <VimAssistant />
    </Layout>
  );
};

export default App;