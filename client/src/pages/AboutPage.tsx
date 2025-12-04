// src/pages/AboutPage.tsx
export default function AboutPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-8 text-4xl font-bold">About</h1>
      
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="max-w-2xl text-center">
          <h2 className="mb-6 text-5xl font-bold text-primary">၊၊||၊Gosu</h2>
          <p className="text-lg text-muted-foreground">
            Gosu is a live streaming platform connecting content creators with viewers 
            across gaming, health, education, and social categories.
          </p>
        </div>
      </div>
    </div>
  );
}