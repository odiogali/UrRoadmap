


## UrRoadmap - Setup Instructions

This guide explains how to fully set up and run the UrRoadmap project from scratch, including backend, frontend, and database setup.


## 🧹 1. Delete Old Project (Optional)

If you need to delete an old local copy:
```bash
cd ..
rm -rf UrRoadmap
```

---

## 📥 2. Clone the Project

```bash
git clone https://github.com/odiogali/UrRoadmap
cd UrRoadmap
```


## 🛠 3. Install Backend Dependencies

```bash
pip install -r requirements.txt
```

---

## 📦 4. Install Frontend Dependencies

```bash
cd vite-frontend
npm install
```

If you encounter a Vite error:
```bash
npm install vite --save-dev
```

Then return to the root project directory:
```bash
cd ..
```

---

## 📄 5. Create a `.env` File

In the root of your project (same folder as `manage.py`), create a `.env` file:

```
DB_NAME=cpsc471_project
DB_USER=root (or whatever your MySQL login is)
DB_PASSWORD=your personal DB password you set
DB_HOST=localhost
DB_PORT=3306
```

Make sure your `.env` file matches your MySQL settings.

---

## 🗄 6. Import the MySQL Database


### Download and Import the database backup in this repo called backupdb.sql

In MySQL Workbench:
- Go to **Server → Data Import**
- Choose **Import from Self-Contained File** and select the `backupdb.sql` file from your directory
- The import creates the Db for you so no need to do it yourself
- Click **Start Import**

---

## 🔄 7. Run Django Migrations

```bash
python manage.py migrate
```

---

## 🔐 8. Create a Superuser

```bash
python manage.py createsuperuser
```
Follow the prompts to set username, email, and password. MAKE SURE TO NAME THE SUPERUSER admin ALL LOWERCASE. The email and password can be anything.

---

## 🚀 9. Start the Backend Server

```bash
python manage.py runserver
```

---

## 🌐 10. Start the Frontend Server

Open a new terminal:

```bash
cd vite-frontend
npm run dev
```
Click on the link that comes up in your terminal

---

## 🎓 11. Create a Student User

- Navigate to the Django Admin Panel at `http://localhost:8000/admin`
- Log in with the superuser credentials
- Find the **Users** tab
- Click the **+** sign and fill out the fields
- Add view permissions under API
- Now you can login to the student portal

---

