'use client';

import { useState } from 'react';
import Link from 'next/link';

type Slug =
  | 'the-heights' | 'hillcrest' | 'soma' | 'downtown' | 'chenal-valley'
  | 'west-little-rock' | 'midtown' | 'university-district' | 'conway' | 'benton'
  | 'bryant' | 'maumelle' | 'north-little-rock' | 'sherwood' | 'jacksonville'
  | 'cabot' | 'alexander' | 'little-rock-south' | 'east-little-rock' | 'argenta';

type Score = Partial<Record<Slug, number>>;

interface Question {
  id: string;
  text: string;
  options: {
    label: string;
    scores: Score;
  }[];
}

const QUESTIONS: Question[] = [
  {
    id: 'vibe',
    text: 'Where do you feel most at home?',
    options: [
      {
        label: 'Urban and walkable — restaurants within walking distance',
        scores: { 'the-heights': 10, hillcrest: 8, soma: 7, downtown: 8, argenta: 5, 'north-little-rock': 4 },
      },
      {
        label: 'Artsy and creative — galleries, live music, energy',
        scores: { soma: 10, argenta: 9, hillcrest: 7, 'the-heights': 5, downtown: 6 },
      },
      {
        label: 'Suburban comfort — newer homes, space, HOA community',
        scores: { 'chenal-valley': 10, 'west-little-rock': 8, maumelle: 7, conway: 6, benton: 6, bryant: 8, sherwood: 5 },
      },
      {
        label: 'Small town feel — quiet streets, tight-knit community',
        scores: { cabot: 10, alexander: 8, benton: 8, conway: 7, maumelle: 7, sherwood: 7 },
      },
    ],
  },
  {
    id: 'budget',
    text: "What's your home budget?",
    options: [
      {
        label: 'Under $200K',
        scores: { 'east-little-rock': 10, argenta: 7, jacksonville: 8, 'little-rock-south': 8, 'north-little-rock': 6, soma: 3 },
      },
      {
        label: '$200K – $350K',
        scores: { soma: 10, argenta: 8, hillcrest: 6, midtown: 8, benton: 8, conway: 8, sherwood: 7, 'west-little-rock': 5 },
      },
      {
        label: '$350K – $550K',
        scores: { 'the-heights': 7, hillcrest: 7, 'chenal-valley': 6, 'west-little-rock': 8, maumelle: 8, conway: 7, benton: 6, soma: 4 },
      },
      {
        label: 'Over $550K',
        scores: { 'chenal-valley': 10, 'the-heights': 8, 'west-little-rock': 7 },
      },
    ],
  },
  {
    id: 'priority',
    text: 'What matters most to you day-to-day?',
    options: [
      {
        label: 'Top-rated public schools',
        scores: { bryant: 10, conway: 9, 'chenal-valley': 8, maumelle: 6, benton: 7, cabot: 7 },
      },
      {
        label: 'Great restaurants and nightlife',
        scores: { 'the-heights': 10, soma: 9, hillcrest: 8, downtown: 8, argenta: 7, 'north-little-rock': 6 },
      },
      {
        label: 'Outdoor trails, parks, and nature access',
        scores: { maumelle: 10, conway: 9, 'chenal-valley': 7, cabot: 7, 'the-heights': 6, hillcrest: 5 },
      },
      {
        label: 'Arts, culture, and creative community',
        scores: { soma: 10, argenta: 9, hillcrest: 7, 'the-heights': 7, downtown: 8 },
      },
      {
        label: 'Short commute to downtown Little Rock',
        scores: { downtown: 10, soma: 9, hillcrest: 9, 'the-heights': 8, midtown: 8, 'north-little-rock': 7 },
      },
    ],
  },
  {
    id: 'family',
    text: "What's your family situation?",
    options: [
      {
        label: 'Single or couple, no kids',
        scores: { downtown: 8, soma: 9, 'the-heights': 8, hillcrest: 7, argenta: 7 },
      },
      {
        label: 'Babies or toddlers — schools matter in a few years',
        scores: { bryant: 9, 'chenal-valley': 8, conway: 8, maumelle: 7, benton: 7, 'the-heights': 6 },
      },
      {
        label: 'School-age kids — schools matter right now',
        scores: { bryant: 10, 'chenal-valley': 9, conway: 9, benton: 8, maumelle: 7 },
      },
      {
        label: "Empty nester — kids are grown",
        scores: { 'the-heights': 8, hillcrest: 8, 'chenal-valley': 7, maumelle: 7, conway: 6 },
      },
    ],
  },
  {
    id: 'saturday',
    text: 'Describe your perfect Saturday morning.',
    options: [
      {
        label: 'Hiking or biking trails, back home by noon',
        scores: { maumelle: 10, conway: 9, 'chenal-valley': 7, cabot: 7, 'the-heights': 5 },
      },
      {
        label: 'Bar hopping, live music, staying out late',
        scores: { soma: 10, downtown: 9, argenta: 8, hillcrest: 7, 'the-heights': 7 },
      },
      {
        label: "Brunch on a patio, then the farmers market",
        scores: { 'the-heights': 10, hillcrest: 9, soma: 7, downtown: 6 },
      },
      {
        label: 'Coaching youth sports or cheering on the kids',
        scores: { bryant: 10, 'chenal-valley': 8, conway: 8, benton: 8, maumelle: 7, sherwood: 6 },
      },
      {
        label: 'Long walk in a quiet neighborhood, coffee in hand',
        scores: { hillcrest: 10, 'the-heights': 9, maumelle: 8, 'chenal-valley': 7, conway: 7 },
      },
    ],
  },
];

