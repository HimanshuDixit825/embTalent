"use client";
import { useState, useEffect, useRef } from "react";
import Portal from "@/components/Portal";
export default function SkillDropdown({
  onSelect,
  onClose,
  type,
  position,
  usePortal = false,
}) {
  const [search, setSearch] = useState("");
  const [filteredSkills, setFilteredSkills] = useState([]);
  const dropdownRef = useRef(null);
  const initialSkills = [
    "CSS Frameworks",
    "Javascript",
    "Frontend Frameworks",
    "Express Js",
    "React Flow",
    "API Integration",
    "Next.Js",
    "Angular Js",
    "Frontend Unit testing",
    "Vue",
    "Flow",
    "Webpack",
    "UIkit",
    "Material UI",
    "Shaden UI",
    "(LESS/CSS/SCSS)",
    "Chakra UI",
    "Frontend testing Techniques",
    "Typescript",
    "React Dev Tools",
    "Socket.io",
    "OOPS",
    "Nuxt.js",
    "Web Assembly",
    "Cookies",
    "Hosting",
    "Pixi js",
    "Nest Js",
    "GitHub",
    "Unit Testing",
    "OOPS",
    "Python",
    "Springboot",
    "Java",
    "Django",
    "Flask",
    "Fast API",
    "Rest API",
    "Go Lang",
    "MongoDB",
    "MYsql",
    "Symfony",
    "Codeigniter",
    "Build Tools",
    "Scala",
    "Rust",
    ".NET",
    "ASP.NET",
    "C#",
    "MVC",
    "MVVM",
    "Hibernate",
    "Cucumber",
    "Kotlin",
    "Android Concepts",
    "Android NDK",
    "Android SDK",
    "Android XML Concepts",
    "recycler review",
    "Retrofit",
    "View Model",
    "Brodcast Reciever",
    "Dagger",
    "Jetpack Componenets",
    "Google Play services",
    "Okhttp",
    "Picasso",
    "Glide",
    "NDK Tools",
    "Android STUDIO",
    "HTML/CSS",
    "IOS",
    "swift",
    "objective-c",
    "SDK",
    "Networking",
    "cocoatouch",
    "cocoapods",
    "Xcode",
    "Swift UI",
    "Uikit",
    "core data",
    "flutter",
    "IOS Testing",
    "Firebase",
    "IOS End to end testing",
    "Reactive Progrmaming",
    "Appium",
    "Build Tools",
    "State Management",
    "Flutter Concepts",
    "Dart",
    "GetX",
    "Provider",
    "Riverpod",
    "Bloc",
    "Get it",
    "Dio",
    "Flutter Widgets",
    "Angels",
    "Rxdart",
    "Chopper",
    "Hive",
    "Plugin Integration",
    "Dependency Injection",
    "State Management",
    "Solid Principles",
    "React Native Concepts",
    "React Navigation",
    "Expo",
    "Geo Fencing",
    "Testing Fundamentals",
    "Regression testing",
    "integration testing",
    "SQL queries",
    "Functional Testing",
    "API testing",
    "Proficiency in Programming Languages (Java, Python, C#)",
    "Understanding of Automation Testing Tools (Selenium, TestNG, JUnit)",
    "Knowledge of CI/CD Tools (Jenkins, GitLab CI)",
    "Experience with API Testing (Postman, RestAssured)",
    "Familiarity with Version Control Systems (Git)",
    "Strong Understanding of Software Development Life Cycle (SDLC)",
    "Excellent Problem-Solving Skills",
    "Attention to Detail",
    "Experience with Test Automation Frameworks (Cucumber, Robot Framework)",
    "Knowledge of Performance Testing Tools (JMeter, LoadRunner)",
    "Understanding of Agile Methodologies",
    "Good Communication Skills",
    "Ability to Write Clear Test Cases and Documentation",
    "Knowledge of Database/SQL for Validation",
    "Familiarity with Cloud Testing Environments (AWS, Azure)",
    "AWS",
    "Azure",
    "Google Cloud",
    "Jenkins",
    "GitLab CI",
    "CircleCI",
    "Containerization",
    "Docker",
    "Kubernetes",
    "IAC Code",
    "Terraform",
    "Ansible",
    "CloudFormation",
    "Proficiency in Scripting Languages",
    "Bash",
    "Python",
    "Prometheus",
    "ELK Stack",
    "Grafana",
    "Familiarity with Version Control Systems like Git",
    "Strong Understanding of Networking and Security",
    "Experience with Configuration Management Tools",
    "Knowledge of Database Management",
    "SQL",
    "User Research",
    "Wireframing",
    "Prototyping",
    "Interaction Design",
    "Visual Design",
    "Usability Testing",
    "Adobe Creative Suite",
    "Sketch",
    "Figma",
    "InVision",
    "HTML",
    "CSS",
    "JavaScript",
    "Responsive Design",
    "Adobe Creative Suite",
    "Photoshop",
    "Illustrator",
    "InDesign",
    "Typography",
    "Color Theory",
    "Layout Design",
    "Branding",
    "Print Design",
    "Digital Design",
    "Illustration",
    "Photo Editing",
    "UI Design",
    "Python",
    "SQL",
    "Machine Learning",
    "Deep Learning",
    "Data Visualization",
    "Pandas",
    "NumPy",
    "Scikit-learn",
    "TensorFlow",
    "PyTorch",
    "Keras",
    "Hadoop",
    "Spark",
    "ETL Processes",
    "Feature Engineering",
    "Statistical Analysis",
    "Big Data Technologies",
    "A/B Testing",
    "Data Mining",
    "Git",
    "Cloud Platforms (AWS, Azure, GCP)",
    "APIs",
    "Data Governance",
    "Natural Language Processing (NLP)",
    "Data Modeling",
    "Excel",
    "Tableau",
    "Power BI",
    "Data Cleaning",
    "Google Analytics",
    "Dashboard Creation",
    "Query Optimization",
    "Machine Learning Basics",
    "Java",
    "Scala",
    "Data Warehousing",
    "Apache Spark",
    "Kafka",
    "NoSQL Databases (MongoDB, Cassandra)",
    "Data Pipeline Orchestration",
    "Database Management",
    "API Development",
    "Data Lakes",
    "Version Control (Git)",
    "Scripting",
    "Agile Methodologies",
    "Scrum Framework",
    "Kanban",
    "Project Management Tools (JIRA, Trello)",
    "Facilitation Skills",
    "Conflict Resolution",
    "Stakeholder Management",
    "User Story Mapping",
    "Sprint Planning",
    "Retrospective Facilitation",
    "Coaching Techniques",
    "Risk Management",
  ];
  useEffect(() => {
    const filtered = initialSkills.filter((skill) =>
      skill.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredSkills(filtered);
  }, [search]);
  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);
  const content = (
    <div
      ref={dropdownRef}
      style={{
        position: usePortal ? "fixed" : "absolute",
        top: usePortal ? position?.y || 0 : "100%",
        left: usePortal ? position?.x || 0 : "auto",
        right: usePortal ? "auto" : 10,
        marginTop: usePortal ? 0 : "0.5rem",
        maxHeight: "300px",
        width: "256px",
        zIndex: 99999,
        backgroundColor: "#3C3C3C",
        borderRadius: "0.5rem",
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
        border: "1px solid #515050",
      }}
    >
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full bg-[#3A3A3A] border-b border-[#515050] rounded-t-lg p-2 text-white text-sm focus:outline-none focus:border-emerald-500"
        placeholder="Search skills..."
        autoFocus
      />
      <div className="overflow-y-auto max-h-[250px]">
        {filteredSkills.map((skill, index) => (
          <div
            key={index}
            onClick={() => onSelect(skill)}
            className="p-2 hover:bg-[#A0A0A066] text-white cursor-pointer text-sm transition-colors"
          >
            {skill}
          </div>
        ))}
      </div>
    </div>
  );
  return usePortal ? <Portal>{content}</Portal> : content;
}