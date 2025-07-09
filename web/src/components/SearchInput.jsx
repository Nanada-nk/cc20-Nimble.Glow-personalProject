import { SearchIcon } from 'lucide-react';

function SearchInput({ value, onChange, placeholder = "Search..." }) {
  return (
    <div className="mb-6">
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pri-gr1"
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
}

export default SearchInput