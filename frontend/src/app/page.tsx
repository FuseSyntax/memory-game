'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaCoins, FaGamepad, FaUsers, FaDiscord, FaTwitter, FaRocket } from 'react-icons/fa';
import { SiEthereum } from 'react-icons/si';
import { useRef } from 'react';
import { useRouter } from 'next/navigation';

const Home = () => {
  // Define your games and features arrays.
  const games = [
    { id: 1, name: 'Cyber Arena', earnings: '0.5 ETH/day', image: '/images/cyber-arena.png', video: '/videos/cyberArena.mp4' },
    { id: 2, name: 'NFT Legends', earnings: '0.3 ETH/day', image: '/images/nft-legends.jpg', video: '/videos/nftLegendVideo.mp4' },
    { id: 3, name: 'Metaverse Battle', earnings: '0.7 ETH/day', image: '/images/metaverse-battle.jpg', video: '/videos/metaverseBattle.mp4' },
  ];

    const router = useRouter();
  

  const features = [
    { icon: <FaCoins />, title: "Play to Earn", description: "Turn your gaming skills into real cryptocurrency rewards" },
    { icon: <SiEthereum />, title: "NFT Assets", description: "Own and trade unique in-game assets as NFTs" },
    { icon: <FaUsers />, title: "Community", description: "Join our competitive gaming ecosystem" },
  ];

  // Parallax scroll for hero background
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.2]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 overflow-x-hidden">
      {/* Hero Section with Parallax */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          style={{ opacity, scale }}
          className="absolute inset-0 bg-grid-white/[0.05]"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-blue-500/10 to-purple-500/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-gray-900/20" />
        </motion.div>

        <div className="relative z-10 text-center px-4 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="inline-block bg-cyan-500/10 px-6 py-3 rounded-full border border-cyan-400/30 mb-8">
              <span className="text-cyan-400 text-lg">Beta Live Now!</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              <span className="text-stroke">Next-Gen</span><br/>
              <motion.span 
                className="inline-block"
                animate={{ textShadow: ["0 0 10px #00f2ff", "0 0 20px #00f2ff", "0 0 10px #00f2ff"] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                Gaming Economy
              </motion.span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Immerse yourself in AAA-quality blockchain games where every victory translates to real-world value.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-4 rounded-xl text-lg font-bold flex items-center gap-2 shadow-lg shadow-cyan-500/30"
            >
              <FaRocket className="text-xl" />
              Launch Platform
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-transparent border-2 border-cyan-500 text-cyan-400 px-8 py-4 rounded-xl text-lg font-bold flex items-center gap-2 hover:bg-cyan-500/10"
            >
              <SiEthereum className="text-xl" />
              Connect Wallet
            </motion.button>
          </motion.div>
        </div>

        {/* Animated Particles Background */}
        <div className="absolute inset-0 z-0">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full"
              initial={{
                x: Math.random() * 100,
                y: Math.random() * 100,
              }}
              animate={{
                x: Math.random() * 100,
                y: Math.random() * 100,
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 5,
                repeat: Infinity,
                repeatType: 'loop',
              }}
            />
          ))}
        </div>
      </section>

      {/* Game Cards with Video Previews */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-white mb-16 text-center"
          >
            Featured Games
          </motion.h2>
          
          <div className="grid lg:grid-cols-3 gap-12">
            {games.map((game) => (
              <motion.div 
                key={game.id}
                whileHover="hover"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="relative group overflow-hidden rounded-2xl border-2 border-cyan-500/20 bg-gray-900"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent z-10" />
                <video 
                  autoPlay
                  muted
                  loop
                  className="w-full h-96 object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                >
                  <source src={game.video} type="video/mp4" />
                </video>
                
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  <h3 className="text-2xl font-bold text-white mb-2">{game.name}</h3>
                  <div className="flex items-center gap-2 text-cyan-400">
                    <FaCoins className="text-xl" />
                    <span className="font-mono">{game.earnings}</span>
                  </div>
                </div>

                <div className="absolute top-4 right-4">
                  <button className="bg-cyan-500/20 backdrop-blur-sm px-4 py-2 rounded-full text-cyan-400 hover:bg-cyan-500/30 transition-colors">
                    Play Now
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Features Grid */}
      <section className="py-20 px-4 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-4xl font-bold text-white mb-16 text-center"
          >
            Game-Changing Features
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                whileHover={{ scale: 1.05 }}
                className="bg-gray-800/50 p-8 rounded-2xl border border-cyan-400/20 backdrop-blur-lg hover:border-cyan-400/40 transition-all"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 4 }}
                  className="text-cyan-400 text-4xl mb-4 inline-block"
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Animated Stats Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 text-center">
          {[
            { value: 50000, label: 'Active Players', color: 'cyan' },
            { value: 10000000, label: 'Paid Out', color: 'purple' },
            { value: 100, label: 'Tournaments', color: 'blue' },
            { value: 1000000, label: 'NFTs Traded', color: 'green' }
          ].map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="p-6"
            >
              <div className={`text-4xl font-bold text-${stat.color}-400 mb-2`}>
                ${stat.value.toLocaleString()}+
              </div>
              <div className="text-gray-300 uppercase text-sm tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Floating CTA */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="py-20 px-4"
      >
        <div className="max-w-4xl mx-auto text-center bg-gray-900/50 backdrop-blur-lg p-12 rounded-3xl border border-cyan-500/20">
          <h2 className="text-4xl font-bold text-white mb-8">
            Ready for the Next Level?
          </h2>
          <p className="text-gray-300 mb-12 max-w-xl mx-auto">
            Join millions of players earning while playing in our metaverse ecosystem
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
            onClick={() => router.push('/play-now')}
              className="bg-cyan-500 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-cyan-500/30"
            >
              <FaGamepad className="text-xl" />
              Start Playing Now
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => router.push('/marketplace')}
              className="bg-transparent border-2 border-cyan-500 text-cyan-400 px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-cyan-500/10"
            >
              <SiEthereum className="text-xl" />
              Explore Marketplace
            </motion.button>
          </div>
        </div>
      </motion.section>

      {/* Glowing Footer */}
      <footer className="bg-gray-900/80 py-12 px-4 border-t border-cyan-500/20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-cyan-400">GameVerse</h3>
            <p className="text-gray-400">The future of play-to-earn gaming</p>
          </div>
          <div className="space-y-4">
            <h4 className="text-white">Social Hub</h4>
            <div className="flex gap-4">
              <motion.a whileHover={{ y: -2 }} className="text-2xl text-gray-400 hover:text-cyan-400">
                <FaDiscord />
              </motion.a>
              <motion.a whileHover={{ y: -2 }} className="text-2xl text-gray-400 hover:text-cyan-400">
                <FaTwitter />
              </motion.a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
