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