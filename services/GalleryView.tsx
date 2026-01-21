import React, { useEffect, useState } from 'react';
import { Trash2, Copy, Calendar, Layers, Monitor, Maximize2, FlaskConical } from 'lucide-react';
import { GalleryItem, AspectRatio, ModelChoice } from '../types';
import { getGalleryItems, deleteGalleryItem } from '../services/storageService';
import { MODEL_LABELS, RATIO_LABELS } from '../constants';

interface GalleryViewProps {
  onCopyToast: (msg: string) => void;
  onNavigateToSample: (data: { prompt: string; aspectRatio: AspectRatio; modelChoice: ModelChoice }) => void;
}

const GalleryView: React.FC<GalleryViewProps> = ({ onCopyToast, onNavigateToSample }) => {
  const [items, setItems] = useState<GalleryItem[]>([]);

  const loadItems = () => {
    setItems(getGalleryItems());
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm('Hapus konsep ini dari gallery?')) {
      deleteGalleryItem(id);
      loadItems();
    }
  };

  const handleCopyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    onCopyToast("Prompt berhasil disalin!");
  };

  const openImage = (dataUrl: string) => {
    const win = window.open();
    if (win) {
        win.document.write(`<img src="${dataUrl}" style="width:100%; height:100%; object-fit:contain; background:#0f172a;" />`);
    }
  };

  const getAspectRatioClass = (ratio: AspectRatio) => {
    switch (ratio) {
      case AspectRatio.PORTRAIT: return 'aspect-[9/16]';
      case AspectRatio.LANDSCAPE: return 'aspect-[16/9]';
      case AspectRatio.PRINT_PORTRAIT: return 'aspect-[3/4]';
      case AspectRatio.PRINT_LANDSCAPE: return 'aspect-[4/3]';
      default: return 'aspect-square';
    }
  };

  // Wrapper h-full overflow-y-auto
  return (
    <div className="h-full overflow-y-auto pr-2 custom-scrollbar">
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-slate-300">
          <div className="w-20 h-20 bg-cyber-800/60 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 shadow-xl">
            <Layers size={32} className="text-cyber-500 opacity-50" />
          </div>
          <h3 className="text-lg font-bold text-white drop-shadow-md">Gallery Kosong</h3>
          <p className="mt-1 text-sm bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">Belum ada konsep yang disimpan.</p>
        </div>
      ) : (
        // Grid lebih rapat (cols-2 di mobile, up to cols-5 di XL)
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 pb-20">
          {items.map((item) => (
            <div key={item.id} className="bg-cyber-800/50 backdrop-blur-md border border-cyber-700/50 rounded-lg overflow-hidden flex flex-col group hover:border-cyber-500/50 transition-all hover:shadow-lg hover:shadow-cyber-500/10 h-full">
              
              {/* IMAGE AREA - Clean View */}
              <div className={`relative w-full ${getAspectRatioClass(item.aspectRatio)} bg-black overflow-hidden border-b border-cyber-700/30`}>
                 
                 {/* Gambar Utama */}
                 <img 
                   src={item.resultDataUrl} 
                   alt={item.title || "Concept"} 
                   className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                 />
                 
                 {/* Action Buttons (Pojok Kanan Bawah - Tidak menutupi tengah) */}
                 <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
                    <button 
                        onClick={() => onNavigateToSample({
                            prompt: item.prompt,
                            aspectRatio: item.aspectRatio,
                            modelChoice: item.modelChoice
                        })}
                        className="p-1.5 bg-cyber-600/80 rounded-md text-white hover:bg-cyber-500 border border-cyber-400/30 backdrop-blur-md transition-all shadow-lg"
                        title="Buat Sample dari Prompt ini"
                    >
                        <FlaskConical size={14} />
                    </button>
                    <button 
                        onClick={() => openImage(item.resultDataUrl)}
                        className="p-1.5 bg-black/60 rounded-md text-cyber-400 hover:text-white hover:bg-cyber-600 border border-white/10 backdrop-blur-md transition-all shadow-lg"
                        title="Lihat Fullsize"
                    >
                        <Maximize2 size={14} />
                    </button>
                 </div>
                 
                 {/* Badge Ratio (Pojok Kiri Atas - Kecil & Transparan) */}
                 <div className="absolute top-2 left-2 pointer-events-none">
                     <span className="text-[8px] font-bold text-white/90 px-1.5 py-0.5 rounded-sm bg-black/60 backdrop-blur-sm border border-white/10 shadow-sm">
                        {RATIO_LABELS[item.aspectRatio].split('(')[0].trim()}
                     </span>
                 </div>
              </div>

              {/* CONTENT AREA - Compact */}
              <div className="p-2.5 flex flex-col flex-1 gap-2">
                <div>
                    <h3 className="font-bold text-white text-xs sm:text-sm leading-tight truncate drop-shadow-sm" title={item.title || "Untitled"}>
                        {item.title || "Untitled"}
                    </h3>
                    <div className="flex items-center gap-2 text-[9px] text-cyber-300 mt-1 font-mono opacity-80">
                        <span className="flex items-center gap-1 truncate">
                            <Monitor size={8} /> {MODEL_LABELS[item.modelChoice].replace('Gemini ', '')}
                        </span>
                        <span className="w-0.5 h-0.5 bg-cyber-500 rounded-full"></span>
                        <span className="flex items-center gap-1">
                            <Calendar size={8} /> {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>

                {/* Prompt Box - Compact */}
                <div className="bg-cyber-900/40 p-2 rounded border border-cyber-700/30 flex-1 group/text">
                    <p className="text-[10px] text-slate-300 italic line-clamp-2 group-hover/text:line-clamp-4 transition-all leading-relaxed">
                        "{item.prompt}"
                    </p>
                </div>

                {/* Footer Buttons - Small */}
                <div className="grid grid-cols-2 gap-1.5 mt-auto">
                  <button
                    onClick={() => handleCopyPrompt(item.prompt)}
                    className="py-1.5 px-2 rounded bg-cyber-700/30 text-cyber-300 border border-cyber-700/50 hover:bg-cyber-500/20 hover:border-cyber-500 hover:text-white transition-all flex items-center justify-center gap-1.5 text-[10px] font-medium"
                  >
                    <Copy size={10} /> Copy
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="py-1.5 px-2 rounded bg-red-500/20 text-red-300 border border-red-500/20 hover:bg-red-500/30 hover:text-white transition-all flex items-center justify-center gap-1.5 text-[10px] font-medium"
                  >
                    <Trash2 size={10} /> Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GalleryView;