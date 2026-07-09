import { useState } from "react";
import "./Resources.css";

function Resources() {
  const [activeTab, setActiveTab] = useState("plus2"); // "plus2" or "bachelor"

  // +2 Resources Data
  const plus2Resources = {
    science: [
      { name: "Physics", notes: "#", questions: "#", materials: "#" },
      { name: "Chemistry", notes: "#", questions: "#", materials: "#" },
      { name: "Biology", notes: "#", questions: "#", materials: "#" },
      { name: "Mathematics", notes: "#", questions: "#", materials: "#" },
    ],
    management: [
      { name: "Accountancy", notes: "#", questions: "#", materials: "#" },
      { name: "Economics", notes: "#", questions: "#", materials: "#" },
      { name: "Business Mathematics", notes: "#", questions: "#", materials: "#" },
      { name: "Business Studies", notes: "#", questions: "#", materials: "#" },
    ],
  };

  // Bachelor Resources Data (by semester)
  const bachelorResources = {
    csit: [
      { semester: "Semester 1", subjects: ["C programming", "Digital Logic", "Mathematics I" ,"IIT"] },
      { semester: "Semester 2", subjects: ["Microprocessor", "statistics", "Mathematics II" ,"OOP"] },
      { semester: "Semester 3", subjects: ["Numerical Methods", "Data Structures Alogorithm", "Computer Architecture","Computer Graphics"] },
      { semester: "Semester 4", subjects: ["Artificial Intelligence", "Database Management system", "Operating system","Theory of computation"] },
      { semester: "Semester 5", subjects: ["Cryptography", "simulation and modeling", "Web Technology","System analysis and Design"] },
      { semester: "Semester 6", subjects: ["Software Engineering", "Compiler Design", "E-Governance","E-Commerce"] },
      { semester: "Semester 7", subjects: ["Principle of  Management", "Data Warehouse and Data Mining ", "Project I"] },
      { semester: "Semester 8", subjects: ["Advanced javascript", "Cloud Computing", "Project II"] },
    ],
    engineering: [
      { semester: "Year 1", subjects: ["Engineering Math I", "Physics", "Basic Electronics"] },
      { semester: "Year 2", subjects: ["Engineering Math II", "Mechanics", "Thermodynamics"] },
      { semester: "Year 3", subjects: ["Fluid Mechanics", "Strength of Materials", "Electrical Machines"] },
      { semester: "Year 4", subjects: ["Project Management", "Design", "Thesis"] },
    ],
  };

  return (
    <div className="resources-page">
      {/* Header */}
      <div className="resources-header">
        <h1>Study Resources 📚</h1>
        <p className="subtitle">Access notes, past questions, and study materials for +2 and Bachelor levels</p>
      </div>

      {/* Tabs */}
      <div className="resources-tabs">
        <button
          className={`tab ${activeTab === "plus2" ? "active" : ""}`}
          onClick={() => setActiveTab("plus2")}
        >
          +2 (Science & Management)
        </button>
        <button
          className={`tab ${activeTab === "bachelor" ? "active" : ""}`}
          onClick={() => setActiveTab("bachelor")}
        >
          Bachelor (CSIT & Engineering)
        </button>
      </div>

      {/* +2 Content */}
      {activeTab === "plus2" && (
        <div className="tab-content">
          <section className="category-section">
            <h2 className="section-title">
              <span className="title-underline">+2 Science</span>
            </h2>
            <div className="subject-grid">
              {plus2Resources.science.map((subject, idx) => (
                <div key={idx} className="subject-card">
                  <h3>{subject.name}</h3>
                  <div className="resource-links">
                    <a href={subject.notes} className="resource-link notes">
                      <span className="link-icon">📘</span> Notes
                    </a>
                    <a href={subject.questions} className="resource-link questions">
                      <span className="link-icon">📝</span> Past Questions
                    </a>
                    <a href={subject.materials} className="resource-link materials">
                      <span className="link-icon">📚</span> Materials
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="category-section">
            <h2 className="section-title">
              <span className="title-underline">+2 Management</span>
            </h2>
            <div className="subject-grid">
              {plus2Resources.management.map((subject, idx) => (
                <div key={idx} className="subject-card">
                  <h3>{subject.name}</h3>
                  <div className="resource-links">
                    <a href={subject.notes} className="resource-link notes">
                      <span className="link-icon">📘</span> Notes
                    </a>
                    <a href={subject.questions} className="resource-link questions">
                      <span className="link-icon">📝</span> Past Questions
                    </a>
                    <a href={subject.materials} className="resource-link materials">
                      <span className="link-icon">📚</span> Materials
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Bachelor Content */}
      {activeTab === "bachelor" && (
        <div className="tab-content">
          <section className="category-section">
            <h2 className="section-title">
              <span className="title-underline">Bachelor CSIT</span>
            </h2>
            <div className="semester-grid">
              {bachelorResources.csit.map((sem, idx) => (
                <div key={idx} className="semester-card">
                  <h3>{sem.semester}</h3>
                  <ul className="subject-list">
                    {sem.subjects.map((subject, subIdx) => (
                      <li key={subIdx}>
                        <a href="#">{subject}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="category-section">
            <h2 className="section-title">
              <span className="title-underline">Bachelor Engineering</span>
            </h2>
            <div className="semester-grid">
              {bachelorResources.engineering.map((sem, idx) => (
                <div key={idx} className="semester-card">
                  <h3>{sem.semester}</h3>
                  <ul className="subject-list">
                    {sem.subjects.map((subject, subIdx) => (
                      <li key={subIdx}>
                        <a href="#">{subject}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default Resources;