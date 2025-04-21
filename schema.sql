-- Create department table
CREATE TABLE department (
    Dno INT AUTO_INCREMENT PRIMARY KEY,
    Dname VARCHAR(50) NOT NULL,
    Manager_id INT
);

-- Create degree_program table
CREATE TABLE degree_program (
    Prog_name VARCHAR(50) PRIMARY KEY
);

-- Create specialization table
CREATE TABLE specialization (
    SName VARCHAR(50) NOT NULL,
    Prog_name VARCHAR(50) NOT NULL,
    PRIMARY KEY (Prog_name, SName),
    FOREIGN KEY (Prog_name) REFERENCES degree_program (Prog_name)
);

-- Create textbook table
CREATE TABLE textbook (
    ISBN VARCHAR(13) PRIMARY KEY,
    Title VARCHAR(200) NOT NULL,
    Edition_no INT,
    Price FLOAT
);

-- Create course table
CREATE TABLE course (
    Course_code VARCHAR(10) PRIMARY KEY,
    Course_title VARCHAR(50) NOT NULL,
    Textbook_ISBN VARCHAR(13),
    Dno INT NOT NULL,
    FOREIGN KEY (Textbook_ISBN) REFERENCES textbook (ISBN),
    FOREIGN KEY (Dno) REFERENCES department (Dno)
);

-- Create has_as_antireq table
CREATE TABLE has_as_antireq (
    Course_code VARCHAR(10) NOT NULL,
    Antireq_code VARCHAR(10) NOT NULL,
    PRIMARY KEY (Course_code, Antireq_code),
    FOREIGN KEY (Course_code) REFERENCES course (Course_code),
    FOREIGN KEY (Antireq_code) REFERENCES course (Course_code)
);

-- Create has_as_preq table
CREATE TABLE has_as_preq (
    Course_code VARCHAR(10) NOT NULL,
    Prereq_code VARCHAR(10) NOT NULL,
    PRIMARY KEY (Course_code, Prereq_code),
    FOREIGN KEY (Course_code) REFERENCES course (Course_code),
    FOREIGN KEY (Prereq_code) REFERENCES course (Course_code)
);

-- Create student table
CREATE TABLE student (
    Student_id INT PRIMARY KEY,
    Fname VARCHAR(50) NOT NULL,
    Lname VARCHAR(50) NOT NULL
);

-- Create has_taken table
CREATE TABLE has_taken (
    Course_code VARCHAR(10) NOT NULL,
    Student_id INT NOT NULL,
    Course_grade VARCHAR(2),
    Course_status VARCHAR(2),
    PRIMARY KEY (Course_code, Student_id),
    FOREIGN KEY (Course_code) REFERENCES course (Course_code),
    FOREIGN KEY (Student_id) REFERENCES student (Student_id),
    CHECK (Course_grade IN ('A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F')),
    CHECK (Course_status IN ('IP', 'C', 'W', 'F'))
);

-- Create employee table
CREATE TABLE employee (
    EID INT AUTO_INCREMENT PRIMARY KEY,
    Fname VARCHAR(50) NOT NULL,
    Lname VARCHAR(50) NOT NULL,
    Salary INT,
    Dno INT,
    FOREIGN KEY (Dno) REFERENCES department (Dno)
);

-- Create teaching_staff table
CREATE TABLE teaching_staff (
    EID INT PRIMARY KEY,
    FOREIGN KEY (EID) REFERENCES employee (EID)
);

-- Create section table
CREATE TABLE section (
    SCourse_code VARCHAR(10) NOT NULL,
    S_ID INT NOT NULL,
    Semester VARCHAR(6),
    Instructor_id INT,
    PRIMARY KEY (SCourse_code, S_ID),
    FOREIGN KEY (SCourse_code) REFERENCES course (Course_code),
    FOREIGN KEY (Instructor_id) REFERENCES teaching_staff (EID)
);

-- Create admin_staff table
CREATE TABLE admin_staff (
    EID INT PRIMARY KEY,
    FOREIGN KEY (EID) REFERENCES employee (EID)
);

-- Create professor table
CREATE TABLE professor (
    Teaching_id INT PRIMARY KEY,
    Research_area VARCHAR(50) NOT NULL,
    FOREIGN KEY (Teaching_id) REFERENCES teaching_staff (EID)
);

-- Create graduate table
CREATE TABLE graduate (
    Student_id INT PRIMARY KEY,
    Thesis_title VARCHAR(100),
    Research_area VARCHAR(50) NOT NULL,
    Teaching_id INT,
    FOREIGN KEY (Student_id) REFERENCES student (Student_id),
    FOREIGN KEY (Teaching_id) REFERENCES teaching_staff (EID)
);

-- Create undergraduate table
CREATE TABLE undergraduate (
    Student_id INT PRIMARY KEY,
    Credits_completed INT,
    Major VARCHAR(50) NOT NULL DEFAULT 'Computer Science',
    Specialization_Prog_name VARCHAR(50),
    Specialization_SName VARCHAR(50),
    Minor VARCHAR(50),
    FOREIGN KEY (Student_id) REFERENCES student (Student_id),
    FOREIGN KEY (Major) REFERENCES degree_program (Prog_name),
    FOREIGN KEY (Specialization_Prog_name, Specialization_SName) REFERENCES specialization (Prog_name, SName),
    FOREIGN KEY (Minor) REFERENCES degree_program (Prog_name)
);
