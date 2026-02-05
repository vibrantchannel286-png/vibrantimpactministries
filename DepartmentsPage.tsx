
import React from 'react';
import { Department } from '../types';

const DepartmentsPage: React.FC<{ departments: Department[] }> = ({ departments }) => {
  return (
    <div className="bg-white pb-24">
      {/* Hero */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden bg-vimNavy">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1920&q=80" 
            className="w-full h-full object-cover opacity-20 mix-blend-overlay"
            alt="Service"
          />
        </div>
        <div className="relative z-10 text-center space-y-4 px-6">
          <span className="text-vimGold font-black uppercase tracking-[0.3em] text-xs">Join the Laborers</span>
          <h1 className="text-white font-serif text-5xl md:text-7xl font-black">Our Departments</h1>
        </div>
      </section>

      {/* Intro */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center space-y-6">
        <h2 className="text-vimNavy text-3xl md:text-4xl font-serif font-black">Service is Worship</h2>
        <p className="text-gray-500 text-lg leading-relaxed">
          At Vibrant Impact Ministries, we believe every believer is gifted for a purpose. Our departments are the engine rooms where we serve God and humanity with excellence.
        </p>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {departments.map((dept) => (
          <div key={dept.id} className="group relative overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 shadow-xl hover:shadow-2xl transition-all duration-500">
            <div className="aspect-[4/3] overflow-hidden">
              <img 
                src={dept.imageUrl} 
                alt={dept.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90"
              />
            </div>
            <div className="p-8 space-y-4">
              <h3 className="text-2xl font-black text-vimNavy group-hover:text-vimGold transition-colors">{dept.name}</h3>
              <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                {dept.description}
              </p>
              <button className="text-vimNavy font-black text-xs uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all">
                Learn More <span className="text-vimGold">→</span>
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* Call to Action */}
      <section className="max-w-5xl mx-auto px-6 mt-32">
        <div className="bg-vimNavy rounded-[3rem] p-12 md:p-20 text-center space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-vimGold/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <h3 className="text-white text-4xl md:text-5xl font-serif font-black">Ready to Serve?</h3>
          <p className="text-white/60 text-lg max-w-2xl mx-auto font-light">
            If you feel a nudge in your spirit to join any of our ministry arms, we would love to have you on the team.
          </p>
          <button className="gold-gradient text-vimNavy px-12 py-5 rounded-full font-black text-lg shadow-2xl hover:scale-105 transition-all uppercase tracking-widest">
            JOIN A DEPARTMENT
          </button>
        </div>
      </section>
    </div>
  );
};

export default DepartmentsPage;
