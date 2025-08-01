import React, { createContext, useContext, useReducer, useEffect } from 'react';

export interface Book {
  id: string;
  title: string;
  author: string;
  availability: 'Available' | 'Checked Out';
  isbn?: string;
  category?: string;
}

export interface Reservation {
  id: string;
  bookTitle: string;
  reservedBy: string;
  reservationDate: string;
  bookId: string;
}

export interface CheckoutRecord {
  id: string;
  bookId: string;
  userId: string;
  action: 'Check In' | 'Check Out';
  timestamp: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'eBook' | 'Article' | 'Video' | 'Document';
  url?: string;
}

interface LibraryState {
  books: Book[];
  reservations: Reservation[];
  checkoutRecords: CheckoutRecord[];
  resources: Resource[];
  activeMenuItem: string;
}

type LibraryAction =
  | { type: 'SET_ACTIVE_MENU'; payload: string }
  | { type: 'ADD_RESERVATION'; payload: Reservation }
  | { type: 'CANCEL_RESERVATION'; payload: string }
  | { type: 'ADD_CHECKOUT_RECORD'; payload: CheckoutRecord }
  | { type: 'UPDATE_BOOK_AVAILABILITY'; payload: { id: string; availability: 'Available' | 'Checked Out' } }
  | { type: 'ADD_BOOK'; payload: Book }
  | { type: 'ADD_RESOURCE'; payload: Resource }
  | { type: 'LOAD_FROM_STORAGE'; payload: Partial<LibraryState> };

const initialState: LibraryState = {
  books: [
    { id: '1', title: 'The Art of Leadership', author: 'John Maxwell', availability: 'Available' },
    { id: '2', title: 'Effective Communication', author: 'Dale Carnegie', availability: 'Checked Out' },
    { id: '3', title: 'Project Management Fundamentals', author: 'PMI Institute', availability: 'Available' },
    { id: '4', title: 'Digital Marketing Strategy', author: 'Sarah Johnson', availability: 'Available' },
    { id: '5', title: 'Data Science Essentials', author: 'Michael Chen', availability: 'Checked Out' },
  ],
  reservations: [
    { id: '1', bookTitle: 'Advanced React Patterns', reservedBy: 'Alice Smith', reservationDate: '2024-01-15', bookId: '6' },
    { id: '2', bookTitle: 'Machine Learning Basics', reservedBy: 'Bob Johnson', reservationDate: '2024-01-16', bookId: '7' },
    { id: '3', bookTitle: 'UX Design Principles', reservedBy: 'Carol Davis', reservationDate: '2024-01-17', bookId: '8' },
  ],
  checkoutRecords: [],
  resources: [
    { id: '1', title: 'Leadership Skills eBook', description: 'Comprehensive guide to developing leadership skills in the modern workplace.', type: 'eBook' },
    { id: '2', title: 'Communication Best Practices', description: 'Research article on effective communication strategies.', type: 'Article' },
    { id: '3', title: 'Project Management Tutorial', description: 'Video series covering project management methodologies.', type: 'Video' },
    { id: '4', title: 'Digital Transformation Guide', description: 'Complete document on digital transformation strategies.', type: 'Document' },
  ],
  activeMenuItem: 'library',
};

