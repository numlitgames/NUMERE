import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import NumberSelector from "@/components/educational/NumberSelector";
import ProgressBar from "@/components/educational/ProgressBar";
import GameControls from "@/components/educational/GameControls";
import ZoomControls from "@/components/educational/ZoomControls";
import Timer from "@/components/educational/Timer";
import { Input } from "@/components/ui/input";
import NumLitKeyboard from "@/components/educational/NumLitKeyboard";
import RigletaNumLit from "@/components/educational/RigletaNumLit";
import Rigleta from "@/components/educational/Rigleta";
import { Home, Info } from "lucide-react";

// Supported languages
const translations = {
  ro: {
    title: "Vecinii Numerelor",
    back: "Înapoi",
    language: "Limbă",
    level: "Nivel",
    digitLabel: "Numărul de cifre",
    concentrationLabel: "Concentru",
    instructions: "Instrucțiuni",
    howToPlayTitle: "Cum se joacă",
    howToPlay: "Primești un număr. Găsește vecinul anterior (n−1) și vecinul următor (n+1). Trage rigletele în zonele corespunzătoare.",
    exercise: "Exercițiu",
    neighborsProof: "Proba vecinilor",
    previous: "Anterior",
    next: "Următor",
    current: "Număr curent",
    progressLabel: "Progres",
    availableRods: "Vecinii mei sunt",
    dragToValidate: "Trage rigletele în zonele de validare",
    leftZone: "Vecinul mai mic ( anterior )",
    centerZone: "Zona curent (n)",
    rightZone: "Vecinul mai Mare ( predecesor )",
    showKeyboard: "Arată Tastatura",
    hideKeyboard: "Ascunde Tastatura",
    differenceLabel: "Diferența între mine și vecinii mei este de",
    units: "UNITĂȚI",
    tens: "ZECI", 
    hundreds: "SUTE",
    thousands: "MII",
    tenThousands: "ZECI MII",
    hundredThousands: "SUTE MII",
    millions: "MILIOANE",
    unitsShort: "U",
    tensShort: "Z",
    hundredsShort: "S",
    thousandsShort: "M"
  },
  en: {
    title: "Number Neighbors",
    back: "Back",
    language: "Language",
    level: "Level",
    digitLabel: "Number of digits",
    concentrationLabel: "Range",
    instructions: "Instructions",
    howToPlayTitle: "How to play",
    howToPlay: "You get a number. Find the previous neighbor (n−1) and the next neighbor (n+1). Drag the rods to the corresponding zones.",
    exercise: "Exercise",
    neighborsProof: "Neighbors check",
    previous: "Previous",
    next: "Next",
    current: "Current number",
    progressLabel: "Progress",
    availableRods: "My neighbors are",
    dragToValidate: "Drag rods to validation zones",
    leftZone: "Smaller neighbor (previous)",
    centerZone: "Current zone (n)",
    rightZone: "Larger neighbor (predecessor)",
    showKeyboard: "Show Keyboard",
    hideKeyboard: "Hide Keyboard",
    differenceLabel: "The difference between me and my neighbors is",
    units: "UNITS",
    tens: "TENS",
    hundreds: "HUNDREDS", 
    thousands: "THOUSANDS",
    tenThousands: "TEN THOUSANDS",
    hundredThousands: "HUNDRED THOUSANDS",
    millions: "MILLIONS",
    unitsShort: "U",
    tensShort: "T",
    hundredsShort: "H",
    thousandsShort: "Th"
  },
  fr: {
    title: "Voisins des nombres",
    back: "Retour",
    language: "Langue",
    level: "Niveau",
    digitLabel: "Nombre de chiffres",
    concentrationLabel: "Plage",
    instructions: "Instructions",
    howToPlayTitle: "Comment jouer",
    howToPlay: "Vous recevez un nombre. Trouvez le voisin précédent (n−1) et le suivant (n+1). Faites glisser les tiges vers les zones correspondantes.",
    exercise: "Exercice",
    neighborsProof: "Vérification des voisins",
    previous: "Précédent",
    next: "Suivant",
    current: "Nombre actuel",
    progressLabel: "Progrès",
    availableRods: "Mes voisins sont",
    dragToValidate: "Glissez les tiges vers les zones de validation",
    leftZone: "Voisin plus petit (précédent)",
    centerZone: "Zone actuelle (n)",
    rightZone: "Voisin plus grand (prédécesseur)",
    showKeyboard: "Afficher le clavier",
    hideKeyboard: "Masquer le clavier",
    differenceLabel: "La différence entre moi et mes voisins est de",
    units: "UNITÉS",
    tens: "DIZAINES",
    hundreds: "CENTAINES",
    thousands: "MILLIERS",
    tenThousands: "DIX MILLIERS",
    hundredThousands: "CENT MILLIERS",
    millions: "MILLIONS",
    unitsShort: "U",
    tensShort: "D",
    hundredsShort: "C",
    thousandsShort: "M"
  },
  it: {
    title: "Vicini dei numeri",
    back: "Indietro",
    language: "Lingua",
    level: "Livello",
    digitLabel: "Numero di cifre",
    concentrationLabel: "Intervallo",
    instructions: "Istruzioni",
    howToPlayTitle: "Come giocare",
    howToPlay: "Ricevi un numero. Trova il vicino precedente (n−1) e quello successivo (n+1). Trascina le aste nelle zone corrispondenti.",
    exercise: "Esercizio",
    neighborsProof: "Verifica dei vicini",
    previous: "Precedente",
    next: "Successivo",
    current: "Numero corrente",
    progressLabel: "Progresso",
    availableRods: "I miei vicini sono",
    dragToValidate: "Trascina le aste nelle zone di validazione",
    leftZone: "Vicino più piccolo (precedente)",
    centerZone: "Zona corrente (n)",
    rightZone: "Vicino più grande (predecessore)",
    showKeyboard: "Mostra tastiera",
    hideKeyboard: "Nascondi tastiera",
    differenceLabel: "La differenza tra me e i miei vicini è",
    units: "UNITÀ",
    tens: "DECINE",
    hundreds: "CENTINAIA",
    thousands: "MIGLIAIA",
    tenThousands: "DIECI MIGLIAIA",
    hundredThousands: "CENTO MIGLIAIA",
    millions: "MILIONI",
    unitsShort: "U",
    tensShort: "D",
    hundredsShort: "C",
    thousandsShort: "M"
  },
  ru: {
    title: "Соседи числа",
    back: "Назад",
    language: "Язык",
    level: "Уровень",
    digitLabel: "Количество цифр",
    concentrationLabel: "Диапазон",
    instructions: "Инструкции",
    howToPlayTitle: "Как играть",
    howToPlay: "Дан номер. Найдите предыдущего соседа (n−1) и следующего (n+1). Перетащите стержни в соответствующие зоны.",
    exercise: "Упражнение",
    neighborsProof: "Проверка соседей",
    previous: "Предыдущий",
    next: "Следующий",
    current: "Текущее число",
    progressLabel: "Прогресс",
    availableRods: "Мои соседи",
    dragToValidate: "Перетащите стержни в зоны проверки",
    leftZone: "Меньший сосед (предыдущий)",
    centerZone: "Текущая зона (n)",
    rightZone: "Больший сосед (предшественник)",
    showKeyboard: "Показать клавиатуру",
    hideKeyboard: "Скрыть клавиатуру",
    differenceLabel: "Разность между мной и моими соседями равна",
    units: "ЕДИНИЦЫ",
    tens: "ДЕСЯТКИ",
    hundreds: "СОТНИ",
    thousands: "ТЫСЯЧИ",
    tenThousands: "ДЕСЯТКИ ТЫСЯЧ",
    hundredThousands: "СОТНИ ТЫСЯЧ",
    millions: "МИЛЛИОНЫ",
    unitsShort: "Е",
    tensShort: "Д",
    hundredsShort: "С",
    thousandsShort: "Т"
  },
  hu: {
    title: "Szám szomszédai",
    back: "Vissza",
    language: "Nyelv",
    level: "Szint",
    digitLabel: "Számjegyek száma",
    concentrationLabel: "Tartomány",
    instructions: "Utasítások",
    howToPlayTitle: "Hogyan kell játszani",
    howToPlay: "Kapsz egy számot. Keresd meg az előző szomszédot (n−1) és a következőt (n+1). Húzd a rudakat a megfelelő zónákba.",
    exercise: "Gyakorlat",
    neighborsProof: "Szomszédok ellenőrzése",
    previous: "Előző",
    next: "Következő",
    current: "Aktuális szám",
    progressLabel: "Előrehaladás",
    availableRods: "Szomszédaim",
    dragToValidate: "Húzd a rudakat az ellenőrzési zónákba",
    leftZone: "Kisebb szomszéd (előző)",
    centerZone: "Jelenlegi zóna (n)",
    rightZone: "Nagyobb szomszéd (előd)",
    showKeyboard: "Billentyűzet megjelenítése",
    hideKeyboard: "Billentyűzet elrejtése",
    differenceLabel: "A különbség köztem és a szomszédaim között",
    units: "EGYESEK",
    tens: "TÍZESEK",
    hundreds: "SZÁZASOK",
    thousands: "EZRESEK",
    tenThousands: "TÍZEZER",
    hundredThousands: "SZÁZEZER",
    millions: "MILLIÓK",
    unitsShort: "E",
    tensShort: "T",
    hundredsShort: "Sz",
    thousandsShort: "E"
  },
  de: {
    title: "Zahlen-Nachbarn",
    back: "Zurück",
    language: "Sprache",
    level: "Stufe",
    digitLabel: "Anzahl der Ziffern",
    concentrationLabel: "Bereich",
    instructions: "Anweisungen",
    howToPlayTitle: "Wie man spielt",
    howToPlay: "Du erhältst eine Zahl. Finde den vorherigen Nachbarn (n−1) und den nächsten (n+1). Ziehe die Stäbe in die entsprechenden Zonen.",
    exercise: "Übung",
    neighborsProof: "Nachbarn-Prüfung",
    previous: "Vorherige",
    next: "Nächste",
    current: "Aktuelle Zahl",
    progressLabel: "Fortschritt",
    availableRods: "Meine Nachbarn sind",
    dragToValidate: "Ziehe die Stäbe in die Validierungszonen",
    leftZone: "Kleinerer Nachbar (vorheriger)",
    centerZone: "Aktuelle Zone (n)",
    rightZone: "Größerer Nachbar (Vorgänger)",
    showKeyboard: "Tastatur anzeigen",
    hideKeyboard: "Tastatur ausblenden",
    differenceLabel: "Der Unterschied zwischen mir und meinen Nachbarn ist",
    units: "EINER",
    tens: "ZEHNER",
    hundreds: "HUNDERTER",
    thousands: "TAUSENDER",
    tenThousands: "ZEHNTAUSEND",
    hundredThousands: "HUNDERTTAUSEND",
    millions: "MILLIONEN",
    unitsShort: "E",
    tensShort: "Z",
    hundredsShort: "H",
    thousandsShort: "T"
  },
  cz: {
    title: "Sousedé čísel",
    back: "Zpět",
    language: "Jazyk",
    level: "Úroveň",
    digitLabel: "Počet číslic",
    concentrationLabel: "Rozsah",
    instructions: "Instrukce",
    howToPlayTitle: "Jak hrát",
    howToPlay: "Dostanete číslo. Najděte předchozího souseda (n−1) a dalšího (n+1). Přetáhněte tyčky do odpovídajících zón.",
    exercise: "Cvičení",
    neighborsProof: "Kontrola sousedů",
    previous: "Předchozí",
    next: "Další",
    current: "Aktuální číslo",
    progressLabel: "Postup",
    availableRods: "Moji sousedé jsou",
    dragToValidate: "Přetáhněte tyčky do validačních zón",
    leftZone: "Menší soused (předchozí)",
    centerZone: "Aktuální zóna (n)",
    rightZone: "Větší soused (předchůdce)",
    showKeyboard: "Zobrazit klávesnici",
    hideKeyboard: "Skrýt klávesnici",
    differenceLabel: "Rozdíl mezi mnou a mými sousedy je",
    units: "JEDNOTKY",
    tens: "DESÍTKY",
    hundreds: "STOVKY",
    thousands: "TISÍCE",
    tenThousands: "DESETI TISÍC",
    hundredThousands: "STO TISÍC",
    millions: "MILIONY",
    unitsShort: "J",
    tensShort: "D",
    hundredsShort: "S",
    thousandsShort: "T"
  },
  es: {
    title: "Vecinos de los números",
    back: "Atrás",
    language: "Idioma",
    level: "Nivel",
    digitLabel: "Número de dígitos",
    concentrationLabel: "Rango",
    instructions: "Instrucciones",
    howToPlayTitle: "Cómo jugar",
    howToPlay: "Recibes un número. Encuentra el vecino anterior (n−1) y el siguiente (n+1). Arrastra las varillas a las zonas correspondientes.",
    exercise: "Ejercicio",
    neighborsProof: "Comprobación de vecinos",
    previous: "Anterior",
    next: "Siguiente",
    current: "Número actual",
    progressLabel: "Progreso",
    availableRods: "Mis vecinos son",
    dragToValidate: "Arrastra las varillas a las zonas de validación",
    leftZone: "Vecino menor (anterior)",
    centerZone: "Zona actual (n)",
    rightZone: "Vecino mayor (predecesor)",
    showKeyboard: "Mostrar teclado",
    hideKeyboard: "Ocultar teclado",
    differenceLabel: "La diferencia entre yo y mis vecinos es",
    units: "UNIDADES",
    tens: "DECENAS",
    hundreds: "CENTENAS",
    thousands: "MILLARES",
    tenThousands: "DIEZ MILLARES",
    hundredThousands: "CIEN MILLARES",
    millions: "MILLONES",
    unitsShort: "U",
    tensShort: "D",
    hundredsShort: "C",
    thousandsShort: "M"
  },
  bg: {
    title: "Съседи на числото",
    back: "Назад",
    language: "Език",
    level: "Ниво",
    digitLabel: "Брой цифри",
    concentrationLabel: "Обхват",
    instructions: "Инструкции",
    howToPlayTitle: "Как се играе",
    howToPlay: "Получавате число. Намерете предишния съсед (n−1) и следващия (n+1). Плъзнете пръчките в съответните зони.",
    exercise: "Упражнение",
    neighborsProof: "Проверка на съседите",
    previous: "Предишно",
    next: "Следващо",
    current: "Текущо число",
    progressLabel: "Прогрес",
    availableRods: "Моите съседи са",
    dragToValidate: "Плъзнете пръчките в зоните за валидация",
    leftZone: "По-малък съсед (предишен)",
    centerZone: "Текуща зона (n)",
    rightZone: "По-голям съсед (предшественик)",
    showKeyboard: "Покажи клавиатура",
    hideKeyboard: "Скрий клавиатура",
    differenceLabel: "Разликата между мен и моите съседи е",
    units: "ЕДИНИЦИ",
    tens: "ДЕСЕТКИ",
    hundreds: "СТОТИЦИ",
    thousands: "ХИЛЯДИ",
    tenThousands: "ДЕСЕТ ХИЛЯДИ",
    hundredThousands: "СТО ХИЛЯДИ",
    millions: "МИЛИОНИ",
    unitsShort: "Е",
    tensShort: "Д",
    hundredsShort: "С",
    thousandsShort: "Х"
  },
  pl: {
    title: "Sąsiedzi liczby",
    back: "Wstecz",
    language: "Język",
    level: "Poziom",
    digitLabel: "Liczba cyfr",
    concentrationLabel: "Zakres",
    instructions: "Instrukcje",
    howToPlayTitle: "Jak grać",
    howToPlay: "Otrzymujesz liczbę. Znajdź poprzedniego sąsiada (n−1) i następnego (n+1). Przeciągnij pałeczki do odpowiednich stref.",
    exercise: "Ćwiczenie",
    neighborsProof: "Sprawdzenie sąsiadów",
    previous: "Poprzedni",
    next: "Następny",
    current: "Aktualna liczba",
    progressLabel: "Postęp",
    availableRods: "Moi sąsiedzi to",
    dragToValidate: "Przeciągnij pałeczki do stref walidacji",
    leftZone: "Mniejszy sąsiad (poprzedni)",
    centerZone: "Aktualna strefa (n)",
    rightZone: "Większy sąsiad (poprzednik)",
    showKeyboard: "Pokaż klawiaturę",
    hideKeyboard: "Ukryj klawiaturę",
    differenceLabel: "Różnica między mną a moimi sąsiadami wynosi",
    units: "JEDNOSTKI",
    tens: "DZIESIĄTKI",
    hundreds: "SETKI",
    thousands: "TYSIĄCE",
    tenThousands: "DZIESIĘĆ TYSIĘCY",
    hundredThousands: "STO TYSIĘCY",
    millions: "MILIONY",
    unitsShort: "J",
    tensShort: "D",
    hundredsShort: "S",
    thousandsShort: "T"
  },
  ar: {
    title: "جيران العدد",
    back: "عودة",
    language: "اللغة",
    level: "المستوى",
    digitLabel: "عدد الأرقام",
    concentrationLabel: "النطاق",
    instructions: "التعليمات",
    howToPlayTitle: "طريقة اللعب",
    howToPlay: "يُعطى لك عدد. ابحث عن الجار السابق (n−1) والجار التالي (n+1). اسحب العصي إلى المناطق المناسبة.",
    exercise: "تمرين",
    neighborsProof: "تحقق الجيران",
    previous: "السابق",
    next: "التالي",
    current: "العدد الحالي",
    progressLabel: "التقدم",
    availableRods: "جيراني هم",
    dragToValidate: "اسحب العصي إلى مناطق التحقق",
    leftZone: "الجار الأصغر (السابق)",
    centerZone: "المنطقة الحالية (n)",
    rightZone: "الجار الأكبر (السلف)",
    showKeyboard: "إظهار لوحة المفاتيح",
    hideKeyboard: "إخفاء لوحة المفاتيح",
    differenceLabel: "الفرق بيني وبين جيراني هو",
    units: "الآحاد",
    tens: "العشرات",
    hundreds: "المئات",
    thousands: "الآلاف",
    tenThousands: "عشرة آلاف",
    hundredThousands: "مئة ألف",
    millions: "الملايين",
    unitsShort: "آ",
    tensShort: "ع",
    hundredsShort: "م",
    thousandsShort: "أ"
  },
  tr: {
    title: "Sayıların Komşuları",
    back: "Geri",
    language: "Dil",
    level: "Seviye",
    digitLabel: "Basamak sayısı",
    concentrationLabel: "Aralık",
    instructions: "Talimatlar",
    howToPlayTitle: "Nasıl oynanır",
    howToPlay: "Bir sayı verilir. Önceki komşuyu (n−1) ve sonraki komşuyu (n+1) bul. Çubukları ilgili bölgelere sürükle.",
    exercise: "Egzersiz",
    neighborsProof: "Komşu kontrolü",
    previous: "Önceki",
    next: "Sonraki",
    current: "Mevcut sayı",
    progressLabel: "İlerleme",
    availableRods: "Komşularım",
    dragToValidate: "Çubukları doğrulama bölgelerine sürükle",
    leftZone: "Küçük komşu (önceki)",
    centerZone: "Mevcut bölge (n)",
    rightZone: "Büyük komşu (sonraki)",
    showKeyboard: "Klavyeyi Göster",
    hideKeyboard: "Klavyeyi Gizle",
    differenceLabel: "Benimle komşularım arasındaki fark",
    units: "BİRLER",
    tens: "ONLAR",
    hundreds: "YÜZLER",
    thousands: "BİNLER",
    tenThousands: "ON BİNLER",
    hundredThousands: "YÜZ BİNLER",
    millions: "MİLYONLAR",
    unitsShort: "B",
    tensShort: "O",
    hundredsShort: "Y",
    thousandsShort: "Bn"
  }
} as const;

