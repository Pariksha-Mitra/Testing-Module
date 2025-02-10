"use client"
import Sidebar from '@/components/ui/Sidebar/Sidebar';
import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react';

const GameNotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-gray-900">
      <h1 className="text-5xl font-bold text-white">Game not found</h1>
    </div>
  );
}

interface GameConfig {
  html: string;
  script: string;
}

const Page: React.FC = () => {
  const [gameConfig, setGameConfig] = React.useState<GameConfig | null>(null);
  const [gameNotFound, setGameNotFound] = React.useState<boolean>(false);
  const pathname = usePathname();
  const segments = pathname.split('/');
  const gameIndex = segments.indexOf('games');

  useEffect(() => {
    const fetchGame = async (gameName: string) => {
      try {
        const response = await fetch(`/games/${gameName}/config.json`)
        const data = await response.json();
        setGameConfig(data);
      } catch (e) {
        console.log("Error while loading game.json", e);
        setGameNotFound(true);
      }
    }
    if (gameIndex !== -1 && segments[gameIndex + 1] != 'index.html') {
      const gameName = segments[gameIndex + 1];
      fetchGame(gameName);
    } else {
      setGameNotFound(true);
    }
  }, [segments, gameIndex]);

  return (
    <div className="flex min-h-screen min-w-screen overflow-hidden">
      <Sidebar />
      {gameNotFound ? (
        <GameNotFound />
      ) : (gameConfig) ? (
        <div className='flex flex-col w-screen h-screen items-end' id='game-container' style={{ width: '100%', height: '100vh', border: 'none' }}>
          <iframe src={gameConfig.html} style={{ width: '100%', height: '100vh', border: 'none' }} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-screen w-screen">
          <h1 className="text-5xl text-black">Loading game...</h1>
        </div>
      )}
    </div>
  );
};

export default Page;