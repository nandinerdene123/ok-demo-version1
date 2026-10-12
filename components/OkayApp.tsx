"use client";

import { ChangeEvent, ReactNode, useEffect, useRef, useState } from "react";
import { buildQuestionBank, childData, packs, Pack, Question, surveyQuestions, workedExamples } from "@/lib/data";

type Page = "home" | "problems" | "solver" | "progress" | "results" | "mistakes" | "rewards" | "settings";
type Mistake = Question & { given: string; pack: Pack };
type Result = { pack: Pack; correct: number; total: number; earned: number; max: number; claimed: boolean };

const money = (value: number) => `${value.toLocaleString("en-US")}₮`;
const card = "rounded-[24px] bg-white shadow-[0_10px_28px_rgba(57,82,120,.09)]";
const primary = "inline-flex items-center justify-center gap-2 rounded-2xl bg-brand px-5 py-3.5 text-sm font-extrabold text-white shadow-[0_5px_0_#5265bd] transition hover:-translate-y-0.5 hover:bg-[#6479dd] active:translate-y-0 active:shadow-none disabled:cursor-not-allowed disabled:opacity-45";
const outline = "inline-flex items-center justify-center rounded-2xl border-2 border-[#dfe5ef] bg-white px-5 py-3 text-sm font-extrabold text-[#52617c] transition hover:-translate-y-0.5 hover:border-brand";

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 font-black tracking-[-.05em] text-ink" aria-label="Okay">
      <span className={`${compact ? "h-9 w-9" : "h-11 w-11"} relative inline-block -rotate-6 rounded-[48%] border-2 border-[#fff4c9] bg-gradient-to-br from-[#ffe990] to-[#ffd65c] shadow-[0_5px_0_#e6b93d,0_9px_18px_rgba(23,43,77,.12)]`} aria-hidden="true">
        <i className="absolute left-[22%] top-[30%] h-1.5 w-2.5 -rotate-6 rounded-full border-t-[3px] border-[#172b4d]" />
        <i className="absolute right-[23%] top-[27%] h-2 w-1.5 rounded-full bg-[#172b4d]" />
        <i className="absolute bottom-[19%] left-[28%] h-2 w-[45%] rounded-b-full border-b-[3px] border-[#172b4d]" />
      </span>
      <span className={compact ? "text-[28px]" : "text-[32px]"}>O<span className="inline-block -rotate-6 text-[#d19c00]">k</span>ay</span>
    </span>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="mb-2 text-[10px] font-black tracking-[.16em] text-brand">{children}</p>;
}

