import { useState, useEffect } from 'react';
import { 
  FaFlag, FaUsers, FaBookOpen, FaClock, FaChartLine, FaTrophy, 
  FaQuoteLeft, FaHeart, FaCode, FaMobile, FaShieldAlt, FaRocket,
  FaGraduationCap, FaChalkboardTeacher, FaBrain, FaStar
} from 'react-icons/fa';
import './About.css';

function About() {
  const [stats, setStats] = useState({
    students: 0,
    resources: 0,
    teachers: 0,
    hours: 0
  });

  useEffect(() => {
    // Animated counter
    const animateNumbers = () => {
      const targets = { students: 5000, resources: 2500, teachers: 50, hours: 50000 };
      const duration = 2000;
      const stepTime = 20;
      const steps = duration / stepTime;
      
      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        setStats({
          students: Math.min(targets.students, Math.floor((targets.students * currentStep) / steps)),
          resources: Math.min(targets.resources, Math.floor((targets.resources * currentStep) / steps)),
          teachers: Math.min(targets.teachers, Math.floor((targets.teachers * currentStep) / steps)),
          hours: Math.min(targets.hours, Math.floor((targets.hours * currentStep) / steps))
        });
        if (currentStep >= steps) clearInterval(interval);
      }, stepTime);
    };
    animateNumbers();
  }, []);

  const teamMembers = [
    { name: 'Suyog Lamichhane', role: 'Lead Developer', icon: '💻', color: '#3b82f6' },
    { name: 'Utkrist subedi', role: 'UI/UX Designer', icon: '🎨', color: '#dc2626' },
    { name: 'Sushant Thapaliya', role: 'Content Manager', icon: '📚', color: '#facc15' },
    { name: 'Gaurab Sapkota', role: 'QA Engineer', icon: '🔧', color: '#10b981' },
  ];

  const milestones = [
    { year: '2024', title: 'Project Started', description: 'Concept development and planning' },
    { year: '2024', title: 'MVP Launch', description: 'Basic features implemented' },
    { year: '2025', title: 'Beta Release', description: 'Teacher & admin panels added' },
    { year: '2025', title: 'Full Launch', description: 'Complete platform ready for students' },
  ];

  const values = [
    { icon: <FaGraduationCap />, title: 'Quality Education', desc: 'Providing best study resources' },
    { icon: <FaUsers />, title: 'Community First', desc: 'Building a supportive student community' },
    { icon: <FaRocket />, title: 'Innovation', desc: 'Using AI for better learning' },
    { icon: <FaHeart />, title: 'Made in Nepal', desc: 'Proudly built for Nepali students' },
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-badge"> Proudly Nepali </div>
          <h1>About Study<span>Nep</span></h1>
          <p>Empowering Nepali students to study smarter, not harder</p>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="stat-number">{stats.students.toLocaleString()}+</span>
              <span className="stat-label">Active Students</span>
            </div>
            <div className="hero-stat">
              <span className="stat-number">{stats.resources.toLocaleString()}+</span>
              <span className="stat-label">Study Resources</span>
            </div>
            <div className="hero-stat">
              <span className="stat-number">{stats.teachers}+</span>
              <span className="stat-label">Expert Teachers</span>
            </div>
            <div className="hero-stat">
              <span className="stat-number">{stats.hours.toLocaleString()}+</span>
              <span className="stat-label">Study Hours Logged</span>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mission-vision">
        <div className="container">
          <div className="mv-card mission">
            <div className="mv-icon">🎯</div>
            <h2>Our Mission</h2>
            <p>To provide every Nepali student with intelligent tools that make studying efficient, organized, and stress-free. We believe that smart planning leads to academic success.</p>
          </div>
          <div className="mv-card vision">
            <div className="mv-icon">👁️</div>
            <h2>Our Vision</h2>
            <p>To become Nepal's most trusted study platform, helping over 100,000 students achieve their academic dreams through adaptive learning technology.</p>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="values-section">
        <div className="container">
          <h2>Our Core Values</h2>
          <div className="values-grid">
            {values.map((value, idx) => (
              <div key={idx} className="value-card">
                <div className="value-icon">{value.icon}</div>
                <h3>{value.title}</h3>
                <p>{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="offer-section">
        <div className="container">
          <h2>What We Offer</h2>
          <div className="offer-grid">
            <div className="offer-card">
              <div className="offer-icon">📚</div>
              <h3>Smart Study Planner</h3>
              <p>Adaptive scheduling based on your exam dates and priorities</p>
            </div>
            <div className="offer-card">
              <div className="offer-icon">📊</div>
              <h3>Progress Tracking</h3>
              <p>Visual charts to track your study hours and completed topics</p>
            </div>
            <div className="offer-card">
              <div className="offer-icon">⏰</div>
              <h3>Focus Timer</h3>
              <p>Pomodoro technique to boost concentration</p>
            </div>
            <div className="offer-card">
              <div className="offer-icon">📝</div>
              <h3>Quizzes & Tests</h3>
              <p>Test your knowledge with interactive quizzes</p>
            </div>
            {/* <div className="offer-card">
              <div className="offer-icon">🃏</div>
              <h3>Flashcards</h3>
              <p>Active recall for better memory retention</p>
            </div> */}
            <div className="offer-card">
              <div className="offer-icon">👨‍🏫</div>
              <h3>Teacher Support</h3>
              <p>Get guidance from experienced teachers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Milestones Timeline
      <section className="milestones-section">
        <div className="container">
          <h2>Our Journey</h2>
          <div className="timeline">
            {milestones.map((milestone, idx) => (
              <div key={idx} className="timeline-item">
                <div className="timeline-year">{milestone.year}</div>
                <div className="timeline-content">
                  <h3>{milestone.title}</h3>
                  <p>{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <h2>Meet Our Team</h2>
          <div className="team-grid">
            {teamMembers.map((member, idx) => (
              <div key={idx} className="team-card">
                <div className="team-avatar" style={{ background: member.color }}>{member.icon}</div>
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="container">
          <h2>What Students Say</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <FaQuoteLeft className="quote-icon" />
              <p>"StudyNep completely changed how I prepare for exams. The adaptive recommendations are spot on!"</p>
              <div className="testimonial-author">
                <span className="author-icon">R</span>
                <div>
                  <h4>Sushant Thapaliya</h4>
                  <p>CSIT 5th Semester</p>
                  <div className="rating">★★★★★</div>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <FaQuoteLeft className="quote-icon" />
              <p>"Finally a study tool made for Nepali students. The focus timer and progress tracking keep me motivated."</p>
              <div className="testimonial-author">
                <span className="author-icon">S</span>
                <div>
                  <h4>Suyog lamichhane</h4>
                  <p>+2 Science</p>
                  <div className="rating">★★★★★</div>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <FaQuoteLeft className="quote-icon" />
              <p>"The teacher dashboard makes it easy to share materials and track student progress."</p>
              <div className="testimonial-author">
                <span className="author-icon">B</span>
                <div>
                  <h4>Swostik lamichhane</h4>
                  <p>Teacher, Bachelor CSIT</p>
                  <div className="rating">★★★★★</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-about">
        <div className="cta-content">
          <h2>Ready to Start Your Journey?</h2>
          <p>Join thousands of Nepali students already using StudyNep</p>
          <button className="cta-btn" onClick={() => window.location.href = '/register'}>
            Get Started Free <FaRocket />
          </button>
        </div>
      </section>
    </div>
  );
}

export default About;