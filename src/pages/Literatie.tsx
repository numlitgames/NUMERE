import React, { useState, useEffect, useMemo, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import ProgressBar from "@/components/educational/ProgressBar";
import GameControls from "@/components/educational/GameControls";
import ZoomControls from "@/components/educational/ZoomControls";
import Timer from "@/components/educational/Timer";
import VerticalSelector from "@/components/educational/VerticalSelector";
import { Book, PenTool, Volume2, Star, Home, Info, Globe, Play, CheckCircle, XCircle, Keyboard } from "lucide-react";
import LiteracyKeyboard from "@/components/educational/LiteracyKeyboard";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Canvas as FabricCanvas, FabricText, FabricImage, Shadow } from "fabric";
import numLitLogo from "@/assets/numlit-logo-header.png";
import { WritingDirectionManager } from "@/utils/writingDirection";
import { svgLetterComponents } from "@/components/educational/svg-letters";
import SpinningWheel from "@/components/educational/SpinningWheel";
import WheelEditor from "@/components/educational/WheelEditor";

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

// Letter images mapping - Updated with SVG components
const letterImages: Record<string, string> = {
  'A': AImage,
  'Ă': ĂImage,
  'Â': ÂImage,
  'B': BImage,
  'C': CImage,
  'D': DImage,
  'E': EImage,
  'F': FImage,
  'G': GImage,
  'H': HImage,
  'I': IImage,
  'Î': ÎImage,
  'J': JImage,
  'K': KImage,
  'L': LImage,
  'M': MImage,
  'N': NImage,
  'O': OImage,
  'P': PImage,
  'Q': QImage,
  'R': RImage,
  'S': SImage,
  'Ș': ȘImage,
  'T': TImage,
  'Ț': ȚImage,
  'U': UImage,
  'V': VImage,
  'W': WImage,
  'X': XImage,
  'Y': YImage,
  'Z': ZImage
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

// Complete translations for all 16 supported languages
const translations = {
  ar: {
    flag: "🇸🇦",
    name: "العربية",
    title: "محو الأمية التفاعلي ✨",
    subtitle: "تطوير مهارات القراءة والكتابة من خلال الألعاب التفاعلية",
    slogan: "تدريب العقل",
    instructions: "التعليمات",
    howToPlayTitle: "كيفية اللعب", 
    howToPlay: "اختر حرفًا وطور مهارات القراءة والكتابة والنطق والمفردات من خلال الأنشطة التفاعلية.",
    back: "العودة",
    language: "اللغة",
    level: "المستوى",
    letterLabel: "اختر الحرف",
    progressLabel: "التقدم",
    reading: "القراءة",
    writing: "الكتابة", 
    pronunciation: "النطق",
    vocabulary: "المفردات",
    readingDesc: "تمارين القراءة وفهم النص",
    writingDesc: "تمارين الكتابة وتشكيل الحروف",
    pronunciationDesc: "تمارين النطق والإلقاء",
    vocabularyDesc: "تعلم كلمات وتعبيرات جديدة",
    levels: { beginner: "1", easy: "2", medium: "3", hard: "4" },
    letters: "أبتثجحخدذرزسشصضطظعغفقكلمنهوي",
    // Wheel translations
    sector: "قطاع",
    sectorCount: "عدد القطاعات",
    sectorTexts: "نصوص القطاعات",
    enterText: "أدخل النص",
    saveWheel: "حفظ العجلة",
    wheelName: "اسم العجلة",
    enterName: "أدخل الاسم",
    save: "حفظ",
    cancel: "إلغاء",
    savedWheels: "العجلات المحفوظة",
    cubeMethod: "طريقة المكعب",
    wheelResult: "نتيجة العجلة"
  },
  bg: {
    flag: "🇧🇬", 
    name: "Български",
    title: "Интерактивна Грамотност ✨",
    subtitle: "Развивайте умения за четене и писане чрез интерактивни игри",
    slogan: "Тренирайте Ума",
    instructions: "Инструкции",
    howToPlayTitle: "Как да играете",
    howToPlay: "Изберете буква и развийте умения за четене, писане, произношение и речник чрез интерактивни дейности.",
    back: "Назад",
    language: "Език",
    level: "Ниво", 
    letterLabel: "Изберете буква",
    progressLabel: "Прогрес",
    reading: "Четене",
    writing: "Писане",
    pronunciation: "Произношение", 
    vocabulary: "Речник",
    readingDesc: "Упражнения за четене и разбиране на текста",
    writingDesc: "Упражнения за писане и формиране на букви",
    pronunciationDesc: "Упражнения за произношение и дикция",
    vocabularyDesc: "Изучаване на нови думи и изрази",
    levels: { beginner: "1", easy: "2", medium: "3", hard: "4" },
    letters: "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЬЮЯ",
    // Wheel translations
    sector: "Сектор",
    sectorCount: "Брой сектори",
    sectorTexts: "Текстове на секторите",
    enterText: "Въведете текст",
    saveWheel: "Запази колелото",
    wheelName: "Име на колелото",
    enterName: "Въведете име",
    save: "Запази",
    cancel: "Отказ",
    savedWheels: "Запазени колела",
    cubeMethod: "Метод на кубчето",
    wheelResult: "Резултат от колелото"
  },
  cs: {
    flag: "🇨🇿",
    name: "Čeština", 
    title: "Interaktivní Gramotnost ✨",
    subtitle: "Rozvíjejte dovednosti čtení a psaní prostřednictvím interaktivních her",
    slogan: "Trénujte Mozek",
    instructions: "Instrukce",
    howToPlayTitle: "Jak hrát",
    howToPlay: "Vyberte písmeno a rozvíjejte dovednosti čtení, psaní, výslovnosti a slovní zásoby prostřednictvím interaktivních aktivit.",
    back: "Zpět",
    language: "Jazyk",
    level: "Úroveň",
    letterLabel: "Vyberte písmeno", 
    progressLabel: "Pokrok",
    reading: "Čtení",
    writing: "Psaní",
    pronunciation: "Výslovnost",
    vocabulary: "Slovní zásoba",
    readingDesc: "Cvičení čtení a porozumění textu",
    writingDesc: "Cvičení psaní a tvorby písmen",
    pronunciationDesc: "Cvičení výslovnosti a dikce",
    vocabularyDesc: "Učení nových slov a výrazů",
    levels: { beginner: "1", easy: "2", medium: "3", hard: "4" },
    letters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    sector: "Sektor", sectorCount: "Počet sektorů", sectorTexts: "Texty sektorů", enterText: "Zadejte text", saveWheel: "Uložit kolo", wheelName: "Název kola", enterName: "Zadejte název", save: "Uložit", cancel: "Zrušit", savedWheels: "Uložená kola", cubeMethod: "Metoda kostky", wheelResult: "Výsledek kola"
  },
  de: {
    flag: "🇩🇪",
    name: "Deutsch",
    title: "Interaktive Alphabetisierung ✨", 
    subtitle: "Entwickeln Sie Lese- und Schreibfähigkeiten durch interaktive Spiele",
    slogan: "Trainiere das Gehirn",
    instructions: "Anweisungen",
    howToPlayTitle: "Wie man spielt",
    howToPlay: "Wählen Sie einen Buchstaben und entwickeln Sie Lese-, Schreib-, Aussprache- und Wortschatzfähigkeiten durch interaktive Aktivitäten.",
    back: "Zurück",
    language: "Sprache",
    level: "Stufe",
    letterLabel: "Buchstaben wählen",
    progressLabel: "Fortschritt", 
    reading: "Lesen",
    writing: "Schreiben",
    pronunciation: "Aussprache",
    vocabulary: "Wortschatz",
    readingDesc: "Lese- und Textverständnisübungen",
    writingDesc: "Schreib- und Buchstabenformungsübungen", 
    pronunciationDesc: "Aussprache- und Diktion­übungen",
    vocabularyDesc: "Neue Wörter und Ausdrücke lernen",
    levels: { beginner: "1", easy: "2", medium: "3", hard: "4" },
    letters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    sector: "Sektor", sectorCount: "Anzahl Sektoren", sectorTexts: "Sektor-Texte", enterText: "Text eingeben", saveWheel: "Rad speichern", wheelName: "Rad-Name", enterName: "Name eingeben", save: "Speichern", cancel: "Abbrechen", savedWheels: "Gespeicherte Räder", cubeMethod: "Würfel-Methode", wheelResult: "Rad-Ergebnis"
  },
  en: {
    flag: "🇺🇸",
    name: "English",
    title: "Interactive Literacy ✨",
    subtitle: "Develop reading and writing skills through interactive games",
    slogan: "Train the Brain",
    instructions: "Instructions", 
    howToPlayTitle: "How to play",
    howToPlay: "Choose a letter and develop reading, writing, pronunciation, and vocabulary skills through interactive activities.",
    back: "Back",
    language: "Language",
    level: "Level",
    letterLabel: "Choose letter",
    progressLabel: "Progress",
    reading: "Reading",
    writing: "Writing",
    pronunciation: "Pronunciation",
    vocabulary: "Vocabulary",
    readingDesc: "Reading and text comprehension exercises",
    writingDesc: "Writing and letter formation exercises",
    pronunciationDesc: "Pronunciation and diction exercises", 
    vocabularyDesc: "Learning new words and expressions",
    levels: { beginner: "1", easy: "2", medium: "3", hard: "4" },
    letters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    // Wheel translations
    sector: "Sector",
    sectorCount: "Number of Sectors",
    sectorTexts: "Sector Texts",
    enterText: "Enter text",
    saveWheel: "Save Wheel",
    wheelName: "Wheel Name",
    enterName: "Enter name",
    save: "Save",
    cancel: "Cancel",
    savedWheels: "Saved Wheels",
    cubeMethod: "Cube Method",
    wheelResult: "Wheel Result"
  },
  es: {
    flag: "🇪🇸",
    name: "Español",
    title: "Alfabetización Interactiva ✨",
    subtitle: "Desarrolla habilidades de lectura y escritura a través de juegos interactivos",
    slogan: "Entrena la Mente",
    instructions: "Instrucciones",
    howToPlayTitle: "Cómo jugar",
    howToPlay: "Elige una letra y desarrolla habilidades de lectura, escritura, pronunciación y vocabulario a través de actividades interactivas.",
    back: "Atrás",
    language: "Idioma", 
    level: "Nivel",
    letterLabel: "Elegir letra",
    progressLabel: "Progreso",
    reading: "Lectura",
    writing: "Escritura",
    pronunciation: "Pronunciación",
    vocabulary: "Vocabulario",
    readingDesc: "Ejercicios de lectura y comprensión de texto",
    writingDesc: "Ejercicios de escritura y formación de letras",
    pronunciationDesc: "Ejercicios de pronunciación y dicción",
    vocabularyDesc: "Aprender nuevas palabras y expresiones",
    levels: { beginner: "1", easy: "2", medium: "3", hard: "4" },
    letters: "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ",
    sector: "Sector", sectorCount: "Número de sectores", sectorTexts: "Textos de sectores", enterText: "Ingresar texto", saveWheel: "Guardar rueda", wheelName: "Nombre de rueda", enterName: "Ingresar nombre", save: "Guardar", cancel: "Cancelar", savedWheels: "Ruedas guardadas", cubeMethod: "Método del cubo", wheelResult: "Resultado de rueda"
  },
  fr: {
    flag: "🇫🇷",
    name: "Français",
    title: "Alphabétisation Interactive ✨",
    subtitle: "Développez les compétences de lecture et d'écriture grâce à des jeux interactifs",
    slogan: "Entraînez le Cerveau",
    instructions: "Instructions",
    howToPlayTitle: "Comment jouer",
    howToPlay: "Choisissez une lettre et développez les compétences de lecture, d'écriture, de prononciation et de vocabulaire grâce à des activités interactives.",
    back: "Retour",
    language: "Langue",
    level: "Niveau",
    letterLabel: "Choisir la lettre",
    progressLabel: "Progrès",
    reading: "Lecture",
    writing: "Écriture",
    pronunciation: "Prononciation",
    vocabulary: "Vocabulaire",
    readingDesc: "Exercices de lecture et de compréhension de texte",
    writingDesc: "Exercices d'écriture et de formation des lettres",
    pronunciationDesc: "Exercices de prononciation et de diction", 
    vocabularyDesc: "Apprendre de nouveaux mots et expressions",
    levels: { beginner: "1", easy: "2", medium: "3", hard: "4" },
    letters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    sector: "Secteur", sectorCount: "Nombre de secteurs", sectorTexts: "Textes des secteurs", enterText: "Entrer le texte", saveWheel: "Sauvegarder la roue", wheelName: "Nom de la roue", enterName: "Entrer le nom", save: "Sauvegarder", cancel: "Annuler", savedWheels: "Roues sauvegardées", cubeMethod: "Méthode du cube", wheelResult: "Résultat de la roue"
  },
  hi: {
    flag: "🇮🇳",
    name: "हिंदी",
    title: "इंटरैक्टिव साक्षरता ✨",
    subtitle: "इंटरैक्टिव गेम्स के माध्यम से पढ़ने और लिखने के कौशल विकसित करें",
    slogan: "मस्तिष्क को प्रशिक्षित करें",
    instructions: "निर्देश",
    howToPlayTitle: "कैसे खेलें",
    howToPlay: "एक अक्षर चुनें और इंटरैक्टिव गतिविधियों के माध्यम से पढ़ने, लिखने, उच्चारण और शब्दावली कौशल विकसित करें।",
    back: "वापस",
    language: "भाषा",
    level: "स्तर",
    letterLabel: "अक्षर चुनें",
    progressLabel: "प्रगति",
    reading: "पढ़ना",
    writing: "लिखना",
    pronunciation: "उच्चारण",
    vocabulary: "शब्दावली",
    readingDesc: "पढ़ने और पाठ समझने के अभ्यास",
    writingDesc: "लिखने और अक्षर निर्माण के अभ्यास",
    pronunciationDesc: "उच्चारण और डिक्शन अभ्यास",
    vocabularyDesc: "नए शब्द और अभिव्यक्तियां सीखना",
    levels: { beginner: "1", easy: "2", medium: "3", hard: "4" },
    letters: "अआइईउऊऋएऐओऔकखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह",
    sector: "सेक्टर", sectorCount: "सेक्टर की संख्या", sectorTexts: "सेक्टर पाठ", enterText: "पाठ दर्ज करें", saveWheel: "चक्र सहेजें", wheelName: "चक्र का नाम", enterName: "नाम दर्ज करें", save: "सहेजें", cancel: "रद्द करें", savedWheels: "सहेजे गए चक्र", cubeMethod: "घन विधि", wheelResult: "चक्र परिणाम"
  },
  hu: {
    flag: "🇭🇺",
    name: "Magyar",
    title: "Interaktív Írástudás ✨",
    subtitle: "Fejlessze az olvasási és írási készségeket interaktív játékokon keresztül",
    slogan: "Edzze az Agyat",
    instructions: "Utasítások",
    howToPlayTitle: "Hogyan kell játszani",
    howToPlay: "Válasszon egy betűt és fejlessze az olvasási, írási, kiejtési és szókincs készségeit interaktív tevékenységeken keresztül.",
    back: "Vissza",
    language: "Nyelv",
    level: "Szint",
    letterLabel: "Betű kiválasztása",
    progressLabel: "Haladás",
    reading: "Olvasás",
    writing: "Írás",
    pronunciation: "Kiejtés", 
    vocabulary: "Szókincs",
    readingDesc: "Olvasási és szövegértési gyakorlatok",
    writingDesc: "Írási és betűformálási gyakorlatok",
    pronunciationDesc: "Kiejtési és dikciós gyakorlatok",
    vocabularyDesc: "Új szavak és kifejezések tanulása",
    levels: { beginner: "1", easy: "2", medium: "3", hard: "4" },
    letters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    sector: "Szektor", sectorCount: "Szektorok száma", sectorTexts: "Szektor szövegek", enterText: "Szöveg bevitele", saveWheel: "Kerék mentése", wheelName: "Kerék neve", enterName: "Név bevitele", save: "Mentés", cancel: "Mégse", savedWheels: "Mentett kerekek", cubeMethod: "Kocka módszer", wheelResult: "Kerék eredmény"
  },
  it: {
    flag: "🇮🇹",
    name: "Italiano",
    title: "Alfabetizzazione Interattiva ✨",
    subtitle: "Sviluppa le competenze di lettura e scrittura attraverso giochi interattivi",
    slogan: "Allena la Mente",
    instructions: "Istruzioni",
    howToPlayTitle: "Come giocare",
    howToPlay: "Scegli una lettera e sviluppa le competenze di lettura, scrittura, pronuncia e vocabolario attraverso attività interattive.",
    back: "Indietro",
    language: "Lingua",
    level: "Livello",
    letterLabel: "Scegli lettera",
    progressLabel: "Progresso",
    reading: "Lettura",
    writing: "Scrittura",
    pronunciation: "Pronuncia",
    vocabulary: "Vocabolario",
    readingDesc: "Esercizi di lettura e comprensione del testo",
    writingDesc: "Esercizi di scrittura e formazione delle lettere",
    pronunciationDesc: "Esercizi di pronuncia e dizione",
    vocabularyDesc: "Imparare nuove parole ed espressioni",
    levels: { beginner: "1", easy: "2", medium: "3", hard: "4" },
    letters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    sector: "Settore", sectorCount: "Numero di settori", sectorTexts: "Testi dei settori", enterText: "Inserisci testo", saveWheel: "Salva ruota", wheelName: "Nome ruota", enterName: "Inserisci nome", save: "Salva", cancel: "Annulla", savedWheels: "Ruote salvate", cubeMethod: "Metodo del cubo", wheelResult: "Risultato ruota"
  },
  ja: {
    flag: "🇯🇵",
    name: "日本語",
    title: "インタラクティブ リテラシー ✨",
    subtitle: "インタラクティブなゲームを通じて読み書きスキルを開発する",
    slogan: "脳を鍛える",
    instructions: "説明書",
    howToPlayTitle: "遊び方",
    howToPlay: "文字を選んで、インタラクティブな活動を通じて読み、書き、発音、語彙スキルを開発してください。",
    back: "戻る",
    language: "言語",
    level: "レベル",
    letterLabel: "文字を選択",
    progressLabel: "進歩",
    reading: "読書",
    writing: "書く",
    pronunciation: "発音",
    vocabulary: "語彙",
    readingDesc: "読解とテキスト理解の練習",
    writingDesc: "書字と文字形成の練習",
    pronunciationDesc: "発音と朗読の練習",
    vocabularyDesc: "新しい言葉と表現を学ぶ",
    levels: { beginner: "1", easy: "2", medium: "3", hard: "4" },
    letters: "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん",
    sector: "セクター", sectorCount: "セクター数", sectorTexts: "セクターテキスト", enterText: "テキストを入力", saveWheel: "ホイールを保存", wheelName: "ホイール名", enterName: "名前を入力", save: "保存", cancel: "キャンセル", savedWheels: "保存されたホイール", cubeMethod: "キューブメソッド", wheelResult: "ホイール結果"
  },
  pl: {
    flag: "🇵🇱",
    name: "Polski",
    title: "Interaktywna Umiejętność Pisania ✨",
    subtitle: "Rozwijaj umiejętności czytania i pisania poprzez interaktywne gry",
    slogan: "Trenuj Mózg",
    instructions: "Instrukcje",
    howToPlayTitle: "Jak grać",
    howToPlay: "Wybierz literę i rozwijaj umiejętności czytania, pisania, wymowy i słownictwa poprzez interaktywne działania.",
    back: "Wstecz",
    language: "Język",
    level: "Poziom",
    letterLabel: "Wybierz literę",
    progressLabel: "Postęp",
    reading: "Czytanie",
    writing: "Pisanie",
    pronunciation: "Wymowa",
    vocabulary: "Słownictwo",
    readingDesc: "Ćwiczenia czytania i rozumienia tekstu",
    writingDesc: "Ćwiczenia pisania i formowania liter",
    pronunciationDesc: "Ćwiczenia wymowy i dykcji",
    vocabularyDesc: "Nauka nowych słów i wyrażeń",
    levels: { beginner: "1", easy: "2", medium: "3", hard: "4" },
    letters: "AĄBCĆDEĘFGHIJKLŁMNŃOÓPRSŚTUWYZŹŻ",
    sector: "Sektor", sectorCount: "Liczba sektorów", sectorTexts: "Teksty sektorów", enterText: "Wprowadź tekst", saveWheel: "Zapisz koło", wheelName: "Nazwa koła", enterName: "Wprowadź nazwę", save: "Zapisz", cancel: "Anuluj", savedWheels: "Zapisane koła", cubeMethod: "Metoda kostki", wheelResult: "Wynik koła"
  },
  ro: {
    flag: "🇷🇴",
    name: "Română",
    title: "Literație Metoda Cubului ✨",
    subtitle: "Dezvoltă abilități de citire și scriere prin jocuri interactive",
    slogan: "Antrenează Creierul",
    instructions: "Instrucțiuni",
    howToPlayTitle: "Cum se joacă",
    howToPlay: "Alege o literă și dezvoltă abilități de citire, scriere, pronunție și vocabular prin activități interactive.",
    back: "Înapoi",
    language: "Limbă",
    level: "Nivel",
    letterLabel: "Alege litera",
    progressLabel: "Progres",
    reading: "Citire",
    writing: "Scriere",
    pronunciation: "Pronunție",
    vocabulary: "Vocabular",
    readingDesc: "Exerciții de citire și înțelegere a textului",
    writingDesc: "Exerciții de scriere și formarea literelor",
    pronunciationDesc: "Exerciții de pronunție și dicție",
    vocabularyDesc: "Învățarea de cuvinte noi și expresii",
    levels: { beginner: "Tabla Interactivă", easy: "Metoda Cubului - Rozeta", medium: "3", hard: "4" },
    letters: "AĂÂBCDEFGHIÎJKLMNOPQRSȘTȚUVWXYZ",
    // Wheel translations
    sector: "Sector",
    sectorCount: "Numărul de sectoare",
    sectorTexts: "Textele sectoarelor",
    enterText: "Introduceți textul",
    saveWheel: "Salvați roata",
    wheelName: "Numele roții",
    enterName: "Introduceți numele",
    save: "Salvați",
    cancel: "Anulați",
    savedWheels: "Roți salvate",
    cubeMethod: "Metoda cubului",
    wheelResult: "Rezultatul roții"
  },
  ru: {
    flag: "🇷🇺",
    name: "Русский",
    title: "Интерактивная Грамотность ✨",
    subtitle: "Развивайте навыки чтения и письма через интерактивные игры",
    slogan: "Тренируйте Мозг",
    instructions: "Инструкции",
    howToPlayTitle: "Как играть",
    howToPlay: "Выберите букву и развивайте навыки чтения, письма, произношения и словарного запаса через интерактивные действия.",
    back: "Назад",
    language: "Язык",
    level: "Уровень",
    letterLabel: "Выберите букву",
    progressLabel: "Прогресс",
    reading: "Чтение",
    writing: "Письмо",
    pronunciation: "Произношение",
    vocabulary: "Словарь",
    readingDesc: "Упражнения по чтению и пониманию текста",
    writingDesc: "Упражнения по письму и формированию букв",
    pronunciationDesc: "Упражнения по произношению и дикции",
    vocabularyDesc: "Изучение новых слов и выражений",
    levels: { beginner: "1", easy: "2", medium: "3", hard: "4" },
    letters: "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ",
    sector: "Сектор", sectorCount: "Количество секторов", sectorTexts: "Тексты секторов", enterText: "Введите текст", saveWheel: "Сохранить колесо", wheelName: "Имя колеса", enterName: "Введите имя", save: "Сохранить", cancel: "Отменить", savedWheels: "Сохраненные колеса", cubeMethod: "Метод куба", wheelResult: "Результат колеса"
  },
  tr: {
    flag: "🇹🇷",
    name: "Türkçe",
    title: "Etkileşimli Okuryazarlık ✨",
    subtitle: "Etkileşimli oyunlar aracılığıyla okuma ve yazma becerilerini geliştirin",
    slogan: "Beyni Eğitin",
    instructions: "Talimatlar",
    howToPlayTitle: "Nasıl oynanır",
    howToPlay: "Bir harf seçin ve etkileşimli etkinlikler aracılığıyla okuma, yazma, telaffuz ve kelime bilgisi becerilerini geliştirin.",
    back: "Geri",
    language: "Dil",
    level: "Seviye",
    letterLabel: "Harf seçin",
    progressLabel: "İlerleme",
    reading: "Okuma",
    writing: "Yazma",
    pronunciation: "Telaffuz",
    vocabulary: "Kelime Bilgisi",
    readingDesc: "Okuma ve metin anlama egzersizleri",
    writingDesc: "Yazma ve harf oluşturma egzersizleri",
    pronunciationDesc: "Telaffuz ve diksiyon egzersizleri",
    vocabularyDesc: "Yeni kelimeler ve ifadeler öğrenme",
    levels: { beginner: "1", easy: "2", medium: "3", hard: "4" },
    letters: "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ",
    sector: "Sektör", sectorCount: "Sektör sayısı", sectorTexts: "Sektör metinleri", enterText: "Metin girin", saveWheel: "Çarkı kaydet", wheelName: "Çark adı", enterName: "Ad girin", save: "Kaydet", cancel: "İptal", savedWheels: "Kaydedilen çarklar", cubeMethod: "Küp yöntemi", wheelResult: "Çark sonucu"
  },
  zh: {
    flag: "🇨🇳",
    name: "中文",
    title: "互动识字 ✨",
    subtitle: "通过互动游戏发展阅读和写作技能",
    slogan: "训练大脑",
    instructions: "说明",
    howToPlayTitle: "如何玩",
    howToPlay: "选择一个字符，通过互动活动发展阅读、写作、发音和词汇技能。",
    back: "返回",
    language: "语言",
    level: "级别",
    letterLabel: "选择字符",
    progressLabel: "进度",
    reading: "阅读",
    writing: "写作",
    pronunciation: "发音",
    vocabulary: "词汇",
    readingDesc: "阅读和文本理解练习",
    writingDesc: "写作和字符形成练习",
    pronunciationDesc: "发音和朗读练习",
    vocabularyDesc: "学习新单词和表达",
    levels: { beginner: "1", easy: "2", medium: "3", hard: "4" },
    letters: "一二三四五六七八九十百千万亿东南西北上下左右大小多少长短高低好坏新旧",
    sector: "扇区", sectorCount: "扇区数量", sectorTexts: "扇区文本", enterText: "输入文本", saveWheel: "保存转盘", wheelName: "转盘名称", enterName: "输入名称", save: "保存", cancel: "取消", savedWheels: "保存的转盘", cubeMethod: "立方体方法", wheelResult: "转盘结果"
  }
};

// Language keys in alphabetical order
const languageKeys = ['ar', 'bg', 'cs', 'de', 'en', 'es', 'fr', 'hi', 'hu', 'it', 'ja', 'pl', 'ro', 'ru', 'tr', 'zh'] as const;

type LanguageKey = typeof languageKeys[number];

// Activity definitions
const activities = [
  {
    id: "reading",
    icon: Book,
    colorClass: "bg-emerald-500 border-emerald-300 text-emerald-600"
  },
  {
    id: "writing", 
    icon: PenTool,
    colorClass: "bg-teal-500 border-teal-300 text-teal-600"
  },
  {
    id: "pronunciation",
    icon: Volume2,
    colorClass: "bg-cyan-500 border-cyan-300 text-cyan-600"
  },
  {
    id: "vocabulary",
    icon: Star,
    colorClass: "bg-sky-500 border-sky-300 text-sky-600"
  }
];

const Literatie = () => {
  const navigate = useNavigate();
  
  // State management following existing pattern
  const [language, setLanguage] = useState<LanguageKey>('ro');
  const [level, setLevel] = useState<string>('beginner');
  const [selectedLetter, setSelectedLetter] = useState<string>('A');
  const [currentActivity, setCurrentActivity] = useState<string | null>('reading'); // Default to reading game (Level 1)
  const [progress, setProgress] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(280); // Dynamic sidebar width
  const [currentExercise, setCurrentExercise] = useState(1);
  const [showKeyboard, setShowKeyboard] = useState(false);
  useEffect(() => {
    if (level === 'easy' && showKeyboard) {
      setShowKeyboard(false);
    }
  }, [level, showKeyboard]);
  const [writtenLetters, setWrittenLetters] = useState<Array<{letter: string, image: string | null}>>([]);
  
  // Wheel-related state for Level 2
  const [wheelSectors, setWheelSectors] = useState([
    { id: 'sector-1', text: 'COMPARĂ', color: '#dc3545' },
    { id: 'sector-2', text: 'DESCRIE', color: '#007bff' },
    { id: 'sector-3', text: 'ASOCIAZĂ', color: '#28a745' },
    { id: 'sector-4', text: 'EXPLICĂ', color: '#fd7e14' },
    { id: 'sector-5', text: 'ANALIZEAZĂ', color: '#ffc107' },
    { id: 'sector-6', text: 'APLICĂ', color: '#ffffff' }
  ]);
  const [savedWheels, setSavedWheels] = useState<Array<{
    id: string;
    name: string;
    sectors: typeof wheelSectors;
    createdAt: Date;
  }>>([]);
  const [currentWheelResult, setCurrentWheelResult] = useState<string | null>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Track letter positions for flow layout
  const [letterPosition, setLetterPosition] = useState({ x: 20, y: 20 });
  const [writingDirectionManager, setWritingDirectionManager] = useState<WritingDirectionManager | null>(null);
  const letterWidth = 80;
  const letterHeight = 80;
  const lineSpacing = 100;
  const maxWidth = 700; // Adjust based on canvas width
  
  // Get current translations
  const t = translations[language];
  
  // Available letters for current language
  const availableLetters = useMemo(() => {
    return t.letters.split('');
  }, [t.letters]);

  // Debug mode state
  const [debugMode, setDebugMode] = useState(false);

  // Vowel detection for outline coloring
  const vowelsSet = useMemo(() => {
    switch (language) {
      case 'ro':
        return new Set(['A','Ă','Â','E','I','Î','O','U']);
      case 'bg':
        return new Set(['А','Е','И','О','У','Ъ','Ю','Я']);
      case 'ru':
        return new Set(['А','Е','Ё','И','О','У','Ы','Э','Ю','Я']);
      case 'ar':
        return new Set(['ا','و','ي']);
      case 'hi':
        return new Set(['अ','आ','इ','ई','उ','ऊ','ए','ऐ','ओ','औ']);
      case 'ja':
        return new Set(['あ','い','う','え','お']);
      default:
        return new Set(['A','E','I','O','U','Y']);
    }
  }, [language]);
  const isVowel = (letter: string) => vowelsSet.has(letter) || vowelsSet.has(letter.toUpperCase());
  // Initialize canvas with full viewport size for Level 1
  useEffect(() => {
    if (!canvasRef.current) return;

    // Calculate available dimensions dynamically
    const getCanvasDimensions = () => {
      if (level === 'beginner') {
        // Full viewport size for Level 1
        const width = window.innerWidth - (sidebarWidth || 300);
        const height = window.innerHeight - 48; // Subtract header height
        return { width, height };
      } else {
        // Regular size for other levels
        const container = canvasRef.current?.parentElement;
        const width = container?.clientWidth || window.innerWidth - 100;
        const height = container?.clientHeight || window.innerHeight - 200;
        return { width, height };
      }
    };

    const { width, height } = getCanvasDimensions();

    const canvas = new FabricCanvas(canvasRef.current, {
      width,
      height,
      backgroundColor: "#ffffff",
      selection: true,
    });

    // CRITICAL FIX: Reset viewport transform and zoom to ensure proper rendering
    canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
    canvas.setZoom(1);

    // Configure selection controls for better UX
    canvas.set({
      borderColor: '#2563eb',
      cornerColor: '#2563eb',
      cornerSize: 12,
      transparentCorners: false,
      cornerStyle: 'circle',
      borderScaleFactor: 2,
    });

    // Add debug grid if debug mode is enabled
    if (debugMode) {
      console.log('Adding debug grid to canvas');
      // Add grid lines for debugging
      for (let i = 0; i < width; i += 50) {
        const line = new FabricText('|', {
          left: i,
          top: 0,
          fontSize: 8,
          fill: '#ff0000',
          selectable: false,
          evented: false,
        });
        canvas.add(line);
      }
      for (let i = 0; i < height; i += 50) {
        const line = new FabricText('-', {
          left: 0,
          top: i,
          fontSize: 8,
          fill: '#ff0000',
          selectable: false,
          evented: false,
        });
        canvas.add(line);
      }
      
      // Add crosshair at 20,20 for reference
      const crosshair = new FabricText('+', {
        left: 20,
        top: 20,
        fontSize: 20,
        fill: '#ff0000',
        selectable: false,
        evented: false,
      });
      canvas.add(crosshair);
    }

    // Add click listener for debugging coordinates
    canvas.on('mouse:down', (opt) => {
      if (debugMode) {
        const pointer = canvas.getViewportPoint(opt.e);
        console.log('Canvas click at:', pointer.x, pointer.y);
        console.log('Viewport transform:', canvas.viewportTransform);
      }
    });

    setFabricCanvas(canvas);

    // Handle window resize for Level 1
    const handleResize = () => {
      if (level === 'beginner') {
        const { width: newWidth, height: newHeight } = getCanvasDimensions();
        canvas.setDimensions({ width: newWidth, height: newHeight });
        canvas.renderAll();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.dispose();
    };
  }, [level, sidebarWidth]);

  // Initialize WritingDirectionManager after canvas is ready
  useEffect(() => {
    if (!fabricCanvas) return;

    const canvasWidth = fabricCanvas.getWidth();
    const canvasHeight = fabricCanvas.getHeight();
    
    const manager = new WritingDirectionManager(canvasWidth, canvasHeight, language, 60);
    setWritingDirectionManager(manager);
    
    console.log('WritingDirectionManager initialized:', { canvasWidth, canvasHeight, language });
  }, [fabricCanvas, language]);

  // Reset letter when language changes
  useEffect(() => {
    setSelectedLetter(availableLetters[0] || 'A');
  }, [language, availableLetters]);

  // Game control functions
  const handlePlay = () => {
    setIsPlaying(true);
    setIsTimerRunning(true);
    toast.success("Jocul a început!");
  };

  const handlePause = () => {
    setIsPlaying(false);
    setIsTimerRunning(false);
  };

  const handleShuffle = () => {
    const randomLetter = availableLetters[Math.floor(Math.random() * availableLetters.length)];
    setSelectedLetter(randomLetter);
    toast.info(`Litera aleatoare: ${randomLetter}`);
  };

  const handleRepeat = () => {
    setCurrentExercise(1);
    setProgress(0);
    setCurrentActivity(null);
    toast.info("Exerciții resetate!");
  };

  const handleKeyboardToggle = () => {
    setShowKeyboard(!showKeyboard);
  };

  // Wheel handler functions for Level 2
  const handleWheelResult = (sector: typeof wheelSectors[0]) => {
    setCurrentWheelResult(sector.text);
    toast.success(`${t.wheelResult}: ${sector.text}`);
  };

  const handleWheelSave = (name: string, sectors: typeof wheelSectors) => {
    const newWheel = {
      id: `wheel-${Date.now()}`,
      name,
      sectors: [...sectors],
      createdAt: new Date()
    };
    setSavedWheels(prev => [...prev, newWheel]);
    toast.success(`${t.save}: ${name}`);
  };

  const handleWheelLoad = (wheel: typeof savedWheels[0]) => {
    setWheelSectors([...wheel.sectors]);
    toast.success(`${t.savedWheels}: ${wheel.name}`);
  };

  const handleKeyPress = (key: string) => {
    if (!fabricCanvas) {
      console.log('No fabricCanvas available');
      return;
    }

    console.log('Adding letter to canvas:', key);
    console.log('Canvas dimensions:', fabricCanvas.getWidth(), 'x', fabricCanvas.getHeight());

    const letterImage = getLetterImage(key);
    const svgComponent = getSVGComponent(key);
    const displayKey = key === ' ' ? '␣' : key; // Show space as a visible character
    
    // Get position - use WritingDirectionManager if available, otherwise fallback
    let position;
    if (writingDirectionManager) {
      position = writingDirectionManager.getNextLetterPosition();
      console.log('Using WritingDirectionManager position:', position);
    } else {
      // Fallback positioning - simple left-to-right flow
      position = { x: letterPosition.x, y: letterPosition.y };
      updateLetterPosition(); // Update for next letter
      console.log('Using fallback position:', position);
    }
    
    // Ensure position is within canvas bounds
    const canvasWidth = fabricCanvas.getWidth();
    const canvasHeight = fabricCanvas.getHeight();
    position.x = Math.max(10, Math.min(position.x, canvasWidth - 100));
    position.y = Math.max(10, Math.min(position.y, canvasHeight - 100));
    console.log('Final position (bounded):', position);
    
    // Check if it's a vowel to apply color coding
    const letterColor = isVowel(key) ? '#1d4ed8' : '#dc2626'; // Blue for vowels, red for consonants
    
    console.log('Rendering letter as FabricText for maximum visibility:', key);
    
    // Always use FabricText for maximum visibility and contrast
    const text = new FabricText(displayKey, {
      left: position.x,
      top: position.y,
      fontSize: 72,
      fill: letterColor,
      stroke: '#111111',
      strokeWidth: 3,
      fontFamily: 'Arial, sans-serif',
      fontWeight: 'bold',
      paintFirst: 'stroke',
      strokeUniform: true,
      shadow: new Shadow({
        color: 'rgba(0,0,0,0.35)',
        blur: 4,
        offsetX: 2,
        offsetY: 2,
      }),
      selectable: true,
      evented: true,
      hasControls: true,
      hasBorders: true,
      lockRotation: false,
      cornerStyle: 'circle',
      cornerColor: letterColor,
      borderColor: letterColor,
      cornerSize: 8,
      transparentCorners: false
    });
    
    fabricCanvas.add(text);
    fabricCanvas.bringObjectToFront(text);
    fabricCanvas.setActiveObject(text);
    fabricCanvas.requestRenderAll(); // Use requestRenderAll for better performance
    
    console.log('Letter added to canvas. Total objects:', fabricCanvas.getObjects().length);
    console.log('Text object properties:', {
      left: text.left,
      top: text.top,
      fontSize: text.fontSize,
      fill: text.fill,
      visible: text.visible,
      viewportTransform: fabricCanvas.viewportTransform
    });
    console.log('Canvas dimensions:', fabricCanvas.getWidth(), 'x', fabricCanvas.getHeight());
    
    
    toast.info(`Literă adăugată: ${displayKey}`);
  };

  // Update letter position for flow layout
  const updateLetterPosition = () => {
    setLetterPosition(prev => {
      let newX = prev.x + letterWidth + 10; // 10px spacing between letters
      let newY = prev.y;
      
      // Check if we need to wrap to next line
      if (newX + letterWidth > maxWidth) {
        newX = 20; // Reset to left margin
        newY = prev.y + lineSpacing; // Move to next line
      }
      
      return { x: newX, y: newY };
    });
  };

  const startActivity = (activityId: string) => {
    setCurrentActivity(activityId);
    setCurrentExercise(1);
    setProgress(0);
    setIsPlaying(true);
    setIsTimerRunning(true);
  };

  const completeExercise = () => {
    const newProgress = Math.min(progress + 1, 10);
    setProgress(newProgress);
    setCurrentExercise(currentExercise + 1);
    
    if (newProgress === 10) {
      toast.success("Felicitări! Ai completat toate exercițiile!");
      setTimeout(() => {
        setProgress(0);
        setCurrentExercise(1);
        setCurrentActivity(null);
      }, 2000);
    }
  };

  // Sidebar component with resizable functionality
  const renderSidebarContent = () => (
    <div className="relative bg-gradient-to-b from-background to-muted/30 flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-2">
        {/* Language Selector */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground/80 mb-1 uppercase tracking-wide">
            {t.language}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="p-1">
              <Select value={language} onValueChange={(value: LanguageKey) => setLanguage(value)}>
                <SelectTrigger 
                  className="w-full h-8 bg-green-50 border-2 border-green-400 text-green-700 font-medium rounded-md hover:bg-green-100 focus:ring-2 focus:ring-green-400 focus:ring-offset-1 text-sm px-2"
                  style={{ minWidth: `${Math.max(120, sidebarWidth - 40)}px` }}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-64 overflow-y-auto bg-white z-50">
                  {languageKeys.map((lang) => (
                    <SelectItem key={lang} value={lang} className="flex items-center gap-2">
                      <span className="text-lg">{translations[lang].flag}</span>
                      <span>{translations[lang].name}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Level Selector */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground/80 mb-1 uppercase tracking-wide">
            {t.level}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="p-1">
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger 
                  className="w-full h-8 bg-purple-50 border-2 border-purple-400 text-purple-700 font-medium rounded-md hover:bg-purple-100 focus:ring-2 focus:ring-purple-400 focus:ring-offset-1 text-sm px-2"
                  style={{ minWidth: `${Math.max(120, sidebarWidth - 40)}px` }}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  {Object.entries(t.levels).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Letter Selector */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground/80 mb-1 uppercase tracking-wide">
            {t.letterLabel}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="p-1">
              <div className="mb-2 flex items-center gap-1">
                <VerticalSelector
                  value={selectedLetter ? availableLetters.indexOf(selectedLetter) + 1 : 0}
                  min={0}
                  max={availableLetters.length}
                  onChange={(index) => {
                    if (index === 0) {
                      setSelectedLetter('');
                    } else {
                      setSelectedLetter(availableLetters[index - 1]);
                    }
                  }}
                  outlineColor={selectedLetter ? (isVowel(selectedLetter) ? '#3b82f6' : '#ef4444') : '#000000'}
                  className="flex-shrink-0 scale-90 -ml-1"
                />
                <div className="w-10 h-8 rounded border-2 bg-white flex items-center justify-center font-bold text-xl" 
                     style={{ 
                       borderColor: selectedLetter ? (isVowel(selectedLetter) ? '#3b82f6' : '#ef4444') : '#9ca3af',
                       color: selectedLetter ? (isVowel(selectedLetter) ? '#3b82f6' : '#ef4444') : '#9ca3af'
                     }}>
                  {selectedLetter || '?'}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-1 max-h-32 overflow-y-auto">
                {[null, ...availableLetters].map((letter, index) => (
                  letter === null ? (
                    <div
                      key="empty-slot"
                      className="h-7 border-2 border-gray-300 rounded-md bg-white/40"
                      title="Slot gol (poziția 0)"
                    />
                  ) : (
                    <Button
                      key={`${letter}-${index}`}
                      variant="outline"
                      className={`h-7 text-[11px] font-bold bg-white px-0 min-w-0 ${isVowel(letter) ? 'border-blue-500' : 'border-red-500'} ${selectedLetter === letter ? 'ring-2 ring-primary' : ''}`}
                      onClick={() => { setSelectedLetter(letter); handleKeyPress(letter); }}
                    >
                      {letter}
                    </Button>
                  )
                ))}
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Level 2 Wheel Editor */}
        {level === 'easy' && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-medium text-muted-foreground/80 mb-1 uppercase tracking-wide">
              {t.cubeMethod}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="p-1">
                <WheelEditor
                  sectors={wheelSectors}
                  onSectorsChange={setWheelSectors}
                  onSave={handleWheelSave}
                  onLoad={handleWheelLoad}
                  savedWheels={savedWheels}
                  translations={t}
                />
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Keyboard Toggle */}
        {level !== 'easy' && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-medium text-muted-foreground/80 mb-1 uppercase tracking-wide">
              Tastatură
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="p-1">
                <Button
                  onClick={handleKeyboardToggle}
                  variant={showKeyboard ? "default" : "outline"}
                  size="sm"
                  className={`w-full justify-start gap-2 h-8 text-sm ${
                    showKeyboard 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-background/50 hover:bg-background/80"
                  }`}
                  style={{ minWidth: `${Math.max(120, sidebarWidth - 40)}px` }}
                >
                  <Keyboard className="w-4 h-4" />
                  <span className="truncate">{showKeyboard ? "Ascunde" : "Tastatură"}</span>
                </Button>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </div>
      
      {/* Resize Handle */}
      <div 
        className="w-1 bg-border hover:bg-primary/50 cursor-col-resize transition-colors group relative"
        onMouseDown={(e) => {
          e.preventDefault();
          const startX = e.clientX;
          const startWidth = sidebarWidth;
          
          const handleMouseMove = (e: MouseEvent) => {
            const diff = e.clientX - startX;
            const newWidth = Math.max(200, Math.min(600, startWidth + diff));
            setSidebarWidth(newWidth);
          };
          
          const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
          };
          
          document.addEventListener('mousemove', handleMouseMove);
          document.addEventListener('mouseup', handleMouseUp);
        }}
      >
        <div className="absolute inset-y-0 -left-1 -right-1 bg-transparent" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-8 bg-muted-foreground/30 rounded group-hover:bg-primary/70 transition-colors" />
      </div>
    </div>
  );

  // Activity content renderer
  const renderActivityContent = () => {
    console.log('Current level:', level, 'Expected level for wheel: easy');
    
    // Show full-screen interactive canvas for Level 1 (Tabla Interactivă)
    if (level === 'beginner') {
      return (
        <div className="relative flex-1 flex flex-col h-full">
          {/* Full-screen Canvas */}
          <div className="flex-1 relative bg-white overflow-hidden">
            <canvas 
              ref={canvasRef}
              className="block z-0"
              style={{ 
                backgroundColor: '#ffffff',
                pointerEvents: 'auto',
                display: 'block'
              }}
            />
            
            {/* Floating Canvas Controls */}
            <div className="absolute top-4 right-4 flex gap-2 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-lg border z-10">
              {/* Debug Toggle */}
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setDebugMode(!debugMode)}
                className={`text-xs ${debugMode ? 'bg-red-100 text-red-700 border-red-300' : 'text-gray-600 border-gray-300'}`}
              >
                {debugMode ? 'Debug ON' : 'Debug'}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  if (fabricCanvas) {
                    fabricCanvas.clear();
                    fabricCanvas.backgroundColor = "#ffffff";
                    fabricCanvas.renderAll();
                    if (writingDirectionManager) {
                      writingDirectionManager.reset();
                    }
                    toast.success("Tabla curățată!");
                  }
                }}
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                Curăță
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  if (fabricCanvas) {
                    const objects = fabricCanvas.getObjects();
                    if (objects.length > 0) {
                      const lastObject = objects[objects.length - 1];
                      fabricCanvas.remove(lastObject);
                      fabricCanvas.renderAll();
                      toast.success("Undo realizat!");
                    }
                  }
                }}
                className="text-blue-600 border-blue-300 hover:bg-blue-50"
              >
                Undo
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  if (fabricCanvas) {
                    const dataURL = fabricCanvas.toDataURL({
                      format: 'png' as const,
                      quality: 1,
                      multiplier: 1
                    });
                    const link = document.createElement('a');
                    link.download = `tabla-interactiva-${Date.now()}.png`;
                    link.href = dataURL;
                    link.click();
                    toast.success("Tabla salvată!");
                  }
                }}
                className="text-green-600 border-green-300 hover:bg-green-50"
              >
                Salvează
              </Button>
            </div>

            {/* Toggle Keyboard Button */}
            <div className="absolute bottom-4 right-4">
              <Button 
                onClick={() => setShowKeyboard(!showKeyboard)}
                className="bg-primary hover:bg-primary/90 text-white shadow-lg"
                size="lg"
              >
                <Keyboard className="w-5 h-5 mr-2" />
                {showKeyboard ? 'Ascunde Tastatura' : 'Arată Tastatura'}
              </Button>
            </div>
          </div>
        </div>
      );
    }
    
    // Show wheel for Level 2
    if (level === 'easy') {
      return (
        <div className="flex flex-col items-center gap-6 p-6">
          <h2 className="text-2xl font-bold text-center">{t.cubeMethod}</h2>
          
          <div className="flex flex-col lg:flex-row gap-8 items-center justify-center w-full">
            <SpinningWheel
              sectors={wheelSectors}
              onResult={handleWheelResult}
              className="flex-shrink-0"
            />
            
            {currentWheelResult && (
              <Card className="p-6 max-w-md">
                <CardHeader>
                  <CardTitle className="text-center">{t.wheelResult}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center text-lg font-medium bg-muted p-4 rounded-lg">
                    {currentWheelResult}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      );
    }

    if (!currentActivity) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {activities.map((activity) => (
            <Card 
              key={activity.id}
              className={`hover:shadow-lg transition-all duration-300 cursor-pointer group border-2 ${activity.colorClass.split(' ')[1]} hover:scale-105`}
              onClick={() => startActivity(activity.id)}
            >
              <CardHeader className="text-center">
                <div className={`${activity.colorClass.split(' ')[0]} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white group-hover:scale-110 transition-transform duration-300`}>
                  <activity.icon className="w-8 h-8" />
                </div>
                <CardTitle className="text-xl mb-2">
                  {t[activity.id as keyof typeof t] as string}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center mb-4">
                  {t[`${activity.id}Desc` as keyof typeof t] as string}
                </CardDescription>
                <Button className="w-full" variant="default">
                  <Play className="w-4 h-4 mr-2" />
                  Începe Activitatea
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    // Specific activity content
    const activity = activities.find(a => a.id === currentActivity);
    if (!activity) return null;

    return (
      <div className="p-6">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl mb-2 flex items-center gap-3">
              <activity.icon className="w-8 h-8" />
              {t[currentActivity as keyof typeof t] as string} - Litera: {selectedLetter}
            </CardTitle>
            <CardDescription>
              {t.levels[level as keyof typeof t.levels]} • Exercițiul {currentExercise} din 10
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="min-h-96 bg-muted/30 rounded-lg p-8 flex flex-col items-center justify-center">
              <div className={`${activity.colorClass.split(' ')[0]} w-32 h-32 rounded-full flex items-center justify-center text-white mb-6 text-6xl font-bold`}>
                {selectedLetter}
              </div>
              
              <h3 className="text-3xl font-semibold mb-4 text-center">
                {t[currentActivity as keyof typeof t] as string}
              </h3>
              
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                Exersează litera "{selectedLetter}" prin {t[currentActivity as keyof typeof t] as string}.
                Completează exercițiile pentru a avansa.
              </p>

              {/* Interactive Exercise Area */}
              <div className="w-full max-w-2xl bg-white rounded-lg p-6 border-2 border-dashed border-gray-300 mb-6">
                <div className="text-center">
                  <div className="mb-4 flex justify-center">
                    {selectedLetter === 'A' ? (
                      <img 
                        src="/src/assets/letter-a-tracing.png"
                        alt="Letter A tracing"
                        className="w-32 h-32 object-contain"
                      />
                    ) : (
                      <div className="text-8xl font-bold text-primary">
                        {selectedLetter}
                      </div>
                    )}
                  </div>

                  {/* Written Letters Display Area */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg border-2 border-gray-200 min-h-[120px]">
                    <h4 className="text-lg font-semibold mb-3 text-gray-700">Tabla de joc:</h4>
                    <div className="flex flex-wrap gap-2 justify-center items-center">
                      {writtenLetters.length === 0 ? (
                        <span className="text-gray-400 italic">Apasă literele din tastatură pentru a scrie...</span>
                      ) : (
                        writtenLetters.map((letterObj, index) => (
                          <div key={index} className="inline-flex items-center justify-center w-16 h-16 border-2 border-gray-300 rounded-lg bg-white shadow-sm">
                            {letterObj.image ? (
                              <img 
                                src={letterObj.image} 
                                alt={letterObj.letter}
                                className="w-full h-full object-contain p-1"
                              />
                            ) : (
                              <span className="text-2xl font-bold text-primary">
                                {letterObj.letter}
                              </span>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                    <div className="mt-3 flex justify-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setWrittenLetters([])}
                        disabled={writtenLetters.length === 0}
                        className="text-red-600 border-red-300 hover:bg-red-50"
                      >
                        Șterge tot
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setWrittenLetters(prev => prev.slice(0, -1))}
                        disabled={writtenLetters.length === 0}
                        className="text-orange-600 border-orange-300 hover:bg-orange-50"
                      >
                        Șterge ultima literă
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      onClick={completeExercise}
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Corect
                    </Button>
                    <Button 
                      variant="outline"
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Încearcă din nou
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button onClick={() => setCurrentActivity(null)}>
                  Schimbă Activitatea
                </Button>
                <Button variant="outline" onClick={() => navigate('/')}>
                  Înapoi la Meniu Principal
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-white">
        <Sidebar 
          className="border-r"
          style={{ width: sidebarWidth }}
        >
          <SidebarContent>
            {renderSidebarContent()}
          </SidebarContent>
        </Sidebar>
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-background/95 backdrop-blur-sm border-b border-border/40 p-3 h-12">
            <div className="flex justify-between items-center h-full">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="hover:bg-muted h-6 w-6" />
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    <img 
                      src={numLitLogo}
                      alt="NumLit Logo" 
                      className="h-6 w-auto object-contain"
                    />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-primary">{t.title}</h2>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/')}
                  className="ml-2 h-6 px-2"
                  title="Înapoi la meniul principal"
                >
                  <Home className="w-3 h-3" />
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Info className="w-4 h-4" />
                      {t.instructions}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl bg-white z-[60]">
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
                <Badge variant="secondary" className="px-3 py-1">{t.levels[level as keyof typeof t.levels]}</Badge>
                <Timer 
                  isRunning={isTimerRunning}
                  className="scale-75 sm:scale-100"
                />
                <ZoomControls 
                  zoom={zoom} 
                  onZoomChange={setZoom}
                  className="hidden sm:flex"
                />
              </div>
            </div>
          </div>

          {/* Main Content */}
          {renderActivityContent()}
        </div>

        {/* Literacy Keyboard Overlay */}
        {showKeyboard && level === 'beginner' && (
          <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-auto max-h-64">
            <LiteracyKeyboard
              onKeyPress={handleKeyPress}
              onClose={() => setShowKeyboard(false)}
              selectedLanguage={language}
              onLanguageChange={(lang) => setLanguage(lang as LanguageKey)}
              className="border-t-4 border-primary/20 bg-white/95 backdrop-blur-sm shadow-2xl"
            />
          </div>
        )}
        
        {/* Regular Keyboard for other levels */}
        {showKeyboard && level !== 'easy' && level !== 'beginner' && (
          <LiteracyKeyboard
            onKeyPress={handleKeyPress}
            onClose={() => setShowKeyboard(false)}
            selectedLanguage={language}
            onLanguageChange={(lang) => setLanguage(lang as LanguageKey)}
          />
        )}
      </div>
    </SidebarProvider>
  );
};

export default Literatie;
