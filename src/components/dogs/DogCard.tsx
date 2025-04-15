import { FaHeart, FaRegHeart, FaUserShield } from "react-icons/fa";
import { format } from "date-fns";
import { Dog } from "../../types/user";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { removeFavorite, addFavorite } from "../../context/Favourite";
import { useCart } from "../../context/CartContent";
import { toast } from "react-toastify";

interface DogCardProps {
  dog: Dog;
  isFavorite: boolean;
  onToggleFavorite: (dogId: string, isFavorite: boolean) => void;
  postedByAdmin?: string;
}

export const DogCard = ({ 
  dog, 
  isFavorite, 
  onToggleFavorite,
  postedByAdmin 
}: DogCardProps) => {
  const { user } = useAuth();
  const { cart, addToCart, removeFromCart } = useCart();
  const [imageLoaded, setImageLoaded] = useState(false);
  const isInCart = cart.some(item => item.id === dog.id);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      toast.info("Please login to add favorites");
      return;
    }

    try {
      if (isFavorite) {
        await removeFavorite(user.uid, dog.id);
      } else {
        await addFavorite(user.uid, dog.id);
      }
      onToggleFavorite(dog.id, !isFavorite);
    } catch (error) {
      toast.error("Failed to update favorites");
    }
  };

  const handleCartAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!dog.isAvailable) return;

    if (isInCart) {
      removeFromCart(dog.id);
      toast.success(`${dog.name} removed from cart`);
    } else {
      addToCart(dog);
      toast.success(`${dog.name} added to cart!`);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow relative group">
      {/* Favorite Button */}
      <button
        onClick={handleToggleFavorite}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all ${
          isFavorite 
            ? 'bg-red-100 text-red-500' 
            : 'bg-white/80 text-gray-400 hover:text-red-500 backdrop-blur-sm'
        }`}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        {isFavorite ? (
          <FaHeart className="text-xl" />
        ) : (
          <FaRegHeart className="text-xl" />
        )}
      </button>

      {/* Admin Badge */}
      {postedByAdmin && (
        <div className="absolute top-3 left-3 z-10 bg-blue-600 text-white px-2 py-1 rounded-full flex items-center text-xs">
          <FaUserShield className="mr-1" />
          {postedByAdmin}
        </div>
      )}

      {/* Image with loading state */}
      <div className="relative h-48 bg-gray-100">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-pulse bg-gray-200 w-full h-full" />
          </div>
        )}
        <img
          src={dog.images[0]}
          alt={dog.name}
          className={`w-full h-full object-cover transition-opacity ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
        />
      </div>

      {/* Dog Info */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-gray-800 font-semibold text-lg">{dog.name}</h3>
          {!dog.isAvailable && (
            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
              Adopted
            </span>
          )}
        </div>

        <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
          <span className="capitalize">{dog.breed.toLowerCase()}</span>
          <span>Age: {dog.age} {dog.age === 1 ? 'yr' : 'yrs'}</span>
        </div>

        {dog.createdAt && (
          <div className="text-xs text-gray-500 mb-3">
            Posted: {format(dog.createdAt.toDate(), 'MMM d, yyyy')}
          </div>
        )}

        <div className="flex justify-between items-center mt-2">
          <span className="text-indigo-600 font-bold">
            ${dog.price.toLocaleString()}
          </span>
          <button
            onClick={handleCartAction}
            disabled={!dog.isAvailable}
            className={`px-4 py-2 rounded-lg transition-colors ${
              dog.isAvailable
                ? isInCart
                  ? 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {dog.isAvailable 
              ? isInCart 
                ? 'Remove' 
                : 'Add to Cart'
              : 'Unavailable'}
          </button>
        </div>
      </div>
    </div>
  );
};