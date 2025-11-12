import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Timer, Trophy } from "lucide-react";

interface TimeQuizGameProps {
  lang: string;
}

type Question = {
  question: { ro: string; en: string };
  options: string[];
  correctAnswer: number;
};

const quizQuestions: Question[] = [
  {
    question: { ro: 'Câte ore sunt într-o zi?', en: 'How many hours are in a day?' },
    options: ['12', '24', '48'],
    correctAnswer: 1
  },
  {
    question: { ro: 'Câte minute sunt într-o oră?', en: 'How many minutes are in an hour?' },
    options: ['30', '60', '100'],
    correctAnswer: 1
  },
  {
    question: { ro: 'Ce înseamnă PM?', en: 'What does PM mean?' },
    options: ['Dimineața', 'După-amiază', 'Noapte'],
    correctAnswer: 1
  },
  {
    question: { ro: '15:00 în format 12h este?', en: '15:00 in 12h format is?' },
    options: ['3:00 PM', '5:00 PM', '3:00 AM'],
    correctAnswer: 0
  },
  {
    question: { ro: 'Câte secunde sunt într-un minut?', en: 'How many seconds in a minute?' },
    options: ['30', '60', '120'],
    correctAnswer: 1
  },
  {
    question: { ro: 'Care mână de ceas se mișcă mai repede?', en: 'Which clock hand moves faster?' },
    options: ['Ora', 'Minutul', 'Secunda'],
    correctAnswer: 2
  },
  {
    question: { ro: 'Ce oră vine după 11:59?', en: 'What time comes after 11:59?' },
    options: ['12:00', '12:60', '13:00'],
    correctAnswer: 0
  },
  {
    question: { ro: 'Câte ore sunt de la 08:00 la 12:00?', en: 'How many hours from 08:00 to 12:00?' },
    options: ['2', '4', '6'],
    correctAnswer: 1
  },
  {
    question: { ro: 'Miezul nopții este la ora?', en: 'Midnight is at?' },
    options: ['00:00', '12:00 PM', '24:00 PM'],
    correctAnswer: 0
  },
  {
    question: { ro: 'Un sfert de oră înseamnă?', en: 'A quarter of an hour means?' },
    options: ['10 minute', '15 minute', '30 minute'],
    correctAnswer: 1
  }
];

export default function TimeQuizGame({ lang }: TimeQuizGameProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isFinished, setIsFinished] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  useEffect(() => {
    if (timeLeft > 0 && !isFinished && selectedAnswer === null) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && selectedAnswer === null) {
      handleAnswer(-1);
    }
  }, [timeLeft, isFinished, selectedAnswer]);

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    
    const isCorrect = answerIndex === quizQuestions[currentQuestion].correctAnswer;
    
    if (isCorrect) {
      setScore(score + 1);
      toast.success(lang === 'ro' ? 'Corect! ✓' : 'Correct! ✓');
    } else {
      toast.error(lang === 'ro' ? 'Greșit!' : 'Wrong!');
    }

    setTimeout(() => {
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setTimeLeft(15);
        setSelectedAnswer(null);
      } else {
        setIsFinished(true);
      }
    }, 1500);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setTimeLeft(15);
    setIsFinished(false);
    setSelectedAnswer(null);
  };

  if (isFinished) {
    const percentage = (score / quizQuestions.length) * 100;
    
    return (
      <Card className="p-6">
        <div className="text-center">
          <Trophy className="h-16 w-16 mx-auto mb-4 text-yellow-500" />
          <h3 className="text-2xl font-bold mb-2">
            {lang === 'ro' ? 'Quiz Finalizat!' : 'Quiz Completed!'}
          </h3>
          <p className="text-4xl font-bold text-primary mb-4">
            {score} / {quizQuestions.length}
          </p>
          <p className="text-lg text-muted-foreground mb-6">
            {percentage >= 80 
              ? (lang === 'ro' ? 'Excelent!' : 'Excellent!')
              : percentage >= 60
              ? (lang === 'ro' ? 'Bine!' : 'Good!')
              : (lang === 'ro' ? 'Mai exersează!' : 'Keep practicing!')}
          </p>
          <Button onClick={resetQuiz} className="w-full">
            {lang === 'ro' ? 'Joacă Din Nou' : 'Play Again'}
          </Button>
        </div>
      </Card>
    );
  }

  const question = quizQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  return (
    <Card className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">
            {lang === 'ro' ? 'Întrebarea' : 'Question'} {currentQuestion + 1}/{quizQuestions.length}
          </span>
          <div className="flex items-center gap-2">
            <Timer className="h-4 w-4" />
            <span className={`text-lg font-bold ${timeLeft <= 5 ? 'text-red-500' : ''}`}>
              {timeLeft}s
            </span>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="bg-blue-50 p-6 rounded-lg mb-6">
        <p className="text-xl font-bold text-center">
          {question.question[lang as 'ro' | 'en'] || question.question.ro}
        </p>
      </div>

      <div className="space-y-3">
        {question.options.map((option, index) => {
          let buttonVariant: "outline" | "default" | "secondary" = "outline";
          
          if (selectedAnswer !== null) {
            if (index === question.correctAnswer) {
              buttonVariant = "default";
            } else if (index === selectedAnswer) {
              buttonVariant = "secondary";
            }
          }

          return (
            <Button
              key={index}
              variant={buttonVariant}
              className="w-full h-16 text-lg"
              onClick={() => handleAnswer(index)}
              disabled={selectedAnswer !== null}
            >
              {option}
            </Button>
          );
        })}
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          {lang === 'ro' ? 'Scor curent' : 'Current score'}: <span className="font-bold text-primary">{score}</span>
        </p>
      </div>
    </Card>
  );
}
