import sqlite3

connection = sqlite3.connect('holidaybookingsystem.db')

cursor = connection.cursor()

cursor.execute('''CREATE TABLE IF NOT EXISTS Users(
                    userid INTEGER PRIMARY KEY,
                    email TEXT NOT NULL,
                    password TEXT NOT NULL,
                    is_admin BOOLEAN DEFAULT 0
                  )''')

cursor.executemany("INSERT INTO Users (email, password, is_admin) VALUES (?, ?, ?)", 
                   [
                       ('kai@gmail.com', 'forntie', 0),
                       ('haha@gmail.com', 'skibidi', 1),
                       ('jett@gmail.com', 'yeet', 0)
                   ])

connection.commit()

cursor.execute("SELECT * FROM Users")
rows = cursor.fetchall()
for row in rows:
    print(row)

connection.close()