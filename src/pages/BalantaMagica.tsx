import React, { useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Home, Volume2, Info, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import NumberSelector from "@/components/educational/NumberSelector";
import VerticalSelector from "@/components/educational/VerticalSelector";
import GameControls from "@/components/educational/GameControls";
import LifeSystem from "@/components/educational/LifeSystem";
import ProgressBar from "@/components/educational/ProgressBar";
import Timer from "@/components/educational/Timer";
import NumLitKeyboard from "@/components/educational/NumLitKeyboard";
import RigletaNumLit from "@/components/educational/RigletaNumLit";
import ZoomControls from "@/components/educational/ZoomControls";
import BalantaInteractiva from "@/components/educational/BalantaInteractiva";
import NumLitScale from "@/components/educational/NumLitScale";
import { cn } from "@/lib/utils";

interface BalanceScale {
  leftValue: number | null;
  rightValue: number | null;
  targetValue?: number | null;
}

type GameLevel = 1 | 2 | 3 | 4;
type GameVariant = 'riglete' | 'numere' | 'ecuatii';
type ComparisonOperator = '<' | '=' | '>';

// Number of letters in each language alphabet
const languageLetters = {
  ro: 31, // A-Z + Ă, Â, Î, Ș, Ț
  en: 26, // A-Z
  fr: 32, // A-Z + accented letters
  cz: 42, // Czech alphabet with diacritics
  de: 30, // A-Z + Ä, Ö, Ü, ß
  es: 27, // A-Z + Ñ
  it: 26, // A-Z
  hu: 44, // Hungarian alphabet with many diacritics
  pl: 32, // Polish alphabet with diacritics
  bg: 30, // Bulgarian Cyrillic alphabet
  ru: 33, // Russian Cyrillic alphabet
  ar: 28, // Arabic alphabet
  el: 24, // Greek alphabet
  tr: 29  // Turkish alphabet
} as const;

const BalantaMagica = () => {
  const navigate = useNavigate();
  
  // State management
  const [currentLevel, setCurrentLevel] = useState<GameLevel>(1);
  const [gameVariant, setGameVariant] = useState<GameVariant>('riglete');
  const [selectedLanguage, setSelectedLanguage] = useState('ro');
  const [digits, setDigits] = useState(1);
  const [concentration, setConcentration] = useState(10);
  const [balance, setBalance] = useState<BalanceScale>({ leftValue: null, rightValue: null });
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(300);
  const [zoom, setZoom] = useState(80);
  const [progress, setProgress] = useState(0);
  
  // For Level 3 keyboard input - simpler approach
  const [keyboardInputForBalanta, setKeyboardInputForBalanta] = useState<string>('');

  // Translations
  const translations = {
    ro: {
      title: "Balanța Magică",
      back: "Înapoi", 
      language: "Limbă",
      level: "Nivel",
      variant: "Variantă",
      digits: "Numărul de cifre",
      concentration: "Concentru",
      riglete: "Riglete",
      numere: "Numere",
      ecuatii: "Ecuații",
      validate: "Validează",
      reset: "Resetează",
      smaller: "Mai mic",
      equal: "Egal", 
      bigger: "Mai mare",
      tryAgain: "Mai încearcă!",
      correct: "Correct!",
      dragRigleta: "Trage rigleta aici",
      writeNumber: "Scrie numărul",
      showKeyboard: "Arată Tastatura",
      hideKeyboard: "Ascunde Tastatura",
      instructions: "Instrucțiuni",
      balanceTitle: "Balanța Magică",
      rigletaTitle: "Rigletele NumLit",
      rigletaDescription: "Fiecare culoare reprezintă o valoare: Albastru (unități), Roșu (zeci), Portocaliu (sute), Negru (mii)",
      howToPlay: "Cum să joci",
      howToPlayDescription: "Echilibrează balanța folosind rigletele NumLit sau numerele pentru a învăța compararea valorilor!",
      drop: "Pune",
      delete: "🗑️ Șterge",
      units: "U",
      tens: "Z", 
      hundreds: "S",
      thousands: "M",
      tenThousands: "ZM",
      hundredThousands: "SM",
      chooseAndDragCorrect: "Alege și trage diferența corectă:",
      dragCorrectOption: "Trage opțiunea corectă pe brațul balanței",
      dropZoneFor: "Zone de drop pentru diferență",
      difference: "Diferența",
      youChose: "Ai ales:",
      concentrationLevels: {
        "0-10": "0-10",
        "0-letters": "0-31 (litere)",
        "0-100": "0-100", 
        ">": "Superior (0-9)"
      },
      level1Name: "Numere Vizuale",
      level2Name: "Compara Numerele",
      level3Name: "Calculeaza Diferenta",
      level4Name: "In Curand"
    },
    en: {
      title: "Magic Balance",
      back: "Back",
      language: "Language",
      level: "Level",
      variant: "Variant", 
      digits: "Digits",
      concentration: "Range",
      riglete: "Rods",
      numere: "Numbers",
      ecuatii: "Equations",
      validate: "Validate",
      reset: "Reset",
      smaller: "Smaller",
      equal: "Equal",
      bigger: "Bigger", 
      tryAgain: "Try again!",
      correct: "Correct!",
      dragRigleta: "Drag rod here",
      writeNumber: "Write number",
      showKeyboard: "Show Keyboard",
      hideKeyboard: "Hide Keyboard",
      instructions: "Instructions",
      balanceTitle: "Magic Balance",
      rigletaTitle: "NumLit Rods",
      rigletaDescription: "Each color represents a value: Blue (units), Red (tens), Orange (hundreds), Black (thousands)",
      howToPlay: "How to play",
      howToPlayDescription: "Balance the scale using NumLit rods or numbers to learn value comparison!",
      drop: "Drop",
      delete: "🗑️ Delete",
      units: "U",
      tens: "T",
      hundreds: "H", 
      thousands: "Th",
      tenThousands: "TTh",
      hundredThousands: "HTh",
      chooseAndDragCorrect: "Choose and drag the correct difference:",
      dragCorrectOption: "Drag the correct option to the balance arm",
      dropZoneFor: "Drop zone for difference",
      difference: "Difference",
      youChose: "You chose:",
      concentrationLevels: {
        "0-10": "0-10",
        "0-letters": "0-26 (letters)",
        "0-100": "0-100", 
        ">": "Superior (0-9)"
      },
      level1Name: "Visual Numbers",
      level2Name: "Compare Numbers",
      level3Name: "Calculate Difference",
      level4Name: "Coming Soon"
    },
    fr: {
      title: "Balance Magique",
      back: "Retour",
      language: "Langue",
      level: "Niveau",
      variant: "Variante",
      digits: "Chiffres", 
      concentration: "Gamme",
      riglete: "Réglettes",
      numere: "Nombres",
      ecuatii: "Équations",
      validate: "Valider",
      reset: "Réinitialiser",
      smaller: "Plus petit",
      equal: "Égal",
      bigger: "Plus grand",
      tryAgain: "Réessayez!",
      correct: "Correct!",
      dragRigleta: "Glissez la réglette ici",
      writeNumber: "Écrivez le nombre",
      showKeyboard: "Afficher le clavier",
      hideKeyboard: "Masquer le clavier",
      instructions: "Instructions",
      balanceTitle: "Balance Magique",
      rigletaTitle: "Baguettes NumLit",
      rigletaDescription: "Chaque couleur représente une valeur: Bleu (unités), Rouge (dizaines), Orange (centaines), Noir (milliers)",
      howToPlay: "Comment jouer",
      howToPlayDescription: "Équilibrez la balance en utilisant les baguettes NumLit ou les nombres pour apprendre la comparaison des valeurs!",
      drop: "Déposer",
      delete: "🗑️ Supprimer",
      units: "U",
      tens: "D",
      hundreds: "C",
      thousands: "M", 
      tenThousands: "DM",
      hundredThousands: "CM",
      chooseAndDragCorrect: "Choisissez et faites glisser la bonne différence:",
      dragCorrectOption: "Faites glisser la bonne option sur le bras de la balance",
      dropZoneFor: "Zone de dépôt pour la différence",
      difference: "Différence",
      youChose: "Vous avez choisi:",
      concentrationLevels: {
        "0-10": "0-10",
        "0-letters": "0-32 (lettres)",
        "0-100": "0-100", 
        ">": "Supérieur (0-9)"
      },
      level1Name: "Nombres Visuels",
      level2Name: "Comparer les Nombres",
      level3Name: "Calculer la Différence",
      level4Name: "Bientôt"
    },
    cz: {
      title: "Magická Váha",
      back: "Zpět",
      language: "Jazyk",
      level: "Úroveň",
      variant: "Varianta",
      digits: "Počet číslic",
      concentration: "Rozsah",
      riglete: "Tyčky",
      numere: "Čísla",
      ecuatii: "Rovnice",
      validate: "Ověřit",
      reset: "Resetovat",
      smaller: "Menší",
      equal: "Rovno",
      bigger: "Větší",
      tryAgain: "Zkuste znovu!",
      correct: "Správně!",
      dragRigleta: "Přetáhněte tyčku sem",
      writeNumber: "Napište číslo",
      showKeyboard: "Zobrazit klávesnici",
      hideKeyboard: "Skrýt klávesnici",
      instructions: "Instrukce",
      balanceTitle: "Magická Váha",
      rigletaTitle: "NumLit Tyčky",
      rigletaDescription: "Každá barva představuje hodnotu: Modrá (jednotky), Červená (desítky), Oranžová (stovky), Černá (tisíce)",
      howToPlay: "Jak hrát",
      howToPlayDescription: "Vyvažte váhu pomocí tyček NumLit nebo čísel pro naučení porovnávání hodnot!",
      drop: "Pustit",
      delete: "🗑️ Smazat",
      units: "J",
      tens: "D",
      hundreds: "S",
      thousands: "T",
      tenThousands: "DT", 
      hundredThousands: "ST",
      chooseAndDragCorrect: "Vyberte a přetáhněte správný rozdíl:",
      dragCorrectOption: "Přetáhněte správnou možnost na rameno váhy",
      dropZoneFor: "Zóna pro přetažení rozdílu",
      difference: "Rozdíl",
      youChose: "Vybrali jste:",
      concentrationLevels: {
        "0-10": "0-10",
        "0-letters": "0-42 (písmena)",
        "0-100": "0-100", 
        ">": "Pokročilé (0-9)"
      },
      level1Name: "Vizuální Čísla",
      level2Name: "Porovnat Čísla",
      level3Name: "Vypočítat Rozdíl",
      level4Name: "Již Brzy"
    },
    de: {
      title: "Magische Waage",
      back: "Zurück",
      language: "Sprache",
      level: "Stufe",
      variant: "Variante",
      digits: "Anzahl der Ziffern",
      concentration: "Bereich",
      riglete: "Stäbe",
      numere: "Zahlen",
      ecuatii: "Gleichungen",
      validate: "Validieren",
      reset: "Zurücksetzen",
      smaller: "Kleiner",
      equal: "Gleich",
      bigger: "Größer",
      tryAgain: "Versuchen Sie es nochmal!",
      correct: "Richtig!",
      dragRigleta: "Stab hierher ziehen",
      writeNumber: "Zahl schreiben",
      showKeyboard: "Tastatur anzeigen",
      hideKeyboard: "Tastatur ausblenden",
      instructions: "Anweisungen",
      balanceTitle: "Magische Waage",
      rigletaTitle: "NumLit Stäbe",
      rigletaDescription: "Jede Farbe repräsentiert einen Wert: Blau (Einer), Rot (Zehner), Orange (Hunderter), Schwarz (Tausender)",
      howToPlay: "Wie man spielt",
      howToPlayDescription: "Balancieren Sie die Waage mit NumLit-Stäben oder Zahlen, um Wertvergleiche zu lernen!",
      drop: "Ablegen",
      delete: "🗑️ Löschen",
      units: "E",
      tens: "Z",
      hundreds: "H",
      thousands: "T", 
      tenThousands: "ZT",
      hundredThousands: "HT",
      chooseAndDragCorrect: "Wählen Sie und ziehen Sie die richtige Differenz:",
      dragCorrectOption: "Ziehen Sie die richtige Option auf den Waagebalken",
      dropZoneFor: "Ablagebereich für die Differenz",
      difference: "Differenz",
      youChose: "Sie haben gewählt:",
      concentrationLevels: {
        "0-10": "0-10",
        "0-letters": "0-30 (Buchstaben)",
        "0-100": "0-100", 
        ">": "Fortgeschritten (0-9)"
      },
      level1Name: "Visuelle Zahlen",
      level2Name: "Zahlen Vergleichen",
      level3Name: "Differenz Berechnen",
      level4Name: "Demnächst"
    },
    es: {
      title: "Balanza Mágica",
      back: "Atrás",
      language: "Idioma",
      level: "Nivel",
      variant: "Variante",
      digits: "Número de dígitos",
      concentration: "Rango",
      riglete: "Varillas",
      numere: "Números",
      ecuatii: "Ecuaciones",
      validate: "Validar",
      reset: "Reiniciar",
      smaller: "Menor",
      equal: "Igual",
      bigger: "Mayor",
      tryAgain: "¡Inténtalo de nuevo!",
      correct: "¡Correcto!",
      dragRigleta: "Arrastra la varilla aquí",
      writeNumber: "Escribe el número",
      showKeyboard: "Mostrar teclado",
      hideKeyboard: "Ocultar teclado",
      instructions: "Instrucciones",
      balanceTitle: "Balanza Mágica",
      rigletaTitle: "Varillas NumLit",
      rigletaDescription: "Cada color representa un valor: Azul (unidades), Rojo (decenas), Naranja (centenas), Negro (millares)",
      howToPlay: "Cómo jugar",
      howToPlayDescription: "¡Equilibra la balanza usando varillas NumLit o números para aprender comparación de valores!",
      concentrationLevels: {
        "0-10": "0-10",
        "0-letters": "0-27 (letras)",
        "0-100": "0-100", 
        ">": "Superior (0-9)"
      },
      level1Name: "Números Visuales",
      level2Name: "Comparar Números",
      level3Name: "Calcular Diferencia",
      level4Name: "Próximamente"
    },
    it: {
      title: "Bilancia Magica",
      back: "Indietro",
      language: "Lingua",
      level: "Livello",
      variant: "Variante",
      digits: "Numero di cifre",
      concentration: "Intervallo",
      riglete: "Bastoncini",
      numere: "Numeri",
      ecuatii: "Equazioni",
      validate: "Convalida",
      reset: "Ripristina",
      smaller: "Minore",
      equal: "Uguale",
      bigger: "Maggiore",
      tryAgain: "Riprova!",
      correct: "Corretto!",
      dragRigleta: "Trascina il bastoncino qui",
      writeNumber: "Scrivi il numero",
      showKeyboard: "Mostra tastiera",
      hideKeyboard: "Nascondi tastiera",
      instructions: "Istruzioni",
      balanceTitle: "Bilancia Magica",
      rigletaTitle: "Bastoncini NumLit",
      rigletaDescription: "Ogni colore rappresenta un valore: Blu (unità), Rosso (decine), Arancione (centinaia), Nero (migliaia)",
      howToPlay: "Come giocare",
      howToPlayDescription: "Bilancia la scala usando bastoncini NumLit o numeri per imparare il confronto dei valori!",
      concentrationLevels: {
        "0-10": "0-10",
        "0-letters": "0-26 (lettere)",
        "0-100": "0-100", 
        ">": "Superiore (0-9)"
      },
      level1Name: "Numeri Visivi",
      level2Name: "Confronta Numeri",
      level3Name: "Calcola Differenza",
      level4Name: "Prossimamente"
    },
    hu: {
      title: "Varázslatos Mérleg",
      back: "Vissza",
      language: "Nyelv",
      level: "Szint",
      variant: "Változat",
      digits: "Számjegyek száma",
      concentration: "Tartomány",
      riglete: "Rudak",
      numere: "Számok",
      ecuatii: "Egyenletek",
      validate: "Ellenőrzés",
      reset: "Újraindítás",
      smaller: "Kisebb",
      equal: "Egyenlő",
      bigger: "Nagyobb",
      tryAgain: "Próbáld újra!",
      correct: "Helyes!",
      dragRigleta: "Húzd ide a rudat",
      writeNumber: "Írd be a számot",
      showKeyboard: "Billentyűzet megjelenítése",
      hideKeyboard: "Billentyűzet elrejtése",
      instructions: "Utasítások",
      balanceTitle: "Varázslatos Mérleg",
      rigletaTitle: "NumLit Rudak",
      rigletaDescription: "Minden szín egy értéket képvisel: Kék (egységek), Piros (tízesek), Narancssárga (százasok), Fekete (ezresek)",
      howToPlay: "Hogyan játssz",
      howToPlayDescription: "Egyensúlyozd ki a mérleget NumLit rudakkal vagy számokkal az értékösszehasonlítás tanulásához!",
      concentrationLevels: {
        "0-10": "0-10",
        "0-letters": "0-44 (betűk)",
        "0-100": "0-100", 
        ">": "Fejlett (0-9)"
      },
      level1Name: "Vizuális Számok",
      level2Name: "Számok Összehasonlítása",
      level3Name: "Különbség Kiszámítása",
      level4Name: "Hamarosan"
    },
    pl: {
      title: "Magiczna Waga",
      back: "Wstecz",
      language: "Język",
      level: "Poziom",
      variant: "Wariant",
      digits: "Liczba cyfr",
      concentration: "Zakres",
      riglete: "Pręty",
      numere: "Liczby",
      ecuatii: "Równania",
      validate: "Sprawdź",
      reset: "Resetuj",
      smaller: "Mniejszy",
      equal: "Równy",
      bigger: "Większy",
      tryAgain: "Spróbuj ponownie!",
      correct: "Prawidłowo!",
      dragRigleta: "Przeciągnij pręt tutaj",
      writeNumber: "Napisz liczbę",
      showKeyboard: "Pokaż klawiaturę",
      hideKeyboard: "Ukryj klawiaturę",
      instructions: "Instrukcje",
      balanceTitle: "Magiczna Waga",
      rigletaTitle: "Pręty NumLit",
      rigletaDescription: "Każdy kolor reprezentuje wartość: Niebieski (jednostki), Czerwony (dziesiątki), Pomarańczowy (setki), Czarny (tysiące)",
      howToPlay: "Jak grać",
      howToPlayDescription: "Zrównoważ wagę używając prętów NumLit lub liczb, aby nauczyć się porównywania wartości!",
      concentrationLevels: {
        "0-10": "0-10",
        "0-letters": "0-32 (litery)",
        "0-100": "0-100", 
        ">": "Zaawansowany (0-9)"
      },
      level1Name: "Liczby Wizualne",
      level2Name: "Porównaj Liczby",
      level3Name: "Oblicz Różnicę",
      level4Name: "Wkrótce"
    },
    bg: {
      title: "Магическа Везна",
      back: "Назад",
      language: "Език",
      level: "Ниво",
      variant: "Вариант",
      digits: "Брой цифри",
      concentration: "Обхват",
      riglete: "Пръчки",
      numere: "Числа",
      ecuatii: "Уравнения",
      validate: "Потвърди",
      reset: "Нулиране",
      smaller: "По-малко",
      equal: "Равно",
      bigger: "По-голямо",
      tryAgain: "Опитай пак!",
      correct: "Правилно!",
      dragRigleta: "Плъзни пръчката тук",
      writeNumber: "Напиши числото",
      showKeyboard: "Покажи клавиатура",
      hideKeyboard: "Скрий клавиатура",
      instructions: "Инструкции",
      balanceTitle: "Магическа Везна",
      rigletaTitle: "NumLit Пръчки",
      rigletaDescription: "Всеки цвят представлява стойност: Син (единици), Червен (десетки), Оранжев (стотици), Черен (хиляди)",
      howToPlay: "Как да играем",
      howToPlayDescription: "Балансирай везната използвайки NumLit пръчки или числа за да се научиш на сравняване на стойности!",
      concentrationLevels: {
        "0-10": "0-10",
        "0-letters": "0-30 (букви)",
        "0-100": "0-100", 
        ">": "Напреднали (0-9)"
      },
      level1Name: "Визуални Числа",
      level2Name: "Сравни Числата",
      level3Name: "Изчисли Разликата",
      level4Name: "Скоро"
    },
    ru: {
      title: "Волшебные Весы",
      back: "Назад",
      language: "Язык",
      level: "Уровень",
      variant: "Вариант",
      digits: "Количество цифр",
      concentration: "Диапазон",
      riglete: "Палочки",
      numere: "Числа",
      ecuatii: "Уравнения",
      validate: "Проверить",
      reset: "Сброс",
      smaller: "Меньше",
      equal: "Равно",
      bigger: "Больше",
      tryAgain: "Попробуй снова!",
      correct: "Правильно!",
      dragRigleta: "Перетащи палочку сюда",
      writeNumber: "Напиши число",
      showKeyboard: "Показать клавиатуру",
      hideKeyboard: "Скрыть клавиатуру",
      instructions: "Инструкции",
      balanceTitle: "Волшебные Весы",
      rigletaTitle: "Палочки NumLit",
      rigletaDescription: "Каждый цвет представляет значение: Синий (единицы), Красный (десятки), Оранжевый (сотни), Черный (тысячи)",
      howToPlay: "Как играть",
      howToPlayDescription: "Балансируй весы используя палочки NumLit или числа для изучения сравнения значений!",
      concentrationLevels: {
        "0-10": "0-10",
        "0-letters": "0-33 (буквы)",
        "0-100": "0-100", 
        ">": "Продвинутый (0-9)"
      },
      level1Name: "Визуальные Числа",
      level2Name: "Сравнить Числа",
      level3Name: "Вычислить Разницу",
      level4Name: "Скоро"
    },
    ar: {
      title: "الميزان السحري",
      back: "رجوع",
      language: "اللغة",
      level: "المستوى",
      variant: "النوع",
      digits: "عدد الأرقام",
      concentration: "النطاق",
      riglete: "العصي",
      numere: "الأرقام",
      ecuatii: "المعادلات",
      validate: "تحقق",
      reset: "إعادة تعيين",
      smaller: "أصغر",
      equal: "يساوي",
      bigger: "أكبر",
      tryAgain: "حاول مرة أخرى!",
      correct: "صحيح!",
      dragRigleta: "اسحب العصا هنا",
      writeNumber: "اكتب الرقم",
      showKeyboard: "إظهار لوحة المفاتيح",
      hideKeyboard: "إخفاء لوحة المفاتيح",
      instructions: "التعليمات",
      balanceTitle: "الميزان السحري",
      rigletaTitle: "عصي NumLit",
      rigletaDescription: "كل لون يمثل قيمة: أزرق (آحاد)، أحمر (عشرات)، برتقالي (مئات)، أسود (آلاف)",
      howToPlay: "كيفية اللعب",
      howToPlayDescription: "وازن الميزان باستخدام عصي NumLit أو الأرقام لتعلم مقارنة القيم!",
      concentrationLevels: {
        "0-10": "0-10",
        "0-letters": "0-28 (حروف)",
        "0-100": "0-100", 
        ">": "متقدم (0-9)"
      },
      level1Name: "أرقام بصرية",
      level2Name: "قارن الأرقام",
      level3Name: "احسب الفرق",
      level4Name: "قريباً"
    },
    el: {
      title: "Μαγική Ζυγαριά",
      back: "Πίσω",
      language: "Γλώσσα",
      level: "Επίπεδο",
      variant: "Παραλλαγή",
      digits: "Αριθμός ψηφίων",
      concentration: "Εύρος",
      riglete: "Ράβδοι",
      numere: "Αριθμοί",
      ecuatii: "Εξισώσεις",
      validate: "Επικύρωση",
      reset: "Επαναφορά",
      smaller: "Μικρότερο",
      equal: "Ίσο",
      bigger: "Μεγαλύτερο",
      tryAgain: "Δοκίμασε ξανά!",
      correct: "Σωστό!",
      dragRigleta: "Σύρε τη ράβδο εδώ",
      writeNumber: "Γράψε τον αριθμό",
      showKeyboard: "Εμφάνιση πληκτρολογίου",
      hideKeyboard: "Απόκρυψη πληκτρολογίου",
      instructions: "Οδηγίες",
      balanceTitle: "Μαγική Ζυγαριά",
      rigletaTitle: "Ράβδοι NumLit",
      rigletaDescription: "Κάθε χρώμα αντιπροσωπεύει μια αξία: Μπλε (μονάδες), Κόκκινο (δεκάδες), Πορτοκαλί (εκατοντάδες), Μαύρο (χιλιάδες)",
      howToPlay: "Πώς να παίξεις",
      howToPlayDescription: "Ισορρόπησε τη ζυγαριά χρησιμοποιώντας ράβδους NumLit ή αριθμούς για να μάθεις σύγκριση αξιών!",
      concentrationLevels: {
        "0-10": "0-10",
        "0-letters": "0-24 (γράμματα)",
        "0-100": "0-100", 
        ">": "Προχωρημένο (0-9)"
      },
      level1Name: "Οπτικοί Αριθμοί",
      level2Name: "Σύγκριση Αριθμών",
      level3Name: "Υπολογισμός Διαφοράς",
      level4Name: "Σύντομα"
    },
    tr: {
      title: "Sihirli Terazi",
      back: "Geri",
      language: "Dil",
      level: "Seviye",
      variant: "Varyant",
      digits: "Basamak sayısı",
      concentration: "Aralık",
      riglete: "Çubuklar",
      numere: "Sayılar",
      ecuatii: "Denklemler",
      validate: "Doğrula",
      reset: "Sıfırla",
      smaller: "Küçük",
      equal: "Eşit",
      bigger: "Büyük",
      tryAgain: "Tekrar deneyin!",
      correct: "Doğru!",
      dragRigleta: "Çubuğu buraya sürükleyin",
      writeNumber: "Sayıyı yazın",
      showKeyboard: "Klavyeyi Göster",
      hideKeyboard: "Klavyeyi Gizle",
      instructions: "Talimatlar",
      balanceTitle: "Sihirli Terazi",
      rigletaTitle: "NumLit Çubukları",
      rigletaDescription: "Her renk bir değeri temsil eder: Mavi (birler), Kırmızı (onlar), Turuncu (yüzler), Siyah (binler)",
      howToPlay: "Nasıl oynanır",
      howToPlayDescription: "Değer karşılaştırmasını öğrenmek için NumLit çubukları veya sayıları kullanarak teraziyi dengeleyin!",
      drop: "Bırak",
      delete: "🗑️ Sil",
      units: "B",
      tens: "O",
      hundreds: "Y",
      thousands: "Bi",
      tenThousands: "OBi",
      hundredThousands: "YBi",
      chooseAndDragCorrect: "Doğru farkı seçin ve sürükleyin:",
      dragCorrectOption: "Doğru seçeneği terazi koluna sürükleyin",
      dropZoneFor: "Fark için bırakma alanı",
      difference: "Fark",
      youChose: "Seçtiğiniz:",
      concentrationLevels: {
        "0-10": "0-10",
        "0-letters": "0-29 (harfler)",
        "0-100": "0-100", 
        ">": "İleri (0-9)"
      },
      level1Name: "Görsel Sayılar",
      level2Name: "Sayıları Karşılaştır",
      level3Name: "Farkı Hesapla",
      level4Name: "Yakında"
    }
  };
  
  const t = translations[selectedLanguage as keyof typeof translations];

  // Concentration rules based on digits
  const getConcentrationOptions = useCallback((digits: number) => {
    switch (digits) {
      case 1:
        return [{ value: 10, label: t.concentrationLevels["0-10"] }];
      case 2:
        const letters = languageLetters[selectedLanguage as keyof typeof languageLetters] || 26;
        return [
          { value: letters, label: `0-${letters} (${t.concentrationLevels["0-letters"].split(' ')[1] || 'letters'})` },
          { value: 100, label: t.concentrationLevels["0-100"] }
        ];
      case 3:
        return [{ value: 100, label: t.concentrationLevels["0-100"] }];
      case 4:
        return [{ value: 1000, label: "0-1000" }];
      default:
        return [{ value: 10, label: t.concentrationLevels["0-10"] }];
    }
  }, [selectedLanguage, t]);

  // Generate random number based on concentration
  const generateNumber = useCallback(() => {
    return Math.floor(Math.random() * concentration) + 1;
  }, [concentration]);

  // Start new game
  const startNewGame = useCallback(() => {
    const leftVal = generateNumber();
    setBalance({ leftValue: leftVal, rightValue: null });
    setGameStarted(true);
  }, [generateNumber]);

  // Reset game
  const resetGame = useCallback(() => {
    setBalance({ leftValue: null, rightValue: null });
    setGameStarted(false);
    setScore(0);
    setLives(3);
    setTimeLeft(300);
  }, []);

  // Validate answer
  const validateAnswer = useCallback((answer: ComparisonOperator | number) => {
    // Validation logic will be implemented based on level
    console.log('Validating:', answer);
  }, []);

  const handleProgressComplete = () => {
    setProgress(0);
    // Handle completion logic
  };

  // Functions pentru tastatura NumLit (identice cu cele din Sa calculam)
  const getMaxNumberForKeyboard = () => {
    switch (digits) {
      case 1: return 10;
      case 2: return 100; 
      case 3: return 100;
      case 4: return 1000;
      default: return 100;
    }
  };

  const getConcentrationForKeyboard = (): '0-10' | '0-letters' | '0-100' | '>' => {
    if (digits === 1) return '0-10';
    if (digits === 2) {
      const letters = languageLetters[selectedLanguage as keyof typeof languageLetters] || 26;
      return concentration === letters ? '0-letters' : '0-100';
    }
    if (digits === 3) return '0-100';
    return '>'; // Pentru 4 cifre sau superior
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 w-full flex">
        {/* Sidebar */}
        <Sidebar className="w-48">
          <SidebarContent className="bg-white">
            <SidebarGroup>
              <SidebarGroupLabel>
                <Button variant="ghost" onClick={() => navigate('/')} className="w-full justify-start">
                  <Home className="w-4 h-4 mr-2" />
                  {t.back}
                </Button>
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="p-4 space-y-4">
                  {/* Language Selector */}
                  <div className="bg-green-50 border-2 border-green-300 rounded-lg p-1">
                    <div className="bg-white border-2 border-green-400 rounded-lg p-1 mb-1">
                      <div className="text-sm font-bold text-green-600 text-center">
                        {t.language}
                      </div>
                    </div>
                    <Select value={selectedLanguage} onValueChange={(value) => setSelectedLanguage(value)}>
                      <SelectTrigger className="w-full h-6 text-xs border-green-300 focus:border-green-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white z-50">
                        <SelectItem value="ar">🇸🇦 العربية</SelectItem>
                        <SelectItem value="bg">🇧🇬 Български</SelectItem>
                        <SelectItem value="cz">🇨🇿 Čeština</SelectItem>
                        <SelectItem value="de">🇩🇪 Deutsch</SelectItem>
                        <SelectItem value="en">🇬🇧 English</SelectItem>
                        <SelectItem value="el">🇬🇷 Ελληνικά</SelectItem>
                        <SelectItem value="es">🇪🇸 Español</SelectItem>
                        <SelectItem value="fr">🇫🇷 Français</SelectItem>
                        <SelectItem value="it">🇮🇹 Italiano</SelectItem>
                        <SelectItem value="hu">🇭🇺 Magyar</SelectItem>
                        <SelectItem value="pl">🇵🇱 Polski</SelectItem>
                        <SelectItem value="ro">🇷🇴 Română</SelectItem>
                        <SelectItem value="ru">🇷🇺 Русский</SelectItem>
                        <SelectItem value="tr">🇹🇷 Türkçe</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Level Selector */}
                  <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-1">
                    <div className="bg-white border-2 border-purple-400 rounded-lg p-1 mb-1">
                      <div className="text-sm font-bold text-purple-600 text-center">
                        {t.level}
                      </div>
                    </div>
                    <Select value={currentLevel.toString()} onValueChange={(value) => setCurrentLevel(Number(value) as GameLevel)}>
                      <SelectTrigger className="w-full h-6 text-xs border-purple-300 focus:border-purple-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white z-50">
                        <SelectItem value="1">{t.level1Name}</SelectItem>
                        <SelectItem value="2">{t.level2Name}</SelectItem>
                        <SelectItem value="3">{t.level3Name}</SelectItem>
                        <SelectItem value="4">{t.level4Name}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Game Variant */}
                  <div className="bg-pink-50 border-2 border-pink-300 rounded-lg p-1">
                    <div className="bg-white border-2 border-pink-400 rounded-lg p-1 mb-1">
                      <div className="text-sm font-bold text-pink-600 text-center">
                        {t.variant}
                      </div>
                    </div>
                    <Select value={gameVariant} onValueChange={(value) => setGameVariant(value as GameVariant)}>
                      <SelectTrigger className="w-full h-6 text-xs border-pink-300 focus:border-pink-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white z-50">
                        <SelectItem value="riglete">{t.riglete}</SelectItem>
                        <SelectItem value="numere">{t.numere}</SelectItem>
                        <SelectItem value="ecuatii">{t.ecuatii}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Digit Selector */}
                  <div className="bg-gray-50 border-2 border-fuchsia-300 rounded-lg p-1">
                    <div className="bg-white border-2 border-fuchsia-400 rounded-lg p-1 mb-1">
                      <div className="text-sm font-bold text-fuchsia-600 text-center">
                        {t.digits}
                      </div>
                    </div>
                    <div className="p-1">
                      <NumberSelector
                        value={digits}
                        min={1}
                        max={4}
                        onChange={(newDigits) => {
                          setDigits(newDigits);
                          // Auto-adjust concentration based on digits
                          const options = getConcentrationOptions(newDigits);
                          if (options.length === 1) {
                            setConcentration(options[0].value);
                          }
                        }}
                      />
                    </div>
                  </div>

                  {/* Concentration Selector */}
                  <div className="bg-orange-50 border-2 border-orange-300 rounded-lg p-1">
                    <div className="bg-white border-2 border-orange-400 rounded-lg p-1 mb-1">
                      <div className="text-sm font-bold text-orange-600 text-center">
                        {t.concentration}
                      </div>
                    </div>
                    <Select value={concentration.toString()} onValueChange={(value) => setConcentration(Number(value))}>
                      <SelectTrigger className="w-full h-6 text-xs border-orange-300 focus:border-orange-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white z-50">
                        {getConcentrationOptions(digits).map(option => (
                          <SelectItem key={option.value} value={option.value.toString()}>{option.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Keyboard Toggle */}
                  <div>
                    <Button 
                      onClick={() => setShowKeyboard(!showKeyboard)}
                      variant="outline"
                      className="w-full"
                    >
                      {showKeyboard ? t.hideKeyboard : t.showKeyboard}
                    </Button>
                  </div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Compact Header */}
          <div className="h-16 bg-white border-b-2 border-blue-300 px-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <img 
                src="/lovable-uploads/b3fba488-faeb-4081-a5a6-bf161bfa2928.png" 
                alt="NumLit Logo" 
                className="h-8 w-auto object-contain"
                draggable={false}
              />
            </div>

            <div className="text-center flex items-center justify-center gap-3">
              <h1 className="text-2xl font-bold text-primary">{t.title}</h1>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Info className="w-4 h-4" />
                    {t.instructions}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl bg-white z-[60] fixed top-4">
                  <DialogHeader>
                    <DialogTitle className="text-center text-xl">{t.instructions}</DialogTitle>
                    <DialogDescription className="text-center text-muted-foreground">
                      Ghid pentru jocul Balanța Magică
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-bold text-blue-800 mb-3 text-lg">{t.rigletaTitle}</h4>
                      <p className="text-blue-700 text-base leading-relaxed">
                        {t.rigletaDescription}
                      </p>
                    </div>
                    <div className="p-6 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-bold text-green-800 mb-3 text-lg">{t.howToPlay}</h4>
                      <p className="text-green-700 text-base leading-relaxed">
                        {t.howToPlayDescription}
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="px-3 py-1">
                {t.level} {currentLevel}
              </Badge>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Progres {progress}/10</span>
                <ProgressBar current={progress} total={10} onComplete={handleProgressComplete} />
              </div>
              <ZoomControls 
                zoom={zoom} 
                onZoomChange={setZoom} 
                className="ml-2"
              />
              <Timer isRunning={gameStarted} onTimeUpdate={() => {}} />
              <GameControls
                isPlaying={gameStarted}
                onPlay={startNewGame}
                onPause={() => setGameStarted(false)}
                onRepeat={resetGame}
                onShuffle={() => setShowKeyboard(!showKeyboard)}
              />
            </div>
          </div>

          {/* Game Content */}
          <div className="mt-auto" style={{ transform: `scale(${zoom / 100}) translateY(-100px)`, transformOrigin: 'top center' }}>
            {/* Main Game Area */}
            <div className="flex-1 p-8 flex flex-col items-center justify-center">
              {/* Target Value (Level 3) */}
              {currentLevel === 3 && balance.targetValue && (
                <div className="mb-6 text-2xl font-bold text-primary">
                  Țintă: {balance.targetValue}
                </div>
              )}

              {/* Balanță Interactivă */}
              <BalantaInteractiva 
                gameVariant={gameVariant}
                leftValue={balance.leftValue || 0}
                rightValue={balance.rightValue || 0}
                concentration={concentration}
                gameLevel={currentLevel}
                digits={digits}
                onDigitsChange={setDigits}
                onShowKeyboard={() => setShowKeyboard(true)}
                onKeyPress={() => {
                  // Reset the keyboard input to allow same key to be pressed again
                  setTimeout(() => setKeyboardInputForBalanta(''), 100);
                }}
                keyboardInput={keyboardInputForBalanta}
                onBalanceChange={(leftVal, rightVal) => {
                  console.log('Balance changed:', leftVal, rightVal);
                  setBalance({ leftValue: leftVal, rightValue: rightVal });
                }}
                translations={t}
              />

              {/* Level 2 Comparison Buttons */}
              {currentLevel === 2 && gameStarted && (
                <div className="flex justify-center gap-6 mb-8">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    onClick={() => validateAnswer('<')}
                    className="hover-scale px-8 py-4 text-xl font-bold"
                  >
                    &lt; {t.smaller}
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    onClick={() => validateAnswer('=')}
                    className="hover-scale px-8 py-4 text-xl font-bold"
                  >
                    = {t.equal}
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    onClick={() => validateAnswer('>')}
                    className="hover-scale px-8 py-4 text-xl font-bold"
                  >
                    &gt; {t.bigger}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Scara NumLit - permanent afișată în colțul din dreapta jos pentru Nivel 1 */}
        {currentLevel === 1 && (
          <div className="fixed bottom-4 right-4 z-40">
            <NumLitScale
              maxValue={Math.min(concentration, 10)}
              size="medium"
              showLabels={true}
              orientation="horizontal"
              className="bg-white/90 backdrop-blur-sm"
              standalone={true}
              onClose={() => {/* Optional: add logic to hide scale */}}
              interactive={true}
              onValueClick={(value) => {
                console.log('Scale value clicked:', value);
              }}
            />
          </div>
        )}

        {/* NumLit Keyboard - poziționată deasupra Scării NumLit pentru Nivel 1 */}
        {showKeyboard && (
          <div className={cn(
            "fixed z-50",
            currentLevel === 1 
              ? "bottom-80 right-4" // Deasupra Scării NumLit pentru Nivel 1
              : "bottom-4 right-4 flex gap-4" // Poziție normală pentru alte nivele
          )}>
            {/* Pentru nivelurile 3 și 4 NU se afișează Scara NumLit */}
            
            {/* NumLit Keyboard */}
            <NumLitKeyboard
              onKeyPress={(key) => {
                console.log('NumLit Keyboard key pressed:', key, 'Level:', currentLevel);
                // For Level 3, send key to BalantaInteractiva via state
                if (currentLevel === 3) {
                  console.log('Sending key to BalantaInteractiva via state:', key);
                  setKeyboardInputForBalanta(key);
                } else {
                  // Original logic for other levels
                  console.log('Keyboard key pressed:', key);
                  if (key === 'backspace') {
                    console.log('Backspace pressed');
                  } else if (key === 'validate') {
                    console.log('Validate pressed');
                  } else if (!isNaN(Number(key))) {
                    console.log('Number pressed:', key);
                  } else {
                    console.log('Operator pressed:', key);
                  }
                }
              }}
              onClose={() => setShowKeyboard(false)}
              maxNumber={getMaxNumberForKeyboard()}
              includeOperators={true}
              className="shadow-2xl"
              concentration={getConcentrationForKeyboard()}
              selectedLanguage={selectedLanguage}
              onConcentrationChange={(newConcentration) => {
                console.log('Concentration changed to:', newConcentration);
                // Actualizează concentrația conform noii valori
              }}
              onLanguageChange={setSelectedLanguage}
            />
          </div>
        )}
      </div>
    </SidebarProvider>
  );
};

export default BalantaMagica;