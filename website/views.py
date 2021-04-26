from flask import Blueprint, render_template, request

views = Blueprint('views', __name__)

@views.route('/', methods=['GET','POST'])
def home():
    isAuthenticated = False
    data = request.form
    if data.get('authenticate'):
        isAuthenticated = True
    elif data.get('display'):
        return render_template('/userData.html', user='FullName', date='Date of Birth', phone="phoneNumber", email='Email')
    
    return render_template('home.html', text="Pass in variables", boolean=isAuthenticated)

@views.route('/user-identity')
def user_identity():
    return render_template('userData.html', user='FullName', date='Date of Birth', phone="phoneNumber", email='Email')