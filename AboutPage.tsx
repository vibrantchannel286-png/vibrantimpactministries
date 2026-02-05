
import React from 'react';
import { AboutContent } from '../types';

const AboutPage: React.FC<{ content: AboutContent }> = ({ content }) => {
  return (
    <div className="bg-white">
      {/* Editorial Hero */}
      <section className="relative h-[80vh] flex items-center px-8 lg:px-24 overflow-hidden bg-vimNavy">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1920&q=80" 
            className="w-full h-full object-cover opacity-30 grayscale"
            alt="Foundation"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-vimNavy via-vimNavy/40 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-4xl space-y-8 animate-in slide-in-from-left duration-1000">
          <span className="text-vimGold font-black uppercase tracking-[0.6em] text-[10px]">The Foundation of VIM</span>
          <h1 className="text-white font-serif text-6xl md:text-9xl font-black tracking-tighter leading-[0.9]">Our Story <br/>& <span className="italic font-normal font-serif text-vimGold">Mandate</span></h1>
          <p className="text-white/60 text-xl font-light leading-relaxed max-w-2xl">
            Established on the rock of spiritual authority and territorial transformation.
          </p>
        </div>
      </section>

      {/* The Prophetic Mandate */}
      <section className="py-40 bg-white border-b border-gray-50">
        <div className="max-w-[1200px] mx-auto px-8 text-center space-y-16">
          <div className="text-vimGold font-serif text-8xl md:text-[12rem] opacity-10 leading-none">“</div>
          <h2 className="text-vimNavy text-3xl md:text-5xl font-serif italic font-medium leading-[1.6] -mt-24 md:-mt-40">
            {content.mandate}
          </h2>
          <div className="w-px h-24 bg-vimGold/30 mx-auto"></div>
          <span className="block text-gray-400 font-black uppercase tracking-[0.4em] text-[10px]">The Sovereign Commission</span>
        </div>
      </section>

      {/* Vision & Mission Grid */}
      <section className="py-40 bg-[#fbfbfc]">
         <div className="max-w-[1400px] mx-auto px-8 lg:px-24 grid grid-cols-1 md:grid-cols-2 gap-24">
          <div className="space-y-10 group">
            <h3 className="text-vimNavy text-5xl font-serif font-black tracking-tighter">Our Vision</h3>
            <p className="text-gray-500 leading-relaxed text-xl font-light">
              {content.vision}
            </p>
            <div className="w-0 group-hover:w-full h-px bg-vimGold transition-all duration-1000"></div>
          </div>
          <div className="space-y-10 group">
            <h3 className="text-vimNavy text-5xl font-serif font-black tracking-tighter">Our Mission</h3>
            <p className="text-gray-500 leading-relaxed text-xl font-light">
              {content.mission}
            </p>
            <div className="w-0 group-hover:w-full h-px bg-vimGold transition-all duration-1000"></div>
          </div>
        </div>
      </section>

      {/* Leader Section - Editorial Portrait Style */}
      <section className="py-60 bg-white">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-24 flex flex-col lg:flex-row gap-32 items-center">
          <div className="w-full lg:w-1/2">
            <div className="relative group">
              <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-premium grayscale hover:grayscale-0 transition-all duration-1000">
                <img src={content.pastorImageUrl} className="w-full h-full object-cover" alt="Prophet Valentine Ifedayo" />
              </div>
              <div className="absolute -bottom-10 -left-10 bg-vimNavy text-white p-12 rounded-3xl hidden lg:block shadow-2xl">
                 <p className="text-xs font-black uppercase tracking-[0.3em] text-vimGold mb-2">Lead Shepherd</p>
                 <h4 className="text-3xl font-serif font-black tracking-tighter">Valentine Ifedayo</h4>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/2 space-y-12">
            <div className="space-y-4">
              <span className="text-vimGold font-black uppercase tracking-[0.4em] text-[10px]">The Set-Man</span>
              <h2 className="text-6xl md:text-8xl font-serif font-black tracking-tighter">Prophet <span className="text-vimGold">Valentine</span> Ifedayo</h2>
            </div>
            <div className="prose prose-xl prose-slate max-w-none text-gray-500 font-light leading-relaxed whitespace-pre-wrap">
              {content.pastorBio}
            </div>
          </div>
        </div>
      </section>

      {/* Core Beliefs - Clean Checklist */}
      <section className="py-40 bg-[#05080d] text-white">
        <div className="max-w-[1000px] mx-auto px-8 space-y-24">
          <div className="text-center space-y-4">
            <span className="text-vimGold font-black uppercase tracking-[0.4em] text-[10px]">What We Stand For</span>
            <h2 className="text-5xl md:text-7xl font-serif font-black tracking-tighter">Spiritual Pillars</h2>
          </div>
          <div className="space-y-16">
            {content.beliefs.map((belief, idx) => (
              <div key={idx} className="group flex gap-12 items-start border-b border-white/5 pb-16">
                <span className="text-vimGold font-serif text-3xl font-black opacity-30">0{idx + 1}</span>
                <div className="space-y-4">
                  <h4 className="text-3xl font-serif font-black tracking-tighter group-hover:text-vimGold transition-colors">{belief.title}</h4>
                  <p className="text-white/40 text-lg font-light leading-relaxed max-w-2xl">{belief.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
