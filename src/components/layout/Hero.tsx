import { SearchBar } from "../common/SearchBar";
import { FaSearch } from "react-icons/fa";

export interface HeroProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  handleSearch: () => void;
  children?: React.ReactNode;
}

export const Hero = ({
  searchTerm,
  setSearchTerm,
  handleSearch,
}: HeroProps) => (
  <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-20">
    <div className="container mx-auto px-6 text-center">
      <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
        Find Your Perfect Dog Companion
      </h1>
      <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
        Browse our selection of healthy, happy dogs ready to join your family
      </p>
      <div className="flex justify-center">
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onSearch={handleSearch}
          placeholder="Search dogs by breed or name..."
          large
          icon={<FaSearch className="w-5 h-5 text-white" />}
          className="mx-auto "
          color="white"
          textColor="blue-500"
          stroke="blue"
        />
      </div>
    </div>
  </section>
);
