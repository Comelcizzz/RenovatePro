"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Animated background particles */}
      <div className="particles">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${Math.random() * 20 + 10}s`,
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center animated-bg">
        <div className="absolute inset-0 bg-black/20" />

        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            {/* Main title with typewriter effect */}
            <div className="mb-8">
              <h1 className="text-6xl md:text-8xl font-black text-white mb-4 leading-tight">
                Transform Your
                <span className="block gradient-text-accent typewriter">
                  Space
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
                Professional renovation and design services that bring your
                wildest dreams to life with cutting-edge technology and
                unmatched creativity
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-16">
              <Link href="/services" className="btn-primary group">
                <span className="relative z-10">Explore Services</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>

              <Link href="/register" className="btn-glass group">
                <span className="relative z-10">Get Started Free</span>
                <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            </div>

            {/* Floating stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="glass rounded-2xl p-6"
                  style={{ animationDelay: `${index * 0.5}s` }}
                >
                  <div className="text-3xl font-bold gradient-text-accent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-white/70 text-sm font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-transparent" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Why Choose
              <span className="gradient-text"> Our Magic?</span>
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Experience the future of renovation with our revolutionary
              approach that combines artistry, technology, and pure excellence
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="group relative">
                <div className="glass-dark rounded-3xl p-8 card-hover pulse-glow h-full">
                  {/* Icon container */}
                  <div className="w-16 h-16 mx-auto mb-6 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl blur-lg opacity-60" />
                    <div className="relative z-10 w-full h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-2xl font-bold text-white">
                      {feature.icon}
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-4 text-center">
                    {feature.title}
                  </h3>

                  <p className="text-white/70 text-center leading-relaxed mb-6">
                    {feature.description}
                  </p>

                  {/* Progress bar animation */}
                  <div className="w-full bg-white/10 rounded-full h-2 mb-4 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${feature.progress}%`,
                        transform: "translateX(-100%)",
                        animation: `slideIn 2s ease-out ${index * 0.3}s forwards`,
                      }}
                    />
                  </div>

                  <div className="text-center text-white/80 font-semibold">
                    {feature.progress}% Success Rate
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative">
        <div className="container mx-auto px-4">
          <div className="glass rounded-3xl p-12 md:p-20 text-center max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
              Ready to Create
              <span className="gradient-text-accent"> Magic?</span>
            </h2>

            <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto">
              Join thousands of satisfied clients who have transformed their
              spaces with our extraordinary services
            </p>

            <div className="flex flex-col md:flex-row gap-6 justify-center">
              <Link href="/register" className="btn-primary group">
                Start Your Journey
                <span className="ml-2 group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </Link>

              <Link href="/services" className="btn-glass">
                View Portfolio
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes slideIn {
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </main>
  );
}

const stats = [
  { value: "500+", label: "Projects Completed" },
  { value: "99%", label: "Client Satisfaction" },
  { value: "50+", label: "Expert Team" },
  { value: "24/7", label: "Support Available" },
];

const features = [
  {
    icon: "✨",
    title: "Expert Artisans",
    description:
      "Our master craftsmen bring decades of experience and passion to every project, ensuring perfection in every detail.",
    progress: 98,
  },
  {
    icon: "💎",
    title: "Premium Materials",
    description:
      "We source only the finest materials from around the world, guaranteeing durability and luxury that lasts generations.",
    progress: 95,
  },
  {
    icon: "🎯",
    title: "Guaranteed Excellence",
    description:
      "Your satisfaction is our obsession. We deliver results that exceed expectations, every single time.",
    progress: 100,
  },
];
