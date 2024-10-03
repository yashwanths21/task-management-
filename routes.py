from flask import request, jsonify
from app import app, mysql

# Get all tasks
@app.route('/tasks', methods=['GET'])
def get_tasks():
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM tasks")
    tasks = cur.fetchall()
    cur.close()
    return jsonify(tasks)

# Create a new task
@app.route('/tasks', methods=['POST'])
def create_task():
    data = request.get_json()
    title = data['title']
    description = data['description']
    status = data['status']

    cur = mysql.connection.cursor()
    cur.execute("INSERT INTO tasks (title, description, status) VALUES (%s, %s, %s)", (title, description, status))
    mysql.connection.commit()
    cur.close()

    return jsonify({'message': 'Task created'})

# Update a task
@app.route('/tasks/<int:id>', methods=['PUT'])
def update_task(id):
    data = request.get_json()
    title = data['title']
    description = data['description']
    status = data['status']

    cur = mysql.connection.cursor()
    cur.execute("""
        UPDATE tasks SET title = %s, description = %s, status = %s WHERE id = %s
    """, (title, description, status, id))
    mysql.connection.commit()
    cur.close()

    return jsonify({'message': 'Task updated'})

# Delete a task
@app.route('/tasks/<int:id>', methods=['DELETE'])
def delete_task(id):
    cur = mysql.connection.cursor()
    cur.execute("DELETE FROM tasks WHERE id = %s", (id,))
    mysql.connection.commit()
    cur.close()

    return jsonify({'message': 'Task deleted'})