import { FaPaw } from 'react-icons/fa';

export const Footer = () => (
  <footer className="bg-gray-800 text-white py-12">
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <FaPaw className="mr-2" /> Happy Paws
          </h3>
          <p className="text-gray-400">
            Finding loving homes for dogs since 2023
          </p>
        </div>
        {/* Other footer sections remain same */}
      </div>
      <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
        <p>© {new Date().getFullYear()} Happy Paws. All rights reserved.</p>
      </div>
    </div>
  </footer>
);