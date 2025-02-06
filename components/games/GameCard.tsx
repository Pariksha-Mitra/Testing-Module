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
  const gradient = thumbnail ? '' : getRandomGradient();
  const router = useRouter();
  const navigateToGame = () => {
    router.push(`${src}`);
  };

  return (
    <div
      className={`${gradient} w-full h-full rounded-lg flex items-center justify-center transition-transform hover:scale-105`}
      style={{ backgroundImage: thumbnail ? `url(${thumbnail})` : '', backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {text && (
        <span
          className={`text-black text-xl font-bold m-3 rounded-lg p-3 ${thumbnail ? 'bg-gray-300' : ''}`}
          style={{ opacity: 0.93 }}
          onClick={navigateToGame}
        >
          {text}
        </span>
      )}
    </div>
  );
};
