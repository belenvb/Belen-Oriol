import { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import { Language } from '../types';

interface HeaderProps { lang: Language; onLanguageChange: (lang: Language) => void; activeSection: string; }
export function Header({lang,onLanguageChange,activeSection}:HeaderProps) {
  const [scrolled,setScrolled]=useState(false);
  const [open,setOpen]=useState(false);
  const menuButton=useRef<HTMLButtonElement>(null);
  const panel=useRef<HTMLElement>(null);
  const links=[
    ['hero','Inicio','Home'],['story','Nuestra historia','Our story'],['schedule','Programa','Schedule'],['journey','Viaje y estancia','Travel & stay'],
    ['registry','Lista de bodas','Registry'],['faq','Preguntas','FAQ'],['rsvp','Confirmar asistencia','RSVP'],
  ];
  useEffect(()=>{const update=()=>setScrolled(window.scrollY>20);update();window.addEventListener('scroll',update,{passive:true});return()=>window.removeEventListener('scroll',update)},[]);
  useEffect(()=>{
    if(!open)return;
    const previous=document.body.style.overflow;document.body.style.overflow='hidden';
    panel.current?.querySelector<HTMLButtonElement>('button')?.focus();
    const closeOnWide=()=>{if(window.innerWidth>=1100)setOpen(false)};
    window.addEventListener('resize',closeOnWide);
    return()=>{document.body.style.overflow=previous;window.removeEventListener('resize',closeOnWide)};
  },[open]);
  const go=(id:string)=>{setOpen(false);document.getElementById(id)?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});};
  return <header className={`wedding-header ${scrolled||open?'is-solid':''}`} onKeyDown={event=>{
    if(open&&event.key==='Escape'){setOpen(false);menuButton.current?.focus()}
    if(open&&event.key==='Tab'){
      const controls=Array.from<HTMLButtonElement>((event.currentTarget as HTMLElement).querySelectorAll<HTMLButtonElement>('button')).filter(el=>el.getClientRects().length);
      const first=controls[0],last=controls[controls.length-1];
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
      if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
    }
  }}>
    <div className="wedding-header__bar">
      <button className="wedding-header__wordmark" onClick={()=>go('hero')} aria-label={lang==='es'?'Salamanca · 4 de septiembre de 2027 · Inicio':'Salamanca · September 4, 2027 · Home'}>Salamanca · <time dateTime="2027-09-04">{lang==='es'?'04.09.2027':'04 SEP 2027'}</time></button>
      <nav className="wedding-header__desktop" aria-label={lang==='es'?'Navegación principal':'Main navigation'}>{links.filter(([id])=>id!=='rsvp').map(([id,es,en])=><button key={id} onClick={()=>go(id)} aria-current={activeSection===id?'location':undefined} aria-label={id==='rsvp'?(lang==='es'?'Confirmar asistencia':'Confirm attendance'):undefined} className={id==='rsvp'?'wedding-header__rsvp':''}>{id==='rsvp'?<span className="wedding-header__rsvp-cover"><span className="wedding-header__rsvp-rule" aria-hidden="true"/><span className="wedding-header__rsvp-lettering">RSVP</span></span>:(lang==='es'?es:en)}</button>)}</nav>
      <div className="wedding-header__tools">
        <button type="button" className="wedding-header__rsvp-button" onClick={()=>go('rsvp')} aria-label={lang==='es'?'Confirmar asistencia · RSVP':'Confirm attendance · RSVP'} aria-current={activeSection==='rsvp'?'location':undefined}>RSVP</button>
        <div className="wedding-header__languages" aria-label={lang==='es'?'Idioma':'Language'}><button aria-pressed={lang==='es'} onClick={()=>onLanguageChange('es')}>ES</button><span aria-hidden="true">/</span><button aria-pressed={lang==='en'} onClick={()=>onLanguageChange('en')}>EN</button></div>
        <button ref={menuButton} className="wedding-header__toggle" aria-label={lang==='es'?(open?'Cerrar menú':'Abrir menú'):(open?'Close menu':'Open menu')} aria-expanded={open} aria-controls="wedding-mobile-menu" onClick={()=>setOpen(!open)}>{open?<X size={22}/>:<Menu size={22}/>}</button>
      </div>
    </div>
    {open&&<nav ref={panel} id="wedding-mobile-menu" className="wedding-header__mobile" aria-label={lang==='es'?'Navegación principal':'Main navigation'}>{links.map(([id,es,en],i)=><button key={id} onClick={()=>go(id)} aria-current={activeSection===id?'location':undefined} className={id==='rsvp'?'wedding-header__mobile-rsvp':''}><span className="wedding-header__index">0{i+1}</span>{lang==='es'?es:en}</button>)}</nav>}
  </header>;
}
