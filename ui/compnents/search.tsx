// components/SearchSection.tsx
"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

interface SearchSectionProps {
  placeholder?: string;
  className?: string;
}

const SearchSection: React.FC<SearchSectionProps> = ({
  placeholder = "Search...",
  className = "",
}) => {
  const [query, setQuery] = useState<string>("");
  const router = useRouter();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      // Update URL with search query
      router.push(`/posts/?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <section className={`w-full ${className}`}>
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 bg-gray-100 rounded-lg p-2 max-w-lg"
      >
        <Search className="w-5 h-5 text-gray-500" />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="bg-transparent w-full outline-none text-gray-700 placeholder-gray-400"
          aria-label="Search input"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600 transition-colors"
        >
          Search
        </button>
      </form>
    </section>
  );
};

export default SearchSection;
