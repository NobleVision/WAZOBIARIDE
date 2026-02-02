/**
 * WaZoBiaRide Home Page
 * Design: Nigeria Unity Theme
 * Colors: Nigeria Green (#008751), White (#FFFFFF), Accent Gold (#FFD700)
 * Typography: Playfair Display (display), DM Sans (body), Space Grotesk (accent)
 */

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { VideoBackground } from "@/components/shared/VideoBackground";
import MediaControls from "@/components/shared/MediaControls";
import { useBackgroundAudio } from "@/components/shared/useBackgroundAudio";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Car,
  CheckCircle,
  ChevronDown,
  Clock,
  CreditCard,
  Download,
  MapPin,
  Menu,
  Phone,
  Shield,
  Smartphone,
  Star,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

// Counter animation hook
function useCountUp(end: number, duration: number = 2000, startOnView: boolean = true) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!startOnView) {
      setHasStarted(true);
    }
  }, [startOnView]);

  useEffect(() => {
    if (!hasStarted) return;
    
    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [end, duration, hasStarted]);

  useEffect(() => {
    if (!startOnView || !ref.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.5 }
    );
    
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [startOnView, hasStarted]);

  return { count, ref };
}

// Navigation Component Props
interface NavigationProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onSkipTrack: () => void;
}