function libraryReducer(state: LibraryState, action: LibraryAction): LibraryState {
  switch (action.type) {
    case 'SET_ACTIVE_MENU':
      return { ...state, activeMenuItem: action.payload };
    case 'ADD_RESERVATION':
      const newReservations = [...state.reservations, action.payload];
      localStorage.setItem('libraryReservations', JSON.stringify(newReservations));
      return { ...state, reservations: newReservations };
    case 'CANCEL_RESERVATION':
      const filteredReservations = state.reservations.filter(r => r.id !== action.payload);
      localStorage.setItem('libraryReservations', JSON.stringify(filteredReservations));
      return { ...state, reservations: filteredReservations };
    case 'ADD_CHECKOUT_RECORD':
      return { ...state, checkoutRecords: [...state.checkoutRecords, action.payload] };
    case 'UPDATE_BOOK_AVAILABILITY':
      return {
        ...state,
        books: state.books.map(book =>
          book.id === action.payload.id
            ? { ...book, availability: action.payload.availability }
            : book
        ),
      };
    case 'ADD_BOOK':
      const newBooks = [...state.books, action.payload];
      localStorage.setItem('libraryBooks', JSON.stringify(newBooks));
      return { ...state, books: newBooks };
    case 'ADD_RESOURCE':
      const newResources = [...state.resources, action.payload];
      localStorage.setItem('libraryResources', JSON.stringify(newResources));
      return { ...state, resources: newResources };
    case 'LOAD_FROM_STORAGE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

interface LibraryContextType {
  state: LibraryState;
  dispatch: React.Dispatch<LibraryAction>;
  setActiveMenuItem: (item: string) => void;
  addReservation: (reservation: Omit<Reservation, 'id'>) => void;
  cancelReservation: (id: string) => void;
  addCheckoutRecord: (record: Omit<CheckoutRecord, 'id' | 'timestamp'>) => void;
  updateBookAvailability: (id: string, availability: 'Available' | 'Checked Out') => void;
  addBook: (book: Omit<Book, 'id'>) => void;
  addResource: (resource: Omit<Resource, 'id'>) => void;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const LibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(libraryReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedReservations = localStorage.getItem('libraryReservations');
    const savedBooks = localStorage.getItem('libraryBooks');
    const savedResources = localStorage.getItem('libraryResources');
    
    const loadData: Partial<LibraryState> = {};
    
    if (savedReservations) {
      loadData.reservations = JSON.parse(savedReservations);
    }
    if (savedBooks) {
      loadData.books = JSON.parse(savedBooks);
    }
    if (savedResources) {
      loadData.resources = JSON.parse(savedResources);
    }
    
    if (Object.keys(loadData).length > 0) {
      dispatch({
        type: 'LOAD_FROM_STORAGE',
        payload: loadData,
      });
    }
  }, []);

  const setActiveMenuItem = (item: string) => {
    dispatch({ type: 'SET_ACTIVE_MENU', payload: item });
  };

  const addReservation = (reservation: Omit<Reservation, 'id'>) => {
    const newReservation: Reservation = {
      ...reservation,
      id: Date.now().toString(),
    };
    dispatch({ type: 'ADD_RESERVATION', payload: newReservation });
  };

  const cancelReservation = (id: string) => {
    dispatch({ type: 'CANCEL_RESERVATION', payload: id });
  };

  const addCheckoutRecord = (record: Omit<CheckoutRecord, 'id' | 'timestamp'>) => {
    const newRecord: CheckoutRecord = {
      ...record,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_CHECKOUT_RECORD', payload: newRecord });
    
    // Update book availability
    const availability = record.action === 'Check Out' ? 'Checked Out' : 'Available';
    updateBookAvailability(record.bookId, availability);
  };

  const updateBookAvailability = (id: string, availability: 'Available' | 'Checked Out') => {
    dispatch({ type: 'UPDATE_BOOK_AVAILABILITY', payload: { id, availability } });
  };

  const addBook = (book: Omit<Book, 'id'>) => {
    const newBook: Book = {
      ...book,
      id: Date.now().toString(),
    };
    dispatch({ type: 'ADD_BOOK', payload: newBook });
  };

  const addResource = (resource: Omit<Resource, 'id'>) => {
    const newResource: Resource = {
      ...resource,
      id: Date.now().toString(),
    };
    dispatch({ type: 'ADD_RESOURCE', payload: newResource });
  };

  return (
    <LibraryContext.Provider
      value={{
        state,
        dispatch,
        setActiveMenuItem,
        addReservation,
        cancelReservation,
        addCheckoutRecord,
        updateBookAvailability,
        addBook,
        addResource,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (context === undefined) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
};