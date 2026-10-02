from flask import Blueprint, render_template, redirect, url_for, request, flash, jsonify
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import check_password_hash
from database.models import User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        if current_user.role == 'admin':
            return redirect(url_for('admin.dashboard'))
        return redirect(url_for('student.dashboard'))

    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')

        user = User.query.filter_by(username=username).first()
        if user and check_password_hash(user.password_hash, password):
            if not user.is_active:
                flash('Your account has been deactivated. Please contact admin.', 'danger')
                return redirect(url_for('auth.login'))
                
            login_user(user)
            if user.role == 'admin':
                return redirect(url_for('admin.dashboard'))
            else:
                return redirect(url_for('student.dashboard'))
        else:
            flash('Invalid username or password', 'danger')

    return render_template('auth/login.html')

@auth_bp.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('auth.login'))

@auth_bp.route('/api/login', methods=['POST'])
def api_login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    user = User.query.filter_by(username=username).first()
    if user and check_password_hash(user.password_hash, password):
        if not user.is_active:
            return jsonify({'error': 'Account deactivated.'}), 403
        login_user(user)
        full_name = user.username
        profile_photo = None
        if user.role == 'student' and user.student_profile:
            full_name = user.student_profile.full_name
            profile_photo = user.student_profile.profile_photo
            
        return jsonify({'message': 'Success', 'role': user.role, 'username': user.username, 'full_name': full_name, 'profile_photo': profile_photo})
    return jsonify({'error': 'Invalid credentials'}), 401

@auth_bp.route('/api/me', methods=['GET'])
def api_me():
    if current_user.is_authenticated:
        full_name = current_user.username
        profile_photo = None
        if current_user.role == 'student' and current_user.student_profile:
            full_name = current_user.student_profile.full_name
            profile_photo = current_user.student_profile.profile_photo
            
        return jsonify({
            'authenticated': True,
            'role': current_user.role,
            'username': current_user.username,
            'full_name': full_name,
            'profile_photo': profile_photo
        })
    return jsonify({'authenticated': False}), 401

@auth_bp.route('/api/logout', methods=['POST'])
@login_required
def api_logout():
    logout_user()
    return jsonify({'message': 'Logged out successfully'})
