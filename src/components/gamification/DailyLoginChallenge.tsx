import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Flame, 
  Sparkles, 
  Gift, 
  CheckCircle2, 
  Zap, 
  Award, 
  HelpCircle, 
  ChevronRight, 
  Trophy,
  ArrowRight
} from 'lucide-react';
import { useGamification } from '@/hooks/useGamification';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

// 7 Engineering Daily Flash Challenges
const DAILY_QUIZZES = [
  {
    day: 1,
    domain: 'Instrumentation & Process Control',
    question: 'In industrial process control, what does the abbreviation "SIL" stand for in safety Instrumented Systems?',
    options: [
      'Safety Integrity Level',
      'Standard Instrumentation Loop',
      'System Isolation Logic',
      'Secondary Industrial Line'
    ],
    correctIndex: 0,
    explanation: 'SIL (Safety Integrity Level) is defined by IEC 61508/61511 as the relative level of risk-reduction provided by a safety instrumented function.',
    points: 25,
  },
  {
    day: 2,
    domain: 'Valves & Flow Assurance',
    question: 'What is the primary function of an Anti-Surge valve on a centrifugal compressor train?',
    options: [
      'Regulate downstream pipeline billing pressure',
      'Recycle gas back to compressor suction to prevent aerodynamic stall and surge',
      'Isolate the fuel gas supply during ESD',
      'Filter liquid particulates from the discharge stream'
    ],
    correctIndex: 1,
    explanation: 'Anti-surge valves rapidly recycle discharge gas to the suction scrubber to keep the volumetric flow safely above the surge limit line.',
    points: 30,
  },
  {
    day: 3,
    domain: 'Power & Rotating Drives',
    question: 'Under API 670, which sensor type is primarily used for non-contact shaft vibration and axial position measurement?',
    options: [
      'Eddy-current proximity probe',
      'Piezoelectric accelerometer',
      'Thermocouple junction',
      'Optical tachometer'
    ],
    correctIndex: 0,
    explanation: 'Eddy current proximity probes directly observe the rotating shaft journal to measure dynamic vibration and axial thrust position.',
    points: 35,
  },
  {
    day: 4,
    domain: 'Asset Integrity & Reliability',
    question: 'In Reliability Centred Maintenance (RCM), what does FMECA stand for?',
    options: [
      'Failure Modes, Effects, and Criticality Analysis',
      'Field Maintenance Efficiency & Calibration Audit',
      'Facility Management Environmental Compliance Act',
      'Fixed Machinery Emergency Control Assessment'
    ],
    correctIndex: 0,
    explanation: 'FMECA is a foundational methodology used to identify potential failure modes, evaluate their effects, and rank equipment criticality.',
    points: 40,
  },
  {
    day: 5,
    domain: 'Energy Transition & Decarbonization',
    question: 'Which gas has the highest Global Warming Potential (GWP) over a 20-year horizon among typical upstream emissions?',
    options: [
      'Methane (CH4)',
      'Carbon Dioxide (CO2)',
      'Nitrogen (N2)',
      'Argon (Ar)'
    ],
    correctIndex: 0,
    explanation: 'Methane has a GWP over 80 times greater than carbon dioxide over a 20-year timescale, making methane abatement a high-priority sustainability initiative.',
    points: 45,
  },
  {
    day: 6,
    domain: 'Industrial Cybersecurity & OT',
    question: 'Which standard series is the global benchmark for Security for Industrial Automation and Control Systems (IACS)?',
    options: [
      'IEC 62443',
      'ISO 9001',
      'API 510',
      'ASME Section VIII'
    ],
    correctIndex: 0,
    explanation: 'IEC 62443 specifies technical and organizational security requirements for operational technology (OT) and industrial control systems.',
    points: 50,
  },
  {
    day: 7,
    domain: 'Custody Transfer & Metering',
    question: 'Which flowmeter technology measures mass flow directly without needing fluid density compensation?',
    options: [
      'Coriolis mass flowmeter',
      'Orifice differential pressure meter',
      'Turbine meter',
      'Venturi tube'
    ],
    correctIndex: 0,
    explanation: 'Coriolis meters utilize the Coriolis effect on vibrating tubes to measure true mass flow directly and independently of fluid density changes.',
    points: 60,
  },
];

