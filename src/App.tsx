/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  User, 
  Briefcase, 
  Users, 
  Clock, 
  BookOpen, 
  Trophy,
  Frown,
  PartyPopper,
  Building2,
  LayoutDashboard,
  Bell,
  Settings,
  Search,
  ChevronRight,
  Activity,
  HelpCircle,
  X
} from 'lucide-react';

type Role = 'Sếp' | 'Nhân viên' | 'Khách hàng' | 'Deadline' | 'Thực tập sinh';

interface GameState {
  playerScore: number;
  aiScore: number;
  message: string;
  lastResult: 'win' | 'lose' | 'draw' | null;
  playerChoice: Role | null;
  aiChoice: Role | null;
  history: { player: Role; ai: Role; result: 'win' | 'lose' | 'draw'; id: string }[];
}

const ROLES_CONFIG: Record<Role, { icon: any; dept: string; id: string; beats: Role[]; label: string; color: string }> = {
  'Sếp': { icon: User, dept: 'Executive', id: 'EXEC-001', beats: ['Nhân viên', 'Thực tập sinh'], label: 'Sếp Tổng', color: 'blue' },
  'Deadline': { icon: Clock, dept: 'Critical', id: 'DEAD-000', beats: ['Sếp', 'Nhân viên'], label: 'Deadline', color: 'rose' },
  'Nhân viên': { icon: Briefcase, dept: 'Operations', id: 'OPER-042', beats: ['Thực tập sinh', 'Khách hàng'], label: 'Nhân Viên', color: 'emerald' },
  'Thực tập sinh': { icon: BookOpen, dept: 'Training', id: 'INT-500', beats: ['Khách hàng', 'Deadline'], label: 'Thực Tập Sinh', color: 'violet' },
  'Khách hàng': { icon: Users, dept: 'External', id: 'EXT-999', beats: ['Sếp', 'Deadline'], label: 'Khách Hàng', color: 'amber' },
};