type LangKey = keyof typeof translations;

type GameLevel = 1 | 2 | 3 | 4;

type ConcentrationKey = "0-10" | "0-100" | "0-1000" | ">";

export default function VeciniiNumerelor() {
  const [language, setLanguage] = useState<LangKey>('ro');
  const [level, setLevel] = useState<GameLevel>(1);
  const [digits, setDigits] = useState(1);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoom, setZoom] = useState(60);
  const [targetNumber, setTargetNumber] = useState<number>(() => Math.floor(Math.random() * 10));
  const [concentrationCap, setConcentrationCap] = useState<number>(10);
  const [concentrationInput, setConcentrationInput] = useState<string>("10");
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [options, setOptions] = useState<number[]>([]);
  const [placements, setPlacements] = useState<{ left?: number; center?: number; right?: number }>({});
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [concentrationMode, setConcentrationMode] = useState<'0-10' | '0-letters' | '0-100' | '>'>('0-10');
  const [neighborDifference, setNeighborDifference] = useState<number>(1);
  // Result input states for calculation zones
  const [leftResultInputs, setLeftResultInputs] = useState(['', '']);
  const [rightResultInputs, setRightResultInputs] = useState(['', '']);
  const [activeInputIndex, setActiveInputIndex] = useState<{section: 'left' | 'right', index: number} | null>(null);

  const getLettersForLanguage = (lang: LangKey) => {
    const map: Record<string, number> = { ro: 31, en: 26, fr: 32, cz: 42, de: 30, es: 27, it: 26, hu: 44, pl: 32, bg: 30, ru: 33, ar: 28, tr: 29 };
    return map[lang] ?? 31;
  };

  useEffect(() => {
    // Sync concentration cap with keyboard mode and language
    if (concentrationMode === '0-letters') {
      const cap = getLettersForLanguage(language);
      setConcentrationCap(cap);
      setConcentrationInput(String(cap));
    } else if (concentrationMode === '0-10') {
      setConcentrationCap(10);
      setConcentrationInput("10");
    } else if (concentrationMode === '0-100') {
      setConcentrationCap(100);
      setConcentrationInput("100");
    }
  }, [language, concentrationMode]);

  const t = translations[language];

  useEffect(() => {
    document.title = `${t.title} | NumLit`;
  }, [t.title]);

  // Helper function to calculate sum of digits (needed for concentration constraint)
  const digitSum = (num: number): number => {
    return num.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
  };

  // Number generation logic copied from "Să Calculăm" game for consistency
  const generateTargetNumber = (): number => {
    const maxNum = Math.pow(10, digits) - 1;
    const minNum = digits === 1 ? 1 : Math.pow(10, digits - 1);
    
    // For multi-digit numbers, ensure neighbors also have the same number of digits
    if (digits > 1) {
      // Generate a number that leaves room for neighbors to have same digit count
      const safeMin = minNum + 1; // Ensure n-1 also has same digits
      return Math.floor(Math.random() * (maxNum - safeMin + 1)) + safeMin;
    }
    
    return Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
  };

  // Generate number display in boxes with place value labels (style from "Să calculăm")
  const renderNumberDisplay = (number: number) => {
    const numDigits = number.toString().split('').reverse();
    const getPositionLabel = (pos: number) => {
      switch (pos) {
        case 0: return t.unitsShort;
        case 1: return t.tensShort;
        case 2: return t.hundredsShort;
        case 3: return t.thousandsShort;
        default: return `10^${pos}`;
      }
    };

    const getPositionColor = (pos: number) => {
      const labelColors = [
        'bg-blue-500',      // units - blue
        'bg-red-500',       // tens - red  
        'bg-orange-500',    // hundreds - orange
        'bg-black',         // thousands - black
      ];
      return labelColors[pos % labelColors.length];
    };

    return (
      <div className="flex flex-col items-center gap-3">
        <div className="hidden">Suma cifrelor: {digitSum(number)} / {concentrationCap}</div>
        <div className="flex gap-1">
          {[...numDigits].reverse().map((digit, i) => {
            const pos = numDigits.length - 1 - i; // 0=U, 1=Z, ...
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                {/* Căsuțe cu margini negre subțiri și interior gri */}
                <div className={`w-16 h-16 border border-gray-800 bg-gray-100 rounded-lg flex items-center justify-center text-[48px] font-black ${
                  parseInt(digit) % 2 === 0 ? 'text-red-600' : 'text-blue-600'
                }`}>
                  {digit}
                </div>
                
                {/* Etichete traduse cu culorile din "Să calculăm" */}
                <div className={`px-3 py-1 rounded text-xs font-black text-white ${getPositionColor(pos)}`}>
                  {getPositionLabel(pos)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Smaller variant for Calculation Zones (matches "Număr curent" sizing)
  const renderNumberDisplaySmall = (number: number) => {
    const numDigits = number.toString().split('').reverse();
    return (
      <div className="flex gap-1">
        {[...numDigits].reverse().map((digit, i) => {
          const pos = numDigits.length - 1 - i; // 0=U,1=Z,2=S,3=M
          return (
            <div key={i} className="flex flex-col items-center gap-1">
            <div className={`w-14 h-14 border border-gray-800 bg-gray-100 rounded-lg flex items-center justify-center text-[43px] font-black ${
              parseInt(digit) % 2 === 0 ? 'text-red-600' : 'text-blue-600'
            }`}>
              {digit}
            </div>
               <div className={`px-2 py-0.5 rounded text-[10px] font-black text-white ${
                pos === 0 ? 'bg-blue-500' : pos === 1 ? 'bg-red-500' : pos === 2 ? 'bg-orange-500' : 'bg-black'
              }`}>
                {pos === 0 ? t.unitsShort : pos === 1 ? t.tensShort : pos === 2 ? t.hundredsShort : t.thousandsShort}
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  
  const startNew = () => {
    setIsPlaying(true);
    setIsCorrect(null);
    setPlacements({});

    const newTarget = generateTargetNumber();
    setTargetNumber(newTarget);

    // Set available numbers based on configured difference: N-2*diff, N-diff, N, N+diff, N+2*diff (clamped to >= 0)
    const opts = [
      newTarget - 2 * neighborDifference, 
      newTarget - neighborDifference, 
      newTarget, 
      newTarget + neighborDifference, 
      newTarget + 2 * neighborDifference
    ].filter(n => n >= 0);
    setOptions(opts);
  };

  // Regenerate round when digits, concentration cap, or neighbor difference change, to keep Current Number in sync
  useEffect(() => {
    const newTarget = generateTargetNumber();
    setTargetNumber(newTarget);

    // Available numbers based on configured difference: N-2*diff, N-diff, N, N+diff, N+2*diff (no negatives)
    const opts = [
      newTarget - 2 * neighborDifference, 
      newTarget - neighborDifference, 
      newTarget, 
      newTarget + neighborDifference, 
      newTarget + 2 * neighborDifference
    ].filter(n => n >= 0);
    setOptions(opts);
    setPlacements({});
    setIsCorrect(null);
  }, [digits, concentrationCap, neighborDifference]);

  const handleRigletaDrop = (zone: 'left' | 'center' | 'right', value: number) => {
    setPlacements(prev => ({ ...prev, [zone]: value }));
  };

  const reset = () => {
    setIsPlaying(false);
    setProgress(0);
    setPlacements({});
    setIsCorrect(null);
  };

  const shuffle = () => startNew();

  useEffect(() => {
    if (placements.left !== undefined && placements.center !== undefined && placements.right !== undefined) {
      const isCorrect = 
        placements.left === targetNumber - neighborDifference &&
        placements.center === targetNumber &&
        placements.right === targetNumber + neighborDifference;
      
      setIsCorrect(isCorrect);
      if (isCorrect) {
        setProgress(p => Math.min(10, p + 1));
      }
    }
  }, [placements, targetNumber, neighborDifference]);

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 w-full flex">
        {/* Sidebar */}
        <Sidebar className="w-48">
          <SidebarContent className="bg-white">
            <SidebarGroup>
              <SidebarGroupLabel>
                <Button variant="ghost" onClick={() => (window.location.href = '/')} className="w-full justify-start">
                  <Home className="w-4 h-4 mr-2" />
                  {t.back}
                </Button>
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="p-4 space-y-4">
                  {/* Language */}
                  <div className="bg-green-50 border-2 border-green-300 rounded-lg p-1">
                    <div className="bg-white border-2 border-green-400 rounded-lg p-1 mb-1">
                      <div className="text-sm font-black text-green-600 text-center">
                        {t.language}
                      </div>
                    </div>
                    <Select value={language} onValueChange={(v) => setLanguage(v as LangKey)}>
                      <SelectTrigger className="w-full h-6 text-xs border-green-300 focus:border-green-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white z-50">
                        <SelectItem value="ro">🇷🇴 Română</SelectItem>
                        <SelectItem value="en">🇬🇧 English</SelectItem>
                        <SelectItem value="fr">🇫🇷 Français</SelectItem>
                        <SelectItem value="it">🇮🇹 Italiano</SelectItem>
                        <SelectItem value="ru">🇷🇺 Русский</SelectItem>
                        <SelectItem value="hu">🇭🇺 Magyar</SelectItem>
                        <SelectItem value="de">🇩🇪 Deutsch</SelectItem>
                        <SelectItem value="cz">🇨🇿 Čeština</SelectItem>
                        <SelectItem value="es">🇪🇸 Español</SelectItem>
                        <SelectItem value="bg">🇧🇬 Български</SelectItem>
                        <SelectItem value="pl">🇵🇱 Polski</SelectItem>
                         <SelectItem value="ar">🇸🇦 العربية</SelectItem>
                         <SelectItem value="tr">🇹🇷 Türkçe</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Level */}
                  <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-1">
                    <div className="bg-white border-2 border-purple-400 rounded-lg p-1 mb-1">
                      <div className="text-sm font-black text-purple-600 text-center">
                        {t.level}
                      </div>
                    </div>
                    <Select value={level.toString()} onValueChange={(v) => setLevel(Number(v) as GameLevel)}>
                      <SelectTrigger className="w-full h-6 text-xs border-purple-300 focus:border-purple-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white z-50">
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Digits */}
                  <div className="bg-gray-50 border-2 border-fuchsia-300 rounded-lg p-1">
                    <div className="bg-white border-2 border-fuchsia-400 rounded-lg p-1 mb-1">
                      <div className="text-sm font-black text-fuchsia-600 text-center">
                        {t.digitLabel}
                      </div>
                    </div>
                    <div className="p-1">
                      <NumberSelector value={digits} min={1} max={9} onChange={setDigits} />
                    </div>
                  </div>

                  {/* Concentru */}
                  <div className="bg-orange-50 border-2 border-orange-300 rounded-lg p-1">
                    <div className="bg-white border-2 border-orange-400 rounded-lg p-1 mb-1">
                      <div className="text-sm font-black text-orange-600 text-center">
                        {t.concentrationLabel}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Input
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={concentrationInput}
                          onChange={(e) => {
                            const v = e.target.value.replace(/[^0-9]/g, "");
                            setConcentrationInput(v);
                            setConcentrationCap(v ? Math.max(0, parseInt(v, 10)) : 0);
                          }}
                          placeholder="ex: 10, 31, 100"
                          className="w-full h-6 text-xs border-orange-300 focus:border-orange-500"
                        />
                        <Button variant="outline" size="sm" onClick={() => setShowKeyboard(!showKeyboard)} className="text-xs">
                          {showKeyboard ? t.hideKeyboard : t.showKeyboard}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Limitează suma cifrelor (ex: 31 ⇒ suma max 31)</p>
                    </div>
                  </div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        {/* Main */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="h-16 bg-white border-b-2 border-blue-300 px-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <img src="/lovable-uploads/b3fba488-faeb-4081-a5a6-bf161bfa2928.png" alt="NumLit Logo" className="h-8 w-auto object-contain" draggable={false} />
            </div>

            <div className="text-center flex items-center justify-center gap-3">
              <h1 className="text-2xl font-black text-primary">{t.title}</h1>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Info className="w-4 h-4" />
                    {t.instructions}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl bg-white z-[60] fixed top-6">
                  <DialogHeader>
                    <DialogTitle className="text-center text-xl">{t.howToPlayTitle}</DialogTitle>
                    <DialogDescription className="text-center text-muted-foreground">
                      {t.howToPlay}
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>

            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="px-3 py-1">{t.level} {level}</Badge>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black">{t.progressLabel} {progress}/10</span>
                <ProgressBar current={progress} total={10} onComplete={() => setTimeout(() => setProgress(0), 1500)} />
              </div>
              <ZoomControls zoom={zoom} onZoomChange={setZoom} />
              <Timer isRunning={isPlaying} onTimeUpdate={() => {}} />
              <GameControls
                isPlaying={isPlaying}
                onPlay={startNew}
                onPause={() => setIsPlaying(false)}
                onRepeat={reset}
                onShuffle={shuffle}
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-2" style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full h-full">
              {/* Left: Current Number Display */}
              <Card className="border-2 border-rigleta-4 -ml-[65%] w-[115%] h-[80%] mt-[20%]">
                <CardHeader>
                  <CardTitle className="text-center font-black">{t.current}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center gap-6">
                    <div className="hidden">{targetNumber}</div>
                    {renderNumberDisplay(targetNumber)}
                    
                    {/* Selector pentru diferența vecinilor */}
                    <div className="flex flex-col items-center gap-3 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                      <div className="text-lg font-black text-center text-gray-700">
                        {t.differenceLabel}
                      </div>
                       <Input
                         type="number"
                         min="1"
                         max="10"
                         value={neighborDifference}
                         onChange={(e) => {
                           const value = parseInt(e.target.value) || 1;
                           setNeighborDifference(Math.max(1, Math.min(10, value)));
                         }}
                         className="w-32 h-20 text-center !text-5xl font-black"
                         style={{ fontSize: '3rem', fontWeight: 'bold' }}
                       />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Right: Available Rigletas */}
              <Card className="border-2 border-success -ml-[54%] w-[180%] h-[80%] mt-[20%]">
                <CardHeader>
                  <CardTitle className="text-center font-black">{t.availableRods}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-rows-3 grid-flow-col gap-2">
                    {options.map((value, index) => (
                      <div
                        key={index}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData('rigleta-value', value.toString());
                        }}
                        className="flex items-center justify-center p-3 border-2 border-dashed border-gray-300 rounded-lg cursor-move hover:border-primary transition-colors"
                      >
                        {renderNumberDisplaySmall(value)}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Validation Zones */}
              <Card className="lg:col-span-2 border-2 border-purple-500 -ml-[19%] w-[145%]">
                <CardHeader>
                  <CardTitle className="text-center font-black">{t.dragToValidate}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    {/* Left Zone (n-1) */}
                    <div
                      className="h-32 border-2 border-green-400 border-dashed rounded-lg flex flex-col items-center justify-center bg-green-50 transition-colors hover:bg-green-100"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const value = parseInt(e.dataTransfer.getData('rigleta-value'));
                        handleRigletaDrop('left', value);
                      }}
                    >
                      <span className="text-sm font-black text-green-700">{t.leftZone}</span>
                      {placements.left !== undefined && (
                        <div className="mt-2">
                          {renderNumberDisplaySmall(placements.left)}
                        </div>
                      )}
                    </div>

                    {/* Center Zone (n) */}
                    <div
                      className="h-32 border-2 border-purple-400 border-dashed rounded-lg flex flex-col items-center justify-center bg-purple-50 transition-colors hover:bg-purple-100"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const value = parseInt(e.dataTransfer.getData('rigleta-value'));
                        handleRigletaDrop('center', value);
                      }}
                    >
                      <span className="text-sm font-black text-purple-700">{t.centerZone}</span>
                      {placements.center !== undefined && (
                        <div className="mt-2">
                          {renderNumberDisplaySmall(placements.center)}
                        </div>
                      )}
                    </div>

                    {/* Right Zone (n+1) */}
                    <div
                      className="h-32 border-2 border-orange-400 border-dashed rounded-lg flex flex-col items-center justify-center bg-orange-50 transition-colors hover:bg-orange-100"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const value = parseInt(e.dataTransfer.getData('rigleta-value'));
                        handleRigletaDrop('right', value);
                      }}
                    >
                      <span className="text-sm font-black text-orange-700">{t.rightZone}</span>
                      {placements.right !== undefined && (
                        <div className="mt-2">
                          {renderNumberDisplaySmall(placements.right)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Validation Result */}
                  {isCorrect !== null && (
                    <div className={`mt-4 p-4 rounded-lg text-center font-black ${
                      isCorrect ? 'bg-success-light text-success' : 'bg-error-light text-error'
                    }`}>
                      {isCorrect ? '✅ Corect! Vecinii sunt poziționați corect!' : '❌ Încercați din nou!'}
                    </div>
                  )}

                  {/* Mathematical Proof */}
                  {isCorrect && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg text-center">
                      <h3 className="font-black text-blue-800 mb-2">{t.neighborsProof}</h3>
                      <div className="text-blue-700">
                        {targetNumber - neighborDifference} &lt; {targetNumber} &lt; {targetNumber + neighborDifference}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Calculation Zones like "Să calculăm vizual" */}
              <Card className="lg:col-span-2 border-2 border-indigo-400 -ml-[19%] w-[145%]">
                <CardHeader>
                  <CardTitle className="text-center font-black">{{
                    ro: "Zone de calcul",
                    en: "Calculation zones",
                    fr: "Zones de calcul",
                    it: "Zone di calcolo",
                    ru: "Зоны вычислений",
                    hu: "Számítási zónák",
                    de: "Berechnungszonen",
                    cz: "Výpočetní zóny",
                    es: "Zonas de cálculo",
                    bg: "Зони за изчисления",
                    pl: "Strefy obliczeń",
                    ar: "مناطق الحساب"
                  }[language]}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 grid-cols-1 xl:grid-cols-2">
                    {/* N - 1 */}
                    <div className="flex flex-col items-center gap-4">
                      {/* Expression row */}
                      <div className="flex items-start gap-2 flex-wrap justify-center">
                        {renderNumberDisplaySmall(targetNumber)}
                        <div className="flex items-start pt-4">
                          <div className="w-16 h-16 flex items-center justify-center font-black border-2 border-gray-400 rounded bg-yellow-50 text-gray-700 text-2xl">-</div>
                        </div>
                        {renderNumberDisplaySmall(neighborDifference)}
                        <div className="flex items-start pt-4">
                           <span className="text-3xl font-black text-gray-700">=</span>
                        </div>
                        <div className="flex gap-1">
                          {Array.from({ length: digits }, (_, index) => {
                            const pos = digits - 1 - index; // 0=U,1=Z,2=S,3=M
                            const getLabel = (pos: number) => {
                              if (pos === 0) return t.unitsShort;
                              if (pos === 1) return t.tensShort;
                              if (pos === 2) return t.hundredsShort;
                              return t.thousandsShort;
                            };
                            const getBgColor = (pos: number) => {
                              if (pos === 0) return 'bg-blue-500';
                              if (pos === 1) return 'bg-red-500';
                              if (pos === 2) return 'bg-orange-500';
                              return 'bg-black';
                            };
                            return (
                              <div key={index} className="flex flex-col items-center gap-1">
                                <Input
                                   className={`w-16 h-16 text-center font-black border border-gray-800 bg-gray-100 rounded-lg ${
                                    leftResultInputs[index] && parseInt(leftResultInputs[index]) % 2 === 0 ? 'text-red-600' : 'text-blue-600'
                                  }`}
                                  style={{ fontSize: '24px' }}
                                  value={leftResultInputs[index] || ''}
                                  onChange={(e) => {
                                    const newInputs = [...leftResultInputs];
                                    newInputs[index] = e.target.value;
                                    setLeftResultInputs(newInputs);
                                  }}
                                  onFocus={() => setActiveInputIndex({section: 'left', index})}
                                  maxLength={2}
                                />
                                 <div className={`px-2 py-0.5 rounded text-[10px] font-black text-white ${getBgColor(pos)}`}>
                                  {getLabel(pos)}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Bars for tens/units like visual game */}
                      <div className="flex items-start gap-3">
                        {(() => {
                          const u = targetNumber % 10;
                          const z = Math.floor(targetNumber / 10) % 10;
                          return (
                            <>
                              {/* Tens */}
                              <div className="flex flex-col items-center gap-1">
                                 <div className="px-2 py-1 text-[10px] font-black text-white bg-red-500 rounded">{t.tensShort}</div>
                                <div className="p-1 rounded-lg border border-red-200 bg-red-50 min-h-[48px] min-w-[40px] flex items-end justify-center">
                                  <Rigleta number={Math.max(0, z)} orientation="vertical" interactive={false} />
                                </div>
                              </div>
                              {/* Units */}
                              <div className="flex flex-col items-center gap-1">
                                 <div className="px-2 py-1 text-[10px] font-black text-white bg-blue-500 rounded">{t.unitsShort}</div>
                                <div className="p-1 rounded-lg border border-blue-200 bg-blue-50 min-h-[48px] min-w-[40px] flex items-end justify-center">
                                  <Rigleta number={u} orientation="vertical" interactive={false} />
                                </div>
                              </div>
                              {/* Operator */}
                              <div className="flex items-center px-2">
                                <div className="w-8 h-8 flex items-center justify-center font-black border-2 border-gray-400 rounded bg-yellow-50 text-gray-700">-</div>
                              </div>
                              {/* Difference */}
                              <div className="flex flex-col items-center gap-1">
                                 <div className="px-2 py-1 text-[10px] font-black text-white bg-blue-500 rounded">{t.unitsShort}</div>
                                <div className="p-1 rounded-lg border border-blue-200 bg-blue-50 min-h-[48px] min-w-[40px] flex items-end justify-center">
                                  <Rigleta number={neighborDifference} orientation="vertical" interactive={false} />
                                </div>
                              </div>
                              {/* Equals and placeholders */}
                              <div className="flex items-center px-2">
                                 <span className="text-3xl font-black text-gray-700">=</span>
                              </div>
                              <div className="flex items-end gap-2">
                                <div className="w-10 h-24 border-2 border-dashed border-purple-300 rounded-lg" />
                                <div className="w-10 h-24 border-2 border-dashed border-purple-300 rounded-lg" />
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>

                    {/* N + 1 */}
                    <div className="flex flex-col items-center gap-4">
                      {/* Expression row */}
                      <div className="flex items-start gap-2 flex-wrap justify-center">
                        {renderNumberDisplaySmall(targetNumber)}
                        <div className="flex items-start pt-4">
                          <div className="w-16 h-16 flex items-center justify-center font-black border-2 border-gray-400 rounded bg-yellow-50 text-gray-700 text-2xl">+</div>
                        </div>
                        {renderNumberDisplaySmall(neighborDifference)}
                        <div className="flex items-start pt-4">
                           <span className="text-3xl font-black text-gray-700">=</span>
                        </div>
                        <div className="flex gap-1">
                          {Array.from({ length: digits }, (_, index) => {
                            const pos = digits - 1 - index; // 0=U,1=Z,2=S,3=M
                            const getLabel = (pos: number) => {
                              if (pos === 0) return t.unitsShort;
                              if (pos === 1) return t.tensShort;
                              if (pos === 2) return t.hundredsShort;
                              return t.thousandsShort;
                            };
                            const getBgColor = (pos: number) => {
                              if (pos === 0) return 'bg-blue-500';
                              if (pos === 1) return 'bg-red-500';
                              if (pos === 2) return 'bg-orange-500';
                              return 'bg-black';
                            };
                            return (
                              <div key={index} className="flex flex-col items-center gap-1">
                                <Input
                                  className={`w-16 h-16 text-center font-black border border-gray-800 bg-gray-100 rounded-lg ${
                                    rightResultInputs[index] && parseInt(rightResultInputs[index]) % 2 === 0 ? 'text-red-600' : 'text-blue-600'
                                  }`}
                                  style={{ fontSize: '24px' }}
                                  value={rightResultInputs[index] || ''}
                                  onChange={(e) => {
                                    const newInputs = [...rightResultInputs];
                                    newInputs[index] = e.target.value;
                                    setRightResultInputs(newInputs);
                                  }}
                                  onFocus={() => setActiveInputIndex({section: 'right', index})}
                                  maxLength={2}
                                />
                                <div className={`px-2 py-0.5 rounded text-[10px] font-black text-white ${getBgColor(pos)}`}>
                                  {getLabel(pos)}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Bars for tens/units like visual game */}
                      <div className="flex items-start gap-3">
                        {(() => {
                          const u = targetNumber % 10;
                          const z = Math.floor(targetNumber / 10) % 10;
                          return (
                            <>
                              {/* Tens */}
                              <div className="flex flex-col items-center gap-1">
                                <div className="px-2 py-1 text-[10px] font-black text-white bg-red-500 rounded">{t.tensShort}</div>
                                <div className="p-1 rounded-lg border border-red-200 bg-red-50 min-h-[48px] min-w-[40px] flex items-end justify-center">
                                  <Rigleta number={Math.max(0, z)} orientation="vertical" interactive={false} />
                                </div>
                              </div>
                              {/* Units */}
                              <div className="flex flex-col items-center gap-1">
                                 <div className="px-2 py-1 text-[10px] font-black text-white bg-blue-500 rounded">{t.unitsShort}</div>
                                <div className="p-1 rounded-lg border border-blue-200 bg-blue-50 min-h-[48px] min-w-[40px] flex items-end justify-center">
                                  <Rigleta number={u} orientation="vertical" interactive={false} />
                                </div>
                              </div>
                              {/* Operator */}
                              <div className="flex items-center px-2">
                                <div className="w-8 h-8 flex items-center justify-center font-black border-2 border-gray-400 rounded bg-yellow-50 text-gray-700">+</div>
                              </div>
                              {/* Difference */}
                              <div className="flex flex-col items-center gap-1">
                                <div className="px-2 py-1 text-[10px] font-black text-white bg-blue-500 rounded">{t.unitsShort}</div>
                                <div className="p-1 rounded-lg border border-blue-200 bg-blue-50 min-h-[48px] min-w-[40px] flex items-end justify-center">
                                  <Rigleta number={neighborDifference} orientation="vertical" interactive={false} />
                                </div>
                              </div>
                              {/* Equals and placeholders */}
                              <div className="flex items-center px-2">
                                <span className="text-3xl font-black text-gray-700">=</span>
                              </div>
                              <div className="flex items-end gap-2">
                                <div className="w-10 h-24 border-2 border-dashed border-purple-300 rounded-lg" />
                                <div className="w-10 h-24 border-2 border-dashed border-purple-300 rounded-lg" />
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* NumLit Keyboard */}
          {showKeyboard && (
            <NumLitKeyboard
              onKeyPress={(key) => {
                if (key === 'validate') {
                  setShowKeyboard(false);
                  return;
                }
                
                // Handle result input fields if active
                if (activeInputIndex) {
                  const { section, index } = activeInputIndex;
                  
                  if (key === 'backspace') {
                    if (section === 'left') {
                      const newInputs = [...leftResultInputs];
                      newInputs[index] = newInputs[index].slice(0, -1);
                      setLeftResultInputs(newInputs);
                    } else {
                      const newInputs = [...rightResultInputs];
                      newInputs[index] = newInputs[index].slice(0, -1);
                      setRightResultInputs(newInputs);
                    }
                    return;
                  }
                  
                  if (/^\d+$/.test(key)) {
                    if (section === 'left') {
                      const newInputs = [...leftResultInputs];
                      if (newInputs[index].length < 2) {
                        newInputs[index] += key;
                        setLeftResultInputs(newInputs);
                      }
                    } else {
                      const newInputs = [...rightResultInputs];
                      if (newInputs[index].length < 2) {
                        newInputs[index] += key;
                        setRightResultInputs(newInputs);
                      }
                    }
                  }
                  return;
                }
                
                // Default concentration handling
                if (key === 'backspace') {
                  const next = concentrationInput.slice(0, -1);
                  setConcentrationInput(next);
                  setConcentrationCap(next ? Math.max(0, parseInt(next, 10)) : 0);
                  return;
                }
                if (/^\d+$/.test(key)) {
                  const next = `${concentrationInput}${key}`.replace(/^0+(\d)/, "$1");
                  setConcentrationInput(next);
                  setConcentrationCap(next ? Math.max(0, parseInt(next, 10)) : 0);
                }
              }}
              onClose={() => setShowKeyboard(false)}
              maxNumber={concentrationCap || 10}
              includeOperators={false}
              concentration={concentrationMode}
              selectedLanguage={language}
              onConcentrationChange={(newConcentration) => {
                console.log('Concentration changed to:', newConcentration);
                setConcentrationMode(newConcentration);
              }}
              onLanguageChange={(newLanguage) => setLanguage(newLanguage as keyof typeof translations)}
            />
          )}

          {/* SEO JSON-LD */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Game",
                name: t.title,
                description: "Joc educațional pentru identificarea numerelor vecine.",
                inLanguage: language,
                genre: "Educational",
                url: "/vecinii-numerelor",
              }),
            }}
          />
        </div>
      </div>
    </SidebarProvider>
  );
}
