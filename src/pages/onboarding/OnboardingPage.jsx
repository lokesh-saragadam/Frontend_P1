import OnboardingHeader from "./components/OnboardingHeader.jsx";
import PlatformConnectionForm from "./components/PlatformConnectionForm.jsx";

export default function OnboardingPage(){

    return (
        <div className="ok">
            <OnboardingHeader/>
            <main>
                <PlatformConnectionForm/>
            </main>
        </div>
    )
};