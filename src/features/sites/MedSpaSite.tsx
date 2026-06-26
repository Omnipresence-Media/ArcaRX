import { motion } from "framer-motion";
import {
  Sparkles, Syringe, Wand2, Droplet, Sun, Flower2, ArrowRight,
  Check, Star, MapPin, Calendar, ShieldCheck, Award, Phone,
} from "lucide-react";

/* MAISON LUMIÈRE - Med Spa & Aesthetic Studio. Light, editorial, luxe. */

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

export function MedSpaSite() {
  return (
    <div className="ms-root font-[Inter,system-ui,sans-serif] text-[#1a1410]">
      <style>{`
        .ms-root { background:#faf6f1; }
        .ms-serif{font-family:"Cormorant Garamond","Playfair Display",Georgia,serif; font-weight:400; letter-spacing:-0.015em;}
        .ms-eyebrow{font-family:"Inter",sans-serif; letter-spacing:.3em; font-size:10px; text-transform:uppercase;}
        .ms-marquee{display:flex;gap:3rem;animation:ms-scroll 40s linear infinite;}
        @keyframes ms-scroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        .ms-gradient{background:radial-gradient(120% 80% at 50% 0%, #f3e3d3 0%, #faf6f1 60%);}
        .ms-card{background:#fff; border:1px solid rgba(26,20,16,.06);}
        .ms-img{background:linear-gradient(135deg,#e9d5c1 0%,#d6b8a0 40%,#b8917a 100%);}
      `}</style>

      {/* NAV */}
      <header className="sticky top-0 z-40 border-b border-[#1a1410]/5 bg-[#faf6f1]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-baseline gap-2">
            <span className="ms-serif text-2xl italic">Maison</span>
            <span className="text-[11px] tracking-[0.4em] text-[#1a1410]/60">LUMIÈRE</span>
          </div>
          <nav className="hidden gap-8 text-[12px] tracking-wide text-[#1a1410]/70 md:flex">
            {["Treatments","Injectables","Skin","Body","Membership","Team"].map(x=>(
              <a key={x} className="hover:text-[#1a1410]">{x}</a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a className="ms-eyebrow hidden text-[#1a1410]/60 hover:text-[#1a1410] md:inline">Members</a>
            <button className="rounded-full bg-[#1a1410] px-5 py-2.5 text-[11px] font-medium tracking-[0.15em] uppercase text-[#faf6f1] hover:bg-[#3a2a20]">
              Book
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="ms-gradient relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 pb-24 pt-20 md:grid-cols-12 md:pt-24">
          <motion.div {...fadeUp} className="md:col-span-7">
            <p className="ms-eyebrow text-[#8a5a3c]">Beverly Hills · Aspen · Miami</p>
            <h1 className="ms-serif mt-6 text-[68px] leading-[0.95] md:text-[104px]">
              The art of <em className="italic">aging</em>
              <br />on your own terms.
            </h1>
            <p className="mt-7 max-w-md text-[15px] leading-relaxed text-[#1a1410]/65">
              An invitation-only aesthetic studio. Master injectors, medical-grade devices,
              and protocols designed to look like nothing - and everything - at once.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <button className="group inline-flex items-center gap-2 rounded-full bg-[#1a1410] px-6 py-3.5 text-[12px] tracking-[0.18em] uppercase text-[#faf6f1] hover:bg-[#3a2a20]">
                Reserve consultation <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
              </button>
              <button className="text-[12px] tracking-[0.18em] uppercase text-[#1a1410]/70 hover:text-[#1a1410]">
                View treatments →
              </button>
            </div>
            <div className="mt-12 flex items-center gap-8">
              <div>
                <p className="ms-serif text-3xl">12+</p>
                <p className="ms-eyebrow mt-1 text-[#1a1410]/50">Years practicing</p>
              </div>
              <div className="h-10 w-px bg-[#1a1410]/15" />
              <div>
                <p className="ms-serif text-3xl">28k</p>
                <p className="ms-eyebrow mt-1 text-[#1a1410]/50">Treatments delivered</p>
              </div>
              <div className="h-10 w-px bg-[#1a1410]/15" />
              <div>
                <p className="ms-serif text-3xl">4.98</p>
                <p className="ms-eyebrow mt-1 text-[#1a1410]/50">Member rating</p>
              </div>
            </div>
          </motion.div>

          <motion.div {...fadeUp} transition={{...fadeUp.transition, delay:0.15}} className="md:col-span-5">
            <div className="relative">
              <div className="ms-img aspect-[4/5] rounded-[2px] shadow-2xl shadow-[#1a1410]/20" />
              <div className="ms-card absolute -bottom-6 -left-6 rounded-[2px] p-5 shadow-xl shadow-[#1a1410]/10">
                <p className="ms-eyebrow text-[#8a5a3c]">This week</p>
                <p className="ms-serif mt-2 text-2xl italic">Hydrafacial + LED</p>
                <p className="mt-1 text-[12px] text-[#1a1410]/55">Members $185 · 60 min</p>
              </div>
              <div className="ms-card absolute -right-4 top-8 rounded-[2px] p-4 shadow-xl shadow-[#1a1410]/10">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-[#8a5a3c]" />
                  <p className="text-[11px] font-medium">Allergan Diamond</p>
                </div>
                <p className="ms-eyebrow mt-1 text-[#1a1410]/50">Top 1% nationally</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* press marquee */}
        <div className="relative overflow-hidden border-y border-[#1a1410]/10 bg-[#faf6f1] py-6">
          <div className="ms-marquee whitespace-nowrap text-[10px] tracking-[0.4em] uppercase text-[#1a1410]/40">
            {Array.from({length:2}).map((_,i)=>(
              <div key={i} className="flex shrink-0 items-center gap-12">
                <span>As featured in</span>
                <span className="ms-serif text-base italic normal-case tracking-normal text-[#1a1410]/60">Vogue</span>
                <span className="ms-serif text-base italic normal-case tracking-normal text-[#1a1410]/60">Town & Country</span>
                <span className="ms-serif text-base italic normal-case tracking-normal text-[#1a1410]/60">Harper&apos;s Bazaar</span>
                <span className="ms-serif text-base italic normal-case tracking-normal text-[#1a1410]/60">Goop</span>
                <span className="ms-serif text-base italic normal-case tracking-normal text-[#1a1410]/60">W Magazine</span>
                <span className="ms-serif text-base italic normal-case tracking-normal text-[#1a1410]/60">The Cut</span>
                <span className="ms-serif text-base italic normal-case tracking-normal text-[#1a1410]/60">Allure</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className="mx-auto max-w-5xl px-6 py-32 text-center">
        <motion.p {...fadeUp} className="ms-eyebrow text-[#8a5a3c]">Philosophy</motion.p>
        <motion.h2 {...fadeUp} className="ms-serif mt-5 text-5xl leading-tight md:text-6xl">
          We don&apos;t chase trends. We <em className="italic">study faces</em> - yours, in particular -
          and we move with intention, restraint, and a little bit of awe.
        </motion.h2>
      </section>

      {/* TREATMENTS GRID */}
      <section className="border-y border-[#1a1410]/10 bg-white py-28">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div {...fadeUp} className="mb-14 flex items-end justify-between">
            <div>
              <p className="ms-eyebrow text-[#8a5a3c]">The studio</p>
              <h2 className="ms-serif mt-3 text-5xl">Signature treatments.</h2>
            </div>
            <a className="hidden text-[12px] tracking-[0.18em] uppercase text-[#1a1410]/60 hover:text-[#1a1410] md:inline">View all →</a>
          </motion.div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { i:Syringe,  t:"Tox + Filler",  s:"Botox · Dysport · Juvederm · RHA · Sculptra", p:"from $14/u" },
              { i:Wand2,    t:"Morpheus8",     s:"Subdermal RF microneedling. Tightening + tone.", p:"from $1,400" },
              { i:Droplet,  t:"PRF Glow",      s:"Plasma resurfacing with under-eye protocol.",     p:"from $850" },
              { i:Sun,      t:"Laser Resurface", s:"Halo · BBL · Moxi. Pigment, pores, texture.",    p:"from $1,200" },
              { i:Flower2,  t:"Body Sculpt",   s:"Emsculpt Neo · CoolSculpting Elite. 4-week protocol.", p:"from $2,400" },
              { i:Sparkles, t:"Membership Facials", s:"Hydrafacial Platinum + LED + lymphatic.",         p:"members $185" },
            ].map(({i:Icon,t,s,p})=>(
              <motion.article {...fadeUp} key={t}
                className="ms-card group relative overflow-hidden rounded-[2px] p-7 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-[#1a1410]/10">
                <div className="ms-img mb-7 aspect-[3/2] rounded-[2px]" />
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="ms-serif text-2xl">{t}</h3>
                    <p className="mt-2 text-[13px] text-[#1a1410]/60">{s}</p>
                  </div>
                  <Icon className="h-5 w-5 text-[#8a5a3c]" />
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-[#1a1410]/10 pt-4">
                  <span className="ms-eyebrow text-[#1a1410]/50">{p}</span>
                  <span className="ms-eyebrow flex items-center gap-1 text-[#1a1410]">Reserve <ArrowRight className="h-3 w-3"/></span>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* BEFORE/AFTER STRIP */}
      <section className="mx-auto max-w-7xl px-6 py-28">
        <motion.div {...fadeUp} className="mb-12">
          <p className="ms-eyebrow text-[#8a5a3c]">The results</p>
          <h2 className="ms-serif mt-3 text-5xl">Quiet, unmistakable.</h2>
        </motion.div>
        <div className="grid gap-4 md:grid-cols-4">
          {[
            "Tox + RHA-3 · 12 wk",
            "Morpheus8 · 6 wk",
            "Halo + BBL · 8 wk",
            "Emsculpt · 4 wk",
          ].map((cap,i)=>(
            <motion.figure {...fadeUp} key={cap} className="overflow-hidden rounded-[2px]">
              <div className="ms-img aspect-[3/4]" style={{filter:`hue-rotate(${i*12}deg)`}} />
              <figcaption className="ms-eyebrow mt-3 text-[#1a1410]/60">{cap}</figcaption>
            </motion.figure>
          ))}
        </div>
      </section>

      {/* PROVIDERS */}
      <section className="border-y border-[#1a1410]/10 bg-[#f1ebe2] py-28">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div {...fadeUp} className="mb-14 max-w-2xl">
            <p className="ms-eyebrow text-[#8a5a3c]">The hands</p>
            <h2 className="ms-serif mt-3 text-5xl">Master injectors. Quiet rooms.</h2>
          </motion.div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { n:"Dr. Vivienne Park, MD", r:"Medical Director · Facial Aesthetics" },
              { n:"Camille Russo, NP-C",  r:"Lead Injector · Lip & Mid-Face" },
              { n:"Dr. Andre Beaumont, MD",r:"Laser & Energy Devices" },
            ].map(p=>(
              <motion.div {...fadeUp} key={p.n}>
                <div className="ms-img aspect-[4/5] rounded-[2px]" />
                <h3 className="ms-serif mt-5 text-2xl">{p.n}</h3>
                <p className="ms-eyebrow mt-1 text-[#1a1410]/55">{p.r}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* MEMBERSHIP */}
      <section className="mx-auto max-w-7xl px-6 py-28">
        <motion.div {...fadeUp} className="mb-12 text-center">
          <p className="ms-eyebrow text-[#8a5a3c]">La Maison Club</p>
          <h2 className="ms-serif mx-auto mt-3 max-w-2xl text-5xl">Membership, in the European tradition.</h2>
        </motion.div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { n:"Atelier", p:"$295", f:["Monthly signature facial","15% off injectables","Priority booking","Birthday treatment"] },
            { n:"Salon", p:"$695", featured:true,
              f:["Monthly facial + LED","Banked units roll over","20% off all services","Quarterly skin analysis","Concierge text line"] },
            { n:"Maison", p:"$1,495", f:["Bi-weekly facials","Unlimited LED & lymphatic","25% off all services","Annual Halo + 1 syringe","Private dressing suite"] },
          ].map(t=>(
            <motion.div {...fadeUp} key={t.n}
              className={`ms-card relative rounded-[2px] p-8 ${t.featured?"border-[#8a5a3c] shadow-xl shadow-[#8a5a3c]/10":""}`}>
              {t.featured && <span className="ms-eyebrow absolute -top-3 left-7 bg-[#1a1410] px-3 py-1 text-[#faf6f1]">Most chosen</span>}
              <h3 className="ms-serif text-3xl italic">{t.n}</h3>
              <p className="ms-serif mt-4 text-5xl">{t.p}<span className="ms-eyebrow ml-1 text-[#1a1410]/50">/mo</span></p>
              <ul className="mt-7 space-y-3 text-[13px] text-[#1a1410]/75">
                {t.f.map(x=><li key={x} className="flex gap-2"><Check className="h-4 w-4 shrink-0 text-[#8a5a3c]"/>{x}</li>)}
              </ul>
              <button className={`mt-8 w-full rounded-full px-4 py-3 text-[11px] tracking-[0.18em] uppercase ${t.featured?"bg-[#1a1410] text-[#faf6f1] hover:bg-[#3a2a20]":"border border-[#1a1410]/20 hover:bg-[#1a1410]/5"}`}>
                Join {t.n}
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="border-y border-[#1a1410]/10 bg-white py-28">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-3">
          {[
            { q:"It's the kind of place where you whisper. And then you look in the mirror and gasp.", n:"- Saoirse M.", c:"Member, 3 years" },
            { q:"Dr. Park reads a face like a sculptor. I've never looked tired since.", n:"- Olivia C.", c:"Member, 2 years" },
            { q:"The only place my husband and I both go. Quietly transformative.", n:"- Helena & Theo G.", c:"Members, 18 months" },
          ].map(t=>(
            <motion.figure {...fadeUp} key={t.n}>
              <div className="mb-4 flex gap-1 text-[#8a5a3c]">{Array.from({length:5}).map((_,i)=><Star key={i} className="h-3.5 w-3.5 fill-current"/>)}</div>
              <blockquote className="ms-serif text-2xl leading-snug italic">"{t.q}"</blockquote>
              <figcaption className="ms-eyebrow mt-5 text-[#1a1410]/50">{t.n} · {t.c}</figcaption>
            </motion.figure>
          ))}
        </div>
      </section>

      {/* LOCATIONS */}
      <section className="mx-auto max-w-7xl px-6 py-28">
        <motion.div {...fadeUp} className="mb-12">
          <p className="ms-eyebrow text-[#8a5a3c]">Visit</p>
          <h2 className="ms-serif mt-3 text-5xl">Three studios. One standard.</h2>
        </motion.div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { c:"Beverly Hills", a:"9100 Wilshire Blvd · Suite 410", h:"Tue–Sat · 10–7" },
            { c:"Aspen",         a:"500 E Hyman Ave · 2nd Floor",    h:"Wed–Sun · 9–6" },
            { c:"Miami",         a:"3841 NE 2nd Ave · The Design District", h:"Tue–Sat · 10–8" },
          ].map(l=>(
            <motion.div {...fadeUp} key={l.c} className="ms-card rounded-[2px] p-7">
              <div className="ms-img mb-6 aspect-[16/9] rounded-[2px]" />
              <p className="ms-eyebrow flex items-center gap-1.5 text-[#8a5a3c]"><MapPin className="h-3 w-3"/>{l.c}</p>
              <p className="ms-serif mt-3 text-2xl">{l.a}</p>
              <p className="ms-eyebrow mt-3 flex items-center gap-1.5 text-[#1a1410]/55"><Calendar className="h-3 w-3"/>{l.h}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="ms-gradient relative overflow-hidden">
        <div className="mx-auto max-w-4xl px-6 py-32 text-center">
          <motion.h2 {...fadeUp} className="ms-serif text-6xl md:text-7xl">
            Your face, <em className="italic">considered.</em>
          </motion.h2>
          <p className="mx-auto mt-6 max-w-lg text-[14px] text-[#1a1410]/65">
            Complimentary 30-minute consultation with the medical director. Booking is by invitation
            and personal referral - leave a note and we will be in touch within the day.
          </p>
          <div className="mt-9 flex justify-center gap-3">
            <button className="rounded-full bg-[#1a1410] px-7 py-3.5 text-[11px] tracking-[0.18em] uppercase text-[#faf6f1] hover:bg-[#3a2a20]">
              Request consultation
            </button>
            <button className="inline-flex items-center gap-2 rounded-full border border-[#1a1410]/20 px-7 py-3.5 text-[11px] tracking-[0.18em] uppercase hover:bg-[#1a1410]/5">
              <Phone className="h-3.5 w-3.5"/>Call concierge
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#1a1410]/10 bg-[#f1ebe2] py-14">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-5">
          <div className="md:col-span-2">
            <div className="flex items-baseline gap-2">
              <span className="ms-serif text-2xl italic">Maison</span>
              <span className="text-[11px] tracking-[0.4em] text-[#1a1410]/60">LUMIÈRE</span>
            </div>
            <p className="mt-5 max-w-xs text-[12px] text-[#1a1410]/55">
              An aesthetic studio practicing the quiet art of personal renewal.
            </p>
            <div className="mt-4 flex items-center gap-2 text-[11px] text-[#1a1410]/50">
              <ShieldCheck className="h-3.5 w-3.5"/> Allergan Diamond · Galderma Aspire Elite
            </div>
          </div>
          {[
            ["Studio",["Treatments","Injectables","Skin","Body","Membership"]],
            ["Maison",["Philosophy","Team","Press","Journal","Careers"]],
            ["Visit", ["Beverly Hills","Aspen","Miami","Gift Cards","Contact"]],
          ].map(([h,xs])=>(
            <div key={h as string}>
              <p className="ms-eyebrow text-[#1a1410]/50">{h as string}</p>
              <ul className="mt-4 space-y-2 text-[12px] text-[#1a1410]/75">
                {(xs as string[]).map(x=><li key={x} className="hover:text-[#1a1410]">{x}</li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="mx-auto mt-12 flex max-w-7xl flex-wrap items-center justify-between gap-3 border-t border-[#1a1410]/10 px-6 pt-6 text-[11px] text-[#1a1410]/45">
          <span>© 2026 Maison Lumière. All rights reserved.</span>
          <span>maisonlumiere.co</span>
        </div>
      </footer>
    </div>
  );
}
