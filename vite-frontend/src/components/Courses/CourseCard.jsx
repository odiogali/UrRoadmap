import "./CourseCard.css";

function CourseCard({ course }) {
  return (
    <div className="course-card">
      <h3>{course.code}</h3>
      <p className="course-title">{course.title}</p>
      <p className="course-description">{course.description}</p>

      <p className="instructor">
        <strong>Instructor:</strong> {course.instructor || "TBD"}
      </p>

      {course.prerequisites && course.prerequisites.length > 0 ? (
        <div className="prereqs">
          <strong>Prerequisites:</strong> {course.prerequisites.join(", ")}
        </div>
      ) : (
        <p className="prereqs">No prerequisites</p>
      )}

      {course.antirequisites && course.antirequisites.length > 0 ? (
        <div className="antireqs">
          <strong>Antirequisites:</strong> {course.antirequisites.join(", ")}
        </div>
      ) : (
        <p className="antireqs">No antirequisites</p>
      )}
    </div>
  );
}

export default CourseCard;
