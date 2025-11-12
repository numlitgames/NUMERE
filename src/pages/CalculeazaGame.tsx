import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Minus, Home, ZoomIn, ZoomOut, Smartphone, Tablet, Monitor, ChevronDown, Info, Keyboard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import NumberSelector from "@/components/educational/NumberSelector";
import RigletaNumLit from "@/components/educational/RigletaNumLit";
import ProgressBar from "@/components/educational/ProgressBar";
import GameControls from "@/components/educational/GameControls";
import Timer from "@/components/educational/Timer";
import NumLitKeyboard from "@/components/educational/NumLitKeyboard";
import ZoomControls from "@/components/educational/ZoomControls";
import { cn } from "@/lib/utils";

type GameLevel = 'adunari' | 'scaderi' | 'adunari-trecere' | 'scaderi-trecere' | 'interactiv';
type InteractiveLevel = 'adunari-int' | 'scaderi-int' | 'combinat' | 'termen-lipsa';
type ConcentrationLevel = '0-10' | '0-letters' | '0-100' | '>';

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

interface MathOperation {
  term1: number;
  term2: number;
  result: number;
  operation: '+' | '-';
}

// Translations for the math game
const gameTranslations = {
  ro: {
    title: "Să Calculăm",
    back: "Înapoi",
    language: "Limbă",
    level: "Nivel",
    levelNames: {
      adunari: "Adunări",
      scaderi: "Scăderi", 
      adunariTrecere: "Adunări cu trecere",
      scaderiTrecere: "Scăderi cu trecere"
    },
    digitLabel: "Numărul de cifre",
    concentrationLabel: "Concentru",
    concentrationLevels: {
      "0-10": "0-10",
      "0-letters": "0-31 (litere)",
      "0-100": "0-100", 
      ">": "Superior (0-9)"
    },
    addition: "Adunare",
    subtraction: "Scădere",
    checkAnswer: "Verifică Răspunsul",
    proof: "Proba",
    proofAddition: "Proba adunării",
    proofSubtraction: "Proba Scăderii",
    mainOperation: "Operația principală:",
    proofThrough: "Proba prin",
    throughSubtraction: "scădere",
    throughAddition: "adunare",
    instructions: "Instrucțiuni",
    rigletaTitle: "Rigletele NumLit",
    rigletaDescription: "Fiecare culoare reprezintă o valoare: Albastru (unități), Roșu (zeci), Portocaliu (sute), Negru (mii)",
    howToPlay: "Cum să joci",
    howToPlayDescription: "Privește operația, calculează rezultatul și introdu răspunsul în căsuța goală. Verifică cu proba matematică!",
    excellent: "Excelent! 🎉",
    correctAnswer: "Răspunsul este corect!",
    tryAgain: "Mai încearcă! 💪",
    encouragement: "Nu te descuraja, poți să reușești!",
    term1: "Termen 1",
    term2: "Termen 2", 
    sum: "Sumă",
    difference: "Diferență",
    showKeyboard: "Arată Tastatura",
    hideKeyboard: "Ascunde Tastatura",
    // digitSelectorLabel removed - using digitLabel instead
    units: "UNITĂȚI",
    tens: "ZECI",
    hundreds: "SUTE", 
    thousands: "MII",
    unitsClass: "CLASA UNITĂȚILOR",
    thousandsClass: "CLASA MIILOR",
    millionsClass: "CLASA MILIOANELOR",
    unitsShort: "U",
    tensShort: "Z",
    hundredsShort: "S",
    thousandsShort: "M"
  },
  en: {
    title: "Let's Calculate",
    back: "Back",
    language: "Language",
    level: "Level",
    levelNames: {
      adunari: "Addition",
      scaderi: "Subtraction",
      adunariTrecere: "Addition with carry", 
      scaderiTrecere: "Subtraction with borrow"
    },
    digitLabel: "Number of digits",
    concentrationLabel: "Concentration",
    concentrationLevels: {
      "0-10": "0-10",
      "0-letters": "0-26 (letters)",
      "0-100": "0-100", 
      ">": "Superior (0-9)"
    },
    addition: "Addition",
    subtraction: "Subtraction",
    checkAnswer: "Check Answer",
    proof: "Proof",
    proofAddition: "Addition check",
    proofSubtraction: "Subtraction Proof",
    mainOperation: "Main operation:",
    proofThrough: "Proof through",
    throughSubtraction: "subtraction",
    throughAddition: "addition",
    instructions: "Instructions",
    rigletaTitle: "NumLit Rods",
    rigletaDescription: "Each color represents a value: Blue (units), Red (tens), Orange (hundreds), Black (thousands)",
    howToPlay: "How to play",
    howToPlayDescription: "Look at the operation, calculate the result and enter the answer in the empty box. Check with mathematical proof!",
    excellent: "Excellent! 🎉",
    correctAnswer: "The answer is correct!",
    tryAgain: "Try again! 💪",
    encouragement: "Don't give up, you can do it!",
    term1: "Term 1",
    term2: "Term 2",
    sum: "Sum", 
    difference: "Difference",
    showKeyboard: "Show Keyboard",
    hideKeyboard: "Hide Keyboard", 
    // digitSelector removed - using digitLabel instead
    units: "UNITS",
    tens: "TENS",
    hundreds: "HUNDREDS",
    thousands: "THOUSANDS",
    unitsClass: "UNITS CLASS",
    thousandsClass: "THOUSANDS CLASS",
    millionsClass: "MILLIONS CLASS"
  },
  fr: {
    title: "Calculons",
    back: "Retour",
    language: "Langue",
    level: "Niveau",
    levelNames: {
      adunari: "Addition",
      scaderi: "Soustraction", 
      adunariTrecere: "Addition avec retenue",
      scaderiTrecere: "Soustraction avec emprunt"
    },
    digitLabel: "Nombre de chiffres",
    concentrationLabel: "Concentration",
    concentrationLevels: {
      "0-10": "0-10",
      "0-letters": "0-32 (lettres)",
      "0-100": "0-100", 
      ">": "Supérieur (0-9)"
    },
    addition: "Addition",
    subtraction: "Soustraction",
    checkAnswer: "Vérifier la Réponse",
    proof: "Preuve",
    proofAddition: "Vérification de l'addition",
    proofSubtraction: "Preuve de la Soustraction",
    mainOperation: "Opération principale:",
    proofThrough: "Preuve par",
    throughSubtraction: "soustraction",
    throughAddition: "addition",
    instructions: "Instructions",
    rigletaTitle: "Baguettes NumLit",
    rigletaDescription: "Chaque couleur représente une valeur: Bleu (unités), Rouge (dizaines), Orange (centaines), Noir (milliers)",
    howToPlay: "Comment jouer",
    howToPlayDescription: "Regarde l'opération, calcule le résultat et entre la réponse dans la case vide. Vérifie avec la preuve mathématique!",
    excellent: "Excellent! 🎉",
    correctAnswer: "La réponse est correcte!",
    tryAgain: "Essaie encore! 💪",
    encouragement: "Ne te décourage pas, tu peux réussir!",
    term1: "Terme 1",
    term2: "Terme 2",
    sum: "Somme",
    difference: "Différence",
    showKeyboard: "Afficher le clavier",
    hideKeyboard: "Masquer le clavier",
    // digitSelector removed - using digitLabel instead
    units: "UNITÉS",
    tens: "DIZAINES", 
    hundreds: "CENTAINES",
    thousands: "MILLIERS",
    unitsClass: "CLASSE DES UNITÉS",
    thousandsClass: "CLASSE DES MILLIERS",
    millionsClass: "CLASSE DES MILLIONS"
  },
  cz: {
    title: "Počítejme",
    back: "Zpět",
    language: "Jazyk",
    level: "Úroveň",
    levelNames: {
      adunari: "Sčítání",
      scaderi: "Odčítání",
      adunariTrecere: "Sčítání s přenosem",
      scaderiTrecere: "Odčítání s půjčkou"
    },
    digitLabel: "Počet číslic",
    concentrationLabel: "Koncentrace",
    concentrationLevels: {
      "0-10": "0-10",
      "0-letters": "0-42 (písmena)",
      "0-100": "0-100", 
      ">": "Pokročilé (0-9)"
    },
    addition: "Sčítání",
    subtraction: "Odčítání",
    checkAnswer: "Zkontrolovat odpověď",
    proof: "Zkouška",
    proofAddition: "Kontrola sčítání",
    proofSubtraction: "Zkouška odčítání",
    mainOperation: "Hlavní operace:",
    proofThrough: "Zkouška pomocí",
    throughSubtraction: "odčítání",
    throughAddition: "sčítání",
    instructions: "Instrukce",
    rigletaTitle: "NumLit tyčky",
    rigletaDescription: "Každá barva představuje hodnotu: Modrá (jednotky), Červená (desítky), Oranžová (stovky), Černá (tisíce)",
    howToPlay: "Jak hrát",
    howToPlayDescription: "Podívej se na operaci, vypočítej výsledek a zadej odpověď do prázdného pole. Zkontroluj matematickou zkouškou!",
    excellent: "Výborně! 🎉",
    correctAnswer: "Odpověď je správná!",
    tryAgain: "Zkus to znovu! 💪",
    encouragement: "Nevzdávej se, zvládneš to!",
    term1: "Člen 1", 
    term2: "Člen 2",
    sum: "Součet",
    difference: "Rozdíl",
    showKeyboard: "Zobrazit klávesnici",
    hideKeyboard: "Skrýt klávesnici", 
    // digitSelector removed - using digitLabel instead
    units: "JEDNOTKY",
    tens: "DESÍTKY",
    hundreds: "STOVKY",
    thousands: "TISÍCE",
    unitsClass: "TŘÍDA JEDNOTEK",
    thousandsClass: "TŘÍDA TISÍCŮ",
    millionsClass: "TŘÍDA MILIONŮ"
  },
  de: {
    title: "Lass uns rechnen",
    back: "Zurück",
    language: "Sprache",
    level: "Stufe",
    levelNames: {
      adunari: "Addition",
      scaderi: "Subtraktion",
      adunariTrecere: "Addition mit Übertrag",
      scaderiTrecere: "Subtraktion mit Borgen"
    },
    digitLabel: "Anzahl der Ziffern",
    concentrationLabel: "Konzentration",
    concentrationLevels: {
      "0-10": "0-10",
      "0-letters": "0-30 (Buchstaben)",
      "0-100": "0-100", 
      ">": "Fortgeschritten (0-9)"
    },
    addition: "Addition",
    subtraction: "Subtraktion",
    checkAnswer: "Antwort prüfen",
    proof: "Probe",
    proofAddition: "Überprüfung der Addition",
    proofSubtraction: "Subtraktionsprobe",
    mainOperation: "Hauptoperation:",
    proofThrough: "Probe durch",
    throughSubtraction: "Subtraktion",
    throughAddition: "Addition",
    instructions: "Anweisungen",
    rigletaTitle: "NumLit Stäbe",
    rigletaDescription: "Jede Farbe repräsentiert einen Wert: Blau (Einer), Rot (Zehner), Orange (Hunderter), Schwarz (Tausender)",
    howToPlay: "Wie man spielt",
    howToPlayDescription: "Schaue dir die Operation an, berechne das Ergebnis und gib die Antwort in das leere Feld ein. Prüfe mit mathematischer Probe!",
    excellent: "Ausgezeichnet! 🎉",
    correctAnswer: "Die Antwort ist richtig!",
    tryAgain: "Versuche es nochmal! 💪",
    encouragement: "Gib nicht auf, du schaffst das!",
    term1: "Summand 1",
    term2: "Summand 2", 
    sum: "Summe",
    difference: "Differenz",
    showKeyboard: "Tastatur anzeigen",
    hideKeyboard: "Tastatur ausblenden",
    units: "EINER",
    tens: "ZEHNER",
    hundreds: "HUNDERTER", 
    thousands: "TAUSENDER",
    unitsClass: "EINER-KLASSE",
    thousandsClass: "TAUSENDER-KLASSE",
    millionsClass: "MILLIONEN-KLASSE",
    unitsShort: "E",
    tensShort: "Z",
    hundredsShort: "H",
    thousandsShort: "T"
  },
  es: {
    title: "Calculemos",
    back: "Atrás",
    language: "Idioma",
    level: "Nivel",
    levelNames: {
      adunari: "Suma",
      scaderi: "Resta",
      adunariTrecere: "Suma con llevada",
      scaderiTrecere: "Resta con préstamo"
    },
    digitLabel: "Número de dígitos",
    concentrationLabel: "Concentración",
    concentrationLevels: {
      "0-10": "0-10",
      "0-letters": "0-27 (letras)",
      "0-100": "0-100", 
      ">": "Superior (0-9)"
    },
    addition: "Suma",
    subtraction: "Resta",
    checkAnswer: "Verificar respuesta",
    proof: "Prueba",
    proofAddition: "Comprobación de la suma",
    proofSubtraction: "Prueba de resta",
    mainOperation: "Operación principal:",
    proofThrough: "Prueba mediante",
    throughSubtraction: "resta",
    throughAddition: "suma",
    instructions: "Instrucciones",
    rigletaTitle: "Varillas NumLit",
    rigletaDescription: "Cada color representa un valor: Azul (unidades), Rojo (decenas), Naranja (centenas), Negro (millares)",
    howToPlay: "Cómo jugar",
    howToPlayDescription: "Mira la operación, calcula el resultado e introduce la respuesta en la casilla vacía. ¡Verifica con prueba matemática!",
    excellent: "¡Excelente! 🎉",
    correctAnswer: "¡La respuesta es correcta!",
    tryAgain: "¡Inténtalo de nuevo! 💪",
    encouragement: "¡No te rindas, puedes hacerlo!",
    term1: "Término 1",
    term2: "Término 2",
    sum: "Suma",
    difference: "Diferencia",
    showKeyboard: "Mostrar teclado",
    hideKeyboard: "Ocultar teclado",
    units: "UNIDADES",
    tens: "DECENAS",
    hundreds: "CENTENAS",
    thousands: "MILLARES",
    unitsClass: "CLASE DE LAS UNIDADES",
    thousandsClass: "CLASE DE LOS MILLARES",
    millionsClass: "CLASE DE LOS MILLONES"
  },
  it: {
    title: "Calcoliamo",
    back: "Indietro",
    language: "Lingua",
    level: "Livello",
    levelNames: {
      adunari: "Addizione",
      scaderi: "Sottrazione",
      adunariTrecere: "Addizione con riporto",
      scaderiTrecere: "Sottrazione con prestito"
    },
    digitLabel: "Numero di cifre",
    concentrationLabel: "Concentrazione",
    concentrationLevels: {
      "0-10": "0-10",
      "0-letters": "0-26 (lettere)",
      "0-100": "0-100", 
      ">": "Superiore (0-9)"
    },
    addition: "Addizione",
    subtraction: "Sottrazione",
    checkAnswer: "Verifica risposta",
    proof: "Prova",
    proofAddition: "Prova dell'addizione",
    proofSubtraction: "Prova della sottrazione",
    mainOperation: "Operazione principale:",
    proofThrough: "Prova attraverso",
    throughSubtraction: "sottrazione",
    throughAddition: "addizione",
    instructions: "Istruzioni",
    rigletaTitle: "Bastoncini NumLit",
    rigletaDescription: "Ogni colore rappresenta un valore: Blu (unità), Rosso (decine), Arancione (centinaia), Nero (migliaia)",
    howToPlay: "Come giocare",
    howToPlayDescription: "Guarda l'operazione, calcola il risultato e inserisci la risposta nella casella vuota. Verifica con la prova matematica!",
    excellent: "Eccellente! 🎉",
    correctAnswer: "La risposta è corretta!",
    tryAgain: "Riprova! 💪",
    encouragement: "Non arrenderti, ce la puoi fare!",
    term1: "Termine 1",
    term2: "Termine 2",
    sum: "Somma",
    difference: "Differenza",
    showKeyboard: "Mostra tastiera",
    hideKeyboard: "Nascondi tastiera",
    units: "UNITÀ",
    tens: "DECINE",
    hundreds: "CENTINAIA",
    thousands: "MIGLIAIA",
    unitsClass: "CLASSE DELLE UNITÀ",
    thousandsClass: "CLASSE DELLE MIGLIAIA",
    millionsClass: "CLASSE DEI MILIONI"
  },
  hu: {
    title: "Számoljunk",
    back: "Vissza",
    language: "Nyelv",
    level: "Szint",
    levelNames: {
      adunari: "Összeadás",
      scaderi: "Kivonás",
      adunariTrecere: "Összeadás átvitellel",
      scaderiTrecere: "Kivonás kölcsönzéssel"
    },
    digitLabel: "Számjegyek száma",
    concentrationLabel: "Koncentráció",
    concentrationLevels: {
      "0-10": "0-10",
      "0-letters": "0-44 (betűk)",
      "0-100": "0-100", 
      ">": "Fejlett (0-9)"
    },
    addition: "Összeadás",
    subtraction: "Kivonás",
    checkAnswer: "Válasz ellenőrzése",
    proof: "Próba",
    proofAddition: "Összeadás ellenőrzése",
    proofSubtraction: "Kivonás próbája",
    mainOperation: "Fő művelet:",
    proofThrough: "Próba keresztül",
    throughSubtraction: "kivonás",
    throughAddition: "összeadás",
    instructions: "Utasítások",
    rigletaTitle: "NumLit rudak",
    rigletaDescription: "Minden szín egy értéket képvisel: Kék (egységek), Piros (tízesek), Narancssárga (százasok), Fekete (ezresek)",
    howToPlay: "Hogyan játssz",
    howToPlayDescription: "Nézd meg a műveletet, számold ki az eredményt és írd be a választ az üres mezőbe. Ellenőrizd matematikai próbával!",
    excellent: "Kiváló! 🎉",
    correctAnswer: "A válasz helyes!",
    tryAgain: "Próbáld újra! 💪",
    encouragement: "Ne add fel, meg tudod csinálni!",
    term1: "Tag 1",
    term2: "Tag 2",
    sum: "Összeg",
    difference: "Különbség",
    showKeyboard: "Billentyűzet megjelenítése",
    hideKeyboard: "Billentyűzet elrejtése",
    units: "EGYSÉGEK",
    tens: "TÍZESEK",
    hundreds: "SZÁZASOK",
    thousands: "EZRESEK",
    unitsClass: "EGYSÉGEK OSZTÁLYA",
    thousandsClass: "EZRESEK OSZTÁLYA",
    millionsClass: "MILLIÓK OSZTÁLYA"
  },
  pl: {
    title: "Liczmy",
    back: "Wstecz",
    language: "Język",
    level: "Poziom",
    levelNames: {
      adunari: "Dodawanie",
      scaderi: "Odejmowanie",
      adunariTrecere: "Dodawanie z przeniesieniem",
      scaderiTrecere: "Odejmowanie z pożyczką"
    },
    digitLabel: "Liczba cyfr",
    concentrationLabel: "Koncentracja",
    concentrationLevels: {
      "0-10": "0-10",
      "0-letters": "0-32 (litery)",
      "0-100": "0-100", 
      ">": "Zaawansowane (0-9)"
    },
    addition: "Dodawanie",
    subtraction: "Odejmowanie",
    checkAnswer: "Sprawdź odpowiedź",
    proof: "Sprawdzenie",
    proofAddition: "Sprawdzenie dodawania",
    proofSubtraction: "Sprawdzenie odejmowania",
    mainOperation: "Główna operacja:",
    proofThrough: "Sprawdzenie przez",
    throughSubtraction: "odejmowanie",
    throughAddition: "dodawanie",
    instructions: "Instrukcje",
    rigletaTitle: "Pałeczki NumLit",
    rigletaDescription: "Każdy kolor reprezentuje wartość: Niebieski (jednostki), Czerwony (dziesiątki), Pomarańczowy (setki), Czarny (tysiące)",
    howToPlay: "Jak grać",
    howToPlayDescription: "Spójrz na operację, oblicz wynik i wprowadź odpowiedź w puste pole. Sprawdź sprawdzeniem matematycznym!",
    excellent: "Wspaniale! 🎉",
    correctAnswer: "Odpowiedź jest prawidłowa!",
    tryAgain: "Spróbuj ponownie! 💪",
    encouragement: "Nie poddawaj się, dasz radę!",
    term1: "Składnik 1", 
    term2: "Składnik 2",
    sum: "Suma",
    difference: "Różnica",
    showKeyboard: "Pokaż klawiaturę",
    hideKeyboard: "Ukryj klawiaturę",
    units: "JEDNOSTKI",
    tens: "DZIESIĄTKI",
    hundreds: "SETKI",
    thousands: "TYSIĄCE",
    unitsClass: "KLASA JEDNOSTEK",
    thousandsClass: "KLASA TYSIĘCY",
    millionsClass: "KLASA MILIONÓW"
  },
  bg: {
    title: "Да пресмятаме",
    back: "Назад",
    language: "Език",
    level: "Ниво",
    levelNames: {
      adunari: "Събиране",
      scaderi: "Изваждане",
      adunariTrecere: "Събиране с пренос",
      scaderiTrecere: "Изваждане със заем"
    },
    digitLabel: "Брой цифри",
    concentrationLabel: "Концентрация",
    concentrationLevels: {
      "0-10": "0-10",
      "0-letters": "0-30 (букви)",
      "0-100": "0-100",
      ">": "Напреднало (0-9)"
    },
    addition: "Събиране",
    subtraction: "Изваждане",
    checkAnswer: "Провери отговора",
    proof: "Проверка",
    proofAddition: "Проверка на събирането",
    proofSubtraction: "Проверка на изваждането",
    mainOperation: "Основна операция:",
    proofThrough: "Проверка чрез",
    throughSubtraction: "изваждане",
    throughAddition: "събиране",
    instructions: "Инструкции",
    rigletaTitle: "NumLit пръчки",
    rigletaDescription: "Всеки цвят представлява стойност: Син (единици), Червен (десетки), Оранжев (стотици), Черен (хиляди)",
    howToPlay: "Как да играя",
    howToPlayDescription: "Погледни операцията, изчисли резултата и въведи отговора в празното поле. Провери с математическа проверка!",
    excellent: "Отлично! 🎉",
    correctAnswer: "Отговорът е правилен!",
    tryAgain: "Опитай отново! 💪",
    encouragement: "Не се отказвай, можеш да го направиш!",
    term1: "Член 1",
    term2: "Член 2", 
    sum: "Сума",
    difference: "Разлика",
    showKeyboard: "Покажи клавиатурата",
    hideKeyboard: "Скрий клавиатурата",
    units: "ЕДИНИЦИ",
    tens: "ДЕСЕТКИ",
    hundreds: "СТОТИЦИ",
    thousands: "ХИЛЯДИ",
    unitsClass: "КЛАС ЕДИНИЦИ",
    thousandsClass: "КЛАС ХИЛЯДИ",
    millionsClass: "КЛАС МИЛИОНИ"
  },
  ru: {
    title: "Давайте считать",
    back: "Назад",
    language: "Язык",
    level: "Уровень",
    levelNames: {
      adunari: "Сложение",
      scaderi: "Вычитание",
      adunariTrecere: "Сложение с переносом",
      scaderiTrecere: "Вычитание с заимствованием"
    },
    digitLabel: "Количество цифр",
    concentrationLabel: "Концентрация",
    concentrationLevels: {
      "0-10": "0-10",
      "0-letters": "0-33 (буквы)",
      "0-100": "0-100",
      ">": "Продвинутый (0-9)"
    },
    addition: "Сложение",
    subtraction: "Вычитание",
    checkAnswer: "Проверить ответ",
    proof: "Проверка",
    proofAddition: "Проверка сложения",
    proofSubtraction: "Проверка вычитания",
    mainOperation: "Основная операция:",
    proofThrough: "Проверка через",
    throughSubtraction: "вычитание",
    throughAddition: "сложение",
    instructions: "Инструкции",
    rigletaTitle: "NumLit палочки",
    rigletaDescription: "Каждый цвет представляет значение: Синий (единицы), Красный (десятки), Оранжевый (сотни), Черный (тысячи)",
    howToPlay: "Как играть",
    howToPlayDescription: "Посмотри на операцию, вычисли результат и введи ответ в пустое поле. Проверь математической проверкой!",
    excellent: "Отлично! 🎉",
    correctAnswer: "Ответ правильный!",
    tryAgain: "Попробуй еще раз! 💪",
    encouragement: "Не сдавайся, ты можешь это сделать!",
    term1: "Слагаемое 1",
    term2: "Слагаемое 2",
    sum: "Сумма", 
    difference: "Разность",
    showKeyboard: "Показать клавиатуру",
    hideKeyboard: "Скрыть клавиатуру",
    units: "ЕДИНИЦЫ",
    tens: "ДЕСЯТКИ",
    hundreds: "СОТНИ",
    thousands: "ТЫСЯЧИ",
    unitsClass: "КЛАСС ЕДИНИЦ",
    thousandsClass: "КЛАСС ТЫСЯЧ",
    millionsClass: "КЛАСС МИЛЛИОНОВ"
  },
  ar: {
    title: "دعونا نحسب",
    back: "رجوع",
    language: "اللغة",
    level: "مستوى",
    levelNames: {
      adunari: "جمع",
      scaderi: "طرح",
      adunariTrecere: "جمع مع النقل",
      scaderiTrecere: "طرح مع الاستعارة"
    },
    digitLabel: "عدد الأرقام",
    concentrationLabel: "التركيز",
    concentrationLevels: {
      "0-10": "0-10",
      "0-letters": "0-28 (حروف)",
      "0-100": "0-100",
      ">": "متقدم (0-9)"
    },
    addition: "جمع",
    subtraction: "طرح",
    checkAnswer: "تحقق من الإجابة",
    proof: "برهان",
    proofAddition: "التحقق من الجمع",
    proofSubtraction: "برهان الطرح",
    mainOperation: "العملية الرئيسية:",
    proofThrough: "البرهان من خلال",
    throughSubtraction: "طرح",
    throughAddition: "جمع",
    instructions: "تعليمات",
    rigletaTitle: "عصي NumLit",
    rigletaDescription: "كل لون يمثل قيمة: الأزرق (آحاد)، الأحمر (عشرات)، البرتقالي (مئات)، الأسود (آلاف)",
    howToPlay: "كيف تلعب",
    howToPlayDescription: "انظر إلى العملية، احسب النتيجة وأدخل الإجابة في المربع الفارغ. تحقق بالبرهان الرياضي!",
    excellent: "ممتاز! 🎉",
    correctAnswer: "الإجابة صحيحة!",
    tryAgain: "حاول مرة أخرى! 💪",
    encouragement: "لا تستسلم، يمكنك فعل ذلك!",
    term1: "الحد الأول",
    term2: "الحد الثاني",
    sum: "المجموع",
    difference: "الفرق",
    showKeyboard: "إظهار لوحة المفاتيح",
    hideKeyboard: "إخفاء لوحة المفاتيح",
    units: "الآحاد",
    tens: "العشرات",
    hundreds: "المئات",
    thousands: "الألوف",
    unitsClass: "فئة الآحاد",
    thousandsClass: "فئة الألوف",
    millionsClass: "فئة الملايين"
  },
  pt: {
    title: "Vamos Calcular",
    back: "Voltar",
    language: "Idioma",
    level: "Nível",
    levelNames: {
      adunari: "Adição",
      scaderi: "Subtração",
      adunariTrecere: "Adição com transporte",
      scaderiTrecere: "Subtração com empréstimo"
    },
    digitLabel: "Número de dígitos",
    concentrationLabel: "Concentração",
    concentrationLevels: {
      "0-10": "0-10",
      "0-letters": "0-26 (letras)",
      "0-100": "0-100",
      ">": "Superior (0-9)"
    },
    addition: "Adição",
    subtraction: "Subtração",
    checkAnswer: "Verificar resposta",
    proof: "Prova",
    proofAddition: "Verificação da adição",
    proofSubtraction: "Prova da subtração",
    mainOperation: "Operação principal:",
    proofThrough: "Prova através",
    throughSubtraction: "subtração",
    throughAddition: "adição",
    instructions: "Instruções",
    rigletaTitle: "Bastões NumLit",
    rigletaDescription: "Cada cor representa um valor: Azul (unidades), Vermelho (dezenas), Laranja (centenas), Preto (milhares)",
    howToPlay: "Como jogar",
    howToPlayDescription: "Observe a operação, calcule o resultado e digite a resposta na caixa vazia. Verifique com prova matemática!",
    excellent: "Excelente! 🎉",
    correctAnswer: "A resposta está correta!",
    tryAgain: "Tente novamente! 💪",
    encouragement: "Não desista, você consegue!",
    term1: "Termo 1",
    term2: "Termo 2",
    sum: "Soma", 
    difference: "Diferença",
    showKeyboard: "Mostrar teclado",
    hideKeyboard: "Ocultar teclado",
    units: "UNIDADES",
    tens: "DEZENAS",
    hundreds: "CENTENAS",
    thousands: "MILHARES",
    unitsClass: "CLASSE DAS UNIDADES",
    thousandsClass: "CLASSE DOS MILHARES",
    millionsClass: "CLASSE DOS MILHÕES"
  },
  el: {
    title: "Ας υπολογίσουμε",
    back: "Πίσω",
    language: "Γλώσσα",
    level: "Επίπεδο",
    levelNames: {
      adunari: "Πρόσθεση",
      scaderi: "Αφαίρεση",
      adunariTrecere: "Πρόσθεση με κρατούμενο",
      scaderiTrecere: "Αφαίρεση με δανεισμό"
    },
    digitLabel: "Αριθμός ψηφίων",
    concentrationLabel: "Συγκέντρωση",
    concentrationLevels: {
      "0-10": "0-10",
      "0-letters": "0-24 (γράμματα)",
      "0-100": "0-100",
      ">": "Προχωρημένο (0-9)"
    },
    addition: "Πρόσθεση",
    subtraction: "Αφαίρεση",
    checkAnswer: "Έλεγχος απάντησης",
    proof: "Απόδειξη",
    proofAddition: "Απόδειξη πρόσθεσης",
    proofSubtraction: "Απόδειξη αφαίρεσης",
    mainOperation: "Κύρια πράξη:",
    proofThrough: "Απόδειξη μέσω",
    throughSubtraction: "αφαίρεση",
    throughAddition: "πρόσθεση",
    instructions: "Οδηγίες",
    rigletaTitle: "NumLit ράβδοι",
    rigletaDescription: "Κάθε χρώμα αντιπροσωπεύει μια αξία: Μπλε (μονάδες), Κόκκινο (δεκάδες), Πορτοκαλί (εκατοντάδες), Μαύρο (χιλιάδες)",
    howToPlay: "Πώς να παίξεις",
    howToPlayDescription: "Κοίτα την πράξη, υπολόγισε το αποτέλεσμα και εισήγαγε την απάντηση στο κενό κουτί. Έλεγξε με μαθηματική απόδειξη!",
    excellent: "Εξαιρετικά! 🎉",
    correctAnswer: "Η απάντηση είναι σωστή!",
    tryAgain: "Προσπάθησε ξανά! 💪",
    encouragement: "Μη τα παρατάς, μπορείς να το κάνεις!",
    term1: "Όρος 1",
    term2: "Όρος 2",
    sum: "Άθροισμα",
    difference: "Διαφορά",
    showKeyboard: "Εμφάνιση πληκτρολογίου",
    hideKeyboard: "Απόκρυψη πληκτρολογίου",
    units: "ΜΟΝΆΔΕΣ",
    tens: "ΔΕΚΆΔΕΣ",
    hundreds: "ΕΚΑΤΟΝΤΆΔΕΣ",
    thousands: "ΧΙΛΙΆΔΕΣ",
    unitsClass: "ΤΆΞΗ ΜΟΝΆΔΩΝ",
    thousandsClass: "ΤΆΞΗ ΧΙΛΙΆΔΩΝ",
    millionsClass: "ΤΆΞΗ ΕΚΑΤΟΜΜΥΡΊΩΝ"
  },
  tr: {
    title: "Hadi Hesaplayalım",
    back: "Geri",
    language: "Dil",
    level: "Seviye",
    levelNames: {
      adunari: "Toplama",
      scaderi: "Çıkarma",
      adunariTrecere: "Eldeli toplama",
      scaderiTrecere: "Borçlu çıkarma"
    },
    digitLabel: "Basamak sayısı",
    concentrationLabel: "Konsantrasyon",
    concentrationLevels: {
      "0-10": "0-10",
      "0-letters": "0-29 (harfler)",
      "0-100": "0-100",
      ">": "İleri (0-9)"
    },
    addition: "Toplama",
    subtraction: "Çıkarma",
    checkAnswer: "Cevabı Kontrol Et",
    proof: "Kanıt",
    proofAddition: "Toplama kanıtı",
    proofSubtraction: "Çıkarma Kanıtı",
    mainOperation: "Ana işlem:",
    proofThrough: "Kanıt yoluyla",
    throughSubtraction: "çıkarma",
    throughAddition: "toplama",
    instructions: "Talimatlar",
    rigletaTitle: "NumLit Çubukları",
    rigletaDescription: "Her renk bir değeri temsil eder: Mavi (birler), Kırmızı (onlar), Turuncu (yüzler), Siyah (binler)",
    howToPlay: "Nasıl oynanır",
    howToPlayDescription: "İşleme bak, sonucu hesapla ve cevabı boş kutuya gir. Matematiksel kanıt ile kontrol et!",
    excellent: "Mükemmel! 🎉",
    correctAnswer: "Cevap doğru!",
    tryAgain: "Tekrar dene! 💪",
    encouragement: "Pes etme, başarabilirsin!",
    term1: "Terim 1",
    term2: "Terim 2",
    sum: "Toplam",
    difference: "Fark",
    showKeyboard: "Klavyeyi Göster",
    hideKeyboard: "Klavyeyi Gizle",
    units: "BİRLER",
    tens: "ONLAR",
    hundreds: "YÜZLER",
    thousands: "BİNLER",
    unitsClass: "BİRLER SINIFI",
    thousandsClass: "BİNLER SINIFI",
    millionsClass: "MİLYONLAR SINIFI",
    unitsShort: "B",
    tensShort: "O",
    hundredsShort: "Y",
    thousandsShort: "Bi"
  }
};

