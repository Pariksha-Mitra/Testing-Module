import * as React from 'react';
import { GameCardProps } from '@/utils/types';
import { useRouter } from 'next/navigation';

const DEFAULT_GRADIENTS = [
  "bg-[linear-gradient(180deg,#FC708A_0%,#DD3151_100%)]",
  "bg-[linear-gradient(180deg,#7E7CFE_0%,#2F4DC4_100%)]",
  "bg-[linear-gradient(180deg,#6AD9A1_0%,#329965_100%)]",
  "bg-[linear-gradient(180deg,#FCE459_0%,#DCA12B_100%)]"
]

const getRandomGradient = () => {
  return DEFAULT_GRADIENTS[Math.floor(Math.random() * DEFAULT_GRADIENTS.length)];
}

export const GameCard: React.FC<GameCardProps> = ({ text, description, thumbnail, src }) => {
  const router = useRouter();
  const navigateToGame = () => {
    router.push(`${src}`);
  };

  return (
    <div
      className="w-full max-w-xs border rounded-lg shadow-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform"
      onClick={navigateToGame}
    >
      {/* Game Image */}
      {thumbnail ? (
        <div
          className="w-full h-48 bg-cover bg-center"
          style={{
            backgroundImage: `url(${thumbnail})`
          }}
        />
      ) : (
        <div className={`w-full h-48 ${getRandomGradient()}`} />
      )}

      {/* Game Title and Description */}
      <div className="p-4">
        <h3 className="text-xl font-bold">{text}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
};