export const DailyLoginChallenge: React.FC = () => {
  const { userGamification, awardPoints, updateStreak } = useGamification();
  const { toast } = useToast();

  const [claimedToday, setClaimedToday] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizCorrect, setQuizCorrect] = useState(false);
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  // Check today's date in local storage / user state
  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const lastClaimDate = localStorage.getItem('pana_daily_reward_claim_date');
    if (lastClaimDate === todayStr) {
      setClaimedToday(true);
    } else {
      setClaimedToday(false);
    }

    // Determine day in 7-day cycle from current streak or day of week
    const currentStreak = userGamification?.streak_days || 1;
    const dayIndex = ((currentStreak - 1) % 7);
    setActiveDayIndex(dayIndex);
  }, [userGamification, todayStr]);

  const currentChallenge = DAILY_QUIZZES[activeDayIndex] || DAILY_QUIZZES[0];

  // Daily Streak Rewards table (Day 1 to 7)
  const streakRewards = [
    { day: 1, pts: 15, bonus: 'Explorer' },
    { day: 2, pts: 25, bonus: '2x Boost' },
    { day: 3, pts: 35, bonus: '3-Day Fire' },
    { day: 4, pts: 50, bonus: 'Silver Key' },
    { day: 5, pts: 65, bonus: 'Technologist' },
    { day: 6, pts: 80, bonus: 'Master Cadre' },
    { day: 7, pts: 120, bonus: '🏆 Gold Badge' },
  ];

  const handleClaimLoginBonus = async () => {
    if (claimedToday || claiming) return;

    setClaiming(true);
    try {
      await updateStreak();
      const basePts = streakRewards[activeDayIndex]?.pts || 20;

      const success = await awardPoints(
        basePts,
        'daily_login',
        `Daily Login Check-In (Day ${activeDayIndex + 1})`
      );

      if (success) {
        localStorage.setItem('pana_daily_reward_claim_date', todayStr);
        setClaimedToday(true);
        toast({
          title: `🔥 Day ${activeDayIndex + 1} Streak Claimed!`,
          description: `You earned +${basePts} XP! Solve today's technical challenge for bonus points.`,
        });
      }
    } catch (e) {
      console.error('Error claiming daily bonus:', e);
    } finally {
      setClaiming(false);
    }
  };

  const handleQuizSubmit = async () => {
    if (selectedOption === null || quizSubmitted) return;

    const isCorrect = selectedOption === currentChallenge.correctIndex;
    setQuizCorrect(isCorrect);
    setQuizSubmitted(true);

    if (isCorrect) {
      await awardPoints(
        currentChallenge.points,
        'daily_challenge',
        `Daily Challenge: ${currentChallenge.domain}`
      );
      toast({
        title: '🎯 Brilliant! Correct Answer!',
        description: `+${currentChallenge.points} Bonus XP awarded!`,
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Incorrect Answer',
        description: 'Review the technical explanation and try again tomorrow!',
      });
    }
  };

  return (
    <>
      <Card className="border-red-500/20 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white rounded-2xl shadow-xl overflow-hidden relative">
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <CardContent className="p-5 sm:p-6 relative z-10">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-red-600/30">
                <Flame className="w-7 h-7 animate-pulse text-amber-200 fill-amber-200" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
                    Daily Login Quest & Streak
                  </h3>
                  <Badge className="bg-red-500/20 text-red-300 border-red-500/30 text-[10px] px-2 py-0.5">
                    Season 1
                  </Badge>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Check in every 24 hours to multiply your streak multiplier and unlock certified rewards.
                </p>
              </div>
            </div>

            {/* Quick Claim Button */}
            <div className="flex items-center gap-2">
              <Button
                onClick={handleClaimLoginBonus}
                disabled={claimedToday || claiming}
                className={
                  claimedToday
                    ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 cursor-default h-9 text-xs font-semibold'
                    : 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-md shadow-red-600/25 h-9 text-xs font-semibold'
                }
              >
                {claimedToday ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-400" /> Check-in Claimed
                  </>
                ) : (
                  <>
                    <Gift className="w-4 h-4 mr-1.5 animate-bounce" /> Claim Day {activeDayIndex + 1} Bonus
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* 7-Day Cycle Progress Bar */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2.5 my-5">
            {streakRewards.map((item, idx) => {
              const isPast = idx < activeDayIndex;
              const isCurrent = idx === activeDayIndex;
              const isFuture = idx > activeDayIndex;

              return (
                <div
                  key={item.day}
                  className={`relative p-2 sm:p-2.5 rounded-xl border text-center transition-all duration-200 flex flex-col justify-between ${
                    isCurrent
                      ? 'bg-red-950/60 border-red-500/80 shadow-md shadow-red-950/40 scale-102 ring-1 ring-red-500/40'
                      : isPast
                      ? 'bg-slate-900/90 border-emerald-500/40 text-slate-300'
                      : 'bg-slate-950/60 border-white/5 opacity-60 text-slate-400'
                  }`}
                >
                  <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    Day {item.day}
                  </div>

                  <div className="my-1.5 flex justify-center">
                    {isPast ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : isCurrent ? (
                      <Flame className="w-5 h-5 text-amber-400 fill-amber-400 animate-pulse" />
                    ) : item.day === 7 ? (
                      <Trophy className="w-5 h-5 text-amber-300" />
                    ) : (
                      <Zap className="w-4 h-4 text-slate-500" />
                    )}
                  </div>

                  <div className="text-[11px] font-bold text-white">
                    +{item.pts} XP
                  </div>

                  <div className="text-[8px] sm:text-[9px] text-red-300/80 font-medium truncate mt-0.5">
                    {item.bonus}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Daily Engineering Challenge Teaser Banner */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Daily Flash Challenge
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {currentChallenge.domain}
                </span>
              </div>
              <h4 className="text-sm font-semibold text-white line-clamp-1">
                {currentChallenge.question}
              </h4>
            </div>

            <Button
              size="sm"
              onClick={() => {
                setShowQuizModal(true);
                setSelectedOption(null);
                setQuizSubmitted(false);
              }}
              className="bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold h-8 px-3 shrink-0 gap-1.5 shadow"
            >
              Solve Challenge (+{currentChallenge.points} XP) <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Challenge Interactive Quiz Modal */}
      <Dialog open={showQuizModal} onOpenChange={setShowQuizModal}>
        <DialogContent className="max-w-md bg-slate-900 border-slate-800 text-white p-6 rounded-2xl shadow-2xl">
          <DialogHeader className="space-y-2">
            <div className="flex items-center justify-between">
              <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">
                {currentChallenge.domain}
              </Badge>
              <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 fill-amber-400" /> +{currentChallenge.points} Points
              </span>
            </div>
            <DialogTitle className="text-base sm:text-lg font-bold text-white leading-snug">
              {currentChallenge.question}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Select the correct technical answer to earn instant competence points towards your leaderboard rank.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2.5 my-4">
            {currentChallenge.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              let btnClass = 'w-full text-left p-3 rounded-xl border text-xs font-medium transition-all ';

              if (quizSubmitted) {
                if (idx === currentChallenge.correctIndex) {
                  btnClass += 'bg-emerald-950/80 border-emerald-500 text-emerald-200';
                } else if (isSelected && !quizCorrect) {
                  btnClass += 'bg-red-950/80 border-red-500 text-red-200';
                } else {
                  btnClass += 'bg-slate-950/40 border-white/5 text-slate-500';
                }
              } else {
                if (isSelected) {
                  btnClass += 'bg-red-950/60 border-red-500 text-white shadow-md';
                } else {
                  btnClass += 'bg-slate-950/60 border-white/10 text-slate-300 hover:border-red-500/50 hover:bg-slate-950';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={quizSubmitted}
                  onClick={() => setSelectedOption(idx)}
                  className={btnClass}
                >
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{option}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {quizSubmitted && (
            <div className={`p-3 rounded-xl border text-xs mb-4 ${
              quizCorrect 
                ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-200' 
                : 'bg-red-950/50 border-red-500/40 text-red-200'
            }`}>
              <div className="font-bold flex items-center gap-1.5 mb-1">
                {quizCorrect ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Correct!
                  </>
                ) : (
                  <>
                    <HelpCircle className="w-4 h-4 text-red-400" /> Technical Rationale:
                  </>
                )}
              </div>
              <p className="text-[11px] leading-relaxed text-slate-300">
                {currentChallenge.explanation}
              </p>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
            {!quizSubmitted ? (
              <Button
                disabled={selectedOption === null}
                onClick={handleQuizSubmit}
                className="w-full bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold h-9 shadow"
              >
                Submit Answer
              </Button>
            ) : (
              <Button
                onClick={() => setShowQuizModal(false)}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold h-9"
              >
                Close & Return
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
