import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calculator, 
  Clock, 
  Phone, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  DollarSign, 
  BarChart3, 
  PieChart as PieChartIcon,
  RotateCcw,
  Building2,
  ExternalLink
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LabelList
} from 'recharts';

// --- Constants & Identity ---
const BRAND = {
  BLUE: '#003366',      // Deep Royal Blue
  BLUE_DARK: '#002244', // Darker shade for gradients
  ORANGE: '#FF6600',    // Vibrant Orange
  ORANGE_LIGHT: '#FF8533',
  GRAY_BG: '#f3f4f6',
};

// --- Types & Interfaces ---

interface CalculationResult {
  currentSales: number;
  currentRevenue: number;
  annualRevenue: number;
  
  followUpStatus: 'CRITICAL' | 'WARNING' | 'ADEQUATE';
  followUpLossSales: number;
  followUpLossRevenue: number;
  followUpLossAnnual: number;
  followUpFactor: number;
  
  responseStatus: 'CRITICAL' | 'WARNING' | 'IMPROVE' | 'GOOD' | 'EXCELLENT';
  responseLossSales: number;
  responseLossRevenue: number;
  responseLossAnnual: number;
  responseFactor: number;
  
  totalLossSales: number;
  totalLossRevenue: number;
  totalLossAnnual: number;
  efficiency: number;
}

// --- Utils ---

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value);
};

const formatTime = (minutes: number) => {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
};

// --- Components ---

const Logo = () => (
  <div className="flex items-center select-none shadow-sm">
    <div className="h-10 px-4 flex items-center rounded-l-lg bg-[#003366]">
      <span className="text-white font-bold text-2xl tracking-tighter pb-1 font-sans leading-none">abil</span>
    </div>
    <div className="h-10 px-3 flex items-center rounded-r-lg bg-[#FF6600]">
      <span className="text-white font-bold text-lg font-sans leading-none">CRM</span>
    </div>
  </div>
);

const SliderInput = ({ 
  label, 
  value, 
  onChange, 
  min, 
  max, 
  step, 
  unit = '', 
  prefix = '', 
  highlightColor = 'blue' 
}: {
  label: string;
  value: number;
  onChange: (val: number) => void;
  min: number;
  max: number;
  step: number;
  unit?: string;
  prefix?: string;
  highlightColor?: 'blue' | 'orange';
}) => {
  const percentage = ((value - min) / (max - min)) * 100;
  const safePercentage = Math.min(100, Math.max(0, percentage));
  
  // Dynamic styles based on brand colors
  const activeColor = highlightColor === 'orange' ? BRAND.ORANGE : BRAND.BLUE;
  const textColorClass = highlightColor === 'orange' ? 'text-[#FF6600]' : 'text-[#003366]';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = Number(e.target.value);
    if (val > max) val = max;
    onChange(val);
  };

  return (
    <div className="mb-6 group">
      <div className="flex justify-between items-center mb-2">
        <label className="text-gray-700 font-medium text-sm sm:text-base">{label}</label>
        <div className="flex items-center gap-1">
            {prefix && <span className={`text-lg font-bold ${textColorClass}`}>{prefix}</span>}
            <input 
                type="number" 
                value={value}
                onChange={handleInputChange}
                min={min}
                max={max}
                className={`text-lg font-bold ${textColorClass} w-24 text-right bg-transparent border-b border-gray-300 focus:border-[#003366] focus:outline-none transition-colors`}
            />
            {unit && <span className={`text-lg font-bold ${textColorClass}`}>{unit}</span>}
        </div>
      </div>
      
      <div className="relative h-8 flex items-center">
        {/* Track */}
        <div className="w-full h-2 bg-gray-200 rounded-lg relative overflow-hidden pointer-events-none">
          <div 
            className="absolute h-full rounded-lg" 
            style={{ width: `${safePercentage}%`, backgroundColor: activeColor }}
          ></div>
        </div>
        
        <input 
          type="range" 
          min={min} 
          max={max} 
          step={step} 
          value={value} 
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute w-full h-full opacity-0 cursor-pointer z-30 top-0 left-0 appearance-none m-0 p-0"
        />
        
        {/* Thumb */}
        <div 
          className="absolute h-5 w-5 bg-white border-2 rounded-full shadow-md pointer-events-none z-20 transition-transform group-hover:scale-110"
          style={{ 
            left: `calc(${safePercentage}% - 10px)`,
            borderColor: activeColor 
          }}
        ></div>
      </div>
    </div>
  );
};

