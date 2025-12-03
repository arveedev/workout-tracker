import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Info, ChevronRight, CheckCircle, Clock, Flame, Wind, Dumbbell, Activity, BatteryCharging, Zap, Sun, Calendar } from 'lucide-react';

// --- DATA STRUCTURES (Based on workout_plan_master_guide.md) ---

const phases = {
  1: { title: "Phase 1: Hypertrophy", subtitle: "Control & Stability (Months 1-3)", icon: <BatteryCharging className="text-blue-400" />, dayMap: { upperA: 'Monday', lowerA: 'Tuesday', upperB: 'Thursday', lowerB: 'Friday' } },
  2: { title: "Phase 2: Strength", subtitle: "Force & Intensity (Months 4-6)", icon: <Dumbbell className="text-red-400" />, dayMap: { upperA: 'Monday', lowerA: 'Tuesday', upperB: 'Thursday', lowerB: 'Friday' } },
  3: { title: "Phase 3: Metabolic", subtitle: "The Cut & Supersets (Months 7-9)", icon: <Flame className="text-orange-400" />, dayMap: { upperA: 'Monday', lowerA: 'Tuesday', upperB: 'Thursday', lowerB: 'Friday' } },
  4: { title: "Phase 4: Power", subtitle: "Athleticism (Months 10-12)", icon: <Zap className="text-yellow-400" />, dayMap: { upperA: 'Monday', lowerA: 'Tuesday', upperB: 'Thursday', lowerB: 'Friday' } }
};

const warmups = {
  upper: [
    { name: "Shoulder Dislocates", duration: "12 reps", instruction: "Use broom/towel. Arms straight, over and back." },
    { name: "Scapular Wall Slides", duration: "15 reps", instruction: "Back to wall, arms in W. Squeeze shoulder blades." },
    { name: "Band/Air Pull-Aparts", duration: "20 reps", instruction: "Arms straight out. Squeeze rear delts hard." },
    { name: "Push-up Plus", duration: "10 reps", instruction: "Top of pushup. Push floor away to round upper back." },
  ],
  lower: [
    { name: "Leg Swings (All Directions)", duration: "15/leg", instruction: "Front/back and Side/side. Loosen hip capsule." },
    { name: "Bodyweight Squats", duration: "10 reps", instruction: "Pause 2 sec at bottom. Open hips." },
    { name: "Ankle Dorsiflexion", duration: "30s/side", instruction: "Kneel, push knee over toe. Keep heel down." },
    { name: "Walking Knee Hugs", duration: "10 reps", instruction: "Pull knee to chest while walking forward." },
  ],
  fullbody: [
    { name: "Jumping Jacks", duration: "60s", instruction: "Get heart rate up." },
    { name: "Arm Circles", duration: "30s", instruction: "Mobilize shoulders." },
    { name: "Leg Swings", duration: "15/side", instruction: "Mobilize hips." },
    { name: "World's Greatest Stretch", duration: "5/side", instruction: "Deep lunge + rotation." }
  ]
};

const cooldowns = {
  upper: [
    { name: "Doorway Chest Stretch", duration: "60s/side", instruction: "Arm at 90 deg against frame. Step through." },
    { name: "Lat Stretch", duration: "60s/side", instruction: "Hold frame, hinge hips back. Feel armpit stretch." },
    { name: "Overhead Tricep Stretch", duration: "30s/side", instruction: "Hand down spine, pull elbow gently." },
  ],
  lower: [
    { name: "Standing Quad Stretch", duration: "60s/leg", instruction: "Heel to butt. Tuck hips forward." },
    { name: "Couch Stretch", duration: "60s/leg", instruction: "Shin against wall. Deep hip flexor stretch." },
    { name: "Calf Stretch against wall", duration: "45s/leg", instruction: "Heel down. Straight back knee." },
  ],
  fullbody: [
    { name: "Full Body Stretch Routine", duration: "5 Mins", instruction: "Focus on Quads, Hams, Chest, Lats." },
  ]
};

