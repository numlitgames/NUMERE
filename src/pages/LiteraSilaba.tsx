import React, { useState, useEffect, useMemo, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import ProgressBar from "@/components/educational/ProgressBar";
import GameControls from "@/components/educational/GameControls";
import ZoomControls from "@/components/educational/ZoomControls";
import Timer from "@/components/educational/Timer";
import VerticalSelector from "@/components/educational/VerticalSelector";
import DropZone from "@/components/educational/DropZone";
import EnhancedDropZone from "@/components/educational/EnhancedDropZone";
import SyllableBuilderDropZone from "@/components/educational/SyllableBuilderDropZone";
import WordBuilderDropZone from "@/components/educational/WordBuilderDropZone";
import { Book, PenTool, Volume2, Star, Home, Info, Globe, Play, CheckCircle, XCircle, Keyboard, X } from "lucide-react";
import LiteracyKeyboard from "@/components/educational/LiteracyKeyboard";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Canvas as FabricCanvas, FabricText, FabricImage } from "fabric";
import numLitLogo from "@/assets/numlit-logo-header.png";
import { WritingDirectionManager } from "@/utils/writingDirection";
import { svgLetterComponents } from "@/components/educational/svg-letters";
import useI18n from "@/components/i18n/useI18n";
import { WordEntry, getRandomWordFromCategory } from "@/lib/loadWords";

// Import letter tracing images
import AImage from "@/assets/letters/A.png";
import ĂImage from "@/assets/letters/Ă.png";
import ÂImage from "@/assets/letters/Â.png";
import BImage from "@/assets/letters/B.png";
import CImage from "@/assets/letters/C.png";
import DImage from "@/assets/letters/D.png";
import EImage from "@/assets/letters/E.png";
import FImage from "@/assets/letters/F.png";
import GImage from "@/assets/letters/G.png";
import HImage from "@/assets/letters/H.png";
import IImage from "@/assets/letters/I.png";
import ÎImage from "@/assets/letters/Î.png";
import JImage from "@/assets/letters/J.png";
import KImage from "@/assets/letters/K.png";
import LImage from "@/assets/letters/L.png";
import MImage from "@/assets/letters/M.png";
import NImage from "@/assets/letters/N.png";
import OImage from "@/assets/letters/O.png";
import PImage from "@/assets/letters/P.png";
import QImage from "@/assets/letters/Q.png";
import RImage from "@/assets/letters/R.png";
import SImage from "@/assets/letters/S.png";
import ȘImage from "@/assets/letters/Ș.png";
import TImage from "@/assets/letters/T.png";
import ȚImage from "@/assets/letters/Ț.png";
import UImage from "@/assets/letters/U.png";
import VImage from "@/assets/letters/V.png";
import WImage from "@/assets/letters/W.png";
import XImage from "@/assets/letters/X.png";
import YImage from "@/assets/letters/Y.png";
import ZImage from "@/assets/letters/Z.png";

// Letter images mapping
const letterImages: Record<string, string> = {
  'A': AImage, 'Ă': ĂImage, 'Â': ÂImage, 'B': BImage, 'C': CImage, 'D': DImage,
  'E': EImage, 'F': FImage, 'G': GImage, 'H': HImage, 'I': IImage, 'Î': ÎImage,
  'J': JImage, 'K': KImage, 'L': LImage, 'M': MImage, 'N': NImage, 'O': OImage,
  'P': PImage, 'Q': QImage, 'R': RImage, 'S': SImage, 'Ș': ȘImage, 'T': TImage,
  'Ț': ȚImage, 'U': UImage, 'V': VImage, 'W': WImage, 'X': XImage, 'Y': YImage, 'Z': ZImage
};

// Function to get image or SVG component for a letter
const getLetterImage = (letter: string): string | null => {
  const upperLetter = letter.toUpperCase();
  return letterImages[upperLetter] || null;
};

// Function to get SVG component for a letter
const getSVGComponent = (letter: string) => {
  return svgLetterComponents[letter as keyof typeof svgLetterComponents] || null;
};

// Category translations - using the new i18n system with getAllCategories from loadWords
const categoryTranslations = {
  ar: { animals: { name: "الحيوانات", emoji: "🐾" }, birds_insects: { name: "الطيور والحشرات", emoji: "🦅" }, fruits: { name: "الفواكه", emoji: "🍎" }, vegetables: { name: "الخضروات", emoji: "🥕" }, house_objects: { name: "أشياء المنزل", emoji: "🏠" }, clothing: { name: "الملابس", emoji: "👕" }, body_face: { name: "الجسم والوجه", emoji: "👤" }, nature: { name: "الطبيعة", emoji: "🌞" }, food: { name: "الطعام", emoji: "🍞" }, vehicles: { name: "المركبات", emoji: "🚗" }, actions: { name: "الأفعال", emoji: "🏃" } },
  bg: { animals: { name: "Животни", emoji: "🐾" }, birds_insects: { name: "Птици и насекоми", emoji: "🦅" }, fruits: { name: "Плодове", emoji: "🍎" }, vegetables: { name: "Зеленчуци", emoji: "🥕" }, house_objects: { name: "Домашни предмети", emoji: "🏠" }, clothing: { name: "Дрехи", emoji: "👕" }, body_face: { name: "Тяло и лице", emoji: "👤" }, nature: { name: "Природа", emoji: "🌞" }, food: { name: "Храна", emoji: "🍞" }, vehicles: { name: "Превозни средства", emoji: "🚗" }, actions: { name: "Действия", emoji: "🏃" } },
  cs: { animals: { name: "Zvířata", emoji: "🐾" }, birds_insects: { name: "Ptáci a hmyz", emoji: "🦅" }, fruits: { name: "Ovoce", emoji: "🍎" }, vegetables: { name: "Zelenina", emoji: "🥕" }, house_objects: { name: "Domácí předměty", emoji: "🏠" }, clothing: { name: "Oblečení", emoji: "👕" }, body_face: { name: "Tělo a obličej", emoji: "👤" }, nature: { name: "Příroda", emoji: "🌞" }, food: { name: "Jídlo", emoji: "🍞" }, vehicles: { name: "Vozidla", emoji: "🚗" }, actions: { name: "Činnosti", emoji: "🏃" } },
  de: { animals: { name: "Tiere", emoji: "🐾" }, birds_insects: { name: "Vögel und Insekten", emoji: "🦅" }, fruits: { name: "Früchte", emoji: "🍎" }, vegetables: { name: "Gemüse", emoji: "🥕" }, house_objects: { name: "Haushaltsgegenstände", emoji: "🏠" }, clothing: { name: "Kleidung", emoji: "👕" }, body_face: { name: "Körper und Gesicht", emoji: "👤" }, nature: { name: "Natur", emoji: "🌞" }, food: { name: "Essen", emoji: "🍞" }, vehicles: { name: "Fahrzeuge", emoji: "🚗" }, actions: { name: "Handlungen", emoji: "🏃" } },
  en: { animals: { name: "Animals", emoji: "🐾" }, birds_insects: { name: "Birds & Insects", emoji: "🦅" }, fruits: { name: "Fruits", emoji: "🍎" }, vegetables: { name: "Vegetables", emoji: "🥕" }, house_objects: { name: "House Objects", emoji: "🏠" }, clothing: { name: "Clothing", emoji: "👕" }, body_face: { name: "Body & Face", emoji: "👤" }, nature: { name: "Nature", emoji: "🌞" }, food: { name: "Food", emoji: "🍞" }, vehicles: { name: "Vehicles", emoji: "🚗" }, actions: { name: "Actions", emoji: "🏃" } },
  es: { animals: { name: "Animales", emoji: "🐾" }, birds_insects: { name: "Aves e insectos", emoji: "🦅" }, fruits: { name: "Frutas", emoji: "🍎" }, vegetables: { name: "Verduras", emoji: "🥕" }, house_objects: { name: "Objetos de casa", emoji: "🏠" }, clothing: { name: "Ropa", emoji: "👕" }, body_face: { name: "Cuerpo y cara", emoji: "👤" }, nature: { name: "Naturaleza", emoji: "🌞" }, food: { name: "Comida", emoji: "🍞" }, vehicles: { name: "Vehículos", emoji: "🚗" }, actions: { name: "Acciones", emoji: "🏃" } },
  fr: { animals: { name: "Animaux", emoji: "🐾" }, birds_insects: { name: "Oiseaux et insectes", emoji: "🦅" }, fruits: { name: "Fruits", emoji: "🍎" }, vegetables: { name: "Légumes", emoji: "🥕" }, house_objects: { name: "Objets de maison", emoji: "🏠" }, clothing: { name: "Vêtements", emoji: "👕" }, body_face: { name: "Corps et visage", emoji: "👤" }, nature: { name: "Nature", emoji: "🌞" }, food: { name: "Nourriture", emoji: "🍞" }, vehicles: { name: "Véhicules", emoji: "🚗" }, actions: { name: "Actions", emoji: "🏃" } },
  hu: { animals: { name: "Állatok", emoji: "🐾" }, birds_insects: { name: "Madarak és rovarok", emoji: "🦅" }, fruits: { name: "Gyümölcsök", emoji: "🍎" }, vegetables: { name: "Zöldségek", emoji: "🥕" }, house_objects: { name: "Háztartási tárgyak", emoji: "🏠" }, clothing: { name: "Ruházat", emoji: "👕" }, body_face: { name: "Test és arc", emoji: "👤" }, nature: { name: "Természet", emoji: "🌞" }, food: { name: "Étel", emoji: "🍞" }, vehicles: { name: "Járművek", emoji: "🚗" }, actions: { name: "Cselekvések", emoji: "🏃" } },
  it: { animals: { name: "Animali", emoji: "🐾" }, birds_insects: { name: "Uccelli e insetti", emoji: "🦅" }, fruits: { name: "Frutta", emoji: "🍎" }, vegetables: { name: "Verdure", emoji: "🥕" }, house_objects: { name: "Oggetti di casa", emoji: "🏠" }, clothing: { name: "Abbigliamento", emoji: "👕" }, body_face: { name: "Corpo e viso", emoji: "👤" }, nature: { name: "Natura", emoji: "🌞" }, food: { name: "Cibo", emoji: "🍞" }, vehicles: { name: "Veicoli", emoji: "🚗" }, actions: { name: "Azioni", emoji: "🏃" } },
  ja: { animals: { name: "動物", emoji: "🐾" }, birds_insects: { name: "鳥と虫", emoji: "🦅" }, fruits: { name: "果物", emoji: "🍎" }, vegetables: { name: "野菜", emoji: "🥕" }, house_objects: { name: "家の物", emoji: "🏠" }, clothing: { name: "服", emoji: "👕" }, body_face: { name: "体と顔", emoji: "👤" }, nature: { name: "自然", emoji: "🌞" }, food: { name: "食べ物", emoji: "🍞" }, vehicles: { name: "乗り物", emoji: "🚗" }, actions: { name: "動作", emoji: "🏃" } },
  pl: { animals: { name: "Zwierzęta", emoji: "🐾" }, birds_insects: { name: "Ptaki i owady", emoji: "🦅" }, fruits: { name: "Owoce", emoji: "🍎" }, vegetables: { name: "Warzywa", emoji: "🥕" }, house_objects: { name: "Przedmioty domowe", emoji: "🏠" }, clothing: { name: "Ubrania", emoji: "👕" }, body_face: { name: "Ciało i twarz", emoji: "👤" }, nature: { name: "Natura", emoji: "🌞" }, food: { name: "Jedzenie", emoji: "🍞" }, vehicles: { name: "Pojazdy", emoji: "🚗" }, actions: { name: "Czynności", emoji: "🏃" } },
  pt: { animals: { name: "Animais", emoji: "🐾" }, birds_insects: { name: "Aves e insetos", emoji: "🦅" }, fruits: { name: "Frutas", emoji: "🍎" }, vegetables: { name: "Verduras", emoji: "🥕" }, house_objects: { name: "Objetos de casa", emoji: "🏠" }, clothing: { name: "Roupas", emoji: "👕" }, body_face: { name: "Corpo e rosto", emoji: "👤" }, nature: { name: "Natureza", emoji: "🌞" }, food: { name: "Comida", emoji: "🍞" }, vehicles: { name: "Veículos", emoji: "🚗" }, actions: { name: "Ações", emoji: "🏃" } },
  ro: { animals: { name: "Animale", emoji: "🐾" }, birds_insects: { name: "Păsări și insecte", emoji: "🦅" }, fruits: { name: "Fructe", emoji: "🍎" }, vegetables: { name: "Legume și plante", emoji: "🥕" }, house_objects: { name: "Obiecte din casă", emoji: "🏠" }, clothing: { name: "Îmbrăcăminte", emoji: "👕" }, body_face: { name: "Corp și față", emoji: "👤" }, nature: { name: "Natură", emoji: "🌞" }, food: { name: "Alimente", emoji: "🍞" }, vehicles: { name: "Vehicule", emoji: "🚗" }, actions: { name: "Acțiuni", emoji: "🏃" } },
  ru: { animals: { name: "Животные", emoji: "🐾" }, birds_insects: { name: "Птицы и насекомые", emoji: "🦅" }, fruits: { name: "Фрукты", emoji: "🍎" }, vegetables: { name: "Овощи", emoji: "🥕" }, house_objects: { name: "Домашние предметы", emoji: "🏠" }, clothing: { name: "Одежда", emoji: "👕" }, body_face: { name: "Тело и лицо", emoji: "👤" }, nature: { name: "Природа", emoji: "🌞" }, food: { name: "Еда", emoji: "🍞" }, vehicles: { name: "Транспорт", emoji: "🚗" }, actions: { name: "Действия", emoji: "🏃" } },
  zh: { animals: { name: "动物", emoji: "🐾" }, birds_insects: { name: "鸟类和昆虫", emoji: "🦅" }, fruits: { name: "水果", emoji: "🍎" }, vegetables: { name: "蔬菜", emoji: "🥕" }, house_objects: { name: "家居用品", emoji: "🏠" }, clothing: { name: "服装", emoji: "👕" }, body_face: { name: "身体和面部", emoji: "👤" }, nature: { name: "自然", emoji: "🌞" }, food: { name: "食物", emoji: "🍞" }, vehicles: { name: "交通工具", emoji: "🚗" }, actions: { name: "动作", emoji: "🏃" } },
  tr: { animals: { name: "Hayvanlar", emoji: "🐾" }, birds_insects: { name: "Kuşlar ve Böcekler", emoji: "🦅" }, fruits: { name: "Meyveler", emoji: "🍎" }, vegetables: { name: "Sebzeler", emoji: "🥕" }, house_objects: { name: "Ev Eşyaları", emoji: "🏠" }, clothing: { name: "Kıyafetler", emoji: "👕" }, body_face: { name: "Vücut ve Yüz", emoji: "👤" }, nature: { name: "Doğa", emoji: "🌞" }, food: { name: "Yiyecek", emoji: "🍞" }, vehicles: { name: "Araçlar", emoji: "🚗" }, actions: { name: "Eylemler", emoji: "🏃" } }
};

