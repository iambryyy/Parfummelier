"use client";
import { useAuth } from "@/app/components/auth/AuthContext";
import HowitWorkHero from "@/app/components/layout/HowItWorksHero";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import QuizPromptSection from "@/app/components/quiz/QuizPromptSection";
import Content from "@/app/components/ui/content/Content";
import SeasonalRecommendations from "@/app/components/ui/seasonalrecomendation/seasonalrecommendation";
import UserAccordRecommendation from "@/app/components/ui/useraccordrecommendation/useraccordrecommendation";
import React from "react";

export default function Main() {
  const { user } = useAuth();

  const isNewUser =
    !user?.favorite_accords || user.favorite_accords.length === 0;

  return (
    <ProtectedRoute>
      <div>
        <Content>
          <h1 className="text-4xl font-bold tracking-tight text-orange-500 sm:text-6xl mb-4">
            Welcome,{" "}
            <span className="text-orange-300">
              {user?.firstName} {user?.lastName}
            </span>
          </h1>
          <p className="text-lg leading-8 text-orange-400 font-medium italic">
            Where we make scents make sense!
          </p>
        </Content>
        <HowitWorkHero />
        {/* NOTE: Quiz prompt section */}
        {/* NOTE: Recommendation by user's accord, we need to find a way to connect */}
        {/* the user's answer to the user's context for the update product */}
        <UserAccordRecommendation />

        {/* NOTE: Recommendation by Season */}
        <SeasonalRecommendations />

        <QuizPromptSection isNewUser={isNewUser}></QuizPromptSection>
      </div>
    </ProtectedRoute>
  );
}