export default function CalculeazaGame() {
  const [level, setLevel] = useState<GameLevel>('adunari');
  const [interactiveLevel, setInteractiveLevel] = useState<InteractiveLevel>('adunari-int');
  const [digits, setDigits] = useState(1);
  const [concentration, setConcentration] = useState<ConcentrationLevel>('0-10');
  const [currentOperation, setCurrentOperation] = useState<MathOperation | null>(null);
  const [userDigits, setUserDigits] = useState<string[]>([]); // Sequential digit entry
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<keyof typeof gameTranslations>('ro');
  const [deviceMode, setDeviceMode] = useState<'phone' | 'tablet' | 'desktop'>('desktop');
  const [scale, setScale] = useState([100]);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameTime, setGameTime] = useState(0);
  const [showKeyboard, setShowKeyboard] = useState(true);
  const [zoom, setZoom] = useState(80);
  const [proofSumDigits, setProofSumDigits] = useState<string[]>([]); // Pentru prima probă cu căsuțe secvențiale
  const [proofSubDigits, setProofSubDigits] = useState<string[]>([]); // Pentru a doua probă cu căsuțe secvențiale
  const [activeInput, setActiveInput] = useState<'main' | 'proofSum' | 'proofSub' | null>('main');
  const { toast } = useToast();

  const t = gameTranslations[selectedLanguage];

  // Get max number for keyboard based on concentration level
  const getMaxNumberForKeyboard = () => {
    switch (concentration) {
      case '0-10': return 10;
      case '0-letters': return languageLetters[selectedLanguage];
      case '0-100': return 100;
      case '>': return 9;
      default: return 10;
    }
  };

  // Helper function to get maximum digits from current operation
  const getMaxDigitsFromOperation = () => {
    if (!currentOperation) return 1;
    const maxNumber = Math.max(
      currentOperation.term1,
      currentOperation.term2,
      currentOperation.result
    );
    return maxNumber.toString().length;
  };

  // Check if we need compact layout
  const needsCompactLayout = () => {
    return getMaxDigitsFromOperation() > 4;
  };

  // Helper function to get border color for digit position (right to left)
  const getDigitBorderColor = (position: number, totalDigits: number) => {
    const placeValuePosition = totalDigits - 1 - position; // Convert to place value position (0=units, 1=tens, etc.)
    if (placeValuePosition === 0) return 'border-blue-500'; // UNITĂȚI - albastru
    if (placeValuePosition === 1) return 'border-red-500'; // ZECI - roșu
    if (placeValuePosition === 2) return 'border-orange-500'; // SUTE - portocaliu  
    if (placeValuePosition === 3) return 'border-black'; // MII - negru
    return 'border-gray-300';
  };

  // Handle fixed position digit input for all result boxes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, inputType: 'main' | 'proofSum' | 'proofSub', position: number) => {
    const value = e.target.value;
    
    // Only allow single digits
    if (!/^\d?$/.test(value)) return;
    
    if (inputType === 'main') {
      setUserDigits(prev => {
        const newDigits = [...prev];
        // Ensure array has enough length
        while (newDigits.length <= position) {
          newDigits.push('');
        }
        // Set digit at specific position (0 = units on right, 1 = tens, etc.)
        newDigits[position] = value;
        return newDigits;
      });
    } else if (inputType === 'proofSum') {
      setProofSumDigits(prev => {
        const newDigits = [...prev];
        while (newDigits.length <= position) {
          newDigits.push('');
        }
        newDigits[position] = value;
        return newDigits;
      });
    } else if (inputType === 'proofSub') {
      setProofSubDigits(prev => {
        const newDigits = [...prev];
        while (newDigits.length <= position) {
          newDigits.push('');
        }
        newDigits[position] = value;
        return newDigits;
      });
    }
  };

  const generateOperation = () => {
    const maxNum = Math.pow(10, digits) - 1;
    
    if (level === 'adunari') {
      // Adunări fără trecere peste ordin
      const term1 = Math.floor(Math.random() * maxNum) + 1;
      const term2 = Math.floor(Math.random() * (maxNum - term1)) + 1;
      const result = term1 + term2;
      
      setCurrentOperation({ term1, term2, result, operation: '+' });
    } else if (level === 'scaderi') {
      // Scăderi fără trecere peste ordin
      const result = Math.floor(Math.random() * maxNum) + 1;
      const term2 = Math.floor(Math.random() * result) + 1;
      const term1 = result + term2;
      
      setCurrentOperation({ term1, term2, result, operation: '-' });
    }
    
    setUserDigits([]);
    setProofSumDigits([]);
    setProofSubDigits([]);
    setIsCorrect(null);
  };

  useEffect(() => {
    generateOperation();
  }, [level, digits]);

  const handleSubmit = () => {
    if (!currentOperation) return;
    
    // Verifică dacă toate căsuțele sunt completate
    if (userDigits.length === 0) {
      toast({
        title: "Completează răspunsul principal",
        description: "Ești aproape, completează toate căsuțele!",
        variant: "destructive",
        duration: 3000
      });
      return;
    }

    if (proofSumDigits.length === 0) {
      toast({
        title: "Completează proba adunării",
        description: "Ești aproape, completează toate căsuțele!",
        variant: "destructive", 
        duration: 3000
      });
      return;
    }

    if (proofSubDigits.length === 0) {
      toast({
        title: "Completează proba scăderii",
        description: "Ești aproape, completează toate căsuțele!",
        variant: "destructive",
        duration: 3000
      });
      return;
    }
    
    // Verifică corectitudinea răspunsurilor
    const mainAnswer = parseInt(userDigits.join('')) || 0;
    const proofSum = parseInt(proofSumDigits.join('')) || 0;
    const proofSub = parseInt(proofSubDigits.join('')) || 0;
    
    const mainCorrect = mainAnswer === currentOperation.result;
    const proofSumCorrect = proofSum === currentOperation.result; // Prima probă: suma totală
    const proofSubCorrect = proofSub === currentOperation.result; // A doua probă: rezultatul scăderii
    
    // Toate răspunsurile trebuie să fie corecte
    const allCorrect = mainCorrect && proofSumCorrect && proofSubCorrect;
    
    setIsCorrect(allCorrect);
    
    if (allCorrect) {
      setProgress(prev => prev + 1);
      setShowAnimation(true);
      toast({
        title: t.excellent, 
        description: "Excelent! Toate răspunsurile sunt corecte!",
        duration: 2000
      });
      
      setTimeout(() => {
        setShowAnimation(false);
        if (progress + 1 < 10) {
          generateOperation();
          // Resetează toate răspunsurile pentru următoarea operație
          setUserDigits([]);
          setProofSumDigits([]);
          setProofSubDigits([]);
          setActiveInput(null);
        }
      }, 2000);
    } else {
      // Mesaj specific pentru fiecare căsuță greșită
      let errorMessage = "Ești aproape! Verifică: ";
      if (!mainCorrect) errorMessage += "răspunsul principal, ";
      if (!proofSumCorrect) errorMessage += "proba adunării, ";
      if (!proofSubCorrect) errorMessage += "proba scăderii, ";
      errorMessage = errorMessage.slice(0, -2); // Remove last comma and space
      
      toast({
        title: "Verifică răspunsurile",
        description: errorMessage,
        variant: "destructive",
        duration: 4000
      });
    }
  };

  const handleProgressComplete = () => {
    setTimeout(() => {
      setProgress(0);
      generateOperation();
    }, 2000);
  };

  const resetGame = () => {
    setProgress(0);
    setGameTime(0);
    setIsPlaying(false);
    generateOperation();
  };

  const getDeviceStyles = () => {
    const scaleValue = scale[0] / 100;
    
    switch (deviceMode) {
      case 'phone':
        return {
          transform: `scale(${scaleValue})`,
          maxWidth: '375px',
          margin: '0 auto'
        };
      case 'tablet':
        return {
          transform: `scale(${scaleValue})`,
          maxWidth: '768px',
          margin: '0 auto'
        };
      default:
        return {
          transform: `scale(${scaleValue})`,
          maxWidth: '1200px',
          margin: '0 auto'
        };
    }
  };

  const renderEquationText = () => {
    if (!currentOperation || currentOperation.result > 10) return null;
    
    if (level === 'adunari') {
      return (
        <p className="text-center text-lg font-medium text-muted-foreground mb-4">
          {currentOperation.term1} + {currentOperation.term2} = {currentOperation.result}
        </p>
      );
    } else if (level === 'scaderi') {
      return (
        <p className="text-center text-lg font-medium text-muted-foreground mb-4">
          {currentOperation.term1} - {currentOperation.term2} = {currentOperation.result}
        </p>
      );
    }
  };

  const renderVerticalEquation = () => {
    if (!currentOperation) return null;
    
    return (
      <div className={cn(
        "bg-white border-2 border-primary rounded-lg p-6 transition-all duration-500",
        showAnimation && "scale-110 shadow-lg border-success"
      )}>
        <div className="text-center space-y-2">
          <div className="text-lg font-bold text-primary">
            {currentOperation.term1}
          </div>
          <div className="text-lg font-bold text-primary flex items-center justify-center gap-2">
            {currentOperation.operation} {currentOperation.term2}
          </div>
          <div className="border-t-2 border-primary pt-2">
            <div className="flex justify-center">
              <div className="px-4 py-2 bg-gray-100 rounded-lg text-lg font-bold">
                {userDigits.join('') || '?'}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderProofSection = () => {
    if (!currentOperation) return null;
    
    return (
      <Card className="border-2 border-success">
        <CardHeader>
          <CardTitle className="text-center">
            {t.proofAddition}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Prima probă: Term2 + Term1 = Sum cu layout vertical */}
            <div className="bg-muted rounded-lg p-4">
              <div className="space-y-4">
                {/* Titlul probei */}
                <div className="flex justify-center mb-4">
                  <div className="text-base font-medium text-muted-foreground text-center">
                    {t.term2} + {t.term1} = {t.sum}
                  </div>
                </div>
                
                {/* Layout vertical cu aliniere perfectă la dreapta */}
                <div className="flex flex-col items-end space-y-2" style={{ minHeight: '250px' }}>
                  
                  {/* Termenul 2 - primul de sus */}
                  <div className="flex items-end gap-2">
                    <div className="text-sm font-medium text-muted-foreground self-center mr-2">
                      {t.term2}
                    </div>
                    <RigletaNumLit 
                      number={currentOperation.term2}
                      translations={{
                        units: t.units,
                        tens: t.tens,
                        hundreds: t.hundreds,
                        thousands: t.thousands,
                        unitsClass: t.unitsClass,
                        thousandsClass: t.thousandsClass,
                        millionsClass: t.millionsClass
                      }}
                    />
                  </div>
                  
                  {/* Termenul 1 cu semnul + */}
                  <div className="flex items-end gap-2">
                    <div className="text-sm font-medium text-muted-foreground self-center mr-2">
                      {t.term1}
                    </div>
                    <div className="flex items-end gap-2">
                      <span className="text-2xl font-bold text-primary self-center mr-2">+</span>
                      <RigletaNumLit 
                        number={currentOperation.term1}
                        translations={{
                          units: t.units,
                          tens: t.tens,
                          hundreds: t.hundreds,
                          thousands: t.thousands,
                          unitsClass: t.unitsClass,
                          thousandsClass: t.thousandsClass,
                          millionsClass: t.millionsClass
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Linie de separare */}
                  <div className="border-t-2 border-primary my-2 w-64 max-w-full"></div>
                  
                  {/* Suma cu semnul = */}
                  <div className="flex items-end gap-2">
                    <div className="text-sm font-medium text-muted-foreground self-center mr-2">
                      {t.sum}
                    </div>
                    <div className="flex items-end gap-2">
                      <span className="text-2xl font-bold text-primary self-center mr-2">=</span>
                       <div className="flex gap-1" style={{ marginBottom: '40px' }}>
                         {Array.from({ length: digits }).map((_, index) => {
                           const totalDigits = digits;
                           const position = totalDigits - 1 - index; // Convert visual position to array position (units=0, tens=1, etc.)
                           const displayValue = proofSumDigits[position] || '';
                           
                           return (
                           <input
                             key={index}
                             type="text"
                             value={displayValue}
                             onChange={(e) => handleInputChange(e, 'proofSum', position)}
                             onClick={() => setActiveInput('proofSum')}
                             placeholder="?"
                             className={`w-16 h-16 flex items-center justify-center font-bold border-2 ${getDigitBorderColor(index, totalDigits)} rounded-lg bg-white text-primary text-center focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer`}
                             style={{ fontSize: level === 'adunari' && /^\d$/.test(displayValue) ? '48px' : '43px' }}
                             maxLength={1}
                           />
                           );
                         })}
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* A doua probă: Sum - Term2 = Term1 cu layout vertical */}
            <div className="bg-accent rounded-lg p-4">
              <h3 className="text-center text-lg font-semibold mb-4">
                {t.proofThrough} {t.throughSubtraction}
              </h3>
              
              <div className="space-y-4">
                {/* Titlul probei */}
                <div className="flex justify-center mb-4">
                  <div className="text-base font-medium text-muted-foreground text-center">
                    {t.sum} - {t.term2} = {t.term1}
                  </div>
                </div>
                
                {/* Layout vertical cu aliniere perfectă la dreapta */}
                <div className="flex flex-col items-end space-y-2" style={{ minHeight: '250px' }}>
                  
                  {/* Suma introdusă - primul de sus */}
                  <div className="flex items-end gap-2">
                    <div className="text-sm font-medium text-muted-foreground self-center mr-2">
                      {t.sum}
                    </div>
                     <div className="flex gap-1" style={{ marginBottom: '40px' }}>
                       {Array.from({ length: digits }).map((_, index) => {
                         const totalDigits = digits;
                         const position = totalDigits - 1 - index; // Convert visual position to array position (units=0, tens=1, etc.)
                         const displayValue = proofSubDigits[position] || '';
                         
                         return (
                           <input
                             key={index}
                             type="text"
                             value={displayValue}
                             onChange={(e) => handleInputChange(e, 'proofSub', position)}
                             onClick={() => setActiveInput('proofSub')}
                             placeholder="?"
                             className={`w-16 h-16 flex items-center justify-center font-bold border-2 ${getDigitBorderColor(index, totalDigits)} rounded-lg bg-white text-primary text-center focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer`}
                             style={{ fontSize: level === 'adunari' && /^\d$/.test(displayValue) ? '48px' : '43px' }}
                             maxLength={1}
                           />
                         );
                       })}
                     </div>
                  </div>
                  
                  {/* Termenul 2 cu semnul - */}
                  <div className="flex items-end gap-2">
                    <div className="text-sm font-medium text-muted-foreground self-center mr-2">
                      {t.term2}
                    </div>
                    <div className="flex items-end gap-2">
                      <span className="text-2xl font-bold text-primary self-center mr-2">-</span>
                      <RigletaNumLit 
                        number={currentOperation.term2}
                        translations={{
                          units: t.units,
                          tens: t.tens,
                          hundreds: t.hundreds,
                          thousands: t.thousands,
                          unitsClass: t.unitsClass,
                          thousandsClass: t.thousandsClass,
                          millionsClass: t.millionsClass
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Linie de separare */}
                  <div className="border-t-2 border-primary my-2 w-64 max-w-full"></div>
                  
                  {/* Rezultatul cu semnul = */}
                  <div className="flex items-end gap-2">
                    <div className="text-sm font-medium text-muted-foreground self-center mr-2">
                      {t.term1}
                    </div>
                    <div className="flex items-end gap-2">
                      <span className="text-2xl font-bold text-primary self-center mr-2">=</span>
                      <RigletaNumLit 
                        number={currentOperation.term1}
                        translations={{
                          units: t.units,
                          tens: t.tens,
                          hundreds: t.hundreds,
                          thousands: t.thousands,
                          unitsClass: t.unitsClass,
                          thousandsClass: t.thousandsClass,
                          millionsClass: t.millionsClass
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 w-full flex">
        {/* Sidebar */}
        <Sidebar className="w-48">
          <SidebarContent className="bg-white">
            <SidebarGroup>
              <SidebarGroupLabel>
                <Button variant="ghost" onClick={() => window.history.back()} className="w-full justify-start">
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
                    <Select value={selectedLanguage} onValueChange={(value) => setSelectedLanguage(value as keyof typeof gameTranslations)}>
                      <SelectTrigger className="w-full h-6 text-xs border-green-300 focus:border-green-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white z-50">
                        <SelectItem value="ar">🇸🇦 العربية</SelectItem>
                        <SelectItem value="bg">🇧🇬 Български</SelectItem>
                        <SelectItem value="cz">🇨🇿 Čeština</SelectItem>
                        <SelectItem value="de">🇩🇪 Deutsch</SelectItem>
                        <SelectItem value="el">🇬🇷 Ελληνικά</SelectItem>
                        <SelectItem value="en">🇬🇧 English</SelectItem>
                        <SelectItem value="es">🇪🇸 Español</SelectItem>
                        <SelectItem value="fr">🇫🇷 Français</SelectItem>
                        <SelectItem value="hu">🇭🇺 Magyar</SelectItem>
                        <SelectItem value="it">🇮🇹 Italiano</SelectItem>
                        <SelectItem value="pl">🇵🇱 Polski</SelectItem>
                        <SelectItem value="pt">🇵🇹 Português</SelectItem>
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
                    <Select value={level} onValueChange={(value) => setLevel(value as GameLevel)}>
                      <SelectTrigger className="w-full h-6 text-xs border-purple-300 focus:border-purple-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white z-50">
                        <SelectItem value="adunari">{t.levelNames.adunari}</SelectItem>
                        <SelectItem value="scaderi">{t.levelNames.scaderi}</SelectItem>
                        <SelectItem value="adunari-trecere" disabled>{t.levelNames.adunariTrecere}</SelectItem>
                        <SelectItem value="scaderi-trecere" disabled>{t.levelNames.scaderiTrecere}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Digit Selector */}
                  <div className="bg-gray-50 border-2 border-fuchsia-300 rounded-lg p-1">
                    <div className="bg-white border-2 border-fuchsia-400 rounded-lg p-1 mb-1">
                      <div className="text-sm font-bold text-fuchsia-600 text-center">
                        {t.digitLabel}
                      </div>
                    </div>
                    <div className="p-1">
                      <NumberSelector
                        value={digits}
                        min={1}
                        max={9}
                        onChange={setDigits}
                      />
                    </div>
                  </div>

                  {/* Concentration Selector */}
                  <div className="bg-orange-50 border-2 border-orange-300 rounded-lg p-1">
                    <div className="bg-white border-2 border-orange-400 rounded-lg p-1 mb-1">
                      <div className="text-sm font-bold text-orange-600 text-center">
                        {t.concentrationLabel}
                      </div>
                    </div>
                    <Select value={concentration} onValueChange={(value) => setConcentration(value as ConcentrationLevel)}>
                      <SelectTrigger className="w-full h-6 text-xs border-orange-300 focus:border-orange-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white z-50">
                        <SelectItem value="0-10">{t.concentrationLevels["0-10"]}</SelectItem>
                        <SelectItem value="0-letters">{t.concentrationLevels["0-letters"]}</SelectItem>
                        <SelectItem value="0-100">{t.concentrationLevels["0-100"]}</SelectItem>
                        <SelectItem value=">">{t.concentrationLevels[">"]}</SelectItem>
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
                      Ghid pentru jocul de calcul NumLit
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
                {level === 'adunari' ? t.levelNames.adunari : t.levelNames.scaderi}
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
              <Timer isRunning={isPlaying} onTimeUpdate={setGameTime} />
              <GameControls
                isPlaying={isPlaying}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onRepeat={resetGame}
                onShuffle={generateOperation}
              />
            </div>
          </div>

          {/* Game Content - moved to bottom for accessibility */}
          <div className="mt-auto" style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}>
            {/* Main Game Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-4 mb-32">
              {/* Left Side - Main Operation */}
              <div className="space-y-6">
                <Card className="border-2 border-odd-number">
                  <CardHeader>
                    <CardTitle className="text-center">
                      {level === 'adunari' ? t.addition : t.subtraction}
                    </CardTitle>
                  </CardHeader>
                   <CardContent>
                      {/* Layout vertical - perfect right alignment */}
                      {currentOperation && (
                        <div className="space-y-6">
                          {/* Etichete pentru layout vertical */}
                          <div className="flex justify-center mb-4">
                            <div className="text-base font-medium text-muted-foreground text-center">
                              {t.term1} {currentOperation.operation} {t.term2} = {level === 'adunari' ? t.sum : t.difference}
                            </div>
                          </div>
                          
                          {/* Layout vertical cu aliniere perfectă la dreapta */}
                          <div className="flex flex-col items-end space-y-2" style={{ minHeight: '300px' }}>
                            
                            {/* Termenul 1 - primul de sus */}
                            <div className="flex items-end gap-2">
                              <div className="text-sm font-medium text-muted-foreground self-center mr-2">
                                {t.term1}
                              </div>
                              <RigletaNumLit 
                                number={currentOperation.term1}
                                translations={{
                                  units: t.units,
                                  tens: t.tens,
                                  hundreds: t.hundreds,
                                  thousands: t.thousands,
                                  unitsClass: t.unitsClass,
                                  thousandsClass: t.thousandsClass,
                                  millionsClass: t.millionsClass
                                }}
                              />
                            </div>
                            
                            {/* Termenul 2 cu operatorul */}
                            <div className="flex items-end gap-2">
                              <div className="text-sm font-medium text-muted-foreground self-center mr-2">
                                {t.term2}
                              </div>
                              <div className="flex items-end gap-2">
                                <span className="text-2xl font-bold text-primary self-center mr-2">
                                  {currentOperation.operation}
                                </span>
                                <RigletaNumLit 
                                  number={currentOperation.term2}
                                  translations={{
                                    units: t.units,
                                    tens: t.tens,
                                    hundreds: t.hundreds,
                                    thousands: t.thousands,
                                    unitsClass: t.unitsClass,
                                    thousandsClass: t.thousandsClass,
                                    millionsClass: t.millionsClass
                                  }}
                                />
                              </div>
                            </div>
                            
                            {/* Linie de separare */}
                            <div className="border-t-2 border-primary my-2 w-64 max-w-full"></div>
                            
                            {/* Rezultatul cu semnul = */}
                            <div className="flex items-end gap-2">
                              <div className="text-sm font-medium text-muted-foreground self-center mr-2">
                                {level === 'adunari' ? t.sum : t.difference}
                              </div>
                              <div className="flex items-end gap-2">
                                <span className="text-2xl font-bold text-primary self-center mr-2">=</span>
                                {isCorrect === true ? (
                                  <RigletaNumLit 
                                    number={currentOperation.result}
                                    translations={{
                                      units: t.units,
                                      tens: t.tens,
                                      hundreds: t.hundreds,
                                      thousands: t.thousands,
                                      unitsClass: t.unitsClass,
                                      thousandsClass: t.thousandsClass,
                                      millionsClass: t.millionsClass
                                    }}
                                  />
                                ) : (
                                   <div className="flex gap-1" style={{ marginBottom: '40px' }}>
                                     {Array.from({ length: digits }).map((_, index) => {
                                       const totalDigits = digits;
                                       const position = totalDigits - 1 - index; // Convert visual position to array position (units=0, tens=1, etc.)
                                       const displayValue = userDigits[position] || '';
                                       
                                       return (
                         <input
                           key={index}
                           type="text"
                           value={displayValue}
                           onChange={(e) => handleInputChange(e, 'main', position)}
                           placeholder="?"
                           className={`w-16 h-16 flex items-center justify-center font-bold border-2 ${getDigitBorderColor(index, totalDigits)} rounded-lg bg-white text-primary text-center focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer`}
                           style={{ fontSize: level === 'adunari' && /^\d$/.test(displayValue) ? '48px' : '43px' }}
                           maxLength={1}
                           onClick={() => setActiveInput('main')}
                         />
                                       );
                                     })}
                                   </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex justify-center gap-2 mt-4">
                       <Button onClick={handleSubmit} disabled={userDigits.length === 0 || proofSumDigits.length === 0 || proofSubDigits.length === 0}>
                         {t.checkAnswer}
                       </Button>
                       <Button 
                         onClick={() => setShowKeyboard(!showKeyboard)}
                         variant="outline"
                         className="border-blue-500 hover:bg-blue-50"
                       >
                         <Keyboard className="w-8 h-8 text-blue-600" />
                       </Button>
                     </div>
                   </CardContent>
                 </Card>

                 {/* NumLit Keyboard - positioned directly under the Adunare container */}
                {showKeyboard && (
                  <NumLitKeyboard
                    onKeyPress={(key) => {
                      if (key === 'validate') {
                        handleSubmit();
                      } else if (key === 'backspace') {
                        // Handle backspace - remove the rightmost digit
                        if (activeInput === 'proofSum') {
                          setProofSumDigits(prev => {
                            const newDigits = [...prev];
                            // Find the rightmost non-empty digit and clear it
                            for (let i = 0; i < newDigits.length; i++) {
                              if (newDigits[i] !== '') {
                                newDigits[i] = '';
                                break;
                              }
                            }
                            return newDigits;
                          });
                        } else if (activeInput === 'proofSub') {
                          setProofSubDigits(prev => {
                            const newDigits = [...prev];
                            // Find the rightmost non-empty digit and clear it
                            for (let i = 0; i < newDigits.length; i++) {
                              if (newDigits[i] !== '') {
                                newDigits[i] = '';
                                break;
                              }
                            }
                            return newDigits;
                          });
                        } else {
                          setUserDigits(prev => {
                            const newDigits = [...prev];
                            // Find the rightmost non-empty digit and clear it
                            for (let i = 0; i < newDigits.length; i++) {
                              if (newDigits[i] !== '') {
                                newDigits[i] = '';
                                break;
                              }
                            }
                            return newDigits;
                          });
                        }
                      } else {
                        // Add character to active input - find the rightmost empty position
                        if (activeInput === 'proofSum') {
                          setProofSumDigits(prev => {
                            const newDigits = [...prev];
                            // Ensure array has correct length
                            while (newDigits.length < digits) {
                              newDigits.push('');
                            }
                            // Find the rightmost empty position (units first)
                            for (let i = 0; i < digits; i++) {
                              if (newDigits[i] === '') {
                                newDigits[i] = key;
                                break;
                              }
                            }
                            return newDigits;
                          });
                        } else if (activeInput === 'proofSub') {
                          setProofSubDigits(prev => {
                            const newDigits = [...prev];
                            while (newDigits.length < digits) {
                              newDigits.push('');
                            }
                            // Find the rightmost empty position (units first)
                            for (let i = 0; i < digits; i++) {
                              if (newDigits[i] === '') {
                                newDigits[i] = key;
                                break;
                              }
                            }
                            return newDigits;
                          });
                        } else {
                          setUserDigits(prev => {
                            const newDigits = [...prev];
                            while (newDigits.length < digits) {
                              newDigits.push('');
                            }
                            // Find the rightmost empty position (units first)
                            for (let i = 0; i < digits; i++) {
                              if (newDigits[i] === '') {
                                newDigits[i] = key;
                                break;
                              }
                            }
                            return newDigits;
                          });
                        }
                      }
                    }}
                    onClose={() => setShowKeyboard(false)}
                    concentration={concentration}
                    selectedLanguage={selectedLanguage}
                    onConcentrationChange={(conc) => setConcentration(conc)}
                    onLanguageChange={(lang) => setSelectedLanguage(lang as keyof typeof gameTranslations)}
                    includeOperators={true}
                    inline={true}
                  />
                )}
              </div>

              {/* Right Side - Proof */}
              <div className="space-y-6">
                {renderProofSection()}
              </div>
            </div>
          </div>
            
        </div>
      </div>
    </SidebarProvider>
  );
}