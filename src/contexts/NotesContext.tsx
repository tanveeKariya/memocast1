import React, { createContext, useContext, useState, useCallback } from 'react';

export interface Note {
  id: string;
  title: string;
  content: string;
  category: 'Personal' | 'Academic' | 'Work' | 'Others';
  createdAt: Date;
  updatedAt: Date;
  size: number;
  isVoiceNote: boolean;
}

export interface Folder {
  id: string;
  name: string;
  category: 'Personal' | 'Academic' | 'Work' | 'Others';
  noteCount: number;
  size: number;
}

interface NotesContextType {
  notes: Note[];
  folders: Folder[];
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  addFolder: (folder: Omit<Folder, 'id'>) => void;
  getStorageStats: () => { used: number; total: number };
  getCategoryStats: () => { Personal: number; Academic: number; Work: number; Others: number };
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'Meeting Notes',
      content: 'Quarterly review discussion points...',
      category: 'Work',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
      size: 1.2,
      isVoiceNote: true
    },
    {
      id: '2',
      title: 'Research Ideas',
      content: 'AI applications in healthcare...',
      category: 'Academic',
      createdAt: new Date('2024-01-14'),
      updatedAt: new Date('2024-01-14'),
      size: 0.8,
      isVoiceNote: false
    }
  ]);

  const [folders, setFolders] = useState<Folder[]>([
    {
      id: '1',
      name: 'Daily Journal',
      category: 'Personal',
      noteCount: 15,
      size: 2.3
    },
    {
      id: '2',
      name: 'Project Alpha',
      category: 'Work',
      noteCount: 28,
      size: 5.7
    }
  ]);

  const addNote = useCallback((noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newNote: Note = {
      ...noteData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setNotes(prev => [newNote, ...prev]);
  }, []);

  const updateNote = useCallback((id: string, updates: Partial<Note>) => {
    setNotes(prev => prev.map(note => 
      note.id === id ? { ...note, ...updates, updatedAt: new Date() } : note
    ));
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  }, []);

  const addFolder = useCallback((folderData: Omit<Folder, 'id'>) => {
    const newFolder: Folder = {
      ...folderData,
      id: Date.now().toString()
    };
    setFolders(prev => [...prev, newFolder]);
  }, []);

  const getStorageStats = useCallback(() => {
    const used = notes.reduce((acc, note) => acc + note.size, 0);
    return { used, total: 25 };
  }, [notes]);

  const getCategoryStats = useCallback(() => {
    const stats = { Personal: 0, Academic: 0, Work: 0, Others: 0 };
    notes.forEach(note => {
      stats[note.category]++;
    });
    return stats;
  }, [notes]);

  const value: NotesContextType = {
    notes,
    folders,
    addNote,
    updateNote,
    deleteNote,
    addFolder,
    getStorageStats,
    getCategoryStats
  };

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  );
};