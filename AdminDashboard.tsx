import React, { useState, useEffect, useRef } from 'react';
import { Store } from '../services/store';
import { fetchFacebookVideos } from '../services/facebook';
import { MediaItem, Service, AboutContent, ChurchSettings, BankAccount, Department, PrayerRequest, CoreValue, CoreBelief, ExpectationItem } from '../types';

type MediaSourceType = 'file' | 'link' | 'facebook';

const AdminDashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'media' | 'settings' | 'home_content' | 'hero' | 'story' | 'profile' | 'beliefs' | 'services' | 'departments' | 'finance' | 'prayers'>('media');
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [prayers, setPrayers] = useState<PrayerRequest[]>([]);
  const [about, setAbout] = useState<AboutContent>(Store.getAbout());
  const [settings, setSettings] = useState<ChurchSettings>(Store.getSettings());
  
  const [mediaSource, setMediaSource] = useState<MediaSourceType>('link');
  const [newMedia, setNewMedia] = useState({ title: '', url: '', category: 'Sermon', description: '' });
  const [isUploading, setIsUploading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success'>('idle');

  useEffect(() => {
    const unsubscribe = Store.subscribeAll({
      onMedia: setMedia,
      onServices: setServices,
      onDepartments: setDepartments,
      onPrayers: setPrayers,
      onAbout: setAbout,
      onSettings: setSettings
    });
    return () => unsubscribe();
  }, []);

  const handleSyncFacebook = async () => {
    if (!settings.facebookPageId || !settings.facebookAccessToken) {
      alert("Please configure your Facebook Page ID and Access Token in the 'Identity & Info' tab first.");
      return;
    }

    setIsSyncing(true);
    const videos = await fetchFacebookVideos(settings.facebookPageId, settings.facebookAccessToken);
    
    let addedCount = 0;
    for (const video of videos) {
      const exists = media.some(m => m.externalId === video.externalId);
      if (!exists && video.title && video.url) {
        await Store.addMedia({
          type: 'video',
          title: video.title,
          url: video.url,
          category: 'Facebook Sync',
          description: video.description || '',
          language: 'English',
          externalId: video.externalId
        } as any);
        addedCount++;
      }
    }

    setIsSyncing(false);
    alert(addedCount > 0 ? `Successfully synchronized ${addedCount} new videos from Facebook!` : "Your library is already up to date with Facebook.");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'media' | 'settings' | 'about' | 'pastor' | 'hero' | 'department' | 'service' | 'expectation', index?: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        if (target === 'media') {
          setNewMedia({ ...newMedia, url: base64 });
        } else if (target === 'settings') {
          setSettings({ ...settings, logoUrl: base64 });
        } else if (target === 'pastor') {
          setAbout({ ...about, pastorImageUrl: base64 });
        } else if (target === 'hero' && index !== undefined) {
          const imgs = [...settings.heroImages];
          imgs[index] = base64;
          setSettings({ ...settings, heroImages: imgs });
        } else if (target === 'department' && index !== undefined) {
          const depts = [...departments];
          depts[index].imageUrl = base64;
          setDepartments(depts);
        } else if (target === 'service' && index !== undefined) {
          const svcs = [...services];
          svcs[index].imageUrl = base64;
          setServices(svcs);
        } else if (target === 'expectation' && index !== undefined) {
          const exps = [...settings.expectations];
          exps[index].imageUrl = base64;
          setSettings({ ...settings, expectations: exps });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedia.url || !newMedia.title) return alert('Please provide a title and media content.');
    
    setIsUploading(true);
    const success = await Store.addMedia({
      type: newMedia.url.includes('video') || newMedia.url.startsWith('data:video') || mediaSource === 'facebook' ? 'video' : 'image',
      title: newMedia.title,
      url: newMedia.url,
      category: newMedia.category,
      description: newMedia.description,
      language: 'English'
    });
    setIsUploading(false);
    
    if (success) {
      setNewMedia({ title: '', url: '', category: 'Sermon', description: '' });
      alert('Media successfully archived!');
    }
  };

  const handleSaveSettings = async () => {
    setSaveStatus('saving');
    await Store.saveSettings(settings);
    setSaveStatus('success');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  const handleSaveAbout = async () => {
    setSaveStatus('saving');
    await Store.saveAbout(about);
    setSaveStatus('success');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  const menuItems = [
    { id: 'media', label: 'Sermon Library', icon: '🎥' },
    { id: 'settings', label: 'Identity & Contacts', icon: '⚙️' },
    { id: 'home_content', label: 'Page Content', icon: '🏠' },
    { id: 'hero', label: 'Hero Portal', icon: '🖼️' },
    { id: 'story', label: 'Our Story', icon: '📖' },
    { id: 'profile', label: 'Pastoral Profile', icon: '🕊️' },
    { id: 'beliefs', label: 'Spiritual Pillars', icon: '💎' },
    { id: 'services', label: 'Sunday Experience', icon: '📅' },
    { id: 'departments', label: 'Ministry Arms', icon: '🤝' },
    { id: 'finance', label: 'Partnership & Finance', icon: '💳' },
    { id: 'prayers', label: 'Prayer Requests', icon: '🙏' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'settings':
        return (
          <div className="space-y-16 animate-in fade-in slide-in-from-bottom-10">
            <div className="space-y-4">
              <h3 className="text-6xl font-serif font-black tracking-tight">Identity & Contacts</h3>
              <p className="text-gray-400 text-lg font-light">Global branding, contact details, and social automation.</p>
            </div>
            <div className="bg-white p-12 md:p-20 rounded-[4rem] shadow-premium space-y-20 border border-slate-100">
              <div className="space-y-10">
                <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-vimGold border-b border-slate-50 pb-6">BRAND IDENTITY</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">MINISTRY NAME</label>
                    <input type="text" value={settings.name} onChange={e => setSettings({...settings, name: e.target.value})} className="w-full bg-slate-50 p-6 rounded-2xl outline-none text-base font-bold shadow-sm" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">SLOGAN / TAGLINE</label>
                    <input type="text" value={settings.slogan} onChange={e => setSettings({...settings, slogan: e.target.value})} className="w-full bg-slate-50 p-6 rounded-2xl outline-none text-base font-bold shadow-sm" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">LOGO URL</label>
                    <div className="flex gap-4">
                      <input type="text" value={settings.logoUrl} onChange={e => setSettings({...settings, logoUrl: e.target.value})} className="flex-1 bg-slate-50 p-6 rounded-2xl outline-none shadow-sm" />
                      <input type="file" onChange={(e) => handleFileUpload(e, 'settings')} className="hidden" id="logo-upload" />
                      <label htmlFor="logo-upload" className="bg-vimNavy text-white px-6 py-4 rounded-xl text-[9px] font-black uppercase tracking-widest cursor-pointer flex items-center">Upload</label>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">BROADCAST STATUS</label>
                    <div className="flex items-center gap-4 bg-slate-50 p-6 rounded-2xl">
                       <input type="checkbox" checked={settings.isLive} onChange={e => setSettings({...settings, isLive: e.target.checked})} className="w-6 h-6 accent-red-600" />
                       <span className="text-sm font-black uppercase tracking-widest">{settings.isLive ? 'Service is LIVE' : 'Service is Offline'}</span>
                    </div>
                  </div>
                  <div className="space-y-3 md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">LIVE STREAM VIDEO URL</label>
                    <input type="text" value={settings.liveVideoUrl || ''} onChange={e => setSettings({...settings, liveVideoUrl: e.target.value})} className="w-full bg-slate-50 p-6 rounded-2xl outline-none shadow-sm" placeholder="Direct MP4 link or YouTube Embed Link" />
                  </div>
                </div>
              </div>

              <div className="space-y-10">
                <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-vimGold border-b border-slate-50 pb-6">SOCIAL CONNECTIONS</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">FACEBOOK URL</label>
                    <input type="text" value={settings.facebookUrl} onChange={e => setSettings({...settings, facebookUrl: e.target.value})} className="w-full bg-slate-50 p-6 rounded-2xl outline-none shadow-sm" placeholder="https://facebook.com/..." />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">YOUTUBE URL</label>
                    <input type="text" value={settings.youtubeUrl} onChange={e => setSettings({...settings, youtubeUrl: e.target.value})} className="w-full bg-slate-50 p-6 rounded-2xl outline-none shadow-sm" placeholder="https://youtube.com/..." />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">TIKTOK URL</label>
                    <input type="text" value={settings.tiktokUrl} onChange={e => setSettings({...settings, tiktokUrl: e.target.value})} className="w-full bg-slate-50 p-6 rounded-2xl outline-none shadow-sm" placeholder="https://tiktok.com/@..." />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">WHATSAPP URL</label>
                    <input type="text" value={settings.whatsappUrl} onChange={e => setSettings({...settings, whatsappUrl: e.target.value})} className="w-full bg-slate-50 p-6 rounded-2xl outline-none shadow-sm" placeholder="https://wa.me/..." />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">TWITCH URL</label>
                    <input type="text" value={settings.twitchUrl || ''} onChange={e => setSettings({...settings, twitchUrl: e.target.value})} className="w-full bg-slate-50 p-6 rounded-2xl outline-none shadow-sm" placeholder="https://twitch.tv/..." />
                  </div>
                </div>
              </div>

              <div className="space-y-10">
                <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-vimGold border-b border-slate-50 pb-6">CONTACT INFORMATION</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400">ADDRESS</label>
                    <input type="text" value={settings.address} onChange={e => setSettings({...settings, address: e.target.value})} className="w-full bg-slate-50 p-6 rounded-2xl outline-none" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400">EMAIL</label>
                    <input type="text" value={settings.email} onChange={e => setSettings({...settings, email: e.target.value})} className="w-full bg-slate-50 p-6 rounded-2xl outline-none" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400">PHONE</label>
                    <input type="text" value={settings.phone} onChange={e => setSettings({...settings, phone: e.target.value})} className="w-full bg-slate-50 p-6 rounded-2xl outline-none" />
                  </div>
                </div>
              </div>

              <button onClick={handleSaveSettings} className="w-full gold-gradient py-8 rounded-[2.5rem] font-black text-vimNavy uppercase tracking-[0.3em] text-lg">SAVE IDENTITY</button>
            </div>
          </div>
        );
      case 'services':
        return (
          <div className="space-y-24 animate-in fade-in">
            <div className="space-y-12">
              <h3 className="text-6xl font-serif font-black">Weekly Schedule</h3>
              <p className="text-gray-400 text-lg">These service cards appear in the "Atmosphere" grid (Home) and the "Weekly Engagements" grid (Experience).</p>
              <div className="bg-white p-12 rounded-[4rem] shadow-premium space-y-10">
                {services.map((s, i) => (
                  <div key={s.id} className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start border-b pb-12 relative group">
                    <button 
                      onClick={() => {
                        if(confirm('Are you sure you want to remove this service slot?')) {
                          const newS = services.filter(item => item.id !== s.id);
                          setServices(newS);
                        }
                      }} 
                      className="absolute top-0 right-0 text-red-500 font-black text-[10px] uppercase opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    >
                      Remove Slot
                    </button>
                    <div className="space-y-4">
                      <div className="aspect-video bg-slate-50 rounded-2xl overflow-hidden relative border shadow-sm">
                        {s.imageUrl ? (
                          <img src={s.imageUrl} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300 text-[10px] font-bold">No Custom Photo</div>
                        )}
                        <input type="file" id={`svc-up-${i}`} className="hidden" onChange={(e) => handleFileUpload(e, 'service', i)} />
                        <label htmlFor={`svc-up-${i}`} className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity text-white text-[9px] font-black uppercase">Upload Service Photo</label>
                      </div>
                      <input type="text" value={s.imageUrl || ''} onChange={e => {
                        const newS = [...services];
                        newS[i].imageUrl = e.target.value;
                        setServices(newS);
                      }} className="w-full bg-slate-50 p-3 rounded-xl text-[9px] font-mono" placeholder="Or paste Image URL" />
                    </div>
                    <div className="md:col-span-3 space-y-4">
                      <input type="text" value={s.title} onChange={e => {
                        const newS = [...services];
                        newS[i].title = e.target.value;
                        setServices(newS);
                      }} className="w-full bg-slate-50 p-4 rounded-xl font-bold" placeholder="Service Title (e.g. Sunday Glory Service)" />
                      <div className="flex gap-4">
                        <input type="text" value={s.time} onChange={e => {
                          const newS = [...services];
                          newS[i].time = e.target.value;
                          setServices(newS);
                        }} className="w-32 bg-slate-50 p-3 rounded-xl text-xs font-black uppercase tracking-widest" placeholder="9:00 AM" />
                        <input type="text" value={s.description} onChange={e => {
                          const newS = [...services];
                          newS[i].description = e.target.value;
                          setServices(newS);
                        }} className="flex-1 bg-slate-50 p-3 rounded-xl text-sm" placeholder="Brief engagement description..." />
                      </div>
                    </div>
                  </div>
                ))}
                <button 
                  onClick={() => {
                    const newService: Service = {
                      id: Math.random().toString(36).substr(2, 9),
                      title: 'New Service Slot',
                      time: '00:00 AM',
                      description: 'Enter description...',
                      order: services.length + 1
                    };
                    setServices([...services, newService]);
                  }} 
                  className="w-full py-6 border-2 border-dashed border-slate-200 rounded-[2rem] text-gray-300 font-black text-[10px] uppercase tracking-widest hover:border-vimGold transition-all"
                >
                  + Add New Service Slot
                </button>
              </div>
            </div>

            {/* WHAT TO EXPECT EDITING SECTION */}
            <div className="space-y-12">
              <div className="space-y-2">
                <h3 className="text-6xl font-serif font-black">Visitor Expectations</h3>
                <p className="text-gray-400 text-lg">Edit the photos and descriptions for the "What to Expect" section on the Experience page.</p>
              </div>
              <div className="bg-white p-12 rounded-[4rem] shadow-premium space-y-10 border border-slate-50">
                {(settings.expectations || []).map((exp, i) => (
                  <div key={exp.id} className="grid grid-cols-1 md:grid-cols-4 gap-12 items-start border-b pb-16 last:border-0 relative group">
                    <div className="space-y-4">
                      <div className="aspect-square bg-slate-50 rounded-[2.5rem] overflow-hidden relative border shadow-sm">
                        <img src={exp.imageUrl} className="w-full h-full object-cover" alt={exp.title} />
                        <input type="file" id={`exp-up-${i}`} className="hidden" onChange={(e) => handleFileUpload(e, 'expectation', i)} />
                        <label htmlFor={`exp-up-${i}`} className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity text-white text-[9px] font-black uppercase text-center p-4">Change Pillar Photo</label>
                      </div>
                      <input type="text" value={exp.imageUrl} onChange={e => {
                        const newExps = [...settings.expectations];
                        newExps[i].imageUrl = e.target.value;
                        setSettings({...settings, expectations: newExps});
                      }} className="w-full bg-slate-50 p-3 rounded-xl text-[9px] font-mono" placeholder="Paste Photo URL" />
                    </div>
                    <div className="md:col-span-3 space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">PILLAR TITLE</label>
                        <input type="text" value={exp.title} onChange={e => {
                          const newExps = [...settings.expectations];
                          newExps[i].title = e.target.value;
                          setSettings({...settings, expectations: newExps});
                        }} className="w-full bg-slate-50 p-5 rounded-2xl font-black text-xl text-vimNavy" placeholder="e.g. Atmosphere" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">PILLAR DESCRIPTION</label>
                        <textarea value={exp.description} onChange={e => {
                          const newExps = [...settings.expectations];
                          newExps[i].description = e.target.value;
                          setSettings({...settings, expectations: newExps});
                        }} className="w-full bg-slate-50 p-5 rounded-2xl text-sm h-32 leading-relaxed" placeholder="Detailed description for visitors..." />
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="pt-10 flex flex-col gap-6">
                  <button onClick={() => Store.saveServices(services).then(handleSaveSettings)} className="w-full gold-gradient py-8 rounded-[2.5rem] font-black text-vimNavy uppercase tracking-[0.3em] text-lg shadow-xl hover:scale-[1.01] transition-all">SYNC ALL SUNDAY UPDATES</button>
                  <p className="text-center text-gray-400 text-[10px] font-bold uppercase tracking-widest">This saves both the Weekly Schedule and Visitor Expectations.</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'home_content':
        return (
          <div className="space-y-16 animate-in fade-in slide-in-from-bottom-10">
            <div className="space-y-4">
              <h3 className="text-6xl font-serif font-black tracking-tight">Landing & Content Copy</h3>
              <p className="text-gray-400 text-lg font-light">Modify all headings and body text across Home and Giving pages.</p>
            </div>
            
            <div className="bg-white p-12 md:p-20 rounded-[4rem] shadow-premium space-y-16 border border-slate-100">
               <div className="space-y-10">
                  <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-vimGold border-b pb-4">HOME PAGE CONTENT</h4>
                  <div className="grid grid-cols-1 gap-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400">WELCOME SUBTITLE</label>
                        <input type="text" value={settings.homeWelcomeSubtitle} onChange={e => setSettings({...settings, homeWelcomeSubtitle: e.target.value})} className="w-full bg-slate-50 p-6 rounded-2xl outline-none" />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400">WELCOME TITLE</label>
                        <input type="text" value={settings.homeWelcomeTitle} onChange={e => setSettings({...settings, homeWelcomeTitle: e.target.value})} className="w-full bg-slate-50 p-6 rounded-2xl outline-none font-serif text-2xl font-black" />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400">WELCOME BODY TEXT</label>
                        <textarea value={settings.homeWelcomeText} onChange={e => setSettings({...settings, homeWelcomeText: e.target.value})} className="w-full bg-slate-50 p-6 rounded-2xl outline-none h-32" />
                    </div>
                  </div>
               </div>

               <div className="space-y-10">
                  <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-vimGold border-b pb-4">GIVING PAGE CONTENT</h4>
                  <div className="grid grid-cols-1 gap-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400">GIVING PAGE HEADING</label>
                        <input type="text" value={settings.givingHeading} onChange={e => setSettings({...settings, givingHeading: e.target.value})} className="w-full bg-slate-50 p-6 rounded-2xl outline-none font-serif text-2xl font-black" />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400">GIVING SUBTITLE</label>
                        <input type="text" value={settings.givingSubtitle} onChange={e => setSettings({...settings, givingSubtitle: e.target.value})} className="w-full bg-slate-50 p-6 rounded-2xl outline-none" />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400">BIBLICAL FOUNDATION TEXT (PROVERBS/LUKE ETC)</label>
                        <textarea value={settings.givingFoundationText} onChange={e => setSettings({...settings, givingFoundationText: e.target.value})} className="w-full bg-slate-50 p-6 rounded-2xl outline-none h-32 italic" />
                    </div>
                  </div>
               </div>

               <button onClick={handleSaveSettings} className="w-full gold-gradient py-8 rounded-[2.5rem] font-black text-vimNavy uppercase tracking-[0.3em] text-lg">SAVE PAGE CONTENT</button>
            </div>
          </div>
        );
      case 'finance':
        return (
          <div className="space-y-16 animate-in fade-in">
            <h3 className="text-6xl font-serif font-black">Partnership & Treasury</h3>
            <div className="bg-white p-12 rounded-[4rem] shadow-premium space-y-12">
              <div className="space-y-10">
                <h4 className="text-[11px] font-black text-vimGold uppercase tracking-widest border-b pb-4">TREASURY (BANK ACCOUNTS)</h4>
                <div className="space-y-6">
                  {settings.bankAccounts.map((acc, i) => (
                    <div key={acc.id} className="p-8 bg-slate-50 rounded-[2.5rem] space-y-6 relative border border-slate-100">
                      <button onClick={() => setSettings({...settings, bankAccounts: settings.bankAccounts.filter(a => a.id !== acc.id)})} className="absolute top-8 right-8 text-red-400 font-black text-[10px] uppercase">Remove Account</button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                           <label className="text-[8px] font-black text-gray-400">LABEL (E.G. TITHE, PROJECT)</label>
                           <input type="text" value={acc.label} onChange={e => {
                             const newAccs = [...settings.bankAccounts];
                             newAccs[i].label = e.target.value;
                             setSettings({...settings, bankAccounts: newAccs});
                           }} className="w-full bg-white p-4 rounded-xl text-xs font-black uppercase" />
                         </div>
                         <div className="space-y-2">
                           <label className="text-[8px] font-black text-gray-400">BANK NAME</label>
                           <input type="text" value={acc.bankName} onChange={e => {
                             const newAccs = [...settings.bankAccounts];
                             newAccs[i].bankName = e.target.value;
                             setSettings({...settings, bankAccounts: newAccs});
                           }} className="w-full bg-white p-4 rounded-xl text-xs font-bold" />
                         </div>
                         <div className="space-y-2">
                           <label className="text-[8px] font-black text-gray-400">ACCOUNT NUMBER</label>
                           <input type="text" value={acc.accountNumber} onChange={e => {
                             const newAccs = [...settings.bankAccounts];
                             newAccs[i].accountNumber = e.target.value;
                             setSettings({...settings, bankAccounts: newAccs});
                           }} className="w-full bg-white p-4 rounded-xl text-xl font-black font-mono" />
                         </div>
                         <div className="space-y-2">
                           <label className="text-[8px] font-black text-gray-400">ACCOUNT NAME</label>
                           <input type="text" value={acc.accountName} onChange={e => {
                             const newAccs = [...settings.bankAccounts];
                             newAccs[i].accountName = e.target.value;
                             setSettings({...settings, bankAccounts: newAccs});
                           }} className="w-full bg-white p-4 rounded-xl text-xs font-bold" />
                         </div>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => setSettings({...settings, bankAccounts: [...settings.bankAccounts, { id: Math.random().toString(), label: 'NEW ACCOUNT', bankName: '', accountNumber: '', accountName: '' }]})} className="w-full py-6 border-2 border-dashed border-slate-100 rounded-[2rem] text-gray-300 font-black text-[10px] uppercase tracking-widest hover:border-vimGold transition-all">Add Bank Account</button>
                </div>
              </div>

              <div className="space-y-10">
                <h4 className="text-[11px] font-black text-vimGold uppercase tracking-widest border-b pb-4">PARTNERSHIP ENLISTMENT</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400">WHATSAPP CIRCLE LINK</label>
                      <input type="text" value={settings.partnershipWhatsappUrl} onChange={e => setSettings({...settings, partnershipWhatsappUrl: e.target.value})} className="w-full bg-slate-50 p-5 rounded-xl text-xs font-mono" />
                   </div>
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400">FLUTTERWAVE MERCHANT LINK</label>
                      <input type="text" value={settings.flutterwaveLink} onChange={e => setSettings({...settings, flutterwaveLink: e.target.value})} className="w-full bg-slate-50 p-5 rounded-xl text-xs font-mono" />
                   </div>
                </div>
                <div className="space-y-6">
                   <label className="text-[10px] font-black text-gray-400">PARTNERSHIP COVENANT FEATURES</label>
                   {settings.partnershipFeatures.map((f, i) => (
                     <div key={i} className="flex gap-4">
                        <input type="text" value={f} onChange={e => {
                           const newF = [...settings.partnershipFeatures];
                           newF[i] = e.target.value;
                           setSettings({...settings, partnershipFeatures: newF});
                        }} className="flex-1 bg-slate-50 p-4 rounded-xl text-sm font-medium" />
                        <button onClick={() => setSettings({...settings, partnershipFeatures: settings.partnershipFeatures.filter((_, idx) => idx !== i)})} className="text-red-400 px-2 font-black">X</button>
                     </div>
                   ))}
                   <button onClick={() => setSettings({...settings, partnershipFeatures: [...settings.partnershipFeatures, 'New Covenant Benefit']})} className="w-full py-4 border-2 border-dashed border-slate-100 rounded-xl text-gray-300 font-black text-[10px] uppercase tracking-widest">Add Benefit</button>
                </div>
              </div>
              <button onClick={handleSaveSettings} className="w-full gold-gradient py-8 rounded-[2.5rem] font-black text-vimNavy uppercase tracking-[0.3em] text-lg">SAVE TREASURY RECORDS</button>
            </div>
          </div>
        );
      case 'media':
        return (
          <div className="space-y-16 animate-in fade-in">
            <div className="flex justify-between items-end">
              <h3 className="text-6xl font-serif font-black">Sermon Library</h3>
              <button onClick={handleSyncFacebook} className="bg-vimNavy text-vimGold px-10 py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-widest border border-vimGold/20">Sync Facebook</button>
            </div>
            <div className="bg-white p-12 rounded-[4rem] shadow-premium space-y-12">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-gray-400">LIBRARY HEADING</label>
                     <input type="text" value={settings.mediaHeading} onChange={e => setSettings({...settings, mediaHeading: e.target.value})} className="w-full bg-slate-50 p-4 rounded-xl outline-none font-bold" />
                  </div>
                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-gray-400">LIBRARY SUBHEADING</label>
                     <input type="text" value={settings.mediaSubheading} onChange={e => setSettings({...settings, mediaSubheading: e.target.value})} className="w-full bg-slate-50 p-4 rounded-xl outline-none" />
                  </div>
               </div>
              <div className="flex gap-4 border-b pb-6">
                {(['link', 'file', 'facebook'] as MediaSourceType[]).map(type => (
                  <button key={type} onClick={() => setMediaSource(type)} className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${mediaSource === type ? 'bg-vimNavy text-vimGold shadow-gold' : 'bg-slate-50 text-gray-400'}`}>
                    {type === 'link' ? '🔗 URL Link' : type === 'file' ? '📁 Local File' : '👤 Facebook'}
                  </button>
                ))}
              </div>
              <form onSubmit={handleAddMedia} className="space-y-8">
                <input type="text" placeholder="Title" value={newMedia.title} onChange={e => setNewMedia({...newMedia, title: e.target.value})} className="w-full bg-slate-50 p-6 rounded-2xl font-bold shadow-sm outline-none" />
                {mediaSource === 'link' ? (
                  <input type="text" placeholder="Video/Image URL" value={newMedia.url} onChange={e => setNewMedia({...newMedia, url: e.target.value})} className="w-full bg-slate-50 p-6 rounded-2xl outline-none" />
                ) : mediaSource === 'file' ? (
                  <div className="p-10 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center gap-4 bg-slate-50">
                    <input type="file" onChange={(e) => handleFileUpload(e, 'media')} className="hidden" id="admin-file-upload" />
                    <label htmlFor="admin-file-upload" className="cursor-pointer bg-white px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border">SELECT FROM COMPUTER</label>
                    {newMedia.url && <p className="text-[10px] text-green-500 font-black">✓ File Prepared ({newMedia.url.substring(0, 30)}...)</p>}
                  </div>
                ) : null}
                <button type="submit" className="w-full gold-gradient py-8 rounded-[2.5rem] font-black text-vimNavy uppercase tracking-[0.3em] text-lg">ARCHIVE MEDIA</button>
              </form>
            </div>
          </div>
        );
      case 'hero':
        return (
          <div className="space-y-16 animate-in fade-in slide-in-from-bottom-10">
            <h3 className="text-6xl font-serif font-black">Hero Portal</h3>
            <div className="bg-white p-12 rounded-[4rem] shadow-premium space-y-10">
              <h4 className="text-[11px] font-black text-vimGold uppercase tracking-widest border-b pb-6">HERO SLIDESHOW</h4>
              <div className="grid grid-cols-1 gap-6">
                {settings.heroImages.map((img, i) => (
                  <div key={i} className="flex gap-4 items-center">
                    <img src={img} className="w-16 h-12 object-cover rounded-xl" />
                    <input type="text" value={img} onChange={e => {
                      const newImages = [...settings.heroImages];
                      newImages[i] = e.target.value;
                      setSettings({ ...settings, heroImages: newImages });
                    }} className="flex-1 bg-slate-50 p-4 rounded-xl text-xs" />
                    <input type="file" id={`hero-up-${i}`} className="hidden" onChange={(e) => handleFileUpload(e, 'hero', i)} />
                    <label htmlFor={`hero-up-${i}`} className="bg-slate-100 text-vimNavy px-3 py-2 rounded-lg text-[8px] font-black cursor-pointer">UP</label>
                    <button onClick={() => setSettings({ ...settings, heroImages: settings.heroImages.filter((_, idx) => idx !== i) })} className="text-red-400 px-4">X</button>
                  </div>
                ))}
                <button onClick={() => setSettings({ ...settings, heroImages: [...settings.heroImages, ''] })} className="border-2 border-dashed border-slate-200 py-6 rounded-3xl text-gray-400 font-black uppercase text-[10px] tracking-widest hover:border-vimGold transition-all">Add Slide</button>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400">HERO SUBTITLE</label>
                <input type="text" value={settings.heroSubtitle} onChange={e => setSettings({...settings, heroSubtitle: e.target.value})} className="w-full bg-slate-50 p-6 rounded-2xl font-bold" />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400">HERO TITLE</label>
                <input type="text" value={settings.heroTitle} onChange={e => setSettings({...settings, heroTitle: e.target.value})} className="w-full bg-slate-50 p-6 rounded-2xl font-serif text-3xl font-black" />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400">HERO VIDEO URL (YouTube or Direct Link)</label>
                <input type="text" value={settings.heroVideoUrl} onChange={e => setSettings({...settings, heroVideoUrl: e.target.value})} className="w-full bg-slate-50 p-6 rounded-2xl outline-none" />
              </div>
              <button onClick={handleSaveSettings} className="w-full gold-gradient py-8 rounded-[2.5rem] font-black text-vimNavy uppercase tracking-[0.3em] text-lg">UPDATE HERO</button>
            </div>
          </div>
        );
      case 'story':
        return (
          <div className="space-y-16 animate-in fade-in">
            <h3 className="text-6xl font-serif font-black">Our Story</h3>
            <div className="bg-white p-12 rounded-[4rem] shadow-premium space-y-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400">APOSTOLIC MANDATE</label>
                <textarea value={about.mandate} onChange={e => setAbout({...about, mandate: e.target.value})} className="w-full bg-slate-50 p-8 rounded-[2.5rem] h-40 italic font-serif text-lg" placeholder="Mandate..." />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400">VISION</label>
                  <textarea value={about.vision} onChange={e => setAbout({...about, vision: e.target.value})} className="w-full bg-slate-50 p-8 rounded-[2rem] h-32" placeholder="Vision..." />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400">MISSION</label>
                  <textarea value={about.mission} onChange={e => setAbout({...about, mission: e.target.value})} className="w-full bg-slate-50 p-8 rounded-[2rem] h-32" placeholder="Mission..." />
                </div>
              </div>
              <button onClick={handleSaveAbout} className="w-full gold-gradient py-8 rounded-[2.5rem] font-black text-vimNavy uppercase tracking-[0.3em] text-lg">SAVE STORY</button>
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="space-y-16 animate-in fade-in">
            <h3 className="text-6xl font-serif font-black">Pastoral Profile</h3>
            <div className="bg-white p-12 rounded-[4rem] shadow-premium space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <img src={about.pastorImageUrl} className="w-full aspect-[3/4] object-cover rounded-3xl shadow-xl" />
                  <div className="flex gap-2">
                    <input type="text" value={about.pastorImageUrl} onChange={e => setAbout({...about, pastorImageUrl: e.target.value})} className="flex-1 bg-slate-50 p-4 rounded-xl text-[10px] font-mono" placeholder="Image URL" />
                    <input type="file" id="pastor-upload" className="hidden" onChange={(e) => handleFileUpload(e, 'pastor')} />
                    <label htmlFor="pastor-upload" className="bg-vimNavy text-white px-4 py-3 rounded-xl text-[8px] font-black uppercase cursor-pointer">UP</label>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400">BIOGRAPHY</label>
                  <textarea value={about.pastorBio} onChange={e => setAbout({...about, pastorBio: e.target.value})} className="w-full bg-slate-50 p-8 rounded-[2.5rem] h-full min-h-[400px]" placeholder="Bio..." />
                </div>
              </div>
              <button onClick={handleSaveAbout} className="w-full gold-gradient py-8 rounded-[2.5rem] font-black text-vimNavy uppercase tracking-[0.3em] text-lg">SAVE PROFILE</button>
            </div>
          </div>
        );
      case 'departments':
        return (
          <div className="space-y-16 animate-in fade-in">
            <h3 className="text-6xl font-serif font-black">Ministry Arms</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {departments.map((d, i) => (
                <div key={d.id} className="bg-white p-10 rounded-[3rem] shadow-premium space-y-6 relative group">
                  <button 
                    onClick={() => {
                      if(confirm('Are you sure you want to remove this Ministry Arm?')) {
                        const newD = departments.filter(item => item.id !== d.id);
                        setDepartments(newD);
                      }
                    }} 
                    className="absolute top-8 right-8 text-red-500 font-black text-[10px] uppercase opacity-0 group-hover:opacity-100 transition-opacity z-20"
                  >
                    Remove
                  </button>
                  <div className="aspect-video relative overflow-hidden rounded-2xl">
                    <img src={d.imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                    <input type="file" id={`dept-up-${i}`} className="hidden" onChange={(e) => handleFileUpload(e, 'department', i)} />
                    <label htmlFor={`dept-up-${i}`} className="absolute bottom-4 right-4 bg-vimNavy/80 text-white px-4 py-2 rounded-xl text-[9px] font-black cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">Change Photo</label>
                  </div>
                  <input type="text" value={d.imageUrl} onChange={e => {
                    const newD = [...departments];
                    newD[i].imageUrl = e.target.value;
                    setDepartments(newD);
                  }} className="w-full bg-slate-50 p-3 rounded-xl text-[9px] font-mono" placeholder="Image URL" />
                  <input type="text" value={d.name} onChange={e => {
                    const newD = [...departments];
                    newD[i].name = e.target.value;
                    setDepartments(newD);
                  }} className="w-full bg-slate-50 p-4 rounded-xl font-black text-xl" />
                  <textarea value={d.description} onChange={e => {
                    const newD = [...departments];
                    newD[i].description = e.target.value;
                    setDepartments(newD);
                  }} className="w-full bg-slate-50 p-4 rounded-xl h-24 text-sm" />
                </div>
              ))}
              <div className="col-span-1 md:col-span-2 space-y-8">
                <button 
                  onClick={() => {
                    const newDept: Department = {
                      id: Math.random().toString(36).substr(2, 9),
                      name: 'New Ministry Arm',
                      description: 'Enter description here...',
                      imageUrl: 'https://picsum.photos/seed/' + Math.random() + '/800/600'
                    };
                    setDepartments([...departments, newDept]);
                  }} 
                  className="w-full py-12 border-2 border-dashed border-slate-200 rounded-[3rem] text-gray-300 font-black text-xs uppercase tracking-widest hover:border-vimGold hover:text-vimGold transition-all"
                >
                  + Create New Ministry Arm
                </button>
                <button onClick={() => Store.saveDepartments(departments).then(() => alert('Arms updated!'))} className="w-full gold-gradient py-8 rounded-[2.5rem] font-black text-vimNavy uppercase tracking-[0.3em] text-lg shadow-xl">SYNC MINISTRY ARMS</button>
              </div>
            </div>
          </div>
        );
      case 'beliefs':
        return (
          <div className="space-y-16 animate-in fade-in">
            <h3 className="text-6xl font-serif font-black">Spiritual Pillars</h3>
            <div className="bg-white p-12 rounded-[4rem] shadow-premium space-y-10">
              {about.beliefs.map((b, i) => (
                <div key={i} className="space-y-4 border-b pb-10 relative group">
                  <button 
                    onClick={() => {
                      const newB = about.beliefs.filter((_, idx) => idx !== i);
                      setAbout({...about, beliefs: newB});
                    }} 
                    className="absolute top-0 right-0 text-red-500 font-black text-[10px] uppercase opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Remove Pillar
                  </button>
                  <input type="text" value={b.title} onChange={e => {
                    const newB = [...about.beliefs];
                    newB[i].title = e.target.value;
                    setAbout({...about, beliefs: newB});
                  }} className="w-full bg-slate-50 p-6 rounded-2xl font-serif text-2xl font-black" placeholder="Pillar Title" />
                  <textarea value={b.description} onChange={e => {
                    const newB = [...about.beliefs];
                    newB[i].description = e.target.value;
                    setAbout({...about, beliefs: newB});
                  }} className="w-full bg-slate-50 p-6 rounded-2xl h-32" placeholder="Pillar Description" />
                </div>
              ))}
              <div className="space-y-8">
                <button 
                  onClick={() => {
                    const newPillar: CoreBelief = { title: 'New Spiritual Pillar', description: 'Enter description here...' };
                    setAbout({...about, beliefs: [...about.beliefs, newPillar]});
                  }} 
                  className="w-full py-6 border-2 border-dashed border-slate-200 rounded-[2rem] text-gray-300 font-black text-[10px] uppercase tracking-widest hover:border-vimGold hover:text-vimGold transition-all"
                >
                  + Add New Spiritual Pillar
                </button>
                <button onClick={handleSaveAbout} className="w-full gold-gradient py-8 rounded-[2.5rem] font-black text-vimNavy uppercase tracking-[0.3em] text-lg shadow-xl">SAVE PILLARS</button>
              </div>
            </div>
          </div>
        );
      case 'prayers':
        return (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6">
            <h3 className="text-6xl font-serif font-black">Intercession Inbox</h3>
            <div className="space-y-8">
              {prayers.length === 0 ? (
                <div className="bg-white p-24 rounded-[3.5rem] border border-slate-100 text-center text-gray-300 font-serif italic text-2xl shadow-premium">
                  The altar is peaceful and clear.
                </div>
              ) : (
                prayers.map(p => (
                  <div key={p.id} className="bg-white p-12 rounded-[3.5rem] shadow-premium border border-slate-100 space-y-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-2xl font-serif font-black text-vimNavy">{p.name}</h4>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-vimGold">{p.phone} • {p.email}</p>
                      </div>
                      <button onClick={() => Store.deletePrayerRequest(p.id)} className="bg-green-50 text-green-600 px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-green-100 transition-all">Mark Handled</button>
                    </div>
                    <div className="bg-slate-50 p-8 rounded-[2.5rem] border-l-8 border-vimGold italic text-gray-600 text-lg leading-relaxed font-light">
                      "{p.request}"
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-gray-300 space-y-6">
            <span className="text-8xl">🏗️</span>
            <p className="font-serif italic text-2xl">Refining spiritual console...</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-vimNavy overflow-hidden">
      <aside className="w-full md:w-80 bg-vimNavy text-white flex flex-col h-screen z-30 shadow-2xl shrink-0">
        <div className="p-10 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-5">
            <img src={settings.logoUrl} className="w-14 h-14 rounded-full border-2 border-vimGold/20 object-cover shadow-gold" alt="Logo" />
            <div>
              <h2 className="font-serif font-black text-2xl tracking-tighter leading-none">VIM Admin</h2>
              <p className="text-[9px] text-vimGold font-black uppercase tracking-[0.5em] mt-1">Prophetic Console</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-8 space-y-2 overflow-y-auto custom-scrollbar">
          {menuItems.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`w-full flex items-center gap-5 px-6 py-4 rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-300 ${activeTab === tab.id ? 'bg-vimGold text-vimNavy shadow-premium scale-[1.02]' : 'hover:bg-white/5 text-gray-500 hover:text-white'}`}>
              <span className="text-xl">{tab.icon}</span>{tab.label}
            </button>
          ))}
        </nav>
        <div className="p-10 border-t border-white/5 shrink-0">
          <button onClick={onLogout} className="w-full flex items-center justify-center gap-4 text-red-400 hover:text-white hover:bg-red-500/20 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all">Sign Out</button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-slate-50 relative min-h-screen">
        {(isUploading || isSyncing || saveStatus === 'saving') && (
          <div className="fixed top-12 right-12 z-50">
            <div className="bg-vimNavy text-white px-10 py-5 rounded-full shadow-2xl animate-bounce flex items-center gap-4 border border-vimGold/20">
              <span className="w-2.5 h-2.5 bg-vimGold rounded-full animate-ping"></span>
              <span className="text-[10px] font-black uppercase tracking-widest">
                {saveStatus === 'saving' ? 'Updating Kingdom Records...' : 'Synchronizing Altar...'}
              </span>
            </div>
          </div>
        )}
        <div className="max-w-5xl mx-auto p-12 lg:p-24 space-y-20 pb-60">
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;