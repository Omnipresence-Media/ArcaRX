import { motion } from "framer-motion";
import {
  Activity, FlaskConical, ShieldCheck, Stethoscope, HeartPulse, Microscope,
  Sparkles, ArrowRight, Check, Star, Moon, Dumbbell, Brain, Phone,
  Atom, MapPin, BookOpen, Mail, Plus, Quote, Award, Beaker,
} from "lucide-react";

/* ARCANUM Hormone Co. - premium HRT marketing site (single-file, dark, editorial) */

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

export function HrtSite() {
  return (
    <div className="hrt-root font-[Inter,system-ui,sans-serif] text-white">
      <style>{`
        .hrt-root { background:#070a0f; }
        .hrt-grain::before{
          content:"";position:absolute;inset:0;pointer-events:none;opacity:.08;mix-blend-mode:overlay;
          background-image:radial-gradient(rgba(255,255,255,.7) 1px,transparent 1px);background-size:3px 3px;
        }
        .hrt-orb{position:absolute;border-radius:9999px;filter:blur(80px);opacity:.55;}
        .hrt-marquee{display:flex;gap:3rem;animation:hrt-scroll 38s linear infinite;}
        @keyframes hrt-scroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        .hrt-glow{box-shadow:0 0 0 1px rgba(120,200,220,.15),0 30px 80px -20px rgba(20,160,180,.35);}
        .hrt-card{background:linear-gradient(180deg,rgba(255,255,255,.04),rgba(255,255,255,.015));border:1px solid rgba(255,255,255,.07);}
        .hrt-serif{font-family:"Instrument Serif", "Cormorant Garamond", Georgia, serif; font-weight:400; letter-spacing:-0.01em;}
      `}</style>

      {/* ANNOUNCEMENT BAR */}
      <div className="border-b border-white/5 bg-gradient-to-r from-teal-300/[0.08] via-cyan-400/[0.05] to-emerald-300/[0.08] px-4 py-2 text-center text-[11px] tracking-wide text-white/70">
        <span className="mr-1.5 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 align-middle" />
        Summer optimization cohort enrolling - first month $1 with code <span className="font-mono text-teal-300">RESET</span> · ends Jun 30
      </div>

      {/* NAV */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-[#070a0f]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br from-teal-300 to-cyan-600 text-[#070a0f]">
              <Activity className="h-3.5 w-3.5" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-semibold tracking-[0.18em]">ARCANUM</span>
            <span className="text-[10px] tracking-[0.3em] text-white/40">HORMONE CO.</span>
          </div>
          <nav className="hidden gap-8 text-[13px] text-white/70 md:flex">
            {["Protocols","Science","Labs","Pricing","Providers","Journal"].map(x=>(
              <a key={x} className="transition-colors hover:text-white">{x}</a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a className="hidden text-[13px] text-white/70 hover:text-white md:inline">Member login</a>
            <button className="rounded-full bg-white px-4 py-2 text-[12px] font-semibold text-[#070a0f] transition hover:bg-white/90">
              Start intake →
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="hrt-grain relative overflow-hidden">
        <div className="hrt-orb h-[520px] w-[520px] -left-32 -top-32 bg-teal-400" />
        <div className="hrt-orb h-[420px] w-[420px] right-0 top-40 bg-cyan-500" />
        <div className="hrt-orb h-[360px] w-[360px] left-1/3 -bottom-24 bg-emerald-400/60" />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 pb-24 pt-20 md:grid-cols-12 md:pt-28">
          <motion.div {...fadeUp} className="md:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] tracking-wide text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Now accepting patients in 38 states
            </div>
            <h1 className="hrt-serif mt-6 text-[64px] leading-[0.95] md:text-[88px]">
              Hormones, <em className="text-teal-300 not-italic italic">recalibrated</em>.
              <br />Life, returned.
            </h1>
            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-white/65">
              Physician-designed bioidentical hormone therapy for men and women. Quarterly labs,
              titrated dosing, white-glove pharmacy logistics - all guided by an MD who answers
              your texts.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button className="group inline-flex items-center gap-2 rounded-full bg-teal-300 px-5 py-3 text-[13px] font-semibold text-[#06222a] transition hover:bg-teal-200">
                Book free consult <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </button>
              <button className="rounded-full border border-white/15 px-5 py-3 text-[13px] text-white/80 transition hover:bg-white/5">
                Watch the science (2 min)
              </button>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-6 text-[12px] text-white/50">
              <div className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-teal-300" /> HIPAA + LegitScript</div>
              <div className="flex items-center gap-1.5"><FlaskConical className="h-4 w-4 text-teal-300" /> 503A/B compounding partners</div>
              <div className="flex items-center gap-1.5"><Stethoscope className="h-4 w-4 text-teal-300" /> Board-certified MDs</div>
            </div>
          </motion.div>

          {/* Hero panel - mock dashboard */}
          <motion.div {...fadeUp} transition={{...fadeUp.transition, delay:0.1}} className="md:col-span-5">
            <div className="hrt-glow relative rounded-2xl border border-white/10 bg-gradient-to-br from-[#0a1820] to-[#06121a] p-5">
              <div className="flex items-center justify-between text-[11px] text-white/50">
                <span>Lab snapshot · Jun 02</span>
                <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-emerald-300">optimized</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {[
                  { l: "Total T", v: "842", u: "ng/dL", d: "+312" },
                  { l: "Free T", v: "21.4", u: "pg/mL", d: "+9.1" },
                  { l: "Estradiol", v: "28", u: "pg/mL", d: "in range" },
                  { l: "SHBG", v: "34", u: "nmol/L", d: "stable" },
                ].map(s=>(
                  <div key={s.l} className="rounded-lg border border-white/5 bg-white/[0.03] p-3">
                    <p className="text-[10px] uppercase tracking-wider text-white/40">{s.l}</p>
                    <p className="mt-1 font-semibold"><span className="text-2xl">{s.v}</span> <span className="text-[10px] text-white/40">{s.u}</span></p>
                    <p className="mt-1 text-[10px] text-teal-300">{s.d}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-lg border border-white/5 bg-white/[0.03] p-3">
                <div className="flex items-center justify-between text-[11px] text-white/60">
                  <span>12-week protocol · Testosterone Cyp.</span>
                  <span className="text-white/40">Week 8/12</span>
                </div>
                <div className="mt-2 flex h-1.5 overflow-hidden rounded-full bg-white/5">
                  <div className="h-full w-2/3 bg-gradient-to-r from-teal-400 to-cyan-500" />
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.03] p-3 text-[12px]">
                <div className="flex items-center gap-2"><HeartPulse className="h-4 w-4 text-teal-300" />Next injection</div>
                <span className="text-white/60">Mon · 0.4 mL SubQ</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Logo marquee */}
        <div className="relative overflow-hidden border-y border-white/5 bg-white/[0.02] py-6">
          <div className="hrt-marquee whitespace-nowrap text-[11px] uppercase tracking-[0.3em] text-white/40">
            {Array.from({length:2}).map((_,i)=>(
              <div key={i} className="flex shrink-0 items-center gap-12">
                <span>Featured in</span>
                <span>- Men&apos;s Health</span><span>- Vogue</span><span>- Bloomberg</span>
                <span>- Forbes</span><span>- WSJ</span><span>- GQ</span><span>- Outside</span>
                <span>- The Atlantic</span><span>- Bon Appétit</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="mx-auto grid max-w-7xl gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/5 md:grid-cols-4">
        {[
          { v: "14,200+", l: "Patients optimized" },
          { v: "94%", l: "Symptom resolution at 90 days" },
          { v: "<48h", l: "Lab → protocol turnaround" },
          { v: "4.96 / 5", l: "Avg. patient rating" },
        ].map(s=>(
          <div key={s.l} className="bg-[#070a0f] p-8">
            <p className="hrt-serif text-4xl text-teal-300">{s.v}</p>
            <p className="mt-2 text-[12px] text-white/60">{s.l}</p>
          </div>
        ))}
      </section>

      {/* FOUNDER LETTER */}
      <section className="mx-auto max-w-7xl px-6 py-28">
        <div className="grid gap-12 md:grid-cols-12">
          <motion.div {...fadeUp} className="md:col-span-4">
            <div className="aspect-[4/5] rounded-2xl bg-gradient-to-br from-teal-300/30 via-cyan-700/30 to-[#06121a] hrt-glow" />
            <p className="hrt-serif mt-4 text-xl italic">Dr. Elena Voss, MD</p>
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/45">Founder · Chief Medical Officer</p>
            <p className="mt-1 text-[11px] text-white/40">Endocrinology, Johns Hopkins · 14 years in practice</p>
          </motion.div>
          <motion.div {...fadeUp} transition={{...fadeUp.transition, delay:0.1}} className="md:col-span-8">
            <p className="text-[11px] uppercase tracking-[0.3em] text-teal-300">A letter from the founder</p>
            <h2 className="hrt-serif mt-4 text-5xl leading-[1.05]">
              I built Arcanum because the system kept telling my patients they were <em className="italic text-teal-300">"within range."</em>
            </h2>
            <div className="mt-7 space-y-4 text-[15px] leading-relaxed text-white/65">
              <p>
                "In-range" is a statistical convenience, not a clinical destination. It is the average
                of a tired population, weighted by people who feel terrible and don't know why.
              </p>
              <p>
                Arcanum exists for the patient who has been dismissed. The 42-year-old who can't sleep.
                The 53-year-old whose joy quietly evaporated. The 28-year-old whose thyroid panel was
                "fine" three times in a row. We treat humans, not reference intervals.
              </p>
              <p>
                Every protocol you'll see here was written by a board-certified physician, reviewed
                quarterly against your labs, and shipped from a 503A/B pharmacy we personally toured.
                That is the entire promise.
              </p>
            </div>
            <div className="mt-8 hrt-serif text-2xl italic text-teal-300">- Elena</div>
          </motion.div>
        </div>
      </section>

      {/* CANDIDACY QUIZ */}
      <section className="relative overflow-hidden border-y border-white/5 bg-gradient-to-b from-[#06121a] to-[#070a0f]">
        <div className="hrt-orb h-[300px] w-[300px] right-10 top-10 bg-cyan-500" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-24 md:grid-cols-12">
          <motion.div {...fadeUp} className="md:col-span-5">
            <p className="text-[11px] uppercase tracking-[0.3em] text-teal-300">2-minute assessment</p>
            <h2 className="hrt-serif mt-3 text-5xl leading-tight">Are you a candidate?</h2>
            <p className="mt-5 max-w-md text-[14px] text-white/60">
              Twelve questions about energy, sleep, libido, mood, and recovery. Reviewed by an MD
              within 24 hours. No card required, no upsell - just an honest answer.
            </p>
            <div className="mt-7 flex items-center gap-3">
              <button className="rounded-full bg-teal-300 px-6 py-3 text-[12px] font-semibold text-[#06222a] hover:bg-teal-200">
                Begin assessment →
              </button>
              <span className="text-[11px] text-white/40">Avg. completion · 2:14</span>
            </div>
          </motion.div>
          <div className="md:col-span-7">
            <motion.div {...fadeUp} className="hrt-card hrt-glow rounded-2xl p-6">
              <div className="flex items-center justify-between text-[11px] text-white/50">
                <span>Question 3 of 12</span>
                <span className="text-teal-300">25% complete</span>
              </div>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/5">
                <div className="h-full w-1/4 bg-gradient-to-r from-teal-400 to-cyan-500" />
              </div>
              <p className="hrt-serif mt-6 text-2xl">In the last 30 days, how often have you woken up genuinely rested?</p>
              <div className="mt-6 grid gap-2">
                {[
                  ["Most mornings","Energy is generally where I want it."],
                  ["A few times a week","Some good days, some flat days."],
                  ["Rarely","I'm dragging through most mornings.", true],
                  ["Almost never","Caffeine is doing the work, not sleep."],
                ].map(([t,d,on])=>(
                  <button key={t as string}
                    className={`flex items-start justify-between gap-4 rounded-xl border p-4 text-left transition ${on?"border-teal-300/50 bg-teal-300/[0.06]":"border-white/5 bg-white/[0.02] hover:border-white/15"}`}>
                    <div>
                      <p className="text-[14px] font-medium">{t}</p>
                      <p className="mt-0.5 text-[12px] text-white/50">{d}</p>
                    </div>
                    {on && <span className="grid h-5 w-5 place-items-center rounded-full bg-teal-300 text-[#06222a]"><Check className="h-3 w-3"/></span>}
                  </button>
                ))}
              </div>
              <div className="mt-6 flex items-center justify-between">
                <button className="text-[12px] text-white/50 hover:text-white">← Back</button>
                <button className="inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2 text-[12px] font-semibold text-[#070a0f]">
                  Continue <ArrowRight className="h-3.5 w-3.5"/>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* PROTOCOLS */}
      <section className="mx-auto max-w-7xl px-6 py-28">
        <motion.div {...fadeUp} className="mb-14 max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.3em] text-teal-300">Protocols</p>
          <h2 className="hrt-serif mt-3 text-5xl">Designed by endocrinologists. Personalized by your data.</h2>
        </motion.div>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { i: Dumbbell, t: "Male TRT", b: "Testosterone cypionate, enanthate, or cream. HCG and AI when indicated.", p: "from $189/mo" },
            { i: Moon,     t: "Female HRT", b: "Estradiol, progesterone, low-dose testosterone. Peri- and post-menopause.", p: "from $159/mo" },
            { i: Brain,    t: "Thyroid & Adrenal", b: "T3/T4, NDT, and HPA-axis support. Full panel quarterly.", p: "from $129/mo" },
            { i: HeartPulse, t: "Peptide Stack", b: "BPC-157, CJC/Ipamorelin, Tesamorelin - recovery and longevity.", p: "from $239/mo" },
            { i: Sparkles, t: "Sexual Wellness", b: "PT-141, oxytocin troches, sildenafil/tadalafil. Discreet shipping.", p: "from $89/mo" },
            { i: Microscope, t: "Longevity Labs", b: "ApoB, Lp(a), hsCRP, hormone panel - annually with MD review.", p: "$349 one-time" },
          ].map(({i:Icon,t,b,p})=>(
            <motion.article key={t} {...fadeUp}
              className="hrt-card group relative overflow-hidden rounded-2xl p-6 transition hover:-translate-y-1 hover:border-teal-300/40">
              <div className="mb-5 grid h-10 w-10 place-items-center rounded-lg bg-teal-300/10 text-teal-300">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold">{t}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-white/55">{b}</p>
              <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4 text-[12px]">
                <span className="text-white/40">{p}</span>
                <span className="flex items-center gap-1 text-teal-300">Explore <ArrowRight className="h-3.5 w-3.5" /></span>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* PROCESS */}
      <section className="border-y border-white/5 bg-gradient-to-b from-[#06121a] to-[#070a0f] py-28">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div {...fadeUp} className="mb-14 max-w-2xl">
            <p className="text-[11px] uppercase tracking-[0.3em] text-teal-300">How it works</p>
            <h2 className="hrt-serif mt-3 text-5xl">From intake to first dose in 7 days.</h2>
          </motion.div>
          <div className="grid gap-8 md:grid-cols-4">
            {[
              ["01","Intake","12-minute medical history + goals. No insurance hoops."],
              ["02","Labs","At-home phlebotomy or LabCorp/Quest. We cover the draw."],
              ["03","Protocol","MD designs your titration. Pharmacy ships in temp-controlled overnight."],
              ["04","Optimize","Quarterly recheck. Dose tuned to data, not guesses."],
            ].map(([n,t,b])=>(
              <motion.div {...fadeUp} key={n} className="relative">
                <p className="hrt-serif text-7xl text-white/10">{n}</p>
                <h3 className="-mt-6 text-lg font-semibold">{t}</h3>
                <p className="mt-2 text-[13px] text-white/55">{b}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SCIENCE / MOLECULES */}
      <section className="mx-auto max-w-7xl px-6 py-28">
        <motion.div {...fadeUp} className="mb-14 flex items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-[11px] uppercase tracking-[0.3em] text-teal-300">The science</p>
            <h2 className="hrt-serif mt-3 text-5xl">Every molecule, accounted for.</h2>
            <p className="mt-4 text-[14px] text-white/55">Bioidentical means chemically identical to what your body already makes. Here is what we prescribe, what it does, and what the literature says.</p>
          </div>
          <a className="hidden text-[12px] tracking-[0.18em] uppercase text-teal-300 md:inline">Read the white paper →</a>
        </motion.div>
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { sym:"T", n:"Testosterone Cypionate", c:"C27H40O3", b:"Long-ester androgen. SubQ or IM, weekly or twice weekly.", refs:"7 RCTs" },
            { sym:"E₂", n:"Estradiol", c:"C18H24O2", b:"Transdermal patch, cream, or oral. Bone, brain, vasomotor.", refs:"WHI re-analysis 2017" },
            { sym:"P₄", n:"Progesterone", c:"C21H30O2", b:"Oral micronized at bedtime. Sleep, mood, endometrial protection.", refs:"PEPI trial" },
            { sym:"T₃", n:"Liothyronine", c:"C15H12I3NO4", b:"Active thyroid hormone. Energy, temperature, cognition.", refs:"Bunevicius 1999" },
            { sym:"hCG", n:"Human Chorionic Gonadotropin", c:"glycoprotein", b:"Preserves testicular function on TRT. 2x weekly SubQ.", refs:"4 cohort studies" },
            { sym:"BPC", n:"BPC-157", c:"peptide · 15 aa", b:"Tissue repair, gut lining, tendon healing. Daily SubQ.", refs:"30+ preclinical" },
            { sym:"PT", n:"PT-141 (Bremelanotide)", c:"C50H68N14O10", b:"Melanocortin agonist. Libido, arousal - both sexes.", refs:"FDA approved" },
            { sym:"Tes", n:"Tesamorelin", c:"peptide · 44 aa", b:"GHRH analogue. Visceral fat, IGF-1, sleep architecture.", refs:"FDA approved" },
          ].map(m=>(
            <motion.div {...fadeUp} key={m.n}
              className="hrt-card group rounded-2xl p-5 transition hover:-translate-y-1 hover:border-teal-300/40">
              <div className="flex items-start justify-between">
                <div className="hrt-serif grid h-14 w-14 place-items-center rounded-xl bg-gradient-to-br from-teal-300/20 to-cyan-700/20 text-3xl text-teal-200 ring-1 ring-teal-300/20">
                  {m.sym}
                </div>
                <Atom className="h-4 w-4 text-white/30 transition group-hover:text-teal-300" />
              </div>
              <p className="mt-4 text-[14px] font-semibold leading-tight">{m.n}</p>
              <p className="mt-1 font-mono text-[10px] text-white/40">{m.c}</p>
              <p className="mt-3 text-[12px] leading-relaxed text-white/60">{m.b}</p>
              <p className="mt-4 border-t border-white/5 pt-3 text-[10px] uppercase tracking-wider text-teal-300/80">{m.refs}</p>
            </motion.div>
          ))}
        </div>

        {/* Lab markers we track */}
        <motion.div {...fadeUp} className="mt-14 hrt-card rounded-2xl p-8">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-teal-300">What we track</p>
              <h3 className="hrt-serif mt-2 text-3xl">68 markers per quarter. Most clinics check 12.</h3>
            </div>
            <div className="hidden text-right md:block">
              <p className="hrt-serif text-5xl text-teal-300">68</p>
              <p className="text-[10px] uppercase tracking-wider text-white/40">markers / quarter</p>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-1.5 text-[11px]">
            {["Total T","Free T","Bioavailable T","SHBG","Estradiol (LC-MS)","Estrone","DHT","DHEA-S","Pregnenolone","Progesterone","Cortisol AM","Cortisol PM","TSH","Free T3","Free T4","Reverse T3","TPO Ab","Thyroglobulin Ab","FSH","LH","Prolactin","IGF-1","IGFBP-3","HbA1c","Fasting Insulin","Fasting Glucose","HOMA-IR","ApoB","Lp(a)","LDL-P","HDL-P","Triglycerides","hsCRP","Homocysteine","Ferritin","Iron","TIBC","Vitamin D","B12","Folate","Magnesium RBC","CBC w/ diff","CMP","GGT","ALT","AST","eGFR","Creatinine","BUN","Cystatin C","Uric Acid","PSA","Sex hormone binding"," + 16 more"].map(x=>(
              <span key={x} className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-white/65">{x}</span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* COMPARISON */}
      <section className="mx-auto max-w-6xl px-6 py-28">
        <motion.div {...fadeUp} className="mb-12 text-center">
          <p className="text-[11px] uppercase tracking-[0.3em] text-teal-300">The difference</p>
          <h2 className="hrt-serif mx-auto mt-3 max-w-2xl text-5xl">Why patients leave their old clinic for Arcanum.</h2>
        </motion.div>
        <div className="hrt-card grid overflow-hidden rounded-2xl md:grid-cols-3">
          <div className="p-6 text-[11px] uppercase tracking-[0.2em] text-white/40">Feature</div>
          <div className="border-l border-white/5 bg-white/[0.02] p-6 text-center text-[11px] uppercase tracking-[0.2em] text-white/40">Typical clinic</div>
          <div className="border-l border-white/5 bg-teal-300/10 p-6 text-center text-[11px] uppercase tracking-[0.2em] text-teal-200">Arcanum</div>
          {[
            ["Lab cadence","Annually","Quarterly + on-demand"],
            ["Provider access","Portal ticket","Direct text to your MD"],
            ["Dose adjustments","Office visit required","Titrated remotely from your data"],
            ["Pharmacy","Mailed in standard envelope","Temp-controlled overnight, signature"],
            ["Insurance hassles","Constant","None - flat membership"],
          ].map(([f,a,b])=>(
            <div className="contents" key={f as string}>
              <div className="border-t border-white/5 p-5 text-sm">{f}</div>
              <div className="border-l border-t border-white/5 bg-white/[0.02] p-5 text-center text-sm text-white/50">{a}</div>
              <div className="border-l border-t border-white/5 bg-teal-300/[0.06] p-5 text-center text-sm text-teal-200">{b}</div>
            </div>
          ))}
        </div>
      </section>

      {/* COVERAGE MAP */}
      <section className="border-y border-white/5 bg-[#06121a] py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-12">
          <motion.div {...fadeUp} className="md:col-span-5">
            <p className="text-[11px] uppercase tracking-[0.3em] text-teal-300">Coverage</p>
            <h2 className="hrt-serif mt-3 text-5xl">38 states. More every quarter.</h2>
            <p className="mt-5 max-w-md text-[14px] text-white/60">
              Telehealth from anywhere with a licensed physician in your state.
              At-home phlebotomy in 220+ metro areas. Overnight pharmacy nationwide.
            </p>
            <div className="mt-7 grid grid-cols-2 gap-2 text-[12px]">
              {["California","New York","Texas","Florida","Illinois","Washington","Colorado","Massachusetts","Arizona","Pennsylvania","Georgia","North Carolina"].map(s=>(
                <div key={s} className="flex items-center gap-2 text-white/70">
                  <Check className="h-3.5 w-3.5 text-teal-300"/>{s}
                </div>
              ))}
            </div>
            <button className="mt-7 inline-flex items-center gap-2 text-[12px] text-teal-300 hover:text-teal-200">
              See full coverage map <ArrowRight className="h-3.5 w-3.5"/>
            </button>
          </motion.div>
          <motion.div {...fadeUp} transition={{...fadeUp.transition, delay:0.1}} className="md:col-span-7">
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#08151c] to-[#040810] p-6">
              {/* abstract US map dot grid */}
              <svg viewBox="0 0 600 360" className="h-full w-full">
                <defs>
                  <radialGradient id="hrtGlow" cx="50%" cy="50%">
                    <stop offset="0%" stopColor="#5eead4" stopOpacity="0.5"/>
                    <stop offset="100%" stopColor="#5eead4" stopOpacity="0"/>
                  </radialGradient>
                </defs>
                <circle cx="300" cy="180" r="180" fill="url(#hrtGlow)"/>
                {Array.from({length:520}).map((_,i)=>{
                  const x = 60 + (i%26)*20;
                  const y = 40 + Math.floor(i/26)*16;
                  // rough US silhouette mask via radial distance
                  const dx = x-300, dy = y-180;
                  const inUS = Math.abs(dx)<240 && Math.abs(dy)<110 && (dx*dx)/(240*240)+(dy*dy)/(110*110) < 1;
                  if(!inUS) return null;
                  const lit = Math.random() > 0.35;
                  return <circle key={i} cx={x} cy={y} r={lit?1.6:1} fill={lit?"#5eead4":"#1e3a40"} opacity={lit?0.85:0.5}/>;
                })}
                {/* pins */}
                {[[180,200,"LA"],[230,140,"SF"],[460,140,"NYC"],[420,210,"ATL"],[300,240,"DAL"],[480,230,"MIA"],[330,130,"CHI"],[210,110,"SEA"]].map(([x,y,c])=>(
                  <g key={c as string}>
                    <circle cx={x as number} cy={y as number} r="8" fill="#5eead4" opacity="0.25"/>
                    <circle cx={x as number} cy={y as number} r="3" fill="#5eead4"/>
                    <text x={(x as number)+8} y={(y as number)+4} fontSize="8" fill="#94f0e4" fontFamily="monospace">{c}</text>
                  </g>
                ))}
              </svg>
              <div className="absolute bottom-5 left-5 flex items-center gap-4 text-[10px] uppercase tracking-wider text-white/50">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-teal-300"/>active</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-white/20"/>pending</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PROVIDERS */}
      <section className="mx-auto max-w-7xl px-6 py-28">
        <motion.div {...fadeUp} className="mb-14 max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.3em] text-teal-300">The team</p>
          <h2 className="hrt-serif mt-3 text-5xl">Physicians who answer the phone.</h2>
        </motion.div>
        <div className="grid gap-6 md:grid-cols-4">
          {[
            { n:"Dr. Elena Voss, MD",     r:"Endocrinology · CMO",        c:"Johns Hopkins · 14 yrs",  hue:200 },
            { n:"Dr. Marcus Chen, DO",    r:"Men's Health · TRT",          c:"UCLA · 11 yrs",          hue:180 },
            { n:"Dr. Priya Anand, MD",    r:"Female HRT · Perimenopause",  c:"Mount Sinai · 9 yrs",    hue:170 },
            { n:"Dr. Theo Lindqvist, MD", r:"Longevity · Peptides",        c:"Karolinska · 13 yrs",    hue:210 },
          ].map(p=>(
            <motion.div {...fadeUp} key={p.n} className="hrt-card overflow-hidden rounded-2xl">
              <div className="aspect-[4/5]" style={{ background:`linear-gradient(160deg, oklch(0.5 0.12 ${p.hue}) 0%, #06121a 100%)`}} />
              <div className="p-5">
                <p className="hrt-serif text-xl">{p.n}</p>
                <p className="mt-1 text-[11px] uppercase tracking-wider text-teal-300/80">{p.r}</p>
                <p className="mt-2 text-[12px] text-white/50">{p.c}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <motion.div {...fadeUp} className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <div className="flex items-center gap-3 text-[13px] text-white/70">
            <Award className="h-5 w-5 text-teal-300" />
            34 physicians · 28 nurse practitioners · 12 registered nurses · 100% US-licensed
          </div>
          <button className="text-[12px] tracking-[0.18em] uppercase text-teal-300 hover:text-teal-200">Meet the team →</button>
        </motion.div>
      </section>

      {/* TESTIMONIAL */}
      <section className="border-y border-white/5 bg-[#06121a] py-28">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-2">
          {[
            { q:"I sleep through the night for the first time in a decade. My wife noticed before I did.", n:"Marcus R.", m:"Age 47 · TRT + Peptides · 6 months" },
            { q:"My GYN told me peri was 'normal.' Arcanum's MD actually read my labs. Mood, libido, sleep - all back.", n:"Lena K.", m:"Age 51 · HRT · 4 months" },
          ].map(t=>(
            <motion.figure {...fadeUp} key={t.n} className="hrt-card rounded-2xl p-8">
              <div className="mb-4 flex gap-1 text-teal-300">{Array.from({length:5}).map((_,i)=><Star key={i} className="h-4 w-4 fill-current" />)}</div>
              <blockquote className="hrt-serif text-2xl leading-snug">"{t.q}"</blockquote>
              <figcaption className="mt-6 text-[12px] text-white/55">{t.n} · <span className="text-white/40">{t.m}</span></figcaption>
            </motion.figure>
          ))}
        </div>
      </section>

      {/* PRESS STRIP */}
      <section className="border-y border-white/5 bg-[#05080c] py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-3">
          {[
            { p:"Bloomberg", q:"The clinic that treats patients, not lab ranges.", a:"- A. Whitfield, Health desk" },
            { p:"Men's Health", q:"The most rigorous TRT program we've audited this year.", a:"- Dr. R. Sato (consulting)" },
            { p:"The Atlantic", q:"Arcanum has redefined what 'concierge' means in hormone medicine.", a:"- L. Pereira, Long-read" },
          ].map(t=>(
            <motion.div {...fadeUp} key={t.p} className="relative">
              <Quote className="absolute -top-2 -left-1 h-8 w-8 text-teal-300/30"/>
              <p className="hrt-serif text-xl leading-snug text-white/80 pl-7">"{t.q}"</p>
              <div className="mt-5 flex items-center justify-between pl-7">
                <p className="text-[11px] uppercase tracking-[0.25em] text-teal-300">{t.p}</p>
                <p className="text-[11px] text-white/40">{t.a}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section className="mx-auto max-w-7xl px-6 py-28">
        <motion.div {...fadeUp} className="mb-12 text-center">
          <p className="text-[11px] uppercase tracking-[0.3em] text-teal-300">Membership</p>
          <h2 className="hrt-serif mt-3 text-5xl">Flat monthly. Everything included.</h2>
        </motion.div>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { n:"Essential", p:"$159", f:["Quarterly labs","MD-designed protocol","Pharmacy shipping","Portal messaging"] },
            { n:"Optimize", p:"$249", featured:true, f:["Everything in Essential","Monthly RN check-ins","Peptide add-ons at cost","Direct MD text line"] },
            { n:"Concierge", p:"$499", f:["Everything in Optimize","Dedicated care team","Annual longevity panel","Travel-ready Rx logistics"] },
          ].map(t=>(
            <motion.div {...fadeUp} key={t.n}
              className={`hrt-card relative rounded-2xl p-7 ${t.featured?"border-teal-300/40 ring-1 ring-teal-300/30":""}`}>
              {t.featured && <span className="absolute -top-2 left-7 rounded-full bg-teal-300 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#06222a]">Most chosen</span>}
              <h3 className="text-base font-semibold">{t.n}</h3>
              <p className="hrt-serif mt-3 text-5xl">{t.p}<span className="text-base text-white/40">/mo</span></p>
              <ul className="mt-6 space-y-2.5 text-[13px] text-white/70">
                {t.f.map(x=><li key={x} className="flex gap-2"><Check className="h-4 w-4 text-teal-300"/>{x}</li>)}
              </ul>
              <button className={`mt-7 w-full rounded-full px-4 py-2.5 text-[12px] font-semibold transition ${t.featured?"bg-teal-300 text-[#06222a] hover:bg-teal-200":"border border-white/15 text-white hover:bg-white/5"}`}>
                Choose {t.n}
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="border-y border-white/5 bg-[#06121a] py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-12">
          <motion.div {...fadeUp} className="md:col-span-4">
            <p className="text-[11px] uppercase tracking-[0.3em] text-teal-300">FAQ</p>
            <h2 className="hrt-serif mt-3 text-5xl">The questions everyone asks (and a few they don't).</h2>
            <p className="mt-5 text-[14px] text-white/55">Don't see yours? <span className="text-teal-300 underline underline-offset-2">Text a nurse</span>.</p>
          </motion.div>
          <div className="md:col-span-8">
            <div className="hrt-card divide-y divide-white/5 overflow-hidden rounded-2xl">
              {[
                { q:"Is bioidentical the same as natural?",
                  a:"Yes - bioidentical means the molecule is chemically identical to what your body makes. It's derived from plant sterols and synthesized in a lab. It is not the same as compounded conjugated equine estrogens (Premarin), which is what 1990s HRT studies used.", open:true },
                { q:"How fast will I feel a difference?",
                  a:"Most patients feel sleep and energy shifts in 2–3 weeks. Mood and cognition follow at 4–6. Body composition changes meaningfully at 12 weeks. We measure all of it." },
                { q:"What does the lab work cost?",
                  a:"Included in your membership. We cover the at-home draw, the panel, and the MD review. No surprise bills, no insurance haggling." },
                { q:"Is testosterone for women safe?",
                  a:"At physiologic doses (1–2 mg/day transdermal), yes - and it's increasingly recognized as standard care for low libido, fatigue, and bone density in peri- and post-menopause." },
                { q:"What if my labs come back unusual?",
                  a:"An MD reviews every panel within 48 hours. If something looks off - thyroid, lipids, anything - we'll flag it, explain it, and adjust your protocol or refer you out." },
                { q:"Can I pause or cancel?",
                  a:"Yes. Pause anytime, cancel anytime, with one click in the portal. No contracts. Your records are exportable in PDF and FHIR." },
              ].map((f,i)=>(
                <details key={i} className="group p-5" {...(f.open ? {open:true} : {})}>
                  <summary className="flex cursor-pointer items-center justify-between gap-4 list-none">
                    <span className="text-[15px] font-medium">{f.q}</span>
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-white/10 text-white/60 transition group-open:rotate-45 group-open:border-teal-300/40 group-open:text-teal-300">
                      <Plus className="h-3.5 w-3.5"/>
                    </span>
                  </summary>
                  <p className="mt-3 max-w-2xl pr-10 text-[13px] leading-relaxed text-white/60">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* JOURNAL */}
      <section className="mx-auto max-w-7xl px-6 py-28">
        <motion.div {...fadeUp} className="mb-14 flex items-end justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-teal-300">Journal</p>
            <h2 className="hrt-serif mt-3 text-5xl">Written by clinicians. Read by curious humans.</h2>
          </div>
          <a className="hidden text-[12px] tracking-[0.18em] uppercase text-teal-300 md:inline">Browse all →</a>
        </motion.div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { tag:"Endocrinology", t:"What 'normal' testosterone actually means in 2026", a:"Dr. Marcus Chen", r:"8 min", hue:200 },
            { tag:"Women's Health", t:"Perimenopause is a 10-year event. Here's the protocol.", a:"Dr. Priya Anand", r:"12 min", hue:170 },
            { tag:"Longevity", t:"Peptides, plainly: the only six worth your money", a:"Dr. Theo Lindqvist", r:"6 min", hue:210 },
          ].map(a=>(
            <motion.article {...fadeUp} key={a.t} className="hrt-card group overflow-hidden rounded-2xl">
              <div className="aspect-[16/10] transition group-hover:scale-[1.02]"
                   style={{ background:`linear-gradient(135deg, oklch(0.45 0.14 ${a.hue}), #06121a)` }} />
              <div className="p-6">
                <p className="text-[10px] uppercase tracking-[0.2em] text-teal-300">{a.tag} · {a.r}</p>
                <h3 className="hrt-serif mt-3 text-2xl leading-tight">{a.t}</h3>
                <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4">
                  <span className="text-[12px] text-white/55">{a.a}</span>
                  <BookOpen className="h-4 w-4 text-teal-300/70"/>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="hrt-orb h-[400px] w-[400px] left-1/2 top-0 -translate-x-1/2 bg-teal-400/60" />
        <div className="relative mx-auto max-w-4xl px-6 py-28 text-center">
          <motion.h2 {...fadeUp} className="hrt-serif text-6xl">Feel like yourself. <em className="text-teal-300 italic">Again.</em></motion.h2>
          <p className="mx-auto mt-5 max-w-lg text-[14px] text-white/60">A 12-minute intake, a complimentary 20-minute MD call, and labs covered. No contracts.</p>
          <div className="mt-8 flex justify-center gap-3">
            <button className="rounded-full bg-white px-6 py-3 text-[13px] font-semibold text-[#070a0f] hover:bg-white/90">Start intake</button>
            <button className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-[13px] hover:bg-white/5"><Phone className="h-4 w-4"/>Talk to a nurse</button>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="relative overflow-hidden border-t border-white/5 bg-gradient-to-b from-[#070a0f] to-[#05080c] py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 md:grid-cols-2">
          <motion.div {...fadeUp}>
            <p className="text-[11px] uppercase tracking-[0.3em] text-teal-300">The Arcanum Letter</p>
            <h2 className="hrt-serif mt-3 text-4xl">One email a month. No nonsense.</h2>
            <p className="mt-4 max-w-md text-[13px] text-white/55">
              Lab interpretations, new molecule reviews, and the occasional rant from Dr. Voss
              about reference intervals. ~18k clinicians and patients read it.
            </p>
          </motion.div>
          <motion.form {...fadeUp} onSubmit={(e)=>e.preventDefault()}
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] p-1.5 pl-5 backdrop-blur">
            <Mail className="h-4 w-4 text-white/40"/>
            <input type="email" placeholder="you@domain.com"
              className="flex-1 bg-transparent text-[14px] text-white placeholder:text-white/40 focus:outline-none" />
            <button className="rounded-full bg-teal-300 px-5 py-2.5 text-[12px] font-semibold text-[#06222a] hover:bg-teal-200">
              Subscribe
            </button>
          </motion.form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 bg-[#05080c] pt-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-6">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-md bg-gradient-to-br from-teal-300 to-cyan-600 text-[#070a0f]"><Activity className="h-4 w-4" strokeWidth={2.5}/></div>
              <span className="text-sm font-semibold tracking-[0.18em]">ARCANUM</span>
              <span className="text-[10px] tracking-[0.3em] text-white/40">HORMONE CO.</span>
            </div>
            <p className="mt-5 max-w-xs text-[12px] leading-relaxed text-white/45">
              Physician-led bioidentical hormone therapy. Telehealth in 38 states.
              503A/B compounding partners. Founded in Boulder, CO.
            </p>
            <div className="mt-5 flex items-center gap-2 text-[10px] uppercase tracking-wider text-white/35">
              <Beaker className="h-3.5 w-3.5 text-teal-300/70"/> Est. 2022
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {["HIPAA","LegitScript","SOC 2","BBB A+"].map(b=>(
                <span key={b} className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-[10px] tracking-wider text-white/50">{b}</span>
              ))}
            </div>
          </div>
          {[
            ["Care",["Male TRT","Female HRT","Thyroid & Adrenal","Peptide Stack","Sexual Wellness","Longevity Labs"]],
            ["Science",["Protocols","Molecules","White papers","Lab markers","Outcomes data"]],
            ["Company",["About","Founder letter","Providers","Journal","Press","Careers","Investors"]],
            ["Support",["Help center","Text a nurse","HIPAA","Terms","Privacy","LegitScript","Contact"]],
          ].map(([h,xs])=>(
            <div key={h as string}>
              <p className="text-[10px] uppercase tracking-[0.25em] text-teal-300/80">{h as string}</p>
              <ul className="mt-4 space-y-2 text-[12px] text-white/65">
                {(xs as string[]).map(x=><li key={x} className="cursor-pointer transition hover:text-white">{x}</li>)}
              </ul>
            </div>
          ))}
        </div>

        {/* Giant wordmark */}
        <div className="mx-auto mt-16 max-w-7xl px-6">
          <p className="hrt-serif text-[clamp(72px,14vw,220px)] leading-[0.85] text-white/[0.04]">arcanum.</p>
        </div>

        <div className="mx-auto mt-6 flex max-w-7xl flex-wrap items-center justify-between gap-3 border-t border-white/5 px-6 py-6 text-[10px] text-white/35">
          <div className="flex items-center gap-4">
            <span>© 2026 Arcanum Hormone Co.</span>
            <span className="hidden md:inline">·</span>
            <span className="hidden md:inline">Compounded preparations prescribed by licensed physicians. Not for use in pregnancy. Results vary.</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono">v4.2.1</span>
            <span>·</span>
            <span>arcanumhormone.com</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
