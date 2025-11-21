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
  <div className="flex items-center select-none shadow-sm scale-90 sm:scale-100 origin-left">
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
        <label className="text-gray-700 font-medium text-sm">{label}</label>
        <div className="flex items-center gap-1">
            {prefix && <span className={`text-base font-bold ${textColorClass}`}>{prefix}</span>}
            <input 
                type="number" 
                value={value}
                onChange={handleInputChange}
                min={min}
                max={max}
                className={`text-base font-bold ${textColorClass} w-20 text-right bg-transparent border-b border-gray-300 focus:border-[#003366] focus:outline-none transition-colors`}
            />
            {unit && <span className={`text-base font-bold ${textColorClass}`}>{unit}</span>}
        </div>
      </div>
      
      <div className="relative h-6 flex items-center">
        {/* Track */}
        <div className="w-full h-1.5 bg-gray-200 rounded-lg relative overflow-hidden pointer-events-none">
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
          className="absolute h-4 w-4 bg-white border-2 rounded-full shadow-md pointer-events-none z-20 transition-transform group-hover:scale-110"
          style={{ 
            left: `calc(${safePercentage}% - 8px)`,
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
  const MAX_MINUTES = 180;
  const percentage = ((value - 1) / (MAX_MINUTES - 1)) * 100;
  const safePercentage = Math.min(100, Math.max(0, percentage));

  const markers = [
    { val: 5, label: '5m', color: 'bg-green-500' },
    { val: 30, label: '30m', color: 'bg-yellow-500' },
    { val: 60, label: '1h', color: 'bg-orange-500' },
    { val: 180, label: '3h', color: 'bg-red-500' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = Number(e.target.value);
    if (val > MAX_MINUTES) val = MAX_MINUTES;
    onChange(val);
  };

  return (
    <div className="mb-6 group">
      <div className="flex justify-between items-center mb-2">
        <label className="text-gray-700 font-medium text-sm">Tempo médio de resposta</label>
        <div className="flex flex-col items-end">
            <div className="flex items-center gap-1">
                <input 
                    type="number" 
                    value={value}
                    onChange={handleInputChange}
                    min={1}
                    max={MAX_MINUTES}
                    className="text-base font-bold text-[#003366] w-16 text-right bg-transparent border-b border-gray-300 focus:border-[#003366] focus:outline-none"
                />
                <span className="text-base font-bold text-[#003366]">min</span>
            </div>
            <span className="text-[10px] text-gray-500 font-medium mt-0.5">{formatTime(value)}</span>
        </div>
      </div>
      
      <div className="relative h-10">
        <div className="absolute top-1/2 left-0 w-full transform -translate-y-1/2 h-2.5 bg-gray-200 rounded-lg overflow-hidden pointer-events-none">
          {/* Zones */}
          <div className="absolute h-full w-full flex opacity-30">
             {/* 0-5m: Green */}
             <div className="h-full bg-green-500" style={{ width: `${(5/MAX_MINUTES)*100}%` }}></div>
             {/* 5-30m: Yellow (30-5 = 25) */}
             <div className="h-full bg-yellow-400" style={{ width: `${(25/MAX_MINUTES)*100}%` }}></div>
             {/* 30-60m: Orange (60-30 = 30) */}
             <div className="h-full bg-orange-500" style={{ width: `${(30/MAX_MINUTES)*100}%` }}></div>
             {/* 60-180m: Red (Remainder) */}
             <div className="h-full bg-red-500 flex-grow"></div>
          </div>
          
          {/* Fill */}
          <div 
            className="absolute h-full bg-[#003366] opacity-80" 
            style={{ width: `${safePercentage}%` }}
          ></div>
        </div>

        {markers.map((m) => (
          <div key={m.label} className="absolute top-6 flex flex-col items-center transform -translate-x-1/2 pointer-events-none" style={{ left: `${(m.val / MAX_MINUTES) * 100}%` }}>
            <div className={`w-0.5 h-1.5 ${m.color} mb-0.5 rounded-sm`}></div>
            <span className="text-[9px] text-gray-500 font-semibold">{m.label}</span>
          </div>
        ))}

        <input 
          type="range" 
          min={1} 
          max={MAX_MINUTES} 
          step={1} 
          value={value} 
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute w-full h-full opacity-0 cursor-pointer z-30 top-0 left-0 appearance-none m-0 p-0"
        />
        
        <div 
          className="absolute h-5 w-5 bg-white border-2 border-[#003366] rounded-full shadow-lg pointer-events-none z-20 transition-transform hover:scale-110"
          style={{ 
              left: `calc(${safePercentage}% - 10px)`,
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
  const [responseTime, setResponseTime] = useState(60); // Default changed to 60m

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
    // 1. Calculate Factor (Sigmoid Logic - KEPT INTACT)
    const k = 2.5;
    const midpoint = 1.78; 
    const timeLog = Math.log10(responseTime + 1);
    const responseTimeLossFactor = 1 / (1 + Math.exp(-k * (timeLog - midpoint)));

    // 2. Determine Status (Visual Logic - CHANGED)
    let responseStatus: CalculationResult['responseStatus'];
    if (responseTime <= 5) {
      responseStatus = 'EXCELLENT';
    } else if (responseTime <= 30) {
      responseStatus = 'GOOD';
    } else if (responseTime <= 60) {
      responseStatus = 'WARNING';
    } else {
      responseStatus = 'CRITICAL';
    }

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
      case 'WARNING': return 'bg-orange-500';
      case 'IMPROVE': return 'bg-yellow-500'; // Legacy fallback
      case 'GOOD': return 'bg-yellow-500';
      case 'ADEQUATE': return 'bg-emerald-700';
      case 'EXCELLENT': return 'bg-emerald-700';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'CRITICAL': return 'CRÍTICO';
      case 'WARNING': return 'RUIM';
      case 'IMPROVE': return 'MELHORAR';
      case 'GOOD': return 'ATENÇÃO';
      case 'ADEQUATE': return 'ADEQUADO';
      case 'EXCELLENT': return 'ÓTIMO';
      default: return '';
    }
  };

  const handleReset = () => {
    setLeads(100);
    setConversion(10);
    setTicket(5000);
    setFollowUps(3);
    setResponseTime(60);
  };

  return (
    <div className="min-h-screen lg:h-screen flex flex-col bg-gray-50 text-gray-800 font-sans overflow-x-hidden">
      {/* Navbar */}
      <header className="bg-white shadow-sm border-b border-gray-100 shrink-0 z-50 h-16 lg:h-14 flex items-center">
        <div className="w-full max-w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo />
            <span className="hidden sm:block text-gray-300 text-2xl font-light">|</span>
            <h1 className="hidden sm:block text-sm lg:text-base font-medium text-gray-600 tracking-tight">Diagnóstico Comercial</h1>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleReset}
              className="flex items-center gap-2 text-xs lg:text-sm text-gray-500 hover:text-[#003366] transition-colors font-medium"
            >
              <RotateCcw size={14} /> Resetar
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout - Responsive Split */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* LEFT COLUMN: INPUTS (Fixed Sidebar on Desktop) */}
        <div className="w-full lg:w-80 lg:shrink-0 bg-white border-r border-gray-100 overflow-y-auto custom-scrollbar p-6 lg:pb-24 z-10">
          <h2 className="text-lg font-bold text-[#003366] mb-6 flex items-center gap-2">
            <div className="bg-blue-50 p-1.5 rounded-lg">
                <Calculator className="text-[#003366]" size={16} />
            </div>
            Parâmetros
          </h2>

          <div className="space-y-6">
            <SliderInput 
              label="Leads recebidos/mês"
              value={leads}
              onChange={setLeads}
              min={10}
              max={5000}
              step={10}
              highlightColor="blue"
            />
            <SliderInput 
              label="Taxa de conversão"
              value={conversion}
              onChange={setConversion}
              min={0}
              max={100}
              step={0.5}
              unit="%"
              highlightColor="blue"
            />
            <SliderInput 
              label="Ticket médio"
              value={ticket}
              onChange={setTicket}
              min={50}
              max={50000}
              step={50}
              prefix="R$ "
              highlightColor="blue"
            />
            
            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Eficiência Operacional</h3>
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

        {/* RIGHT COLUMN: RESULTS (Dashboard) */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 pb-32 lg:p-8 lg:pb-24 bg-gray-50/50">
          <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8">
            
            {/* ROW 1: CURRENT DIAGNOSIS */}
            <div className="bg-gradient-to-r from-[#003366] to-[#002244] rounded-xl shadow-sm p-6 lg:p-8 text-white relative overflow-hidden">
              <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-[#004488] to-transparent opacity-30"></div>
              
              <div className="flex flex-wrap items-center justify-between gap-6 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                    <TrendingUp size={24} className="text-blue-200" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Diagnóstico Atual</h2>
                    <p className="text-blue-200 text-sm">Visão geral da sua performance</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-8 lg:gap-12">
                  <div>
                    <p className="text-blue-300 text-xs uppercase tracking-wider font-medium mb-1">Faturamento/mês</p>
                    <p className="text-3xl lg:text-4xl font-bold tracking-tight">{formatCurrency(result.currentRevenue)}</p>
                  </div>
                  <div className="hidden sm:block w-px h-12 bg-white/10"></div>
                  <div>
                     <p className="text-blue-300 text-xs uppercase tracking-wider font-medium mb-1">Vendas/mês</p>
                     <p className="text-3xl lg:text-4xl font-bold tracking-tight">{result.currentSales.toFixed(1)}</p>
                  </div>
                  <div className="hidden sm:block w-px h-12 bg-white/10"></div>
                  <div className="bg-white/10 rounded-xl px-5 py-2 backdrop-blur-sm border border-white/10">
                    <p className="text-blue-200 text-xs uppercase tracking-wider font-bold mb-0.5">Projeção Anual</p>
                    <p className="text-xl lg:text-2xl font-bold text-white">{formatCurrency(result.annualRevenue)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ROW 2: LOSS ANALYSIS GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Follow-up Card */}
              <div className={`${getStatusColor(result.followUpStatus)} rounded-xl shadow-sm p-6 text-white relative overflow-hidden border-t-4 border-white/20 flex flex-col min-h-[200px]`}>
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                     <div className="bg-black/20 p-2 rounded-lg backdrop-blur-md">
                        <Phone size={20} />
                     </div>
                     <h3 className="text-xl font-bold">Follow-up</h3>
                  </div>
                  <div className="flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
                     <span className="text-xs font-bold tracking-wider">{getStatusLabel(result.followUpStatus)}</span>
                     {result.followUpStatus === 'ADEQUATE' && <CheckCircle2 size={14} className="text-emerald-300" />}
                  </div>
                </div>

                <p className="text-white/90 text-sm mb-6 leading-relaxed flex-grow">
                  {result.followUpStatus === 'ADEQUATE' 
                    ? 'Excelente! Você mantém um volume de tentativas que garante a máxima recuperação de leads.' 
                    : `Você realiza apenas ${followUps} tentativas. O ideal para maximizar a conversão é acima de 7.`}
                </p>

                <div className="bg-black/10 rounded-lg p-4">
                   <div className="flex justify-between items-end border-b border-white/10 pb-2 mb-2">
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
              <div className={`${getStatusColor(result.responseStatus)} rounded-xl shadow-sm p-6 text-white relative overflow-hidden border-t-4 border-white/20 flex flex-col min-h-[200px]`}>
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                     <div className="bg-black/20 p-2 rounded-lg backdrop-blur-md">
                        <Clock size={20} />
                     </div>
                     <h3 className="text-xl font-bold">Tempo Resposta</h3>
                  </div>
                  <div className="flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
                     <span className="text-xs font-bold tracking-wider">{getStatusLabel(result.responseStatus)}</span>
                     {['GOOD', 'EXCELLENT'].includes(result.responseStatus) && <CheckCircle2 size={14} className="text-emerald-300" />}
                  </div>
                </div>

                <p className="text-white/90 text-sm mb-6 leading-relaxed flex-grow">
                  {result.responseStatus === 'EXCELLENT'
                    ? 'Velocidade de atendimento excelente! Continue assim.' 
                    : result.responseStatus === 'GOOD'
                    ? `Tempo atual: ${formatTime(responseTime)}. Ainda pode melhorar.`
                    : `Tempo atual: ${formatTime(responseTime)}. O ideal é ≤ 5 min.`}
                </p>

                <div className="bg-black/10 rounded-lg p-4">
                   <div className="flex justify-between items-end border-b border-white/10 pb-2 mb-2">
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

            {/* ROW 3: IMPACT SUMMARY BANNER */}
            <div className={`${result.totalLossAnnual > 0 ? 'bg-gradient-to-br from-red-900 via-red-800 to-red-900' : 'bg-gradient-to-br from-[#003366] to-[#004488]'} rounded-xl shadow-lg p-6 lg:p-8 text-white relative overflow-hidden`}>
               {result.totalLossAnnual > 0 && (
                  <div className="absolute -right-10 -top-10 w-64 h-64 bg-red-500 rounded-full opacity-20 blur-3xl"></div>
               )}
               
               <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
                  <div className="flex-1 text-center lg:text-left">
                    <h2 className="text-2xl font-bold mb-2 flex items-center justify-center lg:justify-start gap-3">
                       {result.totalLossAnnual > 0 ? <AlertTriangle className="text-red-400" size={28} /> : <CheckCircle2 className="text-emerald-400" size={28} />}
                       {result.totalLossAnnual > 0 ? 'Impacto Financeiro Total' : 'Operação Otimizada'}
                    </h2>
                    <p className="text-white/80 text-sm lg:text-base max-w-xl">
                      {result.totalLossAnnual > 0 
                        ? 'Este é o montante estimado que sua empresa deixa de ganhar anualmente devido a falhas no processo de atendimento.'
                        : 'Sua operação comercial está atingindo o máximo potencial de eficiência nas métricas analisadas.'}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-8 bg-black/20 p-4 rounded-xl backdrop-blur-md border border-white/10">
                     <div className="text-center">
                        <p className="text-xs text-white/70 uppercase tracking-wider mb-1">Eficiência Comercial</p>
                        <div className="flex items-baseline justify-center gap-1">
                          <span className={`text-3xl font-bold ${result.efficiency < 70 ? 'text-red-400' : 'text-emerald-400'}`}>
                            {result.efficiency.toFixed(0)}%
                          </span>
                        </div>
                        <div className="w-32 h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
                           <div 
                             className={`h-full rounded-full ${result.efficiency < 70 ? 'bg-red-500' : 'bg-emerald-500'}`} 
                             style={{ width: `${result.efficiency}%` }}
                           ></div>
                        </div>
                     </div>
                     
                     {result.totalLossAnnual > 0 && (
                       <>
                         <div className="hidden sm:block w-px h-16 bg-white/20"></div>
                         <div className="text-center">
                            <p className="text-xs text-red-200 uppercase tracking-wider mb-1">Desperdício Anual</p>
                            <p className="text-3xl lg:text-4xl font-black text-white tracking-tight">{formatCurrency(result.totalLossAnnual)}</p>
                         </div>
                       </>
                     )}
                  </div>
               </div>
            </div>

            {/* ROW 4: CHARTS */}
            {result.totalLossAnnual > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-[300px]">
                <h3 className="text-[#003366] font-bold mb-4 flex items-center gap-2">
                  <BarChart3 size={20} className="text-[#FF6600]" /> Potencial de Vendas
                </h3>
                <div className="flex-grow w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={barData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false}
                        tick={{fontSize: 11, fill: '#6b7280', fontWeight: 500}}
                        dy={10}
                      />
                      <YAxis hide />
                      <Tooltip 
                        cursor={{fill: '#f9fafb'}}
                        formatter={(value: number) => [formatCurrency(value), 'Receita']}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={50}>
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

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-[300px]">
                <h3 className="text-[#003366] font-bold mb-4 flex items-center gap-2">
                   <PieChartIcon size={20} className="text-[#FF6600]" /> Composição da Perda
                </h3>
                <div className="flex-grow w-full relative">
                   <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                         formatter={(value: number) => formatCurrency(value)}
                         contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
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
            
            {/* ROW 4: MARKET DATA */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 pb-4">
              <a 
                href="https://www.marketingdonut.co.uk/sales/sales-strategy/why-you-must-follow-up-leads" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:border-[#003366]/30 transition-all group block h-full"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-blue-50 text-[#003366] p-1.5 rounded group-hover:bg-[#003366] group-hover:text-white transition-colors">
                      <Phone size={14} />
                  </div>
                  <span className="text-xs font-bold text-gray-400 uppercase">Marketing Donut</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  <span className="font-bold text-gray-900">80% das vendas B2B</span> requerem 5 ou mais follow-ups para serem fechadas.
                </p>
              </a>

              <a 
                href="https://cdn2.hubspot.net/hub/25649/file-13535879-pdf/docs/mit_study.pdf?utm_source=chatgpt.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:border-[#003366]/30 transition-all group block h-full"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-emerald-50 text-emerald-600 p-1.5 rounded group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <Clock size={14} />
                  </div>
                   <span className="text-xs font-bold text-gray-400 uppercase">MIT Study</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Responder em <span className="font-bold text-gray-900">5 minutos</span> aumenta as chances de contato em <span className="font-bold text-gray-900">9x</span>.
                </p>
              </a>

              <a 
                href="https://blog.hubspot.com/blog/tabid/6307/bid/30901/30-thought-provoking-lead-nurturing-stats-you-can-t-ignore.aspx?utm_source=chatgpt.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:border-[#003366]/30 transition-all group block h-full"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-purple-50 text-purple-600 p-1.5 rounded group-hover:bg-purple-600 group-hover:text-white transition-colors">
                      <TrendingUp size={14} />
                  </div>
                  <span className="text-xs font-bold text-gray-400 uppercase">HubSpot</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  <span className="font-bold text-gray-900">35–50%</span> das vendas vão para o fornecedor que responde primeiro.
                </p>
              </a>
            </div>

          </div>
        </div>
      </main>

      {/* Sticky Footer Message */}
      <div className={`fixed bottom-0 left-0 w-full transition-colors duration-500 ${result.totalLossAnnual > 0 ? 'bg-gray-900' : 'bg-[#003366]'} text-white py-3 lg:py-0 lg:h-16 shadow-2xl z-40 border-t border-white/10 flex items-center`}>
        <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
           <div className="flex items-center gap-3 justify-center sm:justify-start">
             {result.totalLossAnnual > 0 ? (
               <>
                 <div className="bg-red-500/20 p-1.5 rounded-full animate-pulse hidden sm:block">
                    <AlertTriangle size={16} className="text-red-400" />
                 </div>
                 <p className="font-medium text-xs sm:text-sm">A cada mês, <span className="text-red-400 font-bold">{formatCurrency(result.totalLossRevenue)}</span> são deixados na mesa.</p>
               </>
             ) : (
               <>
                 <div className="bg-emerald-500/20 p-1.5 rounded-full hidden sm:block">
                    <CheckCircle2 size={16} className="text-emerald-400" />
                 </div>
                 <p className="font-medium text-xs sm:text-sm">Parabéns! Sua operação comercial está otimizada.</p>
               </>
             )}
           </div>
           <button className="bg-[#FF6600] hover:bg-[#e65c00] text-white px-6 py-2 rounded-lg font-bold text-xs sm:text-sm transition-all shadow-lg hover:shadow-orange-500/20 transform hover:-translate-y-0.5">
             Falar com um especialista
           </button>
        </div>
      </div>

    </div>
  );
};

export default App;
