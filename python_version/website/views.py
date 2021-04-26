from flask import Blueprint, render_template, request
import signicat_test

views = Blueprint('views', __name__)

@views.route('/', methods=['GET','POST'])
def home():
    is_authenticated = False
    
    if request.form.get('authenticate'):
        global identity
        is_authenticated = True
        identity = signicat_test.get_session()
        print(identity) 
        
    elif request.form.get('display'):
        # signicat.get_session()
        print(identity)
        return render_template('/userData.html',firstname=identity['firstName'], lastname=identity['lastName'], date=identity['dateOfBirth'])
    
    return render_template('home.html', boolean=is_authenticated)
