import React from 'react';
import Svg, {
  Circle,
  Defs,
  G,
  LinearGradient,
  Path,
  Polygon,
  Stop,
} from 'react-native-svg';

interface SerpentiClaspGraphicProps {
  size?: number;
}

/**
 * Custom vector emblem of the Bvlgari Serpenti snakehead clasp:
 * hexagonal malachite/emerald enamel scales framed in brushed champagne gold.
 */
export const SerpentiClaspGraphic: React.FC<SerpentiClaspGraphicProps> = ({
  size = 156,
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 200 200">
      <Defs>
        <LinearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#E6C987" />
          <Stop offset="50%" stopColor="#C5A059" />
          <Stop offset="100%" stopColor="#8F6E31" />
        </LinearGradient>
        <LinearGradient id="emeraldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#125537" />
          <Stop offset="55%" stopColor="#0A3622" />
          <Stop offset="100%" stopColor="#051E13" />
        </LinearGradient>
        <LinearGradient id="obsidianGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#262626" />
          <Stop offset="100%" stopColor="#101010" />
        </LinearGradient>
      </Defs>

      {/* Outer gold bezel ring */}
      <Circle
        cx="100"
        cy="100"
        r="90"
        fill="url(#obsidianGrad)"
        stroke="url(#goldGrad)"
        strokeWidth="2.5"
      />
      <Circle
        cx="100"
        cy="100"
        r="82"
        fill="none"
        stroke="#C5A059"
        strokeOpacity="0.35"
        strokeWidth="1"
        strokeDasharray="3 4"
      />

      {/* Serpenti Head Silhouette */}
      <G>
        {/* Outer gold frame of snakehead */}
        <Path
          d="M100 32 L144 58 L152 104 L126 154 L100 172 L74 154 L48 104 L56 58 Z"
          fill="url(#goldGrad)"
        />
        {/* Inner deep emerald enamel shield */}
        <Path
          d="M100 38 L138 61 L145 103 L122 148 L100 164 L78 148 L55 103 L62 61 Z"
          fill="url(#emeraldGrad)"
        />

        {/* Top crown hexagonal scale */}
        <Polygon
          points="100,46 116,56 116,74 100,84 84,74 84,56"
          fill="#0F472D"
          stroke="url(#goldGrad)"
          strokeWidth="2"
        />

        {/* Left & Right upper scales */}
        <Polygon
          points="66,68 82,60 82,82 68,92 58,82"
          fill="#141414"
          stroke="url(#goldGrad)"
          strokeWidth="1.8"
        />
        <Polygon
          points="134,68 118,60 118,82 132,92 142,82"
          fill="#141414"
          stroke="url(#goldGrad)"
          strokeWidth="1.8"
        />

        {/* Center geometric bridge scale */}
        <Polygon
          points="100,87 118,98 114,122 100,132 86,122 82,98"
          fill="#082B1B"
          stroke="url(#goldGrad)"
          strokeWidth="2"
        />

        {/* Hypnotic Malachite / Gold Eyes */}
        <Path
          d="M64 103 L82 96 L84 109 L69 114 Z"
          fill="url(#goldGrad)"
        />
        <Path
          d="M136 103 L118 96 L116 109 L131 114 Z"
          fill="url(#goldGrad)"
        />
        <Circle cx="75" cy="105" r="2.6" fill="#062416" />
        <Circle cx="125" cy="105" r="2.6" fill="#062416" />

        {/* Lower nose & clasp pendant */}
        <Polygon
          points="100,136 112,144 100,158 88,144"
          fill="url(#goldGrad)"
        />
        <Circle cx="100" cy="146" r="2.4" fill="#0A3622" />
      </G>
    </Svg>
  );
};
