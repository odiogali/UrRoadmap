import { useState } from "react";
import { User, BookOpen, Users, GraduationCap, Library } from "lucide-react";
import "./Dashboard.css";
import TabButton from "./components/TabButton";
import StudentForms from "../Students/StudentForms";
import CourseForm from "../Courses/CourseForm";
import FacultyForms from "../Faculty/FacultyForms";
import TextbookForm from "../Textbooks/TextbookForm";
import Textbooks from "../Textbooks/Textbooks";
import Degrees from "../Degrees/Degrees";

// Main Dashboard Component
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("students");

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">University Management System</h1>

      {/* Tab Navigation */}
      <div className="tabs-container">
        <TabButton
          active={activeTab === "students"}
          onClick={() => setActiveTab("students")}
          icon={<User className="icon" />}
          label="Students"
        />
        <TabButton
          active={activeTab === "courses"}
          onClick={() => setActiveTab("courses")}
          icon={<BookOpen className="icon" />}
          label="Courses"
        />
        <TabButton
          active={activeTab === "faculty"}
          onClick={() => setActiveTab("faculty")}
          icon={<Users className="icon" />}
          label="Faculty"
        />
        <TabButton
          active={activeTab === "textbooks"}
          onClick={() => setActiveTab("textbooks")}
          icon={<Library className="icon" />}
          label="Textbooks"
        />
        <TabButton
          active={activeTab === "degrees"}
          onClick={() => setActiveTab("degrees")}
          icon={<GraduationCap className="icon" />}
          label="Degrees"
        />

      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === "students" && <StudentForms />}
        {activeTab === "courses" && <CourseForm />}
        {activeTab === "faculty" && <FacultyForms />}
        {activeTab === "textbooks" && <Textbooks/>}
        {activeTab === "degrees" && <Degrees />}
      </div>
    </div>
  );
}
