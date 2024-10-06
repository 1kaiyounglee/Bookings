import sqlite3

connection = sqlite3.connect('holidaybookingsystem.db')

cursor = connection.cursor()

cursor.execute("SELECT * FROM Users")
rows = cursor.fetchall()
print("whole db")
for row in rows:
    print(row)
print("search for jett@gmail.com")
cursor.execute("SELECT * FROM Users WHERE email = 'jett@gmail.com'")
rows = cursor.fetchall()
for row in rows:
    print(row)


connection.close()