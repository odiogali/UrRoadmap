-- Create department table
CREATE TABLE department (
    Dno INT AUTO_INCREMENT PRIMARY KEY,
    Dname VARCHAR(50) NOT NULL,
    Manager_id INT
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

-- Create degree_program table
CREATE TABLE degree_program (
    Prog_name VARCHAR(50) PRIMARY KEY
);

-- Create specialization table (simplify to have its own ID)
CREATE TABLE specialization (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sname VARCHAR(50) NOT NULL,
    prog_name VARCHAR(50) NOT NULL,
    UNIQUE KEY (prog_name, sname),
    FOREIGN KEY (prog_name) REFERENCES degree_program (prog_name)
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

-- Create teaching_staff table
CREATE TABLE teaching_staff (
    EID INT PRIMARY KEY,
    FOREIGN KEY (EID) REFERENCES employee (EID)
);

-- Create section table
CREATE TABLE section (
    id INT AUTO_INCREMENT PRIMARY KEY,
    SCourse_code VARCHAR(10) NOT NULL,
    S_ID INT NOT NULL,
    Semester VARCHAR(6),
    Instructor_id INT,
    UNIQUE KEY unique_scourse_sid (SCourse_code, S_ID),
    FOREIGN KEY (SCourse_code) REFERENCES course (Course_code),
    FOREIGN KEY (Instructor_id) REFERENCES teaching_staff (EID)
);
-- Create has_taken table
CREATE TABLE has_taken (
    SCourse_code VARCHAR(10) NOT NULL,
    S_ID INT NOT NULL,
    Student_id INT NOT NULL,
    Course_grade VARCHAR(2) NULL,
    Course_status VARCHAR(2) NULL,
    PRIMARY KEY (SCourse_code, S_ID, Student_id),
    FOREIGN KEY (SCourse_code, S_ID) REFERENCES section(SCourse_code, S_ID),
    FOREIGN KEY (Student_id) REFERENCES student(Student_id)
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

-- Create undergraduate table (simplified specialization reference)
CREATE TABLE undergraduate (
    student_id INT PRIMARY KEY,
    credits_completed INT,
    major VARCHAR(50) NOT NULL DEFAULT 'Computer Science',
    specialization_id INT NULL,
    minor VARCHAR(50) NULL,
    FOREIGN KEY (student_id) REFERENCES student (student_id),
    FOREIGN KEY (major) REFERENCES degree_program (prog_name),
    FOREIGN KEY (specialization_id) REFERENCES specialization (id),
    FOREIGN KEY (minor) REFERENCES degree_program (prog_name)
);
