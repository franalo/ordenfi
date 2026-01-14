import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight,
  TrendingUp,
  PieChart,
  ShieldCheck,
  Zap,
  Check,
  Menu,
  X,
  Play,
  Rocket
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();

  const yHero = useTransform(scrollYProgress, [0, 0.5], [0, 100]);
  const scaleHero = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  const features = [
    {
      icon: <Zap size={32} className="text-white" />,
      color: "var(--vibrant-blue)",
      title: "Velocidad Extrema",
      desc: "Conecta tus cuentas en segundos. Sin tiempos de carga."
    },
    {
      icon: <TrendingUp size={32} className="text-white" />,
      color: "var(--vibrant-green)",
      title: "Crecimiento Real",
      desc: "Herramientas de proyección que te dicen cuánto tendrás en 10 años."
    },
    {
      icon: <PieChart size={32} className="text-white" />,
      color: "var(--vibrant-pink)",
      title: "Control Total",
      desc: "Crypto, Stocks, Cash. Todo unido en un dashboard brutal."
    }
  ];

  return (
    <div className="home-wrapper">
      {/* Background Grid Pattern */}
      <div className="bg-grid"></div>

      {/* Navbar */}
      <nav className="navbar">
        <div className="container nav-content">
          <div className="logo">
            {/* Small animated CSS cube for Logo */}
            <div className="cube-logo-update">
              <div className="c-face c-front"></div>
              <div className="c-face c-back"></div>
              <div className="c-face c-right"></div>
              <div className="c-face c-left"></div>
              <div className="c-face c-top"></div>
              <div className="c-face c-bottom"></div>
            </div>
            <span className="brand-name">ORDENFI_</span>

          </div>
          <div className="nav-links desktop-only">
            <a href="#features">Habilidades</a>
            <a href="#pricing">Membresía</a>
            <a href="#about">Manifiesto</a>
          </div>
          <div className="nav-actions">
            <button onClick={() => navigate('/login')} className="btn-link">Login</button>
            <button onClick={() => navigate('/login')} className="btn-brutal btn-primary">
              Comenzar Ya
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-container">
          <motion.div
            className="hero-content"
            style={{ y: yHero, scale: scaleHero }}
          >
            <div className="hero-badge">
              <Rocket size={16} /> Llevamos tus finanzas a la estratosfera
            </div>
            <h1 className="hero-title">
              DOMINA TU <br />
              <span className="text-gradient-stroke">PATRIMONIO.</span>
            </h1>
            <p className="hero-subtitle">
              La plataforma definitiva para inversores modernos. <br />
              <strong>Sin hojas de cálculo aburridas. Solo puros datos accionables.</strong>
            </p>

            <div className="hero-cta">
              <button onClick={() => navigate('/login')} className="btn-brutal btn-xl btn-gradient">
                Crear Cuenta Gratis <ArrowRight size={24} strokeWidth={3} />
              </button>
              <button className="btn-brutal btn-xl btn-white">
                <Play size={24} fill="black" /> Ver Demo
              </button>
            </div>
          </motion.div>

          {/* Visual Elements - Floating 3D Graphic */}
          <div className="hero-visuals">
            <div className="scene">
              <div className="giant-cube">
                <div className="cube-face front"><div className="brand-mark">OF</div></div>
                <div className="cube-face back"></div>
                <div className="cube-face right"></div>
                <div className="cube-face left"></div>
                <div className="cube-face top"></div>
                <div className="cube-face bottom"></div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="dec-circle c-1"></div>
            <div className="dec-circle c-2"></div>
            <div className="dec-circle c-3"></div>
          </div>
        </div>
      </section>

      {/* Ticker Tape */}
      <div className="ticker-wrap">
        <div className="ticker">
          <div className="ticker-item">CRYPTO • STOCKS • REAL ESTATE • CASHFLOW •</div>
          <div className="ticker-item">CRYPTO • STOCKS • REAL ESTATE • CASHFLOW •</div>
          <div className="ticker-item">CRYPTO • STOCKS • REAL ESTATE • CASHFLOW •</div>
          <div className="ticker-item">CRYPTO • STOCKS • REAL ESTATE • CASHFLOW •</div>
          <div className="ticker-item">CRYPTO • STOCKS • REAL ESTATE • CASHFLOW •</div>
        </div>
      </div>

      {/* Features - Big Cards */}
      <section className="features" id="features">
        <div className="container">
          <h2 className="section-title">PODER <span className="text-highlight">ILIMITADO</span></h2>
          <div className="features-grid">
            {features.map((f, i) => (
              <motion.div
                key={i}
                className="feature-card"
                whileHover={{ rotate: [-1, 1, 0], scale: 1.02, boxShadow: "12px 12px 0px 0px rgba(0,0,0,1)" }}
                style={{ borderColor: f.color }}
              >
                <div className="icon-badge" style={{ background: f.color }}>
                  {f.icon}
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase / Dashboard */}
      <section className="showcase">
        <div className="container">
          <div className="dashboard-frame terminal-theme">
            <div className="frame-header">
              <div className="dots">
                <div className="dot red"></div>
                <div className="dot yellow"></div>
                <div className="dot green"></div>
              </div>
              <div className="frame-title">sys_monitor_v2.0</div>
            </div>
            {/* Terminal Content instead of Image */}
            <div className="terminal-content">
              <div className="t-row"><span className="t-green">➜</span> <span className="t-blue">~/ordenfi</span> <span className="t-white">init_portfolio_tracking</span></div>
              <div className="t-row"><span className="t-gray">Loading assets...</span> <span className="t-green">DONE (234ms)</span></div>
              <div className="t-row"><span className="t-gray">Syncing crypto wallets...</span> <span className="t-green">DONE</span></div>
              <div className="t-row"><span className="t-gray">Calculating Net Worth...</span></div>
              <br />
              <div className="t-data-grid">
                <div className="t-stat">
                  <span className="t-label">BTC POS</span>
                  <span className="t-val t-green">2.4503</span>
                </div>
                <div className="t-stat">
                  <span className="t-label">DXY IND</span>
                  <span className="t-val t-red">102.40</span>
                </div>
                <div className="t-stat">
                  <span className="t-label">TOTAL NW</span>
                  <span className="t-val t-blue">$124,500.00</span>
                </div>
              </div>
              <div className="t-cursor">_</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="pricing" id="pricing">
        <div className="container">
          <div className="pricing-box">
            <div className="pricing-content">
              <h2>MEMBRESÍA <br />PRO</h2>
              <ul className="benefits-list">
                <li><Check size={24} className="bold-check" /> Conexiones Ilimitadas</li>
                <li><Check size={24} className="bold-check" /> Análisis por IA</li>
                <li><Check size={24} className="bold-check" /> Soporte Prioritario 24/7</li>
                <li><Check size={24} className="bold-check" /> Acceso a Beta Features</li>
              </ul>
            </div>
            <div className="pricing-tag">
              <div className="price-number">$10</div>
              <div className="price-period">/ AÑO</div>
              <button onClick={() => navigate('/login')} className="btn-brutal btn-black full">OBTENER EL PODER</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-logo">
            <img src="/logo.png" alt="Logo" style={{ height: '40px' }} />
          </div>
          <div className="footer-text">
            ORDENFI © 2026. LLEVANDO TUS FINANZAS AL SIGUIENTE NIVEL.
          </div>
        </div>
      </footer>

      <style>{`
        /* Global & Grid */
        .home-wrapper {
          position: relative;
          background-color: #f4f4f4;
          overflow-x: hidden;
        }
        .bg-grid {
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          background-image: 
            linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
          z-index: 0;
        }

        /* Navbar */
        .navbar {
          position: fixed;
          top: 0; width: 100%;
          height: 80px;
          background: rgba(255,255,255,0.95);
          border-bottom: 3px solid #000;
          z-index: 100;
          display: flex;
          align-items: center;
        }
        .nav-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }
        .logo-img { height: 48px; }
        .nav-links { display: flex; gap: 2rem; }
        .nav-links a {
          text-decoration: none;
          color: #000;
          font-weight: 700;
          text-transform: uppercase;
          font-size: 0.9rem;
          letter-spacing: 0.05em;
        }
        .nav-links a:hover { text-decoration: underline; text-decoration-thickness: 2px; }

        /* Buttons Brutal */
        .btn-brutal {
          border: 3px solid #000;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          box-shadow: 4px 4px 0px 0px #000;
          transition: all 0.1s;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .btn-brutal:hover {
          transform: translate(2px, 2px);
          box-shadow: 2px 2px 0px 0px #000;
        }
        .btn-brutal:active {
          transform: translate(4px, 4px);
          box-shadow: none;
        }
        .btn-primary { background: var(--vibrant-blue); color: white; padding: 10px 24px; border-radius: 8px;}
        .btn-gradient { background: var(--gradient-text); color: white; border: 3px solid #000; }
        .btn-white { background: white; color: black; }
        .btn-black { background: black; color: white; }
        .btn-xl { padding: 16px 32px; font-size: 1.1rem; border-radius: 12px; }
        .full { width: 100%; }
        .btn-link { font-weight: 700; text-transform: uppercase; margin-right: 1rem; }

        /* Hero */
        .hero {
          position: relative;
          z-index: 1;
          padding: 160px 0 100px;
        }
        .hero-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #000;
          color: #fff;
          padding: 8px 16px;
          border-radius: 100px;
          font-weight: 700;
          text-transform: uppercase;
          font-size: 0.8rem;
          margin-bottom: 2rem;
          box-shadow: 4px 4px 0 rgba(0,0,0,0.2);
        }
        .hero-title {
          font-size: 6rem;
          line-height: 0.9;
          font-weight: 900;
          color: #000;
          margin-bottom: 2rem;
          letter-spacing: -0.04em;
        }
        .text-gradient-stroke {
          background: var(--gradient-text);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          /* Optional stroke for that brutal feel, but sometimes hard to read on gradient */
        }
        .hero-subtitle {
          font-size: 1.5rem;
          color: var(--text-secondary);
          margin-bottom: 3rem;
          max-width: 700px;
          line-height: 1.4;
        }
        .hero-cta {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 4rem;
        }

        .hero-visuals {
          position: relative;
          width: 100%;
          max-width: 600px;
          height: 600px;
          display: flex;
          justify-content: center;
          align-items: center;
          perspective: 1000px;
        }
        
        /* 3D Giant Cube */
        .scene { width: 300px; height: 300px; perspective: 1000px; }
        .giant-cube {
          width: 100%; height: 100%;
          position: relative;
          transform-style: preserve-3d;
          animation: spin 10s infinite linear;
        }
        .cube-face {
          position: absolute;
          width: 300px; height: 300px;
          background: #000;
          border: 4px solid #fff;
          display: flex; align-items: center; justify-content: center;
          opacity: 0.95;
        }
        .front  { transform: rotateY(0deg) translateZ(150px); }
        .back   { transform: rotateY(180deg) translateZ(150px); }
        .right  { transform: rotateY(90deg) translateZ(150px); }
        .left   { transform: rotateY(-90deg) translateZ(150px); }
        .top    { transform: rotateX(90deg) translateZ(150px); }
        .bottom { transform: rotateX(-90deg) translateZ(150px); }

        .brand-mark { font-size: 8rem; font-weight: 900; color: #fff; letter-spacing: -0.05em; transform: rotate(-90deg); }

        @keyframes spin {
          0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
          100% { transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg); }
        }

        /* Navbar Logo Cube */
        .logo { display: flex; align-items: center; gap: 12px; }
        .cube-logo-update {
          width: 32px; height: 32px;
          position: relative;
          transform-style: preserve-3d;
          animation: spin-sm 4s infinite linear;
        }
        .c-face {
           position: absolute; width: 32px; height: 32px;
           background: #000; border: 2px solid #fff;
        }
        .c-front  { transform: rotateY(0deg) translateZ(16px); }
        .c-back   { transform: rotateY(180deg) translateZ(16px); }
        .c-right  { transform: rotateY(90deg) translateZ(16px); }
        .c-left   { transform: rotateY(-90deg) translateZ(16px); }
        .c-top    { transform: rotateX(90deg) translateZ(16px); }
        .c-bottom { transform: rotateX(-90deg) translateZ(16px); }
        
        @keyframes spin-sm {
           0% { transform: rotateX(-20deg) rotateY(0deg); }
           100% { transform: rotateX(-20deg) rotateY(360deg); }
        }
        
        .brand-name { font-weight: 900; font-size: 1.5rem; letter-spacing: -0.05em; }

        /* Terminal Theme */
        .terminal-theme {
          background: #000;
          color: #fff;
          font-family: monospace;
          border: 4px solid #000;
        }
        .terminal-content { padding: 40px; }
        .t-row { margin-bottom: 8px; font-size: 1.1rem; }
        .t-green { color: var(--vibrant-green); }
        .t-blue { color: var(--vibrant-blue); }
        .t-white { color: #fff; }
        .t-gray { color: #666; }
        .t-red { color: var(--vibrant-pink); }
        .t-cursor { animation: blink 1s infinite; display: inline-block; width: 10px; height: 20px; background: var(--vibrant-green); vertical-align: middle; }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        
        .t-data-grid { margin-top: 30px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .t-stat { border: 2px solid #333; padding: 15px; }
        .t-label { display: block; font-size: 0.8rem; color: #888; margin-bottom: 5px; }
        .t-val { display: block; font-size: 1.5rem; font-weight: bold; }

        
        .dec-circle {
          position: absolute;
          border-radius: 50%;
          z-index: -1;
        }
        .c-1 { width: 300px; height: 300px; background: var(--vibrant-blue); opacity: 0.2; top: 0; left: 10%; filter: blur(40px); }
        .c-2 { width: 250px; height: 250px; background: var(--vibrant-pink); opacity: 0.2; bottom: 0; right: 10%; filter: blur(40px); }
        .c-3 { width: 150px; height: 150px; background: var(--vibrant-green); opacity: 0.2; top: 40%; left: 45%; filter: blur(30px); }

        /* Ticker */
        .ticker-wrap {
          width: 100%;
          background: #000;
          color: #fff;
          overflow: hidden;
          padding: 12px 0;
          transform: rotate(-2deg) scale(1.05);
          margin: 40px 0;
          border-top: 3px solid var(--vibrant-green);
          border-bottom: 3px solid var(--vibrant-blue);
        }
        .ticker {
          display: flex;
          white-space: nowrap;
          animation: ticker 20s linear infinite;
        }
        .ticker-item {
          font-size: 1.5rem;
          font-weight: 800;
          padding: 0 2rem;
        }
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }

        /* Features */
        .features { padding: 80px 0; }
        .section-title {
          font-size: 4rem;
          font-weight: 900;
          text-align: center;
          margin-bottom: 4rem;
          text-transform: uppercase;
        }
        .text-highlight {
          background: var(--vibrant-green);
          color: #000;
          padding: 0 10px;
          transform: skew(-5deg);
          display: inline-block;
        }
        
        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }
        .feature-card {
          background: #fff;
          border: 3px solid #000;
          border-radius: 16px;
          padding: 2.5rem;
          box-shadow: 8px 8px 0px 0px #000;
        }
        .icon-badge {
          width: 64px; height: 64px;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          border: 3px solid #000;
          margin-bottom: 1.5rem;
          box-shadow: 4px 4px 0px 0px #000;
        }
        .feature-card h3 {
          font-size: 1.8rem;
          font-weight: 800;
          margin-bottom: 1rem;
          text-transform: uppercase;
        }

        /* Showcase */
        .showcase { padding: 80px 0; }
        .dashboard-frame {
          background: #fff;
          border: 4px solid #000;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 12px 12px 0px 0px #000;
          max-width: 1000px;
          margin: 0 auto;
        }
        .frame-header {
          background: #fff;
          border-bottom: 4px solid #000;
          padding: 12px 20px;
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .dots { display: flex; gap: 8px; }
        .dot { width: 16px; height: 16px; border-radius: 50%; border: 2px solid #000; }
        .red { background: var(--vibrant-pink); }
        .yellow { background: var(--vibrant-blue); }
        .green { background: var(--vibrant-green); }
        .frame-title { font-family: monospace; font-weight: 700; }
        .dashboard-img { width: 100%; display: block; }

        /* Pricing */
        .pricing { padding: 100px 0; }
        .pricing-box {
          background: #fff;
          border: 4px solid #000;
          border-radius: 24px;
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          overflow: hidden;
          box-shadow: 16px 16px 0px 0px rgba(0,0,0,1);
        }
        .pricing-content { padding: 4rem; background: var(--vibrant-blue); color: white; position: relative; }
        .pricing-content h2 { font-size: 3.5rem; font-weight: 900; line-height: 1; margin-bottom: 2rem; border-bottom: 4px solid #fff; padding-bottom: 1rem; display: inline-block; }
        .benefits-list { list-style: none; display: flex; flex-direction: column; gap: 1.5rem; }
        .benefits-list li { display: flex; align-items: center; gap: 1rem; font-size: 1.25rem; font-weight: 700; }
        .bold-check { stroke-width: 4px; }
        
        .pricing-tag { padding: 4rem; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #fff; border-left: 4px solid #000; }
        .price-number { font-size: 6rem; font-weight: 900; line-height: 1; color: #000; }
        .price-period { font-size: 1.5rem; font-weight: 800; color: var(--text-secondary); margin-bottom: 2rem; }

        /* Footer */
        .footer { background: #000; color: #fff; padding: 60px 0; margin-top: 80px; }
        .footer .container { display: flex; justify-content: space-between; align-items: center; }
        .footer-text { font-weight: 700; letter-spacing: 0.1em; font-size: 0.8rem; }

        @media (max-width: 1024px) {
          .hero-title { font-size: 3.5rem; }
          .features-grid { grid-template-columns: 1fr; }
          .pricing-box { grid-template-columns: 1fr; border-radius: 16px; }
          .pricing-tag { border-left: none; border-top: 4px solid #000; padding: 2rem; }
          .nav-content { justify-content: space-between; }
          .desktop-only { display: none; }
          .hero-cta { flex-direction: column; width: 100%; }
          .btn-xl { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default Home;