const NEIGHBORHOOD_META: Record<Slug, { name: string; tagline: string; price: string }> = {
  'the-heights': { name: 'The Heights', tagline: 'Walkable, food-forward, best restaurant scene in LR', price: '$285K–$750K' },
  hillcrest: { name: 'Hillcrest', tagline: 'Tree-lined bungalows, indie shops, neighborhood soul', price: '$220K–$520K' },
  soma: { name: 'SoMa District', tagline: 'South Main arts scene, breweries, galleries', price: '$200K–$420K' },
  downtown: { name: 'Downtown', tagline: 'River Market, lofts, urban energy', price: '$180K–$550K' },
  'chenal-valley': { name: 'Chenal Valley', tagline: 'Master-planned, executive homes, golf community', price: '$400K–$1.2M' },
  'west-little-rock': { name: 'West Little Rock', tagline: 'Suburban amenities, Trader Joes corridor, value', price: '$250K–$600K' },
  midtown: { name: 'Midtown', tagline: 'Central location, older homes, up-and-coming', price: '$180K–$380K' },
  'university-district': { name: 'University District', tagline: 'UALR area, diverse, affordable urban living', price: '$120K–$280K' },
  conway: { name: 'Conway', tagline: 'College town, 30 min north, fast growth', price: '$185K–$420K' },
  benton: { name: 'Benton', tagline: 'Small city charm, Saline County, quick I-30 commute', price: '$170K–$380K' },
  bryant: { name: 'Bryant', tagline: 'Top schools, south suburb, strong value', price: '$185K–$420K' },
  maumelle: { name: 'Maumelle', tagline: 'Planned community, Pinnacle Mountain access, quiet', price: '$220K–$480K' },
  'north-little-rock': { name: 'North Little Rock', tagline: 'Across the river, value, improving rapidly', price: '$140K–$320K' },
  sherwood: { name: 'Sherwood', tagline: 'Northeast suburb, established, practical value', price: '$160K–$340K' },
  jacksonville: { name: 'Jacksonville', tagline: 'Military community, affordable, northeast of LR', price: '$120K–$260K' },
  cabot: { name: 'Cabot', tagline: 'Fast-growing, top schools, northeast, spacious lots', price: '$170K–$380K' },
  alexander: { name: 'Alexander', tagline: 'Small town feel, south of LR, very affordable', price: '$150K–$300K' },
  'little-rock-south': { name: 'South Little Rock', tagline: 'Affordable, close to downtown, improving', price: '$100K–$250K' },
  'east-little-rock': { name: 'East Little Rock', tagline: 'Most affordable entry point, urban, opportunity', price: '$80K–$200K' },
  argenta: { name: 'Argenta', tagline: 'North LR arts district, music scene, fast gentrifying', price: '$160K–$350K' },
};

