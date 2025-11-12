import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import NumberSelector from '@/components/educational/NumberSelector';
import { X, Save, Plus } from 'lucide-react';

interface WheelSector {
  id: string;
  text: string;
  color: string;
}

interface SavedWheel {
  id: string;
  name: string;
  sectors: WheelSector[];
  createdAt: Date;
}

interface WheelEditorProps {
  sectors: WheelSector[];
  onSectorsChange: (sectors: WheelSector[]) => void;
  onSave: (name: string, sectors: WheelSector[]) => void;
  onLoad: (wheel: SavedWheel) => void;
  savedWheels: SavedWheel[];
  translations: any;
}

const defaultColors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
];

export default function WheelEditor({ 
  sectors, 
  onSectorsChange, 
  onSave, 
  onLoad, 
  savedWheels,
  translations 
}: WheelEditorProps) {
  const [sectorCount, setSectorCount] = useState(sectors.length || 6);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [saveName, setSaveName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const updateSectorCount = (count: number) => {
    setSectorCount(count);
    const newSectors: WheelSector[] = [];
    
    for (let i = 0; i < count; i++) {
      if (i < sectors.length) {
        newSectors.push(sectors[i]);
      } else {
        newSectors.push({
          id: `sector-${i}`,
          text: `${translations.sector || 'Sector'} ${i + 1}`,
          color: defaultColors[i % defaultColors.length]
        });
      }
    }
    
    onSectorsChange(newSectors);
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditText(sectors[index].text);
  };

  const saveEdit = () => {
    if (editingIndex !== null) {
      const newSectors = [...sectors];
      newSectors[editingIndex] = {
        ...newSectors[editingIndex],
        text: editText
      };
      onSectorsChange(newSectors);
      setEditingIndex(null);
      setEditText('');
    }
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditText('');
  };

  const handleSave = () => {
    if (saveName.trim()) {
      onSave(saveName.trim(), sectors);
      setSaveName('');
      setShowSaveDialog(false);
    }
  };

  const newGame = () => {
    const newSectors: WheelSector[] = [];
    for (let i = 0; i < sectorCount; i++) {
      newSectors.push({
        id: `sector-${i}`,
        text: `${translations.sector || 'Sector'} ${i + 1}`,
        color: defaultColors[i % defaultColors.length]
      });
    }
    onSectorsChange(newSectors);
  };

  return (
    <div className="space-y-4">
      {/* Sector Count Selector */}
      <div className="space-y-2">
        <Label>{translations.sectorCount || 'Number of Sectors'}</Label>
        <NumberSelector
          value={sectorCount}
          min={3}
          max={10}
          onChange={updateSectorCount}
        />
      </div>

      {/* Sector Text Editors */}
      <div className="space-y-2">
        <Label>{translations.sectorTexts || 'Sector Texts'}</Label>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {sectors.map((sector, index) => (
            <div key={sector.id} className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded-full border"
                style={{ backgroundColor: sector.color }}
              />
              
              {editingIndex === index ? (
                <div className="flex-1 flex gap-2">
                  <Textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="flex-1 min-h-[80px] resize-none"
                    placeholder={translations.enterText || 'Enter text'}
                  />
                  <div className="flex flex-col gap-1">
                    <Button
                      size="sm"
                      onClick={saveEdit}
                      className="px-2"
                    >
                      ✓
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={cancelEdit}
                      className="px-2"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="flex-1 text-left justify-start h-auto py-2 px-3"
                  onClick={() => startEditing(index)}
                >
                  <span className="truncate">{sector.text}</span>
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
          <DialogTrigger asChild>
            <Button size="sm" className="flex-1">
              <Save className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{translations.saveWheel || 'Save Wheel'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>{translations.wheelName || 'Wheel Name'}</Label>
                <Input
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  placeholder={translations.enterName || 'Enter name'}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                  {translations.cancel || 'Cancel'}
                </Button>
                <Button onClick={handleSave} disabled={!saveName.trim()}>
                  {translations.save || 'Save'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Button size="sm" onClick={newGame} className="flex-1">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Saved Wheels List */}
      {savedWheels.length > 0 && (
        <div className="space-y-2">
          <Label>{translations.savedWheels || 'Saved Wheels'}</Label>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {savedWheels.map((wheel) => (
              <Button
                key={wheel.id}
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => onLoad(wheel)}
              >
                {wheel.name}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}