// Complete translations for all 16 supported languages
const translations = {
  ar: {
    flag: "🇸🇦", name: "العربية", title: "حرف - مقطع ✨",
    subtitle: "تطوير مهارات التعرف على الحروف والمقاطع من خلال الألعاب التفاعلية",
    slogan: "تدريب العقل", instructions: "التعليمات",
    howToPlayTitle: "كيفية اللعب", 
    howToPlay: "اختر حرفًا وطور مهارات التعرف على الحروف الكبيرة والصغيرة من خلال الأنشطة التفاعلية.",
    back: "العودة", language: "اللغة", level: "المستوى",
    letterLabel: "اختر الحرف", progressLabel: "التقدم",
    displayMode: "وضع العرض", largeSmall: "كبير + صغير", largeOnly: "كبير فقط", smallOnly: "صغير فقط",
    letterCount: "عدد الحروف", mixedLetters: "الحروف المختلطة", upperCase: "الحروف الكبيرة", lowerCase: "الحروف الصغيرة",
    vowels: "حروف العلة", consonants: "الحروف الساكنة",
    dragLettersHere: "اسحب الحروف هنا", gameComplete: "اللعبة مكتملة!", nextRound: "الجولة التالية",
    startGameMessage: "اضغط 'Play' لبدء اللعبة!", selectLetterMessage: "اختر حرفًا", 
    completeContainers: "أكمل كلا الحاويتين!", congratulations: "تهانينا! إجابة صحيحة!", checkPlacement: "تحقق من وضع الحروف مرة أخرى!",
    showGuidance: "عرض", hideGuidance: "إخفاء", alphabetPosition: "الموضع في الأبجدية",
    letterSelectionMode: "وضع اختيار الحروف", automaticMode: "تلقائي", manualMode: "يدوي", addLetter: "إضافة حرف", removeLetter: "إزالة", selectedLetters: "الحروف المحددة",
    // Level 4 specific translations
    chosenWord: "الكلمة المختارة", wordFound: "الكلمة الموجودة", syllableBreakdown: "تقسيم المقاطع",
    chooseCategory: "اختر الفئة", wordLetterCount: "عدد الحروف",
    dragLettersFromWord: "اسحب الحروف من \"الكلمة الموجودة\" لتكوين المقاطع", addHyphen: "أضف الشرطة (-)",
    levels: { beginner: "لنتعرف على الحرف", easy: "حرف علة/حرف ساكن", medium: "نكوّن مقاطع", hard: "تقسيم المقاطع" },
    letters: "أبتثجحخدذرزسشصضطظعغفقكلمنهوي"
  },
  bg: {
    flag: "🇧🇬", name: "Български", title: "Буква - Сричка ✨",
    subtitle: "Развивайте умения за разпознаване на букви и срички чрез интерактивни игри",
    slogan: "Тренирайте Ума", instructions: "Инструкции",
    howToPlayTitle: "Как да играете",
    howToPlay: "Изберете буква и развийте умения за разпознаване на главни и малки букви чрез интерактивни дейности.",
    back: "Назад", language: "Език", level: "Ниво",
    letterLabel: "Изберете буква", progressLabel: "Прогрес",
    displayMode: "Режим на показване", largeSmall: "Голяма + малка", largeOnly: "Само голяма", smallOnly: "Само малка",
    letterCount: "Брой букви", mixedLetters: "Смесени букви", upperCase: "Главни букви", lowerCase: "Малки букви",
    vowels: "Гласни", consonants: "Съгласни",
    dragLettersHere: "Плъзнете буквите тук", gameComplete: "Играта е завършена!", nextRound: "Следващ кръг",
    startGameMessage: "Натиснете 'Play' за да започнете играта!", selectLetterMessage: "Изберете буква",
    completeContainers: "Попълнете и двата контейнера!", congratulations: "Поздравления! Правилен отговор!", checkPlacement: "Проверете отново поставянето на буквите!",
    showGuidance: "Показано", hideGuidance: "Скрито", alphabetPosition: "Позиция в азбуката",
    letterSelectionMode: "Режим избор букви", automaticMode: "Автоматичен", manualMode: "Ръчен", addLetter: "Добави буква", removeLetter: "Премахни", selectedLetters: "Избрани букви",
    // Level 4 specific translations
    chosenWord: "Избраната дума", wordFound: "Намерената дума", syllableBreakdown: "Разделяне на срички",
    chooseCategory: "Изберете категория", wordLetterCount: "Брой букви",
    levels: { beginner: "Да опознаем буквата", easy: "Гласна/Съгласна", medium: "Образуваме срички", hard: "Разделяне на срички" },
    letters: "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЬЮЯ"
  },
  cs: {
    flag: "🇨🇿", name: "Čeština", title: "Písmeno - Slabika ✨",
    subtitle: "Rozvíjejte dovednosti rozpoznávání písmen a slabik prostřednictvím interaktivních her",
    slogan: "Trénujte Mozek", instructions: "Instrukce",
    howToPlayTitle: "Jak hrát",
    howToPlay: "Vyberte písmeno a rozvíjejte dovednosti rozpoznávání velkých a malých písmen prostřednictvím interaktivních aktivit.",
    back: "Zpět", language: "Jazyk", level: "Úroveň",
    letterLabel: "Vyberte písmeno", progressLabel: "Pokrok",
    displayMode: "Režim zobrazení", largeSmall: "Velké + malé", largeOnly: "Pouze velké", smallOnly: "Pouze malé",
    letterCount: "Počet písmen", mixedLetters: "Smíšená písmena", upperCase: "Velká písmena", lowerCase: "Malá písmena",
    vowels: "Samohlásky", consonants: "Souhlásky",
    dragLettersHere: "Přetáhněte písmena sem", gameComplete: "Hra dokončena!", nextRound: "Další kolo",
    startGameMessage: "Stiskněte 'Play' pro začátek hry!", selectLetterMessage: "Vyberte písmeno",
    completeContainers: "Dokončete oba kontejnery!", congratulations: "Gratulujeme! Správná odpověď!", checkPlacement: "Zkontrolujte znovu umístění písmen!",
    showGuidance: "Zobrazeno", hideGuidance: "Skryto", alphabetPosition: "Pozice v abecedě",
    letterSelectionMode: "Režim výběru písmen", automaticMode: "Automatický", manualMode: "Ruční", addLetter: "Přidat písmeno", removeLetter: "Odebrat", selectedLetters: "Vybraná písmena",
    levels: { beginner: "Poznejme písmeno", easy: "Samohláska/Souhláska", medium: "Tvoříme slabiky", hard: "Rozdělení slabik" },
    letters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  },
  de: {
    flag: "🇩🇪", name: "Deutsch", title: "Buchstabe - Silbe ✨",
    subtitle: "Entwickeln Sie Fähigkeiten zur Buchstaben- und Silbenerkennung durch interaktive Spiele",
    slogan: "Trainiere das Gehirn", instructions: "Anweisungen",
    howToPlayTitle: "Wie man spielt",
    howToPlay: "Wählen Sie einen Buchstaben und entwickeln Sie Fähigkeiten zur Erkennung von Groß- und Kleinbuchstaben durch interaktive Aktivitäten.",
    back: "Zurück", language: "Sprache", level: "Stufe",
    letterLabel: "Buchstaben wählen", progressLabel: "Fortschritt",
    displayMode: "Anzeigemodus", largeSmall: "Groß + klein", largeOnly: "Nur groß", smallOnly: "Nur klein",
    letterCount: "Buchstabenanzahl", mixedLetters: "Gemischte Buchstaben", upperCase: "Großbuchstaben", lowerCase: "Kleinbuchstaben",
    vowels: "Vokale", consonants: "Konsonanten",
    dragLettersHere: "Buchstaben hierher ziehen", gameComplete: "Spiel abgeschlossen!", nextRound: "Nächste Runde",
    startGameMessage: "Drücken Sie 'Play' um das Spiel zu starten!", selectLetterMessage: "Wählen Sie einen Buchstaben",
    completeContainers: "Vervollständigen Sie beide Container!", congratulations: "Herzlichen Glückwunsch! Richtige Antwort!", checkPlacement: "Überprüfen Sie erneut die Platzierung der Buchstaben!",
    showGuidance: "Angezeigt", hideGuidance: "Versteckt", alphabetPosition: "Position im Alphabet",
    letterSelectionMode: "Buchstabenauswahlmodus", automaticMode: "Automatisch", manualMode: "Manuell", addLetter: "Buchstabe hinzufügen", removeLetter: "Entfernen", selectedLetters: "Ausgewählte Buchstaben",
    levels: { beginner: "Buchstaben kennenlernen", easy: "Vokal/Konsonant", medium: "Silben bilden", hard: "Silbentrennung" },
    letters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  },
  en: {
    flag: "🇺🇸", name: "English", title: "Letter - Syllable ✨",
    subtitle: "Develop letter and syllable recognition skills through interactive games",
    slogan: "Train the Brain", instructions: "Instructions",
    howToPlayTitle: "How to play",
    howToPlay: "Choose a letter and develop uppercase and lowercase recognition skills through interactive activities.",
    back: "Back", language: "Language", level: "Level",
    letterLabel: "Choose letter", progressLabel: "Progress",
    displayMode: "Display Mode", largeSmall: "Upper + Lower", largeOnly: "Upper Only", smallOnly: "Lower Only",
    letterCount: "Letter Count", mixedLetters: "Mixed Letters", upperCase: "Uppercase Letters", lowerCase: "Lowercase Letters",
    vowels: "Vowels", consonants: "Consonants",
    dragLettersHere: "Drag letters here", gameComplete: "Game Complete!", nextRound: "Next Round",
    startGameMessage: "Press 'Play' to start the game!", selectLetterMessage: "Select a letter",
    completeContainers: "Complete both containers!", congratulations: "Congratulations! Correct answer!", checkPlacement: "Check the letter placement again!",
    showGuidance: "Shown", hideGuidance: "Hidden", alphabetPosition: "Alphabet position",
    letterSelectionMode: "Letter Selection Mode", automaticMode: "Automatic", manualMode: "Manual", addLetter: "Add Letter", removeLetter: "Remove", selectedLetters: "Selected Letters",
    // Level 4 specific translations
    chosenWord: "Chosen Word", wordFound: "Word Found", syllableBreakdown: "Syllable Breakdown",
    chooseCategory: "Choose Category", wordLetterCount: "Letter Count",
    dragLettersFromWord: "Drag letters from \"Word Found\" to form syllables", addHyphen: "Add Hyphen (-)",
    levels: { beginner: "Know the Letter", easy: "Vowel Consonant", medium: "Form Syllables", hard: "Syllable Breakdown" },
    letters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  },
  es: {
    flag: "🇪🇸", name: "Español", title: "Letra - Sílaba ✨",
    subtitle: "Desarrolla habilidades de reconocimiento de letras y sílabas a través de juegos interactivos",
    slogan: "Entrena la Mente", instructions: "Instrucciones",
    howToPlayTitle: "Cómo jugar",
    howToPlay: "Elige una letra y desarrolla habilidades de reconocimiento de mayúsculas y minúsculas a través de actividades interactivas.",
    back: "Atrás", language: "Idioma", level: "Nivel",
    letterLabel: "Elegir letra", progressLabel: "Progreso",
    displayMode: "Modo de Visualización", largeSmall: "Mayúscula + minúscula", largeOnly: "Solo mayúscula", smallOnly: "Solo minúscula",
    letterCount: "Cantidad de Letras", mixedLetters: "Letras Mezcladas", upperCase: "Letras Mayúsculas", lowerCase: "Letras Minúsculas",
    vowels: "Vocales", consonants: "Consonantes",
    dragLettersHere: "Arrastra las letras aquí", gameComplete: "¡Juego Completado!", nextRound: "Siguiente Ronda",
    startGameMessage: "¡Presiona 'Play' para comenzar el juego!", selectLetterMessage: "Selecciona una letra",
    completeContainers: "¡Completa ambos contenedores!", congratulations: "¡Felicitaciones! ¡Respuesta correcta!", checkPlacement: "¡Verifica nuevamente la colocación de las letras!",
    showGuidance: "Mostrado", hideGuidance: "Oculto", alphabetPosition: "Posición en el alfabeto",
    letterSelectionMode: "Modo Selección Letras", automaticMode: "Automático", manualMode: "Manual", addLetter: "Agregar Letra", removeLetter: "Eliminar", selectedLetters: "Letras Seleccionadas",
    levels: { beginner: "Conozcamos la letra", easy: "Vocal/Consonante", medium: "Formamos sílabas", hard: "División en Sílabas" },
    letters: "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ"
  },
  fr: {
    flag: "🇫🇷", name: "Français", title: "Lettre - Syllabe ✨",
    subtitle: "Développez les compétences de reconnaissance des lettres et syllabes grâce à des jeux interactifs",
    slogan: "Entraînez le Cerveau", instructions: "Instructions",
    howToPlayTitle: "Comment jouer",
    howToPlay: "Choisissez une lettre et développez les compétences de reconnaissance des majuscules et minuscules grâce à des activités interactives.",
    back: "Retour", language: "Langue", level: "Niveau",
    letterLabel: "Choisir la lettre", progressLabel: "Progrès",
    displayMode: "Mode d'Affichage", largeSmall: "Majuscule + minuscule", largeOnly: "Majuscule seulement", smallOnly: "Minuscule seulement",
    letterCount: "Nombre de Lettres", mixedLetters: "Lettres Mélangées", upperCase: "Lettres Majuscules", lowerCase: "Lettres Minuscules",
    vowels: "Voyelles", consonants: "Consonnes",
    dragLettersHere: "Glissez les lettres ici", gameComplete: "Jeu Terminé!", nextRound: "Tour Suivant",
    startGameMessage: "Appuyez sur 'Play' pour commencer le jeu!", selectLetterMessage: "Sélectionnez une lettre",
    completeContainers: "Complétez les deux conteneurs!", congratulations: "Félicitations! Bonne réponse!", checkPlacement: "Vérifiez à nouveau le placement des lettres!",
    showGuidance: "Affiché", hideGuidance: "Masqué", alphabetPosition: "Position dans l'alphabet",
    letterSelectionMode: "Mode Sélection Lettres", automaticMode: "Automatique", manualMode: "Manuel", addLetter: "Ajouter Lettre", removeLetter: "Supprimer", selectedLetters: "Lettres Sélectionnées",
    levels: { beginner: "Découvrir la lettre", easy: "Voyelle/Consonne", medium: "Former des syllabes", hard: "Division Syllabique" },
    letters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  },
  hi: {
    flag: "🇮🇳", name: "हिंदी", title: "अक्षर - अक्षर ✨",
    subtitle: "इंटरैक्टिव गेम्स के माध्यम से अक्षर और शब्दांश पहचान कौशल विकसित करें",
    slogan: "मस्तिष्क को प्रशिक्षित करें", instructions: "निर्देश",
    howToPlayTitle: "कैसे खेलें",
    howToPlay: "एक अक्षर चुनें और इंटरैक्टिव गतिविधियों के माध्यम से बड़े और छोटे अक्षर पहचान कौशल विकसित करें।",
    back: "वापस", language: "भाषा", level: "स्तर",
    letterLabel: "अक्षर चुनें", progressLabel: "प्रगति",
    displayMode: "प्रदर्शन मोड", largeSmall: "बड़ा + छोटा", largeOnly: "केवल बड़ा", smallOnly: "केवल छोटा",
    letterCount: "अक्षर संख्या", mixedLetters: "मिश्रित अक्षर", upperCase: "बड़े अक्षर", lowerCase: "छोटे अक्षर",
    vowels: "स्वर", consonants: "व्यंजन",
    dragLettersHere: "अक्षरों को यहाँ खींचें", gameComplete: "खेल पूरा!", nextRound: "अगला दौर",
    startGameMessage: "खेल शुरू करने के लिए 'Play' दबाएं!", selectLetterMessage: "एक अक्षर चुनें",
    completeContainers: "दोनों कंटेनर पूरे करें!", congratulations: "बधाई हो! सही उत्तर!", checkPlacement: "अक्षरों की स्थिति फिर से जांचें!",
    showGuidance: "दिखाया गया", hideGuidance: "छुपाया गया", alphabetPosition: "वर्णमाला में स्थिति",
    letterSelectionMode: "अक्षर चयन मोड", automaticMode: "स्वचालित", manualMode: "मैनुअल", addLetter: "अक्षर जोड़ें", removeLetter: "हटाएं", selectedLetters: "चुने गए अक्षर",
    levels: { beginner: "अक्षर को जानें", easy: "स्वर/व्यंजन", medium: "सिलेबल बनाएं", hard: "सिलेबल विभाजन" },
    letters: "अआइईउऊऋएऐओऔकखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह"
  },
  hu: {
    flag: "🇭🇺", name: "Magyar", title: "Betű - Szótag ✨",
    subtitle: "Fejlessze a betű- és szótagfelismerési készségeket interaktív játékokon keresztül",
    slogan: "Edzze az Agyat", instructions: "Utasítások",
    howToPlayTitle: "Hogyan kell játszani",
    howToPlay: "Válasszon egy betűt és fejlessze a nagy- és kisbetű felismerési készségeit interaktív tevékenységeken keresztül.",
    back: "Vissza", language: "Nyelv", level: "Szint",
    letterLabel: "Betű kiválasztása", progressLabel: "Haladás",
    displayMode: "Megjelenítési mód", largeSmall: "Nagy + kicsi", largeOnly: "Csak nagy", smallOnly: "Csak kicsi",
    letterCount: "Betűszám", mixedLetters: "Kevert betűk", upperCase: "Nagybetűk", lowerCase: "Kisbetűk",
    vowels: "Magánhangzók", consonants: "Mássalhangzók",
    dragLettersHere: "Húzza ide a betűket", gameComplete: "Játék befejezve!", nextRound: "Következő kör",
    startGameMessage: "Nyomja meg a 'Play' gombot a játék indításához!", selectLetterMessage: "Válasszon egy betűt",
    completeContainers: "Töltse ki mindkét tárolót!", congratulations: "Gratulálunk! Helyes válasz!", checkPlacement: "Ellenőrizze újra a betűk elhelyezését!",
    showGuidance: "Megjelenítve", hideGuidance: "Elrejtve", alphabetPosition: "Pozíció az ábécében",
    letterSelectionMode: "Betűválasztás módja", automaticMode: "Automatikus", manualMode: "Kézi", addLetter: "Betű hozzáadása", removeLetter: "Eltávolítás", selectedLetters: "Kiválasztott betűk",
    levels: { beginner: "Ismerjük meg a betűt", easy: "Magánhangzó/Mássalhangzó", medium: "Szótagokat alkotunk", hard: "Szótagolás" },
    letters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  },
  it: {
    flag: "🇮🇹", name: "Italiano", title: "Lettera - Sillaba ✨",
    subtitle: "Sviluppa le competenze di riconoscimento di lettere e sillabe attraverso giochi interattivi",
    slogan: "Allena la Mente", instructions: "Istruzioni",
    howToPlayTitle: "Come giocare",
    howToPlay: "Scegli una lettera e sviluppa le competenze di riconoscimento di maiuscole e minuscole attraverso attività interattive.",
    back: "Indietro", language: "Lingua", level: "Livello",
    letterLabel: "Scegli lettera", progressLabel: "Progresso",
    displayMode: "Modalità di Visualizzazione", largeSmall: "Maiuscola + minuscola", largeOnly: "Solo maiuscola", smallOnly: "Solo minuscola",
    letterCount: "Numero di Lettere", mixedLetters: "Lettere Miste", upperCase: "Lettere Maiuscole", lowerCase: "Lettere Minuscole",
    vowels: "Vocali", consonants: "Consonanti",
    dragLettersHere: "Trascina le lettere qui", gameComplete: "Gioco Completato!", nextRound: "Prossimo Round",
    startGameMessage: "Premi 'Play' per iniziare il gioco!", selectLetterMessage: "Seleziona una lettera",
    completeContainers: "Completa entrambi i contenitori!", congratulations: "Congratulazioni! Risposta corretta!", checkPlacement: "Controlla di nuovo il posizionamento delle lettere!",
    showGuidance: "Mostrato", hideGuidance: "Nascosto", alphabetPosition: "Posizione nell'alfabeto",
    letterSelectionMode: "Modalità Selezione Lettere", automaticMode: "Automatica", manualMode: "Manuale", addLetter: "Aggiungi Lettera", removeLetter: "Rimuovi", selectedLetters: "Lettere Selezionate",
    levels: { beginner: "Conosciamo la lettera", easy: "Vocale/Consonante", medium: "Formiamo sillabe", hard: "Suddivisione Sillabica" },
    letters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  },
  ja: {
    flag: "🇯🇵", name: "日本語", title: "文字 - 音節 ✨",
    subtitle: "インタラクティブなゲームを通じて文字と音節の認識スキルを開発する",
    slogan: "脳を鍛える", instructions: "説明書",
    howToPlayTitle: "遊び方",
    howToPlay: "文字を選んで、インタラクティブな活動を通じて大文字と小文字の認識スキルを開発してください。",
    back: "戻る", language: "言語", level: "レベル",
    letterLabel: "文字を選択", progressLabel: "進歩",
    displayMode: "表示モード", largeSmall: "大文字 + 小文字", largeOnly: "大文字のみ", smallOnly: "小文字のみ",
    letterCount: "文字数", mixedLetters: "混合文字", upperCase: "大文字", lowerCase: "小文字",
    vowels: "母音", consonants: "子音",
    dragLettersHere: "文字をここにドラッグ", gameComplete: "ゲーム完了！", nextRound: "次のラウンド",
    startGameMessage: "'Play'を押してゲームを開始！", selectLetterMessage: "文字を選択してください",
    completeContainers: "両方のコンテナを完成させてください！", congratulations: "おめでとうございます！正解です！", checkPlacement: "文字の配置をもう一度確認してください！",
    showGuidance: "表示", hideGuidance: "非表示", alphabetPosition: "アルファベット位置",
    letterSelectionMode: "文字選択モード", automaticMode: "自動", manualMode: "手動", addLetter: "文字を追加", removeLetter: "削除", selectedLetters: "選択された文字",
    levels: { beginner: "文字を知ろう", easy: "母音/子音", medium: "音節を作ろう", hard: "音節分割" },
    letters: "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん"
  },
  pl: {
    flag: "🇵🇱", name: "Polski", title: "Litera - Sylaba ✨",
    subtitle: "Rozwijaj umiejętności rozpoznawania liter i sylab poprzez interaktywne gry",
    slogan: "Trenuj Mózg", instructions: "Instrukcje",
    howToPlayTitle: "Jak grać",
    howToPlay: "Wybierz literę i rozwijaj umiejętności rozpoznawania wielkich i małych liter poprzez interaktywne działania.",
    back: "Wstecz", language: "Język", level: "Poziom",
    letterLabel: "Wybierz literę", progressLabel: "Postęp",
    displayMode: "Tryb wyświetlania", largeSmall: "Wielka + mała", largeOnly: "Tylko wielka", smallOnly: "Tylko mała",
    letterCount: "Liczba liter", mixedLetters: "Mieszane litery", upperCase: "Wielkie litery", lowerCase: "Małe litery",
    vowels: "Samogłoski", consonants: "Spółgłoski",
    dragLettersHere: "Przeciągnij litery tutaj", gameComplete: "Gra ukończona!", nextRound: "Następna runda",
    startGameMessage: "Naciśnij 'Play' aby rozpocząć grę!", selectLetterMessage: "Wybierz literę",
    completeContainers: "Wypełnij oba pojemniki!", congratulations: "Gratulacje! Poprawna odpowiedź!", checkPlacement: "Sprawdź ponownie umieszczenie liter!",
    showGuidance: "Pokazane", hideGuidance: "Ukryte", alphabetPosition: "Pozycja w alfabecie",
    letterSelectionMode: "Tryb wyboru liter", automaticMode: "Automatyczny", manualMode: "Ręczny", addLetter: "Dodaj literę", removeLetter: "Usuń", selectedLetters: "Wybrane litery",
    levels: { beginner: "Poznajmy literę", easy: "Samogłoska/Spółgłoska", medium: "Tworzymy sylaby", hard: "Podział na Sylaby" },
    letters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  },
  pt: {
    flag: "🇵🇹", name: "Português", title: "Letra - Sílaba ✨",
    subtitle: "Desenvolva habilidades de reconhecimento de letras e sílabas através de jogos interativos",
    slogan: "Treine o Cérebro", instructions: "Instruções",
    howToPlayTitle: "Como jogar",
    howToPlay: "Escolha uma letra e desenvolva habilidades de reconhecimento de maiúsculas e minúsculas através de atividades interativas.",
    back: "Voltar", language: "Idioma", level: "Nível",
    letterLabel: "Escolher letra", progressLabel: "Progresso",
    displayMode: "Modo de Exibição", largeSmall: "Maiúscula + minúscula", largeOnly: "Apenas maiúscula", smallOnly: "Apenas minúscula",
    letterCount: "Número de Letras", mixedLetters: "Letras Misturadas", upperCase: "Letras Maiúsculas", lowerCase: "Letras Minúsculas",
    vowels: "Vogais", consonants: "Consoantes",
    dragLettersHere: "Arraste as letras aqui", gameComplete: "Jogo Concluído!", nextRound: "Próxima Rodada",
    startGameMessage: "Pressione 'Play' para iniciar o jogo!", selectLetterMessage: "Selecione uma letra",
    completeContainers: "Complete ambos os recipientes!", congratulations: "Parabéns! Resposta correta!", checkPlacement: "Verifique novamente a colocação das letras!",
    showGuidance: "Mostrado", hideGuidance: "Oculto", alphabetPosition: "Posição no alfabeto",
    letterSelectionMode: "Modo Seleção Letras", automaticMode: "Automático", manualMode: "Manual", addLetter: "Adicionar Letra", removeLetter: "Remover", selectedLetters: "Letras Selecionadas",
    levels: { beginner: "Vamos conhecer a letra", easy: "Vogal/Consoante", medium: "Formar sílabas", hard: "Divisão Silábica" },
    letters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  },
  ro: {
    flag: "🇷🇴", name: "Română", title: "Litera - Silaba ✨",
    subtitle: "Dezvoltă abilitățile de recunoaștere a literelor și silabelor prin jocuri interactive",
    slogan: "Antrenează Creierul", instructions: "Instrucțiuni",
    howToPlayTitle: "Cum să joci",
    howToPlay: "Alege o literă și dezvoltă abilitățile de recunoaștere a literelor mari și mici prin activități interactive.",
    back: "Înapoi", language: "Limbă", level: "Nivel",
    letterLabel: "Alege litera", progressLabel: "Progres",
    displayMode: "Mod de Afișare", largeSmall: "Mare + mică", largeOnly: "Doar mare", smallOnly: "Doar mică",
    letterCount: "Numărul de Litere", mixedLetters: "Literele Amestecate", upperCase: "Litere Mari", lowerCase: "Litere Mici",
    vowels: "Vocale", consonants: "Consoane", syllables: "Silabe", words: "Cuvinte",
    dragLettersHere: "Trage literele aici", gameComplete: "Jocul s-a terminat!", nextRound: "Următoarea rundă",
    startGameMessage: "Apasă 'Play' pentru a începe jocul!", selectLetterMessage: "Selectează o literă",
    completeContainers: "Completează ambele containere!", congratulations: "Felicitări! Răspuns corect!", checkPlacement: "Verifică din nou plasarea literelor!",
    showGuidance: "Afișat", hideGuidance: "Ascuns", alphabetPosition: "Poziția în alfabet",
    letterSelectionMode: "Mod Selecție Litere", automaticMode: "Automat", manualMode: "Manual", addLetter: "Adaugă Literă", removeLetter: "Elimină", selectedLetters: "Litere Selectate",
    // Level 4 specific translations
    chosenWord: "Cuvântul Ales", wordFound: "Cuvântul Găsit", syllableBreakdown: "Despărțire în Silabe",
    chooseCategory: "Alege categoria", wordLetterCount: "Numărul de litere",
    dragLettersFromWord: "Trage literele din \"Cuvântul Găsit\" pentru a forma silabe", addHyphen: "Adaugă Cratimă (-)",
    // Additional UI translations
    letterMoved: "Litera mutată:", syllableInFormation: "Silaba în formare", 
    selectMoreLetters: "Selectează {0} litere mai mult", lastSyllableFormed: "Ultima silabă formată:",
    selectCategoryToStart: "Selectează o categorie pentru a începe", 
    letterPlacedCorrectly: "Litera {0} plasată corect!", letterMovedToSyllables: "Litera {0} mutată în silabe!",
    letterReturnedToWord: "Litera {0} returnată în cuvânt!", clickToDeleteHyphen: "Click pentru a șterge cratima",
    clickToReturnLetter: "Click pentru a returna litera", selectedLetter: "Litera Selectată",
    selectedSyllable: "Silaba Selectată", numberOfLetters: "Numărul de litere", 
    backToMainMenu: "Înapoi la meniul principal", lastSyllable: "Ultima silabă:",
    levels: { beginner: "Să cunoaștem Litera", easy: "Vocală Consoană", medium: "Formăm Silabe", hard: "Despărțire în Silabe" },
    letters: "ABCDEFGHIJKLMNOPQRSTUVWXYZĂÂÎȘȚ"
  },
  ru: {
    flag: "🇷🇺", name: "Русский", title: "Буква - Слог ✨",
    subtitle: "Развивайте навыки распознавания букв и слогов через интерактивные игры",
    slogan: "Тренируйте Мозг", instructions: "Инструкции",
    howToPlayTitle: "Как играть",
    howToPlay: "Выберите букву и развивайте навыки распознавания заглавных и строчных букв через интерактивные активности.",
    back: "Назад", language: "Язык", level: "Уровень",
    letterLabel: "Выберите букву", progressLabel: "Прогресс",
    displayMode: "Режим отображения", largeSmall: "Заглавная + строчная", largeOnly: "Только заглавная", smallOnly: "Только строчная",
    letterCount: "Количество букв", mixedLetters: "Смешанные буквы", upperCase: "Заглавные буквы", lowerCase: "Строчные буквы",
    vowels: "Гласные", consonants: "Согласные",
    dragLettersHere: "Перетащите буквы сюда", gameComplete: "Игра завершена!", nextRound: "Следующий раунд",
    startGameMessage: "Нажмите 'Play' чтобы начать игру!", selectLetterMessage: "Выберите букву",
    completeContainers: "Заполните оба контейнера!", congratulations: "Поздравляем! Правильный ответ!", checkPlacement: "Проверьте снова размещение букв!",
    showGuidance: "Показано", hideGuidance: "Скрыто", alphabetPosition: "Позиция в алфавите",
    letterSelectionMode: "Режим выбора букв", automaticMode: "Автоматический", manualMode: "Ручной", addLetter: "Добавить букву", removeLetter: "Удалить", selectedLetters: "Выбранные буквы",
    levels: { beginner: "Познакомимся с буквой", easy: "Гласная/Согласная", medium: "Составляем слоги", hard: "Разделение на слоги" },
    letters: "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ"
  },
  zh: {
    flag: "🇨🇳", name: "中文", title: "字母 - 音节 ✨",
    subtitle: "通过互动游戏培养字母和音节识别技能",
    slogan: "训练大脑", instructions: "说明",
    howToPlayTitle: "如何游戏",
    howToPlay: "选择一个字母，通过互动活动培养大小写识别技能。",
    back: "返回", language: "语言", level: "水平",
    letterLabel: "选择字母", progressLabel: "进度",
    displayMode: "显示模式", largeSmall: "大写 + 小写", largeOnly: "仅大写", smallOnly: "仅小写",
    letterCount: "字母数量", mixedLetters: "混合字母", upperCase: "大写字母", lowerCase: "小写字母",
    vowels: "元音", consonants: "辅音",
    dragLettersHere: "将字母拖到这里", gameComplete: "游戏完成！", nextRound: "下一轮",
    startGameMessage: "按'Play'开始游戏！", selectLetterMessage: "选择一个字母",
    completeContainers: "完成两个容器！", congratulations: "恭喜！答案正确！", checkPlacement: "再次检查字母位置！",
    showGuidance: "显示", hideGuidance: "隐藏", alphabetPosition: "字母表位置",
    letterSelectionMode: "字母选择模式", automaticMode: "自动", manualMode: "手动", addLetter: "添加字母", removeLetter: "删除", selectedLetters: "已选字母",
    levels: { beginner: "认识字母", easy: "元音/辅音", medium: "组成音节", hard: "音节分割" },
    letters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  },
  tr: {
    flag: "🇹🇷", name: "Türkçe", title: "Harf - Hece ✨",
    subtitle: "İnteraktif oyunlar aracılığıyla harf ve hece tanıma becerilerini geliştirin",
    slogan: "Beyni Eğitin", instructions: "Talimatlar",
    howToPlayTitle: "Nasıl oynanır",
    howToPlay: "Bir harf seçin ve interaktif aktiviteler aracılığıyla büyük ve küçük harf tanıma becerilerini geliştirin.",
    back: "Geri", language: "Dil", level: "Seviye",
    letterLabel: "Harf seçin", progressLabel: "İlerleme",
    displayMode: "Görüntüleme Modu", largeSmall: "Büyük + küçük", largeOnly: "Sadece büyük", smallOnly: "Sadece küçük",
    letterCount: "Harf Sayısı", mixedLetters: "Karışık Harfler", upperCase: "Büyük Harfler", lowerCase: "Küçük Harfler",
    vowels: "Sesli Harfler", consonants: "Sessiz Harfler",
    dragLettersHere: "Harfleri buraya sürükleyin", gameComplete: "Oyun Tamamlandı!", nextRound: "Sonraki Tur",
    startGameMessage: "Oyunu başlatmak için 'Play' tuşuna basın!", selectLetterMessage: "Bir harf seçin",
    completeContainers: "Her iki kapsayıcıyı da tamamlayın!", congratulations: "Tebrikler! Doğru cevap!", checkPlacement: "Harf yerleşimini tekrar kontrol edin!",
    showGuidance: "Gösterilen", hideGuidance: "Gizli", alphabetPosition: "Alfabedeki konum",
    letterSelectionMode: "Harf Seçim Modu", automaticMode: "Otomatik", manualMode: "Manuel", addLetter: "Harf Ekle", removeLetter: "Kaldır", selectedLetters: "Seçilen Harfler",
    levels: { beginner: "Harfi Tanıyalım", easy: "Sesli/Sessiz Harf", medium: "Hece Oluşturalım", hard: "Hece Ayırma" },
    letters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  }
};

