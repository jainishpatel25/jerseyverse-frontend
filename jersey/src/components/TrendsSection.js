// import React from "react";
// import "./styles/TrendsSection.css";

// const TrendsSection = () => {
//   return (
//     <section className="trends-section">
//       <div className="curve-bg">
//         <div className="content-wrapper">
//           <div className="image-box">
//             <img src="/images/japan.jpg" alt="Trends" />
//           </div>
//           <div className="text-box">
//             <h3>Trending Jerseys</h3>
//             <hr />
//             <p>
//               From iconic clubs to national teams — explore the jerseys making
//               waves this season.
//             </p>
//             <p>
//               Limited editions, retro classics, and fan favorites — gear up and
//               show your passion for the game.
//             </p>
//             <button>Find Out More</button>
//           </div>
//         </div>
//       </div>
//       <div className="curve-svg" preserveAspectRatio="none">
//         <svg viewBox="0 0 1440 200">
//           <path
//             d="M0,0 C400,150 1040,150 1440,0 L1440,200 L0,200 Z"
//             fill="#fff"
//           />
//         </svg>
//       </div>
//     </section>
//   );
// };

// export default TrendsSection;
import React from "react";
import { motion } from "framer-motion";
import "./styles/TrendsSection.css";

const TrendsSection = () => {
  return (
    <section className="trends-section">
      <div className="curve-bg">
        {/* Parent wrapper animation */}
        <motion.div
          className="content-wrapper"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Image Zoom-in */}
          <motion.div
            className="image-box"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <img src="/images/japan.jpg" alt="Trends" />
          </motion.div>

          {/* Text stagger animation */}
          <motion.div
            className="text-box"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.2 }
              }
            }}
          >
            <motion.h3
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              Trending Jerseys
            </motion.h3>

            <motion.p
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              From iconic clubs to national teams — explore the jerseys making
              waves this season.
            </motion.p>

            <motion.p
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              Limited editions, retro classics, and fan favorites — gear up and
              show your passion for the game.
            </motion.p>

            <motion.button
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.4 }}
            >
              Find Out More
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Curved SVG Bottom */}
      <div className="curve-svg" preserveAspectRatio="none">
        <svg viewBox="0 0 1440 200">
          <path
            d="M0,0 C400,150 1040,150 1440,0 L1440,200 L0,200 Z"
            fill="#fff"
          />
        </svg>
      </div>
    </section>
  );
};

export default TrendsSection;
