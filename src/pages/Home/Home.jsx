
import PublicHeader from "../../components/headers/PublicHeader.jsx";
import Hero from "./components/Hero.jsx";
import LandingStats from "./components/LandingStats.jsx";
import Features from "./components/Features.jsx";
import "./HomePage.css";

export default function Home(){
    return (
        <div className="home-page">
            <PublicHeader />
            <main>
              <Hero />
              <LandingStats />
              <Features />
            </main>
          </div>
    )
}