// Languages and activities data
const languageKeys = Object.keys(translations) as Array<keyof typeof translations>;

const activities = [
  { id: "reading", icon: Book, color: "bg-blue-500" },
  { id: "writing", icon: PenTool, color: "bg-green-500" },
  { id: "pronunciation", icon: Volume2, color: "bg-purple-500" },
  { id: "vocabulary", icon: Star, color: "bg-orange-500" }
];

interface MixedLetter {
  id: string;
  letter: string;
  isUppercase: boolean;
  color: string;
}

const LiteraSilaba = () => {
  // State variables - identical structure to Literatie
  const [selectedLanguage, setSelectedLanguage] = useState<keyof typeof translations>("ro");
  const [selectedLevel, setSelectedLevel] = useState<"beginner" | "easy" | "medium" | "hard">("beginner");
  const [selectedLetter, setSelectedLetter] = useState<string>("A");
  const [currentActivity, setCurrentActivity] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [timeLeft, setTimeLeft] = useState(300);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showKeyboard, setShowKeyboard] = useState(false);
  
  // New state for manual letter selection mode
  const [letterSelectionMode, setLetterSelectionMode] = useState<'auto' | 'manual'>('auto');
  const [manualSelectedLetters, setManualSelectedLetters] = useState<MixedLetter[]>([]);
  const [showLiteracyKeyboard, setShowLiteracyKeyboard] = useState(false);
  
  // Game-specific state
  const [displayMode, setDisplayMode] = useState<"both" | "upper" | "lower">("both");
  const [letterCount, setLetterCount] = useState(1);
  const [mixedLetters, setMixedLetters] = useState<MixedLetter[]>([]);
  const [upperDroppedCount, setUpperDroppedCount] = useState(0);
  const [lowerDroppedCount, setLowerDroppedCount] = useState(0);
  const [upperDroppedLetters, setUpperDroppedLetters] = useState<any[]>([]);
  const [lowerDroppedLetters, setLowerDroppedLetters] = useState<any[]>([]);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [validationResult, setValidationResult] = useState<'none' | 'correct' | 'incorrect'>('none');
  const [showGuidanceLetters, setShowGuidanceLetters] = useState(true);
  
  // New state for vowel-consonant level enhancements
  const [currentlyMovedLetter, setCurrentlyMovedLetter] = useState<string | null>(null);
  const [lastMovedLetterInfo, setLastMovedLetterInfo] = useState<{letter: string, position: number} | null>(null);
  
  // New state for syllable formation level - UPDATED SYSTEM
  const [syllableSize, setSyllableSize] = useState(2);
  const [syllableTokens, setSyllableTokens] = useState<any[]>([]); // Completed syllable tokens
  const [syllablesInBuilder, setSyllablesInBuilder] = useState<any[]>([]); // Letters being built into syllables in "Silabe" container
  const [lastFormedSyllable, setLastFormedSyllable] = useState<string>(''); // Last formed syllable for temporary display
  const [completedWords, setCompletedWords] = useState<any[][]>([]); // Completed words in "Cuvinte"
  const [currentWordTokens, setCurrentWordTokens] = useState<any[]>([]); // Current word being built
  
  // Level 4 - Word Decomposition state
  const [selectedCategory, setSelectedCategory] = useState<string>("animals");
  const [currentWord, setCurrentWord] = useState<string>("");
  const [currentWordImage, setCurrentWordImage] = useState<string>("");
  const [currentWordEntry, setCurrentWordEntry] = useState<WordEntry | null>(null);
  const [wordLettersFound, setWordLettersFound] = useState<string[]>([]);
  const [syllableBreakdownTokens, setSyllableBreakdownTokens] = useState<any[]>([]);
  
  // Legacy states for compatibility - will be removed gradually
  const [formedSyllables, setFormedSyllables] = useState<string[]>([]);
  const [formedWords, setFormedWords] = useState<string[]>([]);
  const [selectedLettersForSyllable, setSelectedLettersForSyllable] = useState<string[]>([]);
  const [syllableInFormation, setSyllableInFormation] = useState<any[]>([]);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [writingDirectionManager, setWritingDirectionManager] = useState<WritingDirectionManager | null>(null);
  const navigate = useNavigate();

  const currentTranslation = translations[selectedLanguage];

  useEffect(() => {
    // Debug level names per language
    console.log("[LiteraSilaba] selectedLanguage:", selectedLanguage, "levels:", currentTranslation.levels);
  }, [selectedLanguage, currentTranslation.levels]);
  const { label } = useI18n(selectedLanguage);

  // Initialize canvas and writing direction manager
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: "#ffffff",
    });

    const wdManager = new WritingDirectionManager(800, 600, selectedLanguage);
    setWritingDirectionManager(wdManager);
    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, []);

  // Generate mixed letters when component mounts, letter count changes, or selected letter changes
  useEffect(() => {
    // Level 4 - Word Decomposition: Generate letters for the selected word
    if (isWordDecompositionLevel()) {
      if (currentWordEntry) {
        generateMixedLettersForWord(currentWordEntry);
      } else {
        // Select initial word when Level 4 starts
        selectNewWordForLevel4();
      }
      return;
    }
    
    // Only auto-generate in automatic mode for other levels
    if (letterSelectionMode === 'auto') {
      generateMixedLetters();
    }
  }, [letterCount, selectedLanguage, selectedLetter, letterSelectionMode, selectedLevel, selectedCategory, currentWord]);

  // Update mixed letters when manual selections change
  useEffect(() => {
    if (letterSelectionMode === 'manual') {
      setMixedLetters(manualSelectedLetters);
    }
  }, [manualSelectedLetters, letterSelectionMode]);

  // Reset when resetTrigger changes or syllable size changes
  useEffect(() => {
    if (resetTrigger > 0 || isSyllableFormationLevel()) {
      setSelectedLettersForSyllable([]);
      setCompletedWords([]);
      setCurrentWordTokens([]);
    }
  }, [resetTrigger, syllableSize]);

  // Reset selected letter when language changes (start with no letter selected - index 0)
  useEffect(() => {
    setSelectedLetter(''); // Start with no letter selected (index 0)
  }, [selectedLanguage]);

  // Helper function to check if a letter is a vowel
  const isVowel = (letter: string): boolean => {
    const vowels = {
      ro: ['A', 'Ă', 'Â', 'E', 'I', 'Î', 'O', 'U'],
      en: ['A', 'E', 'I', 'O', 'U'],
      es: ['A', 'E', 'I', 'O', 'U'],
      fr: ['A', 'E', 'I', 'O', 'U'],
      de: ['A', 'E', 'I', 'O', 'U'],
      it: ['A', 'E', 'I', 'O', 'U'],
      pt: ['A', 'E', 'I', 'O', 'U'],
      hu: ['A', 'E', 'I', 'O', 'U'],
      pl: ['A', 'E', 'I', 'O', 'U'],
      cs: ['A', 'E', 'I', 'O', 'U'],
      bg: ['А', 'Е', 'И', 'О', 'У'],
      ru: ['А', 'Е', 'И', 'О', 'У'],
      ar: ['أ', 'ا', 'إ', 'آ', 'ع', 'غ', 'ف', 'ق'],
      hi: ['अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ऋ', 'ए', 'ऐ', 'ओ', 'औ'],
      ja: ['あ', 'い', 'う', 'え', 'お'],
      zh: ['A', 'E', 'I', 'O', 'U']
    };
    return vowels[selectedLanguage]?.includes(letter.toUpperCase()) || false;
  };

  // Helper function to check if we're on the vowel-consonant level
  const isVowelConsonantLevel = (): boolean => {
    return selectedLevel === "easy";
  };

  // Helper function to sanitize word (remove articles, spaces, punctuation)
  const sanitizeWord = (word: string): string => {
    return word
      .replace(/^(der|die|das|the|le|la|les|el|la|los|las|il|la|gli|le|o|a|os|as)\s+/i, '') // Remove articles
      .replace(/[^\p{L}]/gu, '') // Remove non-letter characters (spaces, punctuation)
      .trim();
  };

  // Helper function to convert to locale-specific uppercase
  const toLocaleUpperCase = (text: string, locale: string): string => {
    const localeMap: Record<string, string> = {
      ro: 'ro-RO', en: 'en-US', de: 'de-DE', fr: 'fr-FR', es: 'es-ES',
      it: 'it-IT', pt: 'pt-PT', hu: 'hu-HU', pl: 'pl-PL', cs: 'cs-CZ',
      bg: 'bg-BG', ru: 'ru-RU', ar: 'ar-SA', hi: 'hi-IN', ja: 'ja-JP', zh: 'zh-CN'
    };
    return text.toLocaleUpperCase(localeMap[locale] || 'en-US');
  };

  // Helper function to generate mixed letters from translated word
  const generateMixedLettersForWord = (wordEntry: WordEntry) => {
    const translatedWord = label(wordEntry.t);
    const sanitizedWord = sanitizeWord(translatedWord);
    const wordLetters = Array.from(toLocaleUpperCase(sanitizedWord, selectedLanguage));
    
    const mixedArray: MixedLetter[] = [];
    const colors = ['text-green-600', 'text-purple-600', 'text-orange-600', 'text-pink-600'];
    
    wordLetters.forEach((letter, index) => {
      mixedArray.push({
        id: `word-${index}`,
        letter: letter,
        isUppercase: true,
        color: colors[index % colors.length]
      });
    });

    // Add some random letters to make it challenging
    const alphabet = alphabets[selectedLanguage] || alphabets.en;
    const randomLetters = 3;
    for (let i = 0; i < randomLetters; i++) {
      const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
      if (!wordLetters.includes(randomLetter)) {
        mixedArray.push({
          id: `random-${i}`,
          letter: randomLetter,
          isUppercase: true,
          color: 'text-gray-600'
        });
      }
    }

    // Shuffle the array
    setMixedLetters(mixedArray.sort(() => Math.random() - 0.5));
  };

  // Helper function to select new word for Level 4 - FIXED
  const selectNewWordForLevel4 = () => {
    const wordEntry = getRandomWordFromCategory(selectedCategory);
    if (wordEntry) {
      setCurrentWordEntry(wordEntry);
      const translatedWord = label(wordEntry.t);
      setCurrentWord(translatedWord);
      // Use actual image path from word entry or fallback to placeholder
      setCurrentWordImage(wordEntry.img || `/placeholder.svg`);
      setWordLettersFound([]);
      setSyllableBreakdownTokens([]);
      generateMixedLettersForWord(wordEntry);
    }
  };

  // Helper function to check if current level is word decomposition (Level 4)
  const isWordDecompositionLevel = () => {
    return selectedLevel === 'hard';
  };

  // Keep original function for backward compatibility
  const isSyllableFormationLevel = () => {
    return selectedLevel === 'medium';
  };

  // Helper function to generate random colors (excluding red and blue)
  const getRandomColor = (): string => {
    const colors = [
      'text-green-600', 'text-purple-600', 'text-yellow-600', 'text-pink-600',
      'text-indigo-600', 'text-orange-600', 'text-teal-600', 'text-cyan-600',
      'text-lime-600', 'text-emerald-600', 'text-violet-600', 'text-fuchsia-600',
      'text-rose-600', 'text-amber-600', 'text-slate-600', 'text-gray-600'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Alphabet definitions for different languages
  const alphabets: Record<string, string> = {
    ro: 'AĂÂBCDEFGHIÎJKLMNOPQRSȘTȚUVWXYZ',
    en: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    es: 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ',
    fr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    de: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    it: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    pt: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    hu: 'AÁBCDEÉFGHIÍJKLMNOÓÖŐPQRSTUÚÜŰVWXYZ',
    pl: 'AĄBCĆDEĘFGHIJKLŁMNŃOÓPRSŚTUWYZŹŻ',
    cs: 'AÁBCČDĎEÉĚFGHIÍJKLMNŇOÓPQRŘSŠTŤUÚŮVWXYÝZŽ',
    bg: 'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЬЮЯ',
    ru: 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ',
    ar: 'أبتثجحخدذرزسشصضطظعغفقكلمنهوي',
    hi: 'अआइईउऊऋएऐओऔकखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह',
    ja: 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん',
    zh: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  };

  // Helper function to get alphabet position of a letter
  const getAlphabetPosition = (letter: string): number => {
    const alphabet = alphabets[selectedLanguage] || alphabets.en;
    return alphabet.indexOf(letter.toUpperCase()) + 1;
  };

  // Word localization - fallback to original if not available
  const getLocalizedWord = (word: string): string => {
    if (!word) return '';
    const dict: Record<string, Partial<Record<keyof typeof translations, string>>> = {
      'pisică': { en: 'cat' },
      'câine': { en: 'dog' },
      'vacă': { en: 'cow' },
      'cal': { en: 'horse' }
    };
    const lower = word.toLowerCase();
    const entry = dict[lower];
    return entry?.[selectedLanguage] || word;
  };

  // Helper function to check if letter can be dropped in container
  const canDropLetter = (letter: string, targetContainer: 'vowels' | 'consonants'): boolean => {
    if (!isVowelConsonantLevel()) return true;
    
    const letterIsVowel = isVowel(letter);
    return (targetContainer === 'vowels' && letterIsVowel) || 
           (targetContainer === 'consonants' && !letterIsVowel);
  };

  // Handle syllable building in "Silabe" container - NEW SYSTEM
  const handleSyllableBuilding = (count: number, objects?: any[]) => {
    setSyllablesInBuilder(objects || []);
    
    // Check if we have enough letters to form a syllable
    if (objects && objects.length === syllableSize) {
      // Form syllable automatically when correct number reached
      const syllable = objects.map(obj => obj.emoji).join('');
      const syllableToken = {
        id: `syllable-token-${Date.now()}`,
        emoji: syllable,
        color: 'text-purple-600',
        objectName: syllable,
        value: 1,
        isSyllableToken: true // Mark as syllable token
      };
      
      // Add to syllable tokens
      setSyllableTokens(prev => [...prev, syllableToken]);
      
      // Set last formed syllable for temporary display in "Silaba Selectată"
      setLastFormedSyllable(syllable);
      
      // Clear the builder
      setSyllablesInBuilder([]);
      
      // Show success feedback
      toast.success(`Silaba "${syllable}" a fost formată!`, {
        duration: 2000,
      });
      
      // Clear temporary display after 3 seconds
      setTimeout(() => {
        setLastFormedSyllable('');
      }, 3000);
    }
  };

  // Handle syllable tokens being moved to "Silabe" container (for display)
  const handleSyllableTokensChange = (count: number, objects?: any[]) => {
    setSyllableTokens(objects || []);
    setUpperDroppedCount(count);
    setUpperDroppedLetters(objects || []);
  };

  // Handle word formation in "Cuvinte" container
  const handleWordFormation = (newCompletedWords: any[][], newCurrentWordTokens: any[]) => {
    setCompletedWords(newCompletedWords);
    setCurrentWordTokens(newCurrentWordTokens);
    setLowerDroppedCount(newCompletedWords.flat().length + newCurrentWordTokens.length);
    setLowerDroppedLetters([...newCompletedWords.flat(), ...newCurrentWordTokens]);
  };

  // Helper function to handle syllable drop zone changes - LEGACY
  const handleSyllableInFormationChange = (count: number, objects?: any[]) => {
    setSyllableInFormation(objects || []);
    
    if (objects && objects.length === syllableSize) {
      // Form syllable automatically when correct number reached
      const syllable = objects.map(obj => obj.emoji).join('');
      const syllableObject = {
        id: `syllable-${Date.now()}`,
        emoji: syllable,
        color: 'text-purple-600',
        objectName: syllable,
        value: 1
      };
      
      // Move to "Silabe" container
      setFormedSyllables(prev => [...prev, syllable]);
      setUpperDroppedCount(prev => prev + 1);
      setUpperDroppedLetters(prev => [...prev, syllableObject]);
      
      // Clear syllable in formation
      setSyllableInFormation([]);
      
      // Show success feedback
      toast.success(`Silaba "${syllable}" a fost formată!`, {
        duration: 2000,
      });
    }
  };

  // Function to update selected letter display when letter is moved
  const updateSelectedLetterDisplay = (letter: string) => {
    const position = getAlphabetPosition(letter);
    setLastMovedLetterInfo({ letter, position });
    setSelectedLetter(letter.toUpperCase());
  };

  // Function to clear containers after successful validation
  const clearContainersAfterValidation = () => {
    setUpperDroppedLetters([]);
    setLowerDroppedLetters([]);
    setUpperDroppedCount(0);
    setLowerDroppedCount(0);
    setResetTrigger(prev => prev + 1);
  };

  // Check if all letters are placed (for vowel-consonant level)
  const getAllLettersPlaced = (): boolean => {
    if (!isVowelConsonantLevel()) return false;
    return mixedLetters.length > 0 && (upperDroppedCount + lowerDroppedCount) >= mixedLetters.length;
  };

  // Validation function for vowel-consonant level
  const validateVowelConsonantLevel = (): boolean => {
    // Check if all letters are placed
    if (!getAllLettersPlaced()) return false;
    
    // Check if vowels container has only vowels
    const vowelsCorrect = upperDroppedLetters.every(obj => {
      const letter = obj.emoji;
      return isVowel(letter);
    });
    
    // Check if consonants container has only consonants  
    const consonantsCorrect = lowerDroppedLetters.every(obj => {
      const letter = obj.emoji;
      return !isVowel(letter);
    });
    
    return vowelsCorrect && consonantsCorrect;
  };

  // Generate mixed letters for the drag & drop area
  const generateMixedLetters = () => {
    // For Level 4 - Word Decomposition, use word letters
    if (isWordDecompositionLevel()) {
      if (currentWordEntry) {
        generateMixedLettersForWord(currentWordEntry);
      }
      return;
    }

    // For manual mode, use manually selected letters
    if (letterSelectionMode === 'manual') {
      setMixedLetters(manualSelectedLetters);
      return;
    }

    // Automatic mode (original logic)
    // If no letter is selected (index 0), don't generate any letters for non vowel-consonant and non-syllable levels
    if (!selectedLetter && !isVowelConsonantLevel() && !isSyllableFormationLevel()) {
      setMixedLetters([]);
      return;
    }

    const letters = currentTranslation.letters.split('').slice(0, Math.min(20, currentTranslation.letters.length));
    const mixedArray: MixedLetter[] = [];

    // For vowel-consonant level, generate a mix of vowels and consonants with colorful display
    if (isVowelConsonantLevel()) {
      // Languages with different phonetic principles than European Latin or Hungarian
      const nonLatinLanguages = ['ar', 'hi', 'ja', 'zh', 'bg', 'ru'];
      
      if (nonLatinLanguages.includes(selectedLanguage)) {
        // Balanced distribution for non-Latin languages in automatic mode
        const vowels = letters.filter(letter => isVowel(letter));
        const consonants = letters.filter(letter => !isVowel(letter));
        
        // Alternate between vowels and consonants for balanced distribution
        const maxVowels = Math.min(8, vowels.length);
        const maxConsonants = Math.min(8, consonants.length);
        
        for (let i = 0; i < Math.max(maxVowels, maxConsonants) && mixedArray.length < 15; i++) {
          // Add vowel if available
          if (i < maxVowels && mixedArray.length < 15) {
            const vowel = vowels[i];
            // Add uppercase version
            mixedArray.push({
              id: `upper-vowel-${vowel}-${Math.random()}`,
              letter: vowel.toUpperCase(),
              isUppercase: true,
              color: getRandomColor()
            });
            
            // Add lowercase version
            if (mixedArray.length < 15) {
              mixedArray.push({
                id: `lower-vowel-${vowel}-${Math.random()}`,
                letter: vowel.toLowerCase(),
                isUppercase: false,
                color: getRandomColor()
              });
            }
          }
          
          // Add consonant if available
          if (i < maxConsonants && mixedArray.length < 15) {
            const consonant = consonants[i];
            // Add uppercase version
            mixedArray.push({
              id: `upper-consonant-${consonant}-${Math.random()}`,
              letter: consonant.toUpperCase(),
              isUppercase: true,
              color: getRandomColor()
            });
            
            // Add lowercase version
            if (mixedArray.length < 15) {
              mixedArray.push({
                id: `lower-consonant-${consonant}-${Math.random()}`,
                letter: consonant.toLowerCase(),
                isUppercase: false,
                color: getRandomColor()
              });
            }
          }
        }
      } else {
        // Original logic for European Latin languages and Hungarian
        letters.forEach(letter => {
          if (mixedArray.length < 15) {
            // Add uppercase version
            mixedArray.push({
              id: `upper-${letter}-${Math.random()}`,
              letter: letter.toUpperCase(),
              isUppercase: true,
              color: getRandomColor()
            });
            
            // Add lowercase version  
            mixedArray.push({
              id: `lower-${letter}-${Math.random()}`,
              letter: letter.toLowerCase(),
              isUppercase: false,
              color: getRandomColor()
            });
          }
        });
      }
    } else if (isSyllableFormationLevel()) {
      // For syllable formation level, generate balanced vowels and consonants
      const allLetters = currentTranslation.letters;
      const vowels = allLetters.split('').filter(letter => isVowel(letter));
      const consonants = allLetters.split('').filter(letter => !isVowel(letter));
      
      const maxLetters = 12;
      const vowelCount = Math.ceil(maxLetters * 0.4);
      const consonantCount = maxLetters - vowelCount;
      
      // Add vowels
      for (let i = 0; i < vowelCount && i < vowels.length; i++) {
        const vowel = vowels[i % vowels.length];
        mixedArray.push({
          id: `vowel-${i}`,
          letter: vowel,
          isUppercase: true,
          color: 'text-blue-600'
        });
      }
      
      // Add consonants
      for (let i = 0; i < consonantCount && i < consonants.length; i++) {
        const consonant = consonants[i % consonants.length];
        mixedArray.push({
          id: `consonant-${i}`,
          letter: consonant,
          isUppercase: true,
          color: 'text-red-600'
        });
      }
      
      // Shuffle the array
      for (let i = mixedArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [mixedArray[i], mixedArray[j]] = [mixedArray[j], mixedArray[i]];
      }
      
      setMixedLetters(mixedArray);
      return;
    } else {
      // Original logic for other levels - Always ensure the selected letter is included in both uppercase and lowercase
      mixedArray.push({
        id: `upper-selected-${selectedLetter}-${Math.random()}`,
        letter: selectedLetter.toUpperCase(),
        isUppercase: true,
        color: isVowel(selectedLetter) ? 'text-blue-600' : 'text-red-600'
      });
      
      mixedArray.push({
        id: `lower-selected-${selectedLetter}-${Math.random()}`,
        letter: selectedLetter.toLowerCase(),
        isUppercase: false,
        color: isVowel(selectedLetter) ? 'text-blue-600' : 'text-red-600'
      });

      // Add additional letters based on letterCount setting
      const selectedLetters = letters.slice(0, letterCount);
      selectedLetters.forEach((letter, index) => {
        // Skip if this is the same as selected letter (already added above)
        if (letter.toUpperCase() === selectedLetter.toUpperCase()) return;
        
        // Add uppercase version
        mixedArray.push({
          id: `upper-${letter}-${Math.random()}`,
          letter: letter.toUpperCase(),
          isUppercase: true,
          color: isVowel(letter) ? 'text-blue-600' : 'text-red-600'
        });
        
        // Add lowercase version  
        mixedArray.push({
          id: `lower-${letter}-${Math.random()}`,
          letter: letter.toLowerCase(),
          isUppercase: false,
          color: isVowel(letter) ? 'text-blue-600' : 'text-red-600'
        });
      });

      // Add extra random letters to ensure minimum 7 letters total
      const extraLetters = letters.slice(letterCount, Math.min(letterCount + 8, letters.length));
      extraLetters.forEach(letter => {
        if (mixedArray.length < 15) { // Continue adding until we have enough letters
          const isUpperCase = Math.random() > 0.5;
          mixedArray.push({
            id: `extra-${letter}-${Math.random()}`,
            letter: isUpperCase ? letter.toUpperCase() : letter.toLowerCase(),
            isUppercase: isUpperCase,
            color: isVowel(letter) ? 'text-blue-600' : 'text-red-600'
          });
        }
      });

      // Ensure we have at least 7 letters total
      while (mixedArray.length < 7) {
        const randomLetter = letters[Math.floor(Math.random() * letters.length)];
        const isUpperCase = Math.random() > 0.5;
        mixedArray.push({
          id: `filler-${randomLetter}-${Math.random()}`,
          letter: isUpperCase ? randomLetter.toUpperCase() : randomLetter.toLowerCase(),
          isUppercase: isUpperCase,
          color: isVowel(randomLetter) ? 'text-blue-600' : 'text-red-600'
        });
      }
    }

    // Shuffle the array and limit to 15 letters maximum
    const shuffled = mixedArray.sort(() => Math.random() - 0.5);
    setMixedLetters(shuffled.slice(0, Math.max(7, shuffled.length)));
  };

  // Validation function
  const validateGame = () => {
    // Special validation for vowel-consonant level
    if (isVowelConsonantLevel()) {
      // Check if all letters are placed
      if (!getAllLettersPlaced()) {
        setValidationResult('incorrect');
        toast.error("Toate literele trebuie plasate în containerele corespunzătoare!");
        return;
      }
      
      if (validateVowelConsonantLevel()) {
        setValidationResult('correct');
        toast.success(currentTranslation.congratulations);
        setScore(prev => prev + 10);
        
        // Clear containers and generate new game after a short delay
        setTimeout(() => {
          clearContainersAfterValidation();
          generateMixedLetters();
          setValidationResult('none');
        }, 2000);
      } else {
        setValidationResult('incorrect');
        toast.error(currentTranslation.checkPlacement);
      }
      return;
    }

    // Original validation logic for other levels
    const requiredLetters = selectedLetter ? [selectedLetter] : [];
    
    // Check if we have the required number of letters in each container
    if (upperDroppedCount !== letterCount || lowerDroppedCount !== letterCount) {
      setValidationResult('incorrect');
      toast.error(currentTranslation.completeContainers);
      return;
    }
    
    // Check if uppercase container has correct uppercase letters
    const upperLettersCorrect = upperDroppedLetters.every(obj => {
      const letter = obj.emoji;
      return requiredLetters.includes(letter?.toUpperCase()) && letter === letter?.toUpperCase();
    });
    
    // Check if lowercase container has correct lowercase letters  
    const lowerLettersCorrect = lowerDroppedLetters.every(obj => {
      const letter = obj.emoji;
      return requiredLetters.includes(letter?.toUpperCase()) && letter === letter?.toLowerCase();
    });
    
    if (upperLettersCorrect && lowerLettersCorrect) {
      setValidationResult('correct');
      toast.success(currentTranslation.congratulations);
      setScore(prev => prev + 10);
      
      // Generate new game after a short delay
      setTimeout(() => {
        handleShuffle();
        setValidationResult('none');
      }, 2000);
    } else {
      setValidationResult('incorrect');
      toast.error(currentTranslation.checkPlacement);
    }
  };

  // Game control functions
  const handlePlay = () => {
    setIsPlaying(true);
    // In manual mode, if no letters selected, open keyboard instead of starting game
    if (letterSelectionMode === 'manual' && manualSelectedLetters.length === 0) {
      setShowLiteracyKeyboard(true);
      toast.info("Selectează literele pentru joc!");
      return;
    }
    // Only generate letters in automatic mode, manual mode uses selected letters
    if (letterSelectionMode === 'auto') {
      generateMixedLetters();
    }
    clearContainersAfterValidation(); // Clear containers when starting new game
    toast.success("Jocul a început!");
  };

  const handlePause = () => {
    setIsPlaying(false);
    toast.info("Jocul este pausat");
  };

  const handleShuffle = () => {
    // In manual mode, clear everything and reset
    if (letterSelectionMode === 'manual') {
      // Clear all containers and manual letters
      setMixedLetters([]);
      setManualSelectedLetters([]);
      setUpperDroppedLetters([]);
      setLowerDroppedLetters([]);
      setResetTrigger(prev => prev + 1);
      setUpperDroppedCount(0);
      setLowerDroppedCount(0);
      setIsPlaying(false);
      // Show keyboard for new letter selection
      setShowLiteracyKeyboard(true);
      toast.info("Jocul a fost resetat!");
    } else {
      // Automatic mode - regenerate letters as before
      generateMixedLetters();
      setResetTrigger(prev => prev + 1);
      setUpperDroppedCount(0);
      setLowerDroppedCount(0);
      toast.info("Literele au fost amestecate din nou!");
    }
  };

  const handleRepeat = () => {
    handleShuffle();
  };

  const handleKeyboardToggle = () => {
    setShowKeyboard(!showKeyboard);
  };

  // Handle key press from keyboard
  const handleKeyPress = (key: string) => {
    // If in manual mode, add letter to manual selection
    if (letterSelectionMode === 'manual') {
      addManualLetter(key);
      return;
    }

    // Original logic for automatic mode
    if (!fabricCanvas || !writingDirectionManager) return;

    try {
      // Set letter for display
      setSelectedLetter(key.toUpperCase());
      
      // Add to canvas
      const svgComponent = getSVGComponent(key);
      if (svgComponent) {
        // Handle SVG component
        const svgElement = React.createElement(svgComponent, {
          className: `w-16 h-16 ${isVowel(key) ? 'text-blue-600' : 'text-red-600'}`
        });
        
        const text = new FabricText(key, {
          left: 100,
          top: 100,
          fontSize: 60,
          fill: isVowel(key) ? '#2563eb' : '#dc2626',
          fontFamily: 'Arial',
        });
        fabricCanvas.add(text);
      } else {
        // Handle regular letter
        const text = new FabricText(key, {
          left: 100,
          top: 100,
          fontSize: 60,
          fill: isVowel(key) ? '#2563eb' : '#dc2626',
          fontFamily: 'Arial',
        });
        fabricCanvas.add(text);
      }
    } catch (error) {
      console.error('Error adding letter to canvas:', error);
    }
  };

  // Functions for manual letter selection
  const addManualLetter = (letter: string) => {
    const newLetters: MixedLetter[] = [];
    
    // Add uppercase version
    newLetters.push({
      id: `manual-upper-${letter}-${Date.now()}`,
      letter: letter.toUpperCase(),
      isUppercase: true,
      color: getRandomColor()
    });
    
    // Add lowercase version
    newLetters.push({
      id: `manual-lower-${letter}-${Date.now() + 1}`,
      letter: letter.toLowerCase(),
      isUppercase: false,
      color: getRandomColor()
    });
    
    setManualSelectedLetters(prev => [...prev, ...newLetters]);
    setShowLiteracyKeyboard(false);
    toast.success(`Literă adăugată: ${letter.toUpperCase()}`);
  };

  const removeManualLetter = (letterId: string) => {
    setManualSelectedLetters(prev => prev.filter(letter => letter.id !== letterId));
  };

  const clearAllManualLetters = () => {
    setManualSelectedLetters([]);
    setMixedLetters([]);
    setUpperDroppedLetters([]);
    setLowerDroppedLetters([]);
    setUpperDroppedCount(0);
    setLowerDroppedCount(0);
    setIsPlaying(false);
    // Show keyboard automatically when clearing
    setShowLiteracyKeyboard(true);
    toast.info("Toate literele au fost șterse!");
  };

  const toggleSelectionMode = (mode: 'auto' | 'manual') => {
    setLetterSelectionMode(mode);
    // Close any open keyboards when switching modes
    setShowLiteracyKeyboard(false);
    if (mode === 'manual') {
      setMixedLetters(manualSelectedLetters);
    } else {
      generateMixedLetters();
    }
  };

  // Check if game is complete
  const checkGameComplete = () => {
    const expectedCount = letterCount;
    if (upperDroppedCount >= expectedCount && lowerDroppedCount >= expectedCount) {
      setGameComplete(true);
      setScore(score + 10);
      toast.success(currentTranslation.gameComplete);
    }
  };

  useEffect(() => {
    checkGameComplete();
  }, [upperDroppedCount, lowerDroppedCount, letterCount]);

  // Handle next round
  const handleNextRound = () => {
    setGameComplete(false);
    handleShuffle();
    setProgress(Math.min(progress + 25, 100));
  };

  // Handle drag start for mixed letters
  const handleDragStart = (e: React.DragEvent, letter: MixedLetter) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({
      id: letter.id,
      emoji: letter.letter,
      color: letter.color,
      objectName: letter.isUppercase ? 'uppercase' : 'lowercase',
      isUppercase: letter.isUppercase
    }));
  };

  // Render sidebar - identical to Literatie with additions
  const renderSidebar = () => (
    <Sidebar className="w-48"> {/* Reduced from default ~w-80 to w-48 (40% reduction) */}
      <SidebarContent className="p-3 space-y-4"> {/* Reduced padding and spacing */}
        {/* Language Selection */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-primary font-bold text-xs">{currentTranslation.language}</SidebarGroupLabel>
          <SidebarGroupContent>
            <Select value={selectedLanguage} onValueChange={(value: keyof typeof translations) => setSelectedLanguage(value)}>
              <SelectTrigger className="w-full text-xs"> {/* Smaller text for compact sidebar */}
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languageKeys.map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    <span className="flex items-center gap-2">
                      {translations[lang].flag} {translations[lang].name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Level Selection */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-primary font-bold text-xs">{currentTranslation.level}</SidebarGroupLabel>
          <SidebarGroupContent>
            <Select value={selectedLevel} onValueChange={(value: typeof selectedLevel) => setSelectedLevel(value)}>
              <SelectTrigger className="w-full text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">{currentTranslation.levels.beginner}</SelectItem>
                <SelectItem value="easy">{currentTranslation.levels.easy}</SelectItem>
                <SelectItem value="medium">{currentTranslation.levels.medium}</SelectItem>
                <SelectItem value="hard">{currentTranslation.levels.hard}</SelectItem>
              </SelectContent>
            </Select>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Display Mode Selection - NEW */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-primary font-bold text-xs">{currentTranslation.displayMode}</SidebarGroupLabel>
          <SidebarGroupContent>
            <Select value={displayMode} onValueChange={(value: typeof displayMode) => setDisplayMode(value)}>
              <SelectTrigger className="w-full text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="both">{currentTranslation.largeSmall}</SelectItem>
                <SelectItem value="upper">{currentTranslation.largeOnly}</SelectItem>
                <SelectItem value="lower">{currentTranslation.smallOnly}</SelectItem>
              </SelectContent>
            </Select>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Letter Selection Mode - NEW */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-primary font-bold text-xs">{currentTranslation.letterSelectionMode}</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="flex space-x-2">
              <Button
                variant={letterSelectionMode === 'auto' ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleSelectionMode('auto')}
                className="flex-1 text-xs"
              >
                {currentTranslation.automaticMode}
              </Button>
              <Button
                variant={letterSelectionMode === 'manual' ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleSelectionMode('manual')}
                className="flex-1 text-xs"
              >
                {currentTranslation.manualMode}
              </Button>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Letter Count Selection - Only show in automatic mode */}
        {letterSelectionMode === 'auto' && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-primary font-bold text-xs">{currentTranslation.letterCount}</SidebarGroupLabel>
            <SidebarGroupContent>
              <Select value={letterCount.toString()} onValueChange={(value) => setLetterCount(parseInt(value))}>
                <SelectTrigger className="w-full text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1,2,3,4,5,6,7,8,9,10].map(num => (
                    <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                  ))}
                </SelectContent>
                </Select>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Manual Letter Selection - Only show in manual mode */}
        {letterSelectionMode === 'manual' && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-primary font-bold text-xs">{currentTranslation.selectedLetters}</SidebarGroupLabel>
            <SidebarGroupContent className="space-y-2">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowLiteracyKeyboard(true)}
                  className="flex-1 text-xs"
                >
                  <Keyboard className="w-3 h-3 mr-1" />
                  {currentTranslation.addLetter}
                </Button>
                {manualSelectedLetters.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAllManualLetters}
                    className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                )}
              </div>
              
              {/* Display selected letters */}
              <div className="max-h-32 overflow-y-auto space-y-1">
                {manualSelectedLetters.reduce((acc: MixedLetter[], letter) => {
                  // Group by letter (uppercase)
                  const existing = acc.find(l => l.letter.toUpperCase() === letter.letter.toUpperCase());
                  if (!existing && letter.isUppercase) {
                    acc.push(letter);
                  }
                  return acc;
                }, []).map((letter) => (
                  <div key={letter.letter.toUpperCase()} className="flex items-center justify-between bg-muted p-1 rounded text-xs">
                    <span className="font-medium">{letter.letter.toUpperCase()}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        // Remove both uppercase and lowercase versions
                        setManualSelectedLetters(prev => 
                          prev.filter(l => l.letter.toUpperCase() !== letter.letter.toUpperCase())
                        );
                      }}
                      className="h-4 w-4 p-0 text-red-500 hover:text-red-700"
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Letter Selection - Removed from sidebar */}

        {/* Keyboard Toggle */}
        <SidebarGroup>
          <SidebarGroupContent>
            <Button
              variant="outline"
              onClick={handleKeyboardToggle}
              className="w-full"
            >
              <Keyboard className="w-4 h-4 mr-2" />
              {showKeyboard ? "Ascunde Tastatura" : "Arată Tastatura"}
            </Button>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Progress */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-primary font-bold text-xs">{currentTranslation.progressLabel}</SidebarGroupLabel>
          <SidebarGroupContent>
            <ProgressBar current={progress / 25} total={4} className="w-full" />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );

  // Render main game content
  const renderGameContent = () => (
    <div 
      className="flex-1 p-6 space-y-6 transition-transform duration-300 origin-top-left"
      style={{ 
        transform: `scale(${zoomLevel / 100})`,
        transformOrigin: 'top left'
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
        {/* Left Column - Letter Display */}
        <div className="lg:col-span-1">
          <Card className="h-full min-h-[500px]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-center text-lg flex-1">
                  {isWordDecompositionLevel() ? (currentTranslation as any).chosenWord || "Chosen Word" : 
                   isSyllableFormationLevel() ? (currentTranslation as any).selectedSyllable || "Selected Syllable" : (currentTranslation as any).selectedLetter || "Selected Letter"}
                </CardTitle>
                {isVowelConsonantLevel() && (
                  <Button 
                    onClick={() => setShowGuidanceLetters(!showGuidanceLetters)}
                    variant="outline" 
                    size="sm"
                    className="ml-2"
                  >
                    {showGuidanceLetters ? currentTranslation.hideGuidance : currentTranslation.showGuidance}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-6 p-6">
              {/* Show moved letter info for vowel-consonant level */}
              {isVowelConsonantLevel() && lastMovedLetterInfo ? (
                <div className="flex flex-col items-center space-y-4 bg-green-50 p-4 rounded-lg border border-green-200 w-full">
                  <div className="text-center">
                    <p className="text-sm text-green-700 font-medium mb-2">{(currentTranslation as any).letterMoved || "Letter moved:"}:</p>
                    <div className="flex items-center justify-center space-x-4">
                      <div className={`text-6xl font-bold ${isVowel(lastMovedLetterInfo.letter) ? 'text-blue-600' : 'text-red-600'}`}>
                        {lastMovedLetterInfo.letter.toUpperCase()}
                      </div>
                      <div className={`text-4xl font-bold ${isVowel(lastMovedLetterInfo.letter) ? 'text-blue-600' : 'text-red-600'}`}>
                        {lastMovedLetterInfo.letter.toLowerCase()}
                      </div>
                    </div>
                    <p className="text-sm text-green-700 mt-2">
                      {currentTranslation.alphabetPosition}: {lastMovedLetterInfo.position}
                    </p>
                  </div>
                </div>
              ) : isSyllableFormationLevel() && selectedLettersForSyllable.length > 0 ? (
                <div className="flex flex-col items-center space-y-4 bg-purple-50 p-4 rounded-lg border border-purple-200 w-full">
                  <div className="text-center">
                    <p className="text-sm text-purple-700 font-medium mb-2">
                      {(currentTranslation as any).syllableInFormation || "Syllable in formation"} ({selectedLettersForSyllable.length}/{syllableSize}):
                    </p>
                    <div className="flex items-center justify-center space-x-2 mb-3">
                      {selectedLettersForSyllable.map((letter, index) => (
                        <div key={index} className="text-3xl font-bold text-purple-600">
                          {letter}
                        </div>
                      ))}
                      {[...Array(syllableSize - selectedLettersForSyllable.length)].map((_, index) => (
                        <div key={`empty-${index}`} className="text-3xl font-bold text-gray-300">
                          _
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-purple-600">
                      {(currentTranslation as any).selectMoreLetters?.replace('{0}', (syllableSize - selectedLettersForSyllable.length).toString()) || `Select ${syllableSize - selectedLettersForSyllable.length} more letters`}
                    </p>
                  </div>
                </div>
              ) : isSyllableFormationLevel() && formedSyllables.length > 0 ? (
                <div className="flex flex-col items-center space-y-4 bg-green-50 p-4 rounded-lg border border-green-200 w-full">
                  <div className="text-center">
                    <p className="text-sm text-green-700 font-medium mb-2">{(currentTranslation as any).lastSyllableFormed || "Last syllable formed:"}:</p>
                    <div className="text-4xl font-bold text-purple-600 mb-2">
                      {formedSyllables[formedSyllables.length - 1]}
                    </div>
                  </div>
                </div>
               ) : !isVowelConsonantLevel() && !isSyllableFormationLevel() && !isWordDecompositionLevel() ? (
                <>
                  {/* Letter position selector at top for non vowel-consonant levels */}
                  <div className="flex flex-col items-center space-y-2">
                    <p className="text-sm text-center text-muted-foreground">{currentTranslation.letterLabel}</p>
                    <VerticalSelector 
                      value={selectedLetter ? currentTranslation.letters.indexOf(selectedLetter) + 1 : 0}
                      min={0}
                      max={currentTranslation.letters.length}
                      onChange={(index) => {
                        if (index === 0) {
                          setSelectedLetter('');
                        } else {
                          setSelectedLetter(currentTranslation.letters[index - 1] || 'A');
                        }
                      }}
                    />
                  </div>
                </>
              ) : isWordDecompositionLevel() ? (
                <>
                  {/* Category selector and image display */}
                  <div className="flex flex-col items-center space-y-6">
                    <div className="w-full space-y-6">
                      {/* Category selector */}
                      <div className="flex flex-col items-center space-y-2">
                        <p className="text-sm text-center text-muted-foreground">{(currentTranslation as any).chooseCategory || "Choose category"}</p>
                        <Select value={selectedCategory} onValueChange={(value) => {
                          setSelectedCategory(value);
                          setTimeout(() => selectNewWordForLevel4(), 100);
                        }}>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(categoryTranslations[selectedLanguage] || categoryTranslations['en']).map(([key, category]) => (
                              <SelectItem key={key} value={key}>
                                {(category as any).emoji} {(category as any).name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Word image display - 3x larger */}
                      {currentWord && (
                        <div className="flex justify-center">
                          <div className="w-72 h-72 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden shadow-lg">
                            <img 
                              src={currentWordImage} 
                              alt="Word to guess"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : isSyllableFormationLevel() ? (
                <>
                  {/* Silaba Selectată container with syllable size selector and drop zone */}
                  <div className="flex flex-col items-center space-y-4">
                    <Card className="w-full border-2 border-orange-300 bg-orange-50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-center text-lg text-orange-600">{(currentTranslation as any).selectedSyllable || "Selected Syllable"}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Syllable size selector - permanently visible */}
                        <div className="flex flex-col items-center space-y-2">
                          <p className="text-sm text-center text-muted-foreground">{(currentTranslation as any).numberOfLetters || "Number of letters"}</p>
                          <VerticalSelector 
                            value={syllableSize}
                            min={2}
                            max={4}
                            onChange={(newSize) => {
                              setSyllableSize(newSize);
                              setSyllableInFormation([]);
                            }}
                          />
                        </div>
                        
                        {/* Display last formed syllable if exists */}
                        {lastFormedSyllable && (
                          <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                            <div className="text-sm text-orange-700 font-medium text-center">
                              {(currentTranslation as any).lastSyllable || "Last syllable:"} <span className="text-orange-800 font-bold">{lastFormedSyllable}</span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </>
              ) : null}

              {/* Show guidance letters for vowel-consonant level when enabled */}
              {isVowelConsonantLevel() && showGuidanceLetters && mixedLetters.length > 0 && (
                <div className="w-full bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="text-sm font-medium text-blue-800 mb-3 text-center">Literele din joc:</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {mixedLetters.map((letter, index) => (
                      <div key={letter.id} className="text-center bg-white p-2 rounded border">
                        <div className={`text-2xl font-bold ${isVowel(letter.letter) ? 'text-blue-600' : 'text-red-600'}`}>
                          {letter.letter}
                        </div>
                        <div className="text-xs text-gray-600">
                          Pos: {getAlphabetPosition(letter.letter)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Show guidance letters for syllable formation level */}
              {isSyllableFormationLevel() && mixedLetters.length > 0 && (
                <div className="w-full bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h4 className="text-sm font-medium text-purple-800 mb-3 text-center">Literele din joc:</h4>
                  <div className="flex flex-wrap justify-center gap-2">
                    {mixedLetters.map((letter, index) => (
                      <div
                        key={`guidance-${letter.id}`}
                        className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-lg font-bold ${
                          isVowel(letter.letter) 
                            ? 'bg-blue-100 border-blue-300 text-blue-800' 
                            : 'bg-red-100 border-red-300 text-red-800'
                        }`}
                      >
                        {letter.letter}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Letters display area for non vowel-consonant levels */}
              {!isVowelConsonantLevel() && !isSyllableFormationLevel() && (
                <div className="flex flex-col items-center space-y-6 flex-1 justify-center">
                  {selectedLetter ? (
                    <>
                      {(displayMode === "both" || displayMode === "upper") && (
                        <div className="flex flex-col items-center space-y-3">
                          <div className={`text-8xl font-bold ${isVowel(selectedLetter) ? 'text-blue-600' : 'text-red-600'}`}>
                            {selectedLetter.toUpperCase()}
                          </div>
                          <Button variant="outline" size="sm" className="h-8 w-12">
                            <Volume2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                      
                      {(displayMode === "both" || displayMode === "lower") && (
                        <div className="flex flex-col items-center space-y-3">
                          <div className={`text-8xl font-bold ${isVowel(selectedLetter) ? 'text-blue-600' : 'text-red-600'}`}>
                            {selectedLetter.toLowerCase()}
                          </div>
                          <Button variant="outline" size="sm" className="h-8 w-12">
                            <Volume2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </>
                  ) : null}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Game Area (takes 3 columns, full width) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Mixed Letters Area - Full Width */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-center text-xl">{currentTranslation.mixedLetters}</CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="w-4/5 min-h-80 p-12 border-2 border-dashed border-gray-300 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 mx-auto"
                style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'center', alignItems: 'center' }}
              >
                {mixedLetters.length === 0 ? (
                  <div className="text-gray-500 text-center w-full py-8">
                    <p className="text-lg mb-4">{letterSelectionMode === 'manual' ? "Selectează literele pentru joc" : currentTranslation.startGameMessage}</p>
                    {letterSelectionMode === 'manual' && (
                      <Button
                        onClick={() => setShowLiteracyKeyboard(true)}
                        size="lg"
                        className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4"
                      >
                        <Keyboard className="w-6 h-6 mr-2" />
                        {currentTranslation.addLetter}
                      </Button>
                    )}
                  </div>
                ) : (
                  mixedLetters.map((letter, index) => (
                    <div
                      key={letter.id}
                      className={`
                        text-8xl font-bold cursor-move hover:scale-125 transition-all duration-200 
                        text-center p-6 rounded-xl bg-white border-2 shadow-lg hover:shadow-xl
                        transform hover:-translate-y-1 select-none
                        ${letter.color} border-gray-200 hover:border-gray-300
                        ${isSyllableFormationLevel() ? 'cursor-pointer' : 'cursor-move'}
                        ${isSyllableFormationLevel() && selectedLettersForSyllable.includes(letter.letter) 
                          ? 'ring-4 ring-purple-400 border-purple-400 bg-purple-50' 
                          : ''
                        }
                      `}
                      style={{
                        fontSize: `${Math.random() * 40 + 60}px`, // Random sizes between 60-100px (doubled from 30-50px)
                        transform: `rotate(${Math.random() * 20 - 10}deg)`, // Random rotation -10 to +10 degrees
                        filter: `hue-rotate(${Math.random() * 60}deg)`, // Random color variations
                        minWidth: '80px', // Doubled container width
                        minHeight: '80px' // Doubled container height
                      }}
                      draggable={true}
                      onDragStart={(e) => handleDragStart(e, letter)}
                    >
                      {letter.letter}
                    </div>
                  ))
                )}
          </div>

          {/* Validation Button - Hidden for vowel-consonant level and syllable formation level to save space */}
          {!isVowelConsonantLevel() && !isSyllableFormationLevel() && (
          <div className="flex justify-center mt-6">
            <Button
              onClick={isVowelConsonantLevel() ? validateGame : (letterSelectionMode === 'manual' && manualSelectedLetters.length === 0) ? () => setShowLiteracyKeyboard(true) : handlePlay}
              size="lg"
              className={`
                px-8 py-4 text-lg font-bold transition-all duration-300 min-w-[120px]
                ${validationResult === 'correct' 
                  ? 'bg-green-500 hover:bg-green-600 text-white' 
                  : validationResult === 'incorrect' 
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
                }
              `}
              disabled={isVowelConsonantLevel() ? !getAllLettersPlaced() : false}
            >
              {isVowelConsonantLevel() 
                ? (validationResult === 'correct' ? '✓' : validationResult === 'incorrect' ? '✗' : '?')
                : (letterSelectionMode === 'manual' && manualSelectedLetters.length === 0) 
                ? <Keyboard className="w-6 h-6" />
                : <Play className="w-6 h-6" />
              }
            </Button>
          </div>
          )}
            </CardContent>
          </Card>

          {/* Drop Zones - Different layouts for different levels */}
          <div className={`grid gap-8 ml-8 ${isSyllableFormationLevel() || isWordDecompositionLevel() ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2'}`}>
            {isWordDecompositionLevel() ? (
              <>
                {/* First Container: Cuvântul Găsit - with draggable token elements */}
                <Card className="min-h-64">
                  <CardHeader>
                    <CardTitle className="text-center text-lg text-purple-600">
                      {(currentTranslation as any).wordFound || "Cuvântul Găsit"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="min-h-48 p-4 border-2 border-dashed border-purple-300 rounded-lg bg-purple-50">
                      <div className="flex flex-wrap gap-2 justify-center items-center">
                        {currentWord ? (
                          // Create tokens for each letter position
                          Array.from({ length: currentWord.length }, (_, index) => {
                            const foundLetter = wordLettersFound[index];
                            return (
                              <div
                                key={`token-${index}`}
                                className={`w-12 h-12 border-2 rounded-lg flex items-center justify-center text-xl font-bold transition-all duration-200 ${
                                  foundLetter 
                                    ? 'bg-green-100 border-green-400 text-green-800 cursor-move hover:scale-110 hover:shadow-lg' 
                                    : 'bg-white border-purple-300 text-gray-400'
                                }`}
                                draggable={!!foundLetter}
                                onDragStart={(e) => {
                                  if (foundLetter) {
                                    e.dataTransfer.setData('text/plain', JSON.stringify({
                                      id: `found-${index}`,
                                      emoji: foundLetter,
                                      color: 'text-green-800',
                                      objectName: 'found-letter',
                                      sourceIndex: index
                                    }));
                                  }
                                }}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => {
                                  e.preventDefault();
                                  const data = JSON.parse(e.dataTransfer.getData('text/plain'));
                                  
                                  // Check if letter matches the expected position
                                  const expectedLetter = currentWord[index].toUpperCase();
                                  if (data.emoji?.toUpperCase() === expectedLetter && !foundLetter) {
                                    const newFoundLetters = [...wordLettersFound];
                                    newFoundLetters[index] = data.emoji;
                                    setWordLettersFound(newFoundLetters);
                                    
                                    // Remove letter from mixed letters
                                    setMixedLetters(prev => prev.filter(letter => letter.id !== data.id));
                                    
                                    toast.success(`Litera ${data.emoji} plasată corect!`);
                                  }
                                }}
                              >
                                {foundLetter || '_'}
                              </div>
                            );
                          })
                        ) : (
                          <p className="text-center text-gray-500">Selectează o categorie pentru a începe</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Second Container: Despărțirea în Silabe - now accepts drops */}
                <Card className="min-h-64">
                  <CardHeader>
                    <CardTitle className="text-center text-lg text-orange-600">
                      {(currentTranslation as any).syllableBreakdown || "Syllable Breakdown"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div 
                      className="min-h-48 p-4 border-2 border-dashed border-orange-300 rounded-lg bg-orange-50 transition-colors duration-200"
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.add('border-orange-500', 'bg-orange-100');
                      }}
                      onDragLeave={(e) => {
                        e.currentTarget.classList.remove('border-orange-500', 'bg-orange-100');
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.remove('border-orange-500', 'bg-orange-100');
                        
                        const data = JSON.parse(e.dataTransfer.getData('text/plain'));
                        
                        if (data.objectName === 'found-letter') {
                          // Moving from "Cuvântul Găsit" to "Despărțirea în Silabe"
                          const newToken = {
                            id: `syllable-${Date.now()}`,
                            emoji: data.emoji,
                            color: 'text-orange-800',
                            objectName: 'syllable-letter',
                            sourceIndex: data.sourceIndex
                          };
                          
                          setSyllableBreakdownTokens(prev => [...prev, newToken]);
                          
                          // Remove from "Cuvântul Găsit"
                          const newFoundLetters = [...wordLettersFound];
                          newFoundLetters[data.sourceIndex] = null;
                          setWordLettersFound(newFoundLetters);
                          
                          toast.success(`${(currentTranslation as any).letterMovedToSyllables?.replace('{0}', data.emoji) || `Letter ${data.emoji} moved to syllables!`}`);
                        }
                      }}
                    >
                      <div className="flex flex-wrap gap-2 justify-center items-center">
                        {syllableBreakdownTokens.length > 0 ? (
                          syllableBreakdownTokens.map((token, index) => (
                            <div
                              key={token.id}
                              className="px-3 py-2 bg-orange-200 border border-orange-400 rounded-lg text-lg font-bold text-orange-800 cursor-pointer hover:bg-orange-300 transition-colors duration-200"
                              onClick={() => {
                                // Remove token and return letter to "Cuvântul Găsit" if it's a letter
                                if (token.objectName === 'syllable-letter' && token.sourceIndex !== undefined) {
                                  const newFoundLetters = [...wordLettersFound];
                                  newFoundLetters[token.sourceIndex] = token.emoji;
                                  setWordLettersFound(newFoundLetters);
                                  
                                  setSyllableBreakdownTokens(prev => 
                                    prev.filter(t => t.id !== token.id)
                                  );
                                  
                                  toast.success(`${(currentTranslation as any).letterReturnedToWord?.replace('{0}', token.emoji) || `Letter ${token.emoji} returned to word!`}`);
                                } else if (token.objectName === 'hyphen') {
                                  // Remove hyphen
                                  setSyllableBreakdownTokens(prev => 
                                    prev.filter(t => t.id !== token.id)
                                  );
                                }
                              }}
                              title={token.objectName === 'hyphen' ? ((currentTranslation as any).clickToDeleteHyphen || 'Click to delete hyphen') : ((currentTranslation as any).clickToReturnLetter || 'Click to return letter')}
                            >
                              {token.emoji}
                            </div>
                          ))
                        ) : (
                          <p className="text-center text-gray-500">
                            {(currentTranslation as any).dragLettersFromWord || "Drag letters from \"Word Found\" to form syllables"}
                          </p>
                        )}
                      </div>
                      {/* Manual hyphen insertion button */}
                      <div className="flex justify-center mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newToken = {
                              id: `hyphen-${Date.now()}`,
                              emoji: '-',
                              color: 'text-orange-600',
                              objectName: 'hyphen'
                            };
                            setSyllableBreakdownTokens(prev => [...prev, newToken]);
                          }}
                          className="text-orange-600 border-orange-300 hover:bg-orange-100"
                        >
                          {(currentTranslation as any).addHyphen || "Add Hyphen (-)"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : isVowelConsonantLevel() ? (
              <>
                <EnhancedDropZone
                  title={currentTranslation.vowels}
                  onObjectsChange={(count, objects) => {
                    setUpperDroppedCount(count);
                    setUpperDroppedLetters(objects || []);
                  }}
                  objectName="vocale"
                  maxObjects={50}
                  titleColor="text-blue-600"
                  borderColor="border-blue-300"
                  resetTrigger={resetTrigger}
                  className="min-h-64"
                  containerType="vowels"
                  canDropFunction={canDropLetter}
                  onLetterDropped={updateSelectedLetterDisplay}
                  isVowelConsonantMode={true}
                />
                <EnhancedDropZone
                  title={currentTranslation.consonants}
                  onObjectsChange={(count, objects) => {
                    setLowerDroppedCount(count);
                    setLowerDroppedLetters(objects || []);
                  }}
                  objectName="consoane"
                  maxObjects={50}
                  titleColor="text-red-600"
                  borderColor="border-red-300"
                  resetTrigger={resetTrigger}
                  className="min-h-64"
                  containerType="consonants"
                  canDropFunction={canDropLetter}
                  onLetterDropped={updateSelectedLetterDisplay}
                  isVowelConsonantMode={true}
                />
              </>
            ) : isSyllableFormationLevel() ? (
              <>
                {/* "Silabe" container */}
                <SyllableBuilderDropZone
                  title={(currentTranslation as any).syllables || "Syllables"}
                  onSyllableBuilding={handleSyllableBuilding}
                  onSyllableTokensChange={handleSyllableTokensChange}
                  syllableSize={syllableSize}
                  syllablesInBuilder={syllablesInBuilder}
                  syllableTokens={syllableTokens}
                  resetTrigger={resetTrigger}
                  onLetterDropped={updateSelectedLetterDisplay}
                />
                <WordBuilderDropZone
                  title={(currentTranslation as any).words || "Words"}
                  onWordFormation={handleWordFormation}
                  completedWords={completedWords}
                  currentWordTokens={currentWordTokens}
                  syllableSize={syllableSize}
                  resetTrigger={resetTrigger}
                  onLetterDropped={updateSelectedLetterDisplay}
                />
              </>
            ) : (
              <>
                <DropZone
                  title={currentTranslation.upperCase}
                  onObjectsChange={(count, objects) => {
                    setUpperDroppedCount(count);
                    setUpperDroppedLetters(objects || []);
                  }}
                  objectName="litere mari"
                  maxObjects={letterCount}
                  titleColor="text-blue-600"
                  borderColor="border-blue-300"
                  resetTrigger={resetTrigger}
                  className="min-h-64"
                />
                <DropZone
                  title={currentTranslation.lowerCase}
                  onObjectsChange={(count, objects) => {
                    setLowerDroppedCount(count);
                    setLowerDroppedLetters(objects || []);
                  }}
                  objectName="litere mici"
                  maxObjects={letterCount}
                  titleColor="text-red-600"
                  borderColor="border-red-300"
                  resetTrigger={resetTrigger}
                  className="min-h-64"
                />
              </>
            )}
            </div>

          {/* Game Complete Message */}
          {gameComplete && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="text-center p-4">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h3 className="text-lg font-bold text-green-800">{currentTranslation.gameComplete}</h3>
                <Button 
                  onClick={handleNextRound}
                  className="mt-2"
                  variant="default"
                >
                  {currentTranslation.nextRound}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <SidebarProvider>
      <div key={selectedLanguage} className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b ml-48"> {/* Added ml-48 to align with sidebar width */}
          <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-2 overflow-x-auto"> {/* Changed from max-w-7xl to max-w-full for wider header */}
            <div className="flex items-center justify-between min-w-max gap-4"> {/* Added min-w-max and gap-4 to prevent overlap */}
              {/* Left side - Logo and title (compact) */}
              <div className="flex items-center space-x-3 flex-shrink-0">
                <img src={numLitLogo} alt="NumLit" className="h-8 w-auto" />
                <h1 className="text-lg font-bold text-primary whitespace-nowrap">{currentTranslation.title}</h1>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/')}
                  className="ml-2 h-8 px-2"
                  title={((currentTranslation as any).backToMainMenu || "Back to main menu")}
                >
                  <Home className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Center - Game controls and progress */}
              <div className="flex items-center space-x-3 flex-shrink-0">
                <SidebarTrigger />
                <GameControls
                  onPlay={handlePlay}
                  onPause={handlePause}
                  onShuffle={handleShuffle}
                  onRepeat={handleRepeat}
                  isPlaying={isPlaying}
                />
                {/* Compact progress bar */}
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground whitespace-nowrap">Progres:</span>
                  <ProgressBar current={progress / 25} total={4} className="w-20 h-2" />
                </div>
              </div>
              
              {/* Right side - Timer, zoom, score, and buttons */}
              <div className="flex items-center space-x-2 flex-shrink-0">
                <Timer isRunning={isPlaying} />
                <ZoomControls zoom={zoomLevel} onZoomChange={setZoomLevel} />
                <Badge variant="secondary" className="text-xs whitespace-nowrap">Scor: {score}</Badge>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8">
                      <Info className="w-4 h-4 mr-1" />
                      <span className="text-xs hidden sm:inline">{currentTranslation.instructions}</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{currentTranslation.howToPlayTitle}</DialogTitle>
                      <DialogDescription>{currentTranslation.howToPlay}</DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
                
                <Button variant="outline" size="sm" onClick={() => navigate('/')} className="h-8">
                  <Home className="w-4 h-4 mr-1" />
                  <span className="text-xs hidden sm:inline">{currentTranslation.back}</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex overflow-auto">
          {renderSidebar()}
          <div className="flex-1 overflow-auto">
            {renderGameContent()}
          </div>
        </div>

        {/* Hidden Canvas for future extensions */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Literacy Keyboard - Main */}
        {showKeyboard && (
          <LiteracyKeyboard
            onKeyPress={handleKeyPress}
            onClose={() => setShowKeyboard(false)}
            selectedLanguage={selectedLanguage}
            onLanguageChange={(lang) => setSelectedLanguage(lang as keyof typeof translations)}
          />
        )}

        {/* Literacy Keyboard - Manual Mode - Bottom overlay like in Literatie game */}
        {showLiteracyKeyboard && (
          <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-auto max-h-64">
            <LiteracyKeyboard
              onKeyPress={handleKeyPress}
              onClose={() => setShowLiteracyKeyboard(false)}
              selectedLanguage={selectedLanguage}
              onLanguageChange={(lang) => setSelectedLanguage(lang as keyof typeof translations)}
              className="border-t-4 border-primary/20 bg-white/95 backdrop-blur-sm shadow-2xl"
            />
          </div>
        )}
      </div>
    </SidebarProvider>
  );
};

export default LiteraSilaba;