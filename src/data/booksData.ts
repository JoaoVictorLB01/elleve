import book1 from "@/assets/book-1.jpg";
import book2 from "@/assets/book-2.jpg";
import book3 from "@/assets/book-3.jpg";
import book4 from "@/assets/book-4.jpg";
import book5 from "@/assets/book-5.jpg";
import book6 from "@/assets/book-6.jpg";

export interface Book {
  id: string;
  titleKey: string;
  authorKey: string;
  descriptionKey: string;
  cover: string;
  category: string;
  downloads: number;
  popular: boolean;
  recent: boolean;
  pdfUrl: string;
  pages: number;
}

export const books: Book[] = [
  {
    id: "b1",
    titleKey: "book.1.title",
    authorKey: "book.1.author",
    descriptionKey: "book.1.desc",
    cover: book1,
    category: "energy",
    downloads: 1243,
    popular: true,
    recent: false,
    pdfUrl: "#",
    pages: 186,
  },
  {
    id: "b2",
    titleKey: "book.2.title",
    authorKey: "book.2.author",
    descriptionKey: "book.2.desc",
    cover: book2,
    category: "crystals",
    downloads: 892,
    popular: true,
    recent: true,
    pdfUrl: "#",
    pages: 142,
  },
  {
    id: "b3",
    titleKey: "book.3.title",
    authorKey: "book.3.author",
    descriptionKey: "book.3.desc",
    cover: book3,
    category: "meditation",
    downloads: 2105,
    popular: true,
    recent: false,
    pdfUrl: "#",
    pages: 210,
  },
  {
    id: "b4",
    titleKey: "book.4.title",
    authorKey: "book.4.author",
    descriptionKey: "book.4.desc",
    cover: book4,
    category: "consciousness",
    downloads: 678,
    popular: false,
    recent: true,
    pdfUrl: "#",
    pages: 264,
  },
  {
    id: "b5",
    titleKey: "book.5.title",
    authorKey: "book.5.author",
    descriptionKey: "book.5.desc",
    cover: book5,
    category: "energy",
    downloads: 534,
    popular: false,
    recent: true,
    pdfUrl: "#",
    pages: 198,
  },
  {
    id: "b6",
    titleKey: "book.6.title",
    authorKey: "book.6.author",
    descriptionKey: "book.6.desc",
    cover: book6,
    category: "personalDev",
    downloads: 1567,
    popular: true,
    recent: true,
    pdfUrl: "#",
    pages: 320,
  },
];

export const bookCategories = ["all", "energy", "crystals", "meditation", "consciousness", "personalDev"];
