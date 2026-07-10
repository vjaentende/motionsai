import React from 'react';
import {Composition} from 'remotion';
import {SolLaunch} from './SolLaunch';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="GPTSolLaunch"
      component={SolLaunch}
      durationInFrames={1110}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{
        modelName: 'GPT-5.6 SOL',
        tagline: 'Piensa a la velocidad de la luz',
      }}
    />
  );
};