const workoutDatabase = {
  // --- PHASE 1 ---
  1: {
    upperA: {
      title: "Upper Body A (Control)", day: 'Monday', type: 'upper',
      exercises: [
        { name: "Flat DB Bench Press", sets: 3, reps: "10-12", rest: 90, note: "Form: Pin shoulders back. Lower slowly. Elbows at 45°." },
        { name: "Single-Arm DB Row", sets: 3, reps: "10-12/side", rest: 90, note: "Form: Pull weight to hip pocket, not chest." },
        { name: "Incline Dumbbell Flyes", sets: 3, reps: "12-15", rest: 60, note: "Form: Bench at 30°. Slight elbow bend. Stretch pecs fully." },
        { name: "Dumbbell Pullovers", sets: 3, reps: "12-15", rest: 60, note: "Form: Upper back on bench. Hips low. Stretch lats overhead." },
        { name: "Dumbbell Skullcrushers", sets: 3, reps: "12-15", rest: 60, note: "Form: Hinge only at elbows. Keep upper arms vertical." }
      ]
    },
    lowerA: {
      title: "Lower Body A (Quads)", day: 'Tuesday', type: 'lower',
      exercises: [
        { name: "Bulgarian Split Squats", sets: 3, reps: "8-10/leg", rest: 120, note: "Form: Torso upright. Drop back knee deep." },
        { name: "Goblet Squats", sets: 3, reps: "10-12", rest: 90, note: "Form: Hold DB at chest. Heels elevated on small plates." },
        { name: "Dumbbell Walking Lunges", sets: 3, reps: "12 steps/leg", rest: 90, note: "Form: Take long steps. Kiss back knee to floor gently." },
        { name: "Seated Dumbbell Calf Raises", sets: 4, reps: "15-20", rest: 45, note: "Form: DBs on knees. Full stretch at bottom." },
        { name: "RKC Plank", sets: 3, reps: "45s", rest: 60, note: "Form: Clench fists, squeeze glutes/quads max effort." }
      ]
    },
    upperB: {
      title: "Upper Body B (Shoulders)", day: 'Thursday', type: 'upper',
      exercises: [
        { name: "Seated Dumbbell Shoulder Press", sets: 3, reps: "8-12", rest: 90, note: "Form: Neutral grip (palms facing ears). Core tight." },
        { name: "Dumbbell Lateral Raises", sets: 4, reps: "12-15", rest: 60, note: "Form: Lean forward slightly. Lead with elbows." },
        { name: "Chest Supported Rear Delt Row", sets: 3, reps: "15-20", rest: 60, note: "Form: Lie chest down on incline bench. Row elbows wide." },
        { name: "Dumbbell Hammer Curls", sets: 3, reps: "10-12", rest: 60, note: "Form: Thumbs up. Squeeze biceps and forearms." },
        { name: "Dumbbell Shrugs", sets: 3, reps: "15", rest: 60, note: "Form: Shrug up, hold 3 sec, lower slowly." }
      ]
    },
    lowerB: {
      title: "Lower Body B (Hinge)", day: 'Friday', type: 'lower',
      exercises: [
        { name: "Dumbbell Romanian Deadlift (RDL)", sets: 3, reps: "10-12", rest: 120, note: "Form: Soft knees. Push hips way back. Flat spine." },
        { name: "Single-Leg RDL (Kickstand)", sets: 3, reps: "10/leg", rest: 90, note: "Form: One foot back for balance only. Hinge on front hip." },
        { name: "Dumbbell Hip Thrusts", sets: 3, reps: "12-15", rest: 90, note: "Form: Upper back on bench. DB on hips. Squeeze top." },
        { name: "Standing Single-Leg Calf Raises", sets: 4, reps: "15", rest: 45, note: "Form: Hold DB in one hand, balance with other." },
        { name: "Side Plank", sets: 3, reps: "30s/side", rest: 60, note: "Form: Hips high. Straight line." }
      ]
    }
  },
  // --- PHASE 2 ---
  2: {
    upperA: {
      title: "Upper Strength A", day: 'Monday', type: 'upper',
      exercises: [
        { name: "Flat DB Bench Press (Heavy)", sets: 4, reps: "6-8", rest: 180, note: "Form: Plant feet firm. Drive hard. Explosive up." },
        { name: "Chest Supported Dumbbell Row (Heavy)", sets: 4, reps: "6-8", rest: 120, note: "Form: Chest on incline. Isolate the lats. Heavy pull." },
        { name: "Arnold Press", sets: 3, reps: "8-10", rest: 120, note: "Form: Palms face you at bottom, rotate out pressing up." },
        { name: "Weighted/Heavy Tricep Extensions", sets: 3, reps: "8-10", rest: 90, note: "Form: Seated overhead. One heavy DB." }
      ]
    },
    lowerA: {
      title: "Lower Strength A", day: 'Tuesday', type: 'lower',
      exercises: [
        { name: "Bulgarian Split Squats (Heavy)", sets: 4, reps: "6/leg", rest: 180, note: "Form: Go heavy but maintain balance. Main strength lift." },
        { name: "Dumbbell Step-Ups (High Box)", sets: 3, reps: "8/leg", rest: 120, note: "Form: Drive through the heel on the box. Control the descent." },
        { name: "Weighted Wall Sit", sets: 3, reps: "45-60s", rest: 90, note: "Form: Hold DB on thighs. Parallel thighs." },
        { name: "Farmers Walk", sets: 3, reps: "30 steps", rest: 90, note: "Form: Heavy DB in each hand. Walk with perfect posture." }
      ]
    },
    upperB: {
      title: "Upper Strength B", day: 'Thursday', type: 'upper',
      exercises: [
        { name: "Single Arm Standing Overhead Press", sets: 4, reps: "6-8", rest: 120, note: "Form: Engage core. Press one side at a time. Stability focus." },
        { name: "Heavy Dumbbell Pullovers", sets: 4, reps: "8-10", rest: 120, note: "Form: Focus on the stretch under heavy load." },
        { name: "Incline Dumbbell Curls", sets: 3, reps: "8-10", rest: 90, note: "Form: Seated incline. Arms hanging behind body. Stretch biceps." },
        { name: "Reverse Flyes", sets: 3, reps: "10-12", rest: 90, note: "Form: Chest supported. Hit rear delts hard." }
      ]
    },
    lowerB: {
      title: "Lower Strength B", day: 'Friday', type: 'lower',
      exercises: [
        { name: "Heavy Dumbbell RDL", sets: 4, reps: "6-8", rest: 180, note: "Form: Maximal hip hinge. Feel the hamstrings load." },
        { name: "Single Leg Hip Thrust (Weighted)", sets: 3, reps: "8-10/leg", rest: 120, note: "Form: DB on working hip. Explosive hip drive." },
        { name: "Nordic Hamstring Negatives", sets: 3, reps: "5", rest: 120, note: "Form: Lower as slow as possible (Negative only)." },
        { name: "Heavy Calf Raises", sets: 4, reps: "10-12", rest: 60, note: "Form: Two legs, holding heavy DBs." }
      ]
    }
  },
  // --- PHASE 3 ---
  3: {
    upperA: {
      title: "Upper Density A (Supersets)", day: 'Monday', type: 'upper',
      exercises: [
        { name: "1A. DB Bench Press", sets: 4, reps: "12", rest: 0, note: "Superset with 1B. No rest between." },
        { name: "1B. Chest Supported Row", sets: 4, reps: "12", rest: 90, note: "Rest 90s after this." },
        { name: "2A. DB Shoulder Press", sets: 3, reps: "12", rest: 0, note: "Superset with 2B. No rest between." },
        { name: "2B. DB Pullovers", sets: 3, reps: "15", rest: 90, note: "Rest 90s after this." },
        { name: "3A. Bicep Curls", sets: 3, reps: "15", rest: 0, note: "Superset with 3B. No rest between." },
        { name: "3B. Tricep Kickbacks", sets: 3, reps: "15", rest: 60, note: "Rest 60s after this." }
      ]
    },
    lowerA: {
      title: "Lower Density A (Metabolic)", day: 'Tuesday', type: 'lower',
      exercises: [
        { name: "1A. Goblet Squats", sets: 4, reps: "15", rest: 0, note: "Superset with 1B. Focus on high reps/burn." },
        { name: "1B. Squat Jumps (Bodyweight)", sets: 4, reps: "10", rest: 90, note: "Explosive movement. Rest 90s after this." },
        { name: "2A. Walking Lunges", sets: 3, reps: "12/leg", rest: 0, note: "Superset with 2B. Maintain constant movement." },
        { name: "2B. Mountain Climbers", sets: 3, reps: "30s", rest: 90, note: "Cardio spike. Rest 90s after this." },
        { name: "3A. Calf Raises", sets: 3, reps: "20", rest: 0, note: "Superset with 3B. Burn out calves." },
        { name: "3B. Plank", sets: 3, reps: "60s", rest: 60, note: "Hold steady. Rest 60s after this." }
      ]
    },
    upperB: {
      title: "Upper Density B (Supersets)", day: 'Thursday', type: 'upper',
      exercises: [
        { name: "1A. Incline DB Press", sets: 4, reps: "12", rest: 0, note: "Superset with 1B. No rest between." },
        { name: "1B. Single Arm Row", sets: 4, reps: "12", rest: 90, note: "Rest 90s after this." },
        { name: "2A. Lateral Raises", sets: 3, reps: "15", rest: 0, note: "Superset with 2B. Burn delts." },
        { name: "2B. Rear Delt Flyes", sets: 3, reps: "15", rest: 60, note: "Rest 60s after this." },
        { name: "3A. Hammer Curls", sets: 3, reps: "15", rest: 0, note: "Superset with 3B. No rest between." },
        { name: "3B. Overhead Tricep Ext", sets: 3, reps: "15", rest: 60, note: "Rest 60s after this." }
      ]
    },
    lowerB: {
      title: "Lower Density B (Metabolic)", day: 'Friday', type: 'lower',
      exercises: [
        { name: "1A. RDLs", sets: 4, reps: "12", rest: 0, note: "Superset with 1B. Control the hinge." },
        { name: "1B. High Knees in Place", sets: 4, reps: "30s", rest: 90, note: "Fast! Rest 90s after this." },
        { name: "2A. Hip Thrusts", sets: 3, reps: "15", rest: 0, note: "Superset with 2B. Squeeze glutes." },
        { name: "2B. Glute Bridges (Bodyweight)", sets: 3, reps: "20", rest: 90, note: "Rest 90s after this." },
        { name: "3A. Step Ups", sets: 3, reps: "10/leg", rest: 0, note: "Superset with 3B. Control movement." },
        { name: "3B. Bicycle Crunches", sets: 3, reps: "30s", rest: 60, note: "Abs finisher. Rest 60s after this." }
      ]
    }
  },
  // --- PHASE 4 ---
  4: {
    upperA: {
      title: "Full Body Power A", day: 'Monday', type: 'fullbody',
      exercises: [
        { name: "Single Arm DB Snatch", sets: 3, reps: "5/arm", rest: 120, note: "Form: Explosive pull from floor to overhead in one motion." },
        { name: "DB Push Press", sets: 3, reps: "6", rest: 120, note: "Form: Dip knees and drive DBs overhead using leg power." },
        { name: "Goblet Squat (Speed)", sets: 3, reps: "8", rest: 90, note: "Form: Lower normal, explode up fast." },
        { name: "Renegade Rows", sets: 3, reps: "8/side", rest: 90, note: "Form: Pushup position. Row one DB to hip while stabilizing." }
      ]
    },
    lowerA: {
      title: "Full Body Power B", day: 'Tuesday', type: 'fullbody',
      exercises: [
        { name: "DB Swing (like Kettlebell)", sets: 3, reps: "15", rest: 90, note: "Form: Hinge hips. Pop hips forward to swing DB to eye level." },
        { name: "Jump Lunges", sets: 3, reps: "6/leg", rest: 90, note: "Form: Switch legs in air. Land soft." },
        { name: "Incline DB Press (Speed)", sets: 3, reps: "8", rest: 90, note: "Form: Fast press up, controlled down." },
        { name: "Pull-ups or Heavy Pullovers", sets: 3, reps: "Failure (or 10)", rest: 90, note: "Form: Max effort pull." }
      ]
    },
    upperB: {
      title: "Full Body Power A (Repeat)", day: 'Thursday', type: 'fullbody',
      exercises: [
        { name: "Single Arm DB Snatch", sets: 3, reps: "5/arm", rest: 120, note: "Form: Explosive pull from floor to overhead in one motion." },
        { name: "DB Push Press", sets: 3, reps: "6", rest: 120, note: "Form: Dip knees and drive DBs overhead using leg power." },
        { name: "Goblet Squat (Speed)", sets: 3, reps: "8", rest: 90, note: "Form: Lower normal, explode up fast." },
        { name: "Renegade Rows", sets: 3, reps: "8/side", rest: 90, note: "Form: Pushup position. Row one DB to hip while stabilizing." }
      ]
    },
    lowerB: {
      title: "Full Body Power B (Repeat)", day: 'Friday', type: 'fullbody',
      exercises: [
        { name: "DB Swing (like Kettlebell)", sets: 3, reps: "15", rest: 90, note: "Form: Hinge hips. Pop hips forward to swing DB to eye level." },
        { name: "Jump Lunges", sets: 3, reps: "6/leg", rest: 90, note: "Form: Switch legs in air. Land soft." },
        { name: "Incline DB Press (Speed)", sets: 3, reps: "8", rest: 90, note: "Form: Fast press up, controlled down." },
        { name: "Pull-ups or Heavy Pullovers", sets: 3, reps: "Failure (or 10)", rest: 90, note: "Form: Max effort pull." }
      ]
    }
  }
};