const TimeSliderInput = ({ 
  value, 
  onChange 
}: {
  value: number;
  onChange: (val: number) => void;
}) => {
  const percentage = ((value - 1) / (1440 - 1)) * 100;
  const safePercentage = Math.min(100, Math.max(0, percentage));

  const markers = [
    { val: 5, label: '5m', color: 'bg-emerald-500' },
    { val: 60, label: '1h', color: 'bg-yellow-400' },
    { val: 300, label: '5h', color: 'bg-[#FF6600]' }, // Use brand orange
    { val: 1440, label: '24h', color: 'bg-red-500' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = Number(e.target.value);
    if (val > 1440) val = 1440;
    onChange(val);
  };

  return (
    <div className="mb-8 group">
      <div className="flex justify-between items-center mb-2">
        <label className="text-gray-700 font-medium text-sm sm:text-base">Tempo médio de resposta</label>
        <div className="flex flex-col items-end">
            <div className="flex items-center gap-1">
                <input 
                    type="number" 
                    value={value}
                    onChange={handleInputChange}
                    min={1}
                    max={1440}
                    className="text-lg font-bold text-[#003366] w-20 text-right bg-transparent border-b border-gray-300 focus:border-[#003366] focus:outline-none"
                />
                <span className="text-lg font-bold text-[#003366]">min</span>
            </div>
            <span className="text-xs text-gray-500 font-medium mt-1">{formatTime(value)}</span>
        </div>
      </div>
      
      <div className="relative h-10">
        <div className="absolute top-1/2 left-0 w-full transform -translate-y-1/2 h-3 bg-gray-200 rounded-lg overflow-hidden pointer-events-none">
          {/* Zones */}
          <div className="absolute h-full w-full flex opacity-30">
             <div className="h-full bg-emerald-500" style={{ width: `${(5/1440)*100}%` }}></div>
             <div className="h-full bg-emerald-300" style={{ width: `${(15/1440)*100}%` }}></div>
             <div className="h-full bg-yellow-400" style={{ width: `${(60/1440)*100}%` }}></div>
             <div className="h-full bg-[#FF6600]" style={{ width: `${(240/1440)*100}%` }}></div>
             <div className="h-full bg-red-500 flex-grow"></div>
          </div>
          
          {/* Fill */}
          <div 
            className="absolute h-full bg-[#003366] opacity-80" 
            style={{ width: `${safePercentage}%` }}
          ></div>
        </div>

        {markers.map((m) => (
          <div key={m.label} className="absolute top-7 flex flex-col items-center transform -translate-x-1/2 pointer-events-none" style={{ left: `${(m.val / 1440) * 100}%` }}>
            <div className={`w-1 h-2 ${m.color} mb-1 rounded-sm`}></div>
            <span className="text-[10px] text-gray-500 font-semibold">{m.label}</span>
          </div>
        ))}

        <input 
          type="range" 
          min={1} 
          max={1440} 
          step={1} 
          value={value} 
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute w-full h-full opacity-0 cursor-pointer z-30 top-0 left-0 appearance-none m-0 p-0"
        />
        
        <div 
          className="absolute h-6 w-6 bg-white border-2 border-[#003366] rounded-full shadow-lg pointer-events-none z-20 transition-transform hover:scale-110"
          style={{ 
              left: `calc(${safePercentage}% - 12px)`,
              top: '50%',
              transform: 'translateY(-50%)' 
          }}
        ></div>
      </div>
    </div>
  );
};

// --- Main App ---

const App: React.FC = () => {
  // --- State ---
  const [leads, setLeads] = useState(100);
  const [conversion, setConversion] = useState(10);
  const [ticket, setTicket] = useState(5000);
  const [followUps, setFollowUps] = useState(3);
  const [responseTime, setResponseTime] = useState(240);

  // --- Calculations ---
  const result: CalculationResult = useMemo(() => {
    const currentSales = leads * (conversion / 100);
    const currentRevenue = currentSales * ticket;
    const annualRevenue = currentRevenue * 12;
    
    const nonConvertedLeads = leads - currentSales;

    // Follow-up Logic
    const safeFollowUps = Math.min(followUps, 10); 
    const rawLossPercentage = 1 - (Math.log(safeFollowUps + 1) / Math.log(11));
    const followUpLossFactor = Math.max(0, rawLossPercentage);

    let followUpStatus: CalculationResult['followUpStatus'] = 'ADEQUATE';
    if (followUpLossFactor > 0.60) followUpStatus = 'CRITICAL'; 
    else if (followUpLossFactor >= 0.30) followUpStatus = 'WARNING'; 
    else followUpStatus = 'ADEQUATE'; 

    const maxFollowUpRecoverable = nonConvertedLeads * 0.50;
    const followUpRecoverableLeads = maxFollowUpRecoverable * followUpLossFactor;
    const followUpLossSales = followUpRecoverableLeads * 0.12;
    const followUpLossRevenue = followUpLossSales * ticket;

    // Response Time Logic
    const k = 2.5;
    const midpoint = 1.78; 
    const timeLog = Math.log10(responseTime + 1);
    const responseTimeLossFactor = 1 / (1 + Math.exp(-k * (timeLog - midpoint)));

    let responseStatus: CalculationResult['responseStatus'] = 'CRITICAL';
    if (responseTimeLossFactor < 0.15) responseStatus = 'EXCELLENT';
    else if (responseTimeLossFactor < 0.35) responseStatus = 'GOOD';
    else if (responseTimeLossFactor < 0.60) responseStatus = 'IMPROVE';
    else if (responseTimeLossFactor < 0.85) responseStatus = 'WARNING';
    else responseStatus = 'CRITICAL';

    const maxResponseRecoverable = nonConvertedLeads * 0.60;
    const responseRecoverableLeads = maxResponseRecoverable * responseTimeLossFactor;
    const responseLossSales = responseRecoverableLeads * 0.15;
    const responseLossRevenue = responseLossSales * ticket;

    // Totals
    const totalLossSales = followUpLossSales + responseLossSales;
    const totalLossRevenue = followUpLossRevenue + responseLossRevenue;
    
    const totalPotentialSales = currentSales + totalLossSales;
    const efficiency = totalPotentialSales > 0 ? (currentSales / totalPotentialSales) * 100 : 100;

    return {
      currentSales,
      currentRevenue,
      annualRevenue,
      
      followUpStatus,
      followUpLossSales,
      followUpLossRevenue,
      followUpLossAnnual: followUpLossRevenue * 12,
      followUpFactor: followUpLossFactor,

      responseStatus,
      responseLossSales,
      responseLossRevenue,
      responseLossAnnual: responseLossRevenue * 12,
      responseFactor: responseTimeLossFactor,

      totalLossSales,
      totalLossRevenue,
      totalLossAnnual: totalLossRevenue * 12,
      efficiency
    };
  }, [leads, conversion, ticket, followUps, responseTime]);

  // --- Chart Data ---
  const barData = [
    {
      name: 'Vendas Atuais',
      value: result.currentRevenue,
      fill: BRAND.BLUE, 
    },
    {
      name: 'Perda (Follow-up)',
      value: result.followUpLossRevenue,
      fill: BRAND.ORANGE_LIGHT, 
    },
    {
      name: 'Perda (Tempo)',
      value: result.responseLossRevenue,
      fill: BRAND.ORANGE, 
    },
  ];

  const pieData = [
    { name: 'Perda por Follow-up', value: result.followUpLossAnnual, color: BRAND.ORANGE_LIGHT },
    { name: 'Perda por Tempo', value: result.responseLossAnnual, color: BRAND.ORANGE },
  ].filter(d => d.value > 0);

  // --- Helpers for Styles ---
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CRITICAL': return 'bg-red-600';
      case 'WARNING': return 'bg-[#FF6600]'; // Brand Orange
      case 'IMPROVE': return 'bg-yellow-500';
      case 'GOOD': return 'bg-emerald-500';
      case 'ADEQUATE':
      case 'EXCELLENT': return 'bg-[#003366]'; // Brand Blue
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'CRITICAL': return 'CRÍTICO';
      case 'WARNING': return 'ATENÇÃO';
      case 'IMPROVE': return 'MELHORAR';
      case 'GOOD': return 'BOM';
      case 'ADEQUATE': return 'ADEQUADO';
      case 'EXCELLENT': return 'EXCELENTE';
      default: return '';
    }
  };

  const handleReset = () => {
    setLeads(100);
    setConversion(10);
    setTicket(5000);
    setFollowUps(3);
    setResponseTime(240);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans pb-20">
      {/* Navbar */}
      <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo />
            <span className="hidden sm:block text-gray-300 text-2xl font-light">|</span>
            <h1 className="hidden sm:block text-lg font-medium text-gray-600 tracking-tight">Diagnóstico Comercial</h1>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleReset}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#003366] transition-colors font-medium"
            >
              <RotateCcw size={16} /> Resetar
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: INPUTS */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sticky top-28">
              <h2 className="text-xl font-bold text-[#003366] mb-8 flex items-center gap-3">
                <div className="bg-blue-50 p-2 rounded-lg">
                   <Calculator className="text-[#003366]" size={20} />
                </div>
                Parâmetros
              </h2>

              <div className="space-y-8">
                <SliderInput 
                  label="Leads recebidos por mês"
                  value={leads}
                  onChange={setLeads}
                  min={10}
                  max={5000}
                  step={10}
                  highlightColor="blue"
                />
                <SliderInput 
                  label="Taxa de conversão atual"
                  value={conversion}
                  onChange={setConversion}
                  min={0}
                  max={100}
                  step={0.5}
                  unit="%"
                  highlightColor="blue"
                />
                <SliderInput 
                  label="Ticket médio por venda"
                  value={ticket}
                  onChange={setTicket}
                  min={50}
                  max={50000}
                  step={50}
                  prefix="R$ "
                  highlightColor="blue"
                />
                
                <div className="border-t border-gray-100 pt-8">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Eficiência Operacional</h3>
                  <SliderInput 
                    label="Tentativas de follow-up"
                    value={followUps}
                    onChange={setFollowUps}
                    min={0}
                    max={10}
                    step={1}
                    highlightColor="orange"
                  />
                  <TimeSliderInput 
                    value={responseTime}
                    onChange={setResponseTime}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: RESULTS */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* SECTION 1: CURRENT DIAGNOSIS */}
            <div className="bg-gradient-to-br from-[#003366] to-[#002244] rounded-2xl shadow-lg p-8 text-white relative overflow-hidden">
              <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-[#004488] to-transparent opacity-30"></div>
              
              <h2 className="text-lg font-medium text-blue-100 mb-6 flex items-center gap-2 relative z-10">
                <TrendingUp size={20} /> Diagnóstico Atual
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
                <div>
                  <p className="text-blue-200 text-sm mb-1">Leads/mês</p>
                  <p className="text-3xl font-bold tracking-tight">{leads}</p>
                </div>
                <div>
                  <p className="text-blue-200 text-sm mb-1">Vendas/mês</p>
                  <p className="text-3xl font-bold tracking-tight">{result.currentSales.toFixed(1)}</p>
                </div>
                <div>
                  <p className="text-blue-200 text-sm mb-1">Faturamento mensal</p>
                  <p className="text-3xl font-bold tracking-tight">{formatCurrency(result.currentRevenue)}</p>
                </div>
                <div className="bg-white/10 rounded-xl p-3 -m-3 backdrop-blur-sm border border-white/10">
                  <p className="text-blue-200 text-xs uppercase tracking-wider mb-1">Projeção Anual</p>
                  <p className="text-xl font-bold text-white">{formatCurrency(result.annualRevenue)}</p>
                </div>
              </div>
            </div>

            {/* SECTION 2: LOSS ANALYSIS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Follow-up Card */}
              <div className={`${getStatusColor(result.followUpStatus)} rounded-2xl shadow-md p-6 text-white transition-all duration-500 ease-in-out relative overflow-hidden border-t-4 border-white/20`}>
                {result.followUpStatus === 'CRITICAL' && (
                   <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-white opacity-10 rounded-full animate-pulse"></div>
                )}
                
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
                     <Phone size={14} />
                     <span className="text-xs font-bold tracking-wider">{getStatusLabel(result.followUpStatus)}</span>
                  </div>
                  {result.followUpStatus === 'CRITICAL' && <AlertTriangle className="text-white/80" />}
                  {(result.followUpStatus === 'ADEQUATE') && <CheckCircle2 className="text-emerald-300" />}
                </div>

                <h3 className="text-xl font-bold mb-2">Processo de Follow-up</h3>
                <p className="text-white/80 text-sm mb-6 leading-relaxed">
                  {result.followUpStatus === 'ADEQUATE' 
                    ? 'Volume de tentativas adequado.' 
                    : `Você faz ${followUps} tentativas. O ideal são 7 ou mais.`}
                </p>

                <div className="bg-black/10 rounded-xl p-4 space-y-3 mb-4">
                   <div className="flex justify-between items-end border-b border-white/10 pb-2">
                      <span className="text-sm opacity-80">Vendas perdidas/mês</span>
                      <span className="font-bold text-lg">{result.followUpLossSales > 0 ? result.followUpLossSales.toFixed(1) : '0'}</span>
                   </div>
                   <div className="flex justify-between items-end">
                      <span className="text-sm opacity-80">Receita perdida/mês</span>
                      <span className="font-bold text-lg">{formatCurrency(result.followUpLossRevenue)}</span>
                   </div>
                </div>
              </div>

              {/* Response Time Card */}
              <div className={`${getStatusColor(result.responseStatus)} rounded-2xl shadow-md p-6 text-white transition-all duration-500 ease-in-out relative overflow-hidden border-t-4 border-white/20`}>
                 {result.responseStatus === 'CRITICAL' && (
                   <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-white opacity-10 rounded-full animate-pulse"></div>
                )}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
                     <Clock size={14} />
                     <span className="text-xs font-bold tracking-wider">{getStatusLabel(result.responseStatus)}</span>
                  </div>
                  {['CRITICAL', 'WARNING'].includes(result.responseStatus) && <AlertTriangle className="text-white/80" />}
                  {['GOOD', 'EXCELLENT'].includes(result.responseStatus) && <CheckCircle2 className="text-emerald-300" />}
                </div>

                <h3 className="text-xl font-bold mb-2">Tempo de Resposta</h3>
                <p className="text-white/80 text-sm mb-6 leading-relaxed">
                  {result.responseStatus === 'EXCELLENT' || result.responseStatus === 'GOOD'
                    ? 'Velocidade de atendimento competitiva.' 
                    : `Tempo atual: ${formatTime(responseTime)}. O ideal é < 5 min.`}
                </p>

                <div className="bg-black/10 rounded-xl p-4 space-y-3 mb-4">
                   <div className="flex justify-between items-end border-b border-white/10 pb-2">
                      <span className="text-sm opacity-80">Vendas perdidas/mês</span>
                      <span className="font-bold text-lg">{result.responseLossSales > 0 ? result.responseLossSales.toFixed(1) : '0'}</span>
                   </div>
                   <div className="flex justify-between items-end">
                      <span className="text-sm opacity-80">Receita perdida/mês</span>
                      <span className="font-bold text-lg">{formatCurrency(result.responseLossRevenue)}</span>
                   </div>
                </div>
              </div>
            </div>

            {/* SECTION 3: IMPACT SUMMARY */}
            <div className={`${result.totalLossAnnual > 0 ? 'bg-gradient-to-r from-red-900 to-red-800' : 'bg-gradient-to-r from-[#003366] to-[#004488]'} rounded-2xl shadow-xl p-8 text-white relative overflow-hidden`}>
              <div className="absolute -right-10 -top-10 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
              
              <div className="relative z-10">
                 {result.totalLossAnnual === 0 ? (
                   <div className="text-center py-8">
                     <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                        <CheckCircle2 size={40} className="text-emerald-300" />
                     </div>
                     <h2 className="text-3xl font-bold mb-3">Operação Otimizada!</h2>
                     <p className="text-blue-100 text-lg max-w-xl mx-auto">Sua eficiência operacional está em 100% baseada nos parâmetros do mercado.</p>
                   </div>
                 ) : (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                     <div>
                       <h2 className="text-lg font-medium text-red-200 mb-6 flex items-center gap-2">
                         <AlertTriangle size={20} /> IMPACTO FINANCEIRO
                       </h2>
                       <div className="space-y-6">
                         <div>
                           <div className="flex justify-between items-end mb-2">
                             <p className="text-sm text-red-200 uppercase tracking-wider">Eficiência da Operação</p>
                             <span className="font-bold text-xl">{result.efficiency.toFixed(0)}%</span>
                           </div>
                           <div className="w-full bg-black/20 h-3 rounded-full overflow-hidden backdrop-blur-sm">
                             <div className="bg-red-400 h-full shadow-[0_0_10px_rgba(248,113,113,0.5)]" style={{ width: `${result.efficiency}%` }}></div>
                           </div>
                         </div>
                         <div className="grid grid-cols-2 gap-6 border-t border-white/10 pt-6">
                            <div>
                               <p className="text-xs text-red-200 uppercase mb-1">Vendas perdidas/mês</p>
                               <p className="text-2xl font-bold">{result.totalLossSales.toFixed(1)}</p>
                            </div>
                            <div>
                               <p className="text-xs text-red-200 uppercase mb-1">Receita perdida/mês</p>
                               <p className="text-2xl font-bold">{formatCurrency(result.totalLossRevenue)}</p>
                            </div>
                         </div>
                       </div>
                     </div>
                     <div className="text-center md:text-right md:border-l border-white/10 md:pl-10 py-4">
                       <p className="text-red-200 text-lg mb-1">Potencial de receita anual</p>
                       <p className="text-red-300 text-sm mb-3">sendo desperdiçado</p>
                       <p className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-xl">
                         {formatCurrency(result.totalLossAnnual)}
                       </p>
                     </div>
                   </div>
                 )}
              </div>
            </div>

            {/* CHARTS SECTION */}
            {result.totalLossAnnual > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-[#003366] font-bold mb-6 flex items-center gap-2 text-lg">
                  <BarChart3 size={20} className="text-[#FF6600]" /> Potencial de Vendas
                </h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={barData}
                      margin={{ top: 20, right: 10, left: 10, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false}
                        tick={{fontSize: 11, fill: '#6b7280', fontWeight: 500}}
                        dy={10}
                        interval={0}
                      />
                      <YAxis hide />
                      <Tooltip 
                        cursor={{fill: '#f9fafb'}}
                        formatter={(value: number) => [formatCurrency(value), 'Receita']}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={50}>
                        <LabelList 
                          dataKey="value" 
                          position="top" 
                          formatter={(val: number) => formatCurrency(val)} 
                          style={{ fontSize: '11px', fontWeight: 'bold', fill: '#374151' }} 
                        />
                        {barData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-[#003366] font-bold mb-6 flex items-center gap-2 text-lg">
                   <PieChartIcon size={20} className="text-[#FF6600]" /> Composição da Perda
                </h3>
                <div className="h-64 w-full relative">
                   <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={85}
                        paddingAngle={4}
                        dataKey="value"
                        stroke="none"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                         formatter={(value: number) => formatCurrency(value)}
                         contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center Label */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                     <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Total</p>
                     <p className="text-sm font-bold text-gray-800">{formatCurrency(result.totalLossAnnual)}</p>
                  </div>
                </div>
                <div className="flex justify-center gap-6 mt-4">
                    {pieData.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs font-medium text-gray-600">
                            <div className="w-3 h-3 rounded-full" style={{backgroundColor: item.color}}></div>
                            {item.name}
                        </div>
                    ))}
                </div>
              </div>
            </div>
            )}
            
            {/* MARKET DATA REFERENCES */}
            <div className="mt-12 border-t border-gray-100 pt-10 pb-24">
              <h3 className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-8 flex items-center gap-2">
                <Building2 size={14} />
                Benchmarks de Mercado
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <a 
                  href="https://www.marketingdonut.co.uk/sales/sales-strategy/why-you-must-follow-up-leads" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-[#003366]/30 transition-all group flex flex-col h-full"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-blue-50 text-[#003366] p-2 rounded-lg group-hover:bg-[#003366] group-hover:text-white transition-colors">
                        <Phone size={18} />
                    </div>
                    <ExternalLink size={14} className="text-gray-300 group-hover:text-[#FF6600]" />
                  </div>
                  <p className="text-gray-600 text-sm flex-grow leading-relaxed">
                    <span className="font-bold text-gray-900">80% das vendas B2B</span> requerem 5 ou mais follow-ups para serem concretizadas.
                  </p>
                  <p className="text-xs text-gray-400 mt-4 font-medium">Marketing Donut</p>
                </a>

                <a 
                  href="https://cdn2.hubspot.net/hub/25649/file-13535879-pdf/docs/mit_study.pdf?utm_source=chatgpt.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-[#003366]/30 transition-all group flex flex-col h-full"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-emerald-50 text-emerald-600 p-2 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <Clock size={18} />
                    </div>
                    <ExternalLink size={14} className="text-gray-300 group-hover:text-[#FF6600]" />
                  </div>
                  <p className="text-gray-600 text-sm flex-grow leading-relaxed">
                    Responder em <span className="font-bold text-gray-900">5 minutos</span> aumenta as chances de contato e qualificação em até <span className="font-bold text-gray-900">9x</span>.
                  </p>
                  <p className="text-xs text-gray-400 mt-4 font-medium">MIT Study</p>
                </a>

                <a 
                  href="https://blog.hubspot.com/blog/tabid/6307/bid/30901/30-thought-provoking-lead-nurturing-stats-you-can-t-ignore.aspx?utm_source=chatgpt.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-[#003366]/30 transition-all group flex flex-col h-full"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-purple-50 text-purple-600 p-2 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-colors">
                        <TrendingUp size={18} />
                    </div>
                    <ExternalLink size={14} className="text-gray-300 group-hover:text-[#FF6600]" />
                  </div>
                  <p className="text-gray-600 text-sm flex-grow leading-relaxed">
                    <span className="font-bold text-gray-900">35–50% das vendas</span> são fechadas pelo fornecedor que responde primeiro ao lead.
                  </p>
                  <p className="text-xs text-gray-400 mt-4 font-medium">HubSpot</p>
                </a>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Sticky Footer Message */}
      <div className={`fixed bottom-0 left-0 w-full transition-colors duration-500 ${result.totalLossAnnual > 0 ? 'bg-gray-900' : 'bg-[#003366]'} text-white py-4 shadow-2xl z-40 border-t border-white/10`}>
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
           <div className="flex items-center gap-3 justify-center sm:justify-start">
             {result.totalLossAnnual > 0 ? (
               <>
                 <div className="bg-red-500/20 p-2 rounded-full animate-pulse">
                    <AlertTriangle size={20} className="text-red-400" />
                 </div>
                 <p className="font-medium text-sm sm:text-base">A cada mês, <span className="text-red-400 font-bold">{formatCurrency(result.totalLossRevenue)}</span> são deixados na mesa.</p>
               </>
             ) : (
               <>
                 <div className="bg-emerald-500/20 p-2 rounded-full">
                    <CheckCircle2 size={20} className="text-emerald-400" />
                 </div>
                 <p className="font-medium text-sm sm:text-base">Parabéns! Sua operação comercial está otimizada.</p>
               </>
             )}
           </div>
           <button className="bg-[#FF6600] hover:bg-[#e65c00] text-white px-8 py-2.5 rounded-lg font-bold text-sm transition-all shadow-lg hover:shadow-orange-500/20 transform hover:-translate-y-0.5">
             Falar com um especialista
           </button>
        </div>
      </div>

    </div>
  );
};

export default App;