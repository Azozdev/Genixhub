import React, { useState } from 'react';
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
import { Plus, MoreHorizontal, Calendar, DollarSign, Mail, AlertTriangle } from 'lucide-react';
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
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden transform transition-all scale-100">
        <div className="p-6 flex items-start gap-4">
          <div className="p-2 bg-red-50 rounded-full shrink-0">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">{title}</h3>
            <p className="text-slate-500 text-sm">{message}</p>
          </div>
        </div>
        <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3 border-t border-slate-100">
           <button
             onClick={(e) => { e.stopPropagation(); onClose(); }}
             className="px-4 py-2 text-slate-600 text-sm font-medium hover:bg-slate-100 rounded-lg transition-colors"
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
        className={`bg-white p-4 rounded-xl shadow-sm border border-slate-200 group hover:shadow-md transition-shadow cursor-grab relative ${isOverlay ? 'rotate-3 scale-105 cursor-grabbing z-50' : ''}`}
      >
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-semibold text-slate-800 text-sm line-clamp-1">{lead.name}</h4>
          <button 
            onPointerDown={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }} // Use onPointerDown to prevent drag start
            className="text-slate-400 hover:text-slate-600 p-1 -mr-2 rounded-md hover:bg-slate-100"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
          
          {/* Simple Dropdown Menu */}
          {showMenu && (
            <div className="absolute right-2 top-8 bg-white border border-slate-200 shadow-lg rounded-lg z-20 w-24 py-1 text-xs overflow-hidden flex flex-col">
               <button 
                onClick={(e) => { e.stopPropagation(); handleEdit(); }}
                className="px-3 py-2 text-left hover:bg-slate-50 text-slate-700 w-full"
               >
                   Edit
               </button>
               <button 
                onClick={(e) => { e.stopPropagation(); handleDeleteClick(); }}
                className="px-3 py-2 text-left hover:bg-red-50 text-red-600 w-full"
               >
                   Delete
               </button>
            </div>
          )}
        </div>

        <div className="space-y-2">
            <div className="flex items-center text-slate-500 text-xs">
                <DollarSign className="w-3 h-3 mr-1.5 text-emerald-600" />
                <span className="font-medium text-slate-700">${lead.value.toLocaleString()}</span>
            </div>
            <div className="flex items-center text-slate-400 text-xs">
                <Mail className="w-3 h-3 mr-1.5" />
                <span className="truncate max-w-[140px]">{lead.email || 'No email'}</span>
            </div>
            {lead.notes && (
                <div className="pt-2 mt-2 border-t border-slate-100">
                    <p className="text-xs text-slate-500 line-clamp-2 italic">"{lead.notes}"</p>
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
      <div className={`p-4 rounded-t-xl bg-white border-b-4 ${column.color} shadow-sm mb-4`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-slate-800">{column.title}</h3>
          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${column.badgeColor}`}>
            {leads.length}
          </span>
        </div>
        <p className="text-xs text-slate-500 font-medium">
           Total: ${totalValue.toLocaleString()}
        </p>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto pb-20 min-h-[150px]">
        {leads.map((lead) => (
          <LeadCard key={lead.id} lead={lead} />
        ))}
        {leads.length === 0 && (
          <div className="h-24 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-sm">
            Drop here
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main View ---
const PipelineView: React.FC = () => {
  const { leads, moveLead, addLead } = useCRM();
  const [activeLead, setActiveLead] = useState<Lead | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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

  return (
    <div className="h-full flex flex-col overflow-hidden bg-slate-50/50">
      {/* Header */}
      <div className="px-6 py-4 bg-white border-b border-slate-200 flex justify-between items-center sticky top-0 z-20">
        <h1 className="text-2xl font-bold text-slate-900">Pipeline</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center shadow-sm shadow-indigo-200 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Lead
        </button>
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