function AuthFlow({ onDone }: { onDone: () => void }) {
  const [stage, setStage] = useState<"survey" | "phone" | "otp">("survey");
  const [surveyIndex, setSurveyIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const question = surveyQuestions[surveyIndex];

  const nextSurvey = () => {
    if (selected === null) return;
    if (surveyIndex === surveyQuestions.length - 1) setStage("phone");
    else { setSurveyIndex((value) => value + 1); setSelected(null); }
  };

  const sendCode = () => {
    if (phone.length !== 8) { setError("8 оронтой утасны дугаар оруулна уу."); return; }
    setError(""); setStage("otp");
  };

  const verify = () => {
    if (otp !== "1234") { setError(otp.length < 4 ? "4 оронтой кодоо бүрэн оруулна уу." : "Код буруу байна. Дахин шалгана уу."); return; }
    sessionStorage.setItem("okayAuthenticated", "true");
    onDone();
  };

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden px-4 py-12">
      <div className="absolute left-6 top-6 sm:left-10 sm:top-8"><Logo /></div>
      <span className="absolute left-[8%] top-[25%] -rotate-12 text-5xl font-black text-[#ffd55f]">＋</span>
      <span className="absolute right-[9%] top-[16%] rotate-12 text-5xl font-black text-brand/30">×</span>
      <span className="absolute bottom-[12%] right-[15%] -rotate-12 text-6xl font-black text-mint/35">÷</span>

      <section className={`${card} relative z-10 w-full max-w-[520px] px-6 py-8 sm:px-11 sm:py-10`}>
        <div className="mx-auto mb-7 grid h-20 w-20 place-items-center rounded-[26px] bg-[#eaf0fb] shadow-[0_7px_0_#d3deef]"><Logo compact /></div>

        {stage === "survey" && (
          <div key={surveyIndex} className="animate-pop">
            <div className="flex items-center justify-between text-[11px] font-extrabold text-muted"><span>{surveyIndex + 1} / {surveyQuestions.length}</span><button onClick={() => setStage("phone")} className="hover:text-ink">Алгасах</button></div>
            <div className="my-3 h-1.5 overflow-hidden rounded-full bg-[#edf0f4]"><i className="block h-full rounded-full bg-[#f0c84a] transition-all" style={{ width: `${((surveyIndex + 1) / surveyQuestions.length) * 100}%` }} /></div>
            <Eyebrow>ТАНИЛЦАХ АСУУЛГА</Eyebrow>
            <h1 className="text-2xl font-black leading-tight text-ink sm:text-[28px]">{question.q}</h1>
            <p className="mb-6 mt-2 text-sm leading-6 text-muted">{question.d}</p>
            <div className="grid gap-2.5">
              {question.options.map((option, index) => (
                <button key={option[1]} onClick={() => setSelected(index)} className={`flex items-center gap-3 rounded-[14px] border-2 px-3.5 py-3 text-left text-sm font-extrabold transition ${selected === index ? "border-[#e2b938] bg-[#fff7ce] ring-4 ring-[#f0c84a]/10" : "border-[#e6e9ef] bg-white hover:border-[#e2bd46] hover:bg-[#fffcf0]"}`}>
                  <span className={`grid h-9 w-9 place-items-center rounded-[10px] ${selected === index ? "bg-[#172b4d] text-[#ffe06b]" : "bg-[#f1f4f8]"}`}>{option[0]}</span>{option[1]}
                </button>
              ))}
            </div>
            <button onClick={nextSurvey} disabled={selected === null} className={`${primary} mt-5 w-full`}>{surveyIndex === surveyQuestions.length - 1 ? "Асуулга дуусгах ✓" : "Үргэлжлүүлэх →"}</button>
          </div>
        )}

        {stage === "phone" && (
          <div className="animate-pop">
            <Eyebrow>ТАВТАЙ МОРИЛ</Eyebrow><h1 className="text-[28px] font-black">Okay-д нэвтрэх</h1><p className="mt-2 text-sm text-muted">Утасны дугаараа оруулж баталгаажуулах код аваарай.</p>
            <aside className="my-5 flex gap-3 rounded-[18px] border border-[#f0d67b] bg-[#fff9da] p-4 text-left"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sun">💛</span><div><strong className="text-sm">Эцэг эх, асран хамгаалагч танд</strong><p className="mt-1 text-[11px] leading-5 text-[#65728b]">Okay нь хүүхдийг бодлогоо <b className="text-ink">өөрөө бодож, ойлгож сурахад</b> дэмжинэ. Тооны машин, AI хэрэгслийн хэрэглээнд зохистой хяналт тавина уу.</p></div></aside>
            <label className="grid gap-2 text-xs font-extrabold">Утасны дугаар<div className={`flex items-center overflow-hidden rounded-[14px] border-2 bg-white ${error ? "border-[#ef7770]" : "border-[#dfe5ef] focus-within:border-brand"}`}><b className="border-r border-[#e5e9f0] px-4 py-3.5">+976</b><input value={phone} onChange={(event) => { setPhone(event.target.value.replace(/\D/g, "").slice(0, 8)); setError(""); }} inputMode="numeric" placeholder="9911 2233" className="min-w-0 flex-1 border-0 bg-transparent px-4 py-3.5 text-base outline-none" /></div></label>
            {error && <p className="mt-2 text-xs font-bold text-[#d85f58]">{error}</p>}
            <button onClick={sendCode} className={`${primary} mt-5 w-full`}>Код авах →</button>
            <p className="mt-4 text-center text-[10px] leading-4 text-muted">Үргэлжлүүлснээр үйлчилгээний нөхцөл болон нууцлалын бодлогыг зөвшөөрнө.</p>
          </div>
        )}

        {stage === "otp" && (
          <div className="animate-pop">
            <button onClick={() => { setStage("phone"); setError(""); }} className="mb-5 text-xs font-extrabold text-muted">← Буцах</button>
            <Eyebrow>БАТАЛГААЖУУЛАХ КОД</Eyebrow><h1 className="text-[28px] font-black">Мессежээ шалгана уу</h1><p className="mt-2 text-sm leading-6 text-muted"><b className="text-ink">+976 {phone.slice(0, 2)}•• ••{phone.slice(-2)}</b> дугаарт илгээсэн 4 оронтой кодыг оруулна уу.</p>
            <input value={otp} onChange={(event) => { setOtp(event.target.value.replace(/\D/g, "").slice(0, 4)); setError(""); }} onKeyDown={(event) => event.key === "Enter" && verify()} inputMode="numeric" autoFocus aria-label="4 оронтой баталгаажуулах код" className={`my-5 w-full rounded-2xl border-2 bg-[#f7f9ff] px-5 py-4 text-center text-3xl font-black tracking-[.7em] outline-none ${error ? "border-[#ef7770]" : "border-[#dfe5ef] focus:border-brand"}`} />
            <p className="text-center text-xs text-muted">Prototype код: <b className="text-ink">1234</b></p>
            {error && <p className="mt-2 text-center text-xs font-bold text-[#d85f58]">{error}</p>}
            <button onClick={verify} className={`${primary} mt-5 w-full`}>Нэвтрэх →</button>
          </div>
        )}
      </section>
      <p className="absolute bottom-5 text-xs text-muted">Тусламж хэрэгтэй юу? <b className="text-ink">7700-OKAY</b></p>
    </main>
  );
}

function PageTitle({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return <div className="mb-7"><Eyebrow>{eyebrow}</Eyebrow><h1 className="text-3xl font-black tracking-[-.03em] text-[#334568] sm:text-4xl">{title}</h1>{description && <p className="mt-2 text-sm text-muted">{description}</p>}</div>;
}

function PackArt({ pack, compact = false }: { pack: Pack; compact?: boolean }) {
  const backgrounds = { purple: "bg-[#e8e5ff]", green: "bg-[#dff6ed]", orange: "bg-[#fff1bd]" };
  return <div className={`${backgrounds[pack.color]} relative overflow-hidden ${compact ? "h-16 w-20 shrink-0 rounded-2xl" : "h-[126px]"}`}><i className="absolute -right-5 -top-9 h-24 w-24 rounded-full bg-white/50" />{pack.icons.map((icon, index) => <span key={index} className={`absolute z-10 drop-shadow-sm ${compact ? "text-lg" : "text-3xl"} ${index === 0 ? "bottom-4 left-4 -rotate-6" : index === 1 ? "left-[45%] top-4 rotate-6" : "bottom-4 right-4 rotate-12"}`}>{icon}</span>)}</div>;
}

function PackCard({ pack, onStart, onExample }: { pack: Pack; onStart: (pack: Pack) => void; onExample: (pack: Pack) => void }) {
  return (
    <article className={`${card} overflow-hidden transition hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(57,82,120,.15)]`}>
      <div className="relative"><PackArt pack={pack} /><span className="absolute right-3 top-3 rounded-xl bg-white/80 px-2.5 py-1.5 text-[9px] font-black">{pack.grade}-Р АНГИ</span><span className="absolute bottom-3 left-3 rounded-xl bg-[#334568] px-2.5 py-1.5 text-[10px] font-black text-sun">🏆 100% = {money(pack.price / 2)}</span></div>
      <div className="p-5"><p className="text-[9px] font-black tracking-[.12em] text-muted">{pack.topic.toUpperCase()} · {pack.count} БОДЛОГО</p><h3 className="my-2 min-h-12 text-base font-black leading-6">{pack.title}</h3><div className="mb-4 flex items-center justify-between text-[10px] text-muted"><span>Багцын үнэ {money(pack.price)}</span><b className="text-mint">Хүүхдийн хувь: 50%</b></div><button onClick={() => onExample(pack)} className="mb-4 w-full rounded-xl border border-dashed border-[#9da9c1] bg-[#f7f9ff] px-3 py-2 text-[11px] font-extrabold text-[#52617c] hover:border-brand">💡 Жишээгээр сурах</button><div className="flex items-end justify-between"><div><small className="block text-[8px] font-black text-muted">100% ЗӨВ БОЛ АВАХ</small><b className="text-xl">{money(pack.price / 2)}</b></div><button onClick={() => onStart(pack)} className="rounded-xl bg-sun px-3 py-2 text-[11px] font-black shadow-[0_4px_0_#e7bd49]">Бодож эхлэх →</button></div></div>
    </article>
  );
}

function BarChart({ values }: { values: number[] }) {
  return <div className="flex h-52 items-end justify-between gap-2 pt-8">{values.map((value, index) => <div key={index} className="flex h-full flex-1 flex-col items-center justify-end gap-2"><b className="text-[8px] text-[#52617c]">{Math.round(value * .65)} мин</b><i className={`block w-full max-w-9 rounded-t-xl ${index === 6 ? "bg-sun" : "bg-brand"}`} style={{ height: `${value}%` }} /><small className="text-[9px] font-bold text-muted">{["Дав", "Мяг", "Лха", "Пүр", "Баа", "Бям", "Ням"][index]}</small></div>)}</div>;
}

function HomePage({ nickname, onNavigate }: { nickname: string; onNavigate: (page: Page) => void }) {
  return <>
    <section className="relative min-h-[370px] overflow-hidden rounded-[32px] bg-gradient-to-br from-[#6f83e8] via-[#708fe8] to-[#58b7dc] px-7 pb-9 pt-[115px] text-white shadow-[0_18px_40px_rgba(82,103,143,.25)] sm:px-12">
      <div className="absolute left-6 top-6 z-10 flex flex-wrap items-center gap-3 rounded-[20px] border-[3px] border-[#fff5c9] bg-white p-3 text-ink shadow-[0_8px_0_#536bc3]"><span className="grid h-11 w-11 place-items-center rounded-full bg-sun text-2xl font-black">₮</span><div><small className="block text-[8px] font-black text-muted">ӨНӨӨДӨР АВАХ БОЛОМЖТОЙ</small><strong className="text-2xl">5,000₮</strong></div><span className="rounded-xl bg-[#e5f8f0] px-3 py-2 text-[10px] font-black text-[#278764]">1 зөв бодлого = 500₮</span></div>
      <div className="relative z-10 max-w-xl"><p className="text-[10px] font-black tracking-[.13em] text-[#dfe5ff]">ӨГЛӨӨНИЙ МЭНД, {nickname.toUpperCase()}! 👋</p><h1 className="mt-3 text-3xl font-black leading-tight tracking-[-.04em] sm:text-[42px]">Тоглоод, бодоод,<br /><em className="not-italic text-[#fff1a8]">шагналаа цуглуулъя!</em></h1><p className="mt-4 text-sm font-semibold text-white/85">Зөв бодлого бүр чамайг зорилгодоо нэг алхам ойртуулна.</p><button onClick={() => onNavigate("problems")} className="mt-6 rounded-2xl bg-white px-5 py-3.5 text-sm font-black text-[#334568] shadow-[0_6px_0_#dce3ff]">Тоглож эхлэх →</button></div>
      <div className="animate-float absolute bottom-8 right-[8%] hidden h-36 w-36 place-items-center rounded-[44%] border-[6px] border-[#fff2ad] bg-sun text-5xl font-black text-[#4e5d91] shadow-[inset_-16px_-14px_0_#f8ce5d,0_18px_40px_rgba(52,75,152,.35)] md:grid">÷<span className="absolute -left-7 top-5 text-3xl text-white">+</span><i className="absolute -right-4 bottom-2 text-3xl not-italic text-white">×</i></div>
    </section>
    <div className="my-6 grid gap-4 md:grid-cols-3">{[["🔥", "Дараалсан өдөр", "7 өдөр", "Өнөөдрийн streak-ээ хадгалаарай!", "bg-[#fff0e7]"], ["✓", "Энэ 7 хоногт", "42 бодлого", "Өмнөхөөс 12% илүү", "bg-[#eeecff]"], ["₮", "Нийт олсон", "36,500₮", "Чи үнэхээр мундаг!", "bg-[#e5f7ef]"]].map((item) => <article key={item[1]} className={`${card} flex items-center gap-4 p-5`}><span className={`grid h-14 w-14 shrink-0 place-items-center rounded-full text-2xl ${item[4]}`}>{item[0]}</span><div><small className="text-[9px] font-black text-muted">{item[1]}</small><strong className="block text-2xl">{item[2]}</strong><p className="mt-1 text-[10px] font-bold text-muted">{item[3]}</p></div></article>)}</div>
    <section className="my-9"><div className="mb-4 flex items-end justify-between"><div><h2 className="text-2xl font-black">Үргэлжлүүлэн бодох</h2><p className="mt-1 text-xs text-muted">Эхэлсэн багцаа дуусгаад шагналаа аваарай.</p></div><button onClick={() => onNavigate("problems")} className="text-xs font-black text-brand">Бүгдийг харах →</button></div><article className={`${card} flex items-center gap-5 p-5`}><div className="grid h-20 w-20 shrink-0 -rotate-3 place-items-center rounded-[22px] bg-[#e8e5ff] text-xl font-black text-[#6c60d7]">123</div><div className="min-w-0 flex-1"><span className="text-[9px] font-black text-brand">МАТЕМАТИК · 5-Р АНГИ</span><h3 className="mt-1 font-black">Олон оронтой тооны үйлдэл</h3><div className="mt-3 flex items-center gap-3"><div className="h-2 flex-1 overflow-hidden rounded-full bg-[#edf0f6]"><i className="block h-full w-[65%] rounded-full bg-gradient-to-r from-[#ffd65f] to-[#ffb85b]" /></div><b className="text-xs">13/20</b></div></div><button onClick={() => onNavigate("problems")} className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand font-black text-white shadow-[0_5px_0_#5265bd]">→</button></article></section>
    <section><h2 className="text-2xl font-black">Чамд санал болгох</h2><p className="mt-1 text-xs text-muted">Өөрийн түвшинд тохирсон шинэ багцаас сонгоорой.</p><div className="mt-5 grid gap-5 md:grid-cols-3">{packs.slice(0, 3).map((pack) => <PackCard key={pack.id} pack={pack} onStart={() => onNavigate("problems")} onExample={() => onNavigate("problems")} />)}</div></section>
  </>;
}

function ProblemsPage({ onStart, onExample }: { onStart: (pack: Pack) => void; onExample: (pack: Pack) => void }) {
  const [chapter, setChapter] = useState<1 | 2 | 3>(1);
  const visible = packs.filter((pack) => pack.chapter === chapter);
  return <>
    <PageTitle eyebrow="БОДЛОГЫН САН" title="Юугаар ухаанаа сориулах вэ?" description="Бүлгээ сонгоод бодож эхлээрэй." />
    <aside className="mb-5 flex gap-3 rounded-[20px] border border-[#ccecdf] bg-[#e8f8f0] p-4"><span className="text-3xl">💰</span><div><strong className="text-sm text-[#287d61]">Хүүхдийн урамшуулал хэрхэн бодогдох вэ?</strong><p className="mt-1 text-[11px] leading-5 text-[#647c73]">Багцын үнийн 50% нь хүүхдийн дээд урамшуулал. 25,000₮ багцыг 100% зөв бодвол 12,500₮ авна.</p></div></aside>
    <div className="mb-6 flex flex-wrap gap-1 rounded-2xl bg-white p-1.5 shadow-sm">{([1, 2, 3] as const).map((value) => <button key={value} onClick={() => setChapter(value)} className={`rounded-xl px-4 py-2 text-xs font-extrabold ${chapter === value ? "bg-brand text-white" : "text-muted hover:bg-[#f4f6ff]"}`}>{value} {value === 1 ? "дүгээр" : "дугаар"} бүлэг</button>)}</div>
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{visible.map((pack) => <PackCard key={pack.id} pack={pack} onStart={onStart} onExample={onExample} />)}</div>
  </>;
}

function SolverPage({ pack, questions, answers, setAnswers, checked, onCheck, onClear, onBack }: { pack: Pack; questions: Question[]; answers: string[]; setAnswers: (answers: string[]) => void; checked: boolean; onCheck: () => void; onClear: () => void; onBack: () => void }) {
  const filled = answers.filter(Boolean).length;
  const correct = checked ? answers.filter((answer, index) => Number(answer) === questions[index].answer).length : 0;
  return <>
    <button onClick={onBack} className="mb-5 text-xs font-black text-muted hover:text-ink">← Бодлогын сан руу буцах</button>
    <div className="grid gap-5 xl:grid-cols-[1fr_250px]">
      <section className={`${card} overflow-hidden p-5 sm:p-7`}>
        <div className="flex flex-wrap items-start justify-between gap-4"><div><span className="text-[9px] font-black tracking-[.1em] text-brand">{pack.topic.toUpperCase()} · {pack.grade}-Р АНГИ</span><h1 className="mt-1 text-2xl font-black">{pack.title}</h1></div><div className="rounded-2xl bg-[#e8f8f0] px-4 py-3 text-right"><small className="block text-[8px] font-black text-muted">100% ЗӨВ БОЛ АВАХ</small><b className="text-xl text-[#278764]">{money(pack.price / 2)}</b></div></div>
        <div className="my-6"><div className="mb-2 flex justify-between text-[10px] font-extrabold text-muted"><span>Нийт {questions.length} бодлого</span><b>{filled} / {questions.length} бөглөсөн</b></div><div className="h-2 overflow-hidden rounded-full bg-[#edf0f6]"><i className="block h-full rounded-full bg-gradient-to-r from-sun to-[#ffb85b] transition-all" style={{ width: `${filled / questions.length * 100}%` }} /></div></div>
        <div className="grid gap-3">{questions.map((question, index) => { const isCorrect = Number(answers[index]) === question.answer; return <article key={index} className={`grid items-center gap-3 rounded-[18px] border-2 p-3 sm:grid-cols-[38px_80px_1fr_160px] ${checked ? isCorrect ? "border-[#a7dfc7] bg-[#f1fbf6]" : "border-[#f1b8b4] bg-[#fff7f6]" : "border-[#edf0f5] bg-white"}`}><span className="grid h-9 w-9 place-items-center rounded-full bg-[#eef1ff] text-xs font-black text-brand">{String(index + 1).padStart(2, "0")}</span><PackArt pack={pack} compact /><h3 className="text-sm font-extrabold leading-5">{question.text}</h3><label><input type="number" value={answers[index]} disabled={checked} onChange={(event) => { const next = [...answers]; next[index] = event.target.value; setAnswers(next); }} placeholder="Хариу" className="w-full rounded-xl border-2 border-[#e1e6ef] bg-white px-3 py-2.5 text-sm font-black outline-none focus:border-brand disabled:bg-white" /><small className={`mt-1 block text-[9px] font-bold ${checked ? isCorrect ? "text-[#278764]" : "text-[#d35f57]" : "text-muted"}`}>{checked ? isCorrect ? "Зөв байна!" : `Зөв хариу: ${question.answer}` : "Хариугаа бичээрэй"}</small></label></article>; })}</div>
        <div className="mt-6 flex flex-wrap justify-end gap-3"><button onClick={onClear} className={outline}>Хариуг цэвэрлэх</button><button onClick={onCheck} className={primary}>{checked ? "Үр дүнгээ харах →" : "Бүх хариуг шалгах →"}</button></div>
      </section>
      <aside className={`${card} h-fit bg-[#fff4c9] p-6 text-center xl:sticky xl:top-24`}><div className="animate-float mx-auto grid h-20 w-20 place-items-center rounded-[45%] bg-sun text-3xl font-black shadow-[0_6px_0_#e6b93d]">O<span className="absolute ml-9 mt-7 text-xs">★</span></div><h3 className="mt-5 text-lg font-black">Чи чадна аа!</h3><p className="mt-2 text-xs leading-5 text-muted">Тайван бодоод, үйлдлийн дарааллаа сайн хараарай.</p><div className="mt-5 grid grid-cols-2 gap-2"><span className="rounded-xl bg-white/70 p-3"><small className="block text-[9px] text-muted">Зөв</small><b className="text-xl text-mint">{correct}</b></span><span className="rounded-xl bg-white/70 p-3"><small className="block text-[9px] text-muted">Алдаа</small><b className="text-xl text-[#ef7770]">{checked ? questions.length - correct : 0}</b></span></div></aside>
    </div>
  </>;
}

function ProgressPage({ solved, correct }: { solved: number; correct: number }) {
  const accuracy = Math.round(correct / solved * 100);
  return <><PageTitle eyebrow="МИНИЙ АХИЦ" title="Өдөр бүр өсөж байна" description="Сүүлийн 7 хоногийн суралцсан хугацаа, амжилт." /><div className="mb-5 grid gap-4 md:grid-cols-3">{[["⏱️", "НИЙТ СУРАЛЦСАН", "3 цаг 25 минут", "+18% өссөн"], ["🧩", "НИЙТ БОДСОН", `${solved} бодлого`, "Энэ 7 хоногт 42"], ["🎯", "ЗӨВ ХАРИУЛТ", `${accuracy}%`, "Зорилго хүртэл 4%"]].map((item) => <article key={item[1]} className={`${card} flex items-center gap-3 p-5`}><span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#eef1ff] text-xl">{item[0]}</span><div><small className="text-[9px] font-black text-muted">{item[1]}</small><strong className="block text-xl">{item[2]}</strong><p className="text-[9px] font-bold text-mint">{item[3]}</p></div></article>)}</div><div className="grid gap-5 lg:grid-cols-[1.7fr_1fr]"><article className={`${card} p-6`}><h3 className="font-black">Өдөр бүр суралцсан хугацаа</h3><p className="mt-1 text-[10px] text-muted">Сүүлийн 7 хоногийн минут</p><BarChart values={[30, 48, 35, 66, 55, 82, 70]} /></article><article className={`${card} grid place-items-center p-6 text-center`}><div><h3 className="font-black">Зөв хариултын хувь</h3><div className="mx-auto my-5 grid h-40 w-40 place-items-center rounded-full" style={{ background: `conic-gradient(#43b98a 0 ${accuracy}%, #e8e8ee ${accuracy}%)` }}><span className="grid h-28 w-28 place-items-center rounded-full bg-white"><b className="text-3xl">{accuracy}%</b></span></div><p className="text-xs font-bold text-muted">Зөв {correct} · Алдаа {solved - correct}</p></div></article></div></>;
}

function ResultsPage({ result, onFix, onClaim }: { result: Result; onFix: () => void; onClaim: () => void }) {
  const percent = Math.round(result.correct / result.total * 100), perfect = percent === 100;
  return <section className={`${card} animate-pop mx-auto max-w-3xl p-7 text-center sm:p-11`}><div className="text-6xl">{perfect ? "🏆" : percent >= 80 ? "🎉" : "🌱"}</div><div className="mt-4"><Eyebrow>БАГЦЫН ҮР ДҮН</Eyebrow></div><h1 className="text-3xl font-black">{perfect ? "Бүх бодлого зөв боллоо!" : percent >= 80 ? "Үнэхээр мундаг байлаа!" : "Сайн оролдлого байлаа!"}</h1><p className="mt-2 text-sm text-muted">{perfect ? "Чи дээд урамшууллаа авахад бэлэн боллоо." : `${result.total - result.correct} алдаагаа засаад урамшууллаа нэмээрэй.`}</p><div className="my-7 grid gap-3 sm:grid-cols-3">{[["ЗӨВ ХАРИУЛТ", `${result.correct} / ${result.total}`], ["ГҮЙЦЭТГЭЛ", `${percent}%`], ["ОДОО АВАХ МӨНГӨ", money(result.earned)]].map((item, index) => <div key={item[0]} className={`rounded-[18px] p-4 ${index === 2 ? "bg-[#e8f8f0]" : "bg-[#f4f7ff]"}`}><small className="block text-[9px] font-black text-muted">{item[0]}</small><strong className={`text-2xl ${index === 2 ? "text-[#278764]" : ""}`}>{item[1]}</strong></div>)}</div><div className="h-3 overflow-hidden rounded-full bg-[#edf0f6]"><i className="block h-full rounded-full bg-gradient-to-r from-sun to-mint" style={{ width: `${percent}%` }} /></div><p className="mt-3 text-xs font-extrabold text-[#278764]">{perfect ? "Дээд урамшуулал нээгдлээ! 🎊" : `Бүгдийг зөв болговол ${money(result.max)} авна`}</p><div className="mt-6 grid gap-3 sm:grid-cols-2">{!perfect && <button onClick={onFix} className={outline}>🩹 Алдаагаа засах</button>}<button onClick={onClaim} disabled={result.claimed} className={`${primary} ${perfect ? "sm:col-span-2" : ""}`}>{result.claimed ? "Урамшуулал авсан ✓" : `💰 ${money(result.earned)} авах`}</button></div></section>;
}

function MistakesPage({ mistakes, onRetry }: { mistakes: Mistake[]; onRetry: () => void }) {
  return <><PageTitle eyebrow="АЛДААГАА ЗАСАХ" title="Алдаа бол сурах шинэ боломж 🌱" description="Өмнө алдсан бодлогуудаа дахин бодож, гүйцэтгэлээ дээшлүүлээрэй." /><div className="mb-5 flex flex-wrap items-center gap-4 rounded-[22px] bg-[#fff4c9] p-5"><span className="text-3xl">🩹</span><div className="flex-1"><small className="text-[9px] font-black text-muted">ЗАСАХ БОДЛОГО</small><strong className="block text-xl">{mistakes.length} бодлого</strong></div><button onClick={onRetry} disabled={!mistakes.length} className={primary}>Дахин бодох →</button></div>{mistakes.length ? <div className="grid gap-3">{mistakes.map((mistake, index) => <article key={`${mistake.text}-${index}`} className={`${card} grid items-center gap-4 border border-[#f1d7d3] p-4 sm:grid-cols-[36px_80px_1fr]`}><span className="grid h-9 w-9 place-items-center rounded-full bg-[#ffe4e0] text-xs font-black text-[#c85e56]">{index + 1}</span><PackArt pack={mistake.pack} compact /><div><small className="text-[9px] font-black text-muted">{mistake.pack.topic.toUpperCase()} · {mistake.pack.grade}-Р АНГИ</small><h3 className="my-1 text-sm font-black">{mistake.text}</h3><p className="text-[10px] text-muted">Таны хариу: <b className="text-[#d35f57]">{mistake.given}</b> · Зөв: <b className="text-[#278764]">{mistake.answer}</b></p></div></article>)}</div> : <div className={`${card} border-2 border-dashed border-[#ccd4e3] p-12 text-center`}><span className="text-5xl">🌟</span><h3 className="mt-3 font-black">Засах алдаа одоогоор алга</h3><p className="mt-1 text-xs text-muted">Бодлого бодсоны дараа алдсан бодлогууд энд хадгалагдана.</p></div>}</>;
}

function RewardsPage({ balance, onWithdraw }: { balance: number; onWithdraw: () => void }) {
  const transactions = [["Олон оронтой тооны үйлдэл", "Өнөөдөр, 18:24", 2000], ["Урамшуулал авсан", "8-р сарын 22", -10000], ["Сэтгэх чадварын сорил", "8-р сарын 21", 1500], ["7 өдрийн дарааллын бонус", "8-р сарын 20", 500]] as const;
  return <><section className="rounded-[32px] bg-gradient-to-br from-brand to-[#58b7dc] p-8 text-center text-white shadow-[0_18px_40px_rgba(82,103,143,.25)]"><span className="text-4xl text-sun">★</span><p className="mt-2 text-[10px] font-black tracking-[.14em]">МИНИЙ УРАМШУУЛАЛ</p><h1 className="my-2 text-5xl font-black">{money(balance)}</h1><small className="text-white/75">Авах боломжтой үлдэгдэл</small><br /><button onClick={onWithdraw} className="mt-6 rounded-2xl bg-white px-5 py-3 text-sm font-black text-[#334568] shadow-[0_6px_0_#dce3ff]">Урамшуулал авах</button></section><section className="mt-8"><h2 className="text-2xl font-black">Орлого, зарлага</h2><p className="mt-1 text-xs text-muted">Таны сүүлийн гүйлгээнүүд</p><div className={`${card} mt-4 divide-y divide-[#edf0f5] overflow-hidden`}>{transactions.map((transaction) => <div key={transaction[0]} className="flex items-center gap-4 p-4"><span className={`grid h-10 w-10 place-items-center rounded-full font-black ${transaction[2] > 0 ? "bg-[#e8f8f0] text-mint" : "bg-[#ffe8e5] text-[#d35f57]"}`}>{transaction[2] > 0 ? "+" : "−"}</span><div className="flex-1"><b className="block text-sm">{transaction[0]}</b><small className="text-[10px] text-muted">{transaction[1]}</small></div><b className={transaction[2] > 0 ? "text-mint" : "text-[#d35f57]"}>{transaction[2] > 0 ? "+" : ""}{money(transaction[2])}</b></div>)}</div></section></>;
}

function SettingsPage({ nickname, image, dark, onDark, onEdit }: { nickname: string; image: string; dark: boolean; onDark: (value: boolean) => void; onEdit: () => void }) {
  return <><PageTitle eyebrow="ТОХИРГОО" title="Миний бүртгэл" /><div className="grid gap-5 lg:grid-cols-2"><article className={`${card} flex flex-wrap items-center gap-4 p-6`}><Avatar nickname={nickname} image={image} large /><div className="flex-1"><h3 className="text-lg font-black">{nickname}</h3><p className="text-xs text-muted">5-р анги · Хүүхдийн эрх</p></div><button onClick={onEdit} className={outline}>Зураг, nickname засах</button></article><article className={`${card} p-6`}><h3 className="mb-4 font-black">Аппын тохиргоо</h3>{[["Дууны эффект", "Зөв хариултын дуу"], ["Өдөр тутмын сануулга", "19:00 цагт"]].map((item) => <label key={item[0]} className="flex items-center justify-between border-b border-[#edf0f5] py-3"><span className="text-sm font-extrabold">{item[0]}<small className="block text-[10px] font-normal text-muted">{item[1]}</small></span><input type="checkbox" defaultChecked className="h-5 w-5 accent-brand" /></label>)}<label className="flex items-center justify-between py-3"><span className="text-sm font-extrabold">Харанхуй горим<small className="block text-[10px] font-normal text-muted">Дэлгэцийн өнгө</small></span><input type="checkbox" checked={dark} onChange={(event) => onDark(event.target.checked)} className="h-5 w-5 accent-brand" /></label></article></div></>;
}

function ParentView() {
  const [child, setChild] = useState<keyof typeof childData>("Тэмүүлэн");
  const data = childData[child];
  return <><div className="mb-6 flex flex-wrap items-end justify-between gap-4"><PageTitle eyebrow="ЭЦЭГ ЭХИЙН ХЯНАЛТ" title="Сайн байна уу, Бат аа 👋" description="Хүүхдийнхээ суралцах явцыг нэг дороос хараарай." /><button className={outline}>＋ Хүүхэд нэмэх</button></div><div className="mb-6 flex flex-wrap gap-2">{(Object.keys(childData) as (keyof typeof childData)[]).map((name) => <button key={name} onClick={() => setChild(name)} className={`flex items-center gap-3 rounded-2xl border-2 p-2.5 pr-5 ${child === name ? "border-brand bg-[#eef1ff]" : "border-transparent bg-white"}`}><Avatar nickname={name} image="" /><span className="text-left"><b className="block text-sm">{name}</b><small className="text-[9px] text-muted">5-р анги</small></span></button>)}</div><div className="mb-5 grid gap-4 md:grid-cols-3">{[["◷", "Өнөөдөр суралцсан", data.time, "Зорилго: 45 минут"], ["✓", "Энэ 7 хоногт", data.weekly, "↑ 12% өссөн"], ["₮", "Олсон урамшуулал", data.reward, "Төлбөрийн 50%"]].map((item) => <article key={item[1]} className={`${card} flex gap-4 p-5`}><span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#eef1ff] text-xl font-black text-brand">{item[0]}</span><div><small className="text-[9px] font-black text-muted">{item[1]}</small><strong className="block text-xl">{item[2]}</strong><p className="mt-1 text-[9px] text-mint">{item[3]}</p></div></article>)}</div><div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]"><article className={`${card} p-6`}><h3 className="font-black">7 хоногийн суралцсан хугацаа</h3><p className="text-[10px] text-muted">Өдөрт зарцуулсан минут</p><BarChart values={data.bars} /></article><article className={`${card} p-6`}><h3 className="font-black">Сэдвийн ахиц</h3><p className="mb-6 text-[10px] text-muted">Нийт гүйцэтгэл</p><div className="grid gap-5">{data.skills.map(([name, value]) => <div key={name}><div className="mb-2 flex justify-between text-xs font-extrabold"><span>{name}</span><b>{value}%</b></div><div className="h-2 overflow-hidden rounded-full bg-[#edf0f6]"><i className="block h-full rounded-full bg-gradient-to-r from-sun to-mint" style={{ width: `${value}%` }} /></div></div>)}</div></article></div></>;
}

function Avatar({ nickname, image, large = false }: { nickname: string; image: string; large?: boolean }) {
  return <span className={`${large ? "h-[72px] w-[72px] text-2xl" : "h-10 w-10 text-sm"} grid shrink-0 place-items-center overflow-hidden rounded-full bg-sun font-black text-ink bg-cover bg-center`} style={image ? { backgroundImage: `url(${image})` } : undefined}>{image ? "" : nickname.charAt(0).toUpperCase()}</span>;
}

function Modal({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  return <div onMouseDown={(event) => event.target === event.currentTarget && onClose()} className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-[#172b4d]/55 p-4 backdrop-blur-sm"><section className={`${card} animate-pop relative max-h-[90vh] w-full max-w-xl overflow-y-auto p-6 sm:p-8`}><button onClick={onClose} aria-label="Хаах" className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-[#f0f3f8] text-xl font-bold">×</button>{children}</section></div>;
}

function Sidebar({ page, nickname, image, mistakeCount, open, onNavigate }: { page: Page; nickname: string; image: string; mistakeCount: number; open: boolean; onNavigate: (page: Page) => void }) {
  const items: [Page, string, string][] = [["home", "🏠", "Нүүр"], ["problems", "🧩", "Бодлого"], ["progress", "🚀", "Миний ахиц"], ["mistakes", "🩹", "Алдаагаа засах"], ["rewards", "🎁", "Урамшуулал"]];
  return <aside className={`fixed inset-y-0 left-0 z-40 flex w-[250px] flex-col bg-white p-5 shadow-[8px_0_32px_rgba(57,82,120,.08)] transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}><button onClick={() => onNavigate("home")} className="text-left"><Logo compact /></button><nav className="mt-8 grid gap-2">{items.map(([id, icon, label]) => <button key={id} onClick={() => onNavigate(id)} className={`flex items-center gap-3 rounded-2xl px-3.5 py-3 text-left text-sm font-extrabold transition ${page === id ? "bg-[#fff4c9] shadow-sm" : "text-[#65728b] hover:bg-[#f4f7ff]"}`}><span className="w-7 text-xl">{icon}</span>{label}{id === "mistakes" && mistakeCount > 0 && <i className="ml-auto grid h-5 min-w-5 place-items-center rounded-full bg-[#ff8178] px-1 text-[9px] not-italic text-white">{mistakeCount}</i>}</button>)}</nav><div className="mt-auto"><button onClick={() => onNavigate("settings")} className={`mb-3 flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-extrabold ${page === "settings" ? "bg-[#fff4c9]" : "text-[#65728b]"}`}><span className="w-7 text-xl">⚙️</span>Тохиргоо</button><button onClick={() => onNavigate("settings")} className="flex w-full items-center gap-3 rounded-[18px] border border-[#e3e9f5] bg-[#f1f5ff] p-3 text-left"><Avatar nickname={nickname} image={image} /><span className="min-w-0 flex-1"><b className="block truncate text-xs">{nickname}</b><small className="text-[9px] text-muted">5-р анги</small></span><span>›</span></button></div></aside>;
}

export default function OkayApp() {
  const [authenticated, setAuthenticated] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [role, setRole] = useState<"child" | "parent">("child");
  const [page, setPage] = useState<Page>("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [balance, setBalance] = useState(18500);
  const [nickname, setNickname] = useState("Тэмүүлэн");
  const [profileImage, setProfileImage] = useState("");
  const [activePack, setActivePack] = useState<Pack | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [mistakes, setMistakes] = useState<Mistake[]>([]);
  const [result, setResult] = useState<Result | null>(null);
  const [stats, setStats] = useState({ solved: 137, correct: 118 });
  const [modal, setModal] = useState<ReactNode | null>(null);
  const [toast, setToast] = useState("");
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setAuthenticated(sessionStorage.getItem("okayAuthenticated") === "true");
    try {
      const profile = JSON.parse(localStorage.getItem("okayProfile") || "{}");
      if (profile.nickname) setNickname(profile.nickname);
      if (profile.image) setProfileImage(profile.image);
    } catch { /* invalid local prototype data is ignored */ }
    setHydrated(true);
  }, []);

  const notify = (message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2400);
  };

  const navigate = (next: Page) => {
    setPage(next); setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openPack = (pack: Pack, customQuestions?: Question[]) => {
    const nextQuestions = customQuestions || buildQuestionBank(pack);
    setActivePack(pack); setQuestions(nextQuestions); setAnswers(Array(nextQuestions.length).fill("")); setChecked(false); navigate("solver");
  };

  const showExample = (pack: Pack) => {
    const example = workedExamples[pack.id] || workedExamples[1];
    setModal(<div><PackArt pack={pack} compact /><div className="mt-5"><Eyebrow>{pack.grade}-Р АНГИ · {pack.topic.toUpperCase()}</Eyebrow></div><h2 className="text-2xl font-black">Жишээгээр хамтдаа бодъё</h2><div className="my-5 rounded-[18px] border border-[#dfe4ff] bg-[#eef1ff] p-4"><span className="text-[9px] font-black tracking-[.1em] text-brand">ЖИШЭЭ БОДЛОГО</span><strong className="mt-2 block">{example.question}</strong></div><h3 className="text-sm font-black">Хэрхэн бодох вэ?</h3><div className="my-3 grid gap-3">{example.steps.map((step, index) => <div key={step} className="flex gap-3"><b className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-sun text-xs">{index + 1}</b><p className="text-sm leading-6 text-muted">{step}</p></div>)}</div><div className="flex items-center justify-between rounded-2xl border border-[#c8eedf] bg-[#e8f8f0] p-4"><span className="text-[10px] font-black text-[#278764]">✓ ХАРИУ</span><strong className="text-xl text-[#278764]">{example.answer}</strong></div><button onClick={() => { setModal(null); openPack(pack); }} className={`${primary} mt-5 w-full`}>Одоо өөрөө бодох →</button></div>);
  };

  const checkAnswers = () => {
    if (!activePack) return;
    if (checked) { navigate("results"); return; }
    const emptyIndex = answers.findIndex((answer) => answer === "");
    if (emptyIndex >= 0) { notify(`${emptyIndex + 1}-р бодлогын хариуг бөглөөрэй`); return; }
    const correct = answers.filter((answer, index) => Number(answer) === questions[index].answer).length;
    const newMistakes = questions.flatMap((question, index) => Number(answers[index]) === question.answer ? [] : [{ ...question, given: answers[index], pack: activePack }]);
    const max = activePack.price / 2;
    const earned = Math.round(max * correct / questions.length);
    setChecked(true);
    setMistakes((current) => [...current.filter((item) => item.pack.id !== activePack.id), ...newMistakes]);
    setStats((current) => ({ solved: current.solved + questions.length, correct: current.correct + correct }));
    setResult({ pack: activePack, correct, total: questions.length, earned, max, claimed: false });
    setTimeout(() => navigate("results"), 350);
  };

  const retryMistakes = () => {
    if (!mistakes.length) return;
    const pack = mistakes[0].pack;
    const related = mistakes.filter((mistake) => mistake.pack.id === pack.id).map(({ text, answer }) => ({ text, answer }));
    setMistakes((current) => current.filter((mistake) => mistake.pack.id !== pack.id));
    openPack(pack, related);
  };

  const claimReward = () => {
    if (!result || result.claimed) return;
    setBalance((value) => value + result.earned);
    setResult({ ...result, claimed: true });
    notify(`${money(result.earned)} үлдэгдэлд нэмэгдлээ`);
    navigate("rewards");
  };

  const editProfile = () => {
    let pendingNickname = nickname;
    let pendingImage = profileImage;
    const ProfileEditor = () => {
      const [name, setName] = useState(pendingNickname);
      const [image, setImage] = useState(pendingImage);
      const chooseImage = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) { notify("2MB-аас бага зураг сонгоорой"); return; }
        const reader = new FileReader();
        reader.onload = () => setImage(String(reader.result || ""));
        reader.readAsDataURL(file);
      };
      const save = () => {
        if (name.trim().length < 2) { notify("Nickname 2-оос дээш үсэгтэй байна"); return; }
        pendingNickname = name.trim(); pendingImage = image;
        setNickname(pendingNickname); setProfileImage(pendingImage);
        localStorage.setItem("okayProfile", JSON.stringify({ nickname: pendingNickname, image: pendingImage }));
        setModal(null); notify("Profile шинэчлэгдлээ ✨");
      };
      return <div><h2 className="text-2xl font-black">Миний profile ✨</h2><p className="mt-1 text-sm text-muted">Өөрийн дуртай зураг болон nickname-аа сонгоорой.</p><label className="my-5 flex cursor-pointer items-center gap-4 rounded-[18px] bg-[#f1f5ff] p-4"><Avatar nickname={name || "O"} image={image} large /><b className="text-sm text-brand">Зураг сонгох</b><input type="file" accept="image/*" onChange={chooseImage} className="hidden" /></label><label className="grid gap-2 text-xs font-black">Nickname<input value={name} onChange={(event) => setName(event.target.value.slice(0, 18))} className="rounded-[14px] border-2 border-[#e3e8f1] px-4 py-3 text-base outline-none focus:border-brand" /></label><button onClick={save} className={`${primary} mt-5 w-full`}>Хадгалах ✓</button></div>;
    };
    setModal(<ProfileEditor />);
  };

  const withdraw = () => setModal(<div className="text-center"><span className="text-[10px] font-black tracking-[.14em] text-brand">УРАМШУУЛАЛ АВАХ</span><h2 className="my-3 text-4xl font-black">{money(balance)}</h2><p className="text-sm leading-6 text-muted">Эцэг эхийн баталгаажуулсан данс руу шилжүүлэх хүсэлт илгээх үү?</p><button onClick={() => { setModal(null); notify("Хүсэлт амжилттай илгээгдлээ"); }} className={`${primary} mt-6 w-full`}>Хүсэлт илгээх</button></div>);

  const pageContent = (() => {
    if (role === "parent") return <ParentView />;
    if (page === "home") return <HomePage nickname={nickname} onNavigate={navigate} />;
    if (page === "problems") return <ProblemsPage onStart={openPack} onExample={showExample} />;
    if (page === "solver" && activePack) return <SolverPage pack={activePack} questions={questions} answers={answers} setAnswers={setAnswers} checked={checked} onCheck={checkAnswers} onClear={() => { setAnswers(Array(questions.length).fill("")); setChecked(false); }} onBack={() => navigate("problems")} />;
    if (page === "progress") return <ProgressPage solved={stats.solved} correct={stats.correct} />;
    if (page === "results" && result) return <ResultsPage result={result} onFix={retryMistakes} onClaim={claimReward} />;
    if (page === "mistakes") return <MistakesPage mistakes={mistakes} onRetry={retryMistakes} />;
    if (page === "rewards") return <RewardsPage balance={balance} onWithdraw={withdraw} />;
    return <SettingsPage nickname={nickname} image={profileImage} dark={dark} onDark={setDark} onEdit={editProfile} />;
  })();

  if (!hydrated) return <div className="grid min-h-screen place-items-center"><Logo /></div>;
  if (!authenticated) return <AuthFlow onDone={() => setAuthenticated(true)} />;

  return <div className={dark ? "min-h-screen bg-[#172033] text-[#edf2ff]" : "min-h-screen"}>
    {role === "child" && <Sidebar page={page} nickname={nickname} image={profileImage} mistakeCount={mistakes.length} open={menuOpen} onNavigate={navigate} />}
    {menuOpen && role === "child" && <button aria-label="Цэс хаах" onClick={() => setMenuOpen(false)} className="fixed inset-0 z-30 bg-[#172b4d]/35 lg:hidden" />}
    <main className={role === "child" ? "min-h-screen lg:ml-[250px]" : "min-h-screen"}>
      <header className={`sticky top-0 z-20 flex h-[74px] items-center justify-between border-b border-white/70 px-4 backdrop-blur-xl sm:px-7 ${dark ? "bg-[#172033]/90" : "bg-white/85"}`}>
        <button onClick={() => setMenuOpen(true)} className={`grid h-10 w-10 place-items-center rounded-xl bg-white shadow-sm lg:hidden ${role === "parent" ? "invisible" : ""}`} aria-label="Цэс нээх">☰</button>
        <div className={`flex rounded-2xl p-1 ${dark ? "bg-white/10" : "bg-[#eef3fb]"}`}><button onClick={() => setRole("child")} className={`rounded-xl px-4 py-2 text-xs font-black ${role === "child" ? "bg-white text-ink shadow-sm" : "text-muted"}`}>Хүүхэд</button><button onClick={() => setRole("parent")} className={`rounded-xl px-4 py-2 text-xs font-black ${role === "parent" ? "bg-white text-ink shadow-sm" : "text-muted"}`}>Эцэг эх</button></div>
        <div className="flex items-center gap-2"><button className="relative grid h-10 w-10 place-items-center rounded-full bg-white text-ink shadow-sm" aria-label="Мэдэгдэл">♢<i className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[#ff8178]" /></button><div className="hidden items-center gap-2 rounded-2xl bg-[#effaf5] px-3 py-2 text-ink sm:flex"><span className="grid h-8 w-8 place-items-center rounded-full bg-white font-black text-mint">₮</span><div><small className="block text-[8px] font-bold text-muted">Миний үлдэгдэл</small><b className="text-sm text-[#278764]">{money(balance)}</b></div></div></div>
      </header>
      <div className={`mx-auto max-w-[1240px] p-4 sm:p-7 lg:p-9 ${dark ? "[&_article]:bg-[#222d43] [&_section.bg-white]:bg-[#222d43]" : ""}`}>{pageContent}</div>
    </main>
    {modal && <Modal onClose={() => setModal(null)}>{modal}</Modal>}
    {toast && <div className="animate-toast fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-2xl bg-[#27324a] px-5 py-3 text-sm font-extrabold text-white shadow-xl">{toast}</div>}
  </div>;
}
