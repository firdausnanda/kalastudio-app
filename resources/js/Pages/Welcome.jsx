import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import Hero from '@/Components/Hero';
import Features from '@/Components/Features';
import DetailedFeatures from '@/Components/DetailedFeatures';
import IndustryUseCases from '@/Components/IndustryUseCases';
import Testimonials from '@/Components/Testimonials';
import BottomCTA from '@/Components/BottomCTA';

export default function Welcome() {

    return (
        <div className="bg-white text-slate-900 font-display transition-colors duration-300 dark:bg-slate-900">
            <Header />
            <main>
                <Hero />
                <Features />
                <DetailedFeatures />
                <IndustryUseCases />
                <Testimonials />
                <BottomCTA />
            </main>
            <Footer />
        </div>
    );
}
