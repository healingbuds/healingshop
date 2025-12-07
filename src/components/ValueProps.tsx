import ScrollAnimation from "@/components/ScrollAnimation";
import { Sprout, Users, FlaskConical } from "lucide-react";

const values = [
  {
    icon: Sprout,
    title: "Superior Quality",
    description: "Every stage from cultivation through extraction to final production is meticulously managed with unwavering attention to detail. Our EU GMP-certified products meet the highest international standards, earning trust across borders.",
  },
  {
    icon: Users,
    title: "Expanding Access",
    description: "Our mission is to ensure medical cannabis reaches those who need it most. Through evidence-based advocacy and education, we are reducing barriers, challenging misconceptions, and creating pathways to safe, legal access.",
  },
  {
    icon: FlaskConical,
    title: "Research-Driven Innovation",
    description: "Collaborating with world-class research institutions including Imperial College London and University of Pennsylvania, we advance scientific knowledge of cannabis therapeutics. Research excellence is the foundation of everything we pursue.",
  },
];

const ValueProps = () => {
  return (
    <div className="px-2">
      <section 
        className="py-16 sm:py-20 md:py-24 rounded-2xl sm:rounded-3xl relative overflow-hidden"
        style={{ backgroundColor: 'hsl(var(--section-color))' }}
      >
        {/* Cannabis plant silhouette - top left */}
        <div className="absolute top-8 left-4 sm:left-8 opacity-[0.06] pointer-events-none">
          <svg width="200" height="280" viewBox="0 0 200 280" fill="none">
            <g className="text-white">
              {/* Realistic cannabis plant with buds - line art style */}
              {/* Main stem */}
              <path d="M100 280 Q98 240 100 200 Q102 160 100 120" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.7"/>
              
              {/* Top cola/bud cluster */}
              <ellipse cx="100" cy="85" rx="18" ry="35" fill="currentColor" opacity="0.15"/>
              <path d="M100 50 Q95 65 85 80 M100 50 Q105 65 115 80" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.5"/>
              <path d="M100 55 Q92 70 82 85 M100 55 Q108 70 118 85" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.4"/>
              <path d="M100 60 Q97 72 93 82 M100 60 Q103 72 107 82" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.3"/>
              
              {/* Top fan leaf - 7 fingers */}
              <path d="M100 120 Q85 105 70 75 Q75 100 100 120" fill="currentColor" opacity="0.25"/>
              <path d="M100 120 Q80 100 55 85 Q70 105 100 120" fill="currentColor" opacity="0.2"/>
              <path d="M100 120 Q75 110 50 100 Q70 115 100 120" fill="currentColor" opacity="0.15"/>
              <path d="M100 120 Q115 105 130 75 Q125 100 100 120" fill="currentColor" opacity="0.25"/>
              <path d="M100 120 Q120 100 145 85 Q130 105 100 120" fill="currentColor" opacity="0.2"/>
              <path d="M100 120 Q125 110 150 100 Q130 115 100 120" fill="currentColor" opacity="0.15"/>
              <path d="M100 120 Q100 100 100 70 Q100 95 100 120" fill="currentColor" opacity="0.3"/>
              
              {/* Side branch with bud - left */}
              <path d="M100 160 Q80 155 60 165" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.5"/>
              <ellipse cx="50" cy="155" rx="12" ry="22" fill="currentColor" opacity="0.12" transform="rotate(-15 50 155)"/>
              
              {/* Side branch with bud - right */}
              <path d="M100 180 Q125 175 150 180" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.5"/>
              <ellipse cx="160" cy="172" rx="10" ry="18" fill="currentColor" opacity="0.1" transform="rotate(10 160 172)"/>
              
              {/* Lower fan leaves */}
              <path d="M100 200 Q70 195 45 180 Q65 200 100 200" fill="currentColor" opacity="0.12"/>
              <path d="M100 200 Q130 195 155 180 Q135 200 100 200" fill="currentColor" opacity="0.12"/>
              
              {/* Small lower leaves */}
              <path d="M100 240 Q85 235 75 225 Q88 238 100 240" fill="currentColor" opacity="0.08"/>
              <path d="M100 240 Q115 235 125 225 Q112 238 100 240" fill="currentColor" opacity="0.08"/>
            </g>
          </svg>
        </div>
        
        {/* Different cannabis bud cluster silhouette - bottom right */}
        <div className="absolute bottom-12 right-6 sm:right-12 opacity-[0.05] pointer-events-none">
          <svg width="160" height="240" viewBox="0 0 160 240" fill="none">
            <g className="text-white">
              {/* Dense bud cluster - cola style */}
              {/* Main bud shape */}
              <ellipse cx="80" cy="100" rx="35" ry="60" fill="currentColor" opacity="0.12"/>
              
              {/* Bud texture details - calyxes */}
              <circle cx="75" cy="70" r="8" fill="currentColor" opacity="0.15"/>
              <circle cx="90" cy="65" r="6" fill="currentColor" opacity="0.12"/>
              <circle cx="70" cy="85" r="7" fill="currentColor" opacity="0.14"/>
              <circle cx="95" cy="80" r="9" fill="currentColor" opacity="0.13"/>
              <circle cx="80" cy="95" r="10" fill="currentColor" opacity="0.16"/>
              <circle cx="65" cy="100" r="6" fill="currentColor" opacity="0.11"/>
              <circle cx="95" cy="100" r="7" fill="currentColor" opacity="0.12"/>
              <circle cx="75" cy="115" r="8" fill="currentColor" opacity="0.14"/>
              <circle cx="90" cy="120" r="7" fill="currentColor" opacity="0.13"/>
              <circle cx="80" cy="130" r="9" fill="currentColor" opacity="0.15"/>
              <circle cx="68" cy="135" r="5" fill="currentColor" opacity="0.1"/>
              <circle cx="92" cy="140" r="6" fill="currentColor" opacity="0.11"/>
              
              {/* Sugar leaves poking out */}
              <path d="M80 45 Q75 55 65 50 Q78 58 80 45" fill="currentColor" opacity="0.2"/>
              <path d="M80 45 Q85 52 95 48 Q82 56 80 45" fill="currentColor" opacity="0.18"/>
              <path d="M55 90 Q45 85 40 95 Q50 92 55 90" fill="currentColor" opacity="0.15"/>
              <path d="M105 85 Q115 80 120 90 Q110 88 105 85" fill="currentColor" opacity="0.15"/>
              
              {/* Stem */}
              <path d="M80 160 Q78 180 80 200 Q82 220 80 240" stroke="currentColor" strokeWidth="2.5" fill="none" opacity="0.4"/>
              
              {/* Small leaves at base */}
              <path d="M80 165 Q60 160 50 175 Q65 170 80 165" fill="currentColor" opacity="0.1"/>
              <path d="M80 165 Q100 160 110 175 Q95 170 80 165" fill="currentColor" opacity="0.1"/>
              
              {/* Pistil hints - hair-like details */}
              <path d="M70 75 Q65 70 60 72" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.2"/>
              <path d="M90 70 Q95 65 100 68" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.2"/>
              <path d="M75 110 Q70 108 65 112" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.18"/>
              <path d="M88 115 Q93 112 98 116" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.18"/>
            </g>
          </svg>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollAnimation>
            <div className="text-center mb-14 sm:mb-18">
              <h2 className="font-jakarta text-3xl sm:text-4xl md:text-5xl font-semibold text-white mb-4 px-4" style={{ letterSpacing: '-0.02em', lineHeight: '1.2' }}>
                Growing more than medicine
              </h2>
            </div>
          </ScrollAnimation>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10 sm:gap-12 md:gap-16">
            {values.map((value, index) => (
              <ScrollAnimation key={index} delay={index * 0.1}>
                <div className="text-center group">
                  <div className="flex justify-center mb-7">
                    <div className="w-20 h-20 flex items-center justify-center rounded-2xl bg-white/10 group-hover:bg-white/15 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-white/10">
                      <value.icon className="w-10 h-10 text-white" strokeWidth={1.5} />
                    </div>
                  </div>
                  <h3 className="font-jakarta text-xl sm:text-2xl font-semibold text-white mb-4 tracking-tight">
                    {value.title}
                  </h3>
                  <p className="font-jakarta text-white/75 leading-relaxed text-sm sm:text-base">
                    {value.description}
                  </p>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ValueProps;
