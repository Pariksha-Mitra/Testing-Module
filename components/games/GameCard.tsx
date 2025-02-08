import * as React from 'react';
import { GameCardProps } from '@/utils/types';

export const GameCard: React.FC<GameCardProps> = ({ gradient, text }) => {
  return (
    <div className={`${gradient} w-full h-full rounded-lg flex items-center justify-center transition-transform hover:scale-105`}>
      {text && <span className="text-white text-xl font-bold">{text}</span>}
    </div>
  );
};
