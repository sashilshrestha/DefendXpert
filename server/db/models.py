from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class MalwareDetails(db.Model):
    __tablename__ = 'malware_details'
    id = db.Column(db.Integer, primary_key=True)
    behaviour = db.Column(db.Text)
    action = db.Column(db.Text)

class Malware(db.Model):
    __tablename__ = 'malware'
    id = db.Column(db.Integer, primary_key=True)
    malware_class = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.Text, nullable=False)
    threat_level = db.Column(db.String(20), nullable=False)
    confidence = db.Column(db.Integer, nullable=False)
    
    @classmethod
    def get_all(cls):
        return cls.query.all()

class MalwareConfidence(db.Model):
    __tablename__ = 'malware_confidence'
    id = db.Column(db.Integer, primary_key=True)
    confidence = db.Column(db.Integer, nullable=False)


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(512), nullable=False)
    role = db.Column(db.String(50), nullable=False)

    def __repr__(self):
        return f"<User {self.email}>"
    

class MalwareFeedback(db.Model):
    __tablename__ = 'malware_feedback'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer)
    malware_id = db.Column(db.Integer, nullable=False)
    confidence = db.Column(db.Float, nullable=False)
    is_prediction_helpful = db.Column(db.Boolean, nullable=False)
    threshold_at_prediction = db.Column(db.Integer, nullable=False)
    
    @classmethod
    def get_all(cls):
        return cls.query.all()