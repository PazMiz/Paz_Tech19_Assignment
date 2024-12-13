from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy


# Initialize Flask app
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///task_db.sqlite3'  # SQLite database URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = "random string"

# Initialize database
db = SQLAlchemy(app)
# Allow CORS only from your frontend
CORS(app, resources={r"/*": {"origins": "https://earnest-raindrop-60dd48.netlify.app"}})




# Define the Category model
class Category(db.Model):
    __tablename__ = 'categories'
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False, unique=True)
    tasks = relationship('Task', back_populates='category', cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Category(id={self.id}, name='{self.name}')>"

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'tasks': [task.to_dict() for task in self.tasks]
        }

# Define the Task model
class Task(db.Model):
    __tablename__ = 'tasks'
    id = Column(Integer, primary_key=True)
    title = Column(String(100), nullable=False)
    description = Column(String(255))
    completed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    category_id = Column(Integer, ForeignKey('categories.id'))
    category = relationship('Category', back_populates='tasks')

    def __repr__(self):
        return f"<Task(id={self.id}, title='{self.title}', completed={self.completed})>"

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'completed': self.completed,
            'created_at': self.created_at.isoformat(),
            'category': self.category.name if self.category else None
        }

# Route to get all categories
@app.route('/categories', methods=['GET'])
def get_categories():
    try:
        categories = Category.query.all()
        return jsonify([category.to_dict() for category in categories]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Route to create a new category
@app.route('/categories/new', methods=['POST'])
def create_category():
    data = request.get_json()
    if not data or 'name' not in data:
        return jsonify({'error': 'Category name is required'}), 400

    try:
        category = Category(name=data['name'])
        db.session.add(category)
        db.session.commit()
        return jsonify(category.to_dict()), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Route to create a new task
@app.route('/tasks/new', methods=['POST'])
def create_task():
    data = request.get_json()
    if not data or 'title' not in data:
        return jsonify({'error': 'Title is required'}), 400

    try:
        title = data['title']
        description = data.get('description', "")
        category_id = data.get('category_id')

        # Check if category exists
        category = Category.query.get(category_id) if category_id else None
        new_task = Task(title=title, description=description, category=category)
        db.session.add(new_task)
        db.session.commit()
        return jsonify(new_task.to_dict()), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Route to get all tasks
@app.route('/tasks', methods=['GET'])
def get_tasks():
    try:
        tasks = Task.query.all()
        return jsonify([task.to_dict() for task in tasks]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Route to update a task
@app.route('/tasks/update/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    try:
        task = Task.query.get_or_404(task_id)  # Retrieve task or return 404
        data = request.get_json()

        if not data:
            return jsonify({'error': 'No data provided'}), 400

        # Update task fields
        task.title = data.get('title', task.title)
        task.description = data.get('description', task.description)
        task.completed = data.get('completed', task.completed)

        # Update category if provided
        category_id = data.get('category_id')
        if category_id:
            category = Category.query.get(category_id)
            if not category:
                return jsonify({'error': 'Category not found'}), 404
            task.category = category

        db.session.commit()
        return jsonify(task.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Route to delete a task
@app.route('/tasks/delete/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    try:
        task = Task.query.get_or_404(task_id)
        db.session.delete(task)
        db.session.commit()
        return jsonify({'message': 'Task deleted successfully.'}), 204
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Route to get tasks by category
@app.route('/categories/<int:category_id>/tasks', methods=['GET'])
def get_tasks_by_category(category_id):
    try:
        category = Category.query.get_or_404(category_id)
        tasks = [task.to_dict() for task in category.tasks]
        return jsonify(tasks), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Custom error handlers
@app.errorhandler(404)
def not_found_error(error):
    return jsonify({'error': 'Resource not found'}), 404

@app.errorhandler(400)
def bad_request_error(error):
    return jsonify({'error': 'Bad request'}), 400

@app.errorhandler(500)
def internal_server_error(error):
    return jsonify({'error': 'Internal server error'}), 500



# Main entry point
if __name__ == "__main__":
    with app.app_context():
        db.create_all()  # Creates database tables if they don't exist

    app.run(debug=True)
