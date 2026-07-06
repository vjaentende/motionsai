import "./index.css";
import { Composition } from "remotion";
import { IntroTitle } from "./components/IntroTitle";
import { SocialPromo } from "./components/SocialPromo";
import { TextReveal } from "./components/TextReveal";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="IntroTitle"
        component={IntroTitle}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="TextReveal"
        component={TextReveal}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="SocialPromo"
        component={SocialPromo}
        durationInFrames={90}
        fps={30}
        width={1080}
        height={1080}
      />
    </>
  );
};
