
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Home, Menu, X, Volume2, VolumeX, Sun, Moon, Info, Trophy } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Separator } from '@/components/ui/separator';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // Add actual mute functionality here if you implement sound
  };

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <nav className="w-full bg-background border-b border-border">
      <div className="max-w-7xl mx-auto">
        <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center">
            <div className="flex items-center gap-2">
              <span className="block h-8 w-8 rounded-md overflow-hidden bg-gradient-to-br from-primary to-purple-600 shine-effect"></span>
              <span className="hidden sm:flex flex-col items-start">
                <h1 className="text-xl font-bold">Tower Blocks</h1>
                <div className="text-xs py-0.5 px-2 bg-muted rounded-full text-muted-foreground">Beta</div>
              </span>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              <span>Game</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              <span>Leaderboard</span>
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Button variant="ghost" size="icon" onClick={toggleMute}>
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              <span>About</span>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleMute}>
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on state */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-b border-border">
          <div className="px-4 py-3 space-y-3">
            <Button variant="ghost" className="w-full justify-start">
              <Home className="h-4 w-4 mr-2" />
              <span>Game</span>
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Trophy className="h-4 w-4 mr-2" />
              <span>Leaderboard</span>
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Info className="h-4 w-4 mr-2" />
              <span>About</span>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