// --- COMPONENTS ---

const Timer = ({ defaultTime }) => {
  const [timeLeft, setTimeLeft] = useState(defaultTime);
  const [isActive, setIsActive] = useState(false);
  const totalTime = defaultTime;

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Optional: Vibrate or play a sound for cue
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const resetTimer = () => { 
    setIsActive(false); 
    setTimeLeft(totalTime); 
  };
  
  const progress = (1 - (timeLeft / totalTime)) * 100;
  const timerColor = timeLeft <= 10 && timeLeft > 0 ? 'text-red-400' : 'text-green-400';

  return (
    <div className="flex items-center space-x-2 bg-slate-950 p-2 rounded-lg border border-slate-700 relative overflow-hidden min-w-[10rem]">
      <div 
        className="absolute inset-0 bg-blue-700/30 transition-all duration-1000 ease-linear" 
        style={{ width: `${progress}%` }}
      ></div>
      <Clock size={16} className="text-blue-400 z-10" />
      <span className={`font-mono text-xl font-bold ${timerColor} z-10 min-w-[3rem] text-center`}>
        {formatTime(timeLeft)}
      </span>
      <button onClick={() => setIsActive(!isActive)} className="p-1 hover:bg-slate-800 rounded z-10">
        {isActive ? <Pause size={18} className="text-yellow-400" /> : <Play size={18} className="text-green-400" />}
      </button>
      <button onClick={resetTimer} className="p-1 hover:bg-slate-800 rounded z-10">
        <RotateCcw size={18} className="text-slate-400" />
      </button>
    </div>
  );
};

