import { createContext, useContext, useState, ReactNode } from "react";
import { books as initialBooks, Book } from "@/data/booksData";

interface BooksContextType {
  libraryBooks: Book[];
  setLibraryBooks: React.Dispatch<React.SetStateAction<Book[]>>;
}

const BooksContext = createContext<BooksContextType | undefined>(undefined);

export const BooksProvider = ({ children }: { children: ReactNode }) => {
  const [libraryBooks, setLibraryBooks] = useState<Book[]>(initialBooks);
  return (
    <BooksContext.Provider value={{ libraryBooks, setLibraryBooks }}>
      {children}
    </BooksContext.Provider>
  );
};

export const useBooks = () => {
  const ctx = useContext(BooksContext);
  if (!ctx) throw new Error("useBooks must be used within BooksProvider");
  return ctx;
};