// Navigation Component
function Navigation({ isPlaying, onTogglePlay, onSkipTrack }: NavigationProps) {
  const [, setLocation] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-nigeria-green flex items-center justify-center">
              <Car className="w-5 h-5 text-white" />
            </div>
            <span
              className={`font-display text-2xl font-bold ${
                isScrolled ? "text-foreground" : "text-white"
              }`}
            >
              WaZoBiaRide
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {["Ride", "Drive", "Safety", "About"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className={`font-body font-medium transition-colors hover:text-terracotta ${
                  isScrolled ? "text-foreground" : "text-white"
                }`}
              >
                {item}
              </a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Button
              variant="ghost"
              className={`font-body ${
                isScrolled ? "text-foreground" : "text-white hover:bg-white/10"
              }`}
              onClick={() => setLocation("/login")}
            >
              Sign In
            </Button>
            <Button className="bg-nigeria-green hover:bg-nigeria-green/90 text-white font-body">
              Download App
            </Button>
            
            {/* Media Controls */}
            <MediaControls
              isPlaying={isPlaying}
              onTogglePlay={onTogglePlay}
              onSkipTrack={onSkipTrack}
            />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className={isScrolled ? "text-foreground" : "text-white"} />
            ) : (
              <Menu className={isScrolled ? "text-foreground" : "text-white"} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden mt-4 pb-4 border-t border-white/20"
          >
            <div className="flex flex-col gap-4 pt-4">
              {["Ride", "Drive", "Safety", "About"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className={`font-body font-medium ${
                    isScrolled ? "text-foreground" : "text-white"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <Button
                variant="ghost"
                className={`font-body w-full ${
                  isScrolled ? "text-foreground" : "text-white hover:bg-white/10"
                }`}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setLocation("/login");
                }}
              >
                Sign In
              </Button>
              <Button className="bg-nigeria-green hover:bg-nigeria-green/90 text-white font-body w-full">
                Download App
              </Button>

              {/* Mobile Media Controls */}
              <div className="flex justify-center pt-2">
                <MediaControls
                  isPlaying={isPlaying}
                  onTogglePlay={onTogglePlay}
                  onSkipTrack={onSkipTrack}
                  compact={true}
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}

// Hero Section
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <VideoBackground
        showGradient={true}
        showAdirePattern={true}
        overlayOpacity={0.7}
        fallbackImage="/images/hero-lagos-ride.png"
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-24">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-3xl"
        >
          <motion.div variants={fadeInUp} className="mb-4">
            <span className="inline-block px-4 py-2 bg-gold/20 backdrop-blur-sm rounded-full text-gold font-accent text-sm font-medium">
              Nigeria's Own Ride-Sharing Platform
            </span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="font-display text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
          >
            Move With
            <span className="block text-gold">Pride & Purpose</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="font-body text-xl text-white/90 mb-8 max-w-xl"
          >
            Safe, affordable rides across Lagos, Ibadan, and South West Nigeria.
            Built by Nigerians, for Nigerians. Your journey, your way.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button
              size="lg"
              className="bg-nigeria-green hover:bg-nigeria-green/90 text-white font-body text-lg px-8 py-6 animate-pulse-glow"
            >
              <Download className="mr-2 h-5 w-5" />
              Download App
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 font-body text-lg px-8 py-6"
            >
              Become a Driver
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            variants={fadeInUp}
            className="mt-12 flex flex-wrap items-center gap-6"
          >
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-nigeria-green border-2 border-white"
                  />
                ))}
              </div>
              <span className="text-white font-body">
                <strong className="font-accent">500K+</strong> Happy Riders
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-gold fill-gold" />
              <span className="text-white font-body">
                <strong className="font-accent">4.8</strong> App Rating
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ChevronDown className="w-8 h-8 text-white/70" />
        </motion.div>
      </motion.div>
    </section>
  );
}

// Stats Section
function StatsSection() {
  const stats = [
    { value: 500, suffix: "K+", label: "Active Riders", icon: Users },
    { value: 50, suffix: "K+", label: "Verified Drivers", icon: Car },
    { value: 10, suffix: "M+", label: "Rides Completed", icon: MapPin },
    { value: 99, suffix: "%", label: "Safe Arrivals", icon: Shield },
  ];

  return (
    <section className="py-16 bg-indigo relative overflow-hidden">
      <div className="absolute inset-0 adire-pattern opacity-10" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const { count, ref } = useCountUp(stat.value);
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                ref={ref}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <Icon className="w-8 h-8 text-amber mx-auto mb-3" />
                <div className="font-accent text-4xl md:text-5xl font-bold text-white mb-2">
                  {count}
                  {stat.suffix}
                </div>
                <div className="font-body text-white/70">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Services Section
function ServicesSection() {
  const services = [
    {
      icon: Car,
      title: "WaZoBiaRide Car",
      description:
        "Comfortable sedan rides for your daily commute. Air-conditioned, clean vehicles with professional drivers.",
      price: "From ₦500",
      color: "bg-nigeria-green",
    },
    {
      icon: Zap,
      title: "WaZoBiaRide Okada",
      description:
        "Beat the Lagos traffic with our motorcycle option. Fast, affordable, and perfect for short trips.",
      price: "From ₦200",
      color: "bg-forest",
    },
    {
      icon: Users,
      title: "WaZoBiaRide Share",
      description:
        "Share your ride, split the cost. Meet fellow commuters on similar routes and save money together.",
      price: "Save 40%",
      color: "bg-gold",
    },
  ];

  return (
    <section id="ride" className="py-24 bg-cream relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.span
            variants={fadeInUp}
            className="inline-block px-4 py-2 bg-terracotta/10 rounded-full text-terracotta font-accent text-sm font-medium mb-4"
          >
            Our Services
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4"
          >
            Choose Your Ride
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="font-body text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            From quick okada trips to comfortable car rides, we have the perfect
            option for every journey across South West Nigeria.
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
              >
                <Card className="h-full border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden group">
                  <CardContent className="p-8">
                    <div
                      className={`w-16 h-16 ${service.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-display text-2xl font-bold text-foreground mb-3">
                      {service.title}
                    </h3>
                    <p className="font-body text-muted-foreground mb-4">
                      {service.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-accent text-lg font-bold text-nigeria-green">
                        {service.price}
                      </span>
                      <Button
                        variant="ghost"
                        className="text-nigeria-green hover:text-nigeria-green/80 hover:bg-nigeria-green/10"
                      >
                        Learn More
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// How It Works Section
function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      title: "Download the App",
      description:
        "Get WaZoBiaRide from Google Play or App Store. Sign up with your phone number in seconds.",
      icon: Smartphone,
    },
    {
      step: "02",
      title: "Set Your Destination",
      description:
        "Enter where you're going. See fare estimates upfront with our transparent pricing.",
      icon: MapPin,
    },
    {
      step: "03",
      title: "Match with a Driver",
      description:
        "Get matched with a verified driver nearby. Track their arrival in real-time.",
      icon: Users,
    },
    {
      step: "04",
      title: "Enjoy Your Ride",
      description:
        "Pay easily with cash, card, or mobile money. Rate your experience and go!",
      icon: CheckCircle,
    },
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-5">
        <div className="adire-pattern w-full h-full" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="/images/app-mockup-scene.png"
                alt="WaZoBiaRide App in action"
                className="w-full h-auto"
              />
            </div>
            {/* Floating Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-4 animate-float"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-forest rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-accent text-sm text-muted-foreground">
                    Driver Arriving
                  </div>
                  <div className="font-body font-bold text-foreground">
                    2 mins away
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Steps */}
          <div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.span
                variants={fadeInUp}
                className="inline-block px-4 py-2 bg-forest/10 rounded-full text-forest font-accent text-sm font-medium mb-4"
              >
                How It Works
              </motion.span>
              <motion.h2
                variants={fadeInUp}
                className="font-display text-4xl md:text-5xl font-bold text-foreground mb-8"
              >
                Your Ride in
                <span className="text-nigeria-green"> 4 Simple Steps</span>
              </motion.h2>

              <div className="space-y-6">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <motion.div
                      key={index}
                      variants={fadeInUp}
                      className="flex gap-4 group"
                    >
                      <div className="flex-shrink-0">
                      <div className="w-14 h-14 rounded-2xl bg-nigeria-green/10 flex items-center justify-center group-hover:bg-nigeria-green transition-colors">
                        <Icon className="w-6 h-6 text-nigeria-green group-hover:text-white transition-colors" />
                        </div>
                      </div>
                      <div>
                        <div className="font-accent text-sm text-nigeria-green mb-1">
                          Step {step.step}
                        </div>
                        <h3 className="font-display text-xl font-bold text-foreground mb-2">
                          {step.title}
                        </h3>
                        <p className="font-body text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Safety Section
function SafetySection() {
  const features = [
    {
      icon: Shield,
      title: "Verified Drivers",
      description:
        "Every driver undergoes thorough background checks and vehicle inspections.",
    },
    {
      icon: Phone,
      title: "24/7 SOS Support",
      description:
        "One-tap emergency button connects you directly to our safety team and local authorities.",
    },
    {
      icon: MapPin,
      title: "Real-Time Tracking",
      description:
        "Share your trip with loved ones. They can track your journey in real-time.",
    },
    {
      icon: Users,
      title: "Women-Only Rides",
      description:
        "Female riders can request female drivers for added comfort and security.",
    },
  ];

  return (
    <section
      id="safety"
      className="py-24 bg-indigo relative overflow-hidden diagonal-top"
    >
      <div className="absolute inset-0 adire-pattern opacity-10" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.span
              variants={fadeInUp}
              className="inline-block px-4 py-2 bg-amber/20 rounded-full text-amber font-accent text-sm font-medium mb-4"
            >
              Your Safety First
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="font-display text-4xl md:text-5xl font-bold text-white mb-6"
            >
              Ride With
              <span className="text-gold"> Confidence</span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="font-body text-lg text-white/80 mb-8"
            >
              Your safety is our top priority. We've built multiple layers of
              protection into every ride, so you can focus on getting where you
              need to go.
            </motion.p>

            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 hover:bg-white/15 transition-colors"
                  >
                      <Icon className="w-8 h-8 text-gold mb-3" />
                <Icon className="w-8 h-8 text-gold mb-3" />
                    <h3 className="font-display text-lg font-bold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="font-body text-sm text-white/70">
                      {feature.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Right: Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="/images/happy-rider.png"
                alt="Happy WaZoBiaRide passenger"
                className="w-full h-auto"
              />
            </div>
            {/* Safety Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="absolute -top-6 -left-6 bg-white rounded-2xl shadow-xl p-4 animate-float"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-forest rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-body font-bold text-foreground">
                    Trip Protected
                  </div>
                  <div className="font-accent text-sm text-forest">
                    Insurance Active
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Driver Section
function DriverSection() {
  const benefits = [
    { icon: CreditCard, text: "Earn up to ₦300,000/month" },
    { icon: Clock, text: "Flexible hours - you're the boss" },
    { icon: Zap, text: "Weekly payouts to your account" },
    { icon: Users, text: "Join 50,000+ driver community" },
  ];

  return (
    <section id="drive" className="py-24 bg-cream relative">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="/images/driver-proud.png"
                alt="Proud WaZoBiaRide driver"
                className="w-full h-auto"
              />
            </div>
            {/* Earnings Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-5 animate-float"
            >
              <div className="text-center">
                <div className="font-accent text-sm text-muted-foreground mb-1">
                  This Week's Earnings
                </div>
                <div className="font-display text-3xl font-bold text-forest">
                  ₦75,400
                </div>
                <div className="flex items-center justify-center gap-1 text-forest mt-1">
                  <ArrowRight className="w-4 h-4 rotate-[-45deg]" />
                  <span className="font-accent text-sm">+12% vs last week</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="order-1 lg:order-2"
          >
            <motion.span
              variants={fadeInUp}
              className="inline-block px-4 py-2 bg-forest/10 rounded-full text-forest font-accent text-sm font-medium mb-4"
            >
              Drive With Us
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6"
            >
              Turn Your Car Into
              <span className="text-nigeria-green"> Income</span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="font-body text-lg text-muted-foreground mb-8"
            >
              Join thousands of Nigerians earning a living on their own terms.
              Whether you drive full-time or part-time, WaZoBiaRide gives you the
              freedom to be your own boss.
            </motion.p>

            <motion.div variants={fadeInUp} className="space-y-4 mb-8">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-nigeria-green/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-nigeria-green" />
                    </div>
                    <span className="font-body text-foreground">
                      {benefit.text}
                    </span>
                  </div>
                );
              })}
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Button
                size="lg"
                className="bg-nigeria-green hover:bg-nigeria-green/90 text-white font-body text-lg px-8"
              >
                Start Driving Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Testimonials Section
function TestimonialsSection() {
  const testimonials = [
    {
      name: "Adaeze Okonkwo",
      role: "Business Owner, Lagos",
      image: "/images/happy-rider.png",
      quote:
        "WaZoBiaRide has transformed my daily commute. The drivers are professional, the cars are clean, and I always feel safe. It's truly made for us Nigerians!",
      rating: 5,
    },
    {
      name: "Emeka Nwosu",
      role: "WaZoBiaRide Driver, Ibadan",
      image: "/images/driver-proud.png",
      quote:
        "I've been driving with WaZoBiaRide for 8 months now. The earnings are consistent, and the support team treats us like family. Best decision I ever made.",
      rating: 5,
    },
    {
      name: "Funke Adeleke",
      role: "University Student, Lagos",
      image: "/images/happy-rider.png",
      quote:
        "As a student, I love the affordable okada option. It gets me to class on time even in Lagos traffic. The women-only ride feature is a game-changer!",
      rating: 5,
    },
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.span
            variants={fadeInUp}
            className="inline-block px-4 py-2 bg-amber/10 rounded-full text-amber font-accent text-sm font-medium mb-4"
          >
            Testimonials
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4"
          >
            What Our Community Says
          </motion.h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
            >
              <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-amber fill-amber"
                      />
                    ))}
                  </div>

                  <p className="font-body text-muted-foreground mb-6 italic">
                    "{testimonial.quote}"
                  </p>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-display font-bold text-foreground">
                        {testimonial.name}
                      </div>
                      <div className="font-accent text-sm text-muted-foreground">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// CTA Section
function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/lagos-skyline.png')" }}
      />
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute inset-0 adire-pattern opacity-20" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center max-w-3xl mx-auto"
        >
          <motion.h2
            variants={fadeInUp}
            className="font-display text-4xl md:text-6xl font-bold text-white mb-6"
          >
            Ready to
              <span className="text-gold"> Move?</span>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="font-body text-xl text-white/90 mb-10"
          >
            Download WaZoBiaRide today and experience the future of Nigerian
            transportation. Your first ride is on us!
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            {/* App Store Buttons */}
            <Button
              size="lg"
              className="bg-white text-foreground hover:bg-white/90 font-body text-lg px-8 py-6"
            >
              <svg
                className="w-6 h-6 mr-2"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              App Store
            </Button>
            <Button
              size="lg"
              className="bg-white text-foreground hover:bg-white/90 font-body text-lg px-8 py-6"
            >
              <svg
                className="w-6 h-6 mr-2"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z" />
              </svg>
              Google Play
            </Button>
          </motion.div>

          <motion.p
            variants={fadeInUp}
            className="font-accent text-sm text-white/60 mt-6"
          >
            Use code <span className="text-gold font-bold">NAIJA2024</span> for
            ₦500 off your first ride
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  return (
    <footer id="about" className="bg-indigo text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-nigeria-green flex items-center justify-center">
                <Car className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-2xl font-bold">WaZoBiaRide</span>
            </div>
            <p className="font-body text-white/70 mb-6">
              Nigeria's leading ride-sharing platform. Safe, affordable, and
              proudly Nigerian.
            </p>
            <div className="flex gap-4">
              {["facebook", "twitter", "instagram", "linkedin"].map(
                (social) => (
                  <a
                    key={social}
                    href="#"
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-nigeria-green transition-colors"
                  >
                    <span className="sr-only">{social}</span>
                    <div className="w-5 h-5 bg-white/80 rounded-sm" />
                  </a>
                )
              )}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display font-bold text-lg mb-4">Company</h4>
            <ul className="space-y-3">
              {["About Us", "Careers", "Press", "Blog"].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="font-body text-white/70 hover:text-amber transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-lg mb-4">Products</h4>
            <ul className="space-y-3">
              {["Ride", "Drive", "Business", "Delivery"].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="font-body text-white/70 hover:text-amber transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-lg mb-4">Support</h4>
            <ul className="space-y-3">
              {["Help Center", "Safety", "Terms", "Privacy"].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="font-body text-white/70 hover:text-amber transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body text-white/60 text-sm">
            © 2024 WaZoBiaRide Technologies Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="font-body text-white/60 text-sm">
              Proudly serving
            </span>
            <span className="font-accent text-amber">
              Lagos • Ibadan • Abeokuta • Osogbo
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Main Home Component
export default function Home() {
  // Initialize background audio
  const { isPlaying, togglePlay, skipToNextTrack } = useBackgroundAudio({
    enabled: true,
    volume: 0.1,
  });

  return (
    <div className="min-h-screen">
      <Navigation
        isPlaying={isPlaying}
        onTogglePlay={togglePlay}
        onSkipTrack={skipToNextTrack}
      />
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <HowItWorksSection />
      <SafetySection />
      <DriverSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
}
