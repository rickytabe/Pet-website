import { Dog } from '../../types/user';
import { Button } from '../common/Button';

interface CartItemProps {
  dog: Dog;
  onRemove: () => void;
}

export const CartItem = ({ dog, onRemove }: CartItemProps) => {
  return (
    <div className="flex gap-4 py-4 border-b last:border-b-0">
      <img
        src={dog.images[0]}
        alt={dog.name}
        className="w-20 h-20 object-cover rounded-lg"
      />
      <div className="flex-1">
        <h3 className="font-medium text-gray-800">{dog.name}</h3>
        <p className="text-sm text-gray-600">{dog.breed}</p>
        <p className="text-blue-600 font-bold mt-1">${dog.price}</p>
      </div>
      <Button
        variant="secondary"
        onClick={onRemove}
        className="self-start px-3 py-1 text-sm"
      >
        Remove
      </Button>
    </div>
  );
};