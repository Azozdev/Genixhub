import React, { useState, useRef } from 'react';
import { useCRM } from '../context/CRMContext';
import { COLUMNS, Lead, LeadStatus } from '../types';
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
  DragEndEvent,
  DragStartEvent,
  useSensor,
  useSensors,
  PointerSensor,
} from '@dnd-kit/core';
import { Plus, MoreHorizontal, DollarSign, Mail, AlertTriangle, MoreVertical, Download, Upload, Sun, Moon } from 'lucide-react';
import LeadModal from '../components/LeadModal';

// --- Confirmation Modal Component ---
interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl w-full max-w-sm overflow-hidden transform transition-all scale-100">
        <div className="p-6 flex items-start gap-4">
          <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-full shrink-0">
            <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">{title}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">{message}</p>
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800 px-6 py-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-700">
           <button
             onClick={(e) => { e.stopPropagation(); onClose(); }}
             className="px-4 py-2 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
           >
             Cancel
           </button>
           <button
             onClick={(e) => { e.stopPropagation(); onConfirm(); }}
             className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors shadow-sm"
           >
             Delete Lead
           </button>
        </div>
      </div>
    </div>
  );
};

// --- Draggable Card Component ---
const LeadCard: React.FC<{ lead: Lead; isOverlay?: boolean }> = ({ lead, isOverlay = false }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: lead.id,
    data: { lead },
    disabled: isOverlay, // Disable dragging if it's the overlay itself
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const { updateLead, deleteLead } = useCRM();
  const [showMenu, setShowMenu] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleEdit = () => {
    setShowEdit(true);
    setShowMenu(false);
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
    setShowMenu(false);
  };

  const handleConfirmDelete = () => {
    deleteLead(lead.id);
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 group hover:shadow-md transition-all cursor-grab relative ${isOverlay ? 'rotate-3 scale-105 cursor-grabbing z-50' : ''}`}
      >
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-semibold text-slate-800 dark:text-slate-100 text-sm line-clamp-1">{lead.name}</h4>
          <button 
            onPointerDown={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }} // Use onPointerDown to prevent drag start
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 -mr-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
          
          {/* Simple Dropdown Menu */}
          {showMenu && (
            <div className="absolute right-2 top-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg rounded-lg z-20 w-24 py-1 text-xs overflow-hidden flex flex-col">
               <button 
                onClick={(e) => { e.stopPropagation(); handleEdit(); }}
                className="px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 w-full"
               >
                   Edit
               </button>
               <button 
                onClick={(e) => { e.stopPropagation(); handleDeleteClick(); }}
                className="px-3 py-2 text-left hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 w-full"
               >
                   Delete
               </button>
            </div>
          )}
        </div>

        <div className="space-y-2">
            <div className="flex items-center text-slate-500 dark:text-slate-400 text-xs">
                <DollarSign className="w-3 h-3 mr-1.5 text-emerald-600 dark:text-emerald-400" />
                <span className="font-medium text-slate-700 dark:text-slate-200">${lead.value.toLocaleString()}</span>
            </div>
            <div className="flex items-center text-slate-400 dark:text-slate-500 text-xs">
                <Mail className="w-3 h-3 mr-1.5" />
                <span className="truncate max-w-[140px]">{lead.email || 'No email'}</span>
            </div>
            {lead.notes && (
                <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-700">
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 italic">"{lead.notes}"</p>
                </div>
            )}
        </div>
      </div>

      {/* Render Modal outside the drag context via Portal or conditionally here if not dragging */}
      {showEdit && (
          <LeadModal 
            isOpen={true} 
            onClose={() => setShowEdit(false)} 
            initialData={lead}
            onSubmit={(data) => updateLead(lead.id, data)}
          />
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal 
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Lead?"
        message={`Are you sure you want to delete "${lead.name}"? This action cannot be undone.`}
      />
    </>
  );
};

// --- Droppable Column Component ---
const KanbanColumn: React.FC<{ column: typeof COLUMNS[0]; leads: Lead[] }> = ({ column, leads }) => {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  const totalValue = leads.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div ref={setNodeRef} className="flex flex-col h-full min-w-[280px] w-full md:w-[280px] lg:w-[320px] flex-shrink-0">
      <div className={`p-4 rounded-t-xl bg-white dark:bg-slate-900 border-b-4 ${column.color} shadow-sm mb-4 transition-colors`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-slate-800 dark:text-slate-100">{column.title}</h3>
          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${column.badgeColor} ${column.darkBadgeColor}`}>
            {leads.length}
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
           Total: ${totalValue.toLocaleString()}
        </p>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto pb-20 min-h-[150px]">
        {leads.map((lead) => (
          <LeadCard key={lead.id} lead={lead} />
        ))}
        {leads.length === 0 && (
          <div className="h-24 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center text-slate-400 dark:text-slate-600 text-sm">
            Drop here
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main View ---
const PipelineView: React.FC = () => {
  const { leads, moveLead, addLead, importData, theme, toggleTheme } = useCRM();
  const [activeLead, setActiveLead] = useState<Lead | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Header menu state
  const [showHeaderMenu, setShowHeaderMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sensors for drag detection logic
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required to start drag (prevents accidental clicks)
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveLead(active.data.current?.lead);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveLead(null);

    if (!over) return;

    const leadId = active.id as string;
    const newStatus = over.id as LeadStatus;
    
    // Find the lead
    const currentLead = leads.find(l => l.id === leadId);

    if (currentLead && currentLead.status !== newStatus) {
      moveLead(leadId, newStatus);
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(leads, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `genixhub-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowHeaderMenu(false);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
    setShowHeaderMenu(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        importData(json);
      } catch (err) {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-slate-50/50 dark:bg-slate-950 transition-colors">
      {/* Header */}
      <div className="px-6 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center sticky top-0 z-20 transition-colors">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Pipeline</h1>
        
        <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center shadow-sm shadow-indigo-200 dark:shadow-none transition-all active:scale-95"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg transition-colors"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

             {/* Menu Button */}
             <div className="relative">
                <button
                    onClick={() => setShowHeaderMenu(!showHeaderMenu)}
                    className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg transition-colors"
                >
                    <MoreVertical className="w-5 h-5" />
                </button>

                {showHeaderMenu && (
                    <>
                        <div className="fixed inset-0 z-20" onClick={() => setShowHeaderMenu(false)} />
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 py-1 z-30 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                            <button 
                                onClick={handleImportClick}
                                className="w-full px-4 py-2.5 text-left text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center transition-colors"
                            >
                                <Upload className="w-4 h-4 mr-3 text-slate-400 dark:text-slate-500" />
                                Import JSON
                            </button>
                            <button 
                                onClick={handleExport}
                                className="w-full px-4 py-2.5 text-left text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center transition-colors"
                            >
                                <Download className="w-4 h-4 mr-3 text-slate-400 dark:text-slate-500" />
                                Download JSON
                            </button>
                        </div>
                    </>
                )}
             </div>
        </div>

        <input
            type="file"
            accept=".json"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
        />
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="flex h-full space-x-6 min-w-max">
            {COLUMNS.map((col) => (
              <KanbanColumn
                key={col.id}
                column={col}
                leads={leads.filter((l) => l.status === col.id)}
              />
            ))}
          </div>

          {/* Drag Overlay for smooth visual feedback */}
          <DragOverlay>
            {activeLead ? <div className="w-[320px]"><LeadCard lead={activeLead} isOverlay /></div> : null}
          </DragOverlay>
        </DndContext>
      </div>

      <LeadModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={(data) => addLead(data)}
      />
    </div>
  );
};

export default PipelineView;