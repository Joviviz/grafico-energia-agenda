import React, { useState, useEffect, useRef } from 'react';
import { Download, RefreshCw, Battery, BatteryCharging, BatteryLow, Moon, Sun, Save, Upload } from 'lucide-react';

const App = () => {
  // Generate 30-min intervals
  const generateInitialData = () => {
    const data = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 30) {
        const hour = h.toString().padStart(2, '0');
        const minute = m.toString().padStart(2, '0');
        const time = `${hour}:${minute}`;
        
        // Default crude circadian rhythm approximation
        let level = 3; // Sleep
        if (h >= 6 && h < 9) level = 7; // Waking up
        if (h >= 9 && h < 12) level = 9; // Peak morning
        if (h >= 12 && h < 14) level = 5; // Lunch dip
        if (h >= 14 && h < 18) level = 8; // Afternoon focus
        if (h >= 18 && h < 22) level = 5; // Evening wind down
        if (h >= 22) level = 2; // Pre-sleep

        data.push({ time, level });
      }
    }
    return data;
  };

  const [schedule, setSchedule] = useState(generateInitialData());
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const fileInputRef = useRef(null);

  const handleLevelChange = (index, newLevel) => {
    const newSchedule = [...schedule];
    newSchedule[index].level = parseInt(newLevel);
    setSchedule(newSchedule);
  };

  const resetData = () => {
    if (confirm("Tem certeza que deseja resetar para o padrão?")) {
      setSchedule(generateInitialData());
    }
  };

  const downloadCSV = () => {
    const header = "Horario,Nivel_Energia(1-10)\n";
    const rows = schedule.map(row => `${row.time},${row.level}`).join("\n");
    const csvContent = "data:text/csv;charset=utf-8," + encodeURI(header + rows);
    
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", "minha_agenda_energia.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const lines = text.split('\n');
        
        const newSchedule = lines
          .map(line => line.trim())
          .filter(line => line.length > 0)
          .filter(line => !line.toLowerCase().startsWith('horario')) // Skip header check
          .map(line => {
            const parts = line.split(',');
            // CSV structure: time, level
            if (parts.length < 2) return null;
            
            const time = parts[0].trim();
            const level = parseInt(parts[1]);
            
            if (!time || isNaN(level)) return null;

            return { 
              time: time, 
              level: Math.min(10, Math.max(1, level)) // Ensure 1-10
            };
          })
          .filter(item => item !== null); // Remove invalid lines

        if (newSchedule.length > 0) {
          setSchedule(newSchedule);
        } else {
          alert("Não foi possível ler dados válidos do arquivo CSV. Verifique se o formato está correto (00:00, 5).");
        }
      } catch (error) {
        console.error("Erro ao processar CSV:", error);
        alert("Erro ao processar o arquivo.");
      }
    };
    reader.readAsText(file);
    // Reset input to allow selecting the same file again if needed
    event.target.value = '';
  };

  const triggerFileUpload = () => {
    fileInputRef.current.click();
  };

  // Helper to get color based on energy level
  const getColor = (level) => {
    if (level <= 3) return 'bg-indigo-900 text-indigo-200'; // Sleep/Low
    if (level <= 6) return 'bg-blue-500 text-white'; // Medium
    if (level <= 8) return 'bg-orange-400 text-white'; // High
    return 'bg-red-500 text-white'; // Peak
  };

  const getBarHeight = (level) => {
    return `${(level / 10) * 100}%`;
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
              <BatteryCharging className="text-green-600" />
              Gestão de Blocos de Energia
            </h1>

          </div>
          
          <div className="flex gap-2">
            {/* Hidden Input for File Upload */}
            <input 
              type="file" 
              accept=".csv" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              className="hidden" 
            />

            <button 
              onClick={triggerFileUpload}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 text-slate-700 transition-colors text-sm font-medium"
            >
              <Upload size={16} />
              Importar CSV
            </button>

            <button 
              onClick={resetData}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 text-slate-700 transition-colors text-sm font-medium"
            >
              <RefreshCw size={16} />
              Resetar
            </button>
            <button 
              onClick={downloadCSV}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium shadow-sm"
            >
              <Download size={16} />
              Baixar CSV
            </button>
          </div>
        </header>

        {/* Main Visualization Graph */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-lg font-semibold text-slate-700">Mapa de Energia Diária</h2>
            <div className="flex gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1"><div className="w-3 h-3 bg-indigo-900 rounded-full"></div> Descanso (1-3)</span>
              <span className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500 rounded-full"></div> Manutenção (4-6)</span>
              <span className="flex items-center gap-1"><div className="w-3 h-3 bg-orange-400 rounded-full"></div> Foco (7-8)</span>
              <span className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500 rounded-full"></div> Pico (9-10)</span>
            </div>
          </div>

          {/* The Bar Chart */}
          <div className="relative h-48 flex items-end gap-[2px] border-b border-slate-300 pb-1">
            {schedule.map((slot, index) => (
              <div 
                key={index}
                className="group relative flex-1 flex flex-col justify-end h-full"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div 
                  className={`w-full rounded-t-sm transition-all duration-300 ${getColor(slot.level).split(' ')[0]} opacity-80 group-hover:opacity-100`}
                  style={{ height: getBarHeight(slot.level) }}
                ></div>
                
                {/* Tooltip on hover */}
                {hoveredIndex === index && (
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-10 bg-slate-800 text-white text-xs py-1 px-2 rounded shadow-lg whitespace-nowrap">
                    {slot.time} - Nível: {slot.level}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-slate-400 mt-2 px-1">
            <span>00:00</span>
            <span>06:00</span>
            <span>12:00</span>
            <span>18:00</span>
            <span>23:30</span>
          </div>
        </div>

        {/* Editor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {schedule.map((slot, index) => (
            <div 
              key={index} 
              className={`p-3 rounded-lg border ${hoveredIndex === index ? 'border-blue-400 ring-1 ring-blue-400' : 'border-slate-200'} bg-white flex items-center gap-3 transition-all`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="font-mono text-sm font-bold text-slate-600 w-12 shrink-0">
                {slot.time}
              </div>
              
              <div className="flex-1">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={slot.level}
                  onChange={(e) => handleLevelChange(index, e.target.value)}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                />
              </div>

              <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-xs font-bold ${getColor(slot.level)}`}>
                {slot.level}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default App;