const RoutineSection = ({ title, icon, data, completed, onToggle }) => (
  <div className="mb-6">
    <div className="flex items-center space-x-2 mb-3">
      {icon}
      <h3 className="text-lg font-bold uppercase tracking-wider text-slate-200">
        {title}
      </h3>
    </div>
    <div className="bg-slate-800 rounded-xl p-4 shadow-lg border border-slate-700/50">
      {data.map((item, idx) => (
        <div key={idx} className="flex items-start space-x-3 mb-3 last:mb-0 border-b border-slate-700/50 pb-3 last:border-0 last:pb-0">
          <button 
            onClick={() => onToggle(idx)}
            className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
              completed.includes(idx) ? 'bg-green-500 border-green-500' : 'border-slate-500 hover:bg-slate-700'
            }`}
          >
            {completed.includes(idx) && <CheckCircle size={14} className="text-white" />}
          </button>
          <div className="flex-grow">
            <div className="flex justify-between items-center w-full">
               <h4 className={`font-semibold ${completed.includes(idx) ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                 {item.name}
               </h4>
               <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">{item.duration}</span>
            </div>
            <p className="text-sm text-slate-400 mt-1">{item.instruction}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ExerciseCard = ({ exercise, index }) => {
  const [setsDone, setSetsDone] = useState(0);

  // Determine if it's a Superset exercise (e.g., "1A. DB Bench Press")
  const isSuperset = exercise.name.match(/^[0-9][A-B]\./);
  const cardBorderColor = isSuperset ? 'border-orange-500' : 'border-blue-500';

  return (
    <div className={`bg-slate-800 rounded-xl p-5 mb-4 shadow-lg border-l-4 ${cardBorderColor}`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-bold text-white">{index + 1}. {exercise.name}</h3>
        {/* Only show timer if there is a rest period */}
        {exercise.rest > 0 && <Timer defaultTime={exercise.rest} />}
        {exercise.rest === 0 && <span className="text-sm text-orange-400 font-semibold bg-slate-700 p-2 rounded">NO REST (Superset)</span>}
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div className="bg-slate-700/50 p-2 rounded">
          <span className="block text-slate-400 text-xs uppercase">Reps / Time</span>
          <span className="text-white font-mono font-bold">{exercise.reps}</span>
        </div>
        <div className="bg-slate-700/50 p-2 rounded">
          <span className="block text-slate-400 text-xs uppercase">Total Sets</span>
          <span className="text-white font-mono font-bold">{exercise.sets}</span>
        </div>
      </div>
      <p className="text-sm text-blue-200 italic mb-4 bg-blue-900/20 p-2 rounded border border-blue-900/50">
        <Info size={14} className="inline mr-1" /> {exercise.note}
      </p>
      <div className="flex space-x-2">
        {[...Array(exercise.sets)].map((_, i) => (
          <button key={i} onClick={() => setSetsDone(i + 1 === setsDone ? i : i + 1)}
            className={`flex-1 py-2 rounded font-bold text-sm transition-colors ${i < setsDone ? 'bg-green-500 text-white shadow-md' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}>
            SET {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  const [currentPhase, setCurrentPhase] = useState(1);
  const [view, setView] = useState('menu'); 
  const [selectedDay, setSelectedDay] = useState(null);
  const [warmupsDone, setWarmupsDone] = useState([]);
  const [cooldownsDone, setCooldownsDone] = useState([]);

  const phaseConfig = phases[currentPhase];
  const phaseData = workoutDatabase[currentPhase] || workoutDatabase[1];

  const startWorkout = (dayKey) => {
    setSelectedDay(dayKey);
    setWarmupsDone([]);
    setCooldownsDone([]);
    setView('workout');
    window.scrollTo(0, 0);
  };

  const toggleItem = (list, setList, idx) => {
    setList(list.includes(idx) ? list.filter(i => i !== idx) : [...list, idx]);
  };

  const getDayType = (dayKey) => {
    // Phase 4 uses 'fullbody' warmups/cooldowns
    if (currentPhase === 4) return 'fullbody';
    // Phases 1-3 use 'upper' or 'lower'
    return dayKey.includes('upper') ? 'upper' : 'lower';
  }

  const getCooldownData = (dayType) => {
    // Phase 4 uses a generic fullbody stretch routine, simpler than 1-3
    if (currentPhase === 4) return cooldowns.fullbody;
    return cooldowns[dayType];
  }

  if (view === 'menu') {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-200 font-sans p-6 max-w-md mx-auto">
        <header className="mb-6">
          <div className="flex items-center space-x-2 mb-2">
             <Activity className="text-blue-500" />
             <h1 className="text-2xl font-black text-white">TRAINER OS</h1>
          </div>
          
          {/* Phase Selector */}
          <div className="flex space-x-2 overflow-x-auto pb-4 scrollbar-hide">
            {[1, 2, 3, 4].map(p => (
              <button 
                key={p} 
                onClick={() => setCurrentPhase(p)}
                className={`flex-shrink-0 px-4 py-3 rounded-lg font-bold whitespace-nowrap transition-colors flex items-center space-x-2 border ${
                  currentPhase === p 
                  ? 'bg-blue-600 text-white border-blue-500' 
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500'
                }`}
              >
               {phases[p].icon}
               <span>Phase {p}</span>
              </button>
            ))}
          </div>
        </header>

        <div className="bg-slate-800 p-4 rounded-xl mb-6 border border-slate-700 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center space-x-2 mb-2">
               {phaseConfig.icon}
               <h2 className="text-xl font-bold text-white">{phaseConfig.title}</h2>
            </div>
            <p className="text-sm text-slate-300 mb-3">{phaseConfig.subtitle}</p>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none"></div>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Select Workout</p>
          {Object.keys(phaseConfig.dayMap).map((dayKey) => {
            const workout = phaseData[dayKey];
            if (!workout) return null;
            return (
             <button key={dayKey} onClick={() => startWorkout(dayKey)} 
               className="w-full bg-slate-800 hover:bg-slate-700 p-4 rounded-xl flex items-center justify-between border border-slate-700 group transition-all">
               <div>
                 <span className="text-xs text-blue-400 font-bold block mb-1 uppercase">
                   {workout.day}
                 </span>
                 <span className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
                   {workout.title}
                 </span>
               </div>
               <ChevronRight className="text-slate-500 group-hover:translate-x-1 transition-transform" />
             </button>
            )
          })}
        </div>
      </div>
    );
  }

  const currentWorkout = phaseData[selectedDay] || { title: "Rest", exercises: [], type: 'fullbody' };
  const dayType = currentWorkout.type;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans pb-20 max-w-md mx-auto">
      <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-800 p-4 flex items-center justify-between shadow-lg">
        <button onClick={() => setView('menu')} className="text-slate-400 hover:text-white flex items-center text-sm font-bold">
          <Calendar size={16} className="mr-1" /> CHANGE DAY
        </button>
        <span className="font-bold text-white text-sm truncate max-w-[200px]">{currentWorkout.title}</span>
      </div>

      <div className="p-4">
        {/* Specific Warmup */}
        <RoutineSection 
            title="Specific Warm-Up" 
            icon={<Flame className="text-orange-500" />} 
            data={warmups[dayType]} 
            completed={warmupsDone} 
            onToggle={(idx) => toggleItem(warmupsDone, setWarmupsDone, idx)} 
        />

        {/* Workout Block */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-3">
             <Dumbbell className="text-white" />
             <h3 className="text-lg font-bold uppercase tracking-wider text-white">The Workout</h3>
          </div>
          {currentWorkout.exercises.length > 0 ? (
            currentWorkout.exercises.map((ex, idx) => (
              <ExerciseCard key={idx} exercise={ex} index={idx} />
            ))
          ) : (
             <div className="p-4 bg-slate-800 rounded text-center text-slate-400">
               No workout data available for this selection.
             </div>
          )}
        </div>

        {/* Specific Cooldown */}
        <RoutineSection 
            title="Specific Cooldown" 
            icon={<Wind className="text-blue-400" />} 
            data={getCooldownData(dayType)} 
            completed={cooldownsDone} 
            onToggle={(idx) => toggleItem(cooldownsDone, setCooldownsDone, idx)} 
        />
        
        <button onClick={() => setView('menu')}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-4 rounded-xl shadow-lg mt-4 transition-all transform active:scale-95">
          SESSION COMPLETE - GO TO MENU
        </button>
      </div>
    </div>
  );
}