export default function NeighborhoodQuiz() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  const currentStep = QUESTIONS.findIndex((q) => !(q.id in answers));
  const done = currentStep === -1;

  function handleAnswer(questionId: string, optionIndex: number) {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  }

  function getResults(): { slug: Slug; name: string; tagline: string; price: string; score: number }[] {
    const totals: Partial<Record<Slug, number>> = {};

    QUESTIONS.forEach((q) => {
      const chosen = answers[q.id];
      if (chosen === undefined) return;
      const scores = q.options[chosen].scores;
      Object.entries(scores).forEach(([slug, pts]) => {
        totals[slug as Slug] = (totals[slug as Slug] ?? 0) + (pts ?? 0);
      });
    });

    return (Object.entries(totals) as [Slug, number][])
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([slug, score]) => ({
        slug,
        score,
        ...NEIGHBORHOOD_META[slug],
      }));
  }

  function reset() {
    setAnswers({});
    setShowResults(false);
  }

  const activeQuestion = !done ? QUESTIONS[currentStep] : null;
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / QUESTIONS.length) * 100;

  if (showResults && done) {
    const results = getResults();
    return (
      <div className="min-h-screen bg-[#F8F9FA]">
        <section className="bg-[#1B4F72] text-white py-12 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#AED6F1] mb-3">Your Results</p>
            <h1 className="text-3xl font-bold mb-3">Your Best Matches</h1>
            <p className="text-[#D6EAF8]">Based on your answers, here are the Little Rock areas that fit you best.</p>
          </div>
        </section>

        <div className="max-w-2xl mx-auto px-4 py-10">
          <div className="space-y-4">
            {results.map((r, i) => (
              <Link
                key={r.slug}
                href={`/neighborhoods/${r.slug}`}
                className="block bg-white rounded-xl border border-[#E5E5E5] shadow-sm hover:shadow-md transition-shadow p-6"
              >
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm ${
                    i === 0 ? 'bg-[#D4740A]' : i === 1 ? 'bg-[#1B4F72]' : 'bg-[#555555]'
                  }`}>
                    #{i + 1}
                  </div>
                  <div className="flex-1">
                    <h2 className="font-bold text-[#1C1C1C] text-lg">{r.name}</h2>
                    <p className="text-sm text-[#555555] mt-0.5">{r.tagline}</p>
                    <p className="text-sm font-medium text-[#1B4F72] mt-2">{r.price}</p>
                  </div>
                  <span className="text-[#2E86C1] font-bold text-lg">→</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10 bg-[#EBF5FB] rounded-xl p-6 text-center">
            <p className="text-[#1B4F72] font-medium mb-4">Want to see all 20 neighborhoods?</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/neighborhoods"
                className="bg-[#1B4F72] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#2E86C1] transition-colors"
              >
                Browse All Neighborhoods
              </Link>
              <button
                onClick={reset}
                className="bg-white text-[#1B4F72] border border-[#1B4F72] px-6 py-2.5 rounded-lg font-semibold hover:bg-[#F0F4F8] transition-colors"
              >
                Retake Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <section className="bg-[#1B4F72] text-white py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#AED6F1] mb-3">
            Neighborhood Finder
          </p>
          <h1 className="text-3xl font-bold mb-3">Find Your Little Rock Neighborhood</h1>
          <p className="text-[#D6EAF8] max-w-lg mx-auto">
            Answer 5 questions about your lifestyle and priorities. We&apos;ll match you to the right Little Rock area neighborhoods.
          </p>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4 py-10">

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-[#555555] mb-2">
            <span>Question {Math.min(answeredCount + 1, QUESTIONS.length)} of {QUESTIONS.length}</span>
            <span>{answeredCount} answered</span>
          </div>
          <div className="h-2 bg-[#E5E5E5] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#1B4F72] rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {activeQuestion && (
          <div className="bg-white rounded-xl border border-[#E5E5E5] shadow-sm p-8">
            <h2 className="text-xl font-bold text-[#1C1C1C] mb-6">{activeQuestion.text}</h2>
            <div className="space-y-3">
              {activeQuestion.options.map((option, i) => {
                const isSelected = answers[activeQuestion.id] === i;
                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(activeQuestion.id, i)}
                    className={`w-full text-left px-5 py-4 rounded-lg border-2 transition-all ${
                      isSelected
                        ? 'border-[#1B4F72] bg-[#EBF5FB] text-[#1B4F72] font-medium'
                        : 'border-[#E5E5E5] bg-white text-[#333333] hover:border-[#2E86C1] hover:bg-[#F8F9FA]'
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {done && !showResults && (
          <div className="bg-white rounded-xl border border-[#E5E5E5] shadow-sm p-8 text-center">
            <p className="text-2xl font-bold text-[#1C1C1C] mb-3">All done!</p>
            <p className="text-[#555555] mb-8">Ready to see your neighborhood matches?</p>
            <button
              onClick={() => setShowResults(true)}
              className="bg-[#1B4F72] text-white px-10 py-3 rounded-lg font-semibold hover:bg-[#2E86C1] transition-colors"
            >
              Show My Results
            </button>
          </div>
        )}

        {/* Already answered questions summary */}
        {answeredCount > 0 && activeQuestion && (
          <div className="mt-6">
            <p className="text-xs text-[#555555] uppercase tracking-wider mb-3">Your answers so far</p>
            <div className="space-y-2">
              {QUESTIONS.slice(0, answeredCount).map((q) => (
                <div
                  key={q.id}
                  className="bg-white rounded-lg border border-[#E5E5E5] px-4 py-3 flex items-start justify-between gap-3"
                >
                  <div>
                    <p className="text-xs text-[#555555]">{q.text}</p>
                    <p className="text-sm font-medium text-[#1C1C1C] mt-0.5">
                      {q.options[answers[q.id]].label}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const newAnswers = { ...answers };
                      // Remove this and all subsequent answers
                      const idx = QUESTIONS.findIndex((x) => x.id === q.id);
                      QUESTIONS.slice(idx).forEach((x) => delete newAnswers[x.id]);
                      setAnswers(newAnswers);
                    }}
                    className="text-xs text-[#2E86C1] hover:underline flex-shrink-0 mt-1"
                  >
                    Change
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