export default function App() {
  const [gameState, setGameState] = useState<GameState>({
    playerScore: 0,
    aiScore: 0,
    message: 'Hệ thống đã sẵn sàng. Vui lòng chọn giao thức xử lý.',
    lastResult: null,
    playerChoice: null,
    aiChoice: null,
    history: [],
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#2563eb', '#3b82f6', '#60a5fa']
    });
  };

  const handlePlay = (playerChoice: Role) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    setGameState(prev => ({ 
      ...prev, 
      playerChoice, 
      aiChoice: null, 
      message: 'Đang đồng bộ dữ liệu...', 
      lastResult: null 
    }));

    setTimeout(() => {
      const aiChoices = Object.keys(ROLES_CONFIG) as Role[];
      const aiChoice = aiChoices[Math.floor(Math.random() * aiChoices.length)];
      
      let result: 'win' | 'lose' | 'draw' = 'draw';
      
      if (playerChoice === aiChoice) {
        result = 'draw';
      } else if (ROLES_CONFIG[playerChoice].beats.includes(aiChoice)) {
        result = 'win';
      } else {
        result = 'lose';
      }

      if (result === 'win') triggerConfetti();

    setGameState(prev => ({
      ...prev,
      aiChoice,
      playerScore: result === 'win' ? prev.playerScore + 1 : prev.playerScore,
      aiScore: result === 'lose' ? prev.aiScore + 1 : prev.aiScore,
      lastResult: result,
      message: result === 'win' ? 'Giao dịch thành công!' : result === 'lose' ? 'Giao dịch thất bại.' : 'Trạng thái: Không thay đổi.',
      history: [{ player: playerChoice, ai: aiChoice, result, id: `LOG-${Math.random().toString(16).slice(2, 6).toUpperCase()}` }, ...prev.history].slice(0, 5)
    }));
      
      setIsProcessing(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col corporate-grid">
      {/* Corporate Top Navigation */}
      <nav className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-20">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 text-blue-600 font-black tracking-tighter">
            <Building2 size={20} />
            <span className="text-lg">CORP<span className="text-slate-400">OS</span></span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <button 
            onClick={() => setShowExplanation(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 rounded-md hover:bg-blue-100 transition-colors"
          >
            <HelpCircle size={14} />
            GIẢI THÍCH
          </button>
          <Search size={18} />
          <Bell size={18} />
          <Settings size={18} />
          <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300" />
        </div>
      </nav>

      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Hệ Thống Xử Lý Deadline</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs font-bold flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              SERVER: ACTIVE
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="corporate-card p-5 rounded-lg">
            <p className="text-xs font-bold text-slate-400 uppercase mb-2">Hiệu Suất Cá Nhân</p>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-slate-900">{gameState.playerScore}</span>
              <img 
                src="https://picsum.photos/seed/stickman/100/100" 
                alt="Stickman" 
                className="w-10 h-10 rounded-full border-2 border-slate-100 shadow-sm object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          <div className="corporate-card p-5 rounded-lg">
            <p className="text-xs font-bold text-slate-400 uppercase mb-2">Hiệu Suất Hệ Thống</p>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-slate-900">{gameState.aiScore}</span>
              <img 
                src="https://picsum.photos/seed/robot/100/100" 
                alt="Robot" 
                className="w-10 h-10 rounded-full border-2 border-slate-100 shadow-sm object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>

        {/* Main Interface Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Task Selection */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Danh Sách Nhân Sự / Giao Thức</h3>
              <span className="text-xs text-slate-400 font-medium">Chọn một để thực hiện so sánh</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(Object.keys(ROLES_CONFIG) as Role[]).map((role) => {
                const config = ROLES_CONFIG[role];
                const Icon = config.icon;
                const colorMap: Record<string, string> = {
                  blue: 'bg-blue-50 text-blue-600 border-blue-100',
                  emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
                  amber: 'bg-amber-50 text-amber-600 border-amber-100',
                  rose: 'bg-rose-50 text-rose-600 border-rose-100',
                  violet: 'bg-violet-50 text-violet-600 border-violet-100',
                };
                const activeColorMap: Record<string, string> = {
                  blue: 'bg-blue-100 border-blue-300 ring-blue-300',
                  emerald: 'bg-emerald-100 border-emerald-300 ring-emerald-300',
                  amber: 'bg-amber-100 border-amber-300 ring-amber-300',
                  rose: 'bg-rose-100 border-rose-300 ring-rose-300',
                  violet: 'bg-violet-100 border-violet-300 ring-violet-300',
                };

                return (
                  <button
                    key={role}
                    onClick={() => handlePlay(role)}
                    disabled={isProcessing}
                    className={`
                      btn-corporate p-4 rounded-lg flex items-center gap-4 text-left transition-all duration-200
                      ${gameState.playerChoice === role ? activeColorMap[config.color] + ' ring-1' : 'bg-white hover:shadow-md'}
                      ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    <div className={`w-10 h-10 rounded flex items-center justify-center ${colorMap[config.color]}`}>
                      <Icon size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-bold opacity-60 mono-text uppercase tracking-tighter">{config.id}</p>
                      <p className="text-sm font-bold text-slate-900">{config.label}</p>
                    </div>
                    <div className="text-slate-300">
                      <ChevronRight size={18} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Processing & Result */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Cửa Sổ Xử Lý</h3>
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 min-h-[300px] flex flex-col items-center justify-center text-center space-y-6 shadow-2xl relative overflow-hidden">
              {/* Subtle background glow */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500 opacity-50" />
              
              <AnimatePresence mode="wait">
                {!gameState.playerChoice ? (
                  <motion.div 
                    key="empty"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="text-slate-500 flex flex-col items-center gap-2"
                  >
                    <Activity size={48} className="animate-pulse text-slate-700" />
                    <p className="text-xs font-bold uppercase tracking-[0.2em] mono-text">Đang chờ lệnh...</p>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="active"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="w-full space-y-6"
                  >
                    <div className="flex items-center justify-around relative">
                      {/* Connection lines */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-[1px] bg-slate-800 z-0" />
                      
                      <div className="flex flex-col items-center gap-2 z-10">
                        <motion.div 
                          animate={isProcessing ? { scale: [1, 1.1, 1] } : {}}
                          transition={{ repeat: Infinity, duration: 2 }}
                          className="w-14 h-14 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400 shadow-inner"
                        >
                          {(() => {
                            const Icon = ROLES_CONFIG[gameState.playerChoice!].icon;
                            return <Icon size={28} />;
                          })()}
                        </motion.div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tôi</span>
                      </div>

                      <div className="z-10 bg-slate-900 px-2">
                        {isProcessing ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            className="text-blue-500"
                          >
                            <Activity size={24} />
                          </motion.div>
                        ) : (
                          <div className="text-slate-700 font-black italic text-xl">VS</div>
                        )}
                      </div>

                      <div className="flex flex-col items-center gap-2 z-10">
                        <motion.div 
                          animate={isProcessing ? { opacity: [0.3, 1, 0.3] } : {}}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                          className="w-14 h-14 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500 shadow-inner"
                        >
                          {gameState.aiChoice ? (
                            (() => {
                              const Icon = ROLES_CONFIG[gameState.aiChoice!].icon;
                              return <Icon size={28} className="text-slate-300" />;
                            })()
                          ) : (
                            <div className="relative">
                              <Clock size={28} className="animate-spin text-blue-500/50" />
                              <motion.div 
                                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="absolute inset-0 flex items-center justify-center"
                              >
                                <Search size={16} className="text-blue-400" />
                              </motion.div>
                            </div>
                          )}
                        </motion.div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Máy</span>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-800 space-y-4">
                      {isProcessing && (
                        <div className="space-y-2">
                          <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ x: '-100%' }}
                              animate={{ x: '100%' }}
                              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                              className="w-1/2 h-full bg-blue-500"
                            />
                          </div>
                          <div className="flex justify-between items-center px-1">
                            <motion.span 
                              animate={{ opacity: [0, 1, 0] }}
                              transition={{ repeat: Infinity, duration: 0.5 }}
                              className="text-[8px] mono-text text-blue-500/50"
                            >
                              TRUY_XUẤT_DỮ_LIỆU...
                            </motion.span>
                            <motion.span 
                              animate={{ opacity: [1, 0, 1] }}
                              transition={{ repeat: Infinity, duration: 0.8 }}
                              className="text-[8px] mono-text text-blue-500/50"
                            >
                              0x{Math.random().toString(16).slice(2, 6).toUpperCase()}
                            </motion.span>
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <h4 className={`text-2xl font-bold mb-2 tracking-tight ${
                          gameState.lastResult === 'win' ? 'text-emerald-400' : 
                          gameState.lastResult === 'lose' ? 'text-rose-400' : 
                          'text-blue-400'
                        }`}>
                          {gameState.message}
                        </h4>
                        <div className="flex items-center justify-center gap-2">
                          {gameState.lastResult === 'win' && <PartyPopper size={18} className="text-emerald-400" />}
                          {gameState.lastResult === 'lose' && <Frown size={18} className="text-rose-400" />}
                          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] mono-text">
                            {gameState.lastResult ? 'Lệnh đã thực thi' : 'Đang phân tích giao thức'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* History Log */}
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Nhật Ký Hệ Thống</span>
                <Trophy size={12} className="text-slate-400" />
              </div>
              <div className="divide-y divide-slate-100">
                {gameState.history.length === 0 ? (
                  <div className="p-4 text-center text-[10px] text-slate-400 italic">Chưa có dữ liệu giao dịch</div>
                ) : (
                  gameState.history.map((log) => (
                    <div key={log.id} className="p-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="text-[9px] mono-text text-slate-400">{log.id}</span>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] font-bold text-slate-700">{log.player}</span>
                          <span className="text-[8px] text-slate-300">vs</span>
                          <span className="text-[10px] font-bold text-slate-700">{log.ai}</span>
                        </div>
                      </div>
                      <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                        log.result === 'win' ? 'bg-emerald-50 text-emerald-600' :
                        log.result === 'lose' ? 'bg-rose-50 text-rose-600' :
                        'bg-blue-50 text-blue-600'
                      }`}>
                        {log.result === 'win' ? 'THẮNG' : log.result === 'lose' ? 'THUA' : 'HÒA'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Explanation Modal */}
      <AnimatePresence>
        {showExplanation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2 text-blue-600 font-bold">
                  <HelpCircle size={20} />
                  <span>QUY TẮC VẬN HÀNH</span>
                </div>
                <button 
                  onClick={() => setShowExplanation(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <User size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Sếp Tổng</p>
                      <p className="text-sm text-slate-600">Sa thải Nhân viên và mắng Thực tập sinh.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                      <Clock size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Deadline</p>
                      <p className="text-sm text-slate-600">Gây áp lực cho Sếp và đè bẹp Nhân viên.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <Briefcase size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Nhân viên</p>
                      <p className="text-sm text-slate-600">Dạy bảo Thực tập sinh và chiều lòng Khách hàng.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
                      <BookOpen size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Thực tập sinh</p>
                      <p className="text-sm text-slate-600">Làm rối Khách hàng và "vô tình" lờ đi Deadline.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                      <Users size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Khách hàng</p>
                      <p className="text-sm text-slate-600">Yêu cầu vô lý với Sếp và tạo ra Deadline mới.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button 
                  onClick={() => setShowExplanation(false)}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  ĐÃ HIỂU
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Corporate Footer */}
      <footer className="h-10 bg-slate-900 text-slate-500 flex items-center justify-between px-6 text-[10px] font-medium uppercase tracking-widest">
        <div className="flex items-center gap-6">
          <span>© 2026 CORPORATE PROTOCOL v1.0.4</span>
          <span className="text-slate-700">|</span>
          <span>Security: Level 4</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Connection Stable</span>
          <span>Terminal: 0x42A</span>
        </div>
      </footer>
    </div>
  